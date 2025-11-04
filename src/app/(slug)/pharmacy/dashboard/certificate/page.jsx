import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import Certificate from "../../components/pharmacycertificate";

const DigitalHealthCardPage = async () => {
  const pharmacyUser = await getSession();

  // 🔹 Check if session exists
  if (!pharmacyUser || !pharmacyUser.email) {
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

  // 🔹 Fetch pharmacy data and include certificates
  const data = await db.pharmacy.findFirst({
    where: { email: pharmacyUser.email },
    include: {
      PharmacyCertificate: true,
      // Remove reviews since it doesn't exist in Pharmacy model
    },
  });

  // 🔹 If no pharmacy data found
  if (!data || !data.PharmacyCertificate.length) {
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

  // 🔹 Get the first certificate
  const certificate = data.PharmacyCertificate[0];

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
          <Link href="/pharmacy/dashboard/profile">
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