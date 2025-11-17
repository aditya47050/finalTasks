"use client"

import { Shield, Users,  Award, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { FaIndianRupeeSign } from "react-icons/fa6"

const AnimatedTrustIndicators = () => {
  const [counters, setCounters] = useState({
    families: 0,
    funds: 0,
    verification: 0,
    approval: 0,
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    const element = document.getElementById("trust-indicators")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const targets = {
      families: 50000,
      funds: 100,
      verification: 100,
      approval: 48,
    }

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setCounters({
        families: Math.floor(targets.families * progress),
        funds: Math.floor(targets.funds * progress),
        verification: Math.floor(targets.verification * progress),
        approval: Math.floor(targets.approval * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setCounters(targets)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible])

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      number: `${counters.families.toLocaleString()}+`,
      label: "Families Helped",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      icon: <FaIndianRupeeSign className="h-8 w-8" />,
      number: `₹${counters.funds}+ Cr`,
      label: "Funds Raised",
      color: "text-green-600",
      bgColor: "bg-green-100",
      gradient: "from-green-400 to-green-600",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      number: `${counters.verification}%`,
      label: "Verified Cases",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      number: `${counters.approval} hrs`,
      label: "Approval Time",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      gradient: "from-orange-400 to-orange-600",
    },
  ]

  const trustFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Medical Verification",
      description: "Every case is verified by our medical experts and hospital partners",
      color: "text-blue-600",
      delay: "delay-0",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "100% Transparency",
      description: "Complete visibility of fund utilization with regular updates",
      color: "text-green-600",
      delay: "delay-200",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Tax Benefits",
      description: "Donors get 80G tax deduction certificates for their contributions",
      color: "text-purple-600",
      delay: "delay-500",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Dedicated support team to help you throughout your fundraising journey",
      color: "text-orange-600",
      delay: "delay-700",
    },
  ]

  return (
    <section
      id="trust-indicators"
      className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full opacity-10 animate-float-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-200 rounded-full opacity-10 animate-float-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-200 rounded-full opacity-10 animate-float-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-16 relative">
          <div
            className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trusted by Thousands
            </h2>
            <p className="text-gray-600 mb-12 text-lg">{"India's"} most trusted medical crowdfunding platform</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center group transform transition-all duration-700 hover:scale-110 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-6">
                  {/* Animated background ring */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-full opacity-20 scale-0 group-hover:scale-150 transition-transform duration-500`}
                  ></div>

                  {/* Icon container with hover effects */}
                  <div
                    className={`${stat.color} ${stat.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}
                  >
                    <div className="transform transition-transform duration-300 group-hover:scale-125">{stat.icon}</div>

                    {/* Pulsing effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-full opacity-30 scale-100 animate-ping group-hover:animate-pulse`}
                    ></div>
                  </div>
                </div>

                <div className="transform transition-all duration-300 group-hover:scale-105">
                  <div className={`sm:text-4xl xs:text-2xl font-bold ${stat.color} mb-2 tabular-nums`}>{stat.number}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>

                {/* Animated progress bar */}
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transform transition-all duration-2000 ease-out ${
                      isVisible ? "translate-x-0" : "-translate-x-full"
                    }`}
                    style={{ animationDelay: `${index * 300}ms` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Features with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/50 transform transition-all duration-700 hover:scale-105 hover:shadow-xl hover:bg-white group ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              } ${feature.delay}`}
            >
              <div className="relative mb-4">
                <div
                  className={`${feature.color} transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-6`}
                >
                  {feature.icon}
                </div>

                {/* Animated accent line */}
                <div
                  className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r ${feature.color.replace("text-", "from-")} to-transparent transform transition-all duration-500 ${
                    isVisible ? "w-full" : "w-0"
                  }`}
                  style={{ animationDelay: `${index * 200 + 500}ms` }}
                ></div>
              </div>

              <h3 className={`font-semibold text-gray-900 mb-2 group-hover:${feature.color} transition-colors`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Certifications with floating animation */}
        <div className="mt-12 text-center">
          <div
            className={`bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50 inline-block transform transition-all duration-1000 hover:scale-105 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ animationDelay: "1s" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2 group">
                <Shield className="h-5 w-5 text-green-600 transform transition-transform group-hover:scale-125" />
                <span className="group-hover:text-green-600 transition-colors">ISO 27001 Certified</span>
              </span>
              <span className="flex items-center gap-2 group">
                <CheckCircle className="h-5 w-5 text-blue-600 transform transition-transform group-hover:scale-125" />
                <span className="group-hover:text-blue-600 transition-colors">Government Approved</span>
              </span>
              <span className="flex items-center gap-2 group">
                <Award className="h-5 w-5 text-purple-600 transform transition-transform group-hover:scale-125" />
                <span className="group-hover:text-purple-600 transition-colors">RBI Compliant</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default AnimatedTrustIndicators
