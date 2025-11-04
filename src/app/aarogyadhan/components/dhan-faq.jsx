"use client"

import Link from "next/link"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import HelpCenterDialog from "./help-center-dialog"

const FAQSection = () => {
  const [openItems, setOpenItems] = useState([])

  const toggleItem = (index) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I start a medical fundraiser on AarogyaDhan?",
          answer:
            (
              <>
                <p >Click `Start a Fundraiser`</p>
                  <ul className="list-decimal pl-5 space-y-1 text-gray-600">
                    <li>Fill in patient details and medical information</li>
                    <li>Upload medical documents</li>
                    <li>Set your fundraising goal</li>
                    <li>Share your story with photos/videos</li>
                    <li>Submit for verification. Our team will review and approve within 24-48 hours</li>
                  </ul>
              </>
            ),
        },
        {
          question: "Is there any fee to start a fundraiser?",
          answer:
            "Starting a fundraiser is completely free. We only charge a small platform fee (5% + payment gateway charges) on the donations received. There are no upfront costs or hidden charges.",
        },
        {
          question: "How long does it take to get my fundraiser approved?",
          answer:
            "Most fundraisers are reviewed and approved within 24-48 hours. Our medical verification team ensures all documents are authentic and the case is genuine before approval.",
        },
      ],
    },
    {
      category: "Donations & Payments",
      questions: [
        {
          question: "How do donors contribute to my fundraiser?",
          answer:
            "Donors can contribute through multiple payment methods including UPI, credit/debit cards, net banking, and wallets. All payments are processed securely through our verified payment partners.",
        },
        {
          question: "When will I receive the donated funds?",
          answer:
            "Funds are typically transferred to your bank account within 3-5 business days after donation. For urgent medical needs, we offer express withdrawal options with faster processing.",
        },
        {
          question: "Can I withdraw partial amounts during the fundraiser?",
          answer:
            "Yes, you can withdraw funds as they are donated. This helps you manage immediate medical expenses while your fundraiser continues to run.",
        },
      ],
    },
    {
      category: "Trust & Safety",
      questions: [
        {
          question: "How does AarogyaDhan verify medical cases?",
          answer:
            "We have a dedicated medical verification team that reviews all submitted documents including hospital bills, doctor prescriptions, diagnostic reports, and treatment plans. We also verify hospital and doctor credentials.",
        },
        {
          question: "What documents do I need to submit?",
          answer:
            "Required documents include: Patient ID proof, Medical reports/prescriptions, Hospital estimates/bills, Doctor's recommendation letter, and recent photographs. Additional documents may be requested based on the case.",
        },
        {
          question: "How do you ensure donor money reaches the right person?",
          answer:
            "All funds are transferred directly to the bank account linked to the patient's verified identity. We maintain complete transparency with regular updates and expense tracking.",
        },
      ],
    },
    {
      category: "Tax & Legal",
      questions: [
        {
          question: "Do donors get tax benefits for their contributions?",
          answer:
            "Yes, donors can claim tax deductions under Section 80G of the Income Tax Act for donations made to verified medical fundraisers. We provide necessary certificates for tax filing.",
        },
        {
          question: "Is the donated money taxable for the recipient?",
          answer:
            "Medical donations received for treatment are generally not taxable under Indian tax laws. However, we recommend consulting with a tax advisor for specific cases involving large amounts.",
        },
      ],
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about medical crowdfunding on AarogyaDhan. {"Can't find what you're"} looking
            for? Contact our support team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b border-blue-200 pb-2">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemIndex = categoryIndex * 100 + questionIndex
                  const isOpen = openItems.includes(itemIndex)

                  return (
                    <div key={questionIndex} className="bg-white rounded-xl shadow-sm border">
                      <button
                        onClick={() => toggleItem(itemIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="flex md:flex-row xs:flex-col gap-4 justify-center">
            <Link
              href="/contact-us"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
            <div>

            <HelpCenterDialog
              trigger={
                <button
                  className="max-[450px]:w-full border border-blue-600 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Visit Help Center
                </button>
              }
            />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
