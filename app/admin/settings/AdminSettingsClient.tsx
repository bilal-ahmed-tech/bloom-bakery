"use client"

// app/admin/settings/AdminSettingsClient.tsx

import { useState, useTransition } from "react"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { saveSettings } from "@/lib/admin-actions"

type Settings = {
  isOpen: boolean
  freeDeliveryThreshold: string
  deliveryFee: string
  cutoffTime: string
  announcementActive: boolean
  announcementText: string
}

export default function AdminSettingsClient({
  initialSettings,
}: {
  initialSettings: Settings
}) {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [isPending, startTransition] = useTransition()

  function update(field: keyof Settings, value: string | boolean) {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveSettings({
        isOpen: settings.isOpen,
        freeDeliveryThreshold: Number(settings.freeDeliveryThreshold),
        deliveryFee: Number(settings.deliveryFee),
        cutoffTime: settings.cutoffTime,
        announcementActive: settings.announcementActive,
        announcementText: settings.announcementText,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Settings saved successfully.")
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          Configuration
        </p>
        <h1 className="mt-2 font-display text-3xl text-cocoa sm:text-4xl">
          Store Settings
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store status */}
        <div className="rounded-2xl border border-border bg-cream p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa mb-5">
            Store Status
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cocoa">Store Open</p>
              <p className="mt-0.5 text-xs text-muted">
                Toggle to open or close the store for orders.
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("isOpen", !settings.isOpen)}
              role="switch"
              aria-checked={settings.isOpen}
              aria-label="Toggle store open/closed"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 ${
                settings.isOpen ? "bg-rose" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-cream shadow transition-transform ${
                  settings.isOpen ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {!settings.isOpen && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose/5 border border-rose/20 px-4 py-3 text-xs text-rose">
              <AlertCircle strokeWidth={1.5} className="h-4 w-4 shrink-0" aria-hidden="true" />
              Store is currently closed. Customers cannot place orders.
            </div>
          )}
        </div>

        {/* Delivery settings */}
        <div className="rounded-2xl border border-border bg-cream p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa mb-5">
            Delivery Rules
          </p>
          <div className="flex flex-col gap-4">
            {[
              { id: "threshold", label: "Free Delivery Threshold (PKR)", key: "freeDeliveryThreshold" as keyof Settings, type: "number" },
              { id: "fee", label: "Delivery Fee (PKR)", key: "deliveryFee" as keyof Settings, type: "number" },
              { id: "cutoff", label: "Same-day Order Cutoff Time", key: "cutoffTime" as keyof Settings, type: "time" },
            ].map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label htmlFor={field.id} className="text-xs font-semibold text-cocoa">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={settings[field.key] as string}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="rounded-xl border border-border bg-cream px-4 py-3 text-sm text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Announcement banner */}
        <div className="rounded-2xl border border-border bg-cream p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa mb-5">
            Announcement Banner
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cocoa">
                  Show Announcement
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Display a banner at the top of the store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => update("announcementActive", !settings.announcementActive)}
                role="switch"
                aria-checked={settings.announcementActive}
                aria-label="Toggle announcement banner"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 ${
                  settings.announcementActive ? "bg-rose" : "bg-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-cream shadow transition-transform ${
                    settings.announcementActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {settings.announcementActive && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="announcement" className="text-xs font-semibold text-cocoa">
                  Announcement Text
                </label>
                <input
                  id="announcement"
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => update("announcementText", e.target.value)}
                  placeholder="e.g. Free delivery this weekend on all orders!"
                  className="rounded-xl border border-border bg-cream px-4 py-3 text-sm text-cocoa placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex h-11 items-center gap-2 rounded-full bg-rose px-8 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </button>
        <p className="text-xs text-muted">
          Changes will be applied immediately across the store.
        </p>
      </div>
    </div>
  )
}