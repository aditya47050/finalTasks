import React from "react";
import { db } from "@/lib/db";
import AarogyaMitraEnquiryClient from "../../components/aarogya-mitraclient";

const AarogyaMitraenq = async () => {
  // Fetch the enquiries from the database
  const enquiries = await db.AarogyaMitraEnq.findMany({
    // Add any filters or options as needed for your query
  });

  // Reverse the data before passing it to the component
  const reversedEnquiries = [...enquiries].reverse();

  return <AarogyaMitraEnquiryClient enquiries={reversedEnquiries} />;
};

export default AarogyaMitraenq;
