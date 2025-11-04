import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"
import { ProfileForm } from "./../components/profile-form"

export default async function EmployerProfilePage() {
  const session = await getSession()

  // If user is not logged in
  if (!session?.id) {
    return (
      <div className="flex items-center justify-center h-40 text-destructive">
        You need to be logged in to edit your employer profile.
      </div>
    )
  }

  // Fetch employer and attach documents and company
  const employer = await db.employer.findUnique({
  where: { userId: session.id },
  include: {
    company: {
      include: {
        jobs: true,
        category: true,
        ratings: true, // existing
        employers: true,
        tags: { 
          include: { tag: true } // include actual tag info
        },
        benefits: { 
          include: { benefit: true } // include actual benefit info
        },
      },
    },
    documents: true,
  },
})


  // Fetch categories
  const categories = await db.jobCategory.findMany()

  return (
    <main className="flex flex-col items-center justify-center p-4 md:p-4">
      <ProfileForm
  initialCompany={employer}
  initialDocuments={employer?.documents ?? []}
  initialTags={employer?.company?.tags?.map(t => t.tag) ?? []}
  initialBenefits={employer?.company?.benefits?.map(b => b.benefit) ?? []}
  initialReviews={employer?.company?.reviews ?? []}
  category={categories}
/>

    </main>
  )
}