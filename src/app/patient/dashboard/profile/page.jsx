import React from "react";
import PatientProfileEdit from "../components/patientprofile";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import PatientPreViewBeforeSubmit from "../components/patientpreviewbeforesubmit";

const PatientProfile = async () => {
  try {
    const patientUser = await getSession();

    if (!patientUser) {
      // Handle case where user is not logged in
      return <div>Please log in to view your profile.</div>;
    }

    const userdata = await db.Patient.findFirst({
      where: {
        email: patientUser.email,
      },
      include: {  Payment: true },
    });

    if (!userdata) {
      // Handle case where patient data is not found
      return <div>User data not found. Please contact support.</div>;
    }


    const [state, dist, subdist, data] = await Promise.all([
      db.state.findMany({}),
      db.district.findMany({}),
      db.SubDistrict.findMany({}),
      db.HealthCard.findUnique({
        where: { email: userdata.email },
      }),
    ]);

    // Conditional rendering
    const renderComponent = () => {
      if (!data) {
        // If no data, show the profile edit page
        return (
          <PatientProfileEdit
            userdata={userdata}
            state={state}
            dist={dist}
            subdist={subdist}
            data={null} // Pass null to handle this case in the component
          />
        );
      }

      switch (data.approvalStatus) {
        case "PENDING":
        case "REJECTED":
          return (
            <PatientProfileEdit
              userdata={userdata}
              state={state}
              dist={dist}
              subdist={subdist}
              data={data}
            />
          );
        case "SUBMITTED":
        case "APPROVED":
          return <PatientPreViewBeforeSubmit userdata={userdata} />;
        default:
          return <div>Unknown approval status. Please contact support.</div>;
      }
    };

    return <div>{renderComponent()}</div>;
  } catch (error) {
    console.error("Error loading patient profile:", error);
    return <div>Something went wrong. Please try again later.</div>;
  }
};

export default PatientProfile;
