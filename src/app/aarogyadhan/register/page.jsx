import React from "react";
import AarogyaDhanRegister from "../components/dhan-register";
import { db } from "@/lib/db";

const AarogyadhanRegisterPage = async () => {
  const userdata = await db.patient.findMany({});
  
  return (
    <div>
      {" "}
      <AarogyaDhanRegister userData={userdata} />{" "}
    </div>
  );
};

export default AarogyadhanRegisterPage;
