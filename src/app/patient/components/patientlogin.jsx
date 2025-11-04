"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Mobilefooter from "@/app/components/mobilefooter";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";

const Patientlogin = () => {
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

    const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email); // Checks if email has @ and a domain
};

  // Handle sending OTP
  const handleSendOtp = async () => {
         if (!isValidEmail(email)) {
       toast.error("Please enter a valid email address."); 
       return; 
     }
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
        toast("OTP verified successfully!");
        setIsOtpVerified(true);
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  };
  useEffect(() => {
    router.prefetch("/patient/dashboard");
  }, [router]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/patient/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, mobile }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || "Login failed.");
        return;
      }

      toast.success("Login successful!");
      router.push("/patient/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      router.push("/patient/login");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  return (
    <>
      {" "}
      <div className="hidden md:block font-poppins  justify-between mt-1 lg:pb-0 md:pb-0">
        <div className="justify-center font-poppins text-center ">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Aarogya Aadhar</span>
          </h1>
          <p className="text-[#5271FF] text-[15px] md:text-[20px] ">
            Patient Login
          </p>
        </div>
        {/* Form and Details */}
        <form onSubmit={handleSubmit}>
          <div className="w-full  mx-auto md:container flex gap-4 mb-2">
            {/* Form Section */}

            <div className="w-full ">
              <div className="mx-auto container w-full lg:px-36  xl:px-64 rounded-xl">
                <div className="space-y-4  mt-4 ">
                  <div className="flex flex-wrap md:flex-nowrap md:space-x-4 ">
                    <div className="w-full relative">
                      <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                        User ID / Email ID*
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
                      <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                        Email ID OTP*
                      </h1>
                      <div className="relative mt-1">
                        <input
                          type="text" // Use text to ensure better control over input
                          value={otp}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Allow only numbers and limit to 6 digits
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setOtp(inputValue);
                            }
                          }}
                          className="w-full md:h-12 h-8 pl-4 pr-20 md:pr-28 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                          placeholder="Enter 6-Digit OTP"
                          maxLength={6} // Additional safeguard
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
                <div className="space-y-4 mt-1 md:mt-8">
                  <div className="flex flex-wrap md:flex-nowrap justify-center md:space-x-4">
                    <div className="w-full md:mt-0 mt-2">
                      <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
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
                            if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                              setMobile(value);
                            }
                          }}
                          className="w-full md:h-12 h-8 pl-10 pr-20 md:pr-28 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                          placeholder="Enter 10-Digit Mobile Number"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full relative md:mt-0 mt-2">
                      <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
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
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          disabled={!password}
                        >
                          {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <Link href={"/patient/authforgot"}>
                          <span className="font-poppins font-bold text-[12px] md:text-[16px] text-[#ff5e00] absolute right-[0.5rem] top-full mt-2 z-0">
                            Forgot Password?
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

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
              </div>
              <div className="h-[1px] lg:w-3/5 px-2 mt-8 mx-auto bg-gray-200"></div>
              <div className="mx-auto mt-8 flex justify-center text-[14px] md:text-[16px] items-center container font-bold font-poppins text-[#243460] ">
                <p>
                  Don’t have an account?{" "}
                  <span className="font-poppins font-bold text-[14px] md:text-[16px] text-[#ff5e00] ">
                    <Link href={"/patient/register"}>Register</Link>
                  </span>
                </p>
              </div>

              <Mobilefooter />
            </div>
          </div>
        </form>
      </div>
      <div className="md:hidden xs:block font-poppins  justify-between px-2 lg:pb-0 md:pb-0">
        <div className="justify-center font-poppins text-center ">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Aarogya Aadhar</span>
          </h1>
          <p className="text-[#5271FF] text-[15px] md:text-[20px] ">
            Patient Login
          </p>
        </div>
        {/* Form and Details */}
        <div className=" md:w-[70%] mx-auto bg-[#5271FF] container  md:border-2 lg:border-[#2b73ec] shadow-lg hover:shadow-xl transition-shadow p-1 xs:p-4  rounded-xl my-4">
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="space-y-4 mt-4">
              {/* Form Section */}

              <div className="grid grid-cols-1 gap-4">
                <div className="w-full">
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white">
                      <FiMail className="
                      min-[1100px]:h-[16px] 
                      max-[800px]:h-5 
                      max-[1100px]:h-3 
                      min-[1100px]:w-[16px] 
                      max-[800px]:w-5 
                      max-[1100px]:w-3 
                      "/>
                    </span>
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                      max-[800px]:text-[16px] 
                      max-[1100px]:text-[12px] ml-6 font-poppins">
                      Email ID*
                    </h1>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 max-[1100px]:pl-4
                          max-[500px]:pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[18px] 
                          max-[800px]:text-[18px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[18px] 
                          max-[800px]:placeholder:text-[18px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-gray-400 
                          text-[#453565]  
                          bg-white 
                          rounded-xl "
                      placeholder="Enter Your Email ID"
                      required
                    />
                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="absolute right-1 xs:right-2 min-[820px]:right-2 min-[1000px]:right-1 min-[1100px]:right-2 text-[#5271FF]  
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[10px]
                          bg-white font-poppins rounded-2xl px-2 xl:px-[12px] xs:py-[3px] md:py-1 top-1/2 transform -translate-y-1/2"
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
                <div className="w-full">
                  <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px]  font-poppins">
                          Email OTP*
                        </h1>
                  <div className="relative mt-1">
                    <input
                      type="text" // Use text to ensure better control over input
                      value={otp}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Allow only numbers and limit to 6 digits
                        if (/^\d{0,6}$/.test(inputValue)) {
                          setOtp(inputValue);
                        }
                      }}
                      className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 max-[1100px]:pl-4
                          max-[500px]:pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[18px] 
                          max-[800px]:text-[18px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[18px] 
                          max-[800px]:placeholder:text-[18px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-gray-400 
                          text-[#453565]  
                          bg-white 
                          rounded-xl "
                      placeholder="Enter 6-Digit OTP"
                      maxLength={6} // Additional safeguard
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isOtpVerified}
                      className="absolute right-1 xs:right-2 min-[820px]:right-2 min-[1000px]:right-1 min-[1100px]:right-2 text-[#5271FF]  
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[10px]
                          bg-white font-poppins rounded-2xl px-2 xl:px-[12px] xs:py-[3px] md:py-1 top-1/2 transform -translate-y-1/2"
                    >
                      {isLoading && !isOtpVerified
                        ? "Verifying..."
                        : isOtpVerified
                        ? "Verified"
                        : "Verify OTP"}
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white">
                      <FiPhone className="min-[1100px]:h-[16px]
                    max-[800px]:h-5 
                    max-[1100px]:h-3 
                    min-[1100px]:w-[16px]
                    max-[800px]:w-5 
                    max-[1100px]:w-3 "/>
                    </span>
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                      max-[800px]:text-[16px] 
                      max-[1100px]:text-[12px] ml-6 font-poppins">
                      Mobile Number*
                    </h1>

                  </div>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={mobile}
                      maxLength={10}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                          setMobile(value);
                        }
                      }}
                      className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 max-[1100px]:pl-4
                          max-[500px]:pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[18px] 
                          max-[800px]:text-[18px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[18px] 
                          max-[800px]:placeholder:text-[18px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-gray-400 
                          text-[#453565]  
                          bg-white 
                          rounded-xl "
                      placeholder="Enter 10-Digit Mobile Number"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="relative"> 
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white">
                      <FiLock className="min-[1100px]:h-[16px]
                    max-[800px]:h-5 
                    max-[1100px]:h-3 
                    min-[1100px]:w-[16px]
                    max-[800px]:w-5 
                    max-[1100px]:w-3 "/>
                    </span>

                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                      max-[800px]:text-[16px] 
                      max-[1100px]:text-[12px] ml-6 font-poppins">
                      Password*
                    </h1>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 max-[1100px]:pl-4
                          max-[500px]:pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[18px] 
                          max-[800px]:text-[18px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[18px] 
                          max-[800px]:placeholder:text-[18px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-gray-400 
                          text-[#453565]  
                          bg-white 
                          rounded-xl "
                      placeholder="Enter Your Password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-[16px] z-10"
                      onClick={() =>
                        setIsPasswordVisible(!isPasswordVisible)
                      }
                      disabled={!password}
                    >
                      {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <Link href={"/patient/authforgot"}>
                      <span className="font-poppins font-bold text-[12px] md:text-[16px] text-[#ff5e00] absolute right-[0.5rem] top-full mt-2 z-0">
                        Forgot Password?
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="mx-auto py-2 flex items-center justify-center mt-4 lg:mt-8">
                  <button
                    type="submit"
                    className="text-[#5271FF] bg-white min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] rounded-xl py-2 px-8 shadow-2xl font-bold"
                    disabled={isSubmitting}
                  >
                    {isLoading ? "Please Wait.." : "Log in"}
                  </button>
                </div>
                {!validatePassword(password) && password && (
                  <p className="text-red-500 text-sm ml-6">
                    Password must be at least 8 characters, include 1 uppercase,
                    1 lowercase, 1 number, and 1 special character.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
          <div className="mx-auto mt-8 flex justify-center text-[14px] md:text-[16px] items-center container font-bold font-poppins text-[#243460] ">
            <p>
              Don’t have an account?{" "}
              <span className="font-poppins font-bold text-[14px] md:text-[16px] text-[#ff5e00] ">
                <Link href={"/patient/register"}>Register</Link>
              </span>
            </p>
          </div>

          <Mobilefooter />
      </div>
    </>
  );
};

export default Patientlogin;
