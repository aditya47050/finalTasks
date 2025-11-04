import React from "react";
import { db } from "@/lib/db";
import CorporateSingleView from "../components/corporatesingleview";

const CorporateProfilePage = async ({ params }) => {
  const corporateId = params.corporateid;

  if (!corporateId) return <p>Invalid corporate id</p>;

  const corporate = await db.Corporate.findUnique({
    where: { id: corporateId },
    include: { CorporateCertificate: true },
  });

  if (!corporate) return <p>Corporate not found</p>;

  return (
    <div>
      <CorporateSingleView userdata={corporate} />
    </div>
  );
};

export default CorporateProfilePage;