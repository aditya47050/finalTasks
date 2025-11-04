import { db } from "@/lib/db"
import HealthInsuranceMain from "./components/HealthInsuranceMain"

const HealthInsurancePage = async () => {
  const insurances = await db.HealthInsurance.findMany({
    select: {
      id: true,
      companyName: true,
      category: true,
    },
    orderBy: { category: "asc" },
  })

  // group by category
  const grouped = insurances.reduce((acc, item) => {
    if (!item.category) return acc
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push({ id: item.id, companyName: item.companyName ,category: item.category,})
    return acc
  }, {})

  const [state, district, subdistrict] = await Promise.all([
      db.state.findMany(),
      db.district.findMany(),
      db.SubDistrict.findMany(),
      
    ]);

  return (
    <div className="p-6">
      <HealthInsuranceMain
        government={grouped.government || []}
        privateIns={grouped.private || []}
        tpa={grouped.tpa || []}
        tpaAdmin={grouped.tpa_admin || []}
        stateList={state}
      districtList={district}
      subdistrictList={subdistrict}
      />
    </div>
  )
}

export default HealthInsurancePage
