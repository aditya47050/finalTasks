"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialogcustom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowDown,
  Ambulance,
  CalendarDays,
  MapPin,
  Check,
} from "lucide-react";
import Image from "next/image";
import MobileEmergencyAmbulanceForm from "./emergencyambulancebookingmobile";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";

const BookAmbulance = () => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const [open, setOpen] = useState(false); // State to control the dialog
  const [date, setDate] = useState();

  //2Backend
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [ambulancetype, setambulancetype] = useState();
  const [ambulancecategory, setambulancecategory] = useState("");
  const [hospitaltype, sethospitaltype] = useState("");

  // OTP and form states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle sending OTP
  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otps/ambulancebooking/send-otp", {
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
      const verifyRes = await fetch("/api/otps/ambulancebooking/verify-otp", {
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
    // Check if OTP is verified
    if (!isOtpVerified) {
      toast("Please verify OTP before submitting.");
      return; // Early return if OTP is not verified
    }

    // All conditions met, proceed to register
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const registerRes = await fetch("/api/bookambulance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          gender,
          aadharCardNumber,
          mobileNumber,
          email,
          ambulancetype,
          hospitaltype,
          ambulancecategory,
        }),
      });

      // Check if the response is not ok (status not in the 200-299 range)
      if (!registerRes.ok) {
        // Attempt to parse the response body for a more detailed error message
        const errorData = await registerRes.json();
        const errorMessage = errorData.message || "Failed to Book Ambulance";
        throw new Error(errorMessage);
      }

      // Success: show alert and handle the rest
      setShowAlert(true);
      setOpen(false); // Close the dialog
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setDateOfBirth("");
      setEmail("");
      setOtp("");
      setMobileNumber("");
      setAadharCardNumber("");
      sethospitaltype("");
      setambulancecategory("");
      setambulancetype("");

      setGender("");
      // Set a timer to close the alert after 15 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      // Display the actual error message from the server
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div className=" font-poppins -mt-6">
        <div className="w-full p-4 items-center justify-center space-y-2 ">
          <MobileEmergencyAmbulanceForm />

          <form onSubmit={handleSubmit}>
            {" "}
            <div className="w-full   p-2 rounded-2xl md:py-10">
              <div className="text-center justify-center mx-auto">
                <h1 className="text-[20px] font-bold text-[#5271ff]">
                  Book Your Ambulance
                </h1>
                <p className="text-[#5271ff] text-[11px] font-semibold">
                  Patient Details
                </p>
              </div>
              <div className="w-full mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {/* First Name */}
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      First Name*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 p-2 placeholder:text-[10px] text-[11px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Patient First Name"
                      required
                      value={firstName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setFirstName(value);
                        }
                      }}
                    />
                  </div>
                  {/* Middle Name */}
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Middle Name*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 p-2 placeholder:text-[10px] text-[11px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Patient Middle Name"
                      value={middleName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setMiddleName(value);
                        }
                      }}
                    />
                  </div>
                  {/* Last Name */}
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Last Name*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 p-2 placeholder:text-[10px] text-[11px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Patient Last Name"
                      required
                      value={lastName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setLastName(value);
                        }
                      }}
                    />
                  </div>
                  {/* Date Of Birth */}
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Date Of Birth*
                    </h1>
                    <div className="relative  ">
                      <DatePicker
                        selected={dateOfBirth}
                        onChange={(date) => setDateOfBirth(date)}
                        dateFormat="dd/MM/yyyy" // Change to month/year format
                        showYearDropdown
                        yearDropdownItemNumber={100}
                        scrollableYearDropdown
                        placeholderText="DD/MM/YYYY"
                        className="border rounded-full text-[12px] p-2 w-full h-8 pr-20  placeholder:text-[10px] text-[11px] placeholder:text-[#2b73ec]  border-[#243460]"
                        maxDate={new Date()} // Disable next years
                        showMonthDropdown // Add this to allow month selection
                      />

                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Gender*
                    </h1>
                    <div className="relative">
                      <select
                        className="w-full h-8 px-2 text-[10px] rounded-full border-[#243460] border font-light text-[#2b73ec] appearance-none"
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select your Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Transgender</option>
                      </select>
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                      </span>
                    </div>
                  </div>
                  {/* Aadhar Card Number */}
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Aadhar Card Number*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 p-2 placeholder:text-[10px] text-[11px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Aadhar Number"
                      required
                      value={aadharCardNumber}
                      onChange={(e) => setAadharCardNumber(e.target.value)}
                    />
                  </div>

                  {/* Email ID with OTP */}
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Email ID*
                    </h1>
                    <div className="relative">
                      <input
                        type="email"
                        className="w-full h-8 text-[10px] placeholder:text-[#2b73ec] p-2 pr-10 rounded-full  border border-[#453565]"
                        placeholder="Enter Email ID"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="absolute text-[10px] right-1 text-white bg-blue-950 rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                      >
                        {isLoading && !isOtpSent
                          ? "wait!"
                          : isOtpSent
                          ? "Sent"
                          : "Send OTP"}
                      </button>
                    </div>
                  </div>
                  {/* Email OTP Verification */}
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Email OTP*
                    </h1>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full h-8 text-[10px] placeholder:text-[#2b73ec] p-2 pr-10 rounded-full  border border-[#453565]"
                        placeholder="Enter Email OTP"
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
                        disabled={isOtpVerified || isLoading}
                        className="absolute text-[10px] right-1 text-white bg-blue-950 rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                      >
                        {isLoading && isOtpSent && !isSubmitting
                          ? "wait!"
                          : isOtpVerified
                          ? "Verified"
                          : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                  {/* Mobile Number */}
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Mobile Number*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 p-2 placeholder:text-[10px] text-[11px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Mobile Number"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </div>
                  {/* Ambulance Type */}
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Ambulance Type*
                    </h1>
                    <select
                      className="w-full h-8 px-2 text-[10px] rounded-full border-[#243460] border font-light text-[#2b73ec] appearance-none"
                      required
                      value={ambulancetype}
                      onChange={(e) => setambulancetype(e.target.value)}
                    >
                      <option value="">
                                      Select Ambulance Type
                                    </option>

                                    {[
                                      "Basic Ambulance",
                                      "O2 Ambulance",
                                      "Without O2 Ambulance",
                                      "Cardiac Ambulance",
                                      "Mobile Equipped Unit",
                                      "Air Ambulance",
                                    ].map((category, index) => (
                                      <option
                                        key={index}
                                        className="text-black"
                                        value={category}
                                      >
                                        {category}
                                      </option>
                                    ))}
                    </select>
                    <span className="absolute right-1 mt-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                    </span>
                  </div>
                  {/* Ambulance Category */}
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Ambulance Category*
                    </h1>
                    <select
                      className="w-full h-8 px-2 text-[10px] rounded-full border-[#243460] border font-light text-[#2b73ec] appearance-none"
                      required
                      value={ambulancecategory}
                      onChange={(e) => setambulancecategory(e.target.value)}
                    >
                      <option value="" disabled>
                                      Select Ambulance Category
                                    </option>
                                    {[
                                      "108 Ambulance",
                                      "Private Ambulance",
                                      "Hospital Ambulance",
                                      "RED Health Ambulance",
                                      "Medulance Ambulance",
                                      "AmbiPalm Ambulance",
                                      "MedCap Ambulance",
                                      "Ziqitza Ambulance",
                                    ].map((category, index) => (
                                      <option
                                        key={index}
                                        className="text-black"
                                        value={category}
                                      >
                                        {category}
                                      </option>
                                    ))}
                    </select>
                    <span className="absolute right-1 mt-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                    </span>
                  </div>
                  {/* Hospital Type */}
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                      Hospital Type*
                    </h1>
                    <select
                      className="w-full h-8 px-2 text-[10px] rounded-full border-[#243460] border font-light text-[#2b73ec] appearance-none"
                      required
                      value={hospitaltype}
                      onChange={(e) => sethospitaltype(e.target.value)}
                    >
                     <option value="" disabled>
                                      Select Hospital Type
                                    </option>
                                    {[
                                      "Goverment Hospitals",
                                      "Private Hospitals",
                                      "NABH Hospitals",
                                      "MJPJAY Hospitals",
                                      "ESIC Hospitals",
                                      "CGHS Hospitals",
                                      "Trauma Care Hospitals",
                                      "Cardiac Care Hospitals",
                                      "Mother & Child Hospitals",
                                      "Speciality Hospitals",
                                      "Multispeciality Hospitals",
                                      "Super-Speciality Hospitals",
                                      "Cancer Hospitals",
                                      "Eye Hospitals",
                                      "IVF Centers",
                                      "Dialysis Centers",
                                      "Dental Clinics",
                                      "Small Clinics",
                                    ].map((type, index) => (
                                      <option
                                        key={index}
                                        className="text-black"
                                        value={type}
                                      >
                                        {type}
                                      </option>
                                    ))}
                    </select>
                    <span className="absolute right-1 mt-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mx-auto flex items-center justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-[#5271FF] text-sm rounded-full p-3 pr-2 py-2 shadow-2xl text-white font-bold flex items-center gap-1"
                  >
                    Click Here for Booking
                    <span className="bg-white text-[#5271FF] rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5" />
                    </span>
                  </button>
                </div>
              </div>

              <div></div>
            </div>
          </form>
        </div>
      </div>

      {showAlert && (
        <div className="fixed left-[50%]  rounded-2xl top-[30%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200 ">
          <Alert>
            <AlertTitle></AlertTitle>
            <AlertDescription>
              <div className="flex flex-col text-center space-y-2">
                <h1 className="text-[#243460] text-[12px] font-extrabold">
                  Thank you for Ambulance Booking
                </h1>
                <h1 className="text-[#243460] text-[18px] font-extrabold">
                  Aarogya Rakshak will connect you shortly
                </h1>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default BookAmbulance;
