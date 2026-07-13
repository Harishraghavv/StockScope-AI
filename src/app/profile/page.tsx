import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/current-user"
import ProfileClient from "@/components/profile/ProfileClient"

export const metadata = {
  title: "My Profile | StockScope AI",
  description: "Manage your profile and account settings",
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?callbackUrl=/profile")
  }

  return <ProfileClient user={user} />
}
