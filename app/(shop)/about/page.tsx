import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Heart,
  Leaf,
  MessageCircle,
  Sparkles,
  Wheat,
} from "lucide-react";
import { whatsappLink } from "@/lib/formatting";

export const metadata = {
  title: "About Us",
  description:
    "Meet Bloom Bakery — a small-batch artisan bakery in Karachi, hand-crafting cakes, pastries, and breads with seasonal ingredients and a whole lot of love.",
};

const values = [
  {
    icon: Heart,
    title: "Made with love",
    body: "Every cake, croissant, and loaf is hand-shaped — never rushed, never mass-produced.",
  },
  {
    icon: Wheat,
    title: "Honest ingredients",
    body: "Local flour, real butter, seasonal fruit, and Belgian chocolate. No shortcuts.",
  },
  {
    icon: Leaf,
    title: "Small-batch & fresh",
    body: "We bake to order each morning so what reaches you is at its absolute peak.",
  },
  {
    icon: Sparkles,
    title: "Custom creations",
    body: "From birthdays to weddings, we’ll happily craft something just for you.",
  },
];

const stats = [
  { value: "500+", label: "Happy customers" },
  { value: "50+", label: "Bakery items" },
  { value: "5.0", label: "Average rating" },
  { value: "5 yrs", label: "Of baking joy" },
];

export default function AboutPage() {
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
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-light blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-14 sm:px-6 md:grid-cols-2 md:gap-14 md:py-24 lg:px-8 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
              Our Story
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-cocoa sm:text-6xl">
              A little bakery,{" "}
              <em className="italic text-rose">a lot of love</em>.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Bloom Bakery began in a tiny home kitchen in Karachi, with one
              oven, two trusted recipes, and a dream of sharing the kind of
              bread and cake that makes people pause mid-bite.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-rose px-7 text-sm font-medium text-cream shadow-warm transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
                Shop our menu
                <ArrowRight
                  strokeWidth={1.5}
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-rose px-7 text-sm font-medium text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                Get in touch
              </Link>
            </div>
          </div>

          <div className="relative hidden md:flex">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-4xl bg-rose-light/60 blur-2xl"
            />
            <div className="relative w-full">
              <Image
                src="/bloom-hero.jpg"
                alt="Bloom Bakery cakes and pastries on a cream linen"
                width={1080}
                height={1350}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative aspect-4/5 w-full rounded-4xl object-cover shadow-warm"
                priority
              />
              <div className="absolute -left-3 bottom-6 hidden rounded-2xl border border-border bg-cream p-4 shadow-soft sm:block">
                <div className="flex items-center gap-2 text-rose">
                  <Award
                    strokeWidth={1.5}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                  <p className="font-display text-lg font-semibold text-cocoa">
                    Karachi favourite
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Loved by 500+ families since 2021
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-border bg-cream/40">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
              How it started
            </p>
            <h2 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
              From a home oven to your table
            </h2>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-cream p-6">
              <p className="font-display text-2xl text-rose">2021</p>
              <h3 className="mt-2 font-display text-xl text-cocoa">
                The first loaf
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A weekend hobby turned into a tiny WhatsApp order list. Friends,
                then friends-of-friends, started knocking.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-cream p-6">
              <p className="font-display text-2xl text-rose">2023</p>
              <h3 className="mt-2 font-display text-xl text-cocoa">
                Our little kitchen
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                We moved into a real bakery in DHA — bigger ovens, more hands,
                same obsession with quality.
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-cream p-6">
              <p className="font-display text-2xl text-rose">Today</p>
              <h3 className="mt-2 font-display text-xl text-cocoa">
                Bloom, all over Karachi
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Same-day delivery across the city, custom orders for events,
                and a menu that grows with the seasons.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            What we believe
          </p>
          <h2 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
            Our values
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <li
                key={v.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-cream p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-light text-rose">
                  <Icon
                    strokeWidth={1.7}
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="font-display text-xl text-cocoa">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{v.body}</p>
              </li>
            );
          })}
        </ul>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-6 rounded-3xl border border-border bg-cream p-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-semibold text-cocoa sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-cocoa px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="dot-pattern absolute inset-0 opacity-10"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber">
              Say hi
            </p>
            <h2 className="mt-3 font-display text-4xl text-cream sm:text-5xl">
              We’d love to bake for you
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
              Whether it’s a Tuesday loaf or a tiered wedding cake, drop us a
              message and we’ll take it from there.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappLink(
                  "Hi Bloom Bakery! I'd love to chat about an order.",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-amber px-7 text-sm font-semibold text-cocoa transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa">
                <MessageCircle
                  strokeWidth={1.5}
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-cream/30 px-7 text-sm font-semibold text-cream transition hover:bg-cream/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber">
                Contact details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
