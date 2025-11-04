import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import AllAmbulancesData from "../../dashboard/ambulances/components/ambulancedata";

const DriverAmbulancesPage = async () => {
  const session = await getSession();

  // Fallback: return null or a message if session/email is missing
  if (!session || !session.email) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Unable to fetch ambulance data. Please log in or refresh the page.
      </div>
    );
  }

  // Fetch the driver's ambulances
  const ambulanceDriver = await db.AmbulanceDriver.findUnique({
    where: { email: session.email },
    select: {
      id: true,
      AmbulanceVaichicle: true,
    },
  });

  if (!ambulanceDriver || ambulanceDriver.AmbulanceVaichicle.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No ambulance vehicles found for your account.
      </div>
    );
  }

  return (
    <div>
      <AllAmbulancesData
        ambulances={ambulanceDriver.AmbulanceVaichicle}
      />
    </div>
  );
};

export default DriverAmbulancesPage;