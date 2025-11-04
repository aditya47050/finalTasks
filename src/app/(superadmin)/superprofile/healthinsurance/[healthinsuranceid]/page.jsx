import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import InsuranceDetailsClient from "./components/InsuranceDetailsClient"

const InsuranceDetailsPage = async ({ params }) => {
  try {
    const { healthinsuranceid } =await params
    console.log(healthinsuranceid);
    const insurance = await db.HealthInsurance.findUnique({
      where: { id: healthinsuranceid },
      include: {
        reviews: true,
      },
    })

    if (!insurance) {
      notFound()
    }

    return <InsuranceDetailsClient insurance={insurance} />
  } catch (error) {
    console.error("Error fetching insurance details:", error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Insurance Details</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    )
  }
}

export default InsuranceDetailsPage
