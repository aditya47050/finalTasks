"use client";
import HeadingClientMain from "@/app/components/heading";
import { UploadButton } from "@uploadthing/react";
import { ArrowDown ,CalendarDays} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import React, {useRef, useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Calendar,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiMail, FiPhone } from "react-icons/fi";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
const CorporateGoveranceClient = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    // corporateyear: "",
    fullname: "",
    govtdocument: "",
    message: "",
  });
  const [selectedYear, setSelectedYear] = useState(null);
  const datePickerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
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
      toast("Something went wrong: " + error.message);
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
    formPayload.append("corporateyear", selectedYear ? selectedYear.getFullYear() : "" || "");
    formPayload.append("fullname", formData.fullname || "");
    formPayload.append("govtdocument", formData.govtdocument || "");
    formPayload.append("message", formData.message || "");

    try {
      // Make the API request to submit the form
      const registerRes = await fetch("/api/corporate-governance", {
        method: "POST",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Send ");
      }

      // Success: show success alert and reset form
      toast.success(
        "Form Submitted successfully!. Aarogya Aadhar team will be connect you shortly"
      );
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  return (
    <>
      <div className="hidden lg:block md:mx-auto md:container px-2 md:px-0 my-4">
        <div className="justify-center font-poppins text-center ">
            <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">Corporate Governance</span>
            </h1>
        </div>
        <div className="md:mx-auto flex md:container py-2 justify-center md:w-[80%]   w-full items-center  text-justify ">
          <p className="font-poppins text-center  text-[12px] md:text-[14px] text-[#243460]">
            <span className="  ">
              For any information on the general meeting notices of the Company,
              director resignation and annual return of the Company, please
              contact us on <br className="lg:hidden block" />
              <span className="font-semibold text-start">
                legal@aarogyaaadhar.com
                <br className="lg:hidden block" /> +91 79-7272-7498{" "}
              </span>
            </span>
          </p>
        </div>
        <div className="justify-center font-poppins text-center ">
            <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">Enquiry Form</span>
            </h1>
        </div>
        <div className="md:flex lg:w-[90%] mx-auto     mt-4 flex-wrap md:flex-nowrap">
          <div className="lg:w-[60%] xl:w-1/2 p-1 xs:p-4 lg:p-8 lg:px-8 rounded-xl">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full relative">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      Corporate Year*
                    </Label>
                    <div
                      className="relative  bg-[#5271FF]  rounded-full border-[#453565] cursor-pointer "
                      onClick={() => setIsOpen(true)} // Open on click
                    >
                      {/* Year Picker */}
                      <DatePicker
                        selected={selectedYear}
                        ref={datePickerRef}
                        onChange={(date) => {
                          setSelectedYear(date);
                          setIsOpen(false); // Close calendar after selecting year
                        }}
                        showYearPicker
                        dateFormat="yyyy"
                        className="bg-[#5271FF] text-sm border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 pl-4"
                        placeholderText="Select Year"
                        onCalendarOpen={() => setIsOpen(true)} // Keep state in sync when calendar opens
                        onClickOutside={() => setIsOpen(false)} // Close when clicking outside
                        open={isOpen} // Control calendar visibility manually
                      />
                      {/* Custom Calendar Icon */}
                      <span
                        className="absolute xs:right-2 right-1 min-[820px]:right-2 min-[1000px]:right-2 min-[1100px]:right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsOpen(true)} // Open calendar on icon click
                      >
                        <CalendarDays className=" max-[800px]:h-7 max-[800px]:w-7
                                                                                          max-[900px]:h-5 
                                                                                          min-[1100px]:h-7 
                                                                                          min-[1100px]:w-7 
                                                                                          max-[900px]:w-5 
                                                                                          min-[1000px]:w-5
                                                                                          min-[1000px]:h-5
                                                                                          max-[1100px]:w-4 xl:h-6 xl:w-6 text-white" />
                      </span>
                    </div>
                  </div>
                  <div className="w-full">
                    <Label
              className="text-[#243460] font-semibold ml-4"
            >
                      Full Name*
                    </Label>
                    <Input
                      type="text"
                      className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                      placeholder="Enter HSP Reg Name"
                      required
                      name="fullname"
                      value={formData.fullname}
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
                    <div className="relative">
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
                  <div className="w-full">
                    <div className="relative">
                            <Label
              className="text-[#243460] font-semibold ml-4"
            >
                              Mobile Number*
                            </Label>
                          </div>
                    <div className="relative ">
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
                    <div className="relative">
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
                  maxLength={2000}
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
          <div className="flex flex-col justify-start gap-8 items-start lg:w-[40%] xl:w-1/2  md:pl-6 xl:p-12 my-auto">
              <div className="mx-auto  md:block hidden p-2 lg:px-10 xl:px-20">
                  <div className="mx-auto p-4 bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl">
                    <p className="font-poppins font-medium min-[1100px]:text-[16px] text-[14px] text-white">
                      <span className="  ">
                        For any information on the general meeting notices of the Company,
                        director resignation and annual return of the Company, please
                        contact us on <br className=" block" />
                        <span className="pl-4 font-semibold text-start">
                          legal@aarogyaaadhar.com
                        </span>
                        <span className="pl-4 block font-semibold text-start">
                          +91 79-7272-7498{" "}
                        </span>
                      </span>
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
      </div>
      <div className="block lg:hidden md:mx-auto md:container px-2 lg:px-0 my-4">
        <div className="justify-center font-poppins text-center ">
            <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">Corporate Governance</span>
            </h1>
        </div>
        <div className="md:mx-auto flex md:container py-2 justify-center md:w-[80%]   w-full items-center  text-justify ">
          <p className="font-poppins text-center  text-[16px] md:text-[14px] text-[#243460]">
            <span className="  ">
              For any information on the general meeting notices of the Company,
              director resignation and annual return of the Company, please
              contact us on <br className="lg:hidden block" />
              <span className="font-semibold text-start">
                legal@aarogyaaadhar.com
                <br className="lg:hidden block" /> +91 79-7272-7498{" "}
              </span>
            </span>
          </p>
        </div>
        <div className="justify-center font-poppins text-center ">
            <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">Enquiry Form</span>
            </h1>
        </div>
        <div className="mx-auto  flex flex-col justify-center items-center   mt-4 flex-wrap md:flex-nowrap">
          <div className="bg-[#5271FF] w-full md:w-4/5 p-1 xs:p-4 lg:p-8 lg:px-8 rounded-xl">
            <form className="space-y-2" onSubmit={handleSubmit}>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="w-full relative">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                                        max-[800px]:text-[16px] 
                                        max-[1100px]:text-[12px]  font-poppins">
                      Corporate Year*
                    </h1>
                    <div
                      className="relative  bg-[#5271FF]  rounded-full border-[#453565] cursor-pointer mt-1"
                      onClick={() => setIsOpen(true)} // Open on click
                    >
                      {/* Year Picker */}
                      <DatePicker
                        selected={selectedYear}
                        ref={datePickerRef}
                        onChange={(date) => {
                          setSelectedYear(date);
                          setIsOpen(false); // Close calendar after selecting year
                        }}
                        showYearPicker
                        dateFormat="yyyy"
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
                                        border-[#453565]
                                        outline-none
                                        "
                        placeholderText="Select Year"
                        onCalendarOpen={() => setIsOpen(true)} // Keep state in sync when calendar opens
                        onClickOutside={() => setIsOpen(false)} // Close when clicking outside
                        open={isOpen} // Control calendar visibility manually
                      />
                      {/* Custom Calendar Icon */}
                      <span
                        className="absolute xs:right-2 right-1 min-[820px]:right-2 min-[1000px]:right-1 min-[1100px]:right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsOpen(true)} // Open calendar on icon click
                      >
                        <CalendarDays className=" max-[800px]:h-7 max-[800px]:w-7
                                                                                          max-[900px]:h-5 
                                                                                          min-[1100px]:h-7 
                                                                                          min-[1100px]:w-7 
                                                                                          max-[900px]:w-5 
                                                                                          min-[1000px]:w-5
                                                                                          min-[1000px]:h-5
                                                                                          max-[1100px]:w-4 xl:h-7 xl:w-7 text-[#5271FF]" />
                      </span>
                    </div>
                  </div>
                  <div className="w-full">
                    <h1 className="text-white font-semibold min-[1100px]:text-[16px] 
                              max-[800px]:text-[16px] 
                              max-[1100px]:text-[12px]  font-poppins">
                      Full Name*
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
                              rounded-xl 
                              border-[#453565]
                              outline-none"
                      placeholder="Enter HSP Reg Name"
                      required
                      name="fullname"
                      value={formData.fullname}
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
                              rounded-xl 
                              border-[#453565]
                              outline-none"
                        placeholder="Enter Your Email ID"
                        required
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
                              rounded-xl 
                              border-[#453565]
                              outline-none"
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
                              rounded-xl 
                              border-[#453565]
                              outline-none"
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
                              rounded-xl 
                              border-[#453565]
                              outline-none"
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
                                    "rounded-full xl:h-[32px] xs:h-[2rem]  md:h-7 h-6 px-4  w-auto  md:py-1 bg-white xs:my-1",
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
                          bg-white outline-none"
                  placeholder="Enter Message"
                  // required
                  rows="3"
                  maxLength={2000}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
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
          <div className="flex flex-col justify-start gap-8 items-start md:w-2/5 w-full md:pl-6 my-auto">
              <div className="mx-auto  lg:block hidden bg-gradient-to-br from-[#5271FF] to-blue-400 rounded-xl p-2">
                  <div className="mx-auto p-4">
                    <p className="font-poppins font-medium min-[1100px]:text-[16px] text-[14px] text-white">
                      <span className="  ">
                        For any information on the general meeting notices of the Company,
                        director resignation and annual return of the Company, please
                        contact us on <br className=" block" />
                        <span className="pl-4 font-semibold text-start">
                          legal@aarogyaaadhar.com
                        </span>
                        <span className="pl-4 block font-semibold text-start">
                          +91 79-7272-7498{" "}
                        </span>
                      </span>
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
      </div>
    
    </>
  );
};

export default CorporateGoveranceClient;
const OurServices = [
  {
    text: "2000",
  },
  {
    text: "2001",
  },
  {
    text: "2002",
  },
  {
    text: "2003",
  },
  {
    text: "2004",
  },
  {
    text: "2005",
  },
  {
    text: "2006",
  },
  {
    text: "2007",
  },
];
