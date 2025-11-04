import React from "react";
import { db } from "@/lib/db";
import CorporateHealthEnqClient from "../../components/corporate-health-enqclient";

const CorporateHealthEnqPage = async () => {
  // Fetch the enquiries from the database
  const enquiries = await db.CorporateHealthEnq.findMany({
    // Add any filters or options as needed for your query
  });

  // Reverse the data before passing it to the component
  const reversedEnquiries = [...enquiries].reverse();

  return <CorporateHealthEnqClient enquiries={reversedEnquiries} />;
};

export default CorporateHealthEnqPage;
