import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/current-user"
import SettingsClient from "@/components/settings/SettingsClient"

export const metadata = {
  title: "Settings | StockScope AI",
  description: "Configure your application preferences",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/settings")
  }

  return <SettingsClient user={user} />
}
