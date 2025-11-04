
import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { FaExclamationCircle } from "react-icons/fa"; // Error icon
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa"; // Success icon
import Certificate from "../components/hospitalcertificate";

const DigitalHealthCardPage = async () => {
  const doctoruser = await getSession();

  // 🔹 Check if session exists
  if (!doctoruser || !doctoruser.email) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 rounded-xl shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">No session found</h2>
        <p className="text-gray-700 text-center mb-4">
          Please log in to view your digital certificate.
        </p>
      </div>
    );
  }

  // 🔹 Fetch doctor data and include certificates
  const data = await db.Hospital.findFirst({
    where: { email: doctoruser.email },
    include: {
      HospitalCertificate: true, // Fetch certificates
      hspdetails: true,
      hspcontact: true,
      reviews: true,
      hspInfo: {
        include: {
          hspcategory: {
            include: { hspcategory: true, diagnosticcategory: true },
          },
        },
      },
    },
  });

  // 🔹 If no doctor data found
  if (!data || !data.HospitalCertificate.length) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">No Certificate found</h2>
        <p className="text-gray-700 text-center mb-4">
          We {"couldn't"} find your certificate details. Please try again later.
        </p>
      </div>
    );
  }

  // 🔹 Get the first certificate (assuming one per doctor)
  const certificate = data.HospitalCertificate[0];

  // 🔹 If certificate is REJECTED
  if (certificate.approvalStatus === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">Certificate rejected</h2>
        <p className="text-gray-700 text-center mb-4">
          Your certificate has been rejected. Below are the details and remarks:
        </p>

        {/* Display remarks */}
        {certificate.remarks && (
          <div className="bg-red-100 text-red-700 rounded-xl p-4 mt-4">
            <h3 className="font-semibold mb-2">Rejection Remarks:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {certificate.remarks.split(",").map((remark, index) => (
                <li key={index} className="text-sm">{remark.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <Link href="/doctor/dashboard/profile">
            <span className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              Go to Profile
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {certificate.approvalStatus === "APPROVED" ? (
        <div className="">
          {/* <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h2 className="text-green-500 text-xl font-bold mb-2">Certificate Approved</h2>
          <p className="text-gray-700 text-center mb-4">Your certificate has been successfully approved.</p> */}
          <Certificate data={data}/>
        </div>
      ) : (
        <div className="flex flex-col mx-auto container rounded-[15px] items-center justify-center p-6 bg-white border border-yellow-200 shadow-md mt-6">
          <FaExclamationCircle className="text-yellow-500 text-6xl mb-4" />
          <h2 className="text-yellow-500 text-xl font-bold mb-2">Certificate Not Approved</h2>
          <p className="text-gray-700 text-center mb-4">Your certificate is still awaiting approval.</p>
        </div>
      )}
    </div>
  );
};

export default DigitalHealthCardPage;
