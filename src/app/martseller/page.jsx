import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Shield, TrendingDown, Headphones, ArrowRight, CheckCircle2 } from "lucide-react"
import { MartsellerHeader } from './components/martseller-header';
import Link from "next/link";
import { IoCreateOutline, IoRocketOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";


export default function MartsellerHomePage() {
  return (
    <div className="min-h-screen bg-white">
      <MartsellerHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance">
                Sell Online with <span className="text-blue-500">AarogyaMart</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of healthcare sellers and grow your business with India's trusted health marketplace.
                Start selling in minutes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg  rounded-xl">
                    <Link href={'/martseller/login'}> 
                        Start Selling
                    </Link>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in-right">
              {/* <div className="relative z-10">
                <img src="" alt="Healthcare Sellers" className="rounded-2xl shadow-2xl" />
              </div> */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full opacity-100 blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-300 rounded-full opacity-100 blur-3xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Sell on <span className="text-blue-500">AarogyaMart?</span></h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in the healthcare marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "50 lakh+ Customers",
                description: "Access to millions of health-conscious buyers across India",
                delay: "delay-100",
              },
              {
                icon: Shield,
                title: "7* Days Secure Payments",
                description: "Regular and secure payment settlements directly to your account",
                delay: "delay-200",
              },
              {
                icon: TrendingDown,
                title: "Low Cost of Business",
                description: "Minimal fees and transparent pricing to maximize your profits",
                delay: "delay-300",
              },
              {
                icon: Headphones,
                title: "One Click Support",
                description: "Dedicated seller support team available 24/7 to help you",
                delay: "delay-500",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className={`p-8 border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 animate-fade-in-up ${benefit.delay} group`}
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                    <benefit.icon className="h-8 w-8 text-blue-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Selling in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get your healthcare products online in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Quick registration with basic business details and documents",
                icon: <IoCreateOutline />,
              },
              {
                step: "02",
                title: "List Products",
                description: "Add your healthcare products with images and descriptions",
                icon: <FaBoxOpen />,
              },
              {
                step: "03",
                title: "Start Selling",
                description: "Receive orders and grow your business with our support",
                icon: <IoRocketOutline />,
              },
            ].map((step, index) => (
              <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <Card className="p-8 text-center border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:text-blue-500 transition-transform duration-300 flex justify-center">
                    {step.icon}
                  </div>
                  <div className="text-blue-500 font-bold text-sm mb-2">STEP {step.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-blue-500">Seller Success</span> Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from healthcare sellers who grew their business with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Rajesh Kumar",
                business: "Ayurvedic Products",
                image: "/indian-male-doctor.png",
                quote:
                  "AarogyaMart helped me reach customers across India. My sales increased by 300% in just 6 months!",
                growth: "300% Growth",
              },
              {
                name: "Priya Sharma",
                business: "Wellness Supplements",
                image: "/indian-businesswoman.png",
                quote:
                  "The platform is easy to use and the support team is always there to help. Best decision for my business.",
                growth: "5x Revenue",
              },
              {
                name: "Amit Patel",
                business: "Medical Equipment",
                image: "/indian-businessman.png",
                quote: "Started with 10 products, now selling 500+ items. AarogyaMart made scaling effortless.",
                growth: "50x Products",
              },
            ].map((story, index) => (
              <Card
                key={index}
                className="p-8 border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 animate-fade-in-up group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">

                  <div>
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.business}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 italic h-20">"{story.quote}"</p>
                <div className="inline-block bg-blue-50 text-blue-500 px-4 py-2 rounded-full text-sm font-semibold">
                  {story.growth}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              "Easy Product Listing",
              "Inventory Management",
              "Order Tracking",
              "Analytics Dashboard",
              "Quality Assurance",
              "Payment Protection",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">Ready to Grow Your Healthcare Business?</h2>
            <p className="text-xl text-blue-50 leading-relaxed">
              Join 10,000+ sellers already growing their business on AarogyaMart
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-500 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl">
                <Link href={'/martseller/login'}>
                    Start Selling Now
                </Link>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
