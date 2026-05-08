import { createClient } from "@sanity/client";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const client = createClient({
  projectId: "36ot86p9",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN, // set in .env.local
  useCdn: false,
});

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Variant {
  _type: "variant";
  _key: string;
  name: string;
}

interface ProductInput {
  _type: "product";
  name: string;
  slug: { _type: "slug"; current: string };
  description: string;
  pricePKR: number;
  priceUSD: number;
  isFeatured: boolean;
  inStock: boolean;
  categorySlug: string; // resolved to ref after category lookup
  variants: Variant[];
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const categories = [
  { _type: "category", name: "Cakes",     slug: { _type: "slug", current: "cakes" } },
  { _type: "category", name: "Pastries",  slug: { _type: "slug", current: "pastries" } },
  { _type: "category", name: "Cookies",   slug: { _type: "slug", current: "cookies" } },
  { _type: "category", name: "Bread",     slug: { _type: "slug", current: "bread" } },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
const products: ProductInput[] = [
  {
    _type: "product",
    name: "Chocolate Truffle Cake",
    slug: { _type: "slug", current: "chocolate-truffle-cake" },
    description:
      "A rich, velvety chocolate cake layered with dark chocolate ganache and dusted with cocoa powder. Made fresh daily with premium Belgian chocolate.",
    pricePKR: 2800,
    priceUSD: 10,
    isFeatured: true,
    inStock: true,
    categorySlug: "cakes",
    variants: [
      { _type: "variant", _key: "v1", name: 'Small (6")' },
      { _type: "variant", _key: "v2", name: 'Medium (8")' },
      { _type: "variant", _key: "v3", name: 'Large (10")' },
    ],
  },
  {
    _type: "product",
    name: "Red Velvet Cake",
    slug: { _type: "slug", current: "red-velvet-cake" },
    description:
      "Classic red velvet with a tender crumb, subtle cocoa flavor, and a generous layer of smooth cream cheese frosting on every slice.",
    pricePKR: 2500,
    priceUSD: 9,
    isFeatured: true,
    inStock: true,
    categorySlug: "cakes",
    variants: [
      { _type: "variant", _key: "v1", name: 'Small (6")' },
      { _type: "variant", _key: "v2", name: 'Medium (8")' },
      { _type: "variant", _key: "v3", name: 'Large (10")' },
    ],
  },
  {
    _type: "product",
    name: "Almond Croissant",
    slug: { _type: "slug", current: "almond-croissant" },
    description:
      "Buttery, flaky croissant filled with almond frangipane cream and topped with toasted almond slices and a light dusting of powdered sugar.",
    pricePKR: 380,
    priceUSD: 1.40,
    isFeatured: true,
    inStock: true,
    categorySlug: "pastries",
    variants: [
      { _type: "variant", _key: "v1", name: "Single" },
      { _type: "variant", _key: "v2", name: "Box of 4" },
      { _type: "variant", _key: "v3", name: "Box of 6" },
    ],
  },
  {
    _type: "product",
    name: "Classic Butter Croissant",
    slug: { _type: "slug", current: "classic-butter-croissant" },
    description:
      "Golden, laminated croissant with 27 layers of pure butter dough. Crispy on the outside, airy and soft within. Baked fresh every morning.",
    pricePKR: 320,
    priceUSD: 1.15,
    isFeatured: false,
    inStock: true,
    categorySlug: "pastries",
    variants: [
      { _type: "variant", _key: "v1", name: "Single" },
      { _type: "variant", _key: "v2", name: "Box of 4" },
      { _type: "variant", _key: "v3", name: "Box of 6" },
    ],
  },
  {
    _type: "product",
    name: "Belgian Chocolate Macarons",
    slug: { _type: "slug", current: "belgian-chocolate-macarons" },
    description:
      "Delicate French meringue shells with a crisp exterior and chewy centre, sandwiched with rich Belgian chocolate ganache.",
    pricePKR: 950,
    priceUSD: 3.50,
    isFeatured: true,
    inStock: true,
    categorySlug: "pastries",
    variants: [
      { _type: "variant", _key: "v1", name: "Box of 6" },
      { _type: "variant", _key: "v2", name: "Box of 12" },
    ],
  },
  {
    _type: "product",
    name: "Choco Chunk Cookies",
    slug: { _type: "slug", current: "choco-chunk-cookies" },
    description:
      "Thick, bakery-style cookies loaded with dark chocolate chunks. Slightly crisp on the edges, gooey and warm in the center. Baked to order.",
    pricePKR: 650,
    priceUSD: 2.40,
    isFeatured: false,
    inStock: true,
    categorySlug: "cookies",
    variants: [
      { _type: "variant", _key: "v1", name: "Box of 6" },
      { _type: "variant", _key: "v2", name: "Box of 12" },
    ],
  },
  {
    _type: "product",
    name: "Brown Butter Snickerdoodle",
    slug: { _type: "slug", current: "brown-butter-snickerdoodle" },
    description:
      "Soft, pillowy cookies rolled in cinnamon sugar with a nutty depth from brown butter. A timeless classic with a Bloom twist.",
    pricePKR: 600,
    priceUSD: 2.20,
    isFeatured: false,
    inStock: true,
    categorySlug: "cookies",
    variants: [
      { _type: "variant", _key: "v1", name: "Box of 6" },
      { _type: "variant", _key: "v2", name: "Box of 12" },
    ],
  },
  {
    _type: "product",
    name: "Sourdough Loaf",
    slug: { _type: "slug", current: "sourdough-loaf" },
    description:
      "Long-fermented sourdough with a crackly crust and open, chewy crumb. Made with our 3-year-old starter. No preservatives, no shortcuts.",
    pricePKR: 850,
    priceUSD: 3.10,
    isFeatured: false,
    inStock: true,
    categorySlug: "bread",
    variants: [
      { _type: "variant", _key: "v1", name: "Small (400g)" },
      { _type: "variant", _key: "v2", name: "Large (800g)" },
    ],
  },
  {
    _type: "product",
    name: "Rosemary Focaccia",
    slug: { _type: "slug", current: "rosemary-focaccia" },
    description:
      "Thick, pillowy Italian flatbread dimpled with extra virgin olive oil, fresh rosemary, and flaky sea salt. Perfect warm from the oven.",
    pricePKR: 750,
    priceUSD: 2.75,
    isFeatured: false,
    inStock: true,
    categorySlug: "bread",
    variants: [
      { _type: "variant", _key: "v1", name: "Half Tray" },
      { _type: "variant", _key: "v2", name: "Full Tray" },
    ],
  },
  {
    _type: "product",
    name: "Strawberry Vanilla Cupcakes",
    slug: { _type: "slug", current: "strawberry-vanilla-cupcakes" },
    description:
      "Fluffy vanilla sponge cupcakes topped with a swirl of fresh strawberry buttercream. Decorated with a dried strawberry slice on top.",
    pricePKR: 480,
    priceUSD: 1.75,
    isFeatured: false,
    inStock: true,
    categorySlug: "cakes",
    variants: [
      { _type: "variant", _key: "v1", name: "Box of 4" },
      { _type: "variant", _key: "v2", name: "Box of 6" },
      { _type: "variant", _key: "v3", name: "Box of 12" },
    ],
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Starting Bloom Bakery import...\n");

  // 1. Create categories and build a slug → _id map
  console.log("Step 1: Creating categories...");
  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    try {
      // Check if category already exists
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "category" && slug.current == $slug][0]{ _id }`,
        { slug: cat.slug.current }
      );

      if (existing) {
        categoryMap[cat.slug.current] = existing._id;
        console.log(`  Skipped (already exists): ${cat.name}`);
      } else {
        const created = await client.create(cat);
        categoryMap[cat.slug.current] = created._id;
        console.log(`  Created: ${cat.name} → ${created._id}`);
      }
    } catch (err) {
      console.error(`  Failed to create category "${cat.name}":`, err);
      process.exit(1);
    }
  }

  console.log("\nStep 2: Creating products...");

  // 2. Create products with resolved category refs
  let successCount = 0;

  for (const product of products) {
    const { categorySlug, ...rest } = product;
    const categoryId = categoryMap[categorySlug];

    if (!categoryId) {
      console.error(`  No category ID found for slug "${categorySlug}" — skipping ${product.name}`);
      continue;
    }

    try {
      // Check if product already exists
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "product" && slug.current == $slug][0]{ _id }`,
        { slug: product.slug.current }
      );

      if (existing) {
        console.log(`  Skipped (already exists): ${product.name}`);
        continue;
      }

      const doc = {
        ...rest,
        category: {
          _type: "reference",
          _ref: categoryId,
        },
      };

      const created = await client.create(doc);
      console.log(`  Created: ${product.name} → ${created._id}`);
      successCount++;
    } catch (err) {
      console.error(`  Failed to create product "${product.name}":`, err);
    }
  }

  console.log(`\nDone. ${successCount} products created successfully.`);
  console.log("Now add images manually in Sanity Studio at /studio");
}

main();