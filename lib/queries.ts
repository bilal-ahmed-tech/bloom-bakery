// lib/queries.ts

export const featuredProductsQuery = `
  *[_type == "product" && isFeatured == true][0...4] {
    _id,
    name,
    "slug": slug.current,
    category-> { name, "slug": slug.current },
    pricePKR,
    priceUSD,
    "image": images[0],
    tag,
    inStock
  }
`

export const allProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    category-> { name, "slug": slug.current },
    pricePKR,
    priceUSD,
    "image": images[0],
    tag,
    inStock
  }
`

export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    category-> { name, "slug": slug.current },
    pricePKR,
    priceUSD,
    "images": images[],
    "image": images[0],
    tag,
    inStock,
    "variants": variants[].name,
    ingredients,
    deliveryInfo
  }
`

export const categoriesQuery = `
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
  }
`

export const testimonialsQuery = `
  *[_type == "testimonial"][0...3] {
    _id,
    name,
    location,
    review,
    rating
  }
`