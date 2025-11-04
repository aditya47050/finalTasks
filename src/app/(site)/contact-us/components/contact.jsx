"use client";
import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
const ContactClient = () => {
  const router = useRouter();

  // State for form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullname, setfullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  // OTP and form states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // email validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      toast("Invalid email format. Example: user@example.com");
      return;
    }
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otps/contact-request/send-otp", {
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
      toast("Email ID is invalid: " + error.message);
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
      const verifyRes = await fetch("/api/otps/contact-request/verify-otp", {
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
    // Disable the button while submitting
    // if (!isOtpVerified) {
    //   toast.error("Please verify OTP before submitting.");
    //   return; // Early return if OTP is not verified
    // }
    if (!message) {
      toast.error("Please Enter your message");
      return; // Early return if OTP is not verified
    }
    try {
      const res = await fetch("/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important for JSON body
        },
        body: JSON.stringify({ email, fullname, mobile, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send a message");
      }

      const data = await res.json();
      toast.success("Message Sent! Our Team will connect you shortly");
      router.push("/");
    } catch (error) {
      toast("Server Error");
      router.refresh();
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="hidden lg:block justify-between font-poppins mt-4  md:pb-0 lg:mb-8 xlg:container">
        <div className="justify-center text-center">
          <h1 className="md:text-[25px]  text-xl text-[#5271FF] font-poppins font-extrabold">
            <span className="shadow-inherit">Aarogya Aadhar</span>
          </h1>
          <p className="text-[#5271FF] font-poppins text-[15px] md:text-[20px] ">Contact Us</p>
        </div>
        {/* Form and Details */}
        {/* w-full  mx-auto container flex flex-wrap md:flex-nowrap gap-4 mb-2 */}
        <div className=" w-full lg:w-[90%] mt-4 md:mt-6  mx-auto  lg:mx-12 px-2  flex-wrap md:flex-nowrap flex gap-4 mb-2">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="lg:w-[60%] xl:w-1/2 w-full space-y-2 p-1 xs:p-4 lg:p-8 lg:px-8 rounded-xl">

                  <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <div className="relative">
                        <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                          Full Name*
                        </Label>
                      </div>
                      <div className="relative">
                      <Input
                        type="text"
                        className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                        placeholder="Enter Your Full Name"
                        // required
                        value={fullname}
                        onChange={(e) => setfullname(e.target.value)}
                      />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="relative">
                        <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                          Mobile Number*
                        </Label>
                      </div>
                      <div className="relative  ">
                          
                      <Input
                        type="text"
                        className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                        placeholder="Enter 10-Digit Mobile Number"
                        // required
                        value={mobile}
                        maxLength="10"
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ensure the input is numeric and has a maximum length of 10
                          if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                            setMobile(value);
                          }
                        }}
                      />
                      </div>
                    </div>
                    <div className="w-full ">
                      <div className="relative">
                      <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                        Email ID*
                      </Label>
                      </div>
                      <div className="relative">
                                              
                        <Input
                          type="email"
                          className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                          placeholder="Enter Your Email ID"
                          // required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="absolute right-1 xs:right-2 min-[820px]:right-2 min-[1000px]:right-2 min-[1100px]:right-2 text-[#5271FF]  
                            min-[1100px]:text-[14px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[10px]

                       font-poppins rounded-full px-2 xl:px-[8px] xs:py-[2px] md:py-[4px] xl:py-[2px] top-1/2 transform -translate-y-1/2 bg-white"
                        >
                          {isLoading && !isOtpSent
                            ? "Sending..."
                            : isOtpSent
                            ? "Resend"
                            : "Send OTP"}
                        </button>
                      </div>
                    </div>
                    <div className="w-full relative">
                      <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                        Email ID OTP*
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter 6-Digit OTP"
                          // required
                          value={otp}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Allow only numbers and limit to 6 digits
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setOtp(inputValue);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isOtpVerified}
                          className="absolute right-1 xs:right-2 min-[820px]:right-2 min-[1000px]:right-2 min-[1100px]:right-2 text-[#5271FF]  
                            min-[1100px]:text-[14px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[10px]

                       font-poppins rounded-full px-2 xl:px-[8px] xs:py-[2px] md:py-[4px] xl:py-[2px] top-1/2 transform -translate-y-1/2 bg-white"
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
                  <div className="w-full !mt-4">
                    <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                      Message*
                    </Label>
                    <Textarea
                      className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-xl h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                      placeholder="Enter Message"
                      // required
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                <div className="mx-auto flex items-center font-poppins justify-center !mt-4 lg:!mt-8">
                  <button
                    type="submit"
                    // old css
                    // bg-[#5271FF] md:text-[14px] text-[12px] font-semibold text-white px-4 py-2 rounded-full
                    className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-8 py-2 rounded-full min-w-[120px] transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isLoading ? "Please Wait.." : "Submit"}
                  </button>
                </div>
          </form>
          {/* Contact Details Section */}
          <div className="flex flex-col justify-start gap-2 items-start lg:w-[40%] xl:w-1/2  md:pl-6 xl:p-10 my-auto">
            <div className="mx-auto  md:block hidden p-2 lg:px-6 xl:px-20">
              <div className="mx-auto p-4  bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl">
                <h1 className="font-poppins text-center md:text-left 
                min-[1100px]:text-[24px] 
                            max-[800px]:text-[24px] 
                            max-[1100px]:text-[20px]
              text-white font-bold mb-4">
                  Address
                </h1>
                <p className="font-poppins text-center md:text-left 
                min-[1100px]:text-[18px] 
                            max-[800px]:text-[18px] 
                            max-[1100px]:text-[14px]
                text-white">
                  18, Yashwant Nagar, Range Hill Road <br />
                  Near BOB, Shivajinagar, Pune, MH 411007
                </p>
                <h1 className="font-poppins text-center md:text-left min-[1100px]:text-[24px] 
                            max-[800px]:text-[24px] 
                            max-[1100px]:text-[20px] text-white font-bold mb-2">
                  Mail ID & Contact No
                </h1>
                <p className="font-poppins ml-[18%] md:ml-0 min-[1100px]:text-[18px] 
                            max-[800px]:text-[18px] 
                            max-[1100px]:text-[14px] text-white">
                  info@aarogyaadhar.com <br />
                  patient@aarogyaaadhar.com <br />
                  +91 79-7272-7498 <br />
                  +91 91-4507-8001 <br />
                </p>
              </div>
            </div>
            <div className="mx-auto container mt-4">
              <ul className="list-none flex gap-1 justify-center items-center">
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
      </div>
      <div className="block lg:hidden justify-between font-poppins mt-4  md:pb-0 lg:mb-8 xlg:container">
        <div className="justify-center text-center">
          <h1 className="md:text-[25px]  text-xl text-[#5271FF] font-poppins font-extrabold">
            <span className="shadow-inherit">Aarogya Aadhar</span>
          </h1>
          <p className="text-[#5271FF] font-poppins text-[15px] md:text-[20px] ">Contact Us</p>
        </div>
        {/* Form and Details */}
        {/* w-full  mx-auto container flex flex-wrap md:flex-nowrap gap-4 mb-2 */}
        <div className=" w-full lg:w-[90%] mt-4 md:mt-6  mx-auto  lg:mx-12 px-2 lg:px-6 flex-wrap md:flex-nowrap flex gap-4 mb-2">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="md:w-4/5 w-full">
            {" "}
            <div className="">
              <div className="mx-auto container w-full border-2 bg-[#5271FF]  lg:border-[#2b73ec] shadow-lg hover:shadow-xl transition-shadow xs:p-4 lg:p-8 p-1 rounded-xl">
                <div className="space-y-4 ">
                  <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white">
                          <FaUser className="
                          min-[1100px]:h-[16px] 
                          max-[800px]:h-5 
                          max-[1100px]:h-3 
                          min-[1100px]:w-[16px] 
                          max-[800px]:w-5 
                          max-[1100px]:w-3 
                          "/>
                        </span>
                        <h1 className="text-white font-semibold 
                        min-[1100px]:text-[16px] 
                            max-[800px]:text-[16px] 
                            max-[1100px]:text-[12px]
                        ml-6 font-poppins">
                          Full Name*
                        </h1>
                      </div>
                      <div className="relative mt-1">
                      <input
                        type="text"
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
                          rounded-xl 
                        "
                        placeholder="Enter Your Full Name"
                        // required
                        value={fullname}
                        onChange={(e) => setfullname(e.target.value)}
                      />
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
                      <div className="relative mt-1 ">
                          
                      <input
                        type="text"
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
                          rounded-xl 
                          border-[#453565]"
                        placeholder="Enter 10-Digit Mobile Number"
                        // required
                        value={mobile}
                        maxLength="10"
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ensure the input is numeric and has a maximum length of 10
                          if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                            setMobile(value);
                          }
                        }}
                      />
                      </div>
                    </div>
                    <div className="w-full ">
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
                          rounded-xl 
                          border-[#453565]"
                          placeholder="Enter Your Email ID"
                          // required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="absolute right-2 text-[#5271FF]  
                          min-[1100px]:text-[14px] 
                          max-[800px]:text-[14px] 
                          max-[1100px]:text-[10px]
                          bg-white font-poppins rounded-2xl px-2 xs:py-[2px] md:py-1 top-1/2 transform -translate-y-1/2"
                        >
                          {isLoading && !isOtpSent
                            ? "Sending..."
                            : isOtpSent
                            ? "Resend"
                            : "Send OTP"}
                        </button>
                      </div>
                    </div>
                    <div className="w-full relative">
                      <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px]  font-poppins">
                        Email ID OTP*
                      </h1>
                      <div className="relative mt-1">
                        <input
                          type="number"
                          className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          min-[1100px]:pl-4
                          max-[800px]:pl-4
                          max-[1100px]:pl-4 
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
                          rounded-xl 
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter 6-Digit OTP"
                          // required
                          value={otp}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Allow only numbers and limit to 6 digits
                            if (/^\d{0,6}$/.test(inputValue)) {
                              setOtp(inputValue);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isOtpVerified}
                          className="absolute right-2 text-[#5271FF]  
                          min-[1100px]:text-[14px] 
                          max-[800px]:text-[14px] 
                          max-[1100px]:text-[10px]
                          bg-white font-poppins rounded-2xl px-2 xs:py-[2px] md:py-1 top-1/2 transform -translate-y-1/2"
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
                  <div className="w-full !mt-4">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                        max-[800px]:text-[16px] 
                        max-[1100px]:text-[12px]  font-poppins">
                      Message*
                    </h1>
                    <textarea
                      className="mt-1 w-full h-[82px] p-2 border rounded-[15px] 
                      min-[1100px]:text-[18px] 
                        max-[800px]:text-[18px] 
                        max-[1100px]:text-[11px]
                      min-[1100px]placeholder:text-[18px] 
                        max-[800px]:placeholder:text-[18px] 
                        max-[1100px]:placeholder:text-[11px] 
                      pl-4
                          placeholder:text-gray-400 
                        text-gray-400 
                        bg-white  "
                      placeholder="Enter Message"
                      // required
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mx-auto flex items-center font-poppins justify-center mt-4 lg:mt-8">
                  <button
                    type="submit"
                    // old css
                    // bg-[#5271FF] md:text-[14px] text-[12px] font-semibold text-white px-4 py-2 rounded-full
                    className="text-[#5271FF] bg-white lg:text-[16px] md:text-[14px] text-[14px] rounded-xl py-2 px-4 lg:px-8 shadow-2xl  font-bold"
                    disabled={isSubmitting}
                  >
                    {isLoading ? "Please Wait.." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </form>
          {/* Contact Details Section */}
          <div className="flex flex-col justify-evenly items-start md:w-2/5 w-full md:pl-6 ">
            <div className="mx-auto container md:block hidden bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl p-4">
              <h1 className="font-poppins text-center md:text-left 
              min-[1100px]:text-[24px] 
                          max-[800px]:text-[24px] 
                          max-[1100px]:text-[20px]
             text-white font-bold mb-4">
                Address
              </h1>
              <p className="font-poppins text-center md:text-left 
              min-[1100px]:text-[18px] 
                          max-[800px]:text-[18px] 
                          max-[1100px]:text-[14px]
              text-white">
                18, Yashwant Nagar, Range Hill Road <br />
                Near BOB, Shivajinagar, Pune, MH 411007
              </p>
              <h1 className="font-poppins text-center md:text-left min-[1100px]:text-[24px] 
                          max-[800px]:text-[24px] 
                          max-[1100px]:text-[20px] text-white font-bold mb-2">
                Mail ID & Contact No
              </h1>
              <p className="font-poppins ml-[18%] md:ml-0 min-[1100px]:text-[18px] 
                          max-[800px]:text-[18px] 
                          max-[1100px]:text-[14px] text-white">
                info@aarogyaadhar.com <br />
                patient@aarogyaaadhar.com <br />
                +91 79-7272-7498 <br />
                +91 91-4507-8001 <br />
              </p>
            </div>
            <div className="mx-auto container mt-4">
              <ul className="list-none flex gap-1 justify-center items-center">
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
      </div>
    </>
  );
};

export default ContactClient;
