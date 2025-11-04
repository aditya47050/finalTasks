import { db } from "@/lib/db"
import AllAmbulancesList from "./components/allambulanceslist"

const AmbulancePage = async () => {
  try {
    const ambulanceData = await db.Ambulance.findMany({
      include: {
        AmbulanceVaichicle: {
          include: {
            driver: true,
          },
        },
        AmbulanceHsp: {
          include: {
            categories: {
              include: {
                hspcategory: true,
              },
            },
          },
        },
        HospitalAmbulance: {
          include: {
            hospital: {
              include: {
                hspInfo: true,
                hspcontact: true,
              },
            },
          },
        },
        AmbulanceDriver: true,
      },
    })

    const states = await db.State.findMany()
    const districts = await db.District.findMany()
    const talukas = await db.SubDistrict.findMany()

    return (
      <div className="">
        <AllAmbulancesList
          ambulanceData={ambulanceData}
          states={states || []}
          dist={districts || []}
          taluka={talukas || []}
        />
      </div>
    )
  } catch (error) {
    console.error("Error fetching ambulance data:", error)
    return <div>Error loading data. Please try again later.</div>
  }
}

export default AmbulancePage
