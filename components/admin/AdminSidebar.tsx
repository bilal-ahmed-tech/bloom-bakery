"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Tag,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <Image
          src="/icon.svg"
          alt=""
          aria-hidden="true"
          width={28}
          height={28}
          className="h-7 w-7"
        />
        <div>
          <p className="font-display text-lg font-semibold text-cream">
            Bloom Bakery
          </p>
          <p className="text-[10px] text-cream/50 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 ${
                    active
                      ? "bg-white/15 text-cream"
                      : "text-cream/60 hover:bg-white/10 hover:text-cream"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      strokeWidth={1.5}
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {label}
                  </span>
                  {active && (
                    <ChevronRight
                      strokeWidth={1.5}
                      className="h-3.5 w-3.5 opacity-60"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <Link
          href="/"
          className="text-xs text-cream/40 hover:text-cream/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
        >
          ← Back to store
        </Link>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 absolute inset-y-0  bg-cocoa lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open admin menu"
        className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-cocoa text-cream shadow-soft lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
      >
        <Menu strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-cocoa/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-cocoa">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close admin menu"
              className="absolute right-4 top-4 text-cream/60 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm"
            >
              <X strokeWidth={1.5} className="h-5 w-5" aria-hidden="true" />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}