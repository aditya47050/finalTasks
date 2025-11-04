import { getSession } from "@/lib/getsession";
import React from "react";
import HospitalProfile from "../components/profileclient";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const HospitalProfilePage = async () => {
  const hospitaluser = await getSession();

  if (!hospitaluser) {
    redirect("/hospital/login");
  }
  const userdata = await db.Hospital.findFirst({
    where: {
      email: hospitaluser.email,
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

  // Ensure userdata exists before accessing its properties
  if (!userdata) {
    redirect("/hospital/login");
  }
  const hspcategory = await db.HospitalsCategory.findMany({});
  const diagnosticcategory = await db.DiagnosticCenterCategory.findMany({});
  const [state, dist, subdist] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
  
  ]);
  return (
    <div>
      <HospitalProfile userdata={userdata} hspcategory={hspcategory} diagnosticcategory={diagnosticcategory} state={state} dist={dist} subdist={subdist}/>
    </div>
  );
};

export default HospitalProfilePage;
