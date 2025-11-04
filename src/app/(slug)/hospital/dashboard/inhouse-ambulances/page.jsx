import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import HospitalAmbulanceList from "../components/all-inhouse-ambulances";

const AmbulancesPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
     console.error("Session or email is undefined.");
    return <div>Error: Unauthorized</div>;
  }
  // 🔹 Fetch hospital details based on session email
  const hospital = await db.Hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!hospital) {
    return <div>Hospital not found</div>;
  }

  // 🔹 Fetch all ambulances
  const ambulances = await db.Ambulance.findMany({
    select: { id: true, email: true, mobile: true, category: true },
  });

  // 🔹 Fetch hospital-ambulance assignments with status
  const hospitalAmbulances = await db.HospitalAmbulance.findMany({
    where: { hospitalId: hospital.id },
    select: { ambulanceId: true, status: true },
  });

  const assignedIds = hospitalAmbulances.map(a => a.ambulanceId);

  // 🔹 Merge ambulance info with status for assigned ambulances
  const assignedAmbulancesData = ambulances
    .filter(a => assignedIds.includes(a.id))
    .map(a => {
      const assignment = hospitalAmbulances.find(h => h.ambulanceId === a.id);
      return { ...a, status: assignment?.status || "PENDING" };
    });

  // 🔹 Unassigned ambulances
  const unassignedAmbulances = ambulances.filter(a => !assignedIds.includes(a.id));

  return (
    <div>
      <HospitalAmbulanceList
        hospitalId={hospital.id}
        ambulances={assignedAmbulancesData} 
        unassignedAmbulances={unassignedAmbulances} 
      />
    </div>
  );
};

export default AmbulancesPage;
