import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { whatsappLink } from "@/lib/formatting";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Bloom Bakery — call, email, or message us on WhatsApp for orders, custom cakes, and bulk gifting in Karachi.",
};

const contactCards = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+92 300 1234567",
    description: "Fastest replies — usually within minutes.",
    href: whatsappLink("Hi Bloom Bakery! I'd like to place an order."),
    cta: "Chat now",
    external: true,
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+92 300 1234567",
    description: "Daily, 9am – 9pm (Karachi time).",
    href: "tel:+923001234567",
    cta: "Dial",
    external: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@bloombakery.pk",
    description: "For wholesale, press, and partnerships.",
    href: "mailto:hello@bloombakery.pk",
    cta: "Send email",
    external: false,
  },
];

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 9:00 PM" },
  { day: "Saturday", time: "9:00 AM – 10:00 PM" },
  { day: "Sunday", time: "10:00 AM – 8:00 PM" },
];

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="dot-pattern absolute inset-0 opacity-50"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-rose-light blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-14 text-center sm:px-6 md:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Contact
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-cocoa sm:text-6xl">
            We’re a{" "}
            <em className="italic text-rose">message</em> away.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Orders, custom cakes, corporate gifting, or just to say hi —
            here’s every way to reach Bloom Bakery.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {contactCards.map((c) => {
            const Icon = c.icon;
            return (
              <li
                key={c.label}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-cream p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-light text-rose">
                  <Icon
                    strokeWidth={1.7}
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    {c.label}
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-cocoa">
                    {c.value}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {c.description}
                  </p>
                </div>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  className="mt-auto inline-flex h-10 w-fit items-center gap-1.5 rounded-full bg-rose px-5 text-xs font-semibold text-cream transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
                  {c.cta}
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Visit + hours */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-cream p-6 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Visit us
            </p>
            <h2 className="mt-2 font-display text-2xl text-cocoa sm:text-3xl">
              Our little bakery in DHA
            </h2>

            <div className="mt-5 flex items-start gap-3 text-sm text-cocoa/80">
              <MapPin
                strokeWidth={1.5}
                className="mt-0.5 h-5 w-5 shrink-0 text-rose"
                aria-hidden="true"
              />
              <p>
                Khayaban-e-Shahbaz, DHA Phase 6, Karachi, Pakistan
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <iframe
                title="Map showing Bloom Bakery in DHA Phase 6, Karachi"
                src="https://www.google.com/maps?q=DHA+Phase+6+Karachi&output=embed"
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-border bg-cream p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-light text-amber">
                  <Clock
                    strokeWidth={1.7}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
                <p className="font-display text-xl font-semibold text-cocoa">
                  Opening hours
                </p>
              </div>
              <ul className="mt-5 flex flex-col divide-y divide-border">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between py-3 text-sm">
                    <span className="text-cocoa/80">{h.day}</span>
                    <span className="font-semibold text-cocoa">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-cocoa p-6 text-cream">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber/20 text-amber">
                  <Sparkles
                    strokeWidth={1.7}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
                <p className="font-display text-xl font-semibold">
                  Custom orders
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                Birthdays, weddings, corporate gifting — share your idea on
                WhatsApp and we’ll craft it for you.
              </p>
              <a
                href={whatsappLink(
                  "Hi! I'd like to discuss a custom order.",
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-amber px-5 text-sm font-semibold text-cocoa transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa">
                <MessageCircle
                  strokeWidth={1.5}
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Start a chat
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-cream p-6">
              <p className="font-display text-lg font-semibold text-cocoa">
                Prefer to browse first?
              </p>
              <p className="mt-2 text-sm text-muted">
                Have a look at our full menu and order online.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full border border-rose px-5 text-xs font-semibold text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                Visit shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
