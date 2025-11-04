import React from "react";
import { db } from "@/lib/db";
import AmbulanceDetailsClient from "./components/ambulanceDetails";
import AmbulanceSingleViewClient from "./components/ambulanceDetails";
import { getSession } from "@/lib/getsession";

const AmbulanceDetailsPage = async ({ params }) => {
  const ambulanceid = params.ambulanceid;
  const session = await getSession();
  let loggeduserId = null;

  if (session?.email) {
    const user = await db.patient.findFirst({
      where: { email: session.email },
    });
    if (user) {
      loggeduserId = user.id;
    }
  }
  // Fetch all ambulance vehicles with their related data
  const ambulanceVehicles = await db.AmbulanceVaichicle.findFirst({
    where: { id: ambulanceid },
    include: {
      driver: true,
      BookAmbulance: true,
      ambulance: {
        include: {
          AmbulanceHsp: {
            include: {
              categories: {
                include: {
                  hspcategory: true, // Include HospitalsCategory
                },
              },
            },
          },
        },
      },
    },
  });

  if (!ambulanceVehicles || ambulanceVehicles.length === 0) {
    return <div>No ambulances found</div>;
  }


  const patientdata = await db.Patient.findMany({})

  return (
    <>
      <div className="">
        <AmbulanceSingleViewClient ambulanceData={ambulanceVehicles} loggeduserId={loggeduserId} patientdata={patientdata}/>
      </div>
    </>
  );
};

export default AmbulanceDetailsPage;
