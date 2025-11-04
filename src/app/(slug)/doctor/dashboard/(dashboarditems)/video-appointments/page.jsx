import React from "react";
import VideoCallDoctorDashboard from "../../components/doctor-videocall";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
const VideoAppointments = async () => {
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/doctor/login");
  }
  const doctor = await db.doctor.findUnique({
    where: {
      email: session?.email,
    },
    select: {
      id: true,
    },
  });
  if (!doctor) {
    redirect("/doctor/login");
  }
  return <VideoCallDoctorDashboard doctorId={doctor?.id} />;
};

export default VideoAppointments;
