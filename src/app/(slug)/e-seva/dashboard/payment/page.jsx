import { db } from "@/lib/db"
import EsevaPaymentsList from "../../components/esevapaymentlist"
import { getSession } from "@/lib/getsession"

export const dynamic = "force-dynamic"

const PaymentsPage = async () => {
  const session = await getSession()

  if (!session?.email) {
    return <div className="p-6 text-red-600">Not authorized</div>
  }

  let eseva = null
  let subAdmin = null
  let userRole = "eseva"
  let currentSubAdminId = null

  // First check if it's an eseva center
  eseva = await db.eseva.findUnique({
    where: { email: session.email },
  })

  // If not eseva, check if it's a subadmin
  if (!eseva) {
    subAdmin = await db.esevaSubAdmin.findUnique({
      where: { email: session.email },
      include: {
        eseva: true,
      },
    })

    if (subAdmin) {
      eseva = subAdmin.eseva
      userRole = "subadmin"
      currentSubAdminId = subAdmin.id
    }
  }

  if (!eseva) {
    return <div className="p-6 text-red-600">Access denied. User not found in system.</div>
  }

  const esevaId = eseva.id

  // 1. Direct E-seva payments
  const directPayments = await db.esevaPayment.findMany({
    where: { esevaId },
    orderBy: { createdAt: "desc" },
  })

  // 2. Sub-admin payments with their details
  const subAdminPayments = await db.esevaSubAdminPayment.findMany({
    where: { esevaId },
    include: {
      subAdmin: {
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // 3. Patient payments - both direct and through subadmins
  const patientPayments = await db.patientPayment.findMany({
    where: {
      OR: [
        { esevaId }, // Direct patient payments through this eseva
        {
          patient: {
            esevaId, // Patients registered with this eseva
          },
        },
        {
          esevaSubAdminId: {
            in: subAdminPayments.map((sp) => sp.subAdminId), // Payments through subadmins of this eseva
          },
        },
      ],
    },
    include: {
      patient: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
        },
      },
      esevaSubAdmin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <EsevaPaymentsList
      esevaName={eseva.name}
      directPayments={directPayments}
      subAdminPayments={subAdminPayments}
      patientPayments={patientPayments}
      userRole={userRole}
      currentSubAdminId={currentSubAdminId}
    />
  )
}

export default PaymentsPage
