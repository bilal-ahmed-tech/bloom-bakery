"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight, Truck, Store, Clock, Lock, AlertTriangle, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { useCart, clearCart, removeCoupon } from "@/lib/cart-store"
import { formatPKR } from "@/lib/formatting"
import {
  DELIVERY_FEE,
  DELIVERY_THRESHOLD,
  DELIVERY_TIME_SLOTS,
  PICKUP_TIME_SLOTS,
} from "@/lib/constants"
import {
  validateDeliveryForm,
  validatePickupForm,
  type DeliveryForm,
  type PickupForm,
  type DeliveryErrors,
  type PickupErrors,
} from "@/lib/validation"
import { FieldError, InputField } from "@/components/ui/FormComponents"
import { placeOrder } from "@/lib/actions"
import { getStoreStatus } from "@/lib/admin-actions"
import { toast } from "sonner"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

type OrderType = "delivery" | "pickup"

async function fetchStoreStatus(): Promise<{
  isOpen: boolean
  fee: number
  threshold: number
}> {
  const res = await getStoreStatus()
  return {
    isOpen: res.success && typeof res.isOpen === "boolean" ? res.isOpen : false,
    fee: res.deliveryFee ?? DELIVERY_FEE,
    threshold: res.freeDeliveryThreshold ?? DELIVERY_THRESHOLD,
  }
}

// ─── INNER FORM (needs Stripe context) ────────────────────────────────────────

function CheckoutForm({
  total,
  totalUSD,
  computedDeliveryFee,
  deliveryThreshold,
  orderType,
  setOrderType,
  deliveryForm,
  pickupForm,
  updateDelivery,
  updatePickup,
  deliveryErrors,
  pickupErrors,
  setSubmitted,
  setDeliveryErrors,
  setPickupErrors,
  isStoreOpen,
}: {
  total: number
  totalUSD: number
  computedDeliveryFee: number
  deliveryThreshold: number
  orderType: OrderType
  setOrderType: (t: OrderType) => void
  deliveryForm: DeliveryForm
  pickupForm: PickupForm
  updateDelivery: (field: keyof DeliveryForm, value: string) => void
  updatePickup: (field: keyof PickupForm, value: string) => void
  deliveryErrors: DeliveryErrors
  pickupErrors: PickupErrors
  setSubmitted: (v: boolean) => void
  setDeliveryErrors: React.Dispatch<React.SetStateAction<DeliveryErrors>>
  setPickupErrors: React.Dispatch<React.SetStateAction<PickupErrors>>
  isStoreOpen: boolean | null
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { items, subtotal, coupon, discountAmount } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  async function handlePlaceOrder() {
    setSubmitted(true)

    if (orderType === "delivery") {
      const errors = validateDeliveryForm(deliveryForm)
      setDeliveryErrors(errors)
      if (Object.keys(errors).length > 0) return
    } else {
      const errors = validatePickupForm(pickupForm)
      setPickupErrors(errors)
      if (Object.keys(errors).length > 0) return
    }

    if (!isStoreOpen) {
      toast.error("The store is currently closed. Please try again later.")
      return
    }

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please try again.")
      return
    }

    const card = elements.getElement(CardElement)
    if (!card) return

    setIsProcessing(true)
    setCardError(null)

    try {
      const res = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUSD: totalUSD }),
      })

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.")
        setIsProcessing(false)
        router.push("/login?next=/checkout")
        return
      }

      const { clientSecret, error: intentError } = await res.json()

      if (intentError || !clientSecret) {
        toast.error("Failed to initialize payment. Please try again.")
        setIsProcessing(false)
        return
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card },
        })

      if (stripeError) {
        setCardError(stripeError.message ?? "Payment failed.")
        setIsProcessing(false)
        return
      }

      if (paymentIntent?.status !== "succeeded") {
        setCardError("Payment was not successful. Please try again.")
        setIsProcessing(false)
        return
      }

      const notes =
        orderType === "delivery"
          ? `${deliveryForm.address}, ${deliveryForm.city} — ${deliveryForm.phone}`
          : `Pickup — ${pickupForm.phone}`

      const result = await placeOrder({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          pricePKR: item.pricePKR,
          priceUSD: item.priceUSD,
        })),
        totalPKR: total,
        totalUSD,
        type: orderType === "delivery" ? "DELIVERY" : "PICKUP",
        timeSlot:
          orderType === "delivery"
            ? deliveryForm.timeSlot
            : pickupForm.timeSlot,
        notes,
        deliveryCity: orderType === "delivery" ? deliveryForm.city : undefined,
        couponCode: coupon?.code,
        discount: discountAmount,
        stripePaymentIntentId: paymentIntent.id,
      })

      setIsProcessing(false)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      clearCart()
      removeCoupon()
      router.push(`/orders/confirmation?orderId=${result.orderId}`)
    } catch (error: unknown) {
      console.error("Checkout error:", error)
      toast.error("Something went wrong. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {/* Left — Form */}
      <div className="flex flex-col gap-8 lg:col-span-2">
        {/* Order type toggle */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
            Order Type
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOrderType("delivery")}
              className={`flex items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                orderType === "delivery"
                  ? "border-rose bg-rose-light text-rose"
                  : "border-border text-cocoa/70 hover:border-rose hover:text-rose"
              }`}
            >
              <Truck strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setOrderType("pickup")}
              className={`flex items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                orderType === "pickup"
                  ? "border-rose bg-rose-light text-rose"
                  : "border-border text-cocoa/70 hover:border-rose hover:text-rose"
              }`}
            >
              <Store strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
              Pickup
            </button>
          </div>
        </div>

        {/* Delivery form */}
        {orderType === "delivery" && (
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-cream p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
              Delivery Details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                id="d-name"
                label="Full Name"
                value={deliveryForm.name}
                onChange={(v) => updateDelivery("name", v)}
                placeholder="Ayesha Khan"
                error={deliveryErrors.name}
              />
              <InputField
                id="d-phone"
                label="Phone Number"
                type="tel"
                value={deliveryForm.phone}
                onChange={(v) => updateDelivery("phone", v)}
                placeholder="0300 1234567"
                error={deliveryErrors.phone}
              />
              <div className="sm:col-span-2">
                <InputField
                  id="d-address"
                  label="Delivery Address"
                  value={deliveryForm.address}
                  onChange={(v) => updateDelivery("address", v)}
                  placeholder="House 12, Street 4, DHA Phase 6"
                  error={deliveryErrors.address}
                />
              </div>
              <InputField
                id="d-city"
                label="City"
                value={deliveryForm.city}
                onChange={(v) => updateDelivery("city", v)}
                placeholder="Karachi"
                error={deliveryErrors.city}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-cocoa">
                <Clock strokeWidth={1.5} className="h-3.5 w-3.5" aria-hidden="true" />
                Delivery Time Slot
              </label>
              <div className="flex flex-wrap gap-2">
                {DELIVERY_TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => updateDelivery("timeSlot", slot)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                      deliveryForm.timeSlot === slot
                        ? "border-rose bg-rose text-cream"
                        : "border-border text-cocoa hover:border-rose hover:text-rose"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <FieldError message={deliveryErrors.timeSlot} />
            </div>
          </div>
        )}

        {/* Pickup form */}
        {orderType === "pickup" && (
          <div className="flex flex-col gap-5 rounded-2xl border border-border bg-cream p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
                Pickup Details
              </p>
              <p className="mt-1.5 text-xs text-muted">
                Pickup from: Khayaban-e-Shahbaz, DHA Phase 6, Karachi
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                id="p-name"
                label="Full Name"
                value={pickupForm.name}
                onChange={(v) => updatePickup("name", v)}
                placeholder="Ayesha Khan"
                error={pickupErrors.name}
              />
              <InputField
                id="p-phone"
                label="Phone Number"
                type="tel"
                value={pickupForm.phone}
                onChange={(v) => updatePickup("phone", v)}
                placeholder="0300 1234567"
                error={pickupErrors.phone}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-cocoa">
                <Clock strokeWidth={1.5} className="h-3.5 w-3.5" aria-hidden="true" />
                Pickup Time Slot
              </label>
              <div className="flex flex-wrap gap-2">
                {PICKUP_TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => updatePickup("timeSlot", slot)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                      pickupForm.timeSlot === slot
                        ? "border-rose bg-rose text-cream"
                        : "border-border text-cocoa hover:border-rose hover:text-rose"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <FieldError message={pickupErrors.timeSlot} />
            </div>
          </div>
        )}

        {/* Payment — Stripe Card Element */}
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-cream p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
              Payment
            </p>
            <span className="flex items-center gap-1 text-xs text-muted">
              <Lock strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
              Secured by Stripe
            </span>
          </div>

          <div
            className={`rounded-xl border bg-white px-4 py-3.5 transition ${
              cardError ? "border-rose" : "border-border"
            }`}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "14px",
                    color: "#1c0a00",
                    fontFamily: "DM Sans, sans-serif",
                    "::placeholder": { color: "#a09080" },
                  },
                  invalid: { color: "#f43f5e" },
                },
              }}
              onChange={() => {
                if (cardError) setCardError(null)
              }}
            />
          </div>

          {cardError && (
            <p role="alert" className="text-xs text-rose">
              {cardError}
            </p>
          )}

          <p className="text-xs text-muted">
            Test card:{" "}
            <span className="font-mono font-medium text-cocoa">
              4242 4242 4242 4242
            </span>{" "}
            — any future date, any CVC
          </p>
        </div>
      </div>

      {/* Right — Order summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-border bg-cream p-6">
          <h2 className="font-display text-2xl text-cocoa">Order Summary</h2>

          {coupon && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
              <p className="text-xs font-semibold text-green-700">
                {coupon.code} — {coupon.discount}% off
              </p>
            </div>
          )}

          <ul className="mt-5 flex flex-col gap-3 border-b border-border pb-5">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.variant}`}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="text-cocoa/80 leading-snug">
                  <span>{item.name}</span>
                  {item.variant && (
                    <span className="block text-xs text-muted">{item.variant}</span>
                  )}
                  <span className="block text-xs text-muted">
                    Qty: {item.quantity}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-cocoa">
                  {formatPKR(item.pricePKR * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm text-cocoa/80">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-cocoa/80">
              <span>Delivery</span>
              <span>
                {computedDeliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPKR(computedDeliveryFee)
                )}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Discount ({coupon?.code})</span>
                <span>− {formatPKR(discountAmount)}</span>
              </div>
            )}
            {orderType === "delivery" &&
              subtotal < deliveryThreshold &&
              computedDeliveryFee > 0 && (
                <p className="text-xs text-muted">
                  Add {formatPKR(deliveryThreshold - subtotal)} more for free
                  delivery.
                </p>
              )}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-semibold text-cocoa">Total</span>
              <span className="font-display text-xl font-semibold text-rose">
                {formatPKR(total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isProcessing || !stripe || !isStoreOpen}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            {isProcessing ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Lock strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                Pay {formatPKR(total)}
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-muted">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE WRAPPER (provides Stripe context) ───────────────────────────────────

export default function CheckoutPage() {
  const { items, subtotal, discountAmount } = useCart()
  const [orderType, setOrderType] = useState<OrderType>("delivery")

  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
    name: "",
    phone: "",
    address: "",
    city: "",
    timeSlot: "",
  })

  const [pickupForm, setPickupForm] = useState<PickupForm>({
    name: "",
    phone: "",
    timeSlot: "",
  })

  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({})
  const [pickupErrors, setPickupErrors] = useState<PickupErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const [isStoreOpen, setIsStoreOpen] = useState<boolean | null>(null)
  const [checkingStore, setCheckingStore] = useState(true)
  // Fallback defaults — real values fetched from StoreSettings on mount.
  // Only used if the DB fetch fails.
  const [fee, setFee] = useState(DELIVERY_FEE)
  const [threshold, setThreshold] = useState(DELIVERY_THRESHOLD)

  useEffect(() => {
    fetchStoreStatus().then((result) => {
      setIsStoreOpen(result.isOpen)
      setFee(result.fee)
      setThreshold(result.threshold)
      setCheckingStore(false)
    })
  }, [])

  const computedDeliveryFee =
    orderType === "pickup"
      ? 0
      : subtotal >= threshold
        ? 0
        : fee

  const total = subtotal + computedDeliveryFee - discountAmount
  // TODO: replace with a live rate or store setting before production
  const totalUSD = parseFloat((total / 278).toFixed(2))

  const updateDelivery = useCallback(
    (field: keyof DeliveryForm, value: string) => {
      setDeliveryForm((prev) => ({ ...prev, [field]: value }))
      if (submitted) {
        const updated = { ...deliveryForm, [field]: value }
        setDeliveryErrors(validateDeliveryForm(updated))
      }
    },
    [deliveryForm, submitted]
  )

  const updatePickup = useCallback(
    (field: keyof PickupForm, value: string) => {
      setPickupForm((prev) => ({ ...prev, [field]: value }))
      if (submitted) {
        const updated = { ...pickupForm, [field]: value }
        setPickupErrors(validatePickupForm(updated))
      }
    },
    [pickupForm, submitted]
  )

  if (checkingStore) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 flex flex-col items-center justify-center text-center">
        <Loader2
          strokeWidth={1.5}
          className="h-8 w-8 text-rose animate-spin mb-4"
          aria-hidden="true"
        />
        <p className="text-sm text-muted">Loading checkout…</p>
      </main>
    )
  }

  if (isStoreOpen === false) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="flex flex-col items-center">
          <AlertTriangle
            className="h-12 w-12 text-rose mb-4"
            aria-hidden="true"
          />
          <h1 className="font-display text-3xl text-cocoa">
            We&apos;re currently closed
          </h1>
          <p className="mt-3 text-sm text-muted">
            You can still browse, but ordering is paused. Come back during
            opening hours!
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-rose px-8 text-sm font-medium text-cream transition hover:opacity-90"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-3xl text-cocoa">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-muted">
            Add some items before checking out.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-rose px-8 text-sm font-medium text-cream transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            Browse the Shop
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-xs text-muted"
      >
        <Link
          href="/cart"
          className="hover:text-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
        >
          Cart
        </Link>
        <ChevronRight strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
        <span className="text-cocoa font-medium">Checkout</span>
      </nav>

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          Almost there
        </p>
        <h1 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
          Checkout
        </h1>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          total={total}
          totalUSD={totalUSD}
          computedDeliveryFee={computedDeliveryFee}
          deliveryThreshold={threshold}
          orderType={orderType}
          setOrderType={setOrderType}
          deliveryForm={deliveryForm}
          pickupForm={pickupForm}
          updateDelivery={updateDelivery}
          updatePickup={updatePickup}
          deliveryErrors={deliveryErrors}
          pickupErrors={pickupErrors}
          setSubmitted={setSubmitted}
          setDeliveryErrors={setDeliveryErrors}
          setPickupErrors={setPickupErrors}
          isStoreOpen={isStoreOpen}
        />
      </Elements>
    </main>
  )
}