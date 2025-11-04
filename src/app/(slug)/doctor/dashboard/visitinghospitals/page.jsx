// src/app/doctor/dashboard/visitinghospitals/page.jsx
import { getSession } from "@/lib/getsession";
import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AllHospitalsList from "../components/visitinghospitals";

const VisitingHospitalPage = async () => {
  const doctoruser = await getSession();

  if (!doctoruser) {
    redirect("/doctor/login");
  }

  const userdata = await db.Doctor.findFirst({
    where: {
      email: doctoruser.email,
    },
    include: {
      doctorvisitinghospitals: true, // ✅ this gives you hospitals
    },
  });

  if (!userdata) {
    redirect("/doctor/login");
  }

  const [state, dist, subdist, data] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
    db.HealthCard.findUnique({
      where: { email: userdata.email },
    }),
  ]);

  return (
    <div>
      <AllHospitalsList
        userdata={userdata}   // ✅ no mergedHospitals
        state={state}
        dist={dist}
        subdist={subdist}
        data={data}
      />
    </div>
  );
};

export default VisitingHospitalPage;
