"use client";
import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RiCalendarScheduleFill } from "react-icons/ri";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowDown, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { LuCalendarClock } from "react-icons/lu";
import { FaArrowCircleDown } from "react-icons/fa";
import { Input } from '@/components/ui/input';
const Formitems = ({ doctorcategory }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false); // State to control the dialog

  const [date, setDate] = useState();
  //Backend
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [aadharCardNumber, setAadharCardNumber] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);

  // OTP and form states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //prefferred date and time
  const [preferredDate, setPreferredDate] = useState(null);
  const [preferredTime, setPreferredTime] = useState(null);

  // Handle sending OTP
  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otps/bookfreeappointment/send-otp", {
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
      const verifyRes = await fetch("/api/otps/bookfreeappointment/send-otp", {
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
      toast.error("Please verify OTP before submitting.");
      return; // Early return if OTP is not verified
    }

    const formattedTime = preferredTime ? format(preferredTime, "hh:mm a") : "";

    // All conditions met, proceed to register
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const registerRes = await fetch("/api/bookfreeappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber, // Assuming you're registering with mobile number
          email,
          pinCode,
          firstName, // Add first name
          middleName, // Add middle name
          lastName, // Add last name
          dateOfBirth,
          gender, // Add gender
          category, // Add category
          preferredDate,
          preferredTime,
          aadharCardNumber, // Add Aadhar card number
          city,

        }),
      });

      if (!registerRes.ok) {
        throw new Error("Failed to create an account");
      }

      setShowAlert(true);
      setOpen(false); // Close the dialog

      // Set a timer to close the alert after 15 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      toast.error("Please login to Submit the form.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  const [buttonStates, setButtonStates] = useState(null);

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
      {" "}
      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="hidden md:block">
            <div
              className={`flex    px-0  rounded-[15px] items-center cursor-pointer ${isScrolled ? "flex-col " : "flex-col "
                }`}
            >
              {isScrolled && (
                // <Image
                //   src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729162349/appointment_with_text_hiaihz.png"
                //   className="h-16 rounded-[14px] stroke-black w-16"
                //   width={1600}
                //   height={1600}
                //   alt=""
                //   style={{ stroke: "2.5" }}
                // />
                <LuCalendarClock className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
              )}
              {!isScrolled && (
                // <Image
                //   src="https://res.cloudinary.com/dnckhli5u/image/upload/v1728980753/1-removebg-preview_ehw7x6.png"
                //   className="h-12 rounded-[4px] stroke-black w-12"
                //   width={1600}
                //   height={1600}
                //   alt=""
                //   style={{ stroke: "2.5" }}
                // />
                <LuCalendarClock className="md:h-6 md:w-6  xl:h-[25px] xl:w-[25px] p-1" />
              )}
              {
                <span
                  className={`truncate text-center  side-bar-text-size side-bar-lg-text xl:text-[8px] xlg:text-[10px] font-poppins rounded-[4px] `}
                >
                  Free <br /> Appointment
                </span>
              }
            </div>
          </DialogTrigger>
          <div className="bg-[#E9E8E9]">
            <DialogContent>
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>
                  <div className="text-center justify-center mx-auto">
                    <h1 className="text-2xl font-bold text-blue-950">
                      Book Free Appointment
                    </h1>
                    <p className="text-blue-950 font-semibold">
                      Patient Details
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="w-full mt-4">
                      <div className="space-y-4 mt-4">
                        <div className="flex space-x-4">
                          <div className="w-full">
                            <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
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
                              placeholder="Enter Patient First Name"
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
                              placeholder="Enter Patient Middle Name"
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
                              placeholder="Enter Patient Last Name"
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
                            <div className="relative">
                              <DatePicker
                                selected={dateOfBirth}
                                onChange={(date) => setDateOfBirth(date)}
                                dateFormat="dd/MM/yyyy" // Change to month/year format
                                showYearDropdown
                                yearDropdownItemNumber={100}
                                scrollableYearDropdown
                                placeholderText="DD/MM/YYYY"
                                className="border-[1px] border-black rounded-xl text-[12px] bg-transparent pl-4 p-2 w-full h-9 pr-20"
                                maxDate={new Date()} // Disable next years
                                showMonthDropdown // Add this to allow month selection
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <CalendarDays className="h-5 w-5" />
                              </span>
                            </div>
                          </div>

                          <div className="w-full relative">
                            <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                              Gender*
                            </h1>
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
                          <div className="w-full relative">
                            <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                              Doctor Category*
                            </h1>
                            <div className="relative">
                              <Select
                                value={category}
                                onValueChange={setCategory}
                                required
                              >
                                <SelectTrigger className="w-full h-9 text-[14px] px-4 rounded-xl border-[1px] border-[#453565] text-gray-700 bg-transparent shadow-sm focus:ring-2 focus:ring-blue-300">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>

                                <SelectContent className="text-[13px]">
                                  {doctorcategory && doctorcategory.length > 0 ? (
                                    doctorcategory.map((cat) => (
                                      <SelectItem key={cat.id} value={cat.title}>
                                        {cat.title}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="none" disabled>
                                      No categories available
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
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
                                if (/^\d{0,10}$/.test(value)) {
                                  setMobileNumber(value);
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
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-4"
                                placeholder="Enter Your Email ID"
                                required
                              />
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={
                                  isOtpSent || isSubmitting || isOtpSent
                                }
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
                                required
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={isOtpVerified || isLoading}
                                className="absolute right-1 bg-[#243460] text-[12px] md:text-[12px] text-white font-poppins rounded-xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
                        <div className="space-y-4 mt-8">
                          <div className="flex space-x-4">
                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                                Aadhar Card Number*
                              </h1>
                              <Input
                                type="text"
                                value={aadharCardNumber}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Ensure the input is numeric and has a maximum length of 12
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
                                type="text"
                                value={pinCode}
                                onChange={(e) => {
                                  // Ensure the value is numeric and the length is less than or equal to 6
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
                        {/* <div>
                          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        
                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                                Preferred Date
                              </h1>
                              <div className="relative">
                                <DatePicker
                                  selected={preferredDate}
                                  onChange={(date) => setPreferredDate(date)}  // ✅ Correct - updates preferredDate
                                  dateFormat="dd/MM/yyyy"
                                  showYearDropdown
                                  showMonthDropdown
                                  yearDropdownItemNumber={100}
                                  scrollableYearDropdown
                                  placeholderText="DD/MM/YYYY"
                                  className="border-[1px] border-black rounded-xl bg-transparent text-[14px] pl-4 pr-10 py-2 w-full h-10"
                                  minDate={new Date()}  // Optional: Only allow future dates
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  <CalendarDays className="w-5 h-5" />
                                </span>
                              </div>
                            </div>

                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins xs:text-[10px] sm:text-[10px]">
                                Preferred Time*
                              </h1>
                              <div className="relative">
                                <DatePicker
                                  selected={preferredTime}
                                  onChange={(time) => setPreferredTime(time)}
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                  placeholderText="Select preferred time"
                                  className="border-[1px] border-black rounded-xl bg-transparent text-[14px] pl-4 pr-10 py-2 w-full h-10"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  <CalendarDays className="w-5 h-5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div> */}

                        <div className="mx-auto w-full flex items-center justify-center">
                          <button
                            className="w-full bg-blue-600 rounded-xl p-2 shadow-2xl border border-[#243460] text-white font-bold"
                            type="submit"
                          >
                            {
                              isLoading ? "Confirming" : "Confirm Appointment"
                            }
                            
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
      </div>
      {showAlert && (
        <div className="fixed left-[50%] rounded-2xl top-[30%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200 ">
          <Alert>
            <AlertTitle></AlertTitle>
            <AlertDescription>
              <div className="flex flex-col text-center space-y-4">
                <h1 className="text-[#243460] text-[18px] font-extrabold">
                  Thank you for Booking Free Appointment
                </h1>
                <h1 className="text-[#FF5E00] text-[25px] font-extrabold">
                  Aarogya Rakshak will connect you shortly
                </h1>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div></div>
    </>
  );
};

export default Formitems;