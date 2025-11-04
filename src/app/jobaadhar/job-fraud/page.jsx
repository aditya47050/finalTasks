import React from "react";

const JobFraudPage = () => {
  return (
    <>
      <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6 font-poppins">
        {/* Job Fraud Awareness */}
        <div className="justify-center text-center mb-2">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">JOB FRAUD AWARENESS</span>
          </h1>
        </div>
        <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
          <ul className="mb-4 space-y-4">
            <li>
              <span className="font-bold">Understanding Job Fraud:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Job fraud occurs when individuals or organizations attempt to deceive job seekers to gain money, personal information, or other benefits. Fraudulent job postings may promise high salaries, fake offers, or work-from-home opportunities to lure victims.
              </p>
            </li>
            <li>
              <span className="font-bold">Common Signs of Job Fraud:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Some red flags include requests for upfront payments, unrealistic salary offers, vague job descriptions, unsolicited job offers, and suspicious email addresses or domains.
              </p>
            </li>
            <li>
              <span className="font-bold">Protect Yourself:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Always verify the company’s legitimacy, avoid sharing sensitive information, and consult trusted sources before accepting job offers. Report suspicious activity to relevant authorities.
              </p>
            </li>
          </ul>
        </div>

        {/* Steps to Avoid Job Fraud */}
        <div className="justify-center text-center mb-2 mt-6">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">STEPS TO AVOID JOB FRAUD</span>
          </h1>
        </div>
        <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
          <ul className="mb-4 space-y-4">
            <li>
              <span className="font-bold">1. VERIFY COMPANY DETAILS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Check the official company website, LinkedIn profiles, and online reviews to ensure the job posting is authentic.
              </p>
            </li>
            <li>
              <span className="font-bold">2. AVOID UPFRONT PAYMENTS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Legitimate employers do not ask for fees for job placement or training.
              </p>
            </li>
            <li>
              <span className="font-bold">3. SECURE PERSONAL INFORMATION:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Do not share sensitive information such as bank details, Aadhaar number, or passwords with unknown sources.
              </p>
            </li>
            <li>
              <span className="font-bold">4. COMMUNICATE THROUGH OFFICIAL CHANNELS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Always communicate via company emails and official job portals.
              </p>
            </li>
            <li>
              <span className="font-bold">5. REPORT SUSPICIOUS JOBS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Notify authorities or job portal support if you encounter fraudulent postings.
              </p>
            </li>
          </ul>
          <p>
            Stay alert and protect your career. For more details, check our <br />
            <span className="font-bold italic underline">
              Advisory Team Members Page
            </span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default JobFraudPage;
