"use client"

import Image from "next/image"

export default function SectionContent({ section }) {
  const getSectionContent = (section) => {
    switch (section) {
      case "Overview":
        return {
          title: "Overview",
          content:
            "Brain-related medical conditions encompass a wide range of neurological disorders that affect the brain's structure and function. These conditions can impact cognitive abilities, motor functions, and overall quality of life.",
          image: "/images/brain-1.png",
        }
      case "Key Facts":
        return {
          title: "Key Facts",
          content:
            "The brain is the most complex organ in the human body, containing approximately 86 billion neurons. Brain disorders affect millions of people worldwide and can range from mild to severe.",
          image: "/images/brain-2.png",
        }
      case "Causes":
        return {
          title: "Causes",
          content:
            "Brain conditions can be caused by various factors including genetic predisposition, infections, trauma, tumors, autoimmune disorders, and degenerative processes.",
          image: "/images/brain-1.png",
        }
      case "Symptoms":
        return {
          title: "Symptoms",
          content:
            "Common symptoms include headaches, seizures, memory problems, difficulty speaking, weakness, numbness, vision changes, and behavioral alterations.",
          image: "/images/brain-2.png",
        }
      case "Risk Factors":
        return {
          title: "Risk Factors",
          content:
            "Risk factors include age, family history, head injuries, infections, substance abuse, high blood pressure, diabetes, and certain lifestyle factors.",
          image: "/images/brain-1.png",
        }
      case "Diagnosis":
        return {
          title: "Diagnosis",
          content:
            "Diagnosis typically involves neurological examinations, imaging studies (MRI, CT scans), blood tests, and specialized neurological assessments.",
          image: "/images/brain-2.png",
        }
      case "Prevention":
        return {
          title: "Prevention",
          content:
            "Prevention strategies include maintaining a healthy lifestyle, protecting the head from injury, managing chronic conditions, and regular medical check-ups.",
          image: "/images/brain-1.png",
        }
      case "Treatment":
        return {
          title: "Treatment",
          content:
            "Treatment options vary depending on the condition and may include medications, surgery, rehabilitation therapy, and lifestyle modifications.",
          image: "/images/brain-2.png",
        }
      default:
        return {
          title: section,
          content: `Information about ${section} will be displayed here. This section provides detailed insights and medical information related to brain health and treatments.`,
          image: "/images/brain-1.png",
        }
    }
  }

  const sectionData = getSectionContent(section)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1565C0] mb-4">{sectionData.title}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{sectionData.content}</p>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Learn More
            </button>
            <button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              Book Consultation
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            width={300}
            height={300}
            src={sectionData.image || "/placeholder.svg"}
            alt={sectionData.title}
            className="rounded-lg shadow-md max-w-full h-auto"
          />
        </div>
      </div>

      {/* Continue reading button */}
      <div className="text-center mt-6">
        <button className="bg-transparent border-2 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200">
          Continues upto FAQs
        </button>
      </div>
    </div>
  )
}
