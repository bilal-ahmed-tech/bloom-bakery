"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

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
          <AlertTriangle
            strokeWidth={1.6}
            className="h-8 w-8"
            aria-hidden="true"
          />
        </span>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-rose">
          Something burned in the oven
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] text-cocoa sm:text-6xl">
          A little <em className="italic text-rose">hiccup</em>.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          We hit an unexpected error. Try again — or head back home and we’ll
          pretend this never happened.
        </p>

        {error?.digest && (
          <p className="mt-3 font-mono text-[11px] text-muted">
            Error ref: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-rose px-7 text-sm font-medium text-cream shadow-warm transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2">
            <RefreshCw
              strokeWidth={1.5}
              className="h-4 w-4 transition group-hover:rotate-180"
              aria-hidden="true"
            />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-rose px-7 text-sm font-medium text-rose transition hover:bg-rose-light active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
            <Home strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
