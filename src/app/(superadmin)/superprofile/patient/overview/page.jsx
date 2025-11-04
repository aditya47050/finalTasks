import React from "react";
import { db } from "@/lib/db";
import FilterswithGraphClient from "./components/filterwithgraph";

const OverviewPage = async () => {
  const data = await db.patient.findMany(); // Ensure "patient" matches your Prisma schema

  return <FilterswithGraphClient userdata={data} />;
};

export default OverviewPage;
