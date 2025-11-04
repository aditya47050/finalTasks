// app/ambulance/page.jsx
import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import AmbulanceDetailsClient from "./components/AmbulanceDetailsClient";

const AmbulancePage = async () => {
  const session = await getSession();

  if (!session?.email) {
    return (
      <div className="p-6 text-red-500 font-semibold text-center">
        Unable to fetch ambulance data. Please log in.
      </div>
    );
  }

  try {
    // 1. Get ambulance record for logged-in user
    const ambulance = await db.ambulance.findFirst({
      where: { email: session.email },
      select: {
        id: true,
        AmbulanceVaichicle: true,
      },
    });

    if (!ambulance) {
      return (
        <div className="p-6 text-gray-500 text-center">
          No ambulance record found for your account.
        </div>
      );
    }

    // 2. Fetch associated hospitals with status
    const hospitals = await db.hospitalAmbulance.findMany({
      where: { ambulanceId: ambulance.id },
      select: {
        status: true, // ✅ get approval status
        remark: true, // optional
        hospital: {
          select: {
            id: true,
            email: true,
            mobile: true,
            role: true,
            hspInfo: true,
            hspdetails: true,
            hspcontact: true,
          },
        },
      },
    });

    // Flatten hospital + status into one object
    const hospitalList = hospitals.map((h) => ({
      ...h.hospital,
      approvalStatus: h.status,
      remark: h.remark,
    }));

    return (
      <AmbulanceDetailsClient
        ambulanceId={ambulance.id}
        vehicles={ambulance.AmbulanceVaichicle || []}
        hospitals={hospitalList || []}
      />
    );
  } catch (error) {
    console.error("Error fetching ambulance data:", error);
    return (
      <div className="p-6 text-red-500 text-center">
        Something went wrong while fetching ambulance details.
      </div>
    );
  }
};

export default AmbulancePage;
