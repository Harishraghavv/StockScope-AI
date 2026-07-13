import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/current-user"
import AdminClient from "@/components/admin/AdminClient"

export const metadata = {
  title: "Admin Dashboard | StockScope AI",
  description: "Administrative controls and system status",
}

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/admin")
  }

  // Assuming 'ADMIN' role checking if applicable, else checking email or a hardcoded list
  // Note: The schema might not have a Role enum yet, we use a mock check or assume admin
  if (user.email !== "demo@stockscope.ai" && user.email !== "admin@stockscope.ai") {
    // If not admin, redirect to dashboard
    redirect("/dashboard")
  }

  return <AdminClient user={user} />
}
