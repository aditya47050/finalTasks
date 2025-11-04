"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";    
   const ChangePasswordClient = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added state for submission tracking
  const router = useRouter();
  // Handle sending OTP
  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otps/loginsendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Only sending email for OTP
      });

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
      const verifyRes = await fetch("/api/otps/loginverifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }), // Sending email and OTP
      });

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

    // Validate password match and strength
    if (password !== confirmPassword) {
      toast("Passwords do not match");
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(password)) {
      toast(
        "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      );
      setIsLoading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/patient/changepassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      toast(data.message || "Password changed successfully!");
      router.push("/patient/dashboard");
    } catch (error) {
      console.error("Error changing password:", error);
      toast(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  };
  return (
    <div className="mx-auto container max-w-5xl">
      <div className="justify-center text-center font-poppins pt-4">
        <h1 className="text-[20px] text-[#243460] font-extrabold">
          Change Password
        </h1>
        <p className="text-[#243460] text-[11px]">Update Your Details</p>
      </div>
      <form onSubmit={handleSubmit} className="font-poppins pt-4">
        <div className="flex flex-wrap md:flex-nowrap md:space-x-4">
          <div className="w-full relative">
            <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
              User ID / Email ID*
            </h1>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:h-12 h-8 placeholder:md:text-[16px] placeholder:text-[12px] p-2 pr-10 placeholder:text-white text-white bg-[#5271FF] placeholder:pl-2 rounded-full border-[#453565]"
                placeholder="Enter Email ID"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isOtpSent || isLoading}
                className="absolute right-1 text-[#243460] text-[12px] md:text-[14px] font-poppins bg-white rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
              >
                {isLoading && !isOtpSent
                  ? "Sending..."
                  : isOtpSent
                  ? "Sent"
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
                className="w-full md:h-12 h-8 placeholder:md:text-[16px] placeholder:text-[12px] p-2 pr-10 rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565]"
                placeholder="Enter OTP"
                // required
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isOtpVerified || !isOtpSent}
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

        <div className="space-y-4 mt-1 md:mt-8">
          <div className="flex flex-wrap md:flex-nowrap justify-center md:space-x-4">
            <div className="w-full relative md:mt-0 mt-2">
              <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                New Password*
              </h1>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full md:h-12 h-8 placeholder:md:text-[16px] placeholder:text-[12px] p-2 border placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] rounded-full"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#243460] text-[12px] md:text-[14px] bg-white rounded-2xl px-2 py-1 z-10"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  disabled={!password}
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="w-full relative md:mt-0 mt-2">
              <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                Confirm Password*
              </h1>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full md:h-12 h-8 placeholder:md:text-[16px] placeholder:text-[12px] p-2 border placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] rounded-full"
                  placeholder="Enter Confirm Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#243460] text-[12px] md:text-[14px] bg-white rounded-2xl px-2 py-1 z-10"
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                  disabled={!confirmPassword}
                >
                  {isConfirmPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {!validatePassword(password) && password && (
            <div className="border-2 mt-4 container max-w-xl rounded-[15px] p-2 justify-center items-center ">
              <p className="text-[#002e6e] text-[14px] font-bold ml-4">Password Strength:</p>
              <p className="text-[#002e6e] text-[14px]  ml-4">
                {" "}
                Use at least 8 characters. Don’t use a password from another
                site, or something too obvious like your pet’s name. Use one
                special character, one capital letter, one number.
              </p>
            </div>
          )}

        <div className="flex justify-center items-center">
         
          <button
            type="submit"
            className="mt-4  text-center text-white font-poppins font-semibold bg-[#5271FF] rounded-full px-4 py-2"
          >
            {isLoading ? "Please wait..." : " Submit Request  "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordClient;
