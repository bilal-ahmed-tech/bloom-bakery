// components/shop/FeaturedProducts.tsx
// Server component — fetches from Sanity, passes serialized props to client card.

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { sanityFetch, urlFor } from "@/lib/sanity"
import { featuredProductsQuery } from "@/lib/queries"
import type { SanityProduct } from "@/lib/types"
import FeaturedProductCard from "./FeaturedProductCard"

export default async function FeaturedProducts() {
  const products = await sanityFetch<SanityProduct[]>(featuredProductsQuery)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Hand picked
          </p>
          <h2 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
            Featured Products
          </h2>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-rose hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
        >
          View all
          <ArrowRight
            strokeWidth={1.5}
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          No featured products yet. Mark products as featured in Sanity Studio.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const imageUrl = product.image
              ? urlFor(product.image).width(600).height(750).fit("crop").url()
              : null

            return (
              <FeaturedProductCard
                key={product._id}
                product={{
                  _id: product._id,
                  name: product.name,
                  slug: product.slug,
                  category: product.category?.name ?? "Uncategorized",
                  pricePKR: product.pricePKR,
                  priceUSD: product.priceUSD,
                  imageUrl,
                  tag: product.tag ?? null,
                  inStock: product.inStock,
                }}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}