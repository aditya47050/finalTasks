"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { ArrowDown, CalendarDays } from "lucide-react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import CommonMBanner from "../../components/commonmobilebanner";

const Bedbook = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false); // State to control the dialog

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
  const [hospitalType, sethospitalType] = useState();
  const [bedCategory, setbedCategory] = useState();
  const [advanceSearch, setAdvanceSearch] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const hospitalOptions = [
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
  ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle Dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle Checkbox Change
  const handleMultiCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setAdvanceSearch([...advanceSearch, value]);
    } else {
      setAdvanceSearch(advanceSearch.filter((item) => item !== value));
    }
  };
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
      const res = await fetch("/api/otps/bedbooking/send-otp", {
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
      const verifyRes = await fetch("/api/otps/bedbooking/verify-otp", {
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
    const formattedAdvanceSearch = Array.isArray(advanceSearch)
      ? advanceSearch
      : [advanceSearch];

    // Check if OTP is verified
    if (!isOtpVerified) {
      toast("Please verify OTP before submitting.");
      return; // Early return if OTP is not verified
    }

    // All conditions met, proceed to register
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const registerRes = await fetch("/api/bedbooking", {
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
          hospitalType,
          bedCategory,
          advanceSearch: formattedAdvanceSearch,
          hospitalName,
          pinCode,
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
      toast("Failed to create an account: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <>
      <div className="p-2 font-poppins ">
        <div className="text-center mx-auto">
          <h1 className="text-[20px] font-bold text-[#5271ff]">
            Hospital Bed Booking
          </h1>
          <p className="text-[#5271ff] text-[11px] font-semibold">
            Patient Details
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="w-full mt-0 p-2">
            <div className=" mt-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    First Name*
                  </h1>
                  <input
                    type="text"
                    className="w-full h-8 p-2 border border-[#243460]  rounded-full placeholder:pl-1 placeholder:text-[#2b73ec] text-[10px]"
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
                <div>
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Middle Name*
                  </h1>
                  <input
                    type="text"
                    className="w-full h-8 p-2 border border-[#243460] text-[10px] rounded-full placeholder:pl-1 placeholder:text-[#2b73ec] "
                    placeholder="Enter Patient Middle Name"
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
                <div>
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Last Name*
                  </h1>
                  <input
                    type="text"
                    className="w-full h-8 p-2 border border-[#243460] text-[10px] rounded-full placeholder:pl-1 placeholder:text-[#2b73ec] "
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
                      className="border rounded-full text-[12px] p-2 w-full h-8 pr-20  placeholder:text-[10px] placeholder:text-[#2b73ec]  border-[#243460]"
                      maxDate={new Date()} // Disable next years
                      showMonthDropdown // Add this to allow month selection
                    />

                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <CalendarDays className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Gender*
                  </h1>
                  <div className="relative">
                    <select
                      className="w-full h-8 p-2 rounded-full border border-[#243460] text-[10px] appearance-none text-[#2b73ec]"
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select your Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Transgender</option>
                    </select>
                    <span className="absolute right-1 text-[#2b73ec] top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Aadhar Card Number*
                  </h1>
                  <input
                    type="text"
                    className="w-full h-8 p-2 border border-[#243460]  rounded-full placeholder:pl-1 placeholder:text-[#2b73ec] text-[10px]"
                    placeholder="Enter Aadhar Number"
                    required
                    value={aadharCardNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Ensure the input is numeric and has a maximum length of 12
                      if (value.length <= 12 && /^[0-9]*$/.test(value)) {
                        setAadharCardNumber(value);
                      }
                    }}
                  />
                </div>
                
                <div className="w-full relative">
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
                <div className="w-full relative">
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
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
                <div className="relative">
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Mobile Number*
                  </h1>
                  <input
                    type="text"
                    className="w-full h-8 p-2 border border-[#243460]  rounded-full placeholder:pl-1 placeholder:text-[#2b73ec] text-[10px]"
                    placeholder="Enter Mobile Number"
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
                <div className="relative">
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Hospital Type*
                  </h1>
                  <div className="relative">
                    <select
                      className="w-full h-8 p-2 rounded-full border border-[#243460] text-[10px] appearance-none text-[#2b73ec]"
                      required
                      value={hospitalType}
                      onChange={(e) => sethospitalType(e.target.value)}
                    >
                      <option value="">Select Hospital Type</option>
                      {["Goverment Hospitals", "Private Hospitals"].map(
                        (type, index) => (
                          <option
                            key={index}
                            className="text-black"
                            value={type}
                          >
                            {type}
                          </option>
                        )
                      )}
                    </select>
                    <span className="absolute right-1 text-[#2b73ec] top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Bed Category*
                  </h1>
                  <div className="relative">
                    <select
                      className="w-full h-8 p-2 rounded-full border border-[#243460] text-[10px] appearance-none text-[#2b73ec]"
                      required
                      value={bedCategory}
                      onChange={(e) => setbedCategory(e.target.value)}
                    >
                      <option value="">Select Bed Category</option>
                      {[
                        "ICU Ventilator Bed",
                        "ICU Bed",
                        "CCU",
                        "NICU",
                        "PICU Ventilator Bed",
                        "PICU Bed",
                        "HDU",
                        "Suite Room Bed",
                        "Deluxe Room Bed",
                        "Private Single Sharing Bed",
                        "Non AC Private Single Sharing Bed",
                        "Semi Private Sharing Bed",
                        "Non AC Semi Private Sharing Bed",
                        "Male Ward Bed",
                        "Female Ward Bed",
                        "General Ward",
                        "Day Care",
                      ].map((type, index) => (
                        <option key={index} className="text-black" value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-1 text-[#2b73ec] top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Advanced Search*
                  </h1>

                  {/* Clickable Select Box */}
                  <div
                    className="w-full h-8 p-2 rounded-full border border-[#243460] text-[10px] appearance-none text-[#2b73ec] cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    {/* Display Selected Items */}
                    <div className="flex-1 max-h-8 overflow-y-auto flex flex-wrap items-center gap-1 text-[10px] text-black">
                      {advanceSearch.length > 0 ? (
                        advanceSearch.map((item, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-black px-2 py-1 rounded-md text-[10px] leading-[10px]"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#2b73ec] mt-1 text-[10px] leading-[10px]">
                          Select Hospitals
                        </span>
                      )}
                    </div>

                    {/* Dropdown Arrow */}
                    <span className="absolute right-1 mt-2 text-[#2b73ec] top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {isDropdownOpen ? (
                        <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                      ) : (
                        <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                      )}
                    </span>
                  </div>

                  {/* Dropdown with Checkboxes */}
                  {isDropdownOpen && (
                    <div className="absolute w-full max-h-40 overflow-y-auto bg-white border border-[#243460] mt-1 rounded-xl shadow-lg z-50 text-[10px]">
                      {/* Selected Heading */}
                      {advanceSearch.length > 0 && (
                        <div className="p-1 border-b border-gray-300 bg-gray-100">
                          <h2 className="text-[10px] font-semibold text-[#243460]">
                            Selected
                          </h2>
                          <ul className="text-[10px] text-black">
                            {advanceSearch.map((spec, index) => (
                              <li
                                key={index}
                                className="py-1 text-[10px] text-[#2b73ec]"
                              >
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Hospital Type Checkboxes */}
                      <div className="p-2">
                        {hospitalOptions.map((option, index) => (
                          <label
                            key={index}
                            className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer text-[10px]"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              checked={advanceSearch.includes(option)}
                              onChange={handleMultiCheckboxChange}
                              className="mr-2 text-[10px]"
                            />
                            <span className="text-black text-[10px]">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Hospital Name*
                  </h1>
                  <input
                    type="text"
                    className="w-full h-8 p-2 border border-[#243460] text-[10px] rounded-full placeholder:pl-1 placeholder:text-[#2b73ec]"
                    placeholder="Enter Hospital Name"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                </div>
                <div>
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    City*
                  </h1>
                  <input
                    type="text"
                    className="w-full h-8 p-2 border border-[#243460] text-[10px] rounded-full placeholder:pl-1 placeholder:text-[#2b73ec] "
                    placeholder="Enter City Name"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <h1 className="text-[#243460] font-bold text-[10px] ml-1 font-poppins">
                    Pin Code*
                  </h1>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => {
                      // Ensure the value is numeric and the length is less than or equal to 6
                      const value = e.target.value;
                      if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                        setPinCode(value);
                      }
                    }}
                    className="w-full h-8 p-2 border border-[#243460] text-[10px] rounded-full placeholder:pl-1 placeholder:text-[#2b73ec]"
                    placeholder="Enter Area Pincode"
                    required
                  />
                </div>
              </div>

              <div className="mx-auto flex text-[10px] items-center justify-center mt-8">
                <button
                  className="bg-blue-600 rounded-full p-3 shadow-2xl text-white font-bold"
                  type="submit"
                >
                  Confirm Bed Booking
                </button>
              </div>
            </div>
          </div>
        </form>

        {showAlert && (
          <div className="fixed left-[50%] rounded-2xl top-[30%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200 ">
            <Alert>
              <AlertTitle></AlertTitle>
              <AlertDescription>
                <div className="flex flex-col text-center space-y-4">
                  <h1 className="text-[#243460] text-[12px] font-extrabold">
                    Thank you for Generate Hospital Bed Booking
                  </h1>
                  <h1 className="text-[#FF5E00] text-[14px] font-extrabold">
                    Aarogya Rakshak will connect you shortly
                  </h1>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
      <div className=" mb-2">
      <CommonMBanner/>
      </div>
    </>
  );
};

export default Bedbook;
