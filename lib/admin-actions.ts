"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { sanityClient } from "@/lib/sanity"
import { revalidatePath } from "next/cache"

// ─── GUARD ────────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || !session.user.isAdmin) {
    throw new Error("Unauthorized")
  }
  return session
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED"

type ActionResult =
  | { success: true }
  | { success: false; error: string }

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
    revalidatePath("/admin/orders")
    revalidatePath("/admin")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update order status." }
  }
}

// ─── COUPONS ──────────────────────────────────────────────────────────────────

type CreateCouponInput = {
  code: string
  discount: number
  minOrderPKR?: number
  expiresAt?: string
}

type CreateCouponResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createCoupon(
  input: CreateCouponInput
): Promise<CreateCouponResult> {
  try {
    await requireAdmin()

    const existing = await prisma.coupon.findUnique({
      where: { code: input.code.toUpperCase() },
    })

    if (existing) {
      return { success: false, error: "A coupon with this code already exists." }
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: input.code.toUpperCase(),
        discount: input.discount,
        minOrderPKR: input.minOrderPKR ?? 0,
        isActive: true,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    })

    revalidatePath("/admin/coupons")
    return { success: true, id: coupon.id }
  } catch {
    return { success: false, error: "Failed to create coupon." }
  }
}

export async function toggleCoupon(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.coupon.update({ where: { id }, data: { isActive } })
    revalidatePath("/admin/coupons")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to toggle coupon." }
  }
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.coupon.delete({ where: { id } })
    revalidatePath("/admin/coupons")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to delete coupon." }
  }
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

type SaveSettingsInput = {
  isOpen: boolean
  freeDeliveryThreshold: number
  deliveryFee: number
  cutoffTime: string
  announcementActive: boolean
  announcementText: string
}

export async function saveSettings(
  input: SaveSettingsInput
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.storeSettings.upsert({
      where: { id: "singleton" },
      update: {
        isOpen: input.isOpen,
        freeDeliveryThreshold: input.freeDeliveryThreshold,
        deliveryFee: input.deliveryFee,
        cutoffTime: input.cutoffTime,
        announcementActive: input.announcementActive,
        announcementText: input.announcementText,
      },
      create: {
        id: "singleton",
        isOpen: input.isOpen,
        freeDeliveryThreshold: input.freeDeliveryThreshold,
        deliveryFee: input.deliveryFee,
        cutoffTime: input.cutoffTime,
        announcementActive: input.announcementActive,
        announcementText: input.announcementText,
      },
    })
    revalidatePath("/admin/settings")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to save settings." }
  }
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function toggleProductStock(
  productId: string,
  inStock: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await sanityClient.patch(productId).set({ inStock }).commit()
    revalidatePath("/admin/products")
    revalidatePath("/shop")
    revalidatePath("/")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to update product stock." }
  }
}
type UpdateCouponInput = {
  id: string
  code: string
  discount: number
  minOrderPKR: number
  expiresAt: string | null
}

export async function updateCoupon(input: UpdateCouponInput): Promise<ActionResult> {
  try {
    await requireAdmin()

    // Prevent duplicate codes (case‑insensitive, excluding the current coupon)
    const existing = await prisma.coupon.findFirst({
      where: {
        code: { equals: input.code.toUpperCase(), mode: 'insensitive' },
        id: { not: input.id },
      },
    })
    if (existing) {
      return { success: false, error: 'A coupon with this code already exists.' }
    }

    // Update the coupon
    await prisma.coupon.update({
      where: { id: input.id },
      data: {
        code: input.code.toUpperCase(),
        discount: input.discount,
        minOrderPKR: input.minOrderPKR,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    })

    revalidatePath('/admin/coupons')
    return { success: true }
  } catch (error) {
    console.error('Update coupon failed:', error)
    return { success: false, error: 'Failed to update coupon.' }
  }
}
export async function getStoreStatus(): Promise<{
  success: boolean
  isOpen?: boolean
  deliveryFee?: number
  freeDeliveryThreshold?: number
  error?: string
}> {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "singleton" },
      select: { isOpen: true, deliveryFee: true, freeDeliveryThreshold: true },
    })
    if (!settings) return { success: false, error: "Store settings not found." }
    return {
      success: true,
      isOpen: settings.isOpen,
      deliveryFee: settings.deliveryFee,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
    }
  } catch {
    return { success: false, error: "Could not check store status." }
  }
}