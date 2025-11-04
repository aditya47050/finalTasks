"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Hospital, FlaskConical, Briefcase, Microscope, ShieldCheck } from "lucide-react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
const testimonials = [
  {
  title: "Patients",
  color: "from-blue-500 to-indigo-600",
  icon: User,
  items: [
    {
      title: "Quick Report Delivery",
      description:
        "I was amazed at how fast I got my report. Within hours, my doctor was able to start my treatment without any delay.",
      author: "Mr. Vivek Singh",
    },
    {
      title: "Simple and Easy",
      description:
        "The process was really easy. I uploaded my scan, and within a short time I had my report. No running around hospitals.",
      author: "Ms. Aarti Menon",
    },
    {
      title: "Smooth Experience",
      description:
        "Everything went very smoothly. The portal was simple to use, and I felt confident knowing experts were handling my reports.",
      author: "Mr. Sanjay Patil",
    },
    {
      title: "Affordable Care",
      description:
        "The charges are very reasonable compared to private labs. For families like ours, it makes healthcare much easier.",
      author: "Mrs. Kavita Joshi",
    },
    {
      title: "Available Anytime",
      description:
        "I uploaded my scans late at night, and by morning the report was ready. That kind of service gave me real peace of mind.",
      author: "Mr. Ankit Bansal",
    },
    {
      title: "Accurate Results",
      description:
        "My doctor appreciated the detailed and clear report. It helped detect my problem early, which was very reassuring for me.",
      author: "Ms. Ritu Malhotra",
    },
    {
      title: "No More Long Queues",
      description:
        "I didn’t have to waste time standing in hospital lines. Everything came directly to me online. Truly stress-free.",
      author: "Mr. Nilesh Khandelwal",
    },
    {
      title: "Supportive Team",
      description:
        "Whenever I felt stuck, the support team guided me step by step. They were patient and very helpful.",
      author: "Mrs. Shalini Deshmukh",
    },
    {
      title: "Helped in Emergency",
      description:
        "During an emergency, I urgently needed my MRI report. It was delivered quickly and helped doctors act on time.",
      author: "Mr. Pankaj Yadav",
    },
    {
      title: "Secure and Private",
      description:
        "I felt safe knowing my reports could only be accessed by me with an OTP. It gave me confidence to use the service.",
      author: "Ms. Preeti Sinha",
    },
    {
      title: "Convenient for Sharing",
      description:
        "I downloaded my report in one click and shared it directly with my doctor. Very convenient for follow-ups.",
      author: "Mr. Ajay Verma",
    },
    {
      title: "Highly Satisfied",
      description:
        "This service has saved me so much time and money. I will recommend it to other patients without a doubt.",
      author: "Mrs. Meena Raghavan",
    },
  ]
},
  {
  title: "Hospitals",
  color: "from-purple-500 to-rose-500",
  icon: Hospital,
  items: [
    {
      title: "Reliable Remote Radiology",
      description:
        "Our hospital now receives radiology reports quickly and reliably, ensuring faster diagnosis and better patient care.",
      author: "CityCare Hospital",
    },
    {
      title: "24/7 Emergency Support",
      description:
        "Round-the-clock availability of radiologists has been a great support for emergency cases, helping us act without delay.",
      author: "Sunrise Multi-Speciality Hospital",
    },
    {
      title: "Accurate & Timely Reports",
      description:
        "The accuracy and clarity of the imaging reports have improved our treatment planning and patient outcomes.",
      author: "Greenfield Healthcare",
    },
    {
      title: "Strong Clinical Collaboration",
      description:
        "Teleradiology services have strengthened collaboration between our doctors and specialists, making diagnosis faster and more reliable.",
      author: "Lotus Medical Centre",
    },
    {
      title: "Fast Turnaround Time",
      description:
        "We consistently receive reports within hours, which has significantly reduced patient waiting time.",
      author: "Metro Life Hospital",
    },
    {
      title: "Scalable for High Volumes",
      description:
        "Even during peak patient flow, the platform has seamlessly handled large volumes of imaging reports.",
      author: "Medicover Hospital",
    },
    {
      title: "Enhanced Patient Trust",
      description:
        "Our patients trust us more because they see how quickly and accurately reports are delivered.",
      author: "Global Health Institute",
    },
    {
      title: "Advanced Technology Integration",
      description:
        "AI-assisted diagnosis has been a valuable addition, helping our radiology department handle complex cases efficiently.",
      author: "Healing Touch Hospital",
    },
  ]
}
,
  {
  title: "Diagnostic Centers",
  color: "from-green-500 to-emerald-600",
  icon: Microscope,
  items: [
    {
      title: "Seamless Integration",
      description:
        "The platform integrated smoothly with our existing workflow, and report turnaround time has drastically improved.",
      author: "Prime Diagnostic Center",
    },
    {
      title: "Reliable Teleradiology Partnership",
      description:
        "Consistent and accurate reporting has made this service our trusted partner for radiology interpretation.",
      author: "MediScan Diagnostics",
    },
    {
      title: "Cost-Effective Solution",
      description:
        "We have reduced operational costs significantly while maintaining high-quality diagnostic services.",
      author: "HealthFirst Diagnostics",
    },
    {
      title: "24/7 Reporting Support",
      description:
        "Round-the-clock reporting has been a game changer, especially during urgent and emergency cases.",
      author: "VisionCare Diagnostic Center",
    },
    {
      title: "Accurate and Detailed Reports",
      description:
        "Reports are precise, detailed, and easy to interpret, helping us uphold high diagnostic standards.",
      author: "SurePath Diagnostics",
    },
    {
      title: "Enhanced Patient Satisfaction",
      description:
        "Faster turnaround times and accurate reporting have improved patient trust and satisfaction with our services.",
      author: "LifeLine Diagnostics",
    },
  ]
}
,
  {
  title: "Pathology Labs",
  color: "from-purple-500 to-violet-600",
  icon: FlaskConical,
  items: [
    {
      title: "Efficient Workflow",
      description:
        "The platform streamlined our sample tracking and reporting processes, making coordination with clients seamless.",
      author: "CityCare Pathology Lab",
    },
    {
      title: "Exceptional Support",
      description:
        "The support team is responsive and knowledgeable, helping our lab resolve concerns quickly and efficiently.",
      author: "MedTrust Pathology",
    },
    {
      title: "Reliable Reporting",
      description:
        "The accuracy and reliability of reports have strengthened our lab’s operations and client satisfaction.",
      author: "Prime PathLabs",
    },
    {
      title: "Time-Saving Process",
      description:
        "Automation has saved us valuable time in report generation and improved communication with patients.",
      author: "LifeLine Pathology",
    },
    {
      title: "Great Collaboration",
      description:
        "Working with this service has been smooth, and our staff feels fully supported at all times.",
      author: "HealthFirst PathLabs",
    },
    {
      title: "Improved Client Trust",
      description:
        "Faster turnaround times and precise results have increased client confidence in our laboratory services.",
      author: "SurePath Pathology Lab",
    },
  ]
}
,
  {
  title: "Insurance Companies",
  color: "from-orange-500 to-red-500",
  icon: ShieldCheck,
  items: [
    {
      title: "Accurate and Fast Reporting",
      description:
        "Reports are delivered promptly and with high accuracy, which has significantly sped up our claim validation process.",
      author: "SafeLife Insurance",
    },
    {
      title: "Trusted Partner",
      description:
        "Their strong data security and transparent reporting have made them a trusted verification partner for our company.",
      author: "HealthSecure Insurance",
    },
    {
      title: "Seamless Claim Processing",
      description:
        "The efficiency of their reporting system has reduced delays in claim settlements and improved client trust.",
      author: "MediCare Assurance",
    },
    {
      title: "Improved Accuracy",
      description:
        "Error-free diagnostic reporting has enhanced our claim handling and boosted customer satisfaction.",
      author: "TrustWell Insurance",
    },
    {
      title: "Data Security Excellence",
      description:
        "We are impressed with their strict compliance measures and secure handling of sensitive medical records.",
      author: "ShieldPlus Insurance",
    },
    {
      title: "Reliable Collaboration",
      description:
        "Partnering with them has improved our operational efficiency and strengthened our client relationships.",
      author: "LifeGuard Insurance",
    },
  ]
}
,
  {
  title: "Corporates",
  color: "from-teal-500 to-cyan-600",
  icon: Briefcase,
  items: [
    {
      title: "Health Screening Made Easy",
      description:
        "We rely on their services for employee health checkups. Reports are delivered on time, and the entire process is seamless.",
      author: "TechOne Ltd.",
    },
    {
      title: "Boosted Employee Satisfaction",
      description:
        "Our staff greatly appreciates the quick diagnostics during health drives. Their technology platform is smooth and reliable.",
      author: "Spark Group",
    },
    {
      title: "Reliable Health Partner",
      description:
        "They have become our trusted partner for corporate health camps, consistently ensuring accuracy and efficiency.",
      author: "Zenith Solutions",
    },
    {
      title: "Cost-Effective Wellness Program",
      description:
        "We’ve successfully reduced healthcare costs while maintaining high-quality medical support for our employees.",
      author: "Nova Enterprises",
    },
    {
      title: "Efficient Reporting System",
      description:
        "Instant access to digital reports has simplified our internal processes and boosted overall productivity.",
      author: "Delta Corp",
    },
    {
      title: "Comprehensive Employee Care",
      description:
        "From diagnostics to follow-ups, their services cover all our employee health requirements with professionalism.",
      author: "Orion Group",
    },
  ]
}
,
]
const generateRandomDate = () => {
  const timeUnits = ["d", "w", "m"]
  const randomUnit = timeUnits[Math.floor(Math.random() * timeUnits.length)]
  const randomNumber = Math.floor(Math.random() * 10) + 1
  return `${randomNumber}${randomUnit} ago`
}

const Testimonials = () => {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)

  const totalItems = testimonials[selectedCategory]?.items.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1100) {
        setItemsPerPage(3) // min-[1100px]: 3 cards
      } else if (window.innerWidth > 768) {
        setItemsPerPage(2) // above 500px: 2 cards
      } else {
        setItemsPerPage(1) // xs (mobile): 1 card
      }
    }

    updateItemsPerPage()
    window.addEventListener("resize", updateItemsPerPage)
    return () => window.removeEventListener("resize", updateItemsPerPage)
  }, [])
  
  useEffect(() => {
    if (totalPages <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages)
    }, 10000)
    return () => clearInterval(interval)
  }, [totalPages, selectedCategory])

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(totalPages - 1) // Loop to last page
    }
  }

  const scrollRight = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0) // Loop to first page
    }
  }

  const scrollleft = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const scrollright = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="hidden md:block mx-auto min-[500px]:container pt-8 pb-8 min-[1000px]:pl-[60px] min-[1000px]:pr-5 min-[1100px]:pl-[40px] min-[1100px]:pr-[32px] xl:pl-[80px] xl:pr-[30px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl text-[#5271FF] font-extrabold mb-2">Testimonials</h1>
          <div className="flex justify-center text-[11px] lg:text-[15px] flex-wrap space-x-1 mt-2">
            {testimonials.map((category, index) => (
              <span
                key={index}
                className={`text-[#5271FF] rounded ${selectedCategory === index ? "font-bold" : ""} cursor-pointer`}
                onClick={() => {
                  setSelectedCategory(index)
                  setCurrentIndex(0)
                }}
              >
                {category.title}
                {index === testimonials.length - 1 ? null : " |"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex relative flex-col min-[500px]:flex-row xl:justify-center items-center gap-8 min-[1000px]:h-[330px] min-[1100px]:h-[320px]">
          {/* Left side card */}
          <div className="hidden min-[500px]:block w-full min-[500px]:w-1/2 min-[800px]:w-[40%] lg:w-1/3 xl:w-[30%] h-full">
            <div
              className={`bg-gradient-to-br ${testimonials[selectedCategory].color} rounded-2xl p-6 shadow-xl h-full flex flex-col items-center justify-center text-center min-[1100px]:mx-4`}
            >
              <h3 className="text-white text-2xl font-bold mb-4">{testimonials[selectedCategory].title}</h3>
              <p className="text-white/90 text-sm max-w-xs">
                Explore what our {testimonials[selectedCategory].title.toLowerCase()} are saying about our services.
              </p>
              <div className="mt-6 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                {(() => {
                  const Icon = testimonials[selectedCategory].icon
                  return <Icon className="w-10 h-10 text-white" />
                })()}
              </div>
            </div>
          </div>

          <button
              onClick={scrollLeft}
              className=" absolute hidden lg:block lg:left-[33.5%] xl:left-[30%] top-[45%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute hidden lg:block lg:-right-5 xl:-right-5 top-[45%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50 transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          {/* Right side carousel */}
          <div className="min-[500px]:w-1/2 min-[800px]:w-[60%] lg:w-2/3 xl:w-[70%] h-full flex flex-col relative overflow-hidden">
            {/* Scroll Buttons */}
            <button
              onClick={scrollLeft}
              className="absolute lg:hidden block  -left-3 top-[45%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute lg:hidden block  right-0 top-[45%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50 transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Scrollable container */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`, // exact shift
              }}
            >
              {testimonials[selectedCategory]?.items.map((testimonial, index) => (
                <div
                  key={index}
                  style={{ flex: `0 0 ${100 / itemsPerPage}%` }} // each card % width
                  className="min-[500px]:w-1/2 min-[1100px]:w-60 xl:w-64 flex-shrink-0 px-2"
                >
                  <Card className="h-full border-0 bg-gray-50 shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start gap-3 mb-4"> 
                        <div className="w-12 h-12 bg-gradient-to-br from-[#5271FF] to-[#3b5bff] rounded-full flex items-center justify-center flex-shrink-0"> 
                          <User className="w-6 h-6 text-white" /> 
                        </div> 
                        <div className="flex-1 min-w-0"> 
                          <h4 className="font-semibold text-gray-900 text-sm truncate line-clamp-1"> {testimonial.author} </h4>
                          <p className="text-sm text-gray-500">{generateRandomDate()}</p> 
                        </div> 
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <h5 className="font-bold text-[#5271FF] mb-2 text-md truncate">{testimonial.title}</h5>
                      <div className="h-28 min-[500px]:h-20 min-[1024px]:h-28 overflow-y-scroll pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"> <p className="text-gray-700 text-sm leading-relaxed">{testimonial.description}</p> </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`cursor-pointer w-3 h-3 rounded-full transition-all hover:scale-110 ${
                      i === currentIndex ? "bg-[#5271FF] w-6" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <div className="block md:hidden mx-auto min-[500px]:container pt-4 pb-4 overflow-hidden">
  <div className="text-center mb-8">
    <h1 className="text-2xl lg:text-3xl text-[#5271FF] font-extrabold mb-2">Testimonials</h1>
    <div className="flex justify-center text-[11px] lg:text-[15px] flex-wrap space-x-1 mt-2">
      {testimonials.map((category, index) => (
        <span
          key={index}
          className={`text-[#5271FF] rounded ${selectedCategory === index ? "font-bold" : ""} cursor-pointer`}
          onClick={() => {
            setSelectedCategory(index)
            setCurrentIndex(0)
          }}
        >
          {category.title}
          {index === testimonials.length - 1 ? null : " |"}
        </span>
      ))}
    </div>
  </div>

  <div className="w-full flex flex-col items-center gap-8">
    {/* Right side carousel */}
    <div className="w-full h-full flex flex-col relative overflow-hidden px-4">
      {/* Scroll Buttons */}
      <button
        onClick={scrollleft}
        className="absolute left-2 top-[45%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50 transition-colors"
      >
        <FiChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={scrollright}
        className="absolute right-2 top-[45%] -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50 transition-colors"
      >
        <FiChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Scrollable container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`, // slide full width each time
        }}
      >
        {testimonials[selectedCategory]?.items.map((testimonial, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 px-4"
            style={{ flex: "0 0 100%" }} // force single full card
          >
            <Card className="w-full h-full border-0 bg-gray-50 shadow-md ">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5271FF] to-[#3b5bff] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{generateRandomDate()}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h5 className="font-bold text-[#5271FF] mb-2 text-md truncate">{testimonial.title}</h5>
                <div className="h-20 min-[500px]:h-20 min-[1024px]:h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <p className="text-gray-700 text-sm leading-relaxed">{testimonial.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Dots */}
      {testimonials[selectedCategory]?.items.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: testimonials[selectedCategory].items.length }).map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`cursor-pointer w-3 h-3 rounded-full transition-all hover:scale-110 ${
                i === currentIndex ? "bg-[#5271FF] w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  </div>
</div>

    </>
  )
}

export default Testimonials
