import { db } from "@/lib/db"
import DetailView from "./../../components/detail-view"
import { notFound } from "next/navigation"

export default async function Page({ params }) {
  const id = params.id

  // 1️⃣ Fetch ad request
  const ad = await db.AdRequest.findUnique({
    where: { id },
  })

  if (!ad) return notFound()

  // 2️⃣ Determine which collection to query
  let userdata

  switch (ad.role) {
    case "Doctor":
      userdata = await db.Doctor.findFirst({
        where: {
          email: ad.userEmail,
          role: ad.role,
        },
        include: {
          doctorinfo: true,
          specialities: {
            include: {
              speciality: true, // Fetch associated specialty details
            },
          },
        },
      })
      break

    case "Hospital":
      userdata = await db.Hospital.findFirst({
        where: {
          email: ad.userEmail,
          role: ad.role,
        },
        include: {
          hspInfo: {
            include: {
              hspcategory: {
                include: { hspcategory: true, diagnosticcategory: true },
              },
            },
          },
          hspdetails: true,
          hspcontact: true,
          hspbranches: true,
          HospitalPayment :true,
        },
      });
      break

    case "Pharmacy":
      userdata = await db.pharmacy.findUnique({
        where: { 
          email: ad.userEmail,
          id: ad.userId, 
        },
      })
      break

    case "Ambulance":
      userdata = await db.Ambulance.findFirst({
        where: {
          email: ad.userEmail,
          id: ad.userId,
        },
        include: {
          AmbulanceHsp: true,
        },
      });
      break

    default:
      userdata = null
  }

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      <DetailView ad={ad} id={id} user={userdata} />
    </main>
  )
}
