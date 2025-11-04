import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import React from "react";
import ViewPatientsClient from "../../../components/step-2-viewpatients";

const ViewPatients = async ({ params }) => {
  const { patientId } = params;
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/e-seva/login");
  }

  let esevaId= null;
  let subAdminId= null;

  if (session.role === "SubAdmin") {
    // fetch subadmin
    const subAdmin = await db.esevaSubAdmin.findUnique({
      where: { email: session.email },
      include: { eseva: true },
    });
    if (!subAdmin) redirect("/e-seva/login");

    esevaId = subAdmin.esevaId;
    subAdminId = subAdmin.id;
  } else {
    // fetch eseva
    const eseva = await db.eseva.findUnique({
      where: { email: session.email },
    });
    if (!eseva) redirect("/e-seva/login");

    esevaId = eseva.id;
  }

  const patient = await db.patient.findFirst({
    where: {
      id: patientId,
      OR: [
        esevaId ? { esevaId } : undefined,
        subAdminId ? { subAdminId } : undefined,
      ].filter(Boolean),
    },
    include: { healthcard: true },
  });

  console.log(patient);

  return (
    <div>
      <ViewPatientsClient patientsData={patient} esevaId={esevaId} subadminId={subAdminId}/>
    </div>
  );
};

export default ViewPatients;
