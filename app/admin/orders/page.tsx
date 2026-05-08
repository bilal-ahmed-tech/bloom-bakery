// app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma"
import AdminOrdersClient from "./AdminOrdersClient"

export const metadata = { title: "Orders" }

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  })

  const serialized = orders.map((o) => ({
    id: o.id,
    customer: o.user.name,
    email: o.user.email,
    totalPKR: o.totalPKR,
    status: o.status,
    type: o.type,
    timeSlot: o.timeSlot,
    notes: o.notes,
    couponCode: o.couponCode,
    discount: o.discount,
    createdAt: new Date(o.createdAt).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    items: o.items.map((item) => ({
      id: item.id,
      name: item.name,
      variant: item.variant,
      quantity: item.quantity,
      pricePKR: item.pricePKR,
    })),
  }))

  return <AdminOrdersClient orders={serialized} />
}