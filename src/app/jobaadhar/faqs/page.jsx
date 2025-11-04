"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    name: "Job Fraud Awareness",
    href: "/job-fraud",
    content: "Learn how to identify and avoid fraudulent job offers. We provide tips to safeguard yourself from scams."
  },
  {
    name: "Interview Tips",
    href: "/interview-tips",
    content: "Master the art of interviewing with actionable tips, common questions, and strategies to impress employers."
  },
  {
    name: "Resume Guidelines",
    href: "/resume-guidelines",
    content: "Create a resume that stands out. Learn formatting, content tips, and common mistakes to avoid."
  },
  {
    name: "Career Advice",
    href: "/career-advice",
    content: "Guidance on career growth, skill development, and job market insights to help you succeed."
  },
  {
    name: "Support & FAQs",
    href: "/faqs",
    content: "Find answers to common questions about our platform, job applications, and account management."
  },
];

const AccordionItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        {faq.name}
        {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-indigo-500" />}
      </button>
      <div
        className={`px-4 pt-0 pb-0 text-gray-700 text-sm transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p>{faq.content}</p>
        <a href={faq.href} className="text-blue-500 underline mt-2 inline-block">
          Read more
        </a>
      </div>
    </div>
  );
};

const JobArticlesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10">
      <div className="container mx-auto px-4 lg:px-20 font-poppins">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#5271FF] shadow-inherit">
            Career & Job Resources
          </h1>
          <p className="text-gray-600 mt-2">
            Explore articles and tips to help you navigate your career and avoid job scams.
          </p>
        </div>

        <div className="grid gap-4 max-w-3xl mx-auto">
          {faqData.map((faq) => (
            <AccordionItem key={faq.name} faq={faq} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobArticlesPage;
