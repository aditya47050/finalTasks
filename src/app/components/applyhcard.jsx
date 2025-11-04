"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowDown, Bed, CalendarDays } from "lucide-react";
import Image from "next/image";
import { FaArrowCircleDown, FaIdCard } from "react-icons/fa";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
const ApplyHealthCard = () => {
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

    // // Ensure OTP is verified before proceeding
    // if (!isOtpVerified) {
    //   toast("Please verify OTP before submitting.");
    //   return; // Exit if OTP is not verified
    // }

    // Set loading and submitting states to true
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Send POST request to the backend
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

      // Check response status
      if (!registerRes.ok) {
        // Parse the error message from the response
        const errorData = await registerRes.json();
        const errorMessage =
          errorData.message || "Failed to Apply Health Card.";
        throw new Error(errorMessage); // Throw error to be caught in the catch block
      }

      // Handle successful response
      const responseData = await registerRes.json();
      toast(responseData.message || "Health Card Applied Successfully!");

      // Close the dialog and show success alert
      setShowAlert(true);
      setOpen(false);

      // Set a timer to hide the alert after 15 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 15000);
    } catch (error) {
      // Log and display the error
      console.error("Error applying health card:", error);
      toast(`Error: ${error.message}`);
    } finally {
      // Reset loading and submitting states
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="hidden md:block">
          <div
            className={`flex px-1  rounded-[15px] items-center cursor-pointer ${
              isScrolled ? "flex-col " : "flex-col"
            } `}
          >
            {isScrolled && (
              //   <Image
              //   src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729162298/card_with_text_rqnwmb.png"
              //   className="h-16 rounded-[14px] w-16"
              //   width={600}
              //   height={600}
              //   alt=""
              // />
              <FaIdCard className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
            )}
            {!isScrolled && (
              //   <Image
              //   src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728980753/7-removebg-preview_atilvc.png"
              //   className="h-12 rounded-[4px] w-12"
              //   width={600}
              //   height={600}
              //   alt=""
              // />

              <FaIdCard className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
            )}{" "}
            {
              <span
                className={` truncate  text-center side-bar-text-size side-bar-lg-text xl:text-[8px] xlg:text-[10px] font-poppins`}
              >
                Health <br /> Card
              </span>
            }
          </div>
        </DialogTrigger>
        <div className="bg-[#E9E8E9] ">
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>

              <DialogDescription>
                <div className="text-center justify-center mx-auto">
                  <h1 className="text-2xl font-bold text-blue-950">
                    Aarogya Aadhar Health Card
                  </h1>
                  <p className="text-blue-950 font-semibold">
                    Member Registration Form
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="w-full mt-4">
                    <div className="space-y-4 mt-4">
                      <div className="flex space-x-4">
                        <div className="w-full">
                          <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                            First Name*
                          </h1>
                          <Input
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z\s]*$/.test(value)) {
                                setFirstName(value);
                              }
                            }}
                            className="pl-4"
                            placeholder="Enter First Name"
                            required
                          />
                        </div>
                        <div className="w-full">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                            Middle Name
                          </h1>
                          <Input
                            type="text"
                            value={middleName}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z\s]*$/.test(value)) {
                                setMiddleName(value);
                              }
                            }}
                            className="pl-4"
                            placeholder="Enter Middle Name"
                          />
                        </div>
                        <div className="w-full">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                            Last Name*
                          </h1>
                          <Input
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^[a-zA-Z\s]*$/.test(value)) {
                                setLastName(value);
                              }
                            }}
                            className="pl-4"
                            placeholder="Enter Last Name"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 mt-4">
                      <div className="flex space-x-4">
                        <div className="w-full relative">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                            Date Of Birth*
                          </h1>
                          <div className="relative ">
                            <DatePicker
                              selected={dateOfBirth}
                              onChange={(date) => setDateOfBirth(date)}
                              dateFormat="dd/MM/yyyy"
                              showYearDropdown
                              yearDropdownItemNumber={100}
                              scrollableYearDropdown
                              maxDate={new Date()} // Disable next years
                              showMonthDropdown // Add this to allow month selection
                              placeholderText="DD/MM/YYYY"
                              className="border-[1px] border-black rounded-xl bg-transparent p-2 w-full h-10 pl-4 text-xs   text-[12px]  pr-20"
                            />
                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <CalendarDays className="h-5 w-5" />
                            </span>
                          </div>
                        </div>
                        <div className="w-full relative">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">Gender*</h1>
                          <div className="relative">
                            <Select
                                value={gender}
                                onValueChange={setGender}
                                required
                              >
                                <SelectTrigger className="w-full h-9 text-[14px] px-4 rounded-xl border-[1px] border-[#453565] text-gray-700 bg-transparent shadow-sm focus:ring-2 focus:ring-blue-300">
                                  <SelectValue placeholder="Select your Gender" />
                                </SelectTrigger>
                                <SelectContent className="text-[13px]">
                                  {[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" },
                                    { label: "Transgender", value: "other" },
                                  ].map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                          </div>
                        </div>


                        <div className="w-full">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                            Aadhar Card Number*
                          </h1>
                          <Input
                            type="text"
                            value={aadharCardNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (
                                value.length <= 12 &&
                                /^[0-9]*$/.test(value)
                              ) {
                                setAadharCardNumber(value);
                              }
                            }}
                            className="pl-4"
                            placeholder="Enter 12-Digit Aadhar Number"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 mt-4">
                      <div className="flex space-x-4">
                        <div className="w-full">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                            Mobile Number*
                          </h1>
                          <Input
                            type="text"
                            value={mobileNumber}
                            maxLength="10"
                            onChange={(e) => {
                              const value = e.target.value;

                              // Allow only 10-digit numeric values
                              if (/^\d{0,10}$/.test(value)) {
                                setMobileNumber(value);
                              }
                            }}
                            onBlur={() => {
                              // Ensure the input has exactly 10 digits on blur
                              if (mobileNumber.length !== 10) {
                                //setMobileNumber(""); // Clear input if not exactly 10 digits
                                toast(
                                  "Mobile number must be exactly 10 digits."
                                );
                              }
                            }}
                            className="pl-4"
                            placeholder="Enter 10-Digit Mobile Number"
                            required
                          />
                        </div>
                        <div className="w-full relative">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                            Email ID*
                          </h1>
                          <div className="relative">
                            <Input
                              type="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-4"
                              placeholder="Enter Your Email ID"
                              required
                            />
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="absolute right-1 bg-[#243460] text-[12px] md:text-[12px] font-poppins text-white rounded-xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                            >
                              {isLoading && !isOtpSent
                                ? "wait!"
                                : isOtpSent
                                ? "Sent"
                                : "Send OTP"}
                            </button>
                          </div>
                        </div>
                        <div className="w-full relative">
                          <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                            Enter Email ID OTP*
                          </h1>
                          <div className="relative">
                            <Input
                              type="text"
                              value={otp}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                // Allow only numbers and limit to 6 digits
                                if (/^\d{0,6}$/.test(inputValue)) {
                                  setOtp(inputValue);
                                }
                              }}
                              className="pl-4"
                              placeholder="Enter 6-Digit OTP"
                              // required
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isSubmitting}
                              className="absolute right-1 bg-[#243460] text-[12px] md:text-[12px] font-poppins text-white rounded-xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                            >
                              {isLoading && isOtpSent && !isOtpVerified
                                ? "wait!"
                                : isOtpVerified
                                ? "Verified"
                                : "Verify OTP"}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mt-8">
                        <div className="flex space-x-4">
                          <div className="w-full">
                            <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                              PAN Card Number*
                            </h1>
                            <Input
                              type="text"
                              value={pancard}
                              maxLength={10}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase(); // PAN is usually uppercase
                                // Allow only alphanumeric (A–Z, 0–9)
                                if (/^[A-Z0-9]*$/.test(val)) {
                                  setpancard(val);
                                }
                              }}
                              className="pl-4"
                              placeholder="Enter PAN Card Number"
                              required
                            />
                          </div>
                          <div className="w-full">
                            <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                              City*
                            </h1>
                            <Input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="pl-4"
                              placeholder="Enter City Name"
                              required
                            />
                          </div>
                          <div className="w-full">
                            <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                              Pin Code*
                            </h1>
                            <Input
                              type="number"
                              value={pinCode}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value.length <= 6 &&
                                  /^[0-9]*$/.test(value)
                                ) {
                                  setPinCode(value);
                                }
                              }}
                              className="pl-4"
                              placeholder="Enter 6-Digit Area Pincode"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mx-auto w-full flex items-center justify-center">
                        {" "}
                        <button
                          className="w-full bg-blue-600 rounded-xl p-3 shadow-2xl border border-[#243460] text-white font-bold"
                          type="submit"
                        >
                          {isLoading ? "Please Wait" : " Submit Your Form"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div></div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </div>
      </Dialog>
      {showAlert && (
        <div className="fixed left-[50%]  rounded-2xl top-[30%] z-50 grid w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200 ">
          <Alert>
            <AlertTitle></AlertTitle>
            <AlertDescription>
              <div className="flex flex-col text-center space-y-4">
                <h1 className="text-[#243460] text-[18px] font-extrabold">
                  Thank you for Apply Digital Health Card
                </h1>
                <h1 className="text-[#FF5E00] text-[25px] font-extrabold">
                  Aarogya Rakshak will connect you shortly
                </h1>
                <h1 className="text-[#ff3131] text-[20px] font-poppins font-medium pt-6">
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

export default ApplyHealthCard;
