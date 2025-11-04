import React from "react";
import { db } from "@/lib/db";
import CareersEnqClient from "../../components/careerssite-enq-client";

const CareersSiteWnqPage = async () => {
  // Fetch the enquiries from the database
  const enquiries = await db.CareersSite.findMany({
    // Add any filters or options as needed for your query
  });

  // Reverse the data before passing it to the component
  const reversedEnquiries = [...enquiries].reverse();

  return <CareersEnqClient careers={enquiries}/> ;
};

export default CareersSiteWnqPage;
