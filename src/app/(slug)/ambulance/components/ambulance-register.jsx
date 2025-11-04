"use client";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ArrowDown, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For navigation
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Mobilefooter from "@/app/components/mobilefooter";
import Image from "next/image";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { FaArrowCircleDown } from 'react-icons/fa';
const AmbulanceRegister = () => {
  const router = useRouter();

  // State for form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setcategory] = useState("");


  // OTP and form states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
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
      const res = await fetch("/api/send-otp", {
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
      const verifyRes = await fetch("/api/verify-otp", {
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

  //password regex
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if CAPTCHA is verified
    if (!captchaVerified) {
      toast("Please verify that you are not a robot.");
      return; // Early return if CAPTCHA is not verified
    }

    // Check if OTP is verified
    // if (!isOtpVerified) {
    //   toast("Please verify OTP before submitting.");
    //   return; // Early return if OTP is not verified
    // }

    // Validate password
    if (!validatePassword(password)) {
      toast("Password does not meet the required criteria."); // Alert for password criteria
      return; // Early return if password is invalid
    }

    // Check if passwords match
    if (password !== rePassword) {
      toast("Passwords don't match"); // Alert for password mismatch
      return; // Early return if passwords do not match
    }

    // All conditions met, proceed to register
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const registerRes = await fetch("/api/ambulance/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile, // Assuming you're registering with mobile number
          email,
          password,
          pincode,
          category,
        }),
      });

      if (!registerRes.ok) {
        throw new Error("Failed to create an account");
      }

      toast("Account created successfully!");
      router.push("/ambulance/login"); // Redirect to login
    } catch (error) {
      toast("Failed to create an account: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Handle captcha change
  const onCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
  const [isSamePasswordVisible, setIsSamePasswordVisible] = useState(false); // State for password visibility
  return (
    <>
      <div className="hidden md:block mt-1 justify-between font-poppins md:pb-0">
        <div className="justify-center text-center ">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Aarogya Aadhar</span>
          </h1>
          <p className="text-[#5271FF] text-[15px] md:text-[20px]">
          Ambulance/Mobile Equipment Lab Registration
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div className="w-full mx-auto container flex gap-4 mb-2">
            <div className="w-full">
              <div className="mx-auto md:container w-full lg:px-40 rounded-xl">
              <div className="w-full relative justify-center mt-4 flex flex-col items-center">  
                    
                      <div className="lg:w-auto w-full relative">
                        <select
                          className="w-full md:h-12 h-8 p-2 pl-4  pr-10 placeholder:md:text-[16px]  placeholder:text-[12px] rounded-full  placeholder:text-white text-white bg-[#5271FF] border-[#453565]"
                          required
                          name="category"
                          value={category}
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          <option value="">Select Category</option>
                          <option value="ambulance">Ambulance</option>
                          <option value="mobile_equipment">Mobile Equipment Lab Registration</option>

                     
                        </select>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <FaArrowCircleDown className="text-white w-7 h-7" />
                            </span>
                      </div>
                    </div>
                <div className="space-y-4 mt-4">
                                  <div className="flex flex-wrap md:flex-nowrap md:space-x-4">
                                    {/* Email Input */}
                                    <div className="w-full relative">
                                      <h1 className="text-[#453565] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
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
                                     {!isOtpVerified &&     <button
                                          type="button"
                                          onClick={handleSendOtp}
                                          
                                          className="absolute right-1 text-[#243460] text-[12px] md:text-[14px] font-poppins bg-white rounded-full px-2 py-1 lg:py-[7px] top-1/2 transform -translate-y-1/2 md:mr-1"
                                        >
                                          {isLoading && !isOtpSent
                                            ? "Sending..."
                                            : isOtpSent
                                            ? "Resend"
                                            : "Send OTP"}
                                        </button>}  
                                      </div>
                                    </div>
                
                                    {/* OTP Input */}
                                    <div className="w-full relative mt-2 md:mt-0">
                                      <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                                        Email OTP*
                                      </h1>
                                      <div className="relative mt-1">
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
                                          className="w-full md:h-12 h-8 p-2 pl-4  pr-10 placeholder:md:text-[16px]  placeholder:text-[12px] rounded-full  placeholder:text-white text-white bg-[#5271FF] border-[#453565]"
                                          placeholder="Enter 6-Digit OTP"
                                          required
                                        />
                                        <button
                                          type="button"
                                          onClick={handleVerifyOtp}
                                          disabled={isOtpVerified || isLoading}
                                          className="absolute right-1 text-[#243460] text-[12px] md:text-[14px] bg-white font-poppins rounded-full px-2 py-1 lg:py-[7px] top-1/2 transform -translate-y-1/2 md:mr-1"
                                        >
                                          {isLoading && isOtpSent && !isSubmitting
                                            ? "Verifying..."
                                            : isOtpVerified
                                            ? "Verified"
                                            : "Verify OTP"}
                                        </button>
                                      </div>
                                    </div>
                
                                    {/* Mobile Number Input */}
                                    <div className="w-full mt-2 md:mt-0">
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
                                        maxLength="10"
                                          onChange={(e) => {
                    const value = e.target.value;
                    // Ensure the input is numeric and has a maximum length of 10
                    if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                      setMobile(value);
                    }
                  }}
                                        className="w-full md:h-12 h-8 pl-10  md:pr-2 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                                        placeholder="Enter 10-Digit Mobile Number"
                                        required
                                      />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                
                                {/* Password Inputs */}
                                <div className="space-y-4 mt-1 md:mt-8">
                                  <div className="flex flex-wrap md:flex-nowrap justify-center md:space-x-4">
                                    {/* Password Input */}
                                    <div className="w-full mt-1 md:mt-0">
                                      <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
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
                                      </div> 
                                      {/* Password Error Message */}
                                      {!validatePassword(password) && password && (
                                        <p className="text-red-500 text-sm ml-4">
                                          Password must be at least 8 characters, include 1
                                          uppercase, 1 lowercase, 1 number, and 1 special
                                          character.
                                        </p>
                                      )}
                                    </div>
                
                                    {/* Re-type Password Input */}
                                    <div className="w-full mt-2 md:mt-0">
                                      <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                                        Re-type Password*
                                      </h1>
                                      <div className="relative mt-1">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                                          <FiLock />
                                        </span>
                                      <input
                                        type={isSamePasswordVisible ? "text" : "password"}
                                        value={rePassword}
                                        onChange={(e) => setRePassword(e.target.value)}
                                        className="w-full md:h-12 h-8 pl-10 pr-20 md:pr-28 placeholder:md:text-[16px] md:text-[16px] text-[12px] placeholder:text-[12px] p-2 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                                        placeholder="Re-type Your Password"
                                        required
                                      />
                                      <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-[16px] z-10"
                                        onClick={() => setIsSamePasswordVisible(!isSamePasswordVisible)}
                                        disabled={!password}
                                      >
                                        {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                                      </button>
                                      </div>
                                      {/* Re-password Error Message */}
                                      {rePassword && rePassword !== password && (
                                        <p className="text-red-500 text-sm ml-4">
                                          Passwords do not match.
                                        </p>
                                      )}
                                    </div>
                
                                    {/* Pincode Input */}
                                    <div className="w-full mt-2 md:mt-0">
                                      <h1 className="text-[#243460] font-semibold text-[14px] md:text-[16px] ml-4 font-poppins">
                                        Pincode*
                                      </h1>
                                      <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          // Ensure the input is numeric and has a maximum length of 6
                                          if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                                            setPincode(value);
                                          }
                                        }}
                                        className="w-full md:h-12 h-8 p-2 placeholder:md:text-[16px]  placeholder:text-[12px] border placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] rounded-full"
                                        placeholder="Enter Your 6-Digit Pincode"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>

                {/* ReCAPTCHA */}
                <div className="flex justify-center mt-4">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-[#5271FF] font-semibold text-white px-4 py-2 rounded-full"
                    disabled={isSubmitting || !captchaVerified}
                  >
                    {isLoading && isOtpVerified && captchaVerified
                      ? "Submitting"
                      : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="hidden lg:block h-[1px] lg:w-4/6 px-2 mt-4 mx-auto bg-gray-200"></div> 
        <div className="mx-auto mt-4 flex justify-center text-[14px] md:text-[16px] items-center container font-bold font-poppins text-[#243460] ">
                <p>
                  have an account?{" "}
                  <span className="font-poppins font-bold text-[14px] md:text-[16px] text-[#ff5e00] ">
                    <Link href={"/ambulance/login"}>Login</Link>
                  </span>
                </p>
              </div>
      </div>
      <div className="block md:hidden px-2 justify-between font-poppins md:pb-0">
        <div className="justify-center text-center ">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Aarogya Aadhar</span>
          </h1>
          <p className="text-[#5271FF] text-[15px] md:text-[20px]">
          Ambulance/Mobile Equipment Lab Registration
          </p>
        </div>

        {/* Form Section */}
        <div className=" md:w-[70%] mx-auto bg-[#5271FF] container  md:border-2 lg:border-[#2b73ec] shadow-lg hover:shadow-xl transition-shadow p-1 xs:p-4  rounded-xl my-4">
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4"> 
                  <div className="w-full">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                        max-[800px]:text-[16px] 
                        max-[1100px]:text-[12px] font-poppins">
                        Select Category*
                      </h1> 
                    <select
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
                      required
                      name="category"
                      value={category}
                      onChange={(e) => setcategory(e.target.value)}
                    >
                      <option value="" className="w-full sm:w-1/2 bg-white text-gray-500 text-xs md:text-sm">Select Category</option>
                      <option value="ambulance" className="w-full sm:w-1/2 bg-white text-gray-500 text-xs md:text-sm">Ambulance</option>
                      <option value="mobile_equipment" className="w-full sm:w-1/2 bg-white text-gray-500 text-xs md:text-sm">Mobile Equipment Lab Registration</option>
                    </select>
                  </div>
                  {/* Email Input */}
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
                  {/* OTP Input */}
                  <div className="w-full">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                      max-[800px]:text-[16px] 
                      max-[1100px]:text-[12px]  font-poppins">
                      Email OTP*
                    </h1>
                    <div className="relative mt-1">
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
                        // required
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isOtpVerified || isLoading}
                        className="absolute right-1 xs:right-2 min-[820px]:right-2 min-[1000px]:right-1 min-[1100px]:right-2 text-[#5271FF]  
                      min-[1100px]:text-[16px] 
                      max-[800px]:text-[16px] 
                      max-[1100px]:text-[10px]
                      bg-white font-poppins rounded-2xl px-2 xl:px-[12px] xs:py-[3px] md:py-1 top-1/2 transform -translate-y-1/2"
                      >
                        {isLoading && isOtpSent && !isSubmitting
                          ? "Verifying..."
                          : isOtpVerified
                          ? "Verified"
                          : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                  {/* Mobile Number Input */}
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
                        maxLength="10"
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ensure the input is numeric and has a maximum length of 10
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
                    </div>
                    {/* Password Error Message */}
                    {!validatePassword(password) && password && (
                      <p className="text-red-500 text-sm ml-4">
                        Password must be at least 8 characters, include 1
                        uppercase, 1 lowercase, 1 number, and 1 special
                        character.
                      </p>
                    )}
                  </div>
                  {/* Re-type Password Input */}
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
                      Re-type Password*
                    </h1>
                    </div>
                    <div className="relative mt-1">
                      <input
                        type={isSamePasswordVisible ? "text" : "password"}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
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
                        placeholder="Re-type Your Password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-[16px] z-10"
                        onClick={() =>
                          setIsSamePasswordVisible(!isSamePasswordVisible)
                        }
                        disabled={!password}
                      >
                        {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {/* Re-password Error Message */}
                    {rePassword && rePassword !== password && (
                      <p className="text-red-500 text-sm ml-4">
                        Passwords do not match.
                      </p>
                    )}
                  </div>
                  {/* Pincode Input */}
                  <div className="w-full">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                      max-[800px]:text-[16px] 
                      max-[1100px]:text-[12px]  font-poppins">
                      Pincode*
                    </h1>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Ensure the input is numeric and has a maximum length of 6
                        if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                          setPincode(value);
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
                      placeholder="Enter Your 6-Digit Pincode"
                      required
                    />
                  </div>
                  {/* ReCAPTCHA */}
                  <div className="flex justify-center mt-4">
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={onCaptchaChange}
                    />
                  </div>
                  {/* Submit Button */}
                  <div className="mx-auto py-2 flex items-center justify-center mt-4 lg:mt-8">
                    <button
                      type="submit"
                      className="text-[#5271FF] bg-white min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] rounded-xl py-2 px-8 shadow-2xl font-bold"
                      disabled={isSubmitting || !captchaVerified}
                    >
                      {isLoading && isOtpVerified && captchaVerified
                        ? "Submitting"
                        : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
          </form>
        </div>
        <div className="hidden lg:block h-[1px] lg:w-4/6 px-2 mt-4 mx-auto bg-gray-200"></div> 
        <div className="mx-auto mt-4 flex justify-center text-[14px] md:text-[16px] items-center container font-bold font-poppins text-[#243460] ">
                <p>
                  have an account?{" "}
                  <span className="font-poppins font-bold text-[14px] md:text-[16px] text-[#ff5e00] ">
                    <Link href={"/ambulance/login"}>Login</Link>
                  </span>
                </p>
              </div>
      </div>
      {/* <div className="mx-auto flex justify-center items-center container mt-8">
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
      </div> */}
      <Mobilefooter/>
    </>
  );
};

export default AmbulanceRegister;
