import { db } from "@/lib/db"
import HealthInsuranceCategoryMain from "./components/HealthInsuranceCategoryMain"

const HealthInsuranceCategoryPage = async ({ searchParams }) => {
  // ✅ read category param from URL
  const category = await searchParams?.name || null;


  // fetch all insurances
  const insurances = await db.HealthInsurance.findMany({
    select: {
      id: true,
      companyName: true,
      category: true,
    },
    orderBy: { companyName: "asc" },
  })

  // group by category
  const grouped = insurances.reduce((acc, item) => {
    if (!item.category) return acc
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push({
      id: item.id,
      companyName: item.companyName,
      category: item.category,
    })
    return acc
  }, {})

  // filter only selected category if param exists
  const filtered =
    category && grouped[category.toLowerCase()]
      ? grouped[category.toLowerCase()]
      : []

  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ])
  return (
    <div className="p-6">
      <HealthInsuranceCategoryMain
        // ✅ if category param exists → show only that
        insurances={filtered}
        category={category}
      />
    </div>
  )
}

export default HealthInsuranceCategoryPage
