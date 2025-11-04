import { getSession } from "@/lib/getsession";
import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AllBranchesList from "../components/allbranchlist";

const HspbranchPage = async () => {
  const hospitaluser = await getSession();

  if (!hospitaluser) {
    redirect("/hospital/login");
  }
  const userdata = await db.Hospital.findFirst({
    where: {
      email: hospitaluser.email,
    },
    include: {hspbranches :true },
  });

  // Ensure userdata exists before accessing its properties
  if (!userdata) {
    redirect("/hospital/login");
  }


    const [state, dist, subdist ] = await Promise.all([
      db.state.findMany({}),
      db.district.findMany({}),
      db.SubDistrict.findMany({}),
     
    ]); 
   
  return (
    <div> <AllBranchesList userdata={userdata}    state={state}
    dist={dist}
    subdist={subdist}
   />
    </div>
  );
};

export default HspbranchPage;
