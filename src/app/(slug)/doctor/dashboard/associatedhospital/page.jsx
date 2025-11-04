import { getSession } from "@/lib/getsession";
import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AssociatedHospitals from "../components/AssociatedHospitalsList";

const AssociatedHospitalPage = async () => {
  const doctoruser = await getSession();

  if (!doctoruser) {
    redirect("/doctor/login");
  }

  const userdata = await db.Doctor.findFirst({
    where: {
      email: doctoruser.email,
    },
    include: {
      HospitalDoctor: {
        select: {
          id: true,
          status: true,
          remark: true,
          approvedBy: true,
          approvedAt: true,
          consultationDays: true, 
          consultationTime: true,
          hospital: {
            include: {
              hspcontact: true,
              hspdetails: true,
              hspbranches: true,
              hspInfo: true,
            },
          },
        },
      },
    },
  });

  if (!userdata) {
    redirect("/doctor/login");
  }

  const [state, dist, subdist, data] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
    db.HealthCard.findUnique({ where: { email: userdata.email } }),
  ]);

  const associatedHospitals =
    userdata.HospitalDoctor?.map((hd) => ({
      ...hd.hospital,
      approvalStatus: hd.status,
      remark: hd.remark,
      approvedBy: hd.approvedBy,
      approvedAt: hd.approvedAt,
      hospitalDoctorId: hd.id,
      consultationDays: hd.consultationDays, 
      consultationTime: hd.consultationTime,
    })) || [];

  return (
    <div>
      <AssociatedHospitals
        userdata={{ ...userdata, associatedHospitals }}
        state={state}
        dist={dist}
        subdist={subdist}
        data={data}
      />
    </div>
  );
};

export default AssociatedHospitalPage;
