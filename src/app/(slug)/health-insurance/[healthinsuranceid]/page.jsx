import { db } from "@/lib/db"
import HealthInsuranceSingleViewClient from "./components/SingleHealthInsurance"
import { getSession } from '@/lib/getsession';

const HealthInsuranceSinglePage = async ({ params, searchParams }) => {
  const { healthinsuranceid } = await params       // ⬅️ from dynamic segment
  const awaitedSearchParams = await searchParams   // ⬅️ await searchParams
  const category = awaitedSearchParams?.category   // ⬅️ from query string
  const session = await getSession();
  
  // fetch the single insurance by id
  const insurance = await db.HealthInsurance.findUnique({
    where: { 
        category: category,
        id: healthinsuranceid
     },
  })
  
  // Handle case where session might be null
  const patient = session?.email ? await db.patient.findFirst({
    where: { email: session.email },
    select: { id: true },
  }) : null;

  return (
    <div className="p-6">
      <HealthInsuranceSingleViewClient
        insurance={insurance}             // single insurance details
        category={category}  
        loggeduserId={patient}             // pass category
      />
    </div>
  )
}

export default HealthInsuranceSinglePage
