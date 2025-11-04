"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, MapPin } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MobileEmergencyAmbulanceForm = () => {
  const [showAlert1, setShowAlert1] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [locateme, setLocateme] = useState({ lat: null, lng: null });
  const [pinCode, setpinCode] = useState();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [ambulancecategory, setambulancecategory] = useState("");
  const [preview, setPreview] = useState(null); // Preview for captured image
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create an image preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(null);
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
    formData.append("ambulancecategory", ambulancecategory);

    formData.append("locateme", JSON.stringify(locateme));
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
      {" "}
      <div className="w-full  bg-[#d9d9d9] p-2 border-2 border-[#243460] rounded-[10px] mt-4 md:py-4">
        <div className="text-center">
          <h1 className="text-[22px] font-bold text-[#FF3131]">
            Emergency Ambulance
          </h1>
          <p className="text-[#5271FF] font-medium text-[14px] mt-1">
            24/7 Available Service
          </p>
          <h1 className="text-[#002E6E] text-[14px] mt-1">
            If any accident case, please follow the below protocol to save
            lives.
          </h1>
          <span className="text-[#002E6E] text-[14px] font-semibold block mt-1">
            Aarogya Aadhar is taking document responsibilities*
          </span>
        </div>
        <form onSubmit={handleEmergencySubmit}>
          {" "}
          <div className="w-full mt-4 ">
            <div className="space-y-2 mt-4">
              <div className="space-x-2 flex mt-4">
                <div className="w-full relative">
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full h-8 text-[10px] placeholder:text-white bg-[#2b73ec] p-2 pr-10 rounded-full  border border-[#453565]"
                      placeholder="Enter Email ID"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="absolute text-[10px] right-1 bg-white text-blue-950 rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full h-8 text-[10px] placeholder:text-white bg-[#2b73ec] p-2 pr-10 rounded-full  border border-[#453565]"
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
                      className="absolute text-[10px] right-1 text-blue-950 bg-white rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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

              <div className="space-x-2 flex mt-4 ">
                <div className="w-1/2">
                  <input
                    type="text"
                    className="w-full h-8 p-2 placeholder:text-[10px] text-[10px] placeholder:text-white border placeholder:text-[#ffffffcc] text-white bg-[#5271FF] rounded-full"
                    placeholder="Enter City Name"
                    required
                    value={ambulancecategory}
                    onChange={(e) => setambulancecategory(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    className="w-full h-8 p-2 placeholder:text-[10px] text-[10px] placeholder:text-white border rounded-full border-[#243460] placeholder:text-[#ffffffcc] text-white bg-[#5271FF]"
                    placeholder="Enter Pincode"
                    required
                    value={pinCode}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                        setpinCode(value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between space-x-2">
                {/* Upload Live Photo Section */}
                <div className="flex flex-col  items-center text-center w-1/2">
                  <label className="w-full h-8 px-4 border border-[#243460] bg-[#5271FF] text-white font-bold text-[10px] rounded-full flex items-center justify-center cursor-pointer space-x-2">
                    <Camera className="w-4 h-4 mr-2" /> {/* Camera icon */}
                    {selectedFile ? selectedFile.name : "Upload Live Photo"}
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      required
                      capture="environment" // This enables direct camera access
                    />
                  </label>
                  {preview && (
                    <Image
                      src={preview}
                      alt="Captured"
                      width={100}
                      height={100}
                      className="mt-2 w-[100px] h-[100px] object-cover rounded-xl"
                    />
                  )}
                </div>

                {/* Locate Me Button */}
                <div className="w-1/2">
                  <button
                    onClick={handleLocation}
                    className="w-full h-8 p-2 placeholder:text-[10px] placeholder:text-white border rounded-full border-[#243460] text-[10px] text-white font-bold bg-[#5271FF] flex items-center justify-center cursor-pointer"
                  >
                    <MapPin className="mr-1" />
                    Locate Me
                  </button>
                </div>
              </div>

              <div className="mx-auto flex items-center justify-center mt-2">
                <button
                  type="submit"
                  className="bg-[#5271FF] rounded-full px-3 py-2 text-[11px] shadow-2xl text-white font-bold"
                >
                  Connect Ambulance
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
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

export default MobileEmergencyAmbulanceForm;
