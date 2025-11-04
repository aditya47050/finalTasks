import HealthInsuranceMainClient from "../components/HealthInsuranceMainClient"
import { db } from "@/lib/db"

const HealthInsurancePage = async () => {
  try {
    const data = await db.HealthInsurance.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return <HealthInsuranceMainClient data={data} />
  } catch (error) {
    console.error("Error fetching insurance data:", error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Insurance Data</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }
}

export default HealthInsurancePage
