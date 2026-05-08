"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  BadgeCheck,
  Ban,
  ChevronDown,
  ChevronRight,
  Clock,
  Receipt,
  Search,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/admin-actions";
import { formatPKR } from "@/lib/formatting";
import {ORDER_STATUS_CONFIG} from "@/lib/constants";
type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

type OrderItem = {
  id: string;
  name: string;
  variant: string | null;
  quantity: number;
  pricePKR: number;
};

type Order = {
  id: string;
  customer: string;
  email: string;
  totalPKR: number;
  status: OrderStatus;
  type: "DELIVERY" | "PICKUP";
  timeSlot: string | null;
  notes: string | null;
  couponCode: string | null;
  discount: number;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-light text-amber",
    dot: "bg-amber",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  PREPARING: {
    label: "Preparing",
    className: "bg-purple-50 text-purple-600",
    dot: "bg-purple-500",
  },
  READY: {
    label: "Ready",
    className: "bg-teal-50 text-teal-600",
    dot: "bg-teal-500",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-50 text-green-600",
    dot: "bg-green-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose/10 text-rose",
    dot: "bg-rose",
  },
};

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatOrderId(orderId: string) {
  return orderId.slice(0, 8).toUpperCase();
}

function BrandSelect<T extends string>({
  value,
  onChange,
  options,
  getLabel,
  menuLabel = "Select",
}: {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  getLabel: (value: T) => string;
  menuLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeIndex = Math.max(0, options.indexOf(value));

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-full border bg-cream px-3 py-2 text-xs font-semibold text-cocoa shadow-[0_1px_0_rgba(0,0,0,0.02)] transition",
          "border-border hover:border-rose/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose",
        )}>
        <span className="truncate">{getLabel(value)}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted transition",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-cream shadow-soft">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {menuLabel}
            </p>
          </div>
          <div className="h-px bg-border" aria-hidden="true" />
          <div role="listbox" className="p-2">
            {options.map((opt, idx) => {
              const selected = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                    selected
                      ? "bg-rose text-cream"
                      : "text-cocoa hover:bg-rose-light/10",
                    idx === activeIndex && "outline-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose",
                  )}>
                  <span className="truncate font-semibold">{getLabel(opt)}</span>
                  {selected && (
                    <BadgeCheck
                      className="h-4 w-4 shrink-0 text-cream"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusFilterSelect({
  value,
  onChange,
}: {
  value: OrderStatus | "ALL";
  onChange: (value: OrderStatus | "ALL") => void;
}) {
  return (
    <BrandSelect<OrderStatus | "ALL">
      value={value}
      onChange={onChange}
      options={["ALL", ...ALL_STATUSES]}
      getLabel={(v) => (v === "ALL" ? "All statuses" : STATUS_CONFIG[v].label)}
      menuLabel="Status"
    />
  );
}

function OrderStatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: OrderStatus;
  onChange: (value: OrderStatus) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn(disabled && "pointer-events-none opacity-60")}>
      <BrandSelect<OrderStatus>
        value={value}
        onChange={onChange}
        options={ALL_STATUSES}
        getLabel={(v) => STATUS_CONFIG[v].label}
        menuLabel="Status"
      />
    </div>
  );
}

export default function AdminOrdersClient({
  orders: initialOrders,
}: {
  orders: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const byStatus = orders.reduce(
      (acc, o) => {
        acc[o.status] += 1;
        return acc;
      },
      {
        PENDING: 0,
        CONFIRMED: 0,
        PREPARING: 0,
        READY: 0,
        DELIVERED: 0,
        CANCELLED: 0,
      } as Record<OrderStatus, number>,
    );

    const revenuePKR = orders.reduce((sum, o) => sum + (o.totalPKR ?? 0), 0);
    const inProgress = byStatus.CONFIRMED + byStatus.PREPARING + byStatus.READY;

    return {
      total: orders.length,
      revenuePKR,
      byStatus,
      inProgress,
    };
  }, [orders]);

  function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      setUpdatingId(null);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }

      toast.success(`Order updated to ${STATUS_CONFIG[newStatus].label}`);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Admin
          </p>
          <h1 className="mt-2 font-display text-3xl text-cocoa sm:text-4xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted">
            {stats.total} total · {formatPKR(stats.revenuePKR)} revenue
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-3 py-1.5 text-xs font-semibold text-cocoa">
            <Clock className="h-3.5 w-3.5 text-amber" aria-hidden="true" />
            Pending <span className="text-muted">({stats.byStatus.PENDING})</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-3 py-1.5 text-xs font-semibold text-cocoa">
            <Receipt className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
            In progress <span className="text-muted">({stats.inProgress})</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-3 py-1.5 text-xs font-semibold text-cocoa">
            <Truck className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
            Delivered{" "}
            <span className="text-muted">({stats.byStatus.DELIVERED})</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-3 py-1.5 text-xs font-semibold text-cocoa">
            <Ban className="h-3.5 w-3.5 text-rose" aria-hidden="true" />
            Cancelled{" "}
            <span className="text-muted">({stats.byStatus.CANCELLED})</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-cream p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              strokeWidth={1.5}
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, or order ID..."
              className="w-full rounded-full border border-border bg-cream py-2.5 pl-10 pr-10 text-sm text-cocoa placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
            />
            {search.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                <X strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <StatusFilterSelect value={statusFilter} onChange={setStatusFilter} />

            {(search.trim().length > 0 || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="rounded-full border border-border bg-cream px-3 py-2 text-xs font-semibold text-cocoa/80 transition hover:border-rose hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-cocoa">{filtered.length}</span>{" "}
            of <span className="font-semibold text-cocoa">{orders.length}</span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {statusFilter !== "ALL" && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                  STATUS_CONFIG[statusFilter].className,
                )}>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    STATUS_CONFIG[statusFilter].dot,
                  )}
                  aria-hidden="true"
                />
                {STATUS_CONFIG[statusFilter].label}
              </span>
            )}
            {search.trim().length > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-cream px-3 py-1.5 text-xs font-semibold text-cocoa">
                <span className="text-muted">Query</span>
                <span className="font-mono">{search.trim()}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-cream">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream/80">
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Type",
                  "Total",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm text-muted">
                    No orders found for your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const config = STATUS_CONFIG[order.status];
                  const nextStatus = NEXT_STATUS[order.status];
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="cursor-pointer transition hover:bg-rose-light/10"
                      onClick={() => setSelectedOrder(order)}>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-semibold text-cocoa">
                          {formatOrderId(order.id)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-cocoa">
                          {order.customer}
                        </p>
                        <p className="text-xs text-muted">{order.email}</p>
                      </td>
                      <td className="px-5 py-4 text-cocoa/70">
                        {order.createdAt}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                          {order.type === "DELIVERY" ? "Delivery" : "Pickup"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-cocoa">
                        {formatPKR(order.totalPKR)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}>
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                            aria-hidden="true"
                          />
                          {config.label}
                        </span>
                      </td>
                      <td
                        className="px-5 py-4"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {nextStatus ? (
                            <button
                              type="button"
                              disabled={isUpdating || isPending}
                              onClick={() =>
                                handleStatusChange(order.id, nextStatus)
                              }
                              className="inline-flex items-center gap-1.5 rounded-full border border-rose px-3 py-1.5 text-xs font-semibold text-rose transition hover:bg-rose hover:text-cream disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                              {isUpdating ? (
                                "Updating…"
                              ) : (
                                <>
                                  Next
                                  <ChevronRight
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                  {STATUS_CONFIG[nextStatus].label}
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                          <span className="hidden text-muted sm:inline">
                            <ChevronRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-cocoa/40 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-cream p-6 shadow-soft">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-muted">
                  {formatOrderId(selectedOrder.id)}
                </p>
                <h3
                  id="order-detail-title"
                  className="font-display text-2xl text-cocoa">
                  {selectedOrder.customer}
                </h3>
                <p className="text-xs text-muted">{selectedOrder.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close"
                className="text-muted hover:text-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-full p-1">
                <X strokeWidth={1.5} className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Status + change */}
            <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[selectedOrder.status].className}`}>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[selectedOrder.status].dot}`}
                    aria-hidden="true"
                  />
                  {STATUS_CONFIG[selectedOrder.status].label}
                </span>

                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                  {selectedOrder.type === "DELIVERY" ? "Delivery" : "Pickup"}
                </span>

                {selectedOrder.couponCode && (
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                    Coupon{" "}
                    <span className="font-mono font-semibold text-cocoa">
                      {selectedOrder.couponCode}
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <BadgeCheck
                  className="h-4 w-4 text-muted"
                  aria-hidden="true"
                />
                <OrderStatusSelect
                  value={selectedOrder.status}
                  disabled={isPending}
                  onChange={(newStatus) =>
                    handleStatusChange(selectedOrder.id, newStatus)
                  }
                />
              </div>
            </div>

            {/* Details */}
            <div className="mb-5 grid gap-3 rounded-2xl border border-border bg-cream/50 p-4 sm:grid-cols-2">
              {selectedOrder.timeSlot && (
                <div className="rounded-xl border border-border bg-cream p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Time slot
                  </p>
                  <p className="mt-1 text-sm font-semibold text-cocoa">
                    {selectedOrder.timeSlot}
                  </p>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="rounded-xl border border-border bg-cream p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Notes
                  </p>
                  <p className="mt-1 text-sm font-medium text-cocoa">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
              {selectedOrder.couponCode && (
                <div className="rounded-xl border border-border bg-cream p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Discount
                  </p>
                  <p className="mt-1 text-sm font-semibold text-cocoa">
                    −{formatPKR(selectedOrder.discount)}
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-border bg-cream p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Date
                </p>
                <p className="mt-1 text-sm font-semibold text-cocoa">
                  {selectedOrder.createdAt}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                Items
              </p>
              <ul className="flex flex-col gap-2">
                {selectedOrder.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-border bg-cream/50 px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-cocoa">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.variant ? `${item.variant} · ` : ""}
                        Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-cocoa">
                      {formatPKR(item.pricePKR * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold text-cocoa">Total</span>
              <span className="font-display text-xl font-semibold text-rose">
                {formatPKR(selectedOrder.totalPKR)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}