import { getSession } from "@/lib/getsession";
import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AllBedsList from "./components/allbedtypes";
import BedManagement from "./components/rooms";

const HspBedPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/hospital/login");
  }
  const user = await db.Hospital.findFirst({
    where: { email: session.email },
    select: { id: true, Bed: true },
  });

  // Ensure userdata exists before accessing its properties
  if (!user) {
    redirect("/hospital/login");
  }
  const beddata = await db.BedCategory.findMany({
    where : { hospitalId : user.id},
    include : {beds :true}
  })


  return (
    <div className="md:container">
      <BedManagement userdata={user} beddata={beddata} />{" "}
    </div>
  );
};

export default HspBedPage;
