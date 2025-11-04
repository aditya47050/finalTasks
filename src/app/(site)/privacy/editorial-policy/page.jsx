import React from "react";

const EditorialPolicyPage = () => {
  return (
    <>
      <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6 font-poppins">
        {/* Editorial Policy */}
        <div className="justify-center text-center mb-2">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">EDITORIAL POLICY</span>
          </h1>
        </div>
        <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
          <ul className="mb-4 space-y-4">
            <li>
              <span className="font-bold">Our experts strive to deliver precise, authoritative, and trustworthy content.</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                In our mission to make healthcare accessible and understandable, we focus on delivering trusted and evidence-based healthcare information that is comprehensive and well-researched.
          
              Our team consists of medical experts, qualified doctors, and editors who have extensive experience and expertise in scientific research and medical writing.

              The medicine and health content that we publish is curated through a well-structured editorial and review process which includes in-depth review by our Clinical Specialist Review Board.
              </p>
            </li>
          </ul>
        </div>

        {/* Editorial Workflow */}
        <div className="justify-center text-center mb-2 mt-6">
          <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">EDITORIAL WORKFLOW</span>
          </h1>
        </div>
        <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
          <ul className="mb-4 space-y-4">
            <li>
              <span className="font-bold">1. PLANNING & RESEARCH:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                We conduct extensive research to identify content gaps, validated by clinical specialists.
              </p>
            </li>
            <li>
              <span className="font-bold">2. CONTENT STRUCTURE:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Each category has a defined structure to ensure consistency.
              </p>
            </li>
            <li>
              <span className="font-bold">3. CONTENT CURATION:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Sources include medical journals, meta-analyses, guidelines, consensus statements, and textbooks.
              </p>
            </li>
            <li>
              <span className="font-bold">4. CITATION & REFERENCING:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                We follow the principle of <span className="italic">&quto cite while you write &quot</span> to ensure all claims are supported by references.
              </p>
            </li>
            <li>
              <span className="font-bold">5. CONTENT REVIEW:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                A thorough review cycle ensures accuracy and quality.
              </p>
            </li>
            <li>
              <span className="font-bold">6. LANGUAGE CONSISTENCY:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Editors review content for clarity and adherence to style guidelines.
              </p>
            </li>
            <li>
              <span className="font-bold">7. READABILITY ASSESSMENT:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Information is simplified for public understanding while retaining scientific accuracy.
              </p>
            </li>
            <li>
              <span className="font-bold">8. FEEDBACK ASSESSMENT:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                User feedback informs continuous improvements.
              </p>
            </li>
            <li>
              <span className="font-bold">9. REGULAR UPDATES:</span>
              <p className="pl-6 border-l-4 border-gray-300 mt-1">
                Content is periodically updated to align with the latest medical research.
              </p>
            </li>
          </ul>
          <p>
            For more details, check our <br />
            <span className="font-bold italic underline">
              Advisory Team Members Page
            </span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default EditorialPolicyPage;
