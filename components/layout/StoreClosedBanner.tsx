"use client"

import { useEffect, useState } from "react"
import { getStoreStatus } from "@/lib/admin-actions"
import { AlertTriangle, X } from "lucide-react"

export default function StoreClosedBanner() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    getStoreStatus().then((res) => {
      if (res.success && typeof res.isOpen === "boolean") {
        setIsOpen(res.isOpen)
      } else {
        setIsOpen(false) // fail closed
      }
    })
  }, [])

  if (isOpen === null || isOpen === true || dismissed) return null

  return (
    <div className="bg-rose text-cream text-sm py-2.5 px-4 flex items-center justify-center gap-2 relative">
      <AlertTriangle
        strokeWidth={1.5}
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      />
      <span>
        We’re currently closed. You can still browse and add items to your cart. Orders will be accepted when we reopen.
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 text-cream/70 hover:text-cream transition"
      >
        <X strokeWidth={1.5} className="h-4 w-4" />
      </button>
    </div>
  )
}