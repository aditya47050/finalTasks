import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import EsevaDashboard from "../components/e-sevadashboard";

const page = async () => {
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/e-seva/login");
  }
  
  let userdata;

  if (session.role === "Eseva" || session.role === "Asha") {
    userdata = await db.Eseva.findUnique({
      where: { email: session.email },
      include: { 
        patients: true,
        subAdmins: session.role === "Eseva" ? true : false // Only include subAdmins for Eseva role
      },
    });
  } else if (session.role === "SubAdmin") {
    userdata = await db.EsevaSubAdmin.findUnique({
      where: { email: session.email },
      include: { 
        patients: true,
        eseva: {
          select: {
            name: true,
            esevacode: true,
            status: true,
            logo: true
          }
        }
      },
    });
  } else {
    redirect("/e-seva/login");
  }

  if (!userdata) {
    redirect("/e-seva/login");
  }

  return (
    <div>
      <EsevaDashboard data={userdata} role={session.role} />
    </div>
  );
};

export default page;