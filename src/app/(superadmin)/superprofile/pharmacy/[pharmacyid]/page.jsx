import React from "react";
import { db } from "@/lib/db";
import PharmacySingleView from "../components/pharmacysingleview";

const PharmacyProfilePage = async ({ params }) => {
  const pharmacyId = params.pharmacyid;

  if (!pharmacyId) {
    return <p>Invalid pharmacy id</p>;
  }

  const pharmacy = await db.Pharmacy.findUnique({
    where: { id: pharmacyId },
    include: {
      PharmacyCertificate: true,
      Pharmacist: true,
      pharmacybranch: true,
    },
  });

  if (!pharmacy) {
    return <p>Pharmacy not found</p>;
  }

  return (
    <div>
      <PharmacySingleView userdata={pharmacy} />
    </div>
  );
};

export default PharmacyProfilePage;