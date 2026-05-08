"use client"


import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Plus } from "lucide-react"
import { toast } from "sonner"
import { toggleProductStock } from "@/lib/admin-actions"
import { formatPKR } from "@/lib/formatting"

type Product = {
  _id: string
  name: string
  slug: string
  category: string
  pricePKR: number
  inStock: boolean
  imageUrl: string | null
}

export default function AdminProductsClient({
  products: initialProducts,
}: {
  products: Product[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isPending, startTransition] = useTransition()
  const [togglingId, setTogglingId] = useState<string | null>(null)

  function handleToggleStock(product: Product) {
    setTogglingId(product._id)
    startTransition(async () => {
      const result = await toggleProductStock(product._id, !product.inStock)
      setTogglingId(null)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, inStock: !p.inStock } : p
        )
      )

      toast.success(
        `${product.name} marked as ${!product.inStock ? "In Stock" : "Out of Stock"}`
      )
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Inventory
          </p>
          <h1 className="mt-2 font-display text-3xl text-cocoa sm:text-4xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} products · Managed via Sanity CMS
          </p>
        </div>
        <Link
          href="/studio"
          target="_blank"
          className="flex items-center gap-2 rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
        >
          <Plus strokeWidth={2} className="h-4 w-4" aria-hidden="true" />
          Add in Sanity
          <ExternalLink strokeWidth={1.5} className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-cream overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream/80">
                {["Product", "Category", "Price", "Stock", "Edit"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const isToggling = togglingId === product._id

                return (
                  <tr
                    key={product._id}
                    className="transition hover:bg-rose-light/10"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-rose-light">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-rose-light" />
                          )}
                        </div>
                        <p className="font-semibold text-cocoa">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-cocoa/70">{product.category}</td>
                    <td className="px-5 py-4 font-semibold text-cocoa">
                      {formatPKR(product.pricePKR)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(product)}
                        disabled={isToggling || isPending}
                        role="switch"
                        aria-checked={product.inStock}
                        aria-label={`Toggle ${product.name} stock`}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          product.inStock ? "bg-green-500" : "bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-cream shadow transition-transform ${
                            product.inStock ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/studio/desk/product;${product._id}`}
                        target="_blank"
                        className="flex items-center gap-1 text-xs text-rose hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
                      >
                        Edit
                        <ExternalLink strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}