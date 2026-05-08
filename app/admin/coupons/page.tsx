// app/admin/coupons/page.tsx
import { prisma } from "@/lib/prisma"
import AdminCouponsClient from "./AdminCouponsClient"

export const metadata = { title: "Coupons" }

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  })

  const serialized = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    discount: c.discount,
    minOrderPKR: c.minOrderPKR,
    isActive: c.isActive,
    expiresAt: c.expiresAt
      ? new Date(c.expiresAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No expiry",
    createdAt: new Date(c.createdAt).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return <AdminCouponsClient coupons={serialized} />
}