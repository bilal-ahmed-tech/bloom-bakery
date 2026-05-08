// app/(shop)/shop/page.tsx
// Server component — fetches all products from Sanity, passes to ShopContent.

import type { Metadata } from "next"
import { sanityFetch, urlFor } from "@/lib/sanity"
import { allProductsQuery } from "@/lib/queries"
import type { SanityProduct } from "@/lib/types"
import ShopContent, { type ShopProduct } from "@/components/shop/ShopContent"

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse all our freshly baked cakes, pastries, breads, and cookies.",
}

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const { category } = await searchParams

  const raw = await sanityFetch<SanityProduct[]>(allProductsQuery)

  const products: ShopProduct[] = raw.map((p) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    pricePKR: p.pricePKR,
    priceUSD: p.priceUSD,
    imageUrl: p.image
      ? urlFor(p.image).width(600).height(450).fit("crop").url()
      : null,
    tag: p.tag ?? null,
    inStock: p.inStock,
  }))

  return <ShopContent products={products} categoryParam={category} />
}