import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Bloom Bakery Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex bg-[#f7f4f1]">
      <AdminSidebar />
      <div className="flex-1 min-w-0 lg:max-w-[75vw] lg:ms-auto lg:h-screen overflow-y-auto">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
