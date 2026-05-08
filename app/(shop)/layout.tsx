import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import StoreClosedBanner from "@/components/layout/StoreClosedBanner"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StoreClosedBanner />
      <Navbar />
      {children}
      <Footer />
    </>
  )
}