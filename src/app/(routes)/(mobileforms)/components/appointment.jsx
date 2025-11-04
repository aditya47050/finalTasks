"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { CalendarDays } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import MBanner from "../../components/mobilebanner";
import DatePicker from "react-datepicker";
import CommonMBanner from "../../components/commonmobilebanner";
const AppointmentClient = ({ doctorcategory,data }) => {
  const [date, setDate] = useState();
  //Backend
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false); // State to control the dialog

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
      const verifyRes = await fetch(
        "/api/otps/bookfreeappointment/verify-otp",
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
      toast.error("Failed to create an account: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  const [showAlert, setShowAlert] = useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  function handleConfirmAppointment() {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  }

  return (
    <>
      <div className="">
        <div className="pb-0 font-poppins">
          <div className="text-center pt-1 justify-center mx-auto">
            <h1 className="text-[20px] font-bold text-[#5271ff]">
              Book Free Appointment
            </h1>
            <p className="text-[#5271ff] text-[11px] font-semibold">
              Patient Details
            </p>
          </div>
          <div className="w-full p-4">
            <form onSubmit={handleSubmit}>
              {" "}
              <div className="space-y-4 ">
                {/* Two inputs per line */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      First Name*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 text-[12px] p-2 placeholder:text-[10px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Patient First Name"
                      value={firstName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setFirstName(value);
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Middle Name*
                    </h1>
                    <input
                      type="text"
                      value={middleName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setMiddleName(value);
                        }
                      }}
                      className="w-full h-8 text-[12px] p-2 placeholder:text-[10px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Patient Middle Name"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Last Name*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 text-[12px] p-2 placeholder:text-[10px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Patient Last Name"
                      value={lastName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(value)) {
                          setLastName(value);
                        }
                      }}
                      required
                    />
                  </div>
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
                        className="border rounded-full text-[12px] p-2 w-full h-8 pr-20  placeholder:text-[10px] placeholder:text-[#2b73ec]  border-[#243460]"
                        maxDate={new Date()} // Disable next years
                        showMonthDropdown // Add this to allow month selection
                      />

                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                    </div>
                  </div>

                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins ">
                      Gender*
                    </h1>
                    <div className="relative">
                      <select
                        className="w-full h-8 text-[10px] p-2 rounded-full  border border-[#453565] text-[#2b73ec] appearance-none"
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select your Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other"> Transgender</option>
                      </select>
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Image
                          className="h-6 w-6"
                          src={
                            "https://res.cloudinary.com/dnckhli5u/image/upload/v1726035881/Icons/yupkmri6egefipsa4bcb.png"
                          }
                          width={1600}
                          height={800}
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                  <div className="w-full relative">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins ">
                     Doctor Category*
                    </h1>
                    <div className="relative">
                      <select
                        className="w-full h-8 text-[10px] p-2 rounded-full  border border-[#453565] text-[#2b73ec] appearance-none"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {doctorcategory && doctorcategory.length > 0 ? (
                          doctorcategory.map((cat) => (
                            <option key={cat.id} value={cat.title}>
                              {cat.title}
                            </option>
                          ))
                        ) : (
                          <option>No categories available</option>
                        )}
                      </select>
                      <span className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <Image
                          className="h-6 w-6"
                          src={
                            "https://res.cloudinary.com/dnckhli5u/image/upload/v1726035881/Icons/yupkmri6egefipsa4bcb.png"
                          }
                          width={1600}
                          height={800}
                          alt=""
                        />
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Mobile Number*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 text-[12px] p-2 placeholder:text-[10px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Mobile Number"
                      value={mobileNumber}
                      maxLength="10"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,10}$/.test(value)) {
                          setMobileNumber(value);
                        }
                      }}
                      required
                    />
                  </div>
               
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Aadhar Card Number*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 text-[12px] p-2 placeholder:text-[10px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
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
                        className="absolute text-[10px] right-1 text-white bg-blue-950 rounded-2xl px-2 !py-1 top-1/2 transform -translate-y-1/2"
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

                
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      City*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 text-[12px] p-2 placeholder:text-[10px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter City Name"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <h1 className="text-[#243460] font-bold text-[10px] ml-4 font-poppins">
                      Pin Code*
                    </h1>
                    <input
                      type="text"
                      className="w-full h-8 text-[12px] p-2 placeholder:text-[10px] placeholder:text-[#2b73ec] border rounded-full border-[#243460]"
                      placeholder="Enter Mobile Number"
                      value={pinCode}
                      onChange={(e) => {
                        // Ensure the value is numeric and the length is less than or equal to 6
                        const value = e.target.value;
                        if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                          setPinCode(value);
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="mx-auto flex items-center justify-center mt-8">
                  <button
                    className="bg-blue-600 rounded-full text-[10px] p-3 shadow-2xl text-white font-bold"
                    type="submit"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="w-full  text-center ">
            {/* <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.reset()}
    >
      <CarouselContent className=" w-full">
        {images.map((image, index) => (
          <CarouselItem key={index} className="w-full ">
            <Image
              src={image.src}
              width={1000}
              height={600}
              className="w-full  h-full rounded-xl "
              alt={`Slide ${index + 1}`}
            />
             <div className="justify-center text-center mt-[-60px]">
          <h1 className="text-[10px] font-cursive text-[#324260] font-extrabold">
            Your Health.. Your Choice..
          </h1>
          <p className="text-[#324260] text-[8px]">
            Access to Good Quality Healthcare on Single Click{" "}
          </p>
        </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel> */}

            {/* <MBanner /> */}
          </div>
        </div>
      </div>

      {showAlert && (
        <div className="fixed left-[50%] rounded-2xl top-[30%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200">
          <Alert>
            <AlertTitle></AlertTitle>
            <AlertDescription>
              <div className="flex flex-col text-center space-y-4">
                <h1 className="text-[#243460] text-[14px] font-extrabold">
                  Thank you for Booking Free Appointment
                </h1>
                <h1 className="text-[#243460] text-[18px] font-extrabold">
                  Aarogya Rakshak will connect you shortly
                </h1>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className=" mb-2">
      <CommonMBanner data={data}/>
      </div>
    </>
  );
};

export default AppointmentClient;
const images = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png",
  },
];
