// components/admin/RecentOrders.tsx
// Accepts real orders as props from the server dashboard page.

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED"

type Order = {
  id: string
  customer: string
  total: number
  status: OrderStatus
  date: string
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-light text-amber" },
  CONFIRMED: { label: "Confirmed", className: "bg-blue-50 text-blue-600" },
  PREPARING: { label: "Preparing", className: "bg-purple-50 text-purple-600" },
  READY: { label: "Ready", className: "bg-teal-50 text-teal-600" },
  DELIVERED: { label: "Delivered", className: "bg-green-50 text-green-600" },
  CANCELLED: { label: "Cancelled", className: "bg-rose/10 text-rose" },
}

function formatPKR(amount: number) {
  return `PKR ${new Intl.NumberFormat("en-PK", { minimumFractionDigits: 0 }).format(amount)}`
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-2xl border border-border bg-cream p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Latest
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-cocoa">
            Recent Orders
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">No orders yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-cocoa">
                  {order.customer}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-xs text-muted">
                    {order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-muted">·</span>
                  <span className="text-xs text-muted">{order.date}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <p className="text-sm font-semibold text-cocoa">
                  {formatPKR(order.total)}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    statusConfig[order.status].className
                  }`}
                >
                  {statusConfig[order.status].label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}