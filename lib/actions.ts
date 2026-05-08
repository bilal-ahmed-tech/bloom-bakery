"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Resend } from "resend"
import OrderConfirmationEmail from "@/components/emails/OrderConfirmationEmail"
import { sanityFetch } from "@/lib/sanity"
import Stripe from "stripe"

const resend = new Resend(process.env.RESEND_API_KEY)
const stripe =
  process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-04-22.dahlia" })
    : null
// This PKR conversion rate is only used for a rough USD estimate on the client side and is not critical to be accurate. The server will always calculate the authoritative total based on current product prices.
const PKR_PER_USD = 278
// To prevent abuse, we enforce a maximum quantity per line item.
const MAX_QTY_PER_LINE_ITEM = 10
// To prevent accidental double submissions, we enforce a short cooldown between orders.
const ORDER_RATE_LIMIT_WINDOW_MS = 60_000

// ─── PLACE ORDER ─────────────────────────────────────────────────────────────

type CartItem = {
  id: string
  name: string
  variant?: string
  quantity: number
  pricePKR: number
  priceUSD: number
}

type PlaceOrderInput = {
  items: CartItem[]
  totalPKR: number // client-calculated; server will re-validate
  totalUSD: number // client-calculated; server will re-validate
  type: "DELIVERY" | "PICKUP"
  timeSlot?: string
  notes?: string
  couponCode?: string
  discount?: number
  stripePaymentIntentId?: string
  deliveryCity?: string
}

type PlaceOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string }

type StoreSettings = {
  isOpen: boolean
  freeDeliveryThreshold: number
  deliveryFee: number
  cutoffTime: string
}

function normalizeCoupon(code: string) {
  return code.trim().toUpperCase()
}

function normalizeCity(city: string) {
  return city.trim().toLowerCase()
}

function parseCutoffTime(value: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!m) return null
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null
  if (hour < 0 || hour > 23) return null
  if (minute < 0 || minute > 59) return null
  return { hour, minute }
}

function getKarachiTimeParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0")
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0")
  return { hour, minute }
}

function isAfterCutoff(now: Date, cutoff: { hour: number; minute: number }) {
  const t = getKarachiTimeParts(now)
  if (t.hour > cutoff.hour) return true
  if (t.hour < cutoff.hour) return false
  return t.minute >= cutoff.minute
}

async function getStoreSettings(): Promise<StoreSettings> {
  const s = await prisma.storeSettings.findUnique({ where: { id: "singleton" } })
  return {
    isOpen: s?.isOpen ?? true,
    freeDeliveryThreshold: s?.freeDeliveryThreshold ?? 2000,
    deliveryFee: s?.deliveryFee ?? 250,
    cutoffTime: s?.cutoffTime ?? "14:00",
  }
}

export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in to place an order." }
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Your cart is empty." }
    }

    const settings = await getStoreSettings()

    if (!settings.isOpen) {
      return {
        success: false,
        error: "Store is currently closed. Please try again later.",
      }
    }

    const cutoff = parseCutoffTime(settings.cutoffTime)
    if (cutoff && isAfterCutoff(new Date(), cutoff)) {
      return {
        success: false,
        error: `Online orders are closed for today. Please order before ${settings.cutoffTime}.`,
      }
    }

    if (input.type === "DELIVERY") {
      const city = input.deliveryCity ? normalizeCity(input.deliveryCity) : ""
      if (!city) {
        return { success: false, error: "Delivery city is required." }
      }
      if (city !== "karachi") {
        return {
          success: false,
          error: "Delivery is currently available in Karachi only.",
        }
      }
    }

    // Idempotency by payment intent id (prevents accidental double submissions)
    if (input.stripePaymentIntentId) {
      const existing = await prisma.order.findFirst({
        where: { stripePaymentIntentId: input.stripePaymentIntentId },
        select: { id: true },
      })
      if (existing) return { success: true, orderId: existing.id }
    }

    // Simple duplicate order rate-limit
    const recent = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(Date.now() - ORDER_RATE_LIMIT_WINDOW_MS) },
      },
      select: { id: true },
    })
    if (recent) {
      return {
        success: false,
        error: "You’re placing orders too quickly. Please wait a moment and try again.",
      }
    }

    // Fetch authoritative product data from Sanity
    const ids = Array.from(new Set(input.items.map((i) => i.id)))
    const products = await sanityFetch<
      Array<{
        _id: string
        name: string
        pricePKR: number
        priceUSD: number
        inStock: boolean
        variants: string[] | null
      }>
    >(
      `*[_type == "product" && _id in $ids]{
        _id,
        name,
        pricePKR,
        priceUSD,
        inStock,
        "variants": variants[].name
      }`,
      { ids: ids as unknown as string },
    )

    const productById = new Map(products.map((p) => [p._id, p]))

    for (const item of input.items) {
      if (!Number.isFinite(item.quantity) || item.quantity < 1) {
        return { success: false, error: "Invalid item quantity." }
      }
      if (item.quantity > MAX_QTY_PER_LINE_ITEM) {
        return {
          success: false,
          error: `Max quantity per item is ${MAX_QTY_PER_LINE_ITEM}.`,
        }
      }

      const p = productById.get(item.id)
      if (!p) {
        return { success: false, error: "One of the items is no longer available." }
      }
      if (!p.inStock) {
        return { success: false, error: `${p.name} is out of stock.` }
      }
      if (item.variant && p.variants?.length) {
        if (!p.variants.includes(item.variant)) {
          return { success: false, error: `Invalid variant selected for ${p.name}.` }
        }
      }
    }

    const serverItems = input.items.map((item) => {
      const p = productById.get(item.id)!
      return {
        productId: item.id,
        name: p.name,
        variant: item.variant ?? null,
        quantity: Math.floor(item.quantity),
        pricePKR: p.pricePKR,
        priceUSD: p.priceUSD,
      }
    })

    const subtotalPKR = serverItems.reduce((sum, i) => sum + i.pricePKR * i.quantity, 0)
    const deliveryFeePKR =
      input.type === "DELIVERY" && subtotalPKR < settings.freeDeliveryThreshold
        ? settings.deliveryFee
        : 0

    let couponCode: string | null = null
    let couponDiscountPercent = 0
    let discountPKR = 0

    if (input.couponCode) {
      const code = normalizeCoupon(input.couponCode)
      const coupon = await prisma.coupon.findUnique({ where: { code } })
      if (!coupon) return { success: false, error: "Invalid coupon code." }
      if (!coupon.isActive) return { success: false, error: "This coupon is no longer active." }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return { success: false, error: "This coupon has expired." }
      }
      if (coupon.minOrderPKR > 0 && subtotalPKR < coupon.minOrderPKR) {
        return {
          success: false,
          error: `Minimum order for this coupon is PKR ${coupon.minOrderPKR}.`,
        }
      }

      couponCode = coupon.code
      couponDiscountPercent = coupon.discount
      discountPKR = Math.round(subtotalPKR * (coupon.discount / 100))
    }

    const totalPKR = Math.max(0, subtotalPKR + deliveryFeePKR - discountPKR)
    const totalUSD = parseFloat((totalPKR / PKR_PER_USD).toFixed(2))

    // Client totals re-validation (detect stale cart/pricing)
    if (Math.abs(input.totalPKR - totalPKR) > 1) {
      return {
        success: false,
        error: "Your cart total has changed. Please refresh the checkout page and try again.",
      }
    }

    // Verify payment intent matches the server total
    if (input.stripePaymentIntentId && stripe) {
      const pi = await stripe.paymentIntents.retrieve(input.stripePaymentIntentId)
      if (pi.status !== "succeeded") {
        return { success: false, error: "Payment is not completed. Please try again." }
      }
      const expectedCents = Math.round(totalUSD * 100)
      if (pi.amount !== expectedCents) {
        return {
          success: false,
          error: "Payment amount does not match your cart total. Please try again.",
        }
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPKR,
        totalUSD,
        type: input.type,
        timeSlot: input.timeSlot ?? null,
        notes: input.notes ?? null,
        couponCode,
        discount: discountPKR,
        status: "PENDING",
        items: {
          create: serverItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            variant: item.variant,
            quantity: item.quantity,
            pricePKR: item.pricePKR,
            priceUSD: item.priceUSD,
          })),
        },
        stripePaymentIntentId: input.stripePaymentIntentId ?? null,
      },
    })

    // Send confirmation email — non-blocking
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    })

    if (user?.email) {
      try {
        await resend.emails.send({
          from: "Bloom Bakery <onboarding@resend.dev>",
          to: user.email,
          subject: `Order Confirmed — ${order.id.slice(0, 8).toUpperCase()}`,
          react: OrderConfirmationEmail({
            customerName: user.name ?? "Customer",
            orderId: order.id,
            items: serverItems.map((item) => ({
              name: item.name,
              variant: item.variant,
              quantity: item.quantity,
              pricePKR: item.pricePKR,
            })),
            totalPKR,
            type: input.type,
            timeSlot: input.timeSlot,
          }),
        })
      } catch (emailErr) {
        // Never block a successful order due to email failure
        console.error("[placeOrder] email failed:", emailErr)
      }
    }

    return { success: true, orderId: order.id }
  } catch (err) {
    console.error("[placeOrder]", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

// ─── VALIDATE COUPON ──────────────────────────────────────────────────────────

type CouponResult =
  | { success: true; discount: number; code: string }
  | { success: false; error: string }

export async function validateCoupon(
  code: string,
  subtotalPKR: number
): Promise<CouponResult> {
  if (!code.trim()) {
    return { success: false, error: "Please enter a coupon code." }
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  })

  if (!coupon) {
    return { success: false, error: "Invalid coupon code." }
  }

  if (!coupon.isActive) {
    return { success: false, error: "This coupon is no longer active." }
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { success: false, error: "This coupon has expired." }
  }

  if (coupon.minOrderPKR > 0 && subtotalPKR < coupon.minOrderPKR) {
    return {
      success: false,
      error: `Minimum order for this coupon is PKR ${coupon.minOrderPKR}.`,
    }
  }

  return { success: true, discount: coupon.discount, code: coupon.code }
}

// ─── CANCEL ORDER ─────────────────────────────────────────────────────────────

type CancelOrderResult =
  | { success: true }
  | { success: false; error: string }

export async function cancelOrder(orderId: string): Promise<CancelOrderResult> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized." }
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return { success: false, error: "Order not found." }
    }

    if (order.userId !== session.user.id) {
      return { success: false, error: "Unauthorized." }
    }

    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      return {
        success: false,
        error: "This order can no longer be cancelled.",
      }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    })

    return { success: true }
  } catch (err) {
    console.error("[cancelOrder]", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}