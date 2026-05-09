
import Link from "next/link"
import {
  Cake,
  Croissant,
  Wheat,
  Cookie,
  ChefHat,
  Leaf,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react"
import { sanityFetch } from "@/lib/sanity"
import { categoriesQuery } from "@/lib/queries"
import type { SanityCategory } from "@/lib/types"

// Map category slugs to lucide icons — add more as you add Sanity categories
const iconMap: Record<string, LucideIcon> = {
  cakes: Cake,
  pastries: Croissant,
  bread: Wheat,
  breads: Wheat,
  cookies: Cookie,
  cupcakes: ChefHat,
  seasonal: Leaf,
}

export default async function Categories() {
  const categories = await sanityFetch<SanityCategory[]>(categoriesQuery)

  return (
    <section className="border-y border-border bg-cream/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Browse
          </p>
          <h2 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
            Our Categories
          </h2>
        </div>

        {categories.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            No categories yet. Add them in Sanity Studio.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = iconMap[cat.slug] ?? ShoppingBag
              return (
                <li key={cat._id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-cream p-6 text-center transition hover:border-rose hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-light text-rose transition group-hover:scale-110">
                      <Icon
                        strokeWidth={1.9}
                        className="h-8 w-8"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-display text-lg font-semibold text-cocoa group-hover:text-rose transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}