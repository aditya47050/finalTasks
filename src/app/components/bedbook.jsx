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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBedPulse } from "react-icons/fa6";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UploadButton } from "@uploadthing/react";

const Bedbook = ({ hospital, title, bedId, loggeduserId, patientdata }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false); // State to control the dialog

  // Backend
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [aadharCardImage, setAadharCardImage] = useState(null); // Front image of the Aadhar card (optional)
  const [healthcard, setHealthcard] = useState("No"); // Health card number of the patient (optional)
  const [medicaldoc1, setMedicaldoc1] = useState(null); // Medical document 1 (optional)
  const [medicaldoc2, setMedicaldoc2] = useState(null); // Medical document 2 (optional)
  const [medicaldoc3, setMedicaldoc3] = useState(null); // Medical document 3 (optional)
  const [healthInsurance, setHealthInsurance] = useState("No"); // Health insurance status
  const [healthInsuranceNumber, setHealthInsuranceNumber] = useState(""); // Health insurance number (optional)
  const [healthInsuranceDocument, setHealthInsuranceDocument] = useState(null);
  const [ayushmancard, setAyushmancard] = useState("No");
  const [ayushmanCardNumber, setAyushmanCardNumber] = useState("");
  const [ayushmanCardFront, setAyushmanCardFront] = useState(null);

  const [showHealthInsuranceInputs, setShowHealthInsuranceInputs] =
    useState(false);
  const [showAyushmanCardInputs, setShowAyushmanCardInputs] = useState(false);
  const [showHealthCardInputs, setShowHealthCardInputs] = useState(false);
  
  const [isUploadingAadhar, setIsUploadingAadhar] = useState(false);
  const [isAadharCardImageUploaded, setIsAadharCardImageUploaded] =
    useState(false);

  const [isUploadingMedicalDocs, setIsUploadingMedicalDocs] = useState(
    Array(3).fill(false)
  );
  const [isMedicalDocsUploaded, setIsMedicalDocsUploaded] = useState(
    Array(3).fill(false)
  );

  const [isUploadingAyushmanCard, setIsUploadingAyushmanCard] = useState(false);
  const [isAyushmanCardFrontUploaded, setIsAyushmanCardFrontUploaded] =
    useState(false);

  const [isUploadingHealthInsurance, setIsUploadingHealthInsurance] =
    useState(false);
  const [
    isHealthInsuranceDocumentUploaded,
    setIsHealthInsuranceDocumentUploaded,
  ] = useState(false);

  const [bloodGroup, setBloodGroup] = useState(""); // State for blood group
  const [diseaseDetails, setDiseaseDetails] = useState(""); // State for disease details

  // Function to handle radio button change for Health Card
  const handleHealthCardChange = (e) => {
    const value = e.target.value === "yes";
    setHealthcard(value ? "Yes" : "No");
    setShowHealthCardInputs(value);
  };

  // Function to handle radio button change
  const handleHealthInsuranceChange = (e) => {
    const value = e.target.value === "yes";
    setHealthInsurance(value ? "Yes" : "No");
    setShowHealthInsuranceInputs(value);
  };

  const handleAyushmanChange = (e) => {
    const value = e.target.value === "yes";
    setAyushmancard(value ? "Yes" : "No");
    setShowAyushmanCardInputs(value);
  };

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

      toast.success("OTP sent to your email");
      setIsOtpSent(true);
    } catch (error) {
      toast.error("User not found.");
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

  const handleUploadStart = (setLoadingState) => {
    setLoadingState(true);
  };

  const handleUploadComplete = (
    res,
    setFileState,
    setLoadingState,
    message
  ) => {
    if (res.length > 0) {
      setFileState(res[0].url);
      toast.success(message);
    }
    setLoadingState(false);
  };

  const handleUploadError = (error, setLoadingState) => {
    toast.error(`ERROR! ${error.message}`);
    setLoadingState(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedAdvanceSearch = Array.isArray(advanceSearch)
      ? advanceSearch
      : [advanceSearch];

    // Check if OTP is verified
    if (!loggeduserId) {
      // User is not logged in, so OTP must be verified
      if (!isOtpVerified) {
        toast.error("Please verify OTP before submitting.");
        return;
      }
    }

    // Check if the first two medical documents are uploaded
    if (!medicaldoc1 || !medicaldoc2) {
      toast.error("Please upload the first two medical documents.");
      return;
    }

    // Check if Ayushman Card details are provided if "Yes" is selected
    if (ayushmancard === "Yes" && (!ayushmanCardNumber || !ayushmanCardFront)) {
      toast.error("Please provide Ayushman Card Number and Front Image.");
      return;
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
          healthcard,
          aadharCardImage,
          medicaldoc1,
          medicaldoc2,
          medicaldoc3,
          healthInsurance,
          healthInsuranceNumber,
          healthInsuranceDocument,
          ayushmancard,
          ayushmanCardNumber,
          ayushmanCardFront,
          bedId: bedId,
          userId: loggeduserId,
          bloodGroup,
          diseaseDetails,
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

  // Populate patient data if Aadhar Card Number is found
  useEffect(() => {
    if (aadharCardNumber && patientdata) {
      const patient = patientdata.find(
        (p) => p.aadharCardNumber === aadharCardNumber
      );
      console.log(patient);
      if (patient) {
        setFirstName(patient.firstName || "");
        setMiddleName(patient.middleName || "");
        setLastName(patient.lastName || "");
        setDateOfBirth(patient.dateOfBirth || null);
        setGender(patient.gender || "");
        setMobileNumber(patient.mobile || "");
        setEmail(patient.email || "");
        setCity(patient.city || "");
        setPinCode(patient.pincode || "");
        setBloodGroup(patient.bloodgroup || ""); // Set blood group
        setDiseaseDetails(patient.diseaseDetails || ""); // Set disease details

        // Convert boolean fields to "Yes" or "No"
        setHealthInsurance(patient.healthInsurance ? "Yes" : "No");
        setAyushmancard(patient.ayushmancard ? "Yes" : "No");
        setHealthcard(patient.healthcard ? "Yes" : "No");

        // Set upload status to "Uploaded" if data is present
        if (patient.healthInsuranceDocument) {
          setHealthInsuranceDocument(patient.healthInsuranceDocument);
          setIsHealthInsuranceDocumentUploaded(true);
        }
        if (patient.ayushmanCardFront) {
          setAyushmanCardFront(patient.ayushmanCardFront);
          setIsAyushmanCardFrontUploaded(true);
        }
        if (patient.aadharCardFront) {
          setAadharCardImage(patient.aadharCardFront);
          setIsAadharCardImageUploaded(true);
        }

        // Set health insurance number and Ayushman card number
        setHealthInsuranceNumber(patient.healthInsuranceNumber || "");
        setAyushmanCardNumber(patient.ayushmanCard || "");
      }
    }
  }, [aadharCardNumber, patientdata]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="hidden md:block">
          <div className={` ${isScrolled ? " " : ""} `}>
            {<span>{title}</span>}
          </div>
        </DialogTrigger>
        <div className="bg-[#E9E8E9] ">
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>

              <DialogDescription className="">
                <div className="text-center justify-center mx-auto">
                  <h1 className="text-2xl font-bold text-blue-950">
                    Hospital Bed Booking
                  </h1>
                  <p className="text-blue-950 font-semibold">Patient Details</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="w-full mt-2 h-[400px] overflow-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
                      <div className="w-full">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Aadhar Card Number*
                        </h1>
                        <input
                          type="text"
                          value={aadharCardNumber}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Ensure the input is numeric and has a maximum length of 12
                            if (value.length <= 12 && /^[0-9]*$/.test(value)) {
                              setAadharCardNumber(value);
                            }
                          }}
                          className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                          placeholder="Enter Aadhar Number"
                          required
                        />
                      </div>
                      <div className="w-full">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          First Name*
                        </h1>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[a-zA-Z\s]*$/.test(value)) {
                              setFirstName(value);
                            }
                          }}
                          className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                          placeholder="Enter Patient First Name"
                          required
                          disabled={!!patientdata.find(
                            (p) => p.aadharCardNumber === aadharCardNumber
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Middle Name
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
                          className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                          placeholder="Enter Patient Middle Name"
                          disabled={!!patientdata.find(
                            (p) => p.aadharCardNumber === aadharCardNumber
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Last Name*
                        </h1>
                        <input
                          value={lastName}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[a-zA-Z\s]*$/.test(value)) {
                              setLastName(value);
                            }
                          }}
                          type="text"
                          className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                          placeholder="Enter Patient Last Name"
                          required
                          disabled={!!patientdata.find(
                            (p) => p.aadharCardNumber === aadharCardNumber
                          )}
                        />
                      </div>
                      <div className="w-full relative">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Date Of Birth*
                        </h1>
                        <div className="relative">
                          <DatePicker
                            selected={dateOfBirth}
                            onChange={(date) => setDateOfBirth(date)}
                            dateFormat="dd/MM/yyyy"
                            showYearDropdown
                            yearDropdownItemNumber={100}
                            scrollableYearDropdown
                            placeholderText="DD/MM/YYYY"
                            maxDate={new Date()} // Disable next years
                            showMonthDropdown // Add this to allow month selection
                            className="border rounded-full p-2 w-full h-9 text-[12px] pr-20"
                            disabled={!!patientdata.find(
                              (p) => p.aadharCardNumber === aadharCardNumber
                            )}
                          />
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <CalendarDays className="h-5 w-5" />
                          </span>
                        </div>
                      </div>
                      <div className="w-full relative">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins ">
                          Gender*
                        </h1>
                        <div className="relative">
                          <select
                            className="w-full h-9 text-[12px] p-2 text-gray-400 space-y-3 rounded-full border-[#453565] appearance-none"
                            required
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            disabled={!!patientdata.find(
                              (p) => p.aadharCardNumber === aadharCardNumber
                            )}
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
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Blood Group*
                        </h1>
                        <div className="relative">
                          <select
                            className="w-full h-9 text-[12px] p-2 text-gray-400 space-y-3 rounded-full border-[#453565] appearance-none"
                            required
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            disabled={!!patientdata.find(
                              (p) => p.aadharCardNumber === aadharCardNumber
                            )}
                          >
                            <option value="">Select Blood Group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                              (group, index) => (
                                <option key={index} value={group} className="text-black">
                                  {group}
                                </option>
                              )
                            )}
                          </select>
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Mobile Number*
                        </h1>
                        <input
                          type="text"
                          value={mobileNumber}
                          maxLength="10"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                              setMobileNumber(value);
                            }
                          }}
                          className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                          placeholder="Enter Mobile Number"
                          required
                          disabled={!!patientdata.find(
                            (p) => p.aadharCardNumber === aadharCardNumber
                          )}
                        />
                      </div>
                      {!loggeduserId && (
                        <>
                          <div className="w-full relative">
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Email ID*
                            </h1>
                            <div className="relative">
                              <input
                                type="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-9 placeholder:text-[12px] p-2 pr-10 lg:pr-20 rounded-full border-[#453565]"
                                placeholder="Enter Email ID"
                                required
                                disabled={!!patientdata.find(
                                  (p) => p.aadharCardNumber === aadharCardNumber
                                )}
                              />
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                className="absolute right-1 bg-[#243460] text-[12px] md:text-[12px] font-poppins text-white rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Enter Email ID OTP*
                            </h1>
                            <div className="relative">
                              <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  // Allow only numbers and limit to 6 digits
                                  if (/^\d{0,6}$/.test(inputValue)) {
                                    setOtp(inputValue);
                                  }
                                }}
                                className="w-full h-9 placeholder:text-[12px] p-2 pr-10 rounded-full border-[#453565]"
                                placeholder="Enter OTP"
                                required
                              />
                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={isSubmitting}
                                className="absolute right-1 bg-[#243460] text-[12px] md:text-[12px] text-white font-poppins rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                              >
                                {isLoading && isOtpSent && !isOtpVerified
                                  ? "wait!"
                                  : isOtpVerified
                                  ? "Verified"
                                  : "Verify OTP"}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                      {!loggeduserId && !bedId && (
                        <>
                          <div className="w-full relative">
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins ">
                              Hospital Type*
                            </h1>
                            <div className="relative">
                              <select
                                className="w-full h-9 placeholder:text-[12px] p-2 text-gray-400 space-y-3 text-[12px]  rounded-full border-[#453565] appearance-none"
                                required
                                value={hospitalType}
                                onChange={(e) =>
                                  sethospitalType(e.target.value)
                                }
                              >
                                <option value="">Select Hospital Type</option>
                                {[
                                  "Goverment Hospitals",
                                  "Private Hospitals",
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
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins ">
                              Bed Category*
                            </h1>
                            <div className="relative">
                              <select
                                className="w-full h-9 placeholder:text-[12px] p-2 text-gray-400 space-y-3 text-[12px]  rounded-full border-[#453565] appearance-none"
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
                                  <option
                                    key={index}
                                    className="text-black"
                                    value={type}
                                  >
                                    {type}
                                  </option>
                                ))}
                              </select>
                              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Advanced Search*
                            </h1>

                            {/* Clickable Select Box */}
                            <div
                              className="w-full xl:h-9 md:h-8 h-7 placeholder:text-[12px] bg-white p-0 xl:text-[14px] md:text-[11px] text-[10px] text-gray-400 rounded-full pl-2 flex items-center justify-between cursor-pointer"
                              onClick={toggleDropdown}
                            >
                              {/* Display Selected Items */}
                              <div className="flex-1 max-h-8  placeholder:text-[12px] overflow-y-auto flex flex-wrap items-center gap-1 text-black">
                                {advanceSearch.length > 0 ? (
                                  advanceSearch.map((item, index) => (
                                    <span
                                      key={index}
                                      className="bg-gray-200 text-black px-2 py-1 rounded-md text-xs "
                                    >
                                      {item}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-[12px]">
                                    Select Hospitals
                                  </span>
                                )}
                              </div>
                              {/* Dropdown Arrow */}
                              <span className="pr-2">
                                {isDropdownOpen ? (
                                  <Image
                                    className="h-6 w-6"
                                    src={
                                      "https://res.cloudinary.com/dnckhli5u/image/upload/v1726035881/Icons/yupkmri6egefipsa4bcb.png"
                                    }
                                    width={1600}
                                    height={800}
                                    alt=""
                                  />
                                ) : (
                                  <Image
                                    className="h-6 w-6"
                                    src={
                                      "https://res.cloudinary.com/dnckhli5u/image/upload/v1726035881/Icons/yupkmri6egefipsa4bcb.png"
                                    }
                                    width={1600}
                                    height={800}
                                    alt=""
                                  />
                                )}
                              </span>
                            </div>

                            {/* Dropdown with Checkboxes */}
                            {isDropdownOpen && (
                              <div className="absolute w-full max-h-40 overflow-y-auto bg-white border border-[#243460] mt-1 rounded-xl shadow-lg z-50">
                                {/* Selected Heading */}
                                {advanceSearch.length > 0 && (
                                  <div className="p-2 border-b border-gray-300 bg-gray-100">
                                    <h2 className="text-sm font-semibold text-[#243460]">
                                      Selected
                                    </h2>
                                    <ul className="text-xs text-black">
                                      {advanceSearch.map((spec, index) => (
                                        <li key={index} className="py-1">
                                          {spec}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Hospital Type Checkboxes */}
                                <div className="p-0">
                                  {hospitalOptions.map((option, index) => (
                                    <label
                                      key={index}
                                      className="flex items-center px-3 py-1 text-xs font-poppins hover:bg-gray-200 cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        value={option}
                                        checked={advanceSearch.includes(option)}
                                        onChange={handleMultiCheckboxChange}
                                        className="mr-2"
                                      />
                                      <span className="text-black">
                                        {option}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                      {!loggeduserId && !bedId && (
                        <div className="w-full">
                          <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                            Hospital Name*
                          </h1>
                          <input
                            type="text"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                            placeholder="Enter Hospital Name"
                            required
                          />
                        </div>
                      )}
                      <div className="w-full">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          City*
                        </h1>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                          placeholder="Enter City Name"
                          required
                        />
                      </div>
                      <div className="w-full">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
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
                          className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                          placeholder="Enter Area Pincode"
                          required
                        />
                      </div>
                      <div className="w-full relative">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Health Insurance*
                        </h1>
                        <div className="flex items-center space-x-6 ml-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="HealthInsurance"
                              value="yes"
                              checked={healthInsurance === "Yes"}
                              onChange={handleHealthInsuranceChange}
                              className="form-radio h-4 w-4 text-[#243460] border-gray-300"
                            />
                            <span className="ml-2 text-[#243460] font-bold text-[14px]">
                              Yes
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="HealthInsurance"
                              value="no"
                              checked={healthInsurance === "No"}
                              onChange={handleHealthInsuranceChange}
                              className="form-radio h-4 w-4 text-[#243460] border-gray-300"
                            />
                            <span className="ml-2 text-[#243460] font-bold text-[14px]">
                              No
                            </span>
                          </label>
                        </div>
                      </div>
                      {showHealthInsuranceInputs && (
                        <>
                          <div className="w-full">
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Health Insurance Number
                            </h1>
                            <input
                              type="text"
                              value={healthInsuranceNumber}
                              onChange={(e) =>
                                setHealthInsuranceNumber(e.target.value)
                              }
                              className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                              placeholder="Enter Health Insurance Number"
                            />
                          </div>
                          <div className="w-full relative">
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Health Insurance Document
                            </h1>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {isHealthInsuranceDocumentUploaded
                                        ? "Uploaded"
                                        : isUploadingHealthInsurance
                                        ? "Uploading..."
                                        : ready
                                        ? "Upload"
                                        : "Preparing..."}
                                    </div>
                                  );
                                },
                                allowedContent({
                                  ready,
                                  fileTypes,
                                  isUploading,
                                }) {
                                  if (!ready)
                                    return "Checking allowed files...";
                                  if (isUploading)
                                    return "Uploading your files...";
                                  return `Allowed file types: ${fileTypes.join(
                                    ", "
                                  )}`;
                                },
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-[10px]  text-white font-bold rounded-full",
                                container:
                                  "rounded-full border w-auto bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onClientUploadComplete={(res) => {
                                handleUploadComplete(
                                  res,
                                  setHealthInsuranceDocument,
                                  setIsUploadingHealthInsurance,
                                  "Health Insurance Document Upload Completed"
                                );
                                setIsHealthInsuranceDocumentUploaded(true);
                              }}
                              onUploadError={(error) =>
                                handleUploadError(
                                  error,
                                  setIsUploadingHealthInsurance
                                )
                              }
                              onUploadStart={() =>
                                handleUploadStart(setIsUploadingHealthInsurance)
                              }
                            />
                          </div>
                        </>
                      )}
                      <div className="w-full relative">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Ayushman Card*
                        </h1>
                        <div className="flex items-center space-x-6 ml-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="Ayushman"
                              value="yes"
                              checked={ayushmancard === "Yes"}
                              onChange={handleAyushmanChange}
                              className="form-radio h-4 w-4 text-[#243460] border-gray-300"
                            />
                            <span className="ml-2 text-[#243460] font-bold text-[14px]">
                              Yes
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="Ayushman"
                              value="no"
                              checked={ayushmancard === "No"}
                              onChange={handleAyushmanChange}
                              className="form-radio h-4 w-4 text-[#243460] border-gray-300"
                            />
                            <span className="ml-2 text-[#243460] font-bold text-[14px]">
                              No
                            </span>
                          </label>
                        </div>
                      </div>
                      {showAyushmanCardInputs && (
                        <>
                          <div className="w-full">
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Ayushman Card Number*
                            </h1>
                            <input
                              type="text"
                              value={ayushmanCardNumber}
                              onChange={(e) =>
                                setAyushmanCardNumber(e.target.value)
                              }
                              className="w-full h-9 placeholder:text-[12px] p-2 border rounded-full"
                              placeholder="Enter Ayushman Card Number"
                              required
                            />
                          </div>
                          <div className="w-full relative">
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Ayushman Card Front*
                            </h1>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {isAyushmanCardFrontUploaded
                                        ? "Uploaded"
                                        : isUploadingAyushmanCard
                                        ? "Uploading..."
                                        : ready
                                        ? "Upload"
                                        : "Preparing..."}
                                    </div>
                                  );
                                },
                                allowedContent({
                                  ready,
                                  fileTypes,
                                  isUploading,
                                }) {
                                  if (!ready)
                                    return "Checking allowed files...";
                                  if (isUploading)
                                    return "Uploading your files...";
                                  return `Allowed file types: ${fileTypes.join(
                                    ", "
                                  )}`;
                                },
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-[10px]  text-white font-bold rounded-full",
                                container:
                                  "rounded-full border w-auto bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onClientUploadComplete={(res) => {
                                handleUploadComplete(
                                  res,
                                  setAyushmanCardFront,
                                  setIsUploadingAyushmanCard,
                                  "Ayushman Card Front Upload Completed"
                                );
                                setIsAyushmanCardFrontUploaded(true);
                              }}
                              onUploadError={(error) =>
                                handleUploadError(
                                  error,
                                  setIsUploadingAyushmanCard
                                )
                              }
                              onUploadStart={() =>
                                handleUploadStart(setIsUploadingAyushmanCard)
                              }
                            />
                          </div>
                        </>
                      )}
                      <div className="w-full relative">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Aadhar Card Image*
                        </h1>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {isAadharCardImageUploaded
                                    ? "Uploaded"
                                    : isUploadingAadhar
                                    ? "Uploading..."
                                    : ready
                                    ? "Upload"
                                    : "Preparing..."}
                                </div>
                              );
                            },
                            allowedContent({ ready, fileTypes, isUploading }) {
                              if (!ready) return "Checking allowed files...";
                              if (isUploading) return "Uploading your files...";
                              return `Allowed file types: ${fileTypes.join(
                                ", "
                              )}`;
                            },
                          }}
                          appearance={{
                            button:
                              "w-auto bg-transparent text-[10px] text-white font-bold rounded-full",
                            container:
                              "rounded-full border w-auto  bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onClientUploadComplete={(res) => {
                            handleUploadComplete(
                              res,
                              setAadharCardImage,
                              setIsUploadingAadhar,
                              "Aadhar Card Image Upload Completed"
                            );
                            setIsAadharCardImageUploaded(true);
                          }}
                          onUploadError={(error) =>
                            handleUploadError(error, setIsUploadingAadhar)
                          }
                          onUploadStart={() =>
                            handleUploadStart(setIsUploadingAadhar)
                          }
                        />
                      </div>
                      <div className="w-full relative">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Medical Documents*
                        </h1>
                        {[1, 2, 3].map((docNumber) => (
                          <div key={docNumber} className="w-full relative">
                            <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                              Upload Medical Document {docNumber}{" "}
                              {docNumber <= 2 ? "*" : "(Optional)"}
                            </h1>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {isMedicalDocsUploaded[docNumber - 1]
                                        ? "Uploaded"
                                        : isUploadingMedicalDocs[docNumber - 1]
                                        ? "Uploading..."
                                        : ready
                                        ? "Upload"
                                        : "Preparing..."}
                                    </div>
                                  );
                                },
                                allowedContent({
                                  ready,
                                  fileTypes,
                                  isUploading,
                                }) {
                                  if (!ready)
                                    return "Checking allowed files...";
                                  if (isUploading)
                                    return "Uploading your files...";
                                  return `Allowed file types: ${fileTypes.join(
                                    ", "
                                  )}`;
                                },
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-[10px] text-white font-bold rounded-full",
                                container:
                                  "rounded-full border w-auto  bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onClientUploadComplete={(res) => {
                                const setDocState = [
                                  setMedicaldoc1,
                                  setMedicaldoc2,
                                  setMedicaldoc3,
                                ][docNumber - 1];
                                handleUploadComplete(
                                  res,
                                  setDocState,
                                  (loading) => {
                                    const newLoadingState = [
                                      ...isUploadingMedicalDocs,
                                    ];
                                    newLoadingState[docNumber - 1] = loading;
                                    setIsUploadingMedicalDocs(newLoadingState);
                                  },
                                  `Upload Completed for Document ${docNumber}`
                                );
                                const newUploadedState = [
                                  ...isMedicalDocsUploaded,
                                ];
                                newUploadedState[docNumber - 1] = true;
                                setIsMedicalDocsUploaded(newUploadedState);
                              }}
                              onUploadError={(error) =>
                                handleUploadError(error, (loading) => {
                                  const newLoadingState = [
                                    ...isUploadingMedicalDocs,
                                  ];
                                  newLoadingState[docNumber - 1] = loading;
                                  setIsUploadingMedicalDocs(newLoadingState);
                                })
                              }
                              onUploadStart={() => {
                                const newLoadingState = [
                                  ...isUploadingMedicalDocs,
                                ];
                                newLoadingState[docNumber - 1] = true;
                                setIsUploadingMedicalDocs(newLoadingState);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="w-full relative">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Health Card*
                        </h1>
                        <div className="flex items-center space-x-6 ml-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="HealthCard"
                              value="yes"
                              checked={healthcard === "Yes"}
                              onChange={handleHealthCardChange}
                              className="form-radio h-4 w-4 text-[#243460] border-gray-300"
                            />
                            <span className="ml-2 text-[#243460] font-bold text-[14px]">
                              Yes
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="HealthCard"
                              value="no"
                              checked={healthcard === "No"}
                              onChange={handleHealthCardChange}
                              className="form-radio h-4 w-4 text-[#243460] border-gray-300"
                            />
                            <span className="ml-2 text-[#243460] font-bold text-[14px]">
                              No
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="w-full">
                        <h1 className="text-[#FF5E00] font-bold text-[14px] ml-4 font-poppins">
                          Disease Details
                        </h1>
                        <textarea
                          value={diseaseDetails}
                          onChange={(e) => setDiseaseDetails(e.target.value)}
                          className="w-full h-20 placeholder:text-[12px] p-2 border rounded-xl"
                          placeholder="Enter Disease Details"
                         
                        />
                      </div>
                    </div>
                    <div className="mx-auto mt-2 flex items-center justify-center">
                      {" "}
                      <button
                        className="bg-blue-600 rounded-full p-3 shadow-2xl border border-[#243460] text-white font-bold"
                        type="submit"
                      >
                        {
                          isLoading ? "Confirming" : "Confirm Bed Booking"
                        }
                      </button>
                    </div>
                  </div>{" "}
                </form>

                <div></div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </div>
      </Dialog>
      {showAlert && (
        <div className="fixed left-[50%] rounded-2xl top-[30%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[#E9E8E9] p-6 shadow-lg duration-200 ">
          <Alert>
            <AlertTitle></AlertTitle>
            <AlertDescription>
              <div className="flex flex-col text-center space-y-4">
                <h1 className="text-[#243460] text-[18px] font-extrabold">
                  Thank you for Generate Hospital Bed Booking
                </h1>
                <h1 className="text-[#FF5E00] text-[25px] font-extrabold">
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

export default Bedbook;