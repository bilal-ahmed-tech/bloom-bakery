// lib/types.ts
// Single source of truth for all Sanity-derived types.
// Import from here — never redeclare Product/Category/Testimonial locally.


export type SanityImage = {
  asset: {
    _ref: string
    _type: "reference"
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export type SanityProduct = {
  _id: string
  name: string
  slug: string
  category: { name: string; slug: string } | null
  pricePKR: number
  priceUSD: number
  image: SanityImage | null
  tag: string | null
  inStock: boolean
}

export type SanityProductDetail = SanityProduct & {
  description: string | null
  images: SanityImage[]
  variants: string[] | null
  ingredients: string[] | null
  deliveryInfo: string | null
}

export type SanityCategory = {
  _id: string
  name: string
  slug: string
  image: SanityImage | null
}

export type SanityTestimonial = {
  _id: string
  name: string
  location: string | null
  review: string
  rating: number
}