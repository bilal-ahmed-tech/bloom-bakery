// app/(shop)/products/[slug]/page.tsx
// Server component — fetches product by slug from Sanity.

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MessageCircle, ChevronRight } from "lucide-react"
import { sanityFetch, urlFor } from "@/lib/sanity"
import { productBySlugQuery, allProductsQuery } from "@/lib/queries"
import type { SanityProduct, SanityProductDetail } from "@/lib/types"
import ProductActions from "@/components/shop/ProductActions"
import { formatPKR, formatUSD } from "@/lib/formatting"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await sanityFetch<SanityProduct[]>(allProductsQuery)
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await sanityFetch<SanityProductDetail | null>(
    productBySlugQuery,
    { slug }
  )
  if (!product) return {}
  return {
    title: product.name,
    description: product.description ?? undefined,
  }
}

function whatsappLink(message: string) {
  return `https://wa.me/923001234567?text=${encodeURIComponent(message)}`
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const product = await sanityFetch<SanityProductDetail | null>(
    productBySlugQuery,
    { slug }
  )

  if (!product) notFound()

  const mainImageUrl = product.image
    ? urlFor(product.image).width(900).height(900).fit("crop").url()
    : null

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-xs text-muted"
      >
        <Link
          href="/"
          className="hover:text-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
        >
          Home
        </Link>
        <ChevronRight strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
        <Link
          href="/shop"
          className="hover:text-rose transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm"
        >
          Shop
        </Link>
        <ChevronRight strokeWidth={1.5} className="h-3 w-3" aria-hidden="true" />
        <span className="text-cocoa font-medium">{product.name}</span>
      </nav>

      {/* Product layout */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-4xl bg-rose-light">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-rose-light" />
          )}
          {product.tag && (
            <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose backdrop-blur-sm">
              {product.tag}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center rounded-4xl bg-cocoa/40 backdrop-blur-sm">
              <span className="rounded-full bg-cocoa px-6 py-2 text-sm font-semibold text-cream">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose">
            {product.category?.name ?? "Uncategorized"}
          </p>
          <h1 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-rose">
              {formatPKR(product.pricePKR)}
            </span>
            <span className="text-sm text-muted">
              {formatUSD(product.priceUSD)}
            </span>
          </div>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-cocoa/70">
              {product.description}
            </p>
          )}

          {/* Client actions — variant selector, quantity, add to cart */}
          <ProductActions
            product={{
              _id: product._id,
              name: product.name,
              category: product.category?.name ?? "Uncategorized",
              imageUrl: mainImageUrl,
              pricePKR: product.pricePKR,
              priceUSD: product.priceUSD,
              inStock: product.inStock,
              variants: product.variants ?? [],
            }}
          />

          {/* WhatsApp order */}
          <a
            href={whatsappLink(
              `Hi! I'd like to order the ${product.name} (${formatPKR(product.pricePKR)})`
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-rose text-sm font-medium text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
          >
            <MessageCircle
              strokeWidth={1.5}
              className="h-4 w-4"
              aria-hidden="true"
            />
            Order via WhatsApp
          </a>

          {/* Accordion tabs */}
          <div className="mt-10 border-t border-border pt-8">
            <div className="flex flex-col gap-6">
              {product.description && (
                <details className="group" open>
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm">
                    Description
                    <ChevronRight
                      strokeWidth={1.5}
                      className="h-4 w-4 transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                    {product.description}
                  </p>
                </details>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <>
                  <div className="border-t border-border" />
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm">
                      Ingredients
                      <ChevronRight
                        strokeWidth={1.5}
                        className="h-4 w-4 transition-transform group-open:rotate-90"
                        aria-hidden="true"
                      />
                    </summary>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {product.ingredients.map((ing) => (
                        <li
                          key={ing}
                          className="rounded-full border border-border px-3 py-1 text-xs text-cocoa/70"
                        >
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </details>
                </>
              )}

              {product.deliveryInfo && (
                <>
                  <div className="border-t border-border" />
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm">
                      Delivery Info
                      <ChevronRight
                        strokeWidth={1.5}
                        className="h-4 w-4 transition-transform group-open:rotate-90"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-cocoa/70">
                      {product.deliveryInfo}
                    </p>
                  </details>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}