import React from "react";
import { db } from "@/lib/db";
import HSPPortalClient from "../../components/hspportalenq";

const HSPPortalEnqPage = async () => {
  const enquiries = await db.HspPortalEnq.findMany({});

  const reversedEnquiries = [...enquiries].reverse();

  return (
    <>
      <HSPPortalClient enquiries={enquiries} />
    </>
  );
};

export default HSPPortalEnqPage;
