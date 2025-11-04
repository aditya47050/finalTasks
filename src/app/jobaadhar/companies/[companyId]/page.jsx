import { db } from "@/lib/db"
import CategorySingleView from "./../../components/categorySingleview"
import { getSession } from "@/lib/getsession"

export default async function CompanyPage({ params }) {
  const session = await getSession()

  if (!session) {
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-center text-gray-500">Please login to view your profile.</p>
      </main>
    )
  }

  const { companyId } = params

  // Fetch company with all related data
  const company = await db.company.findUnique({
    where: { id: companyId },
    include: {
      category: true,
      tags: {
        include: {
          tag: true, // include the tag object to get the name
        },
      },
      benefits: {
        include: {
          benefit: true, // include the benefit object to get the name
        },
      },
      reviews: {
        include : {
          jobSeeker:{
            include:{
              user : true,
            }
          },
        }
      }, // JObReview
      ratings: true, // EmployeeRating
      departments: true,
      jobs: {
        include: {
          skills: true,
          applications: true,
          savedJobs: true,
        },
      },
    },
  })

  if (!company) {
    return <p className="text-center text-gray-500">Company not found</p>
  }

  return <CategorySingleView company={company} userId={session.id} />
}
