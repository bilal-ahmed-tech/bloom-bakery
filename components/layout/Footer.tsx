import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { whatsappLink } from "@/lib/formatting";

const quickLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-cocoa text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/icon.svg"
              alt="Bloom Bakery Logo"
              aria-hidden="true"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <p className="font-display text-2xl font-semibold">Bloom Bakery</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Freshly baked with love in Karachi. Hand-crafted cakes, pastries,
            and breads delivered across the city.
          </p>
          <a
            href={whatsappLink("Hello Bloom Bakery!")}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-medium text-cocoa transition-colors hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber">
            <MessageCircle
              strokeWidth={1.5}
              className="h-4 w-4"
              aria-hidden="true"
            />
            Chat on WhatsApp
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber">
            Quick Links
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-cream/80 hover:text-amber transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber">
            Contact
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            <li className="flex items-start gap-3 text-sm text-cream/80">
              <MapPin
                strokeWidth={1.5}
                className="mt-0.5 h-4 w-4 shrink-0 text-amber"
                aria-hidden="true"
              />
              Khayaban-e-Shahbaz, DHA Phase 6, Karachi
            </li>
            <li className="flex items-center gap-3 text-sm text-cream/80">
              <Phone
                strokeWidth={1.5}
                className="h-4 w-4 shrink-0 text-amber"
                aria-hidden="true"
              />
              +92 300 1234567
            </li>
            <li className="flex items-center gap-3 text-sm text-cream/80">
              <Mail
                strokeWidth={1.5}
                className="h-4 w-4 shrink-0 text-amber"
                aria-hidden="true"
              />
              hello@bloombakery.pk
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Bloom Bakery. All rights reserved.</p>
          <p>Karachi, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
