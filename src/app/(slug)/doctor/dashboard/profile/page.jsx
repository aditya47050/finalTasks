import React from "react";
import Doctorprofile from "../components/doctorprofileclient";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const DoctorprofilePage = async () => {
  const doctoruser = await getSession();

  if (!doctoruser) {
    redirect("/doctor/login");
  }
  const userdata = await db.Doctor.findFirst({
    where: {
      email: doctoruser.email,
    },
    include: {
      doctorinfo: true,
      specialities: {
        include: {
          speciality: true, // Fetch associated specialty details
        },
      },
    },
  });
  console.log(userdata);

  const specialitytype = await db.ExpertDoctorsCategory.findMany({});
  // Ensure userdata exists before accessing its properties
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
      <Doctorprofile
        userdata={userdata}
        specialitytype={specialitytype}
        state={state}
        dist={dist}
        subdist={subdist}
        data={null}
      />
    </div>
  );
};

export default DoctorprofilePage;
