import React from "react";

const ResumeGuidelinesPage = () => {
  return (
    <>
      <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6 font-poppins">
        {/* Resume Guidelines */}
        <div className="justify-center text-center mb-2">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">RESUME GUIDELINES</span>
          </h1>
        </div>
        <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
          <ul className="mb-4 space-y-4">
            <li>
              <span className="font-bold">1. KEEP IT CONCISE:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Limit your resume to 1-2 pages. Highlight key achievements and relevant experience without unnecessary details.
              </p>
            </li>
            <li>
              <span className="font-bold">2. USE A CLEAN FORMAT:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Choose a professional layout with clear headings, bullet points, and consistent fonts. Avoid clutter and excessive styling.
              </p>
            </li>
            <li>
              <span className="font-bold">3. TAILOR FOR EACH ROLE:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Customize your resume for the specific job you are applying for. Highlight relevant skills, experience, and achievements.
              </p>
            </li>
            <li>
              <span className="font-bold">4. HIGHLIGHT KEY SKILLS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Include both technical and soft skills that are relevant to the role. Use keywords from the job description.
              </p>
            </li>
            <li>
              <span className="font-bold">5. INCLUDE CONTACT INFORMATION:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Ensure your phone number, email, and LinkedIn profile (if applicable) are correct and up to date.
              </p>
            </li>
            <li>
              <span className="font-bold">6. SHOWCASE ACHIEVEMENTS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Highlight measurable results and contributions, such as “Increased sales by 20%” or “Managed a team of 5.”
              </p>
            </li>
            <li>
              <span className="font-bold">7. PROOFREAD:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Check for spelling, grammar, and formatting errors. A polished resume reflects professionalism.
              </p>
            </li>
            <li>
              <span className="font-bold">8. KEEP IT UPDATED:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Regularly update your resume with new skills, experiences, certifications, and accomplishments.
              </p>
            </li>
          </ul>
          <p>
            For more guidance, visit our <br />
            <span className="font-bold italic underline">
              Career Advice Page
            </span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default ResumeGuidelinesPage;
