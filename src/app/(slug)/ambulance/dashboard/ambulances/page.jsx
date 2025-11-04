import React from "react";
import { AddAmbulanceVehicleDialog } from "./components/create-ambulance";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import AllAmbulancesData from "./components/ambulancedata";

const AmbulancePage = async () => {
  const session = await getSession();

  // Fallback: return null or a message if session/email is missing
  if (!session || !session.email) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Unable to fetch ambulance data. Please log in or refresh the page.
      </div>
    );
  }

  const ambulance = await db.ambulance.findFirst({
    where: {
      email: session.email,
    },
    select: {
      id: true,
      AmbulanceVaichicle: true,
    },
  });

  if (!ambulance) {
    return (
      <div className="p-6 text-center text-gray-500">
        No ambulance record found for your account.
      </div>
    );
  }

  return (
    <div>
      <AllAmbulancesData
        mainambulanceId={ambulance.id}
        ambulances={ambulance.AmbulanceVaichicle}
      />
    </div>
  );
};

export default AmbulancePage;
