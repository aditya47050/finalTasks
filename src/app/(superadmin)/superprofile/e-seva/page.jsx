import { db } from "@/lib/db";
import AllEsevaList from "../e-seva/[esevaid]/components/allesevaList";

const EsevaPage = async () => {
  try {
    const esevaData = await db.Eseva.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        patients: {
          take: 5, // Limit to first 5 patients for performance
        },
        payment: {
          take: 10, // Limit to recent 10 payments
          orderBy: {
            createdAt: "desc",
          },
        },
        subAdmins: {
          include: {
            patients: true, // SubAdmin’s patients
            payments: true, // SubAdmin’s payments
          },
          orderBy: { createdAt: "desc" },
        },
        subAdminPayments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const states = await db.State.findMany();
    const districts = await db.District.findMany();
    const talukas = await db.SubDistrict.findMany();

    return (
      <div className="">
        <AllEsevaList
          esevaData={esevaData}
          states={states || []}
          dist={districts || []}
          taluka={talukas || []}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching E-seva data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
};

export default EsevaPage;
