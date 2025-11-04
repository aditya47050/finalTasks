import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"
import DiagnosticMainClient from "./component/alldiagnosticcenters"

const SingleDiagnosticCenterpage = async ({ params }) => {
  const { diagnosticcenterid } = await params

  // Get session and patient data
  const session = await getSession()
  let patient = null

  if (session?.email) {
    patient = await db.patient.findFirst({
      where: { email: session.email },
      select: { city: true },
    })
  } else {
    console.log("⚠️ No session found, skipping patient lookup.")
  }

  // Get all HspCategory entries linked to the diagnostic center category
  const linkedHspCategories = await db.hspCategory.findMany({
    where: {
      diagnosticCenterCategoryId: diagnosticcenterid,
    },
    select: {
      hspInfoId: true,
    },
  })
  
  const hospitalCategories = await db.hospitalsCategory.findMany({
    select: {
      id: true,
      title: true,
    },
  })
  
  const hspInfoIds = linkedHspCategories.map((cat) => cat.hspInfoId)

  // Fetch hospitals with full data including diagnostic services
  const hospitaldetails = await db.hospital.findMany({
    where: {
      hspInfoId: { in: hspInfoIds },
    },
    include: {
      hspInfo: true,
      hspdetails: true,
      hspcontact: true,
      hspbranches: true,
      diagnosticServices: {
        include: {
          _count: {
            select: { BookDiagnosticService: true },
          },
        },
      },
      _count: {
        select: {
          reviews: true,
          BedBooking: true,
        },
      },
    },
  })

  // Fetch diagnostic center title
  const hspcategoryname = await db.diagnosticCenterCategory.findFirst({
    where: { id: diagnosticcenterid },
  })

  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ])

  return (
    <div className="">
      <DiagnosticMainClient
        hospitaldetails={hospitaldetails}
        hspcategoryname={hspcategoryname}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        hospitalCategories={hospitalCategories}
        patientCity={patient?.city}
      />
    </div>
  )
}

export default SingleDiagnosticCenterpage;