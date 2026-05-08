import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Bloom Bakery",
    template: "%s | Bloom Bakery",
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream">
      {children}
    </div>
  )
}