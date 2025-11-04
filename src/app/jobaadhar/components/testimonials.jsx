"use client"

import { Card, CardContent } from "@/components/ui/card"

const testimonials = {
  USER: [
    { id: "u1", author: "Priya S.", content: "Smooth experience browsing jobs.", rating: 5, jobTitle: "Frontend Developer", company: "TechCorp" },
    { id: "u2", author: "Arun K.", content: "Love the personalized matches.", rating: 5, jobTitle: "Backend Engineer", company: "CodeWorks" },
    { id: "u3", author: "Deepa M.", content: "Email alerts were spot-on.", rating: 4, jobTitle: "", company: "" },
    { id: "u4", author: "Rina P.", content: "Simple and fast UI.", rating: 5, jobTitle: "UI/UX Designer", company: "DesignHub" },
    { id: "u5", author: "Vikram S.", content: "Saved me hours of work.", rating: 4, jobTitle: "", company: "" },
    { id: "u6", author: "Anita K.", content: "Great notifications.", rating: 5, jobTitle: "Project Manager", company: "BuildIt" },
    { id: "u7", author: "Rohit D.", content: "Very helpful features.", rating: 4, jobTitle: "", company: "" },
    { id: "u8", author: "Sneha L.", content: "Intuitive design.", rating: 5, jobTitle: "Data Analyst", company: "DataCorp" },
  ],
  JOB_SEEKER: [
    { id: "js1", author: "Rahul V.", content: "Got interviews within days.", rating: 5, experience: "3 yrs", jobTitle: "Fullstack Developer", company: "TechSoft" },
    { id: "js2", author: "Neha G.", content: "Resume tips are helpful.", rating: 4, experience: "", jobTitle: "Marketing Analyst", company: "AdWorks" },
    { id: "js3", author: "Imran T.", content: "Found a remote role.", rating: 5, experience: "2 yrs", jobTitle: "React Developer", company: "Webify" },
    { id: "js4", author: "Pooja R.", content: "Helpful notifications.", rating: 5, experience: "", jobTitle: "Content Writer", company: "WriteWell" },
    { id: "js5", author: "Siddharth K.", content: "Easy application process.", rating: 4, experience: "1 yr", jobTitle: "DevOps Engineer", company: "CloudTech" },
    { id: "js6", author: "Alka M.", content: "Saved a lot of time.", rating: 5, experience: "", jobTitle: "", company: "" },
    { id: "js7", author: "Ramesh P.", content: "Great matching system.", rating: 4, experience: "4 yrs", jobTitle: "Data Scientist", company: "AnalyticsPro" },
    { id: "js8", author: "Tina S.", content: "Very user friendly.", rating: 5, experience: "", jobTitle: "QA Engineer", company: "Testify" },
  ],
  EMPLOYER: [
    { id: "em1", author: "S. Iyer (HR)", content: "High-quality applicants.", rating: 5, role: "HR Manager", company: "TechCorp" },
    { id: "em2", author: "K. Rao (TA)", content: "Posting took minutes.", rating: 5, role: "Talent Acquisition", company: "CodeWorks" },
    { id: "em3", author: "D. Shah (HR)", content: "Matches mapped perfectly.", rating: 4, role: "HR Lead", company: "BuildIt" },
    { id: "em4", author: "M. Gupta (TA)", content: "Efficient pipeline.", rating: 5, role: "Talent Acquisition", company: "Webify" },
    { id: "em5", author: "N. Verma (HR)", content: "Great insights.", rating: 5, role: "HR Manager", company: "DesignHub" },
    { id: "em6", author: "R. Singh (HR)", content: "Very intuitive.", rating: 4, role: "HR Executive", company: "DataCorp" },
    { id: "em7", author: "A. Mehta (TA)", content: "Simplified hiring.", rating: 5, role: "Talent Acquisition", company: "CloudTech" },
    { id: "em8", author: "L. Sharma (HR)", content: "Excellent support.", rating: 5, role: "HR Lead", company: "AnalyticsPro" },
  ],
}

function Lane({ title, items, reverse, role }) {
  const doubled = [...items, ...items]

  const getSubtitle = (t) => {
    if (role === "USER" || role === "JOB_SEEKER") {
      if (t.experience) return t.experience
      if (t.jobTitle && t.company) return `${t.jobTitle} @ ${t.company}`
      return "Fresher"
    } else if (role === "EMPLOYER") {
      return `${t.role} @ ${t.company}`
    }
    return ""
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-500">{title}</h3>
      <div className="relative overflow-hidden">
        {/* Edge fade shadows */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

        <div
          className={`flex gap-4 md:gap-6 w-max animate-[marquee_30s_linear_infinite] ${reverse ? "direction-rtl" : ""}`}
        >
          {doubled.map((t, i) => (
            <Card
              key={`${t.id}-${i}`}
              className="min-w-[260px] max-w-[280px] p-4 rounded-xl shadow-lg border border-gray-200  relative overflow-hidden"
            >
              {/* Zig-zag background */}
              <div
                className="absolute inset-0 -z-10 rounded-xl opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #6b7280 0, #6b7280 2px, #f3f4f6 2px, #f3f4f6 4px)',
                  backgroundSize: '10px 10px', // controls size of zig-zag repetition
                }}
              ></div>

              <div className="space-y-1 relative z-10">
                <p className="font-medium text-blue-600 text-lg">{t.author}</p>
                <p className="text-xs text-gray-500">{getSubtitle(t)}</p>
                <p className="text-sm leading-relaxed">{t.content}</p>
                <div className="text-lg text-yellow-400">
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-500">What People Say</h2>
          <p className="text-gray-500">Real feedback from users, jobseekers, and employers</p>
        </div>

        <div className="space-y-8">
          <Lane title="User Reviews" items={testimonials.USER} role="USER" />
          <Lane title="Jobseeker Reviews" items={testimonials.JOB_SEEKER} reverse role="JOB_SEEKER" />
          <Lane title="Employer Reviews" items={testimonials.EMPLOYER} role="EMPLOYER" />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .direction-rtl {
          animation-direction: reverse;
        }
      `}</style>
    </section>
  )
}
