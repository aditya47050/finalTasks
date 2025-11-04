import { db } from "@/lib/db"
import EsevaSingleView from "../[esevaid]/components/esevasingleview"

const EsevaPage = async ({ params }) => {
  const id = params.esevaid

  const data = await db.Eseva.findFirst({
    where: { id },
    include: {
      patients: {
        take: 10, // Limit for performance
        orderBy: {
          createdAt: "desc",
        },
      },
      payment: {
        take: 10, // Limit for performance
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })



  return (
    <div className="">
      <EsevaSingleView esevaData={data} />
    </div>
  )
}

export default EsevaPage
