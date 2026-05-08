"use client";

// components/shop/ShopContent.tsx
// Client component — receives serialized products from the server shop page.
// Handles search, filter, sort entirely on the client from the passed data.

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { addToCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { formatPKR } from "@/lib/formatting";

export type ShopProduct = {
  _id: string;
  name: string;
  slug: string;
  category: { name: string; slug: string } | null;
  pricePKR: number;
  priceUSD: number;
  imageUrl: string | null;
  tag: string | null;
  inStock: boolean;
};

type SortOption = "newest" | "price-asc" | "price-desc" | "bestseller";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Bestsellers", value: "bestseller" },
];

type Props = {
  products: ShopProduct[];
  categoryParam?: string;
};

export default function ShopContent({ products, categoryParam }: Props) {
  // Build category list dynamically from real data
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: { label: string; slug: string }[] = [
      { label: "All", slug: "all" },
    ];
    for (const p of products) {
      if (p.category && !seen.has(p.category.slug)) {
        seen.add(p.category.slug);
        list.push({ label: p.category.name, slug: p.category.slug });
      }
    }
    return list;
  }, [products]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryParam ?? "all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category?.slug === category);
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.pricePKR - b.pricePKR);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.pricePKR - a.pricePKR);
    } else if (sort === "bestseller") {
      result.sort((a) => (a.tag === "Bestseller" ? -1 : 1));
    }

    return result;
  }, [products, search, category, sort, inStockOnly]);

  const currentSortLabel =
    sortOptions.find((o) => o.value === sort)?.label ?? "Sort";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          Our Menu
        </p>
        <h1 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
          Bakery Shop
        </h1>
        <p className="mt-3 text-sm text-muted">
          Handcrafted daily in small batches — order before 2pm for same-day
          delivery.
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            strokeWidth={1.5}
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-full border border-border bg-cream py-2.5 pl-10 pr-4 text-sm text-cocoa placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-full">
              <X strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-cocoa transition hover:border-rose hover:text-rose sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
            <SlidersHorizontal
              strokeWidth={1.5}
              className="h-4 w-4"
              aria-hidden="true"
            />
            Filters
          </button>

          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-cocoa transition hover:border-rose hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
              {currentSortLabel}
              <X
                strokeWidth={1.5}
                className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-0" : "rotate-45"}`}
                aria-hidden="true"
              />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-2xl border border-border bg-cream shadow-soft overflow-hidden">
                <ul role="listbox" aria-label="Sort options">
                  {sortOptions.map((opt) => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={sort === opt.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                          sort === opt.value
                            ? "bg-rose-light text-rose font-semibold"
                            : "text-cocoa/80 hover:bg-rose-light/50 hover:text-rose"
                        }`}>
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden w-60 shrink-0 sm:block">
          <div className="sticky top-24 flex flex-col gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa mb-3">
                Category
              </p>
              <ul className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      onClick={() => setCategory(cat.slug)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                        category === cat.slug
                          ? "bg-rose-light text-rose"
                          : "text-cocoa/80 hover:bg-rose-light/50 hover:text-rose"
                      }`}>
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa mb-3">
                Availability
              </p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-rose focus-visible:outline-none"
                />
                <span className="text-sm text-cocoa/80">In stock only</span>
              </label>
            </div>

            {(category !== "all" || inStockOnly || search) && (
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setInStockOnly(false);
                  setSearch("");
                }}
                className="text-sm text-rose hover:underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="mb-6 w-full rounded-2xl border border-border bg-cream p-5 sm:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cocoa mb-3">
              Category
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategory(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose ${
                    category === cat.slug
                      ? "bg-rose text-cream"
                      : "border border-border text-cocoa/80 hover:border-rose hover:text-rose"
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-rose"
              />
              <span className="text-sm text-cocoa/80">In stock only</span>
            </label>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-display text-2xl text-cocoa">
                No products found
              </p>
              <p className="mt-2 text-sm text-muted">
                Try adjusting your search or filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setInStockOnly(false);
                  setSearch("");
                }}
                className="mt-6 rounded-full bg-rose px-6 py-2.5 text-sm font-medium text-cream hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-xs text-muted">
                {filtered.length}{" "}
                {filtered.length === 1 ? "product" : "products"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                  <article
                    key={product._id}
                    className="group flex flex-col  rounded-2xl border border-border bg-cream overflow-hidden transition hover:shadow-soft">
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative block aspect-4/3 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                        {product.category?.name ?? "Uncategorized"}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold text-cocoa group-hover:text-rose transition-colors line-clamp-2 min-h-14">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-rose">
                        {formatPKR(product.pricePKR)}
                      </p>
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => {
                          addToCart({
                            id: product._id,
                            name: product.name,
                            category: product.category?.name ?? "Uncategorized",
                            image: product.imageUrl ?? "",
                            pricePKR: product.pricePKR,
                            priceUSD: product.priceUSD,
                          });
                          toast.success(`${product.name} added to cart`);
                        }}
                        aria-label={`Add ${product.name} to cart`}
                        className="mt-4 w-full rounded-full bg-rose py-2.5 text-xs font-semibold uppercase tracking-wider text-cream transition hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
