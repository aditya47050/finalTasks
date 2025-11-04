"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
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
      toast.success("OTP sent to your email");
      setIsOtpSent(true);
    } catch (error) {
      toast.error("User not found");
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
        toast.success("OTP verified successfully!");
        setIsOtpVerified(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP: " + error.message);
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
      toast.error("Passwords do not match");
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

      toast.success(data.message || "Password changed successfully!");
      router.push("/pharmacy/dashboard");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Something went wrong");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="justify-center text-center font-poppins pt-4">
              <h1 className="text-3xl font-bold text-[#243460] mb-2">
                  <span className="shadow-inherit">
                  Change Password
                  </span>
              </h1>
              <p className="text-[#5271FF] text-lg">Update Your Details</p>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl mt-8 p-8">
              <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                            <FiMail className="text-[#5271FF]" />
                            Email ID*
                          </label>
                            <div className="relative">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Email ID"
                                required
                              />
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                              >
                                {isLoading && !isOtpSent
                                  ? "Sending..."
                                  : isOtpSent
                                  ? "Resend"
                                  : "Send OTP"}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FiLock className="text-[#5271FF]" />
                              Enter OTP
                            </label>
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
                                className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter OTP"
                                // required
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={isOtpVerified || !isOtpSent}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                              >
                                {isLoading && !isOtpVerified
                                  ? "Verifying..."
                                  : isOtpVerified
                                  ? "Verified"
                                  : "Verify OTP"}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiLock className="text-[#5271FF]" />
                          New Password*
                        </label>
                            <div className="relative">
                              <input
                                type={isPasswordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 text-lg"
                                placeholder="Enter Password"
                                required
                              />
                              <button
                                type="button"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                disabled={!password}
                              >
                                {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiLock className="text-[#5271FF]" />
                          Confirm Password*
                        </label>
                            <div className="relative">
                              <input
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 text-lg"
                                placeholder="Enter Confirm Password"
                                required
                              />
                              <button
                                type="button"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                                onClick={() =>
                                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                                }
                                disabled={!confirmPassword}
                              >
                                {isConfirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mx-auto flex items-center justify-center mt-6 lg:mt-6 md:mt-6">
                          <button
                            type="submit"
                            className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                          >
                            {isLoading ? "Please wait..." : " Submit Request  "}
                          </button>
                        </div>
                        {!validatePassword(password) && password && (
                          <div className="border-2 mt-4 container max-w-xl rounded-[15px] p-2 justify-center items-center ">
                            <p className="text-[#002e6e] text-[14px] font-bold ml-4">
                              Password Strength:
                            </p>
                            <p className="text-[#002e6e] text-[14px]  ml-4">
                              {" "}
                              Use at least 8 characters. Don’t use a password from another site,
                              or something too obvious like your pet’s name. Use one special
                              character, one capital letter, one number.
                            </p>
                          </div>
                        )}
                      </div>
              
                      
                    </form>
            </div>
          </div>
        </div>
  );
};

export default ChangePasswordClient;
