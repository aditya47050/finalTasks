import PathologyServicesComponent from "../components/pathologyservicescompo";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";

const PathologyServicesPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    redirect("/hospital/login");
  }
  // Mock hospital data for demonstration
  const hospital = await db.hospital.findFirst({
    where: { email: session.email },
  });
  if (!hospital) {
    redirect("/hospital/login");
  }
  // Fetch all pathology data
  const [labTests, wellnessPackages, bloodBank] = await Promise.all([
    db.labTest.findMany({
      where: { hospitalId: hospital.id },
    }),
    db.wellnesspackage.findMany({
      where: { hospitalId: hospital.id },
    }),
    db.bloodbank.findMany({
      where: { hospitalId: hospital.id },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <PathologyServicesComponent
        hospitalId={hospital.id}
        initialLabTests={labTests}
        initialWellnessPackages={wellnessPackages}
        initialBloodBank={bloodBank}
      />
    </div>
  );
};

export default PathologyServicesPage;
