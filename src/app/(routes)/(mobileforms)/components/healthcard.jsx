"use client";
import { ArrowDown, CalendarDays } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DatePicker from "react-datepicker";
import CommonMBanner from "../../components/commonmobilebanner";
const Healthcard = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false); // State to control the dialog
  const [date, setDate] = useState();

  //Backend
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState("");
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pancard, setpancard] = useState();
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");

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
      const res = await fetch("/api/otps/health-card-booking/send-otp", {
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
      const verifyRes = await fetch(
        "/api/otps/health-card-booking/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }), // Sending email and OTP
        }
      );

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

    // Ensure OTP is verified before proceeding
    if (!isOtpVerified) {
      toast("Please verify OTP before submitting.");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Send request to apply for the health card
      const registerRes = await fetch("/api/applyhealthcard", {
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
          pancard,
          pinCode,
          city,
        }),
      });

      if (!registerRes.ok) {
        // Attempt to parse the error response; handle non-JSON responses gracefully
        let errorMessage = "Failed to Apply Health Card"; // Default error message
        try {
          const errorData = await registerRes.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError.message);
        }
        throw new Error(errorMessage);
      }

      // Success
      setShowAlert(true);
      setOpen(false); // Close dialog/modal

      // Auto-hide alert after 2 seconds
      const alertTimeout = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      // Cleanup: Clear timeout if component unmounts
      return () => clearTimeout(alertTimeout);
    } catch (error) {
      // Display the error message
      toast(`Error: ${error.message}`);
      console.error("Submission Error:", error);
    } finally {
      // Reset loading and submitting states
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto font-poppins md:container md:px-0 px-2  block lg:hidden">
        <div className="justify-center text-center pt-1">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold">
            Aarogya Aadhar Health Card
          </h1>
          <p className="text-[#5271FF] text-[11px]">Member Registration Form</p>
        </div>
        <form onSubmit={handleSubmit}>
          {" "}
          <div className=" grid grid-cols-2 md:grid-cols-3 gap-4 px-2">
            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                First Name*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full border-2 placeholder:text-[#2b73ec] border-[#243460]"
                  placeholder="Enter First Name"
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
            </div>
            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                Middle Name*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full border-2 placeholder:text-[#2b73ec] border-[#243460]"
                  placeholder="Enter Middle Name"
                  required
                  value={middleName}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      setMiddleName(value);
                    }
                  }}
                />
              </div>
            </div>
            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                Last Name*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full placeholder:text-[#2b73ec] border-2 border-[#243460]"
                  placeholder="Enter Last Name"
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
            </div>

            <div className="w-full relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
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
                  className="border-2 rounded-full text-[12px] p-2 w-full h-8 pr-20  placeholder:text-[10px] placeholder:text-[#2b73ec]  border-[#243460]"
                  maxDate={new Date()} // Disable next years
                  showMonthDropdown // Add this to allow month selection
                />

                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <CalendarDays className="h-5 w-5" />
                </span>
              </div>
            </div>
            <div className="w-full relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                Gender*
              </h1>
              <div className="relative">
                <select
                  className="w-full h-8 text-[10px] p-1 rounded-full appearance-none border-2 border-[#243460] text-[#2b73ec]"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select your Gender</option>
                  <option value="male" className="text-black">
                    Male
                  </option>
                  <option value="female" className="text-black">
                    Female
                  </option>
                  <option value="other" className="text-black">
                    Transgender
                  </option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                </span>
              </div>
            </div>

            <div className="relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                Aadhar Number*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full border-2 placeholder:text-[#2b73ec] border-[#243460]"
                  placeholder=" Enter Aadhar Number"
                  required
                  value={aadharCardNumber}
                  onChange={(e) => setAadharCardNumber(e.target.value)}
                />
              </div>
            </div>
            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                PAN Card Number*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full placeholder:text-[#2b73ec] border-2 border-[#243460]"
                  placeholder="Enter PAN Number"
                  required
                  value={pancard}
                  maxLength="10"
                  onChange={(e) => setpancard(e.target.value)}
                />
              </div>
            </div>

            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                City Name*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full border-2 placeholder:text-[#2b73ec] border-[#243460]"
                  placeholder="Enter City Name"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                Pin Code*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full placeholder:text-[#2b73ec] border-2 border-[#243460]"
                  placeholder=" Enter Pin Code"
                  required
                  value={pinCode}
                  onChange={(e) => {
                    // Ensure the value is numeric and the length is less than or equal to 6
                    const value = e.target.value;
                    if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                      setPinCode(value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="w-full relative">
              <h1 className="text-[rgb(36,52,96)] font-bold text-[10px] ml-1 font-poppins">
                Mobile Number*
              </h1>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-8 text-[10px] p-2 rounded-full border-2 placeholder:text-[#2b73ec] border-[#243460]"
                  placeholder=" Enter Mobile Number"
                  required
                  value={mobileNumber}
                  maxLength="10"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      setMobileNumber(value);
                    }
                  }}
                />
              </div>
            </div>
            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
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
            <div className=" relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                Email OTP*
              </h1>
              <div className="relative">
                <input
                  type="number"
                  className="w-full h-8 text-[10px] placeholder:text-[#2b73ec] p-2 pr-10 rounded-full  border border-[#453565]"
                  placeholder="Enter Email OTP"
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

           
          </div>
          <div className="mx-auto flex items-center justify-center mt-2">
            <button
              className="bg-blue-600 rounded-full text-[11px] px-4  py-1 shadow-2xl text-white font-bold"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="py-2 mx-2">
        {" "}
       <img src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731740284/Aarogya_Aadhar_Story_2nd_Image_wgxnle.png" alt=""  className=" border border-blue-800 rounded-xl"/>
      </div>
      {showAlert && (
        <div className="fixed left-[50%]  rounded-2xl top-[30%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200 ">
          <Alert>
            <AlertTitle></AlertTitle>
            <AlertDescription>
              <div className="flex flex-col text-center space-y-4">
                <h1 className="text-[#243460] text-[18px] font-extrabold">
                  Thank you for Apply Digital Health Card
                </h1>
                <h1 className="text-[#FF5E00] text-[14px] font-extrabold">
                  Aarogya Rakshak will connect you shortly
                </h1>
                <h1 className="text-[#ff3131] text-[18px] font-poppins font-medium pt-6">
                  Aarogya Aadhar Digital Health Card{" "}
                  <span className="font-bold">Login Credentials</span> shared on
                  your mail id{" "}
                </h1>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default Healthcard;
const images = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png",
  },
];
