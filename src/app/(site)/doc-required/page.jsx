"use client";
import React, { useState } from "react";

const DocImportance = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
  title: "Patient Required Documents",
  description:
    "These documents are necessary for patient registration and identification.",
  points: [
    {
      title: "Aadhar Card",
      desc: "Unique identity and address proof for verification purposes.",
    },
    {
      title: "PAN Card (If Applicable)",
      desc: "Required for financial transactions and record-keeping.",
    },
    {
      title: "Health Insurance Details (If Applicable)",
      desc: "Provide insurance information for coverage and claims.",
    },
    {
      title: "ABHA ID",
      desc: "Ayushman Bharat Health Account for digital health records.",
    },
    {
      title: "Ayushman Card (If Applicable)",
      desc: "Applicable for Ayushman Bharat beneficiaries.",
    },
    {
      title: "Ration Card",
      desc: "Proof for certain subsidy and government benefit eligibility.",
    },
    {
      title: "E-KYC",
      desc: "Electronic verification for identity and authentication purposes.",
    },
    {
      title: "Cancelled Cheque (If Applicable)",
      desc: "Required for bank account verification and direct benefits.",
    },
    {
      title: "Income Certificate",
      desc: "Proof of income, if required for certain benefits or subsidies.",
    },
    {
      title: "Passport Size Photo",
      desc: "Recent photograph for identity and documentation purposes.",
    },
  ],
},
    {
  title: "E-Seva Required Documents",
  description:
    "E-Seva registration requires the following documents for verification and compliance purposes.",
  points: [
    {
      title: "Aadhar Card",
      desc: "Unique identity and address proof of the owner/manager.",
    },
    {
      title: "PAN Card",
      desc: "Required for taxation and financial transactions.",
    },
    {
      title: "Shop Act Certificate",
      desc: "Proof of registration under the Shop Act for legal compliance.",
    },
    {
      title: "Light Bill / Rental Agreement",
      desc: "Proof of business address, either electricity bill or rental agreement.",
    },
    {
      title: "Address Proof",
      desc: "Any valid document verifying the business address.",
    },
    {
      title: "Registration Certificate",
      desc: "Official certificate confirming the E-Seva center is registered.",
    },
    {
      title: "Cancelled Cheque / Bank Passbook",
      desc: "For verifying the bank account and facilitating payments.",
    },
    {
      title: "Logo Photo",
      desc: "Official logo of the E-Seva center for identification purposes.",
    },
    {
      title: "Passport Size Photo",
      desc: "Recent photograph of the incharge for documentation.",
    },
  ],
},

    {
  title: "Hospital Required Documents",
  description:
    "Hospitals need the following documents for compliance, verification, and registration purposes.",
  points: [
    {
      title: "Hospital Registration Certificate",
      desc: "Official document confirming the hospital's legal registration.",
    },
    {
      title: "NABH/NABL Certificate",
      desc: "Accreditation certificate for quality standards, if applicable.",
    },
    {
      title: "PAN Card Upload",
      desc: "Hospital PAN card for taxation and financial records.",
    },
    {
      title: "Cancelled Cheque / Bank Passbook",
      desc: "For verifying the hospital's bank account for transactions.",
    },
    {
      title: "Escalation Matrix",
      desc: "A document listing key contacts and escalation points for internal and external issues.",
    },
    {
      title: "Hospital Logo",
      desc: "Official hospital logo for branding and identification purposes.",
    },
  ],
},
   {
  title: "Doctor Required Documents",
  description:
    "Doctors must submit these documents for verification, registration, and appointment purposes.",
  points: [
    {
      title: "Aadhar Card",
      desc: "Unique identity and address proof for verification purposes.",
    },
    {
      title: "PAN Card",
      desc: "Required for taxation and financial record-keeping.",
    },
    {
      title: "Degree Certificate",
      desc: "Medical degree certificate proving qualifications.",
    },
    {
      title: "Registration Certificate",
      desc: "Registration with the Medical Council for practicing legally.",
    },
    {
      title: "Specialty Degree Certificate",
      desc: "Any additional specialization certifications obtained by the doctor.",
    },
    {
      title: "Cancelled Cheque / Bank Passbook",
      desc: "For verifying the doctor’s bank account for payments and reimbursements.",
    },
    {
      title: "Passport Size Photo",
      desc: "Recent photograph for identity and documentation purposes.",
    },
  ],
},
{
  title: "Ambulance Required Documents",
  description:
    "These documents are necessary for ambulance registration, verification, and compliance purposes.",
  points: [
    {
      title: "Aadhar Card",
      desc: "Unique identity and address proof for verification purposes.",
    },
    {
      title: "PAN Card",
      desc: "Required for taxation and financial record-keeping.",
    },
    {
      title: "Hospital Profile Image",
      desc: "Profile image of the hospital or ambulance provider.",
    },
    {
      title: "Hospital Registration Certificate",
      desc: "Proof of hospital registration for ambulance affiliation.",
    },
    {
      title: "Hospital PAN Card",
      desc: "PAN card of the hospital for financial verification.",
    },
    {
      title: "Cancelled Cheque / Bank Passbook",
      desc: "For verifying the hospital’s bank account for payments and reimbursements.",
    },
  ],
}


  ];

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const step = steps[currentStep - 1];

  return (
    <div className="min-[1000px]:max-w-4xl min-[1100px]:max-w-5xl xl:max-w-6xl md:container md:mx-auto  p-4 font-poppins">
      <div className="text-center mb-4">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
          {step.title}
        </h1>
        <p className="text-[#5271FF] mb-6 text-[16px]">{step.description}</p>
      </div>

      <div className="flex flex-col justify-between bg-white h-full xs:p-4 md:p-6 rounded-xl shadow-lg border border-gray-200">

        <ul className="space-y-6">
          {step.points.map((point, index) => (
            <li key={index}>
              <span className="font-bold">{point.title}:</span>
              {point.desc && (
                <p className="pl-6 border-l-4 border-gray-300 mt-1 text-black text-sm">
                  {point.desc}
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* Navigation Buttons */}
        <div className="flex items-end justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-full ${
              currentStep === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#2b73ec] text-white"
            }`}
          >
            Previous
          </button>
            <p className="text-center mt-4 text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </p>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className={`px-4 py-2 rounded-full ${
              currentStep === steps.length
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#2b73ec] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocImportance;
