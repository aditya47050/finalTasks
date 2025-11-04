// "use client";
// import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
// import React, { useState } from "react";

// const FAQItem = ({ question, answer }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="border-b border-[#243460] py-3">
//       <button
//         className="w-full text-left font-semibold text-[#243460] lg:text-[16px] text-[12px] px-4 flex justify-between items-center"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span>{question}</span>
//         <span>{isOpen ? <ChevronUpCircle /> : <ChevronDownCircle />}</span>
//       </button>
//       {isOpen && (
//         <p className="mt-2 lg:text-[16px] text-[12px] text-justify text-gray-700">
//           {answer}
//         </p>
//       )}
//     </div>
//   );
// };

// const page = () => {
//   const faqData = [
//     {
//       question: "Who is an Aarogya Aadhar Home Healthcare Service Partner?",
//       answer:
//         "Aarogya Aadhar home healthcare service partners are independent contractors who provide services and treatment to patients supported by Aarogya Aadhar. They use their own car or bike to deliver services to Aarogya Aadhar patients.",
//     },
//     {
//       question:
//         "How to become an Aarogya Aadhar Home Healthcare Service Partner?",
//       answer: `• Download the Aarogya Aadhar Home Healthcare Service app (App Link)
//                 • Submit the required details, updated documents, and pay the onboarding training fee.
//                 • We will send your Home Healthcare Service kit/assets to your home address.
//                 • Log in to the app using your mobile number.
//                 • Visit allocated locality/area and start accepting patient leads.`,
//     },
//     {
//       question:
//         "What are the requirements to become an Aarogya Aadhar Home Healthcare Service Partner?",
//       answer: `• Valid medical education or EMS course completed from a UGC-approved college.
//                 • Required documents depending on the service you provide.
//                 • Android phone with version 6.0 or higher and at least 2GB of RAM.
//                 • A two-wheeler meeting all legal and safety requirements.
//                 • Driving License, Registration Certificate (RC), and Insurance Certificate.
//                 • Address proof (light bill/passport).
//                 • PAN Card.
//                 • Aadhar Card.
//                 • Bank account proof.`,
//     },
//     {
//       question: "What are the login hours?",
//       answer:
//         "The login hours are flexible. You can choose to log in anytime based on your availability to provide service and treatment to patients.",
//     },
//     {
//       question: "When do I start healthcare service and treatment to patients?",
//       answer:
//         "Once your registration is complete, our team will run a background check. After that, you can begin providing healthcare services and treatment to patients.",
//     },
//     {
//       question: "How much can I earn?",
//       answer:
//         "You will earn for each Home Healthcare Service you complete. For more details, visit our nearest onboarding center or call our helpline number.",
//     },
//     {
//       question: "How will I get paid?",
//       answer:
//         "Earnings will be transferred to your bank account weekly. You can check your earnings in the app under the Payments section.",
//     },
//     {
//       question: "Are there any bonuses?",
//       answer: `There are two types of bonuses, which vary by city:
//                 • Starting Bonus: Join and complete a minimum number of services within a specified time.
//                 • Referral Bonus: Refer another healthcare service partner to earn a bonus.`,
//     },
//     {
//       question:
//         "Do we have to pay any fees to get on board as a Home Healthcare Service Partner?",
//       answer:
//         "Yes, there is a one-time fee for training and support, collected in installments. For current onboarding fees, download the app and check the details.",
//     },
//     {
//       question:
//         "What are the benefits of joining as a Home Healthcare Service Partner other than earnings?",
//       answer:
//         "As a partner, you will receive personal accidental life and health insurance, which covers injuries and protects you against financial costs in the event of an accident.",
//     },
//   ];

//   return (
//     <div className="mx-auto container p-2 lg:px-20">
//       <div className="justify-center text-center mb-6">
//         <h1 className="text-[25px] text-[#5271FF] font-poppins font-extrabold">
//           <span className="shadow-inherit">
//             Features For Healthworkers - FAQS
//           </span>
//         </h1>
//       </div>

//       <div className="mx-auto container text-justify bg-white p-8 font-poppins rounded-xl shadow-lg max-w-6xl border border-gray-200">
//         {faqData.map((faq, index) => (
//           <FAQItem key={index} question={faq.question} answer={faq.answer} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default page;

