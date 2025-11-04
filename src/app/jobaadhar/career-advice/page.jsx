import React from "react";

const CareerAdvicePage = () => {
  return (
    <>
      <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6 font-poppins">
        {/* Career Advice */}
        <div className="justify-center text-center mb-2">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">CAREER ADVICE</span>
          </h1>
        </div>
        <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
          <ul className="mb-4 space-y-4">
            <li>
              <span className="font-bold">1. SET CLEAR GOALS:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Define short-term and long-term career objectives. Knowing your goals helps you make informed decisions and stay motivated.
              </p>
            </li>
            <li>
              <span className="font-bold">2. CONTINUOUS LEARNING:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Keep updating your skills through online courses, certifications, and workshops to stay competitive in your field.
              </p>
            </li>
            <li>
              <span className="font-bold">3. NETWORKING:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Build professional connections through social media, conferences, and industry events. Networking opens doors to new opportunities.
              </p>
            </li>
            <li>
              <span className="font-bold">4. PERSONAL BRANDING:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Maintain a professional online presence. Showcase your achievements, projects, and skills to make a positive impression on potential employers.
              </p>
            </li>
            <li>
              <span className="font-bold">5. SEEK MENTORSHIP:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Learn from experienced professionals who can provide guidance, feedback, and industry insights.
              </p>
            </li>
            <li>
              <span className="font-bold">6. WORK-LIFE BALANCE:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Prioritize your well-being alongside career growth. Balance reduces burnout and improves productivity.
              </p>
            </li>
            <li>
              <span className="font-bold">7. ADAPTABILITY:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Stay flexible and open to new roles, technologies, and industry changes. Adaptability is a key trait for long-term success.
              </p>
            </li>
            <li>
              <span className="font-bold">8. SELF-ASSESSMENT:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Regularly evaluate your strengths, weaknesses, and progress. Adjust your strategies to stay aligned with your career goals.
              </p>
            </li>
          </ul>
          <p>
            For detailed guidance and resources, check our <br />
            <span className="font-bold italic underline">
              Resume Guidelines and Interview Tips Pages
            </span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default CareerAdvicePage;
