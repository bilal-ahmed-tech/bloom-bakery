import Hero from "@/components/shop/Hero"
import Categories from "@/components/shop/Categories"
import FeaturedProducts from "@/components/shop/FeaturedProducts"
import Testimonials from "@/components/shop/Testimonials"
import WhatsAppCTA from "@/components/shop/WhatsappCTA"

export const metadata = {
  title: "Bloom Bakery — Freshly baked with love | Karachi",
  description:
    "Artisan cakes, pastries, breads, and cookies freshly baked with love in Karachi. Order online or via WhatsApp.",
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <WhatsAppCTA />
    </main>
  )
}