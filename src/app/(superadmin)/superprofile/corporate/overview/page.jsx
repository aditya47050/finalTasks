import React from "react";
import { db } from "@/lib/db";
import CorporateOverviewClient from "../components/client";

const CorporateOverviewPage = async () => {
  const data = await db.Corporate.findMany({
    include: {
      CorporateCertificate: true,
    },
  });

  const transformedData = data.map((corp) => ({
    ...corp,
    approvalStatus: corp.CorporateCertificate?.[0]?.approvalStatus || "PENDING",
  }));

  return (
    <div>
      <CorporateOverviewClient userdata={transformedData} />
    </div>
  );
};

export default CorporateOverviewPage;