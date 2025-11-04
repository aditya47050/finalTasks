import { db } from "@/lib/db"
import AmbulanceSingleView from "../components/ambulancessingleview"

const AmbulancePage = async ({ params }) => {
  const { ambulanceid: id } = params

  const data = await db.Ambulance.findFirst({
    where: { id },
    include: {
      HospitalCertificate:true,
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

  console.log(data)

  return (
    <div className="">
      <AmbulanceSingleView ambulanceData={data} />
    </div>
  )
}

export default AmbulancePage
