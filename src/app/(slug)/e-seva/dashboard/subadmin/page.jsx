import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import EsevaSubAdminProfileClient from "../../components/e-Seva-subadminprofile";

const EsevaSubAdminProfilePage = async () => {
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
    });

    if (!userdata) {
      // Handle case where Eseva data is not found
      return <div>User data not found. Please contact support.</div>;
    }

    // Fetch the count of  subadmins
    const activeSubAdminCount = await db.EsevaSubAdmin.count({
      where: {
        esevaId: userdata.id,
      },
    });
console.log(activeSubAdminCount)
    return (
      <EsevaSubAdminProfileClient
        esevaId={userdata.id}
        activeSubAdminCount={activeSubAdminCount}
        userdata={userdata}

      />
    );
  } catch (error) {
    console.error("Error loading Eseva profile:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default EsevaSubAdminProfilePage;
