"use client";
import React, { useState } from "react";

const DocImportance = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-[1000px]:max-w-4xl min-[1100px]:max-w-5xl xl:max-w-6xl font-poppins md:container md:mx-auto min-h-screen p-0 md:p-6 items-center justify-center">
      {currentStep === 1 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-4 md:p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Aadhar Card Document Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            The Aadhar card is an essential document in India, issued by the
            Unique Identification Authority of India (UIDAI). It serves as a
            unique identification for residents and is recognized nationwide.
            Below are the key points highlighting its importance:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Unique Identity Verification
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  The Aadhar card contains a unique 12-digit identification
                  number linked to biometric and demographic data.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  It helps in authenticating the identity of residents
                  effectively.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Government Subsidies and Benefits
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">LPG Subsidy:</span> Direct
                  benefit transfer of LPG subsidies to Aadhar-linked bank
                  accounts.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">
                    PDS (Public Distribution System):
                  </span>{" "}
                  Ensures food and essentials reach intended beneficiaries.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">MNREGA:</span> Wages for
                  workers directly into Aadhar-linked bank accounts.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Financial Services
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Bank Account Opening:</span>{" "}
                  Aadhar simplifies KYC processes for opening bank accounts.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">
                    Direct Benefit Transfer (DBT):
                  </span>{" "}
                  Ensures subsidies and pensions reach intended recipients.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Digital Identity and Services
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">e-KYC:</span> Facilitates
                  electronic verification for services like SIM cards, loans,
                  and insurance.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">DigiLocker Integration:</span>{" "}
                  Secure storage and online access to important documents.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Health Services
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Streamlines health insurance schemes and digital health records.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Mobile and Telecom Services
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Simplifies mobile SIM card verification and activation.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Key Advantages
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Efficiency:</span> Reduces
                  paperwork and simplifies service delivery.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Transparency:</span> Minimizes
                  fraud and ensures benefits reach the intended recipients.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Inclusivity:</span> Provides a
                  recognized identity for all individuals.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Challenges
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Privacy Concerns:</span>{" "}
                  Secure handling of sensitive personal data is essential.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Digital Divide:</span>{" "}
                  Ensuring accessibility for rural and less tech-savvy
                  populations.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            Despite challenges, Aadhar has become a cornerstone of governance
            and service delivery in India, transforming how residents interact
            with both the government and private service providers.{" "}
          </p>
          <div className="flex justify-center flex-wrap md:flex-nowrap mt-4">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            PAN Card Document Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            The PAN (Permanent Account Number) card is a crucial document in
            India, issued by the Income Tax Department under the supervision of
            the Central Board of Direct Taxes (CBDT). It plays a significant
            role in financial transactions and income tax compliance. Below are
            the reasons for its importance:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Unique Financial Identification
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  The PAN is a unique 10-character alphanumeric identifier
                  assigned to individuals, businesses, and entities.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  It ensures the identification of taxpayers and tracks their
                  financial transactions.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Professional Use
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Invoice Generation: PAN ensures the legitimacy of business
                  dealings.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Bank Account and Loan Applications
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Required when applying for health loans.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  It helps financial institutions assess the creditworthiness of
                  applicants.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Proof of Identity
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  The PAN card is recognized as a valid identity proof for
                  various purposes, including:
                </li>
                <ul className="list-disc list-inside text-black lg:ml-4 ml-3 space-y-1">
                  <li>Transfer Medical Funds</li>
                  <li>Applying for Medical Funds</li>
                  <li>Enrolling in Financial Services</li>
                </ul>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Employment and Salary
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Employers require PAN for salary payments and TDS deductions.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  PAN ensures that salaried individuals comply with tax
                  obligations.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Healthcare benefits depend upon employment and salary
                  structure.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Legal Compliance
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                PAN is essential for judicial affidavits, forming partnerships,
                or entering into contracts involving significant monetary
                transactions.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Key Benefits
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Prevents Tax Evasion:</span>{" "}
                  By linking financial transactions, PAN ensures accountability
                  and transparency in tax payments.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">
                    Ease of Financial Transactions:
                  </span>{" "}
                  PAN simplifies compliance and reduces procedural complexities.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">
                    Proof of Legitimate Income:
                  </span>{" "}
                  Acts as a record of one’s income and financial dealings.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Convenience:</span> Universal
                  applicability across banks, businesses, and other
                  institutions.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Challenges
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Fraudulent Use:</span>{" "}
                  Instances of misuse of PAN have been reported, requiring
                  robust security measures.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">
                    Complexity for Non-Filers:
                  </span>{" "}
                  Non-taxpayers may find it cumbersome to navigate PAN-related
                  formalities.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            The PAN card is indispensable for anyone earning income or
            conducting financial transactions in India. It ensures compliance
            with tax laws and facilitates smooth interaction with banks,
            businesses, and government authorities.  
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Health Insurance Document Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            Health insurance is a crucial financial tool that provides
            protection against unexpected medical expenses and ensures access to
            quality healthcare. Here are the key reasons why health insurance is
            important:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Financial Protection against Medical Costs
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Covers hospitalization expenses, including room charges,
                  surgeries, and diagnostics.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Reduces the financial burden of high medical bills, ensuring
                  peace of mind during health emergencies.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Protects savings from being depleted due to unexpected medical
                  crises.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Access to Quality Healthcare
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Provides access to private hospitals and advanced medical
                  facilities that may otherwise be unaffordable.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Encourages timely treatment by reducing out-of-pocket
                  expenses.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Coverage for Rising Healthcare Costs
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Healthcare expenses are increasing due to inflation and
                  advancements in medical technology.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Health insurance ensures individuals and families can afford
                  treatments without compromising on quality.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Preventive Care and Wellness Benefits
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Many plans cover annual health check-ups, vaccinations, and
                  preventive screenings.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Encourages proactive health management to identify potential
                  health risks early.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Critical Illness Coverage
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Some policies offer coverage for life-threatening illnesses
                  such as cancer, heart disease, or organ failure.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Provides a lump sum benefit for treatment and associated
                  costs.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Tax Benefits
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Premiums paid for health insurance qualify for tax deductions
                  under Section 80D of the Income Tax Act.
                </li>
                <ul className="list-disc list-inside text-black lg:ml-4 ml-3 space-y-1">
                  <li>
                    For Individuals: Up to ₹25,000 (₹50,000 for senior
                    citizens).
                  </li>
                  <li>
                    Additional benefits for purchasing insurance for family
                    members.
                  </li>
                </ul>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Cashless Hospitalization
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Policyholders can avail of cashless treatment at network
                  hospitals, eliminating the need to arrange funds during
                  emergencies.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Simplifies the claims process by directly settling bills with
                  the hospital.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Maternity and Newborn Benefits
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Some plans cover maternity-related expenses, prenatal care,
                  and newborn care.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Helps manage costs associated with childbirth and child care.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Protection for the Entire Family
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Family floater policies provide coverage for all family members
                under a single plan. Ensures the health and safety of
                dependents, including children and elderly parents.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Peace of Mind
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Offers reassurance that medical expenses will not disrupt
                financial stability. Reduces stress during medical emergencies
                by providing a safety net.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Covers Pre- and Post-Hospitalization Costs
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Includes expenses incurred before hospitalization, such as
                diagnostic tests, and after discharge, like follow-up visits and
                medications.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Tailored Plans for Specific Needs
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Options available for individuals, families, senior citizens,
                  and corporate employees.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Policies can be customized to include add-ons like critical
                  illness cover, accident benefits, and global treatment
                  coverage.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                13. Key Benefits
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Comprehensive Coverage:</span>{" "}
                  Covers a wide range of medical needs, including surgeries,
                  treatments, and preventive care.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Savings Preservation:</span>{" "}
                  Ensures that {"life's"} savings are not eroded by unexpected
                  medical emergencies.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Long-Term Security:</span>{" "}
                  Offers financial stability and a reliable healthcare backup.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                14. Challenges without Health Insurance
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Out-of-pocket expenses for major treatments can lead to debt
                  or financial strain.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Limited access to timely and quality medical care due to cost
                  concerns.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Dependence on savings or borrowing during emergencies.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, health insurance is a critical investment that
            safeguards financial health and ensures timely medical care. It is
            essential for individuals and families to choose the right plan
            based on their needs, ensuring a healthier and more secure future.{" "}
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 4 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Ration Card Document Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            A Ration Card is a government-issued document that serves as both an
            identity and a tool to access subsidized food and other essentials
            under the Public Distribution System (PDS). It is a lifeline for
            economically weaker sections of society. Here are the key reasons
            for its importance:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Access to Subsidized Food and Essentials
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Enables households to free essentials such as protein foods
                  for mothers & baby (as per terms & conditions).
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Helps combat hunger and malnutrition among low-income
                  families.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensures the distribution of food grains under schemes like the
                  National Food Security Act (NFSA).
                </li>
              </ul>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Categorization of Economic Status
              </h2>
              <p className="text-black mb-2">
                Different types of ration cards (e.g., BPL, APL, Antyodaya)
                categorize households based on their income level:
              </p>
              <ul className="list-disc list-inside text-black lg:ml-4 ml-3 space-y-1">
                <li>
                  <span className="font-semibold">
                    BPL (Below Poverty Line):
                  </span>{" "}
                  For families living below the poverty line.
                </li>
                <li>
                  <span className="font-semibold">
                    APL (Above Poverty Line):
                  </span>{" "}
                  For families above the poverty line but still eligible for
                  certain benefits.
                </li>
                <li>
                  <span className="font-semibold">
                    Antyodaya Anna Yojana (AAY):
                  </span>{" "}
                  For the poorest households.
                </li>
              </ul>
              <p className="text-black mt-2">
                This categorization helps the government target welfare schemes
                effectively.
              </p>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Access to Government Schemes
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Acts as an eligibility document for various state and central
                  government welfare programs, including:
                </li>
                <ul className="list-disc list-inside text-black lg:ml-4 ml-3 space-y-1">
                  <li>Healthcare Financial benefits for people.</li>
                  <li>
                    Healthcare Government Schemes benefits for people such as
                    PMJAY & State Level Schemes.
                  </li>
                </ul>
              </ul>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Disaster Relief and Emergency Support
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                During natural disasters or pandemics, ration cards are used to
                distribute relief materials and emergency supplies.
              </p>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Digital Integration
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Many states have digitized ration cards, making it easier for
                  families to access PDS benefits and track their entitlements
                  online.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Linking the ration card with Aadhar prevents fraud and ensures
                  that benefits reach the intended recipients.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Portability under One Nation, One Ration Card (ONORC)
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                The ONORC scheme allows ration cardholders to access subsidized
                food grains across the country, ensuring support for migrant
                workers and their families.
              </p>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Reducing Economic Inequality
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Ration cards play a vital role in reducing economic disparities
                by providing affordable food and other essentials to low-income
                families.
              </p>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Challenges without a Ration Card
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ineligibility for subsidized food grains and government
                  schemes.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Difficulty in establishing identity or residence for certain
                  services.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Increased financial burden on low-income households.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Types of Ration Cards in India
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">BPL Card:</span> For families
                  below the poverty line.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">APL Card:</span> For families
                  above the poverty line.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">AAY Card:</span> For the
                  poorest and most vulnerable families.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">
                    Priority Household (PHH) Card:
                  </span>{" "}
                  For families eligible under the NFSA.
                </li>
              </ul>
            </div>
            <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
              In conclusion, the ration card is more than a document- it is a
              social equalizer that ensures food security, supports poverty
              alleviation, and facilitates the delivery of various welfare
              schemes. It remains a cornerstone of India’s efforts to build an
              inclusive and equitable society.
            </p>
            ``
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, the ration card is more than a document—it is a
            social equalizer that ensures food security, supports poverty
            alleviation, and facilitates the delivery of various welfare
            schemes. It remains a cornerstone of India’s efforts to build an
            inclusive and equitable society.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 5 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            PMJAY Card Document Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            The PMJAY card, also known as the Ayushman Card, is a key component
            of the Pradhan Mantri Jan Arogya Yojana (PMJAY). This flagship
            health insurance scheme by the Government of India aims to provide
            affordable healthcare to economically weaker sections. {"Here's"}{" "}
            why the PMJAY card is important:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Access to Free Healthcare
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Provides cashless and paperless access to secondary and
                  tertiary healthcare services in impaneled hospitals.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Beneficiaries are eligible for a health cover of up to ₹5
                  lakhs per family per year for hospitalization expenses.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Financial Protection from Medical Expenses
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Helps families avoid the financial burden of high medical
                  bills, especially for critical illnesses or surgeries.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Reduces out-of-pocket healthcare expenditures, preserving
                  savings for other needs.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Wide Coverage
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Covers more than 1,500 medical conditions, including
                  surgeries, cancer treatments, and heart ailments.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Includes diagnostics, pre-hospitalization (up to 3 days), and
                  post-hospitalization (15 days) expenses.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Nationwide Applicability
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                The card is valid across the country, ensuring beneficiaries can
                access healthcare in any impaneled hospital, whether in their
                home state or while traveling.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Impaneled Public and Private Hospitals
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                The scheme includes a wide network of impaneled hospitals, both
                public and private, ensuring access to quality healthcare
                services.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Inclusive Eligibility
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Targets economically weaker sections based on the
                  Socio-Economic Caste Census (SECC) 2011 data.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  No restrictions on family size, age, or gender, ensuring
                  comprehensive coverage for all family members.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Priority for Vulnerable Groups
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Specifically designed for vulnerable groups such as landless
                  laborers, urban and rural poor, and families without proper
                  shelter or livelihood.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Encourages Preventive and Curative Care
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Promotes health-seeking behavior by making treatments affordable
                and accessible, preventing delays in seeking medical care due to
                financial constraints.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Simplified Procedures
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Beneficiaries can show their card at impaneled hospitals for
                  cashless treatment.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Digital records and portability ensure easy verification and
                  faster services.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Focus on Women and Children
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Provides special benefits for maternal and newborn care,
                ensuring access to healthcare for vulnerable groups such as
                pregnant women and children.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Boost to Healthcare Infrastructure
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Encourages private hospitals to join the network and improves
                healthcare access in remote and underserved areas, facilitating
                better infrastructure through increased demand.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Digital Integration and Transparency
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                A robust IT platform ensures efficient tracking of claims,
                payments, and utilization, reducing fraud and ensuring that
                benefits reach the intended beneficiaries.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                13. Challenges without the PMJAY Card
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Families might face financial hardships during medical
                  emergencies.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Limited access to quality healthcare services for vulnerable
                  populations.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Increased health inequalities due to high treatment costs.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                14. Key Benefits of PMJAY Card
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Affordable Care: Eliminates financial barriers to accessing
                  healthcare.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Nationwide Access: Ensures treatment across India.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Comprehensive Coverage: Addresses a wide range of medical
                  conditions and needs.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, the PMJAY card is a transformative tool that bridges
            the gap between healthcare access and affordability for millions of
            Indians. It plays a pivotal role in achieving universal health
            coverage, reducing poverty due to medical expenses, and improving
            the overall health and well-being of {"society's"} most vulnerable
            sections.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 6 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            ABHA Card Document Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            The ABHA Card (Ayushman Bharat Health Account), formerly known as
            the Health ID, is a significant initiative under the Ayushman Bharat
            Digital Mission (ABDM) by the Government of India. It facilitates a
            unified and digital healthcare ecosystem, enabling individuals to
            manage and access their health records seamlessly. {"Here's"} why
            the ABHA Card is important:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Digital Access to Health Records
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Provides a unique health ID that links an {"individual's"}{" "}
                  health records digitally.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensures easy access to past medical history, prescriptions,
                  lab reports, and diagnoses.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Reduces dependency on physical documents, making healthcare
                  more efficient and paperless.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Portability and Interoperability
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Allows individuals to share health records across different
                  healthcare providers, ensuring seamless treatment continuity.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensures access to health data anywhere in India, making it
                  especially valuable for those who move frequently.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Enhanced Healthcare Efficiency
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Streamlines communication between healthcare providers,
                laboratories, and pharmacies. It eliminates duplication of tests
                or procedures by enabling doctors to review previous reports and
                treatment histories.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Empowering Individuals
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Grants individuals complete control over their health data.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Enables viewing, providing, or revoking consent for data
                  access by healthcare providers.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Helps in managing how and when data is shared.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Facilitates Access to Government Health Schemes
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Integrates with existing health programs like PMJAY (Pradhan
                Mantri Jan Arogya Yojana), simplifying processes for
                beneficiaries by linking all health-related services under a
                single digital identity.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Improves Diagnosis and Treatment
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Enables doctors to provide better care by accessing
                comprehensive patient histories, reducing medical errors, and
                improving treatment outcomes.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Strengthens the Healthcare Ecosystem
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Promotes a connected healthcare infrastructure, benefiting
                hospitals, clinics, and diagnostic centers, and encourages
                collaboration between public and private healthcare sectors.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Encourages Preventive Care
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                The ABHA system provides regular updates and reminders,
                encouraging individuals to undergo preventive screenings and
                health check-ups, aiding in early disease detection.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Aiding Research and Policy Formulation
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Aggregated and anonymized health data supports medical research,
                policy decisions, and resource allocation, helping to better
                understand public health trends.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Simplified Healthcare Access for Remote Areas
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Bridges the gap in healthcare access for people in rural or
                remote areas by connecting them to online healthcare providers
                and services.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Cost Savings
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Minimizes duplicate diagnostics and unnecessary consultations.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Saves time and resources for both patients and healthcare
                  providers.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Enhanced Data Security
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Built with robust data privacy and security frameworks, the ABHA
                card ensures that individuals retain full control over their
                health data, which is shared only with their consent.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                13. Challenges without an ABHA Card
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Difficulty in maintaining and accessing medical history.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Risk of errors in diagnosis or treatment due to incomplete
                  information.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Limited access to benefits under digital health initiatives.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                14. Key Benefits of ABHA Card
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">
                    Unified Health Identity:{" "}
                  </span>{" "}
                  Centralizes all health-related data for easy management.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Seamless Access: </span>{" "}
                  Ensures availability of medical records across healthcare
                  providers nationwide.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  <span className="font-semibold">Empowered Patients: </span>{" "}
                  Promotes transparency and control over personal health data.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, the ABHA Card is a transformative tool in India’s
            journey towards a digitally empowered healthcare system. By
            integrating technology with healthcare, it ensures better outcomes,
            improved access, and a healthier future for all.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 7 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Income Certificate Document Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            An Income Certificate is an official document that certifies an{" "}
            {"individual's or family's"} income. In healthcare, it plays a vital
            role in ensuring access to various medical benefits, subsidies, and
            services, particularly for economically weaker sections. {"Here's"}{" "}
            why the Income Certificate is important in the healthcare sector:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Eligibility for Government Health Schemes
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Income-based eligibility is used to determine access to
                  schemes like Ayushman Bharat Yojana (PMJAY) and state-level
                  health insurance programs.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensures benefits reach BPL (Below Poverty Line) families and
                  economically weaker sections (EWS).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Subsidized Medical Treatments
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Facilitates access to subsidized or free healthcare services in
                government hospitals, reducing costs for critical treatments,
                surgeries, or medications under specific programs.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Access to Concessions in Medical Expenses
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Allows availing of concessions on diagnostic tests and lab
                  investigations in public hospitals.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Helps obtain reduced rates for treatments in charitable trusts
                  or government-aided institutions.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Application for Health Insurance Subsidies
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Used to apply for health insurance under schemes for low-income
                families, including programs like Rashtriya Swasthya Bima Yojana
                (RSBY) and state-level initiatives.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Benefits for Medical Education
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Essential for students seeking scholarships, fee waivers, or
                financial aid in medical education programs, ensuring equitable
                access for economically disadvantaged students.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Assistance for Chronic Illnesses
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Facilitates access to special financial aid or benefits for
                  chronic illnesses, including cancer treatments, dialysis, and
                  long-term medications.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Priority in Healthcare Services
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                In certain public healthcare settings, verified low-income
                individuals may receive priority for consultations, beds, and
                access to resources.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Availing Maternity and Childcare Benefits
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Required for schemes like Janani Suraksha Yojana (JSY), which
                provides financial assistance for institutional deliveries and
                supports low-income families with maternity and postnatal care
                expenses.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Medical Loan and Financial Assistance
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Needed to apply for medical loans or financial help from NGOs or
                charitable organizations, ensuring funds are allocated to those
                most in need.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Tax Benefits and Deductions
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Assists in claiming income-based tax deductions for medical
                expenses, such as those under Section 80D of the Income Tax Act.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Challenges without an Income Certificate
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ineligibility for free or subsidized healthcare services.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Increased financial burden due to out-of-pocket expenses.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Difficulty in proving economic status for healthcare-related
                  financial aid.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Not applicable for government schemes.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, an Income Certificate is a crucial document for
            accessing healthcare services, particularly for individuals and
            families from lower-income groups. By certifying economic status, it
            enables targeted delivery of medical benefits, promotes equity in
            healthcare, and ensures that financial constraints do not prevent
            access to essential health services.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 8 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Bank Details in Healthcare Schemes
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            Bank details play a crucial role in the implementation and
            accessibility of healthcare schemes, especially in digitized and
            direct-benefit-transfer-based models. {"Here's"} why they are
            important:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Facilitates Direct Benefit Transfers (DBT)
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Healthcare schemes like Ayushman Bharat rely on DBT to
                  disburse funds directly to {"beneficiarie's"} bank accounts.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensures timely and transparent transfer of subsidies without
                  intermediaries.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Prevents Fraud and Leakage
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Linking healthcare benefits to bank accounts minimizes fraud and
                ensures funds reach eligible individuals directly, reducing
                misuse by intermediaries.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Ensures Accountability
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Bank-linked transactions provide a transparent trail for
                authorities, enabling better auditing and tracking of healthcare
                funds.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Access to Financial Assistance for Medical Expenses
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Mandatory for reimbursement of medical expenses under health
                  insurance schemes.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Used to receive financial aid for treatments like cancer,
                  dialysis, or maternity benefits.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Facilitates Enrollment in Insurance Schemes
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Bank details are required to enroll in schemes like PMJAY, RSBY,
                or state-specific health programs, enabling seamless premium
                payments and claim processing.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Maternity and Childcare Benefits
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Schemes like Janani Suraksha Yojana and Pradhan Mantri Matru
                Vandana Yojana use bank details to transfer funds to pregnant
                and lactating mothers, helping low-income families manage
                childbirth costs.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Ensures Uniformity in Benefit Distribution
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Centralized banking integration ensures equitable distribution
                of healthcare benefits, reaching eligible individuals uniformly
                across geographic locations.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Reduces Administrative Delays
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Automated fund transfers reduce the administrative burden of
                manual distributions, expediting claim processing and
                reimbursements.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Empowers Beneficiaries
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Provides beneficiaries with direct control over their healthcare
                funds, promoting better financial planning and utilization for
                medical needs.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Promotes Financial Inclusion
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Encourages economically weaker sections to open bank accounts,
                promoting financial literacy and inclusion. Programs like Jan
                Dhan Yojana often integrate healthcare benefits for greater
                reach.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Encourages Transparency in Private Healthcare Partnerships
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Bank-linked reimbursements in private healthcare ensure
                transparency and proper utilization of public funds.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Digital Health Ecosystem Integration
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Linking bank details with health IDs under programs like
                Ayushman Bharat Digital Mission (ABDM) integrates financial and
                healthcare systems, simplifying processes for beneficiaries and
                providers.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                13. Challenges without Bank Details
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Delays in receiving benefits due to lack of digital payment
                  channels.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Increased dependency on intermediaries, leading to misuse of
                  funds.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Difficulty in tracking and auditing fund transfers.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Delays in accessing treatments or Medical CSR funds.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, Bank details are an indispensable part of healthcare
            schemes, ensuring transparent, efficient, and fair distribution of
            benefits. By streamlining financial processes, they help
            beneficiaries receive timely support and empower them to manage
            their healthcare expenses better. Moreover, they contribute to the
            broader goals of financial inclusion and improved public health
            outcomes.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 9 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Emergency Contact Person Name & Details Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            An emergency contact person’s name is a critical component of
            healthcare records, ensuring effective communication and support
            during medical emergencies. This detail can significantly impact a
            patient’s safety, decision-making, and recovery. {"Here's"} why it
            is important:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Quick Communication during Emergencies
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Healthcare providers can immediately contact the emergency
                  person to inform them about the patient’s condition.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  They can also seek urgent decisions if the patient is
                  unconscious or incapacitated.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Facilitates Informed Decision-Making
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  The emergency contact often acts as a decision-maker when the
                  patient is unable to provide consent.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  They may authorize surgeries, medical procedures, or choose
                  between treatment options.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Provides Emotional and Practical Support
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                The emergency contact person provides both emotional support and
                practical help by assisting with arrangements such as
                transportation or managing hospital formalities.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Access to Critical Medical History
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  In an emergency, they can provide details about allergies,
                  medications, or chronic conditions.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  They may also provide family or personal medical history to
                  guide treatment decisions.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Acts as a Legal Representative
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                In some cases, the emergency contact may serve as the patient’s
                legal representative, handling consent forms, insurance claims,
                and financial matters related to the {"patient's"} care.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Ensures Continuity of Care
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                If the patient needs to be transferred to another healthcare
                facility, the emergency contact person ensures a smooth
                transition, with all necessary documents and instructions being
                followed.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Facilitates Insurance and Billing Communication
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                The emergency contact is often needed to clarify billing
                concerns, provide insurance details, or facilitate insurance
                claims.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Provides Support in Post-Discharge Care
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                The emergency contact may assist in organizing post-discharge
                care such as arranging home healthcare services and ensuring
                adherence to follow-up appointments and medications.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Helps Healthcare Providers Avoid Delays
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Having an up-to-date emergency contact ensures quick
                communication and minimizes delays in critical situations.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Reduces Risk of Isolation
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                For patients who live alone or are far from family, an emergency
                contact ensures that someone is informed and available to assist
                if needed.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Challenges without an Emergency Contact
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Delayed treatment due to inability to obtain consent or
                  critical medical information.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Increased stress for healthcare providers trying to locate
                  someone responsible for the patient.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Lack of coordinated post-care support, especially for patients
                  unable to manage independently.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Best Practices for Emergency Contacts
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensure the listed contact is reliable and easily reachable.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Update the contact details regularly to avoid outdated
                  information.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Choose someone familiar with the patient’s medical history and
                  preferences.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, an emergency contact person’s name is more than just
            a formality in healthcare records—it is a lifeline in critical
            situations. By ensuring timely communication, effective
            decision-making, and ongoing support, this information plays a vital
            role in safeguarding the well-being and recovery of patients.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 10 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Religion Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            Religion plays a significant role in healthcare by influencing
            patients’ values, beliefs, and practices, which can impact their
            approach to health, illness, and treatment. Healthcare providers who
            understand and respect religious considerations can deliver more
            compassionate and effective care.{" Here's"} why religion is
            important in healthcare:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Provides Emotional and Spiritual Support
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Religion often serves as a source of comfort, hope, and
                  strength for patients and families during illnesses or crises.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  It can help patients cope with pain, anxiety, and fear,
                  promoting mental and emotional well-being.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Influences Medical Decision-Making
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Patients may make healthcare decisions based on their
                  religious beliefs, including acceptance or refusal of certain
                  treatments.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  This includes decisions like blood transfusions, organ
                  transplants, surgeries, or end-of-life care preferences.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Understanding these beliefs helps providers respect patients’
                  choices.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Shapes Dietary and Lifestyle Preferences
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Religious practices often dictate dietary restrictions (e.g.,
                halal, kosher, or vegetarian diets) and lifestyle habits (e.g.,
                fasting or abstaining from alcohol). Healthcare providers must
                accommodate these needs during hospital stays or treatments.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Guides Ethical and Moral Considerations
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Patients may look to religious teachings to navigate complex
                  ethical dilemmas such as decisions about abortion or fertility
                  treatments.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Religious beliefs also help guide decisions on terminal
                  illnesses, euthanasia, or other end-of-life matters.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Providers need to align care plans with {"patient's"} moral
                  frameworks.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Impacts Health-Seeking Behavior
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Religious beliefs can influence how patients view health,
                  illness, and medical intervention.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Some may prefer traditional or spiritual healing methods,
                  while others might prioritize prayer or religious rituals
                  alongside medical care.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Enhances Trust in Healthcare Providers
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                When healthcare providers respect and integrate {"patient's"}{" "}
                religious values, it fosters trust and strengthens the
                patient-provider relationship. Patients are more likely to
                follow treatment plans and share concerns openly.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Facilitates End-of-Life Care
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Religion often provides guidance on preparing for death and
                managing grief. Healthcare providers can offer appropriate
                support, such as facilitating last rites, prayers, or spiritual
                counseling, ensuring a dignified and peaceful end-of-life
                experience.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Encourages Holistic Healing
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Many religious traditions emphasize the connection between mind,
                body, and spirit. Incorporating spiritual care alongside medical
                treatment promotes holistic healing and recovery.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Promotes Community Support
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Religious communities often offer practical assistance and
                emotional support to patients and their families. This communal
                care can alleviate feelings of isolation and stress during
                illness.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Addresses Cultural Competency
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                A patient’s religion is often intertwined with cultural
                identity. Understanding religious practices helps healthcare
                providers deliver culturally competent care, avoiding
                misunderstandings or unintentional offense.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Challenges without Religious Considerations
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Potential conflicts between medical recommendations and
                  patients’ beliefs.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Emotional distress or dissatisfaction with care due to
                  perceived insensitivity.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Miscommunication about treatment goals and preferences.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Best Practices for Providers
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Respect Diversity: Acknowledge that patients come from various
                  religious backgrounds with unique needs.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Communicate Openly: Ask patients about their preferences and
                  accommodate them whenever possible.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Collaborate with Chaplains: Involve spiritual care providers
                  to address religious or spiritual concerns.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Educate Staff: Train healthcare teams in cultural and
                  religious sensitivity.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, religion is a deeply personal aspect of many
            patients’ lives, influencing their health behaviors, choices, and
            coping mechanisms. By recognizing and respecting religious beliefs,
            healthcare providers can offer more empathetic, personalized, and
            effective care, ultimately improving patient satisfaction and
            outcomes.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 11 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Present & Proper Address Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            Providing a present and proper address in healthcare is essential
            for ensuring effective communication, continuity of care, and smooth
            healthcare administration. Here are the key reasons why an accurate
            address is vital in the healthcare context:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Ensures Accurate Communication
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Healthcare providers can contact patients for appointment
                  reminders, test results, or follow-ups.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Notifying patients about medical emergencies or changes in
                  care plans is easier with an accurate address.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Proper address details enable reliable communication when
                  other methods, such as phone, are unavailable.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Facilitates Home-Based Care
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Many healthcare services like home visits, nursing care, and
                  medication delivery depend on accurate address information.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Timely and efficient delivery of care to patients who cannot
                  visit healthcare facilities is possible with the correct
                  address.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Crucial for Emergency Services
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Accurate addresses are vital for ambulance services and other
                emergency responders to reach patients quickly. Any errors in
                the address can delay critical care during emergencies.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Streamlines Health Insurance and Reimbursement Processes
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Health insurance claims require a proper address for
                  correspondence and verification purposes.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Errors or inconsistencies in the address may lead to delays in
                  claim approvals or reimbursements.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Supports Continuity of Care
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Accurate address records help healthcare providers locate
                  patients for follow-ups, especially for chronic conditions.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  It helps coordinate care across multiple facilities or
                  providers to ensure the {"patient's"} health is managed
                  properly.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Access to Healthcare Benefits and Schemes
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Many government and private healthcare schemes require a
                verified address for eligibility and enrollment. Examples
                include schemes like PMJAY (Ayushman Bharat) or state-specific
                health benefits that rely on demographic data tied to a
                patient’s address.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Enables Public Health Interventions
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Accurate address information is critical for public health
                  initiatives like vaccination drives or tracking infectious
                  diseases.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  It also aids in distributing health awareness materials to
                  specific communities.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Facilitates Medical Billing and Legal Documentation
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                A proper address ensures that medical bills, receipts, and legal
                documents reach the intended recipient. It also helps resolve
                disputes or discrepancies in medical and financial records.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Assists in Patient Transfers
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  For patients being transferred between facilities, the address
                  is crucial for ensuring proper documentation and follow-up
                  care.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  This is especially important for patients requiring continued
                  care after discharge.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Important for Healthcare Research and Planning
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Address data helps healthcare organizations identify
                  geographic patterns in disease prevalence and plan resource
                  allocation.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  It aids in setting up clinics or hospitals in underserved
                  areas and supports population health studies and targeted
                  interventions.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Avoids Administrative Delays
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Inaccurate or incomplete address details can lead to delays in
                registration, document processing, and service delivery. Correct
                addresses ensure administrative tasks, such as updating medical
                records or issuing certificates, are completed efficiently.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Challenges without a Proper Address
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Delayed or missed follow-ups due to communication gaps.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Inaccessibility of services like home care, insurance
                  benefits, or scheme enrollments.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Miscommunication in emergencies, leading to potential risks
                  for patients.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                13. Best Practices for Maintaining Address Records
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Verify Information: Always double-check address details during
                  registration or admission.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Update Regularly: Encourage patients to update their address
                  if they move or change residences.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Include Landmarks: For rural or remote areas, adding landmarks
                  can help ensure timely service delivery.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Secure Data: Ensure address information is stored securely to
                  protect patient privacy.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, a present and proper address is more than just a
            detail in healthcare records - it is a cornerstone for efficient
            communication, timely service delivery, and effective healthcare
            administration. Ensuring its accuracy benefits patients and
            providers, enhancing overall healthcare experiences and outcomes.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>{" "}
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handleNext}
            >
              Next Page
            </button>
          </div>{" "}
        </div>
      )}
      {currentStep === 12 && (
        <div className="bg-white rounded-xl shadow-lg  w-full p-6">
          <h1 className="lg:text-[25px] text-[20px] justify-center flex text-center font-bold text-[#2b73ec] mb-4">
            Medical Assessment Form Importance
          </h1>
          <p className="text-black mb-6 lg:text-[15px] md:text-[13px] text-[11px]">
            A Medical Assessment Form is a comprehensive document used to
            evaluate a patient’s health status, medical history, and risk
            factors. It plays a crucial role in healthcare by guiding medical
            professionals in diagnosing conditions, planning treatments, and
            ensuring continuity of care. {"Here's"} why a Medical Assessment
            Form is important:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                1. Provides a Holistic Overview of the Patient’s Health
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Consolidates information about the patient’s medical history,
                  lifestyle, symptoms, and current medications.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Helps healthcare providers understand the patient’s overall
                  health and identify underlying issues.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                2. Assists in Accurate Diagnosis
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Detailed data on symptoms, family history, and previous
                  illnesses aids in pinpointing the cause of health problems.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Reduces the risk of misdiagnosis by providing a clear picture
                  of the patient’s health.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                3. Guides Treatment Plans
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Information from the assessment form helps in formulating
                  personalized treatment strategies.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensures treatments are tailored to the patient’s specific
                  needs, including considerations for allergies, existing
                  conditions, or contraindications.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                4. Facilitates Risk Assessment
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Identifies potential health risks such as genetic
                  predispositions to certain diseases or lifestyle factors
                  contributing to chronic conditions.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Vulnerabilities like immunocompromised states or allergies can
                  be recognized, helping with preventive healthcare measures.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                5. Enhances Communication Between Providers
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Acts as a standardized document that can be shared among
                healthcare providers. This ensures continuity of care,
                especially during referrals or transfers between specialists or
                facilities.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                6. Supports Preventive Healthcare
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Helps in screening for conditions such as diabetes,
                  hypertension, or high cholesterol before symptoms arise.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Encourages early intervention, reducing the likelihood of
                  complications in the future.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                7. Essential for Emergency Situations
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Provides critical information to emergency responders or
                  medical teams, such as existing medical conditions, current
                  medications, and allergies.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Emergency contact details are also included to enable faster
                  and more informed decision-making during emergencies.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                8. Key for Occupational and Fitness Evaluations
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Used to assess whether an individual is medically fit for
                  certain jobs, sports, or activities.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Identifies any physical or mental limitations that may affect
                  performance or safety during specific tasks or activities.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                9. Supports Insurance and Legal Requirements
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Often required for filing health insurance claims and
                  documenting medical conditions for disability benefits.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Used for legal purposes, such as fitness declarations or
                  accident reports, to ensure accurate documentation of medical
                  status.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                10. Tracks Patient Progress Over Time
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Serves as a baseline for monitoring changes in a patient’s
                health over time. This helps healthcare providers evaluate the
                effectiveness of treatments and adjust care plans as needed.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                11. Improves Patient Engagement
              </h2>
              <p className="text-black lg:text-[15px] md:text-[13px] text-[11px]">
                Encourages patients to reflect on their health by answering
                detailed questions about lifestyle, habits, and symptoms. It
                promotes informed decision-making by involving patients in their
                care.
              </p>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                12. Complies with Regulatory and Ethical Standards
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Ensures healthcare providers document all necessary medical
                  information, aligning with legal and ethical obligations.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Provides evidence of the care provided, protecting both
                  patients and providers in case of disputes or legal issues.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                13. Challenges without a Medical Assessment Form
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Incomplete medical histories leading to delays or errors in
                  diagnosis and treatment.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Communication gaps among healthcare teams, which affect the
                  continuity of care.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Missed opportunities for preventive interventions or risk
                  management.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="lg:text-[16px] md:text-[14px] text-[12px] font-bold text-gray-800 mb-2">
                14. Best Practices for Using Medical Assessment Forms
              </h2>
              <ul className="list-disc list-inside text-black space-y-1">
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Customize for Specific Needs: Tailor forms to suit the
                  requirements of general practice, specialty care, or
                  occupational health.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Regular Updates: Ensure forms are periodically updated to
                  reflect changes in the patient’s health or lifestyle.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Digital Integration: Use electronic forms to enhance
                  accessibility, data analysis, and secure sharing among
                  healthcare providers.
                </li>
                <li className="lg:ml-2 ml-1 lg:text-[15px] md:text-[13px] text-[11px]">
                  Patient-Centric Approach: Design forms that are easy to
                  understand and fill out, improving accuracy and engagement.
                </li>
              </ul>
            </div>
          </div>
          <p className="text-black mt-6 lg:text-[15px] md:text-[13px] text-[11px]">
            In conclusion, a Medical Assessment Form is a foundational tool in
            healthcare that supports accurate diagnosis, personalized treatment,
            and effective communication. By gathering comprehensive information
            about a patient’s health, it enables healthcare providers to deliver
            better care, enhance patient outcomes, and promote preventive health
            practices.
          </p>
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
            <button
              className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white bg-[#2b73ec] shadow-xl px-4 py-2 rounded-full font-poppins text-white"
              onClick={handlePrevious}
            >
              Previous Page
            </button>
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default DocImportance;
