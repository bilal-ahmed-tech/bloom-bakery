import { MessageCircle } from "lucide-react"

function whatsappLink(message: string) {
  return `https://wa.me/923001234567?text=${encodeURIComponent(message)}`
}

export default function WhatsAppCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative overflow-hidden rounded-4xl bg-cocoa px-6 py-16 text-center sm:px-12 sm:py-20">

        {/* Background dot pattern */}
        <div aria-hidden="true" className="dot-pattern absolute inset-0 opacity-10" />

        {/* Content */}
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber">
            Get in touch
          </p>
          <h2 className="mt-3 font-display text-4xl text-cream sm:text-5xl">
            Want a custom order?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
            Birthday cakes, wedding tiers, corporate gifting — message us on
            WhatsApp and our team will craft something special for you.
          </p>
          <a
            href={whatsappLink("Hi! I'd like to discuss a custom order.")}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-amber px-7 text-sm font-semibold text-cocoa transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa"
          >
            <MessageCircle strokeWidth={1.5} className="h-4 w-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}