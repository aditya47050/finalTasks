import React from "react";

const BenefitsToLabs = () => {
  return (
    <>
      <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6">
        <div className="justify-center text-center mb-2">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-poppins font-extrabold">
            <span className="shadow-inherit">Benefits to Labs</span>
          </h1>
        </div>
        <div>
          <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 font-poppins rounded-xl shadow-lg max-w-6xl border border-gray-200">
            <p>
              <span className="font-bold">1. APPOINTMENT MANAGEMENT:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">
                Get appointments for patients from various associate GPs,
                consultants, and hospitals in a uniform format.
              </li>
            </ul>

            <p>
              <span className="font-bold">2. SCHEME OFFERINGS:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">
                Offers different schemes to patients and doctors.
              </li>
            </ul>

            <p>
              <span className="font-bold">3. IMPROVED COMMUNICATION:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">
                Improves communication in the referral management system.
              </li>
            </ul>

            <p>
              <span className="font-bold">4. ONLINE REPORT SHARING:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">
                Reports are collected and shared online with patients, doctors,
                and hospitals.
              </li>
            </ul>

            <p>
              <span className="font-bold">5. REFERRAL NOTES:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">
                Referral and clinical notes are received online from associated
                doctors and hospitals.
              </li>
            </ul>

            <p>
              <span className="font-bold">6. INTER OFFICE COMMUNICATION:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">Helpful for inter-office communication.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BenefitsToLabs;
