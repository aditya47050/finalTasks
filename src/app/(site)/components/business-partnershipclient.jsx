"use client";
import HeadingClientMain from "@/app/components/heading";
import { UploadButton } from "@uploadthing/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import { FiMail, FiPhone } from "react-icons/fi";
import { FaArrowCircleDown } from "react-icons/fa";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
const Businesspartnershipclient = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    category: "",
    hspfullname: "",
    govtdocument: "",
    message: "",
    address: "",
    pincode: "",
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

      toast("OTP sent to your email");
      setIsOtpSent(true);
    } catch (error) {
      toast("Email ID Not Found Enter valid Email ID. " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  const validateEmail = () => {
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Invalid email format");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Validation logic
    // if (name === "email" && !/^\S+@\S*\.\S*$/.test(value)) {
    //   return; // Prevents invalid email format
    // }
    if (name === "mobile" && !/^\d{0,10}$/.test(value)) {
      return; // Allows only numbers and max 10 digits
    }
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) {
      return; // Allows only numbers and max 6 digits
    }
  
    setFormData({ ...formData, [name]: value });
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
    // // Check if OTP is verified before proceeding
    e.preventDefault();
    if (!isOtpVerified) {
      toast("Please verify OTP before submitting.");
      return;
    }


    // Disable submit button and show loading spinner while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    // Prepare form data for submission
    const formPayload = new FormData();


// Append each field to the FormData object
formPayload.append("email", formData.email || "");
formPayload.append("mobile", formData.mobile || "");
formPayload.append("category", formData.category || "");
formPayload.append("hspfullname", formData.hspfullname || "");
formPayload.append("govtdocument", formData.govtdocument || "");
formPayload.append("message", formData.message || "");
formPayload.append("address", formData.address || "");
formPayload.append("pincode", formData.pincode || "");

    try {
      // Make the API request to submit the form
      const registerRes = await fetch("/api/bussiness-partnershipenq", {
        method: "POST",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Send ");
      }

      // Success: show success alert and reset form
      toast("Form Submitted successfully!. Aarogya Aadhar team will be connect you shortly");
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  return (
    <>
      <div className="hidden lg:block md:mx-auto xlg:container my-4 px-2 md:px-0">
        <div className="justify-center text-center">
            <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">Business Partnership</span>
            </h1>
            {/* <p className="text-[#5271FF] text-[12px] lg:text-[15px] ">Careers</p> */}
          </div>
        <div className="md:flex w-[90%] mx-auto     mt-4 flex-wrap md:flex-nowrap">
          {" "}
          <div className="lg:w-[60%] xl:w-1/2  p-1 xs:p-4 lg:p-8 lg:px-8 rounded-xl">
            <form className="space-y-4 " onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full relative">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      Business Category*
                    </Label>
                    <div className="relative">
                      <select
                              className="w-full pl-4 bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 text-sm"
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="" disabled className="w-full sm:w-1/2 bg-white text-gray-500 text-xs md:text-sm">
                          Select Option
                        </option>
                        {OurServices.map((category, index) => (
                          <option
                            key={index}
                            value={category.link}
                            className="w-full sm:w-1/2 bg-white text-xs md:text-sm text-gray-500"
                          >
                            {category.text}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FaArrowCircleDown
                            className="max-[500px]:h-8 
                                      max-[500px]:w-8 
                                      max-[1000px]:h-5 
                                      max-[1000px]:w-5
                                      min-[1100px]:h-6 
                                      min-[1100px]:w-6
                                      max-[800px]:h-8 
                                      max-[1100px]:h-5 
                                      max-[800px]:w-8 
                                      max-[1100px]:w-5 text-white rounded-full"
                          />
                        </span>
                    </div>
                  </div>
                  <div className="w-full">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      HSP Full Name*
                    </Label>
                    <Input
                      type="text"
                      className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                      placeholder="Enter HSP Reg Name"
                      required
                      name="hspfullname"
                      value={formData.hspfullname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full ">
                    <div className="relative">
                          <Label
              className="text-[#243460] font-semibold ml-4"
            >
                            Email ID*
                          </Label>
                          </div>
                    <div className="relative mt-1">
                      <Input
                        name="email"
                        type="email"
                        className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                        placeholder="Enter Your Email ID"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={validateEmail}
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
                          ? "Sent"
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
                        className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                        placeholder="Enter 6-Digit OTP"
                        required
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
                  <div className="w-full">
                    <div className="relative">
                      <Label
              className="text-[#243460] font-semibold ml-4"
            >
                              Mobile Number*
                            </Label>
                          </div>
                    <div className="relative">
                    <Input
                      type="text"
                      name="mobile"
                      className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                      placeholder="Enter 10-Digit Mobile Number"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                    </div>
                  </div>
                  <div className="w-full relative">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      Government ID Proof*
                    </Label>
                    <div className="relative ">
                      <Input
                        type="text"
                        name="govtdocument"
                        className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                        placeholder="Upload Document"
                      />
                      <div className="absolute right-1 xs:right-2 min-[820px]:right-2 min-[1000px]:right-2 min-[1100px]:right-2 top-1/2 transform -translate-y-1/2 pr-0 ">
                        {" "}
                        {/* Positioning the button to the right */}
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {ready
                                    ? uploadComplete
                                      ? "Uploaded" // Button text after upload completes
                                      : "Upload"
                                    : "Preparing..."}
                                </div>
                              );
                            },
                            allowedContent({ ready, fileTypes, isUploading }) {
                              if (!ready) return "Checking allowed files...";
                              if (isUploading) return "Uploading your files...";
                              return `Allowed file types: ${fileTypes.join(", ")}`;
                            },
                          }}
                          appearance={{
                                button:
                                  "w-auto bg-transparent min-[1100px]:text-[14px] max-[800px]:text-[16px] max-[1100px]:text-[10px] !text-[#5271FF] font-bold rounded-full font-normal flex items-center justify-center cursor-pointer ", // Changed to text-blue-500
                                container:
                                  "rounded-full xl:h-[25px] xs:h-[2rem]  md:h-6 h-6 px-2 xl:px-[8px] xs:py-[2px] md:py-[4px] xl:py-[1px]  w-auto bg-white xs:my-1",
                                allowedContent:
                                  "flex h-2 flex-col items-center justify-center px-2 xl:px-[12px] text-[1px] text-[#243460] hidden ", // Custom blue color
                              }}
                          onClientUploadComplete={(res) => {
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                govtdocument: res[0].url, // Ensure res structure matches
                              }));
                              setUploadComplete(true); // Set the upload as complete
                              toast("Upload Completed");
                            }
                          }}
                          onUploadError={(error) => {
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      Full Address*
                    </Label>
                    <Input
                      type="text"
                      name="address"
                      className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                      placeholder="Enter Your Full Address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>{" "}
                  <div className="w-full">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      Pin Code*
                    </Label>
                    <Input
                      type="text"
                      name="pincode"
                      className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                      placeholder="Enter 6-Digit Pin Code"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                  <div className="w-full !mt-4 md:!mt-6">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      Message*
                    </Label>
                    <Textarea
                      className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-xl h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                      placeholder="Enter Message"
                      // required
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
            
              <div className="mx-auto flex items-center font-poppins justify-center !mt-4 lg:!mt-8">
                <button
                  type="submit"
                  className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-8 py-2 rounded-full min-w-[120px] transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isLoading ? "Please Wait.." : "Submit"}
                </button>
              </div>
            </form>
          </div>
          <div className="flex flex-col justify-start items-center gap-8 my-auto lg:w-[40%] xl:w-1/2  w-full md:pl-6 xl:p-12 ">
              <div className="mx-auto  md:block hidden    p-2 lg:px-10 xl:px-20">
                  <div className="mx-auto p-4 bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl">
                    <p className="font-poppins font-medium min-[1100px]:text-[16px] text-[14px] text-white">
                      Business Partnership at our hospital is built on trust, collaboration, and shared vision.<br/> We believe that meaningful partnerships strengthen healthcare delivery and create opportunities for innovation and growth.
                    </p>
          
                  </div>
              </div>
              <div className="mx-auto mt-4 md:mt-0 flex justify-center md:justify-center items-center ">
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
        {/* <div className="flex justify-center items-center font-poppins">
          <p className="text-[#243460] font-bold text-[10px] md:text-[16px] text-center">
            {" "}
            <span className="text-[#ff5e00]">Aarogya Aadhar</span> team will be
            connect you shortly
          </p>
        </div> */}
      </div>
      <div className="block lg:hidden md:mx-auto xlg:container my-4 px-2 md:px-0">
        <div className="justify-center text-center">
            <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">Business Partnership</span>
            </h1>
            {/* <p className="text-[#5271FF] text-[12px] lg:text-[15px] ">Careers</p> */}
          </div>
        <div className="flex flex-col items-center md:w-[90%] mx-auto     mt-4 flex-wrap md:flex-nowrap">
          {" "}
          <div className="bg-[#5271FF] w-full md:w-4/5 p-1 xs:p-4 lg:p-8 lg:px-8 rounded-xl">
            <form className="space-y-2 " onSubmit={handleSubmit}>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full relative">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                      Business Category*
                    </h1>
                    <div className="relative mt-1">
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
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="" disabled className="w-full sm:w-1/2 bg-white text-gray-500 text-xs md:text-sm">
                          Select Option
                        </option>
                        {OurServices.map((category, index) => (
                          <option
                            key={index}
                            value={category.link}
                            className="w-full sm:w-1/2 bg-white text-xs md:text-sm text-gray-500"
                          >
                            {category.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="w-full">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                      HSP Full Name*
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
                      placeholder="Enter HSP Reg Name"
                      required
                      name="hspfullname"
                      value={formData.hspfullname}
                      onChange={handleChange}
                    />
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
                        name="email"
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
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={validateEmail}
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
                          ? "Sent"
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
                        required
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
                              bg-white font-poppins rounded-2xl px-3 xs:py-[3px] md:py-1 top-1/2 transform -translate-y-1/2"
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
                      name="mobile"
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
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                    </div>
                  </div>
                  <div className="w-full relative">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                      Government ID Proof*
                    </h1>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        name="govtdocument"
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
                        placeholder="Upload Document"
                        required
                        disabled
                      />
                      <div className="absolute right-1 xs:right-2 min-[820px]:right-2 min-[1000px]:right-1 min-[1100px]:right-2 top-1/2 transform -translate-y-1/2 pr-0 ">
                        {" "}
                        {/* Positioning the button to the right */}
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {ready
                                    ? uploadComplete
                                      ? "Uploaded" // Button text after upload completes
                                      : "Upload"
                                    : "Preparing..."}
                                </div>
                              );
                            },
                            allowedContent({ ready, fileTypes, isUploading }) {
                              if (!ready) return "Checking allowed files...";
                              if (isUploading) return "Uploading your files...";
                              return `Allowed file types: ${fileTypes.join(", ")}`;
                            },
                          }}
                          appearance={{
                                  button:
                                    "w-auto bg-transparent min-[1100px]:text-[16px] max-[800px]:text-[16px] max-[1100px]:text-[10px] !text-[#5271FF] font-bold rounded-full font-normal flex items-center justify-center cursor-pointer ", // Changed to text-blue-500
                                  container:
                                    "rounded-full xl:h-[32px] xs:h-[2rem]  md:h-7 h-6 px-4 xl:px-[12px]  w-auto  md:py-1 bg-white xs:my-1",
                                  allowedContent:
                                    "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-[#243460] hidden ", // Custom blue color
                                }}
                          onClientUploadComplete={(res) => {
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                govtdocument: res[0].url, // Ensure res structure matches
                              }));
                              setUploadComplete(true); // Set the upload as complete
                              toast("Upload Completed");
                            }
                          }}
                          onUploadError={(error) => {
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                      Full Address*
                    </h1>
                    <input
                      type="text"
                      name="address"
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
                      placeholder="Enter Your Full Address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>{" "}
                  <div className="w-full">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                      Pin Code*
                    </h1>
                    <input
                      type="text"
                      name="pincode"
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
                      placeholder="Enter 6-Digit Pin Code"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                  <div className="w-full !mt-4 md:!mt-6">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                      Message*
                    </h1>
                    <textarea
                      className="mt-1 w-full p-2 border rounded-[15px] pl-4 min-[1100px]:text-[18px] 
                              max-[800px]:text-[18px] 
                              max-[1100px]:text-[11px]
                              min-[1100px]placeholder:text-[18px] 
                              max-[800px]:placeholder:text-[18px] 
                              max-[1100px]:placeholder:text-[11px]   placeholder:text-gray-400 
                              text-[#453565]  
                              bg-white  "
                      placeholder="Enter Message"
                      // required
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
              </div>
              <div className="mx-auto flex items-center font-poppins justify-center !mt-4 lg:!mt-8">
                <button
                  type="submit"
                  className="text-[#5271FF] bg-white lg:text-[16px] md:text-[14px] text-[14px] rounded-xl py-2 px-4 lg:px-8 shadow-2xl  font-bold"
                  disabled={isSubmitting}
                >
                  {isLoading ? "Please Wait.." : "Submit"}
                </button>
              </div>
            </form>
          </div>
          <div className="flex flex-col justify-start items-center gap-8 my-auto md:w-2/5 w-full md:pl-6 ">
              <div className="mx-auto  lg:block hidden bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl  p-2">
                  <div className="mx-auto p-4">
                    <p className="font-poppins font-medium min-[1100px]:text-[16px] text-[14px] text-white">
                      Business Partnership at our hospital is built on trust, collaboration, and shared vision.<br/> We believe that meaningful partnerships strengthen healthcare delivery and create opportunities for innovation and growth.
                    </p>
          
                  </div>
              </div>
              <div className="mx-auto mt-4 lg:mt-0 flex justify-center md:justify-center items-center ">
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
        {/* <div className="flex justify-center items-center font-poppins">
          <p className="text-[#243460] font-bold text-[10px] md:text-[16px] text-center">
            {" "}
            <span className="text-[#ff5e00]">Aarogya Aadhar</span> team will be
            connect you shortly
          </p>
        </div> */}
      </div>
    
    </>
  );
};

export default Businesspartnershipclient;
const OurServices = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227235/Consultant_Doctor_glkhw3.png",
    text: "Consultant Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227521/super_Consultant_Doctor_huvbcq.png",
    text: "Super  Consultant Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227406/MBBS_Doctor_e1y9xc.png",
    text: "MBBS  Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227230/CMO_Doctor_aro9tw.png",
    text: "CMO  Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227510/RMO_Doctor_d1gewe.png",
    text: "RMO  Doctor",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227423/Nurse_s_xdtp4m.png",
    text: "Nurse's & Brother's",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227487/Pharmacist_staff_s9fx3t.png",
    text: "Pharmacist Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227285/Fresher_Intern_staff_ijofyl.png",
    text: "Fresher/Intern Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733562975/Administration_Staff_c34hae.png",
    text: "Administration Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733562986/HR_Staff_ef2rvj.png",
    text: "Human Resource",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229225/Radiology_Technician_aalnxz.png",
    text: "Radiology Technician",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563023/Pathology_Staff_gtqghh.png",
    text: "Pathology Technician",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227929/Healthcare_Reception_segg9d.png",
    text: "Healthcare Reception",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229190/Insurance_f5ialr.png",
    text: "Insurance Coordinator",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563034/Senior_Management_Staff_gxet10.png",
    text: "Senior Management Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229204/Marketing_staff_qljtrt.png",
    text: "Marketing Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227953/Ambulance_d_ng8jvf.png",
    text: "Ambulance Driver",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227959/Healthcare_Coordinator_gxrpdp.png",
    text: "Healthcare Coordinator",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229175/Housekeeping_staff_ivbecs.png",
    text: "Housekeeping Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563029/Security_Guard_Staff_i4nudc.png",
    text: "Security Staff",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227945/Accountant_staff_ycxdqq.png",
    text: "Accountant Staff",
  },
];
