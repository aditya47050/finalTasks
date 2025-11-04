"use client";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiUser } from "react-icons/fi";

export default function JobSeekerRegisterPage() {
  const router = useRouter();

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  // ui state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSamePasswordVisible, setIsSamePasswordVisible] = useState(false);

  // email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // send otp
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
      toast.error("Something went wrong: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // verify otp
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
      toast.error("Failed to verify OTP: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // password validation
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>?]).{8,}$/;
    return regex.test(password);
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      toast.error("Please verify you are not a robot.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password does not meet the required criteria.");
      return;
    }
    if (password !== rePassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/jobaadhar/job-seeker/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      if (!res.ok) throw new Error("Failed to register");

      toast.success("Account created successfully!");
      router.push("/jobaadhar/job-seeker/login");
    } catch (error) {
      toast.error("Failed to create an account: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="my-16 font-poppins">
      <div className="text-center my-4">
        <h1 className="text-xl md:text-[25px] font-extrabold text-[#5271FF]">
          Job Seeker Registration
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto container lg:px-40 mt-4">
        {/* full name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="w-full">
            <h1 className="text-[#453565] font-semibold ml-4">Full Name*</h1>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <FiUser />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full md:h-12 h-8 pl-10 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                placeholder="Enter Your Full Name"
                required
              />
            </div>
          </div>
          <div className="w-full relative">
            <h1 className="text-[#453565] font-semibold ml-4">Email*</h1>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <FiMail />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:h-12 h-8 pl-10 pr-28 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                placeholder="Enter Your Email"
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
            <h1 className="text-[#453565] font-semibold ml-4">Email OTP*</h1>
            <div className="relative mt-1">
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  if (/^\d{0,6}$/.test(e.target.value)) setOtp(e.target.value);
                }}
                maxLength={6}
                className="w-full md:h-12 h-8 pl-4 pr-20 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                placeholder="Enter 6-Digit OTP"
                required
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isOtpVerified}
                className="absolute right-2 text-[#243460] bg-white rounded-full px-2 py-1 top-1/2 -translate-y-1/2"
              >
                {isLoading && isOtpSent && !isSubmitting
                  ? "Verifying..."
                  : isOtpVerified
                  ? "Verified"
                  : "Verify OTP"}
              </button>
            </div>
          </div>
          <div className="w-full">
            <h1 className="text-[#453565] font-semibold ml-4">Mobile Number*</h1>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <FiPhone />
              </span>
              <input
                type="text"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  if (/^[0-9]{0,10}$/.test(e.target.value)) setPhone(e.target.value);
                }}
                className="w-full md:h-12 h-8 pl-10 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                placeholder="Enter 10-Digit Mobile Number"
                required
              />
            </div>
          </div>
          <div className="w-full">
            <h1 className="text-[#453565] font-semibold ml-4">Password*</h1>
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
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={!password}
              >
                {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {!validatePassword(password) && password && (
              <p className="text-red-500 text-sm ml-4">
                Password must include uppercase, lowercase, number & special character.
              </p>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-[#453565] font-semibold ml-4">Re-type Password*</h1>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
                <FiLock />
              </span>
              <input
                type={isSamePasswordVisible ? "text" : "password"}
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="w-full md:h-12 h-8 pl-10 pr-10 text-white placeholder:text-white bg-[#5271FF] rounded-full"
                placeholder="Re-type Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                onClick={() => setIsSamePasswordVisible(!isSamePasswordVisible)}
                disabled={!rePassword}
              >
                {isSamePasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {rePassword && rePassword !== password && (
              <p className="text-red-500 text-sm ml-4">Passwords do not match.</p>
            )}
          </div>
        </div>

        {/* captcha */}
        <div className="flex justify-center mt-6">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(value) => setCaptchaVerified(!!value)}
          />
        </div>

        {/* submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-[#5271FF] text-white px-6 py-2 rounded-full"
            disabled={isSubmitting || !captchaVerified}
          >
            {isLoading ? "Submitting..." : "Register"}
          </button>
        </div>

        <div className="h-[1px] w-4/6 bg-gray-200 mx-auto mt-6" />
        <div className="mx-auto mt-4 text-center text-[#243460] font-bold">
          Already have an account?{" "}
          <Link href="/jobaadhar/job-seeker/login" className="text-[#ff5e00]">Login</Link>
        </div>
      </form>
    </div>
  );
}
