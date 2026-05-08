"use client"

// components/shop/ProductActions.tsx
// Client component — variant selector, quantity, add to cart.

import { useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { addToCart } from "@/lib/cart-store"
import { toast } from "sonner"

type Props = {
  product: {
    _id: string
    name: string
    category: string
    imageUrl: string | null
    pricePKR: number
    priceUSD: number
    inStock: boolean
    variants: string[]
  }
}

export default function ProductActions({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants[0] ?? undefined
  )
  const [quantity, setQuantity] = useState(1)

  function handleAddToCart() {
    addToCart(
      {
        id: product._id,
        name: product.name,
        category: product.category,
        image: product.imageUrl ?? "",
        pricePKR: product.pricePKR,
        priceUSD: product.priceUSD,
        variant: selectedVariant,
      },
      quantity
    )
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* Variants */}
      {product.variants.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
            Size / Variant
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                  selectedVariant === variant
                    ? "border-rose bg-rose text-cream"
                    : "border-border text-cocoa hover:border-rose hover:text-rose"
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cocoa">
          Quantity
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-cocoa transition hover:border-rose hover:text-rose disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
          >
            <Minus strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            aria-live="polite"
            aria-label={`Quantity: ${quantity}`}
            className="w-8 text-center font-display text-xl font-semibold text-cocoa"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-cocoa transition hover:border-rose hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
          >
            <Plus strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock}
        aria-label={`Add ${product.name} to cart`}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose text-sm font-semibold text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2"
      >
        <ShoppingBag strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
        {product.inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  )
}