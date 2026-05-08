// app/(shop)/account/page.tsx
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import AccountClient from "./AccountClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Account",
}

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })

  const serializedOrders = orders.map((order) => ({
    id: order.id,
    date: new Date(order.createdAt).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    items: order.items
      .map((item) =>
        item.variant
          ? `${item.name} (${item.variant}) x${item.quantity}`
          : `${item.name} x${item.quantity}`
      )
      .join(", "),
    totalPKR: order.totalPKR,
    status: order.status,
    type: order.type,
    timeSlot: order.timeSlot,
  }))

  return (
    <AccountClient
      orders={serializedOrders}
      user={{
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      }}
    />
  )
}