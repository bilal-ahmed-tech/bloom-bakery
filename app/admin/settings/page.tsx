// app/admin/settings/page.tsx
import { prisma } from "@/lib/prisma"
import AdminSettingsClient from "./AdminSettingsClient"

export const metadata = { title: "Settings" }

export default async function AdminSettingsPage() {
  const settings = await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      isOpen: true,
      freeDeliveryThreshold: 2000,
      deliveryFee: 250,
      cutoffTime: "14:00",
      announcementActive: false,
      announcementText: "",
    },
  })

  return (
    <AdminSettingsClient
      initialSettings={{
        isOpen: settings.isOpen,
        freeDeliveryThreshold: String(settings.freeDeliveryThreshold),
        deliveryFee: String(settings.deliveryFee),
        cutoffTime: settings.cutoffTime,
        announcementActive: settings.announcementActive,
        announcementText: settings.announcementText ?? "",
      }}
    />
  )
}