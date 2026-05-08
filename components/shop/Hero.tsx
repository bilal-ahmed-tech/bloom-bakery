import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MessageCircle, Star } from "lucide-react"

function whatsappLink(message: string) {
  return `https://wa.me/923001234567?text=${encodeURIComponent(message)}`
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background decorations */}
      <div aria-hidden="true" className="dot-pattern absolute inset-0 opacity-50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-rose-light blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-light blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-18 pt-14 sm:px-6 md:grid-cols-2 md:gap-14 md:py-24 lg:px-8 lg:py-28">

        {/* Left — Text */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Freshly baked daily
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] text-cocoa sm:text-6xl md:text-7xl">
            Baked with{" "}
            <em className="not-italic text-rose">
              <span className="italic">love</span>
            </em>
            <br className="hidden sm:block" />
            {" "}&amp; care
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            From our oven in Karachi to your table — small-batch cakes, French
            pastries, and sourdough breads, hand-crafted by our bakers each
            morning.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-rose px-7 text-sm font-medium text-cream shadow-warm transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
            >
              Order Now
              <ArrowRight
                strokeWidth={1.5}
                className="h-4 w-4 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href={whatsappLink("Hi Bloom Bakery! I'd like to place an order.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-rose px-7 text-sm font-medium text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
            >
              <MessageCircle strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
              WhatsApp Us
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-cocoa/10 pt-8 sm:gap-12">
            <Stat value="500+" label="Happy customers" />
            <Stat value="50+" label="Bakery items" />
            <Stat value="5.0" label="Star rating" showStar />
          </div>
        </div>

        {/* Right — Image */}
        <div className="relative hidden md:flex items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-4xl bg-rose-light/60 blur-2xl"
          />
          <div className="relative w-full">
            <Image
              src="/bloom-hero.jpg"
              alt="An assortment of Bloom Bakery cakes, croissants, and macarons on a cream linen"
              width={1080}
              height={1350}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
              className="relative aspect-4/5 w-full rounded-4xl object-cover shadow-warm"
            />

            {/* Floating card */}
            <div className="absolute -left-3 bottom-6 hidden rounded-2xl border border-border bg-cream p-4 shadow-soft sm:block">
              <div
                className="flex items-center gap-1 text-amber"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    strokeWidth={1.5}
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-2 font-display text-lg font-semibold text-cocoa">
                Loved in Karachi
              </p>
              <p className="text-xs text-muted">500+ five-star reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({
  value,
  label,
  showStar,
}: {
  value: string
  label: string
  showStar?: boolean
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-display text-3xl font-semibold text-cocoa">
        {value}
        {showStar && (
          <Star
            strokeWidth={1.5}
            className="h-5 w-5 fill-amber text-amber"
            aria-hidden="true"
          />
        )}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  )
}