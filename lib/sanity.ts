import { createClient } from "next-sanity"
import { createImageUrlBuilder } from "@sanity/image-url"

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, 
})

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, string>
): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {})
}