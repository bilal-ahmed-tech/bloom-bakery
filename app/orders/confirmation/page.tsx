// app/(shop)/orders/confirmation/page.tsx

import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { formatPKR } from "@/lib/formatting"
import { auth } from "@/auth"

export const metadata = {
  title: "Order Confirmed",
  description: "Your order has been placed successfully.",
}

type Props = {
  searchParams: Promise<{ orderId?: string }>
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const session = await auth()
  const { orderId } = await searchParams

  if (!orderId) notFound()
  if (!session?.user?.id) notFound()

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  })

  if (!order) notFound()

  const placedAt = new Date(order.createdAt).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <main className="mx-auto max-w-lg px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-light">
          <CheckCircle
            strokeWidth={1.5}
            className="h-10 w-10 text-rose"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-6 font-display text-4xl text-cocoa">
          Order Confirmed!
        </h1>
        <p className="mt-3 text-sm text-muted">
          Thank you for your order. We will WhatsApp you when it is out for{" "}
          {order.type === "DELIVERY" ? "delivery" : "pickup"}.
        </p>

        {/* Order details */}
        <div className="mt-8 w-full rounded-2xl border border-border bg-cream p-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
            Order Details
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Order ID</span>
              <span className="font-mono text-xs font-semibold text-amber">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Date</span>
              <span className="font-medium text-cocoa">{placedAt}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Type</span>
              <span className="font-medium text-cocoa capitalize">
                {order.type === "DELIVERY" ? "Delivery" : "Pickup"}
              </span>
            </div>
            {order.timeSlot && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">
                  {order.type === "DELIVERY" ? "Delivery Slot" : "Pickup Slot"}
                </span>
                <span className="font-medium text-cocoa">{order.timeSlot}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Status</span>
              <span className="rounded-full bg-amber-light px-3 py-0.5 text-xs font-semibold text-amber">
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="font-semibold text-cocoa">Total</span>
              <span className="font-display text-lg font-semibold text-rose">
                {formatPKR(order.totalPKR)}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4 w-full rounded-2xl border border-border bg-cream p-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa mb-4">
            Items Ordered
          </p>
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="text-cocoa/80 leading-snug">
                  <span>{item.name}</span>
                  {item.variant && (
                    <span className="block text-xs text-muted">
                      {item.variant}
                    </span>
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
        </div>

        <Link
          href="/shop"
          className="mt-8 inline-flex h-12 items-center rounded-full border border-rose px-8 text-sm font-medium text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  )
}