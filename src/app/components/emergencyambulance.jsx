"use client";
import { MapPin } from "lucide-react";
import React, { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Emergencyambulance = () => {
  const [showAlert1, setShowAlert1] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [locateme, setLocateme] = useState({ lat: null, lng: null });
  const [pinCode, setpinCode] = useState();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [ambulancecategory, setambulancecategory] = useState("");
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("Selected file:", file); // Log the selected file
      setSelectedFile(file);
    } else {
      setSelectedFile(null); // Reset if no file is selected
    }
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocateme({ lat: latitude, lng: longitude });
          console.log("Location obtained:", latitude, longitude); // For debugging
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();

    // Check if OTP is verified
    if (!isOtpVerified) {
      toast("Please verify OTP before submitting.");
      return;
    }
    if (!locateme.lat || !locateme.lng) {
      toast("Please retrieve your location before submitting.");
      return;
    }

    // Disable submit button while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", email);
    formData.append("locateme", JSON.stringify(locateme));
    formData.append("ambulancecategory", ambulancecategory);
    formData.append("pinCode", pinCode);

    try {
      const registerRes = await fetch("/api/emergencyambulance", {
        method: "POST",
        body: formData, // No need to stringify form data, just send it as it is
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to book ambulance.");
      }

      // Success: show alert and handle the rest
      setShowAlert1(true);
      setOpen(false); // Close the dialog

      // Set a timer to close the alert after 2 seconds
      setTimeout(() => {
        setShowAlert1(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
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
      const res = await fetch("/api/otps/emergency-ambulance/send-otp", {
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
        "/api/otps/emergency-ambulance/verify-otp",
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
  return (
    <>
      <form
        onSubmit={handleEmergencySubmit}
        className="bg-[#E9E8E9] p-1 rounded-[15px] md:py-2"
      >
        <div className="text-center justify-center   font-poppins mx-auto">
          <h1 className="text-2xl font-bold text-[#FF3131]">
            Emergency Ambulance
          </h1>
          <p className="text-[#5271FF] font-semibold">24/7 Available Service</p>
          <h1 className="text-[#002E6E] italic text-lg">
            If any accident case please follow below
            <br /> protocol and save life.
          </h1>

          <span className="text-[#002E6E] italic text-xl font-bold">
            {" "}
            Aarogya Aadhar is taking document responsibilities*
          </span>
        </div>
        <div className="w-full mt-2">
          <div className="space-y-4 mt-2">
            <div className="flex space-x-4">
              <div className="w-full flex flex-col items-center text-center justify-center">
                <h1 className="text-[#5271FF]  font-poppins font-bold text-xl ml-4">
                  Upload Live Photo*
                </h1>
                <label className="w-auto h-9 text-[12px] px-4 border bg-[#5271FF] text-white font-bold rounded-full appearance-none  flex items-center justify-center cursor-pointer">
                  {selectedFile ? selectedFile.name : "Click Photo"}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-2">
            <div className="flex space-x-4">
              <div className="w-full relative">
                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                  Email ID*
                </h1>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full h-9 text-[12px] p-2 pr-10 lg:pr-20 placeholder:text-white text-white bg-[#5271FF] rounded-full border-[#453565]"
                    placeholder="Enter Email ID"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="absolute right-1 bg-white text-[12px] md:text-[12px] font-poppins text-[#5271Ff] rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                  Enter Email OTP*
                </h1>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full h-9 text-[12px] p-2 pr-10 rounded-full placeholder:text-white text-white bg-[#5271FF] border-[#453565]"
                    placeholder="Enter OTP"
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
                    disabled={isSubmitting}
                    className="absolute right-1 bg-white text-[12px] md:text-[12px] text-[#5271ff] font-poppins rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
          </div>
          <div className="space-y-4 mt-4">
            <div className="space-y-4 mt-4">
              <div className="flex justify-center space-x-4">
                <div className="w-full max-w-xs">
                  <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                    City*
                  </h1>
                  <input
                    type="text"
                    value={ambulancecategory}
                    onChange={(e) => setambulancecategory(e.target.value)}
                    className="w-full h-9 text-[12px] p-2 border placeholder:text-white text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter city "
                    required
                  />
                </div>
                <div className="w-full max-w-xs ">
                  <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                    Pin Code*
                  </h1>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                        setpinCode(value);
                      }
                    }}
                    className="w-full h-9 text-[12px] p-2 border rounded-full placeholder:text-[#FFFFFF] text-white bg-[#5271FF]"
                    placeholder="Enter Pin code"
                    required
                  />
                </div>
                <div className="w-full  pt-5">
                  <button
                    onClick={() => handleLocation(setLocateme)}
                    className="w-full h-9 text-[12px] p-2 border rounded-full appearance-none text-white font-bold bg-[#5271FF] flex items-center justify-center cursor-pointer"
                  >
                    <MapPin className="mr-2" />
                    Locate Me
                  </button>
                  <span className=" ml-6   text-[#ff5e00] text-sm">
                    Click Here
                  </span>
                </div>
              </div>
            </div>

            <div className="mx-auto flex items-center justify-center">
              <button
                className="bg-[#5271FF] rounded-full p-3 shadow-2xl border border-[#243460] text-white font-bold"
                type="submit"
              >
                {isSubmitting ? "Please Wait..." : "Connect Ambulance"}
              </button>
            </div>
          </div>
        </div>
      </form>
      {showAlert1 && (
        <div className="fixed left-[50%]  rounded-2xl top-[30%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200 ">
          <Alert>
            <AlertTitle></AlertTitle>
            <AlertDescription>
              <div className="flex flex-col text-center space-y-2">
                <h1 className="text-[#243460] text-[18px] font-extrabold">
                  Thank you for Saving Life
                </h1>

                <h1 className="text-[#FF5E00] text-[20px] font-extrabold pt-2">
                  Emergency Task Force team will connect you shortly
                </h1>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default Emergencyambulance;
