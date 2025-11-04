import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import AllTreatmentsList from "../components/alltreatmentlist";
import { redirect } from "next/navigation";

const SurgeryPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    redirect("/hospital/login");
  }

  const data = await db.hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!data) {
    redirect("/hospital/login");
  }

  const treatmentdata = await db.Surgerytreatment.findMany({
    where: { hospitalId: data.id, type: "Treatment" },
  });

  return (
    <div>
      <AllTreatmentsList Treatments={treatmentdata} />
    </div>
  );
};

export default SurgeryPage;
