"use client"
import { useState } from "react";
import { Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./login";

const AarogyaDhanLogin = () => {
  const router = useRouter();

  // State for form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  // OTP and form states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Please enter a valid password");
      return;
    }

    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/${userType === 'donor' ? 'aarogyadhan/donor' : userType}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, mobile }),
      });

      if (!res.ok) {
        throw new Error("Failed to login");
      }

      const data = await res.json();
      toast.success("Login successful!");
      router.push(`/${userType}/dashboard`);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/bharat_aarogya_aadhar?fbclid=IwAR01L-bScstf5s0OHppAV4ztfW9hTVdYy9rMAykGAvHGxAjeSzVRaqa1jQ",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61554162329099",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "#",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/company/aarogya-aadhar/?viewAsMember=true",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtu.be/T5BCaTuZUpY",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-0 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <div className="w-full max-w-4xl">
        <Card className="border-none">
          <div className="justify-center mb-2 font-poppins text-center ">
            <h1 className="md:text-[25px] text-xl text-[rgb(82,113,255)] font-extrabold">
              <span className="shadow-inherit">AarogyaDhan</span>
            </h1>
          </div>

          <CardContent className="px-6 md:px-8 ">
            <Tabs defaultValue="donor" className="w-full">
              <TabsList className="grid w-full md:px-64 grid-cols-2 mb-8 gap-4  p-1 rounded-full">
                <TabsTrigger
                  value="patient"
                  className="rounded-full p-2 font-medium data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-900  data-[state=active]:bg-[#5271FF] data-[state=active]:text-white transition-all duration-200"
                >
                  Patient Login
                </TabsTrigger>
                <TabsTrigger
                  value="donor"
                  className="rounded-full p-2 font-medium data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-900  data-[state=active]:bg-[#5271FF] data-[state=active]:text-white transition-all duration-200"
                >
                  Donor Login
                </TabsTrigger>
              </TabsList>
              <TabsContent value="patient" className="mt-0">
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  otp={otp}
                  setOtp={setOtp}
                  mobile={mobile}
                  setMobile={setMobile}
                  password={password}
                  setPassword={setPassword}
                  userType="patient"
                />
              </TabsContent>

              <TabsContent value="donor" className="mt-0">
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  otp={otp}
                  setOtp={setOtp}
                  mobile={mobile}
                  setMobile={setMobile}
                  password={password}
                  setPassword={setPassword}
                  userType="donor"
                />
              </TabsContent>
            </Tabs>

            {/* Register Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-[#243460] font-medium">
                {" Don't"} have an account?{" "}
                <Link
                  href="/aarogyadhan/register"
                  className="text-[#ff5e00] font-semibold hover:underline transition-colors duration-200"
                >
                  Register Now
                </Link>
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center items-center mt-6 space-x-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  className="bg-[#2b73ec] hover:bg-[#1e5bb8] p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-white" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AarogyaDhanLogin;