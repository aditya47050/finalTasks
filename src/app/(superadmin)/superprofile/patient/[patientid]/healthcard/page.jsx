import React from "react";
import { db } from "@/lib/db";
import { FaExclamationCircle } from "react-icons/fa"; // For an error icon
import Link from "next/link";
import Healthcard from "../../components/healthcard";

const DigitalHealthCardPage = async ({ params }) => {
  const patientUser = await db.patient.findFirst({
    where: { id: params.patientid },
  });

  // Check if patientUser is defined

  const data = await db.HealthCard.findFirst({
    where: { email: patientUser.email },
    include: {
      patient: true, // Include the patient details
    },
  });

  // Check if data is found
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">
          No health card found
        </h2>
        <p className="text-gray-700 text-center mb-4">
          We {"couldn't"} find your health card details. Please try again later.
        </p>
      </div>
    );
  }

  if (data.approvalStatus === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">
          Health card rejected
        </h2>
        <p className="text-gray-700 text-center mb-4">
         Health card has been rejected. Below are the details and remarks:
        </p>

        {/* Displaying the remark if rejection occurred */}
      </div>
    );
  }

  return (
    <div>
      {data.approvalStatus === "APPROVED" ? (
        <Healthcard userdata={data} />
      ) : (
        <div className="flex flex-col mx-auto container rounded-[15px] items-center justify-center p-6 bg-white border border-yellow-200 shadow-md mt-6">
          <FaExclamationCircle className="text-yellow-500 text-6xl mb-4" />
          <h2 className="text-yellow-500 text-xl font-bold mb-2">
            Health card not approved
          </h2>
          <p className="text-gray-700 text-center mb-4">
            Your health card is still awaiting approval.
          </p>
        </div>
      )}
    </div>
  );
};

export default DigitalHealthCardPage;
