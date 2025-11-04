import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ComprehensiveEsevaPatientRegister from "../../components/e-seva-patient-register";

const page = async () => {
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/e-seva/login");
  }

  let esevaId = null;
  let subAdminId = null;

  if (session.role === "SubAdmin") {
    // fetch subadmin
    const subAdmin = await db.EsevaSubAdmin.findUnique({
      where: { email: session.email },
      include: { eseva: true },
    });
    if (!subAdmin) redirect("/e-seva/login");

    esevaId = subAdmin.esevaId;
    subAdminId = subAdmin.id;
  }else {
    // fetch eseva
    const eseva = await db.Eseva.findUnique({
      where: { email: session.email },
    });
    if (!eseva) redirect("/e-seva/login");

    esevaId = eseva.id;
  }

  const [state, dist, subdist] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
  ]);
  return (
    <div>
      <ComprehensiveEsevaPatientRegister
        states={state}
        districts={dist}
        subDistricts={subdist}
        esevaId={esevaId}
        subAdminId={subAdminId} 
        role={session.role} 
      />
    </div>
  );
};

export default page;
