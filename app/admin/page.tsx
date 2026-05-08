// app/admin/page.tsx
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Tag,
  ArrowUpRight,
} from "lucide-react"
import RevenueChart, {
  type RevenuePoint,
} from "@/components/admin/RevenueChart"
import RecentOrders from "@/components/admin/RecentOrders"
import { prisma } from "@/lib/prisma"
import { formatPKR } from "@/lib/formatting"

export const metadata = { title: "Dashboard" }

const REVENUE_DAYS = 30

export default async function AdminDashboardPage() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const startOfRange = new Date(startOfToday)
  startOfRange.setDate(startOfRange.getDate() - (REVENUE_DAYS - 1))

  const [
    totalRevenue,
    ordersToday,
    totalCustomers,
    activeCoupons,
    recentOrders,
    rangeOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { totalPKR: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
    }),
    prisma.user.count(),
    prisma.coupon.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: startOfRange },
        status: { not: "CANCELLED" },
      },
      select: { createdAt: true, totalPKR: true },
    }),
  ])

  const revenueByDay = new Map<string, number>()
  for (let i = 0; i < REVENUE_DAYS; i++) {
    const d = new Date(startOfRange)
    d.setDate(d.getDate() + i)
    revenueByDay.set(toDayKey(d), 0)
  }

  for (const o of rangeOrders) {
    const key = toDayKey(o.createdAt)
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + (o.totalPKR ?? 0))
  }

  const revenueSeries: RevenuePoint[] = Array.from(revenueByDay.entries()).map(
    ([key, revenue]) => {
      const [y, m, d] = key.split("-").map(Number)
      const date = new Date(y, m - 1, d)
      return {
        date: key,
        label: date.toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
        }),
        revenue,
      }
    },
  )

  const revenueRangeTotal = revenueSeries.reduce((s, p) => s + p.revenue, 0)

  const stats = [
    {
      label: "Total Revenue",
      value: formatPKR(totalRevenue._sum.totalPKR ?? 0),
      icon: TrendingUp,
      bg: "bg-rose-light",
      iconColor: "text-rose",
    },
    {
      label: "Orders Today",
      value: String(ordersToday),
      icon: ShoppingBag,
      bg: "bg-amber-light",
      iconColor: "text-amber",
    },
    {
      label: "Total Customers",
      value: String(totalCustomers),
      icon: Users,
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Active Coupons",
      value: String(activeCoupons),
      icon: Tag,
      bg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
  ]

  const serializedOrders = recentOrders.map((o) => ({
    id: o.id,
    customer: o.user.name,
    total: o.totalPKR,
    status: o.status,
    date: new Date(o.createdAt).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
    }),
  }))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          Overview
        </p>
        <h1 className="mt-2 font-display text-3xl text-cocoa sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          {now.toLocaleDateString("en-PK", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-cream p-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <Icon
                    strokeWidth={1.5}
                    className={`h-5 w-5 ${stat.iconColor}`}
                    aria-hidden="true"
                  />
                </div>
                <ArrowUpRight
                  strokeWidth={2}
                  className="h-3.5 w-3.5 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 font-display text-2xl font-semibold text-cocoa">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Chart + Recent orders */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart
            data={revenueSeries}
            total={revenueRangeTotal}
            rangeLabel={`Last ${REVENUE_DAYS} Days`}
          />
        </div>
        <div className="xl:col-span-1">
          <RecentOrders orders={serializedOrders} />
        </div>
      </div>
    </div>
  )
}

function toDayKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}