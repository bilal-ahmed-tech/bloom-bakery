"use client"

// app/admin/coupons/AdminCouponsClient.tsx

import { useState, useTransition } from "react"
import { Plus, Trash2, Pencil, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { createCoupon, toggleCoupon, deleteCoupon, updateCoupon } from "@/lib/admin-actions"

type Coupon = {
  id: string
  code: string
  discount: number
  minOrderPKR: number
  isActive: boolean
  expiresAt: string
  createdAt: string
}

type NewCoupon = {
  code: string
  discount: string
  minOrderPKR: string
  expiresAt: string
}
type NewCouponErrors = Partial<Record<keyof NewCoupon, string>>

function formatExpiryDisplay(dateStr: string | undefined): string {
  if (!dateStr) return "No expiry"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function parseExpiryForInput(expiresAt: string): string {
  if (!expiresAt || expiresAt === "No expiry") return ""
  const date = new Date(expiresAt)
  if (isNaN(date.getTime())) return ""
  return date.toISOString().split("T")[0]
}

export default function AdminCouponsClient({
  coupons: initialCoupons,
}: {
  coupons: Coupon[]
}) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)
  const [form, setForm] = useState<NewCoupon>({
    code: "",
    discount: "",
    minOrderPKR: "",
    expiresAt: "",
  })
  const [errors, setErrors] = useState<NewCouponErrors>({})
  const [isPending, startTransition] = useTransition()
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): NewCouponErrors {
    const e: NewCouponErrors = {}
    if (!form.code.trim()) e.code = "Code is required."
    else if (form.code.trim().length < 3) e.code = "Code must be at least 3 characters."
    if (!form.discount) e.discount = "Discount is required."
    else if (Number(form.discount) < 1 || Number(form.discount) > 100)
      e.discount = "Discount must be between 1 and 100."
    if (form.minOrderPKR && Number(form.minOrderPKR) < 0) {
      e.minOrderPKR = "Minimum order cannot be negative."
    }
    return e
  }

  function openAddModal() {
    setModalMode("add")
    setEditingCoupon(null)
    setForm({ code: "", discount: "", minOrderPKR: "", expiresAt: "" })
    setErrors({})
    setShowModal(true)
  }

  function openEditModal(coupon: Coupon) {
    setModalMode("edit")
    setEditingCoupon(coupon)
    setForm({
      code: coupon.code,
      discount: coupon.discount.toString(),
      minOrderPKR: coupon.minOrderPKR > 0 ? coupon.minOrderPKR.toString() : "",
      expiresAt: parseExpiryForInput(coupon.expiresAt),
    })
    setErrors({})
    setShowModal(true)
  }

  function handleSubmit() {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setIsSubmitting(true)
    startTransition(async () => {
      try {
        if (modalMode === "add") {
          const result = await createCoupon({
            code: form.code.trim(),
            discount: Number(form.discount),
            minOrderPKR: form.minOrderPKR ? Number(form.minOrderPKR) : 0,
            expiresAt: form.expiresAt || undefined,
          })

          setIsSubmitting(false)

          if (!result.success) {
            toast.error(result.error)
            return
          }

          const newCoupon: Coupon = {
            id: result.id,
            code: form.code.trim().toUpperCase(),
            discount: Number(form.discount),
            minOrderPKR: form.minOrderPKR ? Number(form.minOrderPKR) : 0,
            isActive: true,
            expiresAt: formatExpiryDisplay(form.expiresAt),
            createdAt: new Date().toLocaleDateString("en-PK", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          }

          setCoupons((prev) => [newCoupon, ...prev])
          toast.success(`Coupon ${newCoupon.code} created.`)
        } else {
          if (!editingCoupon) return
          const result = await updateCoupon({
            id: editingCoupon.id,
            code: form.code.trim(),
            discount: Number(form.discount),
            minOrderPKR: form.minOrderPKR ? Number(form.minOrderPKR) : 0,
            expiresAt: form.expiresAt || null,
          })

          setIsSubmitting(false)

          if (!result.success) {
            toast.error(result.error)
            return
          }

          const updatedCoupon: Coupon = {
            ...editingCoupon,
            code: form.code.trim().toUpperCase(),
            discount: Number(form.discount),
            minOrderPKR: form.minOrderPKR ? Number(form.minOrderPKR) : 0,
            expiresAt: formatExpiryDisplay(form.expiresAt),
          }

          setCoupons((prev) =>
            prev.map((c) => (c.id === editingCoupon.id ? updatedCoupon : c))
          )
          toast.success(`Coupon ${updatedCoupon.code} updated.`)
        }

        setShowModal(false)
        setForm({ code: "", discount: "", minOrderPKR: "", expiresAt: "" })
        setErrors({})
        setEditingCoupon(null)
      } catch {
        setIsSubmitting(false)
        toast.error("Something went wrong. Please try again.")
      }
    })
  }

  function handleToggle(coupon: Coupon) {
    startTransition(async () => {
      const result = await toggleCoupon(coupon.id, !coupon.isActive)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
      )
    })
  }

  function handleDelete(coupon: Coupon) {
    startTransition(async () => {
      const result = await deleteCoupon(coupon.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id))
      setDeleteTarget(null)
      toast.success("Coupon deleted.")
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Promotions
          </p>
          <h1 className="mt-2 font-display text-3xl text-cocoa sm:text-4xl">
            Coupons
          </h1>
          <p className="mt-1 text-sm text-muted">{coupons.length} coupons</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
        >
          <Plus strokeWidth={2} className="h-4 w-4" aria-hidden="true" />
          Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-cream overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream/80">
                {["Code", "Discount", "Min order", "Expires", "Created", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted">
                    No coupons yet. Create your first one.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="transition hover:bg-rose-light/10">
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-cocoa/5 px-3 py-1.5 font-mono text-sm font-semibold text-cocoa">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-cocoa">
                      {coupon.discount}% off
                    </td>
                    <td className="px-5 py-4 text-cocoa/70">
                      {coupon.minOrderPKR > 0
                        ? `PKR ${coupon.minOrderPKR.toLocaleString("en-PK")}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-cocoa/70">{coupon.expiresAt}</td>
                    <td className="px-5 py-4 text-cocoa/70">{coupon.createdAt}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(coupon)}
                        disabled={isPending}
                        role="switch"
                        aria-checked={coupon.isActive}
                        aria-label={`Toggle ${coupon.code}`}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 disabled:opacity-50 ${
                          coupon.isActive ? "bg-rose" : "bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-cream shadow transition-transform ${
                            coupon.isActive ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(coupon)}
                          aria-label={`Edit ${coupon.code}`}
                          className="text-muted hover:text-cocoa transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm p-1"
                        >
                          <Pencil strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(coupon)}
                          aria-label={`Delete ${coupon.code}`}
                          className="text-muted hover:text-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm p-1"
                        >
                          <Trash2 strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit coupon modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="coupon-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-cocoa/40 backdrop-blur-sm"
            onClick={() => {
              setShowModal(false)
              setErrors({})
              setEditingCoupon(null)
            }}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-cream p-6 shadow-soft">
            <h3
              id="coupon-modal-title"
              className="font-display text-2xl text-cocoa mb-5"
            >
              {modalMode === "add" ? "New Coupon" : "Edit Coupon"}
            </h3>

            <div className="flex flex-col gap-4">
              {[
                { id: "code", label: "Coupon Code", placeholder: "e.g. BLOOM10", type: "text", key: "code" as keyof NewCoupon },
                { id: "discount", label: "Discount (%)", placeholder: "e.g. 10", type: "number", key: "discount" as keyof NewCoupon },
                { id: "min", label: "Minimum Order (PKR, optional)", placeholder: "e.g. 2500", type: "number", key: "minOrderPKR" as keyof NewCoupon },
                { id: "expires", label: "Expiry Date (optional)", placeholder: "", type: "date", key: "expiresAt" as keyof NewCoupon },
              ].map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label htmlFor={field.id} className="text-xs font-semibold text-cocoa">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    value={form[field.key]}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                      setErrors((prev) => ({ ...prev, [field.key]: undefined }))
                    }}
                    placeholder={field.placeholder}
                    aria-invalid={!!errors[field.key]}
                    className={`rounded-xl border bg-cream px-4 py-3 text-sm text-cocoa placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                      errors[field.key] ? "border-rose bg-rose/5" : "border-border"
                    }`}
                  />
                  {errors[field.key] && (
                    <p role="alert" className="flex items-center gap-1.5 text-xs text-rose">
                      <AlertCircle strokeWidth={1.5} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setErrors({})
                  setForm({ code: "", discount: "", minOrderPKR: "", expiresAt: "" })
                  setEditingCoupon(null)
                }}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-cocoa transition hover:border-rose hover:text-rose active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                Cancel
              </button>
          
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-rose py-2.5 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                {isSubmitting
                  ? modalMode === "add"
                    ? "Creating..."
                    : "Updating..."
                  : modalMode === "add"
                  ? "Create Coupon"
                  : "Update Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-cocoa/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-cream p-6 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose/10 mb-4">
              <Trash2 strokeWidth={1.5} className="h-5 w-5 text-rose" aria-hidden="true" />
            </div>
            <h3 id="delete-title" className="font-display text-xl text-cocoa">
              Delete coupon?
            </h3>
            <p className="mt-2 text-sm text-muted">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-cocoa">{deleteTarget.code}</span>?
              This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium text-cocoa transition hover:border-rose hover:text-rose active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTarget)}
                disabled={isPending}
                className="flex-1 rounded-full bg-rose py-2.5 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}