import { getSession } from "@/lib/getsession";
import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AmbulanceProfile from "./profileclient";

const AmbulanceOwnerProfilePage = async () => {
  const owner = await getSession();

  if (!owner) {
    redirect("/ambulance/login");
  }
  const userdata = await db.Ambulance.findFirst({
    where: {
      email: owner.email,
    },
    include: {
      AmbulanceHsp: true,
    },
  });

  // Ensure userdata exists before accessing its properties
  if (!userdata) {
    redirect("/ambulance/login");
  }
  const [state, dist, subdist ,hspcategory] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
    db.HospitalsCategory.findMany({})
  ]);


  
   return (
    <div>
      <AmbulanceProfile
        state={state}
        dist={dist}
        subdist={subdist}
        userdata={userdata}
        hspcategory={hspcategory}
      />
    </div>
  );
};

export default AmbulanceOwnerProfilePage;
