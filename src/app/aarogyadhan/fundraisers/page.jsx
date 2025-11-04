import { db } from "@/lib/db";
import React from "react";
import Fundraiserclient from "../components/fundraiserslist";

const FudraisersPage = async () => {
  const data = await db.fundraisingCampaign.findMany({});

  return (
    <div>
      <Fundraiserclient data={data} />
    </div>
  );
};

export default FudraisersPage;
