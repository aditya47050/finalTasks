import React from "react";

const InterviewTipsPage = () => {
  return (
    <>
      <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6 font-poppins">
        {/* Interview Tips */}
        <div className="justify-center text-center mb-2">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">INTERVIEW TIPS</span>
          </h1>
        </div>
        <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
          <ul className="mb-4 space-y-4">
            <li>
              <span className="font-bold">1. RESEARCH THE COMPANY:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Understand the company’s mission, values, culture, and recent achievements. Tailor your responses to show alignment with their goals.
              </p>
            </li>
            <li>
              <span className="font-bold">2. PRACTICE COMMON QUESTIONS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Prepare answers for common questions like strengths, weaknesses, and career goals. Practice delivering them confidently.
              </p>
            </li>
            <li>
              <span className="font-bold">3. DRESS PROFESSIONALLY:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Wear attire suitable for the company culture. First impressions matter, so dress neatly and appropriately.
              </p>
            </li>
            <li>
              <span className="font-bold">4. BODY LANGUAGE:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Maintain good posture, eye contact, and a firm handshake. Avoid fidgeting and show engagement.
              </p>
            </li>
            <li>
              <span className="font-bold">5. PREPARE QUESTIONS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Prepare thoughtful questions about the role, team, and company. It shows interest and initiative.
              </p>
            </li>
            <li>
              <span className="font-bold">6. TIME MANAGEMENT:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Arrive on time or join virtual interviews early. Being punctual demonstrates professionalism.
              </p>
            </li>
            <li>
              <span className="font-bold">7. FOLLOW-UP:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Send a thank-you email after the interview. Highlight key points from the conversation and reiterate interest in the role.
              </p>
            </li>
          </ul>
          <p>
            For more tips and guidance, check our <br />
            <span className="font-bold italic underline">
              Career Advice Page
            </span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default InterviewTipsPage;