"use client";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import React, { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if the answer contains multiple lines and convert it into a list
  const answerContent = answer.includes("\n") ? (
    <ul className="mt-2 mx-4  lg:text-[16px] text-[12px] text-gray-700 list-disc list-inside">
      {answer.split("\n").map((line, index) => (
        line.trim() && <li key={index}>{line.trim().replace(/^•\s*/, "")}</li>
      ))}
    </ul>
  ) : (
    <p className="mt-2 mx-4  lg:text-[16px] text-[12px] text-gray-700">{answer}</p>
  );

  return (
    <div className="border-b border-[#243460] py-3 xs:mt-2 lg:mt-6">
      <button
        className="w-full text-left font-semibold text-[#243460] lg:text-[16px] text-[12px] xs:px-2 md:px-4 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span>{isOpen ? <ChevronUpCircle /> : <ChevronDownCircle />}</span>
      </button>
      {isOpen && answerContent}
    </div>
  );
};

const page = () => {
  const faqData = [
    {
      question: "Who is an Aarogya Aadhar Home Healthcare Service Partner?",
      answer:
        "Aarogya Aadhar home healthcare service partners are independent contractors who provide services and treatment to patients supported by Aarogya Aadhar. They use their own car or bike to deliver services to Aarogya Aadhar patients.",
    },
    {
      question: "How to become an Aarogya Aadhar Home Healthcare Service Partner?",
      answer: `• Download the Aarogya Aadhar Home Healthcare Service app (App Link)\n• Submit the required details, updated documents, and pay the onboarding training fee.\n• We will send your Home Healthcare Service kit/assets to your home address.\n• Log in to the app using your mobile number.\n• Visit allocated locality/area and start accepting patient leads.`,
    },
    {
      question: "What are the requirements to become an Aarogya Aadhar Home Healthcare Service Partner?",
      answer: `• Valid medical education or EMS course completed from a UGC-approved college.\n• Required documents depending on the service you provide.\n• Android phone with version 6.0 or higher and at least 2GB of RAM.\n• A two-wheeler meeting all legal and safety requirements.\n• Driving License, Registration Certificate (RC), and Insurance Certificate.\n• Address proof (light bill/passport).\n• PAN Card.\n• Aadhar Card.\n• Bank account proof.`,
    },
    {
      question: "What are the login hours?",
      answer:
        "The login hours are flexible. You can choose to log in anytime based on your availability to provide service and treatment to patients.",
    },
    {
      question: "When do I start healthcare service and treatment to patients?",
      answer:
        "Once your registration is complete, our team will run a background check. After that, you can begin providing healthcare services and treatment to patients.",
    },
    {
      question: "How much can I earn?",
      answer:
        "You will earn for each Home Healthcare Service you complete. For more details, visit our nearest onboarding center or call our helpline number.",
    },
    {
      question: "How will I get paid?",
      answer:
        "Earnings will be transferred to your bank account weekly. You can check your earnings in the app under the Payments section.",
    },
    {
      question: "Are there any bonuses?",
      answer: `There are two types of bonuses, which vary by city:\n• Starting Bonus: Join and complete a minimum number of services within a specified time.\n• Referral Bonus: Refer another healthcare service partner to earn a bonus.`,
    },
    {
      question: "Do we have to pay any fees to get on board as a Home Healthcare Service Partner?",
      answer:
        "Yes, there is a one-time fee for training and support, collected in installments. For current onboarding fees, download the app and check the details.",
    },
    {
      question: "What are the benefits of joining as a Home Healthcare Service Partner other than earnings?",
      answer:
        "As a partner, you will receive personal accidental life and health insurance, which covers injuries and protects you against financial costs in the event of an accident.",
    },
  ];

  return (
    <div className="mx-auto container px-4 pb-2 mt-6 lg:px-20">
      <div className="justify-center text-center mb-2">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-poppins font-extrabold">
          <span className="shadow-inherit"> Features for Healthworkers </span>
        </h1>
      </div>
      <div className="mx-auto container text-justify bg-white xs:p-4 xs:pt-0 lg:p-8 font-poppins rounded-xl shadow-lg max-w-6xl border border-gray-200">
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default page;
