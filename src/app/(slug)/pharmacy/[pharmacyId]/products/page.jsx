import { Suspense } from "react"
import { getSession } from "@/lib/getsession"
import { db } from "@/lib/db"
import PharmacyProductsClient from "../components/pharmacy-products-client"

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary/20 border-t-secondary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Loading Products</h2>
        <p className="text-muted-foreground">Please wait while we fetch the latest medicines...</p>
      </div>
    </div>
  )
}

export default async function PharmacyProductsPage({ params }) {
  const { pharmacyId } = await params

  const session = await getSession()

  // Fetch pharmacy + products
  const pharmacy = await db.pharmacy.findUnique({
    where: { id: pharmacyId },
    include: {
      Product: {
        orderBy: { name: "asc" },
      },
    },
  })

  if (!pharmacy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
<div className="text-center">
  <div className="p-4 bg-destructive/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
    <span className="text-2xl">🏥</span>
  </div>
  <h1 className="text-2xl font-bold text-foreground mb-2">Pharmacy Not Found</h1>
  <p className="text-muted-foreground">
    The pharmacy you&apos;re looking for doesn&apos;t exist or has been removed.
  </p>
</div>
      </div>
    )
  }

  // Fetch patient data using session
  const patient = session?.email
    ? await db.Patient.findFirst({
        where: { email: session.email },
      })
    : null

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSpinner />}>
        <PharmacyProductsClient pharmacy={pharmacy} products={pharmacy.Product} customer={patient} />
      </Suspense>
    </div>
  )
}
