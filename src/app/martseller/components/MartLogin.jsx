"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Mobilefooter from "@/app/components/mobilefooter";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";

export default function SellerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Send OTP
  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const res = await fetch("/api/aarogyamart/martseller/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "seller" }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");

      toast.success("OTP sent to your email!");
      setIsOtpSent(true);
    } catch (error) {
      toast.error("Seller not found");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const res = await fetch("/api/aarogyamart/martseller/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, type: "seller" }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP verified successfully!");
        setIsOtpVerified(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const res = await fetch("/api/aarogyamart/martseller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mobile }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          toast.warn(data.msg); // ⚠️ Not approved yet
        } else {
          toast.error(data.msg || "Login failed");
        }
        return;
      }

      toast.success("Login successful!");
      router.push("/martseller/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/.test(
      password
    );

  return (
    <div className="font-poppins justify-between mt-1 lg:pb-0 md:pb-0 py-auto min-h-screen">
      <div className="text-center">
        <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
          Aarogya Mart
        </h1>
        <p className="text-[#5271FF] text-[15px] md:text-[20px]">Seller Login</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-full mx-auto md:container flex gap-4 mb-2">
          <div className="w-full mx-auto container lg:px-36 xl:px-64 rounded-xl">
            {/* Email & OTP */}
            <div className="space-y-4 mt-4">
              <div className="flex flex-wrap md:flex-nowrap md:space-x-4">
                <div className="w-full relative">
                  <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4">
                    Email ID*
                  </h1>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                      <FiMail />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full md:h-12 h-8 pl-10 pr-20 md:pr-28 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                      placeholder="Enter Your Email ID"
                      required
                    />
                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="absolute right-1 text-[#243460] text-[12px] md:text-[14px] font-poppins bg-white rounded-full px-2 py-1 lg:py-[7px] top-1/2 transform -translate-y-1/2 md:mr-1"
                      >
                        {isLoading && !isOtpSent
                          ? "Sending..."
                          : isOtpSent
                          ? "Resend"
                          : "Send OTP"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full relative md:mt-0 mt-2">
                  <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4">
                    Email OTP*
                  </h1>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d{0,6}$/.test(inputValue)) setOtp(inputValue);
                      }}
                      className="w-full md:h-12 h-8 pl-4 pr-20 md:pr-28 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                      placeholder="Enter 6-Digit OTP"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isOtpVerified}
                      className="absolute right-1 text-[#243460] text-[12px] md:text-[14px] bg-white font-poppins rounded-full px-2 py-1 lg:py-[7px] top-1/2 transform -translate-y-1/2 md:mr-1"
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

            {/* Mobile & Password */}
            <div className="space-y-4 mt-1 md:mt-8">
              <div className="flex flex-wrap md:flex-nowrap justify-center md:space-x-4">
                <div className="w-full md:mt-0 mt-2">
                  <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4">
                    Mobile Number*
                  </h1>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                      <FiPhone />
                    </span>
                    <input
                      type="text"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10 && /^[0-9]*$/.test(value)) setMobile(value);
                      }}
                      className="w-full md:h-12 h-8 pl-10 pr-20 md:pr-28 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                      placeholder="Enter 10-Digit Mobile Number"
                      required
                    />
                  </div>
                </div>

                <div className="w-full relative md:mt-0 mt-2">
                  <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4">
                    Password*
                  </h1>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                      <FiLock />
                    </span>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full md:h-12 h-8 pl-10 pr-20 md:pr-28 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                      placeholder="Enter Your Password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-[16px] z-10"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      disabled={!password}
                    >
                      {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <Link href={"/martseller/authforgot"}>
                      <span className="font-poppins font-bold text-[12px] md:text-[16px] text-[#ff5e00] absolute right-[0.5rem] top-full mt-2 z-0">
                        Forgot Password?
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mx-auto flex items-center justify-center mt-10 lg:mt-16 md:mt-6">
              <button
                type="submit"
                className="bg-[#5271FF] font-semibold text-white px-4 lg:px-8 py-2 rounded-full"
                disabled={isSubmitting}
              >
                {isLoading ? "Please Wait.." : "Log in"}
              </button>
            </div>

            {!validatePassword(password) && password && (
              <p className="text-red-500 text-sm ml-4">
                Password must be at least 8 characters, include 1 uppercase,
                1 lowercase, 1 number, and 1 special character.
              </p>
            )}

            <div className="h-[1px] lg:w-3/5 px-2 mt-8 mx-auto bg-gray-200"></div>
            <div className="mx-auto mt-8 flex justify-center text-[14px] md:text-[16px] items-center container font-bold font-poppins text-[#243460]">
              <p>
                Don’t have an account?{" "}
                <span className="font-poppins font-bold text-[14px] md:text-[16px] text-[#ff5e00] ">
                  <Link href={"/martseller/register"}>Register</Link>
                </span>
              </p>
            </div>

            <Mobilefooter />
          </div>
        </div>
      </form>
    </div>
  );
}
