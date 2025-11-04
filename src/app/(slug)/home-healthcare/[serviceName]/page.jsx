import { db } from "@/lib/db"
import HomeHealthcareMainClient from "../component/allhomehealthcare"
import { getSession } from "@/lib/getsession"


const SingleHomeHealthcarePage = async ({ params }) => {
  const { serviceName } = params
  const decodedServiceName = decodeURIComponent(serviceName)

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

  // Get all HomeHealthcare entries linked to the specific service with counts
  const homeHealthcareServices = await db.homeHealthcare.findMany({
    where: {
      serviceName: decodedServiceName,
      isAvailable: true,
    },
    include: {
      hospital: {
        include: {
          hspInfo: true,
          hspdetails: true,
          hspcontact: true,
          hspbranches: true,
          reviews: true,
        },
      },
      _count: {
        select: {
          BookHomeHealthcare: true, // ✅ this is valid here
        }
      }
    },
  })
  

  const hospitalCategories = await db.hospitalsCategory.findMany({
    select: {
      id: true,
      title: true,
    },
  })

  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ])

  return (
    <div className="">
      <HomeHealthcareMainClient
        homeHealthcareServices={homeHealthcareServices}
        serviceName={decodedServiceName}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        hospitalCategories={hospitalCategories}
        patientCity={patient?.city}
      />
    </div>
  )
}

export default SingleHomeHealthcarePage