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
const Careersclient = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    category: "",
    fullname: "",
    cv: "",
  });
// console.log(formData.cv,"cv")
  // OTP and form states
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false); // State to track upload status

  // email validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // handle Clear function
  const clearForm = () => {
    setFormData({
      email: "",
      mobile: "",
      category: "",
      fullname: "",
      cv: "",
    });
    setOtp(""); // Clear OTP
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setUploadComplete(false); // Reset file upload state
  };
  
  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!validateEmail(formData.email)) {
      toast.error("Invalid email format. Example: user@example.com");
      return;
    }
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otps/career-request/send-otp", {
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
      const verifyRes = await fetch("/api/otps/career-request/verify-otp", {
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
  const handleSubmit = async () => {
    // // Check if OTP is verified before proceeding
    // if (!isOtpVerified) {
    //   toast("Please verify OTP before submitting.");
    //   return;
    // }

    // Disable submit button and show loading spinner while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    // Prepare form data for submission
    const formPayload = new FormData();

    // Manually append each form data field
    formPayload.append("email", formData.email);
    formPayload.append("mobile", formData.mobile);
    formPayload.append("fullname", formData.fullname);
    formPayload.append("cv", formData.cv);
    formPayload.append("category", formData.category);
    try {
      // Make the API request to submit the form
      const registerRes = await fetch("/api/careerssite", {
        method: "POST",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Update the form.");
      }

      // Success: show success alert and reset form
      toast.success("Form Submitted successfully!");
      clearForm()
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <>
      <div className="hidden lg:block md:mx-auto md:container justify-between font-poppins mt-4  md:pb-0 lg:mb-4 xlg:container">
        <div className="justify-center text-center">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Careers</span>
          </h1>
          {/* <p className="text-[#5271FF] text-[12px] lg:text-[15px] ">Careers</p> */}
        </div>
        {/* Form and Details */}
        <div className="mx-auto container text-center  block md:hidden">
          <p className="font-poppins text-center text-[12px] text-[#243460]">
            <span className=" font-semibold ">
              {" "}
              Be a Part of Aarogya Aadhar
            </span>{" "}
            <br />
            &quot;If you want to walk fast, walk alone. But if you want to walk
            far, walk together. &quot; <br /> <br />
            &quot;I have been constantly telling people to encourage people, to
            question the unquestioned and not to be ashamed to bring up new
            ideas, new processes to get things done. &quot;
          </p>
        </div>
        <div className="md:flex lg:w-[90%] mx-auto     mt-4 flex-wrap md:flex-nowrap">
          {/* Form Section */}
          <form className="space-y-4 lg:w-[60%] xl:w-1/2 p-1 xs:p-4 lg:p-8 lg:px-8 rounded-xl" action={handleSubmit}>
                  <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full">
                      <div className="relative">
                        <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                          Full Name*
                        </Label>
                      </div>
                      <div className="relative ">
                      <Input
                        type="text"
                        className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                        placeholder="Enter Your Full Name"
                        required
                        name="fullname"
                        value={formData.fullname}
                        onChange={(e) => {
                          const value = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          ); // Allow only alphabets & spaces
                          handleChange({
                            target: { name: "fullname", value },
                          });
                        }}
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
                      <div className="relative">
                        <Input
                          type="text"
                          name="mobile"
                          className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                          placeholder="Enter 10-Digit Mobile Number"
                          required
                          value={formData.mobile}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numeric input & max 10 digits
                            if (/^\d{0,10}$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                          onBlur={(e) => {
                            // Ensure the number is exactly 10 digits
                            if (e.target.value.length !== 10) {
                          toast.error("Mobile number must be exactly 10 digits!");
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full relative">
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
                    <div className="w-full relative">
                      <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                        Select Category*
                      </Label>
                      <div className="relative mt-1">
                        <select
                          className="w-full pl-4 bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 text-sm"
                          required
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="" className="w-full sm:w-1/2 bg-white text-gray-500 text-xs md:text-sm">Select Category</option>
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
                                      max-[1000px]:h-8 
                                      max-[1000px]:w-8
                                      xl:h-6 xl:w-6 lg:h-7 lg:w-7
                                      max-[800px]:h-8
                                      max-[800px]:w-8 text-white rounded-full" 
                          />
                        </span>
                      </div>
                    </div>
                    <div className="w-full relative">
                      <Label
                                className="text-[#243460] font-semibold ml-4"
                              >
                        Upload Your CV*
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          type="text"
                          name="cv"
                          className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                          placeholder="Upload CV"
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
                              allowedContent({
                                ready,
                                fileTypes,
                                isUploading,
                              }) {
                                if (!ready) return "Checking allowed files...";
                                if (isUploading)
                                  return "Uploading your files...";
                                return `Allowed file types: ${fileTypes.join(
                                  ", "
                                )}`;
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
                                  cv: res[0].url, // Ensure res structure matches
                                }));
                                setUploadComplete(true); // Set the upload as complete
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
                              toast.error(`ERROR! ${error.message}`);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                <div className="mx-auto flex items-center font-poppins justify-center !mt-4 lg:!mt-8">
                  <button
                    type="submit"
                    className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-8 py-2 rounded-full min-w-[120px] transition-all duration-200"
                  >
                    {isLoading ? "Please Wait.." : "Submit"}
                  </button>
                </div>

              {/* social media logos and links
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
              </div> */}
          </form>
          {/* Contact Details Section */}
          <div className="flex flex-col justify-start gap-2 items-start lg:w-[40%] xl:w-1/2  md:pl-6 xl:p-10 my-auto">
            <div className="mx-auto  md:block hidden p-2 lg:px-6 xl:px-20">
              <div className="mx-auto p-4 bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl">
                <p className="font-poppins font-medium min-[1100px]:text-[16px] text-[14px] text-white">
                  Be a Part of Aarogya Aadhar <br />
                  <br />
                  &quot;If you want to walk fast, walk alone. But if you want to
                  walk far, walk together. &quot; <br /> <br />
                  &quot;I have been constantly telling people to encourage people,
                  to question the unquestioned and not to be ashamed to bring up
                  new ideas, new processes to get things done. &quot;
                </p>
              </div>
            </div>

            {/* contact details
            <div className="mx-auto container mt-6 pt-2">
              <h1 className="font-poppins text-[14px] lg:text-[20px] text-[#243460] font-bold mb-2">
                Mail ID & Contact No
              </h1>
              <div className="font-poppins lg:text-[16px] text-[12px] text-[#243460]">
                <ul className="list-disc ml-5">
                  <li>careers@aarogyaadhar.com</li>
                  <li>+91 79-7272-7498</li>
                  <li>+91 91-4507-8001</li>
                </ul>
              </div>
            </div> */}
            <div className="mx-auto flex justify-center md:justify-center items-center container mt-4">
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
      </div>
      <div className="block lg:hidden justify-between font-poppins mt-4  md:pb-0 lg:mb-8 xlg:container">
        <div className="justify-center text-center">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Careers</span>
          </h1>
          {/* <p className="text-[#5271FF] text-[12px] lg:text-[15px] ">Careers</p> */}
        </div>
        {/* Form and Details */}
        <div className="mx-auto container text-center  block md:hidden">
          <p className="font-poppins text-center text-[12px] text-[#243460]">
            <span className=" font-semibold ">
              {" "}
              Be a Part of Aarogya Aadhar
            </span>{" "}
            <br />
            &quot;If you want to walk fast, walk alone. But if you want to walk
            far, walk together. &quot; <br /> <br />
            &quot;I have been constantly telling people to encourage people, to
            question the unquestioned and not to be ashamed to bring up new
            ideas, new processes to get things done. &quot;
          </p>
        </div>
        <div className=" w-full lg:w-[90%] xs:mt-4 md:mt-6  mx-auto  lg:mx-12 px-2 lg:px-6 flex-wrap md:flex-nowrap flex gap-4 mb-2">
          {/* Form Section */}
          <form className="md:w-4/5 w-full" action={handleSubmit}>
            {" "}
            <div className="">
              <div className="mx-auto bg-[#5271FF] container w-full md:border-2 lg:border-[#2b73ec] shadow-lg hover:shadow-xl transition-shadow p-1 xs:p-4 lg:p-8 lg:px-8 rounded-xl">
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
                        required
                        name="fullname"
                        value={formData.fullname}
                        onChange={(e) => {
                          const value = e.target.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          ); // Allow only alphabets & spaces
                          handleChange({
                            target: { name: "fullname", value },
                          });
                        }}
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
                          rounded-xl"
                          placeholder="Enter 10-Digit Mobile Number"
                          required
                          value={formData.mobile}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numeric input & max 10 digits
                            if (/^\d{0,10}$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                          onBlur={(e) => {
                            // Ensure the number is exactly 10 digits
                            if (e.target.value.length !== 10) {
                          toast.error("Mobile number must be exactly 10 digits!");
                            }
                          }}
                        />
                      </div>
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
                          rounded-xl"
                          placeholder="Enter Your Email ID"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="absolute right-2 text-[#5271FF]  
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
                          max-[1100px]:text-[12px] font-poppins">
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
                          rounded-xl"
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
                          className="absolute right-2 text-[#5271FF]  
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
                        Select Category*
                      </h1>
                      <div className="relative mt-1">
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
                          rounded-xl outline-none"
                          required
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="" className="w-full sm:w-1/2 bg-white text-gray-500 text-xs md:text-sm">Select Category</option>
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
                    <div className="w-full relative">
                      <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[12px]  font-poppins">
                        Upload Your CV*
                      </h1>
                      <div className="relative mt-1">
                        <input
                          type="text"
                          name="cv"
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
                          rounded-xl"
                          placeholder="Upload CV"
                          required
                          disabled
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 pr-1 ">
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
                              allowedContent({
                                ready,
                                fileTypes,
                                isUploading,
                              }) {
                                if (!ready) return "Checking allowed files...";
                                if (isUploading)
                                  return "Uploading your files...";
                                return `Allowed file types: ${fileTypes.join(
                                  ", "
                                )}`;
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
                                  cv: res[0].url, // Ensure res structure matches
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
                  </div>
                </div>
                <div className="mx-auto flex items-center font-poppins justify-center mt-4 lg:mt-8">
                  <button
                    type="submit"
                    className="text-[#5271FF] bg-white lg:text-[16px] md:text-[14px] text-[14px] rounded-xl py-2 px-4 lg:px-8 shadow-2xl  font-bold"
                  >
                    {isLoading ? "Please Wait.." : "Submit"}
                  </button>
                </div>
              </div>

              {/* social media logos and links
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
              </div> */}
            </div>
          </form>
          {/* Contact Details Section */}
          <div className="flex flex-col justify-evenly items-start md:w-2/5 w-full md:pl-6 ">
            <div className="mx-auto container md:block hidden bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl p-4">
              <p className="font-poppins font-medium min-[1100px]:text-[16px] text-[14px] text-white">
                Be a Part of Aarogya Aadhar <br />
                <br />
                &quot;If you want to walk fast, walk alone. But if you want to
                walk far, walk together. &quot; <br /> <br />
                &quot;I have been constantly telling people to encourage people,
                to question the unquestioned and not to be ashamed to bring up
                new ideas, new processes to get things done. &quot;
              </p>
            </div>

            {/* contact details
            <div className="mx-auto container mt-6 pt-2">
              <h1 className="font-poppins text-[14px] lg:text-[20px] text-[#243460] font-bold mb-2">
                Mail ID & Contact No
              </h1>
              <div className="font-poppins lg:text-[16px] text-[12px] text-[#243460]">
                <ul className="list-disc ml-5">
                  <li>careers@aarogyaadhar.com</li>
                  <li>+91 79-7272-7498</li>
                  <li>+91 91-4507-8001</li>
                </ul>
              </div>
            </div> */}
            <div className="mx-auto flex justify-center md:justify-center items-center container mt-4">
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
      </div>
    </>
  );
};

export default Careersclient;
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
