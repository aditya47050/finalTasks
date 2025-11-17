"use client"

import Link from "next/link"
import { FileText, Shield, Heart, CreditCard, ArrowRight, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

const HowItWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState([])
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev.length < 4) {
          return [...prev, prev.length]
        }
        return prev
      })
    }, 500)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 2000)

    return () => clearInterval(stepTimer)
  }, [])

  const steps = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Create Your Fundraiser",
      description:
        "Share your medical story with photos, documents, and treatment details. Our team will verify and approve your campaign within 24-48 hours.",
      color: "bg-blue-100 text-blue-600",
      bgGradient: "from-blue-400 to-blue-600",
      delay: "delay-0",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Get Verified",
      description:
        "Our medical experts verify all documents and hospital details to ensure authenticity and build donor trust.",
      color: "bg-green-100 text-green-600",
      bgGradient: "from-green-400 to-green-600",
      delay: "delay-200",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Share & Receive Support",
      description:
        "Share your fundraiser with family, friends, and social networks. Watch as compassionate donors contribute to your cause.",
      color: "bg-pink-100 text-pink-600",
      bgGradient: "from-pink-400 to-pink-600",
      delay: "delay-500",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Withdraw Funds",
      description:
        "Receive donations directly in your bank account within 3-5 business days. Use funds for medical treatment with complete transparency.",
      color: "bg-purple-100 text-purple-600",
      bgGradient: "from-purple-400 to-purple-600",
      delay: "delay-700",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How Aarogya Dhan Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Simple, secure, and transparent medical crowdfunding in 4 easy steps
            </p>
          </div>

          {/* Animated progress bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-y-1/2 transition-all duration-1000 ease-out"
                style={{ width: `${(visibleSteps.length / 4) * 100}%` }}
              ></div>
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-4 h-4 rounded-full border-2 bg-white z-10 transition-all duration-500 ${
                    visibleSteps.includes(step) ? "border-blue-500 scale-125" : "border-gray-300"
                  }`}
                >
                  {visibleSteps.includes(step) && <CheckCircle className="w-3 h-3 text-blue-500 animate-scale-in" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting lines with animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              {[0, 1, 2].map((index) => (
                <line
                  key={index}
                  x1={`${25 + index * 25}%`}
                  y1="50%"
                  x2={`${25 + (index + 1) * 25}%`}
                  y2="50%"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeDasharray="10,5"
                  className={`animate-draw-line ${visibleSteps.includes(index + 1) ? "opacity-100" : "opacity-0"}`}
                  style={{
                    animationDelay: `${(index + 1) * 500}ms`,
                    transition: "opacity 0.5s ease-in-out",
                  }}
                />
              ))}
            </svg>

            <div className="grid grid-cols-4 gap-8 relative" style={{ zIndex: 2 }}>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`text-center transform transition-all duration-700 ${
                    visibleSteps.includes(index)
                      ? "translate-y-0 opacity-100 scale-100"
                      : "translate-y-8 opacity-0 scale-95"
                  } ${step.delay}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative mb-6 group">
                    {/* Pulsing background effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${step.bgGradient} rounded-full opacity-20 scale-150 animate-pulse ${activeStep === index ? "animate-ping" : ""}`}
                    ></div>

                    {/* Main icon container */}
                    <div
                      className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative transform transition-all duration-300 hover:scale-110 hover:rotate-6 group-hover:shadow-xl ${activeStep === index ? "animate-bounce" : ""}`}
                    >
                      <div className="transform transition-transform duration-300 group-hover:scale-110">
                        {step.icon}
                      </div>
                    </div>

                    {/* Step number with animation */}
                    <div
                      className={`absolute -top-2 -right-2 bg-gradient-to-r ${step.bgGradient} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transform transition-all duration-300 hover:scale-125 ${activeStep === index ? "animate-pulse" : ""}`}
                    >
                      {index + 1}
                    </div>

                    {/* Floating particles effect */}
                    {activeStep === index && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-105">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border transform transition-all duration-700 hover:shadow-lg hover:scale-105 ${
                visibleSteps.includes(index) ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center relative transform transition-all duration-300 hover:scale-110 ${activeStep === index ? "animate-pulse" : ""}`}
                >
                  {step.icon}
                </div>
                <div
                  className={`absolute -top-1 -right-1 bg-gradient-to-r ${step.bgGradient} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold`}
                >
                  {index + 1}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        {/* Animated CTA */}
        <div className="text-center mt-16">
          <div className="animate-fade-in-up" style={{ animationDelay: "1s" }}>
            <Link
              href="/aarogyadhan/login"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-flex items-center gap-3 transform hover:scale-105 hover:shadow-xl"
            >
              <span>Start Your Fundraiser Today</span>
              <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />

              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Success metrics with counter animation */}
          <div className="mt-8 flex justify-center gap-8 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-blue-600 text-lg animate-count-up">50,000+</div>
              <div>Families Helped</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600 text-lg animate-count-up">₹100+ Cr</div>
              <div>Funds Raised</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-600 text-lg animate-count-up">24-48 hrs</div>
              <div>Quick Approval</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes draw-line {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.5;
          }
        }

        @keyframes count-up {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        .animate-draw-line {
          animation: draw-line 1s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-count-up {
          animation: count-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

export default HowItWorks
