"use client";
import React from "react";
import PatientActionsCell from "./esevafinalsubmit";
import PatientPreViewBeforeSubmit from "@/app/patient/dashboard/components/patientpreviewbeforesubmit";

const ViewPatientsClient = ({ patientsData  , esevaId , subadminId}) => {
  // Ensure patientsData is an array
  const data = Array.isArray(patientsData) ? patientsData : [patientsData];

  return (
    <div className="container mx-auto px-4 py-6 font-poppins">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Patient Details</h1>
      </div>

      {data.map((patient, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-lg mb-6 mx-auto lg:w-[900px] xl:w-[1200px] w-full max-w-[95%]"
        >
          {/* Patient Preview */}
          <div className="mb-6">
            <PatientPreViewBeforeSubmit FormData={patient} userdata={patient} />
          </div>

          {/* Actions Section */}
          <div className="border-t justify-center flex items-center pt-1">
            <div className="flex flex-wrap gap-4">
              <PatientActionsCell user={patient}   esevaId={esevaId}
                subAdminId={subadminId} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewPatientsClient;
