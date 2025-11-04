import React from "react";
import { db } from "@/lib/db";
import AllPharmaciesList from "./components/allpharmacies";

const PharmacyPage = async () => {
  const data = await db.Pharmacy.findMany({
    include: {
      PharmacyCertificate: true, // Ensure approvalStatus is available
    },
  });

  // Transform data to match frontend expectations
  const transformedData = data.map((pharmacy) => ({
    ...pharmacy,
    approvalStatus:
      pharmacy.PharmacyCertificate.length > 0
        ? pharmacy.PharmacyCertificate[0].approvalStatus
        : "PENDING", // Default to PENDING if no certificate
  }));

  return (
    <div className="">
      <AllPharmaciesList userdata={transformedData} />
    </div>
  );
};

export default PharmacyPage;