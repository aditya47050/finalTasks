import React from "react";
import { db } from "@/lib/db";
import AarogyaDhanEnqClient from "../../components/aarogya-dhan-enq-client";

const AarogyaDhanEnqPage = async () => {
  // Fetch the enquiries from the database
  const enquiries = await db.AarogyadhanEnq.findMany({
    // Add any filters or options as needed for your query
  });

  // Reverse the data before passing it to the component
  const reversedEnquiries = [...enquiries].reverse();

  return <AarogyaDhanEnqClient enquiries={enquiries}/> ;
};

export default AarogyaDhanEnqPage;
