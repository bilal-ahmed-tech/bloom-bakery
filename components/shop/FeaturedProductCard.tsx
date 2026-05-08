"use client";

// components/shop/FeaturedProductCard.tsx
// Client component — handles add-to-cart interaction only.

import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { formatPKR } from "@/lib/formatting";

type Props = {
  product: {
    _id: string;
    name: string;
    slug: string;
    category: string;
    pricePKR: number;
    priceUSD: number;
    imageUrl: string | null;
    tag: string | null;
    inStock: boolean;
  };
};

export default function FeaturedProductCard({ product }: Props) {
  function handleAddToCart() {
    addToCart({
      id: product._id,
      name: product.name,
      category: product.category,
      image: product.imageUrl ?? "/bloom-cake.jpg",
      pricePKR: product.pricePKR,
      priceUSD: product.priceUSD,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-cream overflow-hidden transition hover:shadow-soft">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-rose-light" />
        )}
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose backdrop-blur-sm">
            {product.tag}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-cocoa/40 backdrop-blur-sm">
            <span className="rounded-full bg-cocoa px-4 py-1.5 text-xs font-semibold text-cream">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
          {product.category ?? "Uncategorized"}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-cocoa group-hover:text-rose transition-colors line-clamp-2 min-h-14">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-semibold text-rose">
          {formatPKR(product.pricePKR)}
        </p>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart`}
          className="mt-4 w-full rounded-full bg-rose py-2.5 text-xs font-semibold uppercase tracking-wider text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
