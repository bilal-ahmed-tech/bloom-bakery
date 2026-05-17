// components/shop/Testimonials.tsx
import { Star, UserCircle2 } from "lucide-react"
import Image from "next/image"
import { sanityFetch, urlFor } from "@/lib/sanity"
import { testimonialsQuery } from "@/lib/queries"
import type { SanityTestimonial } from "@/lib/types"

export default async function Testimonials() {
  const testimonials = await sanityFetch<SanityTestimonial[]>(testimonialsQuery)

  if (testimonials.length === 0) return null

  return (
    <section className="border-y border-border bg-cream/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
            Reviews
          </p>
          <h2 className="mt-3 font-display text-4xl text-cocoa sm:text-5xl">
            What our customers say
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t._id}
              className="flex flex-col rounded-2xl border border-border bg-cream p-7 shadow-soft"
            >
              {/* Stars */}
              <div
                className="flex items-center gap-1"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    strokeWidth={0}
                    className={`h-4 w-4 ${
                      i < t.rating
                        ? "fill-amber text-amber"
                        : "fill-border text-border"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Review text — grows to push reviewer info to the bottom */}
              <p className="mt-5 flex-1 font-display text-lg italic leading-relaxed text-cocoa">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Reviewer info — always aligned to the bottom of every card */}
              <div className="mt-6 flex items-center gap-3">
                {t.avatar ? (
                  <Image
                    src={urlFor(t.avatar).width(40).height(40).fit("crop").url()}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle2
                    className="h-10 w-10 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-cocoa">{t.name}</p>
                  {t.location && (
                    <p className="text-xs text-muted">{t.location}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}