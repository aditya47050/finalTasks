import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import React from "react";
import ViewPatientsClient from "../../components/view-patients";

const ViewPatients = async () => {
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/e-seva/login");
  }

  // Check if user is Eseva
  const eseva = await db.Eseva.findUnique({
    where: { email: session.email },
    select: { id: true },
  });

  // If not Eseva, check if user is SubAdmin
  const subAdmin = !eseva
    ? await db.EsevaSubAdmin.findUnique({
        where: { email: session.email },
        select: { id: true, esevaId: true },
      })
    : null;

  if (!eseva && !subAdmin) {
    redirect("/e-seva/login");
  }

  let patients = [];

  if (eseva) {
    patients = await db.patient.findMany({
      where: {
        OR: [
          { esevaId: eseva.id },
          { subAdmin: { esevaId: eseva.id } },
        ],
      },
      include: { 
        healthcard: true,
        subAdmin: { select: { id: true, email: true, name: true } },
        Eseva: { select: { incharge: true } },
      },
    });
  } else if (subAdmin) {
    patients = await db.patient.findMany({
      where: { subAdminId: subAdmin.id },
      include: { 
        healthcard: true,
        subAdmin: { select: { id: true, email: true, name: true } } 
      },
    });
  }

  return (
    <div>
      <ViewPatientsClient patientsData={patients} />
    </div>
  );
};

export default ViewPatients;
