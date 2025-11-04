import { getSession } from "@/lib/getsession"
import ProfilePageClient from "../../components/ProfilePageClient"


export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-center text-gray-500">Please login to view your profile.</p>
      </main>
    )
  }

  return (
    <main>
      <ProfilePageClient user={session} />
    </main>
  )
}
