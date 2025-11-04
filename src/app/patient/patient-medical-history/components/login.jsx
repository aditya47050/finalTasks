"use client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowDown,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const PatientMedicalHistorylogin = ({ emaildata }) => {
  let finalmail = "";

  if (emaildata) {
    finalmail = decodeURIComponent(emaildata); // Use decodeURIComponent
  }

  const router = useRouter();
  // State for form fields
  const [email, setEmail] = useState(finalmail || ""); // Initialize with decoded email if available
  const [otp, setOtp] = useState("");
  // OTP and form states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (finalmail) {
      setEmail(finalmail);
    }
  }, [finalmail]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch(
        "/api/patient/patient-medical-history/otps/loginsendotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Only sending email for OTP
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }

      toast("OTP sent to your email");
      setIsOtpSent(true);
    } catch (error) {
      toast("Something went wrong: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const verifyRes = await fetch(
        "/api/patient/patient-medical-history/otps/loginverifyotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }), // Sending email and OTP
        }
      );

      const data = await verifyRes.json();
      if (data.success) {
        toast("OTP verified successfully!");
        setIsOtpVerified(true);
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast("Failed to verify OTP: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    // Disable the button while submitting
    // if (!isOtpVerified) {
    //   toast("Please verify OTP before submitting.");
    //   return; // Early return if OTP is not verified
    // }
    try {
      const res = await fetch("/api/patient/patient-medical-history/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important for JSON body
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to login an account");
      }

      const data = await res.json();
      toast("Login Success");
      router.push("/patient/dashboard");
    } catch (error) {
      toast("Something Went Wrong");
      router.push("/patient/patient-medical-history");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  return (
    <>
      {" "}
      <div className=" font-poppins  justify-between pb-40 md:pb-0">
        <div className="justify-center font-poppins text-center ">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Patient Medical History</span>
          </h1>
          <p className="text-[#5271FF] text-[15px] md:text-[20px]">
            QR Code Scanner
          </p>
        </div>
        {/* Form and Details */}
        <form onSubmit={handleSubmit}>
          <div className="w-full  mx-auto container flex gap-4 mb-2">
            {/* Form Section */}

            <div className="w-full">
              <div className="mx-auto container w-full  lg:px-64 rounded-xl">
                <div className="space-y-4  mt-4">
                  <div className="flex flex-wrap md:flex-nowrap md:space-x-4 ">
                    <div className="w-full relative">
                      <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4  font-poppins">
                        User ID / Email ID*
                      </h1>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full md:pr-24 md:h-12 h-8 placeholder:md:text-[16px]  placeholder:text-[12px] p-2 pr-10 placeholder:text-white text-white bg-[#5271FF] placeholder:pl-2 rounded-full border-[#453565]"
                          placeholder="Enter Email ID"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="absolute right-1 text-[#243460] text-[12px] md:text-[14px] font-poppins bg-white rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                        >
                          {isLoading && !isOtpSent
                            ? "Sending..."
                            : isOtpSent
                            ? "Resend"
                            : "Send OTP"}
                        </button>
                      </div>
                    </div>
                    <div className="w-full relative md:mt-0 mt-2">
                      <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                        Email ID OTP*
                      </h1>
                      <div className="relative">
                        <input
                          type="number"
                          value={otp}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Allow only numbers and limit to 6 digits
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setOtp(inputValue);
                            }
                          }}
                          className="w-full md:h-12 h-8 placeholder:md:text-[16px]  placeholder:text-[12px] p-2 pr-10 rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565]"
                          placeholder="Enter OTP"
                          // required
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isOtpVerified}
                          className="absolute right-1 text-[#243460] text-[12px] md:text-[14px] bg-white font-poppins rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                        >
                          {isLoading && !isOtpVerified
                            ? "Verifying..."
                            : isOtpVerified
                            ? "Verified"
                            : "Verify OTP"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mx-auto flex items-center justify-center mt-10 md:mt-6">
                  <button
                    type="submit"
                    className="bg-[#5271FF] font-semibold text-white px-4 py-2 rounded-full"
                    disabled={isSubmitting}
                  >
                    {isLoading ? "Please Wait.." : "Submit"}
                  </button>
                </div>
              </div>

              <div className="mx-auto flex justify-center items-center container mt-4">
                <ul className="list-none flex gap-1">
                  <li>
                    <Link href="https://www.instagram.com/bharat_aarogya_aadhar?fbclid=IwAR01L-bScstf5s0OHppAV4ztfW9hTVdYy9rMAykGAvHGxAjeSzVRaqa1jQ">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Instagram color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.facebook.com/profile.php?id=61554162329099">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Facebook color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Twitter color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.linkedin.com/company/aarogya-aadhar/?viewAsMember=true">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Linkedin color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://youtu.be/T5BCaTuZUpY">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Youtube color="#fff" />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PatientMedicalHistorylogin;
