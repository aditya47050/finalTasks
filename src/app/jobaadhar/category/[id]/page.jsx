import { db } from "@/lib/db"
import Link from "next/link"

export default async function CategoryPage({ params }) {
  const { id } = params

  // Fetch the category with companies
  const category = await db.JobCategory.findUnique({
    where: { id },
    include: { companies: true },
  })

  if (!category) return <p>Category not found</p>

  return (
    <div className="container mx-auto p-4 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">{category.name} Companies</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {category.companies.length === 0 && <p>No companies found in this category.</p>}
        {category.companies.map((company) => (
          <div key={company.id} className="p-4 border rounded-xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-lg">{company.name}</h2>
            {company.logoUrl && <img src={company.logoUrl} alt={company.name} className="h-16 mt-2" />}
            <p className="mt-2 text-sm">{company.about}</p>
            <Link href={`/jobaadhar/companies/${company.id}`} className="bg-blue-500 text-white px-4 py-2 w-full rounded-xl text-center mt-2 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
