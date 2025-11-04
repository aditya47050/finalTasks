"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Mobilefooter from "@/app/components/mobilefooter";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";

const JobSeekerLogin = () => {
  const router = useRouter();

  // State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  // Status
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Email validation
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
      const res = await fetch("/api/jobaadhar/job-seeker/loginsendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      toast.success("OTP sent to your email");
      setIsOtpSent(true);
    } catch (error) {
      toast.error("User not found");
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
      const res = await fetch("/api/jobaadhar/job-seeker/loginverifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
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

  // Password validation
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>?]).{8,}$/;
    return regex.test(password);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobaadhar/job-seeker/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mobile }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Login failed");
        return;
      }
      toast.success("Login successful!");
      window.location.href = "/jobaadhar";
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="font-poppins my-16">
        <div className="text-center">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            Job Seeker Login
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="w-full mx-auto md:container flex gap-4 mb-2">
            <div className="w-full">
              <div className="mx-auto container w-full lg:px-36 xl:px-64 rounded-xl">
                {/* Email + OTP */}
                <div className=" mt-4 flex flex-wrap md:flex-nowrap md:space-x-4">
                  <div className="w-full relative">
                    <h1 className="text-[#453565] font-semibold ml-4">
                      Email ID*
                    </h1>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                        <FiMail />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full md:h-12 h-8 pl-10 pr-24 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                        placeholder="Enter Your Email ID"
                        required
                      />
                      {!isOtpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="absolute right-2 text-[#243460] bg-white rounded-full px-2 py-1 top-1/2 -translate-y-1/2"
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
                  <div className="w-full relative">
                    <h1 className="text-[#453565] font-semibold ml-4">
                      Email OTP*
                    </h1>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^\d{0,6}$/.test(v)) setOtp(v);
                        }}
                        maxLength={6}
                        className="w-full md:h-12 h-8 pl-4 pr-20 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                        placeholder="Enter 6-Digit OTP"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isOtpVerified}
                        className="absolute right-2 text-[#243460] bg-white rounded-full px-2 py-1 top-1/2 -translate-y-1/2"
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
                {/* Mobile + Password */}
                <div className=" mt-6 flex flex-wrap md:flex-nowrap md:space-x-4">
                  <div className="w-full">
                    <h1 className="text-[#453565] font-semibold ml-4">
                      Mobile Number*
                    </h1>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                        <FiPhone />
                      </span>
                      <input
                        type="text"
                        value={mobile}
                        maxLength={10}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^[0-9]*$/.test(v)) setMobile(v);
                        }}
                        className="w-full md:h-12 h-8 pl-10 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                        placeholder="Enter 10-Digit Mobile"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full relative">
                    <h1 className="text-[#453565] font-semibold ml-4">
                      Password*
                    </h1>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                        <FiLock />
                      </span>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full md:h-12 h-8 pl-10 pr-10 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                        placeholder="Enter Password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                        onClick={() =>
                          setIsPasswordVisible(!isPasswordVisible)
                        }
                        disabled={!password}
                      >
                        {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <Link href="/jobaadhar/job-seeker/authforgot">
                        <span className="text-[#ff5e00] text-sm absolute right-1 top-full mt-2">
                          Forgot Password?
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Submit */}
                <div className="mx-auto flex items-center justify-center mt-8">
                  <button
                    type="submit"
                    className="bg-[#5271FF] text-white px-6 py-2 rounded-full"
                    disabled={isSubmitting}
                  >
                    {isLoading ? "Please Wait.." : "Log in"}
                  </button>
                </div>
                {!validatePassword(password) && password && (
                  <p className="text-red-500 text-sm mt-2">
                    Password must be at least 8 characters, include uppercase,
                    lowercase, number, and special character.
                  </p>
                )}
              </div>
              <div className="h-[1px] lg:w-3/5 px-2 mt-8 mx-auto bg-gray-200"></div>
              <div className="mx-auto mt-8 text-center font-bold text-[#243460]">
                Don’t have an account?{" "}
                <Link
                  href="/jobaadhar/job-seeker/register"
                  className="text-[#ff5e00]"
                >
                  Register
                </Link>
              </div>
              <Mobilefooter />
            </div>
          </div>
        </form>
      </div>

      {/* Mobile version (similar to PatientLogin mobile) */}
      {/* You can reuse the mobile form styling the same way with props updated to Job-Seeker */}
    </>
  );
};

export default JobSeekerLogin;
