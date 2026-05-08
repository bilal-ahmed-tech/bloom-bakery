"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import {
  useCart,
  removeFromCart,
  updateCartQuantity,
  applyCoupon,
  removeCoupon,
} from "@/lib/cart-store"
import { formatPKR } from "@/lib/formatting"
import { DELIVERY_THRESHOLD, DELIVERY_FEE } from "@/lib/constants"
import { validateCoupon } from "@/lib/actions"
import { getStoreStatus } from "@/lib/admin-actions"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const [fee, setFee] = useState(DELIVERY_FEE)
  const [threshold, setThreshold] = useState(DELIVERY_THRESHOLD)

  useEffect(() => {
    setMounted(true)
    getStoreStatus().then((res) => {
      if (res.deliveryFee !== undefined) setFee(res.deliveryFee)
      if (res.freeDeliveryThreshold !== undefined) setThreshold(res.freeDeliveryThreshold)
    })
  }, [])

  const { items, coupon, subtotal, discountAmount } = useCart()
  const [couponInput, setCouponInput] = useState("")
  const [couponError, setCouponError] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  if (!mounted) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mb-10">
            <div className="h-4 w-24 bg-muted/20 rounded" />
            <div className="mt-3 h-8 w-48 bg-muted/20 rounded" />
            <div className="mt-2 h-4 w-32 bg-muted/20 rounded" />
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-24 w-24 bg-muted/20 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-muted/20 rounded" />
                    <div className="h-5 w-32 bg-muted/20 rounded" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-border p-6 space-y-4">
                <div className="h-6 w-32 bg-muted/20 rounded" />
                <div className="h-10 w-full bg-muted/20 rounded-full" />
                <div className="h-4 w-full bg-muted/20 rounded" />
                <div className="h-12 w-full bg-muted/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const deliveryFee = subtotal >= threshold ? 0 : fee
  const total = subtotal + deliveryFee - discountAmount

  async function handleApplyCoupon() {
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code.")
      return
    }

    setIsValidating(true)
    setCouponError("")

    const result = await validateCoupon(couponInput, subtotal)

    setIsValidating(false)

    if (!result.success) {
      setCouponError(result.error)
      return
    }

    applyCoupon(result.code, result.discount)
    setCouponInput("")
    setCouponError("")
  }

  function handleRemoveCoupon() {
    removeCoupon()
    setCouponInput("")
    setCouponError("")
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingBag
            strokeWidth={1}
            className="h-16 w-16 text-rose-light"
            aria-hidden="true"
          />
          <h1 className="mt-6 font-display text-3xl text-cocoa">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-muted">
            Looks like you haven&apos;t added anything yet.
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
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          Review
        </p>
        <h1 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
          Your Cart
        </h1>
        <p className="mt-2 text-sm text-muted">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.variant}`}
                className="flex gap-4 py-6 sm:gap-6"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                        {item.category}
                      </p>
                      <h3 className="font-display text-lg font-semibold text-cocoa">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="mt-0.5 text-xs text-muted">
                          {item.variant}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.variant)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-muted hover:text-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-full p-1"
                    >
                      <X strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.id, item.variant, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-cocoa transition hover:border-rose hover:text-rose disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                      >
                        <Minus strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <span
                        aria-live="polite"
                        aria-label={`Quantity: ${item.quantity}`}
                        className="w-6 text-center text-sm font-semibold text-cocoa"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.id, item.variant, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-cocoa transition hover:border-rose hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                      >
                        <Plus strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="font-display text-lg font-semibold text-rose">
                      {formatPKR(item.pricePKR * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/shop"
            className="mt-4 inline-flex text-sm text-rose hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
          >
            Continue shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-cream p-6">
            <h2 className="font-display text-2xl text-cocoa">Order Summary</h2>

            {/* Coupon */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
                Coupon Code
              </p>

              {coupon ? (
                <div className="mt-2 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-green-700">
                      {coupon.code}
                    </p>
                    <p className="text-xs text-green-600">
                      {coupon.discount}% off applied
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    aria-label="Remove coupon"
                    className="text-green-500 hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-full p-1"
                  >
                    <X strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase())
                      if (couponError) setCouponError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyCoupon()
                    }}
                    placeholder="e.g. BLOOM10"
                    aria-describedby={couponError ? "coupon-error" : undefined}
                    aria-invalid={!!couponError}
                    className={`flex-1 rounded-full border bg-cream px-4 py-2 text-sm text-cocoa placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose transition ${
                      couponError ? "border-rose bg-rose/5" : "border-border"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidating}
                    className="rounded-full bg-cocoa px-4 py-2 text-xs font-semibold text-cream transition hover:opacity-80 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                  >
                    {isValidating ? (
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
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
              )}

              {couponError && (
                <p
                  id="coupon-error"
                  role="alert"
                  className="mt-2 text-xs text-rose"
                >
                  {couponError}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
              <div className="flex items-center justify-between text-sm text-cocoa/80">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-cocoa/80">
                <span>
                  Delivery{" "}
                  {deliveryFee === 0 && (
                    <span className="text-xs text-green-600">(Free)</span>
                  )}
                </span>
                <span>
                  {deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Discount ({coupon?.code})</span>
                  <span>− {formatPKR(discountAmount)}</span>
                </div>
              )}
              {subtotal < threshold && (
                <p className="text-xs text-muted">
                  Add {formatPKR(threshold - subtotal)} more for free
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

            <Link
              href="/checkout"
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-rose text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-3 text-center text-xs text-muted">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}