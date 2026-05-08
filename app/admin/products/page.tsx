// app/admin/products/page.tsx
import { sanityFetch, urlFor } from "@/lib/sanity"
import { allProductsQuery } from "@/lib/queries"
import type { SanityProduct } from "@/lib/types"
import AdminProductsClient from "./AdminProductsClient"

export const metadata = { title: "Products" }

export default async function AdminProductsPage() {
  const raw = await sanityFetch<SanityProduct[]>(allProductsQuery)

  const products = raw.map((p) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name ?? "Uncategorized",
    pricePKR: p.pricePKR,
    inStock: p.inStock,
    imageUrl: p.image
      ? urlFor(p.image).width(96).height(96).fit("crop").url()
      : null,
  }))

  return <AdminProductsClient products={products} />
}