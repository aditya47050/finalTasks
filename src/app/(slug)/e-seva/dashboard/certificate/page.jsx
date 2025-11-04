import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import Certificate from '../../components/e-sevaCertificate'

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

  // 🔹 Debug: Log the session to see user role
  console.log("Session User:", doctoruser);

  // 🔹 Determine user type and fetch appropriate data
  let userData = null;
  let certificates = [];
  let userType = "";

  // Check if user is Eseva center
  const esevaData = await db.Eseva.findFirst({
    where: { email: doctoruser.email },
    include: {
      ESevaCertificate: true
    },
  });

  if (esevaData) {
    userData = esevaData;
    certificates = esevaData.ESevaCertificate || [];
    userType = "Eseva";
  } else {
    // Check if user is SubAdmin
    const subAdminData = await db.EsevaSubAdmin.findFirst({
      where: { email: doctoruser.email },
      include: {
        ESevaSubAdminCertificate: true,
        eseva: true,
      },
    });

    if (subAdminData) {
      userData = subAdminData;
      certificates = subAdminData.ESevaSubAdminCertificate || [];
      userType = "SubAdmin";
    }
  }

  // 🔹 Debug: Log what we found
  console.log("User Type:", userType);
  console.log("User Data:", userData);
  console.log("Certificates:", certificates);

  // 🔹 If no user data found at all
  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">User Not Found</h2>
        <p className="text-gray-700 text-center mb-4">
          We couldn't find your account details.
        </p>
      </div>
    );
  }

  // 🔹 If no certificates found
  if (!certificates || certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">No Certificate Found</h2>
        <p className="text-gray-700 text-center mb-4">
          {userType === "SubAdmin" 
            ? "No certificates are associated with your sub-admin account. Certificates may be linked to the main E-Seva center."
            : "No certificates found for your E-Seva center."
          }
        </p>
        {userType === "SubAdmin" && userData.eseva && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">
              You are a sub-admin of: <strong>{userData.eseva.name}</strong>
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Contact the main E-Seva center for certificate access.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 🔹 Get the first certificate
  const certificate = certificates[0];

  // 🔹 If certificate is REJECTED
  if (certificate.approvalStatus === "REJECTED") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">Certificate Rejected</h2>
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
          <Link href="/e-seva/dashboard/profile">
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
          <Certificate 
            data={{
              ...userData,
              role: userType,
              parentEseva: userType === "SubAdmin" ? userData.eseva : null
            }} 
          />
        </div>
      ) : (
        <div className="flex flex-col mx-auto container rounded-[15px] items-center justify-center p-6 bg-white border border-yellow-200 shadow-md mt-6">
          <FaExclamationCircle className="text-yellow-500 text-6xl mb-4" />
          <h2 className="text-yellow-500 text-xl font-bold mb-2">Certificate Pending Approval</h2>
          <p className="text-gray-700 text-center mb-4">Your certificate is still awaiting approval.</p>
        </div>
      )}
    </div>
  );
};

export default DigitalHealthCardPage;