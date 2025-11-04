import React from "react";
import { db } from "@/lib/db";
import AllPatientsdata from "./components/allpatients";

const Patientpage = async () => {
  const data = await db.Patient.findMany({
    include: { Payment: true },
  });

  return (
    <div>
      <AllPatientsdata userdata={data} />
    </div>
  );
};

export default Patientpage;
