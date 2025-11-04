import React from "react";
import { db } from "@/lib/db";
import AllCorporatesList from "./components/allcorporates";

const CorporatePage = async () => {
  const data = await db.Corporate.findMany({
    include: {
      CorporateCertificate: true,
    },
  });

  const transformedData = data.map((corp) => ({
    ...corp,
    approvalStatus:
      corp.CorporateCertificate && corp.CorporateCertificate.length > 0
        ? corp.CorporateCertificate[0].approvalStatus
        : "PENDING",
  }));

  return (
    <div className="">
      <AllCorporatesList userdata={transformedData} />
    </div>
  );
};

export default CorporatePage;