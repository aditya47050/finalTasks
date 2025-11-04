import React from "react";
import DiagnosticBookingsClient from "../components/diagnosticbookings";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

const DiagnosticBookingsPage = async () => {
  // 1️⃣ Get the logged-in session
  const session = await getSession();

  if (!session || !session.email) {
    // No session -> show unauthorized
    return <div>Unauthorized</div>;
  }

  // 2️⃣ Find the logged-in diagnostic center
  const user = await db.Hospital.findFirst({
    where: { email: session.email, role: "DiagnosticCenter" },
    select: { id: true },
  });

  if (!user) {
    // No matching diagnostic center
    return <div>Access Denied</div>;
  }

  // 3️⃣ Fetch bookings for this diagnostic center only
  const userdata = await db.bookDiagnosticService.findMany({
    where: {
      service: {
        hospitalId: user.id, 
      },
    },
    include: {
      patient: true,
      service: true,
    },
  });
  

  // 4️⃣ Render client component
  return <DiagnosticBookingsClient userdata={userdata} />;
};

export default DiagnosticBookingsPage;
