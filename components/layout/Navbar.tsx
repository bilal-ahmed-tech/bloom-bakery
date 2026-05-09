"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, User, Menu, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import { whatsappLink } from "@/lib/formatting";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const prevPathname = useRef(pathname);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 bg-cream/85 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "shadow-soft border-b border-border"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Bloom Bakery — Go to homepage"
          className="flex shrink-0 items-center gap-2 focus-visible:outline-rose"
        >
          <Image
            src="/icon.svg"
            alt="Bloom Bakery Logo"
            aria-hidden="true"
            width={32}
            height={32}
            className="h-7 w-7 lg:h-8 lg:w-8"
            priority
          />
          <span className="font-display text-xl font-semibold tracking-tight text-cocoa lg:text-2xl">
            Bloom Bakery
          </span>
        </Link>

        {/* Desktop Nav — hidden on mobile */}
        <nav
          className="hidden items-center gap-5 md:flex lg:gap-8"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors focus-visible:outline-rose ${
                  active ? "text-rose" : "text-cocoa/75 hover:text-rose"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
          {/* WhatsApp — lg only */}
          <a
            href={whatsappLink(
              "Hello Bloom Bakery! I'd like to place an order.",
            )}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-rose px-3 text-xs font-medium text-rose transition-colors hover:bg-rose-light focus-visible:outline-rose active:scale-95 lg:inline-flex"
          >
            <MessageCircle
              strokeWidth={1.5}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            WhatsApp
          </a>

          {/* Account */}
          <Link
            href="/account"
            aria-label="My account"
            className="flex h-9 w-9 items-center justify-center rounded-full text-cocoa/80 transition-colors hover:bg-rose-light hover:text-rose focus-visible:outline-rose"
          >
            <User strokeWidth={1.5} className="h-5 w-5" aria-hidden="true" />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Shopping cart, ${count} items`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-cocoa/80 transition-colors hover:bg-rose-light hover:text-rose focus-visible:outline-rose"
          >
            <ShoppingBag
              strokeWidth={1.5}
              className="h-5 w-5"
              aria-hidden="true"
            />
            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold text-cream"
              >
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-cocoa/80 transition-colors hover:bg-rose-light hover:text-rose focus-visible:outline-rose md:hidden"
          >
            {open ? (
              <X strokeWidth={1.5} className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu strokeWidth={1.5} className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer — absolute, full width, slides down */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`absolute left-0 top-16 z-10 w-full bg-cream shadow-soft transition-all duration-300 ease-in-out md:hidden ${
          open
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <nav
          className="border-t border-border px-4 py-4"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-rose ${
                      active
                        ? "bg-rose-light text-rose"
                        : "text-cocoa/80 hover:bg-rose-light hover:text-rose"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-border pt-2">
              <a
                href={whatsappLink("Hello Bloom Bakery!")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-rose px-4 py-2.5 text-sm font-medium text-rose transition-colors hover:bg-rose-light focus-visible:outline-rose"
              >
                <MessageCircle
                  strokeWidth={1.5}
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                WhatsApp Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}