import Link from "next/link";
import { ArrowLeft, Cookie, Home, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-cream">
      <div
        aria-hidden="true"
        className="dot-pattern absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-rose-light blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-light blur-3xl"
      />

      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-light text-rose">
          <Cookie strokeWidth={1.6} className="h-8 w-8" aria-hidden="true" />
        </span>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          404 — Crumbs only
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] text-cocoa sm:text-6xl">
          We couldn’t find that{" "}
          <em className="italic text-rose">page</em>.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          The link may be broken, or the page may have moved. Try one of these
          instead.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-rose px-7 text-sm font-medium text-cream shadow-warm transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
            <Home strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
            Go home
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-rose px-7 text-sm font-medium text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
            <ShoppingBag
              strokeWidth={1.5}
              className="h-4 w-4"
              aria-hidden="true"
            />
            Browse the shop
          </Link>
        </div>

        <Link
          href="/categories"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cocoa/70 transition hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose rounded-sm">
          <ArrowLeft
            strokeWidth={1.7}
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
          Or pick a category
        </Link>
      </div>
    </main>
  );
}
