import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import EsevaProfileClient from "../../components/e-seva-profileclient";

const EsevaProfilePage = async () => {
  try {
    const esevaUser = await getSession();

    if (!esevaUser) {
      // Handle case where user is not logged in
      return <div>Please log in to view your profile.</div>;
    }

    const userdata = await db.Eseva.findFirst({
      where: {
        email: esevaUser.email,
      },
      include :{payment:true}
    });

    if (!userdata) {
      // Handle case where Eseva data is not found
      return <div>User data not found. Please contact support.</div>;
    }
    const [state, dist, subdist] = await Promise.all([
      db.state.findMany({}),
      db.district.findMany({}),
      db.SubDistrict.findMany({}),
    ]);

    return (
      <EsevaProfileClient
        userdata={userdata}
        states={state}
        districts={dist}
        subDistricts={subdist}
        esevaId={userdata.id}
     
      />
    );
  } catch (error) {
    console.error("Error loading Eseva profile:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default EsevaProfilePage;
