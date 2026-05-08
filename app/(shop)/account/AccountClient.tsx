"use client"

// app/(shop)/account/AccountClient.tsx

import { useState, useTransition } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  User,
  ShoppingBag,
  LogOut,
  Check,
  Package,
  AlertCircle,
  ChevronRight,
  XCircle,
} from "lucide-react"
import { formatPKR } from "@/lib/formatting"
import { ORDER_STATUS_CONFIG } from "@/lib/constants"
import { cancelOrder } from "@/lib/actions"
import { toast } from "sonner"

type Tab = "orders" | "profile"

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED"

type Order = {
  id: string
  date: string
  items: string
  totalPKR: number
  status: OrderStatus
  type: "DELIVERY" | "PICKUP"
  timeSlot: string | null
}

type Props = {
  orders: Order[]
  user: { name: string; email: string }
}

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED"]

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-cocoa">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`rounded-xl border bg-cream px-4 py-3 text-sm text-cocoa placeholder:text-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
          error ? "border-rose bg-rose/5" : "border-border"
        }`}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-rose"
        >
          <AlertCircle
            strokeWidth={1.5}
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          {error}
        </p>
      )}
    </div>
  )
}

export default function AccountClient({ orders: initialOrders, user }: Props) {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("orders")
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name ?? user.name,
    email: session?.user?.email ?? user.email,
  })
  const [profileErrors, setProfileErrors] = useState<{
    name?: string
    email?: string
  }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null)
  const [isPending, startTransition] = useTransition()

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <svg
            className="h-8 w-8 animate-spin text-rose"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      </main>
    )
  }

  if (status === "unauthenticated") return null

  function validateProfile() {
    const errors: { name?: string; email?: string } = {}
    if (!profileForm.name.trim()) {
      errors.name = "Name is required."
    } else if (profileForm.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters."
    }
    if (!profileForm.email.trim()) {
      errors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = "Enter a valid email address."
    }
    return errors
  }

  async function handleSaveProfile() {
    const errors = validateProfile()
    setProfileErrors(errors)
    if (Object.keys(errors).length > 0) return
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    await update({ name: profileForm.name })
    setIsSaving(false)
    toast.success("Profile updated successfully.")
  }

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push("/")
  }

  function handleConfirmCancel() {
    if (!cancelTarget) return

    startTransition(async () => {
      const result = await cancelOrder(cancelTarget.id)
      setCancelTarget(null)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      // Optimistically update order status in UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === cancelTarget.id ? { ...o, status: "CANCELLED" } : o
        )
      )

      toast.success("Order cancelled successfully.")
    })
  }

  const displayName = session?.user?.name ?? user.name
  const displayEmail = session?.user?.email ?? user.email

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const navItems = [
    {
      tab: "orders" as Tab,
      label: "My Orders",
      icon: ShoppingBag,
      count: orders.length,
    },
    { tab: "profile" as Tab, label: "Profile", icon: User },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          My Account
        </p>
        <h1 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
          Welcome back,{" "}
          <span className="text-rose italic">{displayName.split(" ")[0]}</span>
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-cream p-6">
              <div
                aria-hidden="true"
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-light/60"
              />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-light ring-4 ring-cream">
                  <span className="font-display text-2xl font-semibold text-rose">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-cocoa">{displayName}</p>
                  <p className="mt-0.5 text-xs text-muted">{displayEmail}</p>
                </div>
              </div>
            </div>

            <nav
              aria-label="Account navigation"
              className="rounded-2xl border border-border bg-cream overflow-hidden"
            >
              <ul className="flex flex-col divide-y divide-border">
                {navItems.map(({ tab, label, icon: Icon, count }) => (
                  <li key={tab}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-inset ${
                        activeTab === tab
                          ? "bg-rose-light text-rose"
                          : "text-cocoa/80 hover:bg-rose-light/40 hover:text-rose"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </span>
                      <span className="flex items-center gap-2">
                        {count !== undefined && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              activeTab === tab
                                ? "bg-rose text-cream"
                                : "bg-border text-muted"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                        <ChevronRight
                          strokeWidth={1.5}
                          className="h-3.5 w-3.5 opacity-40"
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium text-cocoa/70 transition hover:bg-rose/5 hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-inset"
                  >
                    <LogOut strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Orders tab */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-cocoa">My Orders</h2>
                <span className="text-xs text-muted">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-cream py-24 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-light">
                    <Package strokeWidth={1.5} className="h-8 w-8 text-rose" aria-hidden="true" />
                  </div>
                  <p className="mt-5 font-display text-2xl text-cocoa">No orders yet</p>
                  <p className="mt-2 text-sm text-muted">
                    Your order history will appear here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => {
                    const config = ORDER_STATUS_CONFIG[order.status]
                    const canCancel = CANCELLABLE_STATUSES.includes(order.status)

                    return (
                      <article
                        key={order.id}
                        className="rounded-2xl border border-border bg-cream p-6 transition hover:shadow-soft"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-mono text-sm font-semibold text-cocoa">
                                {order.id.slice(0, 8).toUpperCase()}
                              </p>
                              <span
                                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                                  aria-hidden="true"
                                />
                                {config.label}
                              </span>
                              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                                {order.type === "DELIVERY" ? "Delivery" : "Pickup"}
                              </span>
                            </div>
                            <p className="text-xs text-muted">{order.date}</p>
                            {order.timeSlot && (
                              <p className="text-xs text-muted">
                                Slot: {order.timeSlot}
                              </p>
                            )}
                          </div>
                          <p className="font-display text-xl font-semibold text-rose">
                            {formatPKR(order.totalPKR)}
                          </p>
                        </div>

                        <div className="mt-4 rounded-xl border border-border/60 bg-cream/80 px-4 py-3">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                            Items
                          </p>
                          <p className="text-sm leading-relaxed text-cocoa/80">
                            {order.items}
                          </p>
                        </div>

                        {/* Cancel button */}
                        {canCancel && (
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setCancelTarget(order)}
                              className="flex items-center gap-1.5 rounded-full border border-rose/30 px-4 py-2 text-xs font-medium text-rose transition hover:border-rose hover:bg-rose/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                            >
                              <XCircle
                                strokeWidth={1.5}
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Profile tab */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-2xl text-cocoa">Profile</h2>

              <div className="rounded-2xl border border-border bg-cream p-6">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
                  Personal Information
                </p>
                <div className="flex flex-col gap-5">
                  <InputField
                    id="profile-name"
                    label="Full Name"
                    value={profileForm.name}
                    onChange={(v) => {
                      setProfileForm((prev) => ({ ...prev, name: v }))
                      setProfileErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    placeholder="Ayesha Khan"
                    error={profileErrors.name}
                  />
                  <InputField
                    id="profile-email"
                    label="Email Address"
                    type="email"
                    value={profileForm.email}
                    onChange={(v) => {
                      setProfileForm((prev) => ({ ...prev, email: v }))
                      setProfileErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    placeholder="ayesha@example.com"
                    error={profileErrors.email}
                  />
                  <div className="flex items-center gap-3 border-t border-border pt-5">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex h-11 items-center justify-center gap-2 rounded-full bg-rose px-6 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check strokeWidth={2} className="h-4 w-4" aria-hidden="true" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <p className="text-xs text-muted">
                      Changes will be reflected immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-rose/20 bg-rose/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose mb-1">
                  Danger Zone
                </p>
                <p className="text-sm text-cocoa/70 mb-4">
                  Once you sign out, you will need to log in again to access your account.
                </p>
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 rounded-full border border-rose px-5 py-2.5 text-sm font-medium text-rose transition hover:bg-rose hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                >
                  <LogOut strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel order confirmation modal */}
      {cancelTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-cocoa/40 backdrop-blur-sm"
            onClick={() => setCancelTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-cream p-6 shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose/10">
              <XCircle strokeWidth={1.5} className="h-5 w-5 text-rose" aria-hidden="true" />
            </div>
            <h3 id="cancel-title" className="font-display text-xl text-cocoa">
              Cancel order?
            </h3>
            <p className="mt-2 text-sm text-muted">
              Are you sure you want to cancel order{" "}
              <span className="font-mono font-semibold text-cocoa">
                {cancelTarget.id.slice(0, 8).toUpperCase()}
              </span>
              ? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={isPending}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-cocoa transition hover:border-rose hover:text-rose active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isPending}
                className="flex-1 rounded-full bg-rose py-2.5 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                {isPending ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-cocoa/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-cream p-6 shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose/10">
              <LogOut strokeWidth={1.5} className="h-5 w-5 text-rose" aria-hidden="true" />
            </div>
            <h3 id="logout-title" className="font-display text-xl text-cocoa">
              Sign out?
            </h3>
            <p className="mt-2 text-sm text-muted">
              Are you sure you want to sign out of your Bloom Bakery account?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-cocoa transition hover:border-rose hover:text-rose active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-full bg-rose py-2.5 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}