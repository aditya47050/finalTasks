"use client";
import React, { useState } from "react";
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

import { UploadButton } from "@uploadthing/react";
import { FaArrowCircleDown, FaUser } from "react-icons/fa";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import Image from "next/image";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const TREnqForm = () => {
  const category = [
    { title: "Select Option", link: "#" },
    { title: "Patient", link: "#" },
    { title: "Doctor", link: "#" },
    { title: "Hospital/Clinic", link: "#" },
    { title: "Pathology", link: "#" },
    { title: "Diagnostic Center", link: "#" },
    { title: "Ambulance", link: "#" },
    { title: "Health Professional", link: "#" },
    { title: "Corporate Company", link: "#" },
    { title: "Equipment Dealers", link: "#" },
  ];

  const services = [
    { title: "Select Option", link: "#" },
    { title: "X-Ray", link: "#" },
    { title: "Sonography", link: "#" },
    { title: "Mammography", link: "#" },
    { title: "CT Scan", link: "#" },
    { title: "MRI Scan", link: "#" },
    { title: "PET Scan", link: "#" },
   
  ];
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    category: "",
    company: "",
    enqperson: "",
    pincode: "",
    address: "",
    idproof: "",
  });

  // OTP and form states
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false); // State to track upload status

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
        body: JSON.stringify({ email: formData.email }), // Only sending email for OTP
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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        body: JSON.stringify({ email: formData.email, otp }), // Sending email and OTP
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
    e.preventDefault(); // Prevent default form submission
    if (!uploadComplete) {
      toast("Please complete the file upload before submitting.");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("email", formData.email);
    formPayload.append("mobile", formData.mobile);
    formPayload.append("enqperson", formData.enqperson);
    formPayload.append("company", formData.company);
    formPayload.append("category", formData.category);
    formPayload.append("pincode", formData.pincode);
    formPayload.append("address", formData.address);
    formPayload.append("idproof", formData.idproof); // Ensure this is appended

    console.log("Form Payload:", Array.from(formPayload.entries())); // Log to debug

    try {
      const registerRes = await fetch("/api/TREnqForm", {
        method: "POST",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Update the form.");
      }

      const responseData = await registerRes.json();
      if (responseData.success) {
        toast.success("Form Submitted successfully!. Aarogya  e-RAD team will be connect you shortly");
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {" "}
      <div className="hidden lg:block font-poppins   justify-between xs:pb-0 md:pb-0 pb-40 mt-6">
        <div className="justify-center text-center ">
          <h1 className="py-1 md:text-[25px] text-[20px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Join with Us</span>
          </h1>
        </div>
        {/* Form and Details */}
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="w-full min-[1100px]:max-w-6xl  mx-auto md:container flex gap-4 mb-2"> 
            {/* Form Section */}
            <div className="w-full">
              <div className="mx-auto md:container w-full pt-2 pb-4 px-4 rounded-xl">
                <div className="space-y-4 mt-1 md:mt-8">
                  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="w-full relative">
                      <h1 className="text-[#243460] font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] ml-4 font-poppins">
                        Select Your Category*
                      </h1>
                      <div className="relative">
                        <select
                          className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[16px] 
                          max-[800px]:placeholder:text-[16px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-white
                          text-white 
                          bg-[#5271FF] 
                          rounded-full 
                          border-[#453565]"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          {category.map((c) => (
                            <option
                              key={c.title}
                              value={c.title}
                              className="bg-[#e9e8e9] text-[14px] text-[#243460]"
                            >
                              {c.title}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FaArrowCircleDown
                            className="max-[500px]:h-8 
                                      max-[500px]:w-8 
                                      max-[1000px]:h-5 
                                      max-[1000px]:w-5
                                      min-[1100px]:h-8 
                                      min-[1100px]:w-8
                                      max-[800px]:h-8 
                                      max-[1100px]:h-5 
                                      max-[800px]:w-8 
                                      max-[1100px]:w-5 text-white rounded-full"
                            
                          />
                        </span>
                      </div>
                    </div>

                    <div className="w-full">
                      <h1 className="text-[#243460] font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] ml-4 font-poppins">
                      Enter HSP/Doctor Name*
                      </h1>
                      <input
                        type="text"
                        className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[16px] 
                          max-[800px]:placeholder:text-[16px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-white
                          text-white 
                          bg-[#5271FF] 
                          rounded-full 
                          border-[#453565]"
                        placeholder="Enter Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full">
                      <h1 className="text-[#243460] font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] ml-4 font-poppins">
                        Mobile Number*
                      </h1>
                      <input
                        type="text"
                        className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[16px] 
                          max-[800px]:placeholder:text-[16px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-white
                          text-white 
                          bg-[#5271FF] 
                          rounded-full 
                          border-[#453565]"
                        placeholder="Enter Mobile Number"
                        name="mobile"
                        value={formData.mobile}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ensure the input is numeric and has a maximum length of 10
                          if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                            handleChange(e);  // Call the handleChange function if the input is valid
                          }
                        }}
                      />
                    </div>
                  {/* </div>
                </div> */}
                {/* <div className="space-y-4  md:mt-4"> */}
                  {/* <div className="flex flex-wrap md:flex-nowrap md:space-x-4"> */}
                    <div className="w-full relative">
                      <h1 className="text-[#243460] font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] ml-4 font-poppins">
                        Email ID
                      </h1>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 
                          pr-20
                          py-auto
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[16px] 
                          max-[800px]:placeholder:text-[16px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-white
                          text-white 
                          bg-[#5271FF] 
                          rounded-full 
                          border-[#453565]"
                          placeholder="Enter Email ID"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          
                          className="absolute right-2 text-[#243460]  
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[10px]
                          bg-white font-poppins rounded-2xl px-2 xs:py-[3px] md:py-1 top-1/2 transform -translate-y-1/2"
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
                      <h1 className="text-[#243460] font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] ml-4 font-poppins">
                        Email ID OTP*
                      </h1>
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 
                          pr-20
                          py-auto
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[16px] 
                          max-[800px]:placeholder:text-[16px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-white
                          text-white 
                          bg-[#5271FF] 
                          rounded-full 
                          border-[#453565]
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter OTP"
                          name="otp"
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
                          className="absolute right-2 text-[#243460]  
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[10px]
                          bg-white font-poppins rounded-2xl px-2 xs:py-[3px] md:py-1 top-1/2 transform -translate-y-1/2"
                        >
                          {isLoading && !isOtpVerified
                            ? "Verifying..."
                            : isOtpVerified
                            ? "Verified"
                            : "Verify OTP"}
                        </button>
                      </div>
                    </div>
                    <div className="w-full relative">
                      <h1 className="text-[#243460] font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] ml-4 font-poppins">
                      Teleradiology Services*
                      </h1>
                      <div className="relative">
                        <select
                          className="w-full 
                          min-[1100px]:h-12 
                          max-[800px]:h-12 
                          max-[1100px]:h-8 
                          pl-4 
                          pr-2
                          py-auto
                          min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[11px]
                          min-[1100px]placeholder:text-[16px] 
                          max-[800px]:placeholder:text-[16px] 
                          max-[1100px]:placeholder:text-[11px] 
                          placeholder:text-white
                          text-white 
                          bg-[#5271FF] 
                          rounded-full 
                          border-[#453565]"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          {services.map((c) => (
                            <option
                              key={c.title}
                              value={c.title}
                              className="bg-[#e9e8e9] text-[14px] text-[#243460]"
                            >
                              {c.title}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FaArrowCircleDown
                            className="max-[500px]:h-8 
                                      max-[500px]:w-8 
                                      max-[1000px]:h-5 
                                      max-[1000px]:w-5
                                      min-[1100px]:h-8 
                                      min-[1100px]:w-8
                                      max-[800px]:h-8 
                                      max-[1100px]:h-5 
                                      max-[800px]:w-8 
                                      max-[1100px]:w-5 text-white rounded-full"
                            
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4   md:mt-4">
                  <div className="flex md:flex-nowrap flex-wrap justify-center md:space-x-4">
                    <div className="w-full">
                      <h1 className="text-[#243460] font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] ml-4 font-poppins">
                      Message*
                      </h1>
                      <textarea
                        type="text"
                        className="mt-1 w-full h-[82px] p-2 border rounded-[15px] 
                        min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[11px]
                        min-[1100px]placeholder:text-[16px] 
                          max-[800px]:placeholder:text-[16px] 
                          max-[1100px]:placeholder:text-[11px] 
                        pl-4
                           placeholder:text-white text-white bg-[#5271FF] "
                        placeholder="Message"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
              
                  </div>
                </div>
                <div className="mx-auto flex items-center justify-center mt-2 md:mt-6">
                  <button
                    type="submit"
                    className="bg-[#5271FF] min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px] rounded-full py-2 px-8 shadow-2xl text-white font-bold"
                  >
                    {isLoading ? "Please wait...." : "Submit"}
                  </button>
                </div>
              </div>
              {/* <div className="mx-auto flex justify-center items-center container  font-poppins text-[#243460] ">
                <p className="text-center">
                  <span className="font-bold">Aarogya  e-RAD </span>team will be connect you shortly
                </p>
              </div> */}
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
      <div className=" flex lg:hidden  flex-col justify-between xs:mt-8 sm:mt-8 md:pb-0 md:mt-8 lg:mt-8 xl:mt-8 lg:mb-10 xlg:my-0 xlg:container">
        <div className="justify-center text-center ">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Join with Us</span>
          </h1>
        </div>
        <div className=" w-full lg:w-[94%] md:mt-6  mx-auto min-[1100px]:mx-12 px-2 lg:px-6 flex-wrap md:flex-nowrap flex gap-4 my-2">
          <div className="mx-auto container w-full border-2 bg-[#5271FF]  lg:border-[#2b73ec] shadow-lg hover:shadow-xl transition-shadow xs:p-4 lg:p-8 p-1 rounded-xl">
            <form className="space-y-2" onSubmit={handleSubmit}>
                <div className="space-y-4 ">
                  <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full relative">
                      <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                        Select Your Category*
                      </h1>
                      <div className="relative">
                        <select
                          className={`w-full 
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
                              ${formData.category === "" ? "text-gray-400" : "text-[#453565]"} 
                              bg-white 
                              rounded-xl `}
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          {category.map((c) => (
                            <option
                              key={c.title}
                              value={c.title}
                              className="w-full sm:w-1/2 bg-white text-gray-400 text-xs md:text-sm"
                          >
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="w-full">
                      <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                            max-[800px]:text-[16px] 
                            max-[1100px]:text-[12px]  font-poppins">
                      Enter HSP/Doctor Name*
                      </h1>
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
                            rounded-xl "
                        placeholder="Enter Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
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
                            rounded-xl "
                        placeholder="Enter Mobile Number"
                        name="mobile"
                        value={formData.mobile}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ensure the input is numeric and has a maximum length of 10
                          if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                            handleChange(e);  // Call the handleChange function if the input is valid
                          }
                        }}
                      />
                    </div>
                    <div className="w-full relative">
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
                      <div className="relative">
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
                            rounded-xl "
                          placeholder="Enter Your Email ID"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
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
                      </div>
                    </div>
                    <div className="w-full relative">
                      <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                            max-[800px]:text-[16px] 
                            max-[1100px]:text-[12px]  font-poppins">
                        Email ID OTP*
                      </h1>
                      <div className="relative">
                        <input
                          type="number"
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
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter OTP"
                          name="otp"
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
                    <div className="w-full relative">
                      <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                            max-[800px]:text-[16px] 
                            max-[1100px]:text-[12px]  font-poppins">
                      Teleradiology Services*
                      </h1>
                      <div className="relative">
                        <select
                          className={`w-full 
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
                            ${formData.category === "" ? "text-gray-400" : "text-[#453565]"} 
                            bg-white 
                            rounded-xl `}
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          {services.map((c) => (
                            <option
                              key={c.title}
                              value={c.title}
                              className="w-full sm:w-1/2 bg-white text-gray-400 text-xs md:text-sm">
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="w-full">
                      <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                        max-[800px]:text-[16px] 
                        max-[1100px]:text-[12px] font-poppins">
                      Message*
                      </h1>
                      <textarea
                        type="text"
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
                        placeholder="Message"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mx-auto flex items-center font-poppins justify-center !mt-4 lg:!mt-8">
                    <button
                      type="submit"
                      className="text-[#5271FF] bg-white lg:text-[16px] md:text-[14px] text-[14px] rounded-xl py-2 px-4 lg:px-8 shadow-2xl  font-bold"
                    >
                      {isLoading ? "Please wait...." : "Submit"}
                    </button>
                  </div>
                  {/* <div className="mx-auto flex justify-center items-center container  font-poppins text-[#243460] ">
                    <p className="text-center">
                      <span className="font-bold">Aarogya  e-RAD </span>team will be connect you shortly
                    </p>
                  </div> */}
                </div>
            </form>
          </div>
          <div className="mx-auto flex justify-center items-center container my-4">
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
        {/* Form and Details */}
      </div>
    </>
  );
};

export default TREnqForm;
