import Link from "next/link";
import {
  ArrowRight,
  Cake,
  ChefHat,
  Cookie,
  Croissant,
  Leaf,
  ShoppingBag,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { sanityFetch } from "@/lib/sanity";
import { categoriesQuery } from "@/lib/queries";
import type { SanityCategory } from "@/lib/types";

export const metadata = {
  title: "Categories",
  description:
    "Browse Bloom Bakery categories — cakes, pastries, breads, cookies, cupcakes, and seasonal favourites, all freshly baked in Karachi.",
};

const iconMap: Record<string, LucideIcon> = {
  cakes: Cake,
  pastries: Croissant,
  bread: Wheat,
  breads: Wheat,
  cookies: Cookie,
  cupcakes: ChefHat,
  seasonal: Leaf,
};

export default async function CategoriesPage() {
  const categories = await sanityFetch<SanityCategory[]>(categoriesQuery);

  return (
    <main>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="dot-pattern absolute inset-0 opacity-50"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-amber-light blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 md:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Browse
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-cocoa sm:text-6xl">
            Pick a{" "}
            <em className="italic text-rose">category</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            From buttery croissants to celebration cakes — explore our menu by
            the kind of treat you’re after.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-border bg-cream p-10 text-center">
            <p className="text-sm text-muted">
              No categories yet. Add them in Sanity Studio.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-rose px-6 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
              Browse all products
              <ArrowRight
                strokeWidth={1.5}
                className="h-4 w-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.slug] ?? ShoppingBag;
              return (
                <li key={cat._id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-cream p-6 transition hover:border-rose hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-light/50 blur-2xl transition group-hover:bg-rose-light"
                    />
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-light text-rose transition group-hover:scale-105">
                      <Icon
                        strokeWidth={1.7}
                        className="h-7 w-7"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="relative">
                      <h2 className="font-display text-2xl font-semibold text-cocoa transition-colors group-hover:text-rose">
                        {cat.name}
                      </h2>
                      <p className="mt-1 text-xs text-muted">
                        Shop {cat.name.toLowerCase()}
                      </p>
                    </div>
                    <span className="relative mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-rose">
                      Browse
                      <ArrowRight
                        strokeWidth={1.7}
                        className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {categories.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-rose px-6 text-sm font-semibold text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
              Or view the full menu
              <ArrowRight
                strokeWidth={1.5}
                className="h-4 w-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
