import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import React from "react";
import Casesphotographer from "../components/cases-photographer";

const CaseAssignedCampaigns = async () => {
  const session = await getSession();
  if (!session?.email) {
    return <div>Please login to view campaigns.</div>;
  }
  const user = await db.photographer.findUnique({
    where: { email: session.email },
    select: { id: true },
  });
  const data = await db.fundraisingCampaign.findMany({
    where: {
      photographerId: user.id,
    },
  });

  return (
    <div>
      <Casesphotographer fundraisingCampaign={data} />{" "}
    </div>
  );
};

export default CaseAssignedCampaigns;
