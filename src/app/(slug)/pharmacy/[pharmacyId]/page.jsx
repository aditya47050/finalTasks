import PharmacySingleView from "../[pharmacyId]/components/PharmacySingleView"
import { db } from "@/lib/db"

const PharmacyPage = async ({ params }) => {
  const { pharmacyId } = params

  // Fetch pharmacy data with products
  const pharmacyData = await db.pharmacy.findUnique({
    where: {
      id: pharmacyId,
    },
    include: {
      Product: {
        orderBy: {
          createdAt: "desc",
        },
      },
      Pharmacist: true,
      pharmacybranch: true,
      PharmacyCertificate: true,
    },
  })

  if (!pharmacyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
<div className="text-center">
  <h1 className="text-2xl font-bold text-gray-900 mb-2">Pharmacy Not Found</h1>
  <p className="text-gray-600">The pharmacy you&apos;re looking for doesn&apos;t exist.</p>
</div>
      </div>
    )
  }

  return (
    <>
      <PharmacySingleView
        pharmacyData={pharmacyData}
        customerId="sample-customer-id" // Replace with actual customer ID from session
      />
    </>
  )
}

export default PharmacyPage
