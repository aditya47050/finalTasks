"use client"
import SupportSectionGrid from "./components/SupportSectionGrid"
import DhanFooter from "../../components/dhan-footer"
import Image from "next/image"

export default function GetFinancialSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="font-poppins">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50">
          <div className="container mx-auto md:px-4 sm:px-2 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] py-12 lg:py-20">
              {/* Text Content */}
              <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-light leading-tight tracking-tight text-[#5271FF]">
                    GET FINANCIAL <br className="hidden sm:block" />
                    <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mt-2">SUPPORT</span>
                  </h1>
                </div>

                <div className="w-16 h-1 bg-[#5271FF] rounded-full"></div>

                <p className="text-sm sm:text-base lg:text-lg text-[#243460] leading-relaxed max-w-2xl">
                  Cancer and its treatment not only take a toll on the mind and body but also cause a financial burden.
                  Here, we compile some provisions and schemes by various government and non-government organizations
                  that provide reimbursements, funding and other financial support for cancer treatments.
                </p>

                
              </div>

              {/* Image Section */}
              <div className="order-1 lg:order-2 relative">
                <div className="relative group">
                  {/* Background decoration */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#5271FF]/20 to-pink-200/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                  {/* Main image container */}
                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <Image
                      src="https://res.cloudinary.com/dorreici1/image/upload/v1752582414/istockphoto-1216694114-612x612_mc8ow1.jpg"
                      alt="Financial Support Heart"
                      height={400}
                      width={600}
                      className="w-full h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>

                  {/* Floating elements for medical context */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#5271FF] rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#5271FF" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </section>

        {/* Support Section Grid */}
        <section className="py-8 lg:py-8 bg-white">
          <div className="md:container mx-auto sm:px-2 md:px-4  lg:px-8">
            <SupportSectionGrid />
          </div>
        </section>

        {/* Trust indicators */}
        <section className="py-4 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Verified Programs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Government Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Trusted Partners</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DhanFooter />
    </div>
  )
}
