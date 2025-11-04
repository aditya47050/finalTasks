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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaAmbulance, FaArrowCircleDown } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowDown,
  Ambulance,
  CalendarDays,
  MapPin,
  Check,
  Clock,
  PersonStanding,
} from "lucide-react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import Emergencyambulance from "./emergencyambulance";
import { UploadButton } from "@uploadthing/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
const BookAmbulance = ({
  title,
  design,
  patientdata,
  loggeduserId,
  ambulanceData,
}) => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false); // State to control the dialog
  const [date, setDate] = useState();

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
  const [ambulancetype, setambulancetype] = useState();
  const [ambulancecategory, setambulancecategory] = useState("");
  const [hospitaltype, sethospitaltype] = useState("");

  // New fields
  const [aadharCardImage, setAadharCardImage] = useState(null);
  const [healthcard, setHealthcard] = useState("No");
  const [medicaldoc1, setMedicaldoc1] = useState(null);
  const [medicaldoc2, setMedicaldoc2] = useState(null);
  const [medicaldoc3, setMedicaldoc3] = useState(null);
  const [healthInsurance, setHealthInsurance] = useState("No");
  const [healthInsuranceNumber, setHealthInsuranceNumber] = useState("");
  const [healthInsuranceDocument, setHealthInsuranceDocument] = useState(null);
  const [ayushmancard, setAyushmancard] = useState("No");
  const [ayushmanCardNumber, setAyushmanCardNumber] = useState("");
  const [ayushmanCardFront, setAyushmanCardFront] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [diseaseDetails, setDiseaseDetails] = useState("");

  // Upload states
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
      const verifyRes = await fetch("/api/otps/ambulancebooking/verify-otp", {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!isOtpVerified) {
    //   toast("Please verify OTP before submitting.");
    //   return;
    // }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("gender", gender);
      formData.append("aadharCardNumber", aadharCardNumber);
      formData.append("mobileNumber", mobileNumber);
      formData.append("email", email);
      formData.append("aadharCardImage", aadharCardImage?.url || ""); // Use the URL
      formData.append("healthcard", healthcard);
      formData.append("medicaldoc1", medicaldoc1?.url || ""); // Use the URL
      formData.append("medicaldoc2", medicaldoc2?.url || ""); // Use the URL
      formData.append("medicaldoc3", medicaldoc3?.url || ""); // Use the URL
      formData.append("healthInsurance", healthInsurance);
      formData.append("healthInsuranceNumber", healthInsuranceNumber);
      formData.append(
        "healthInsuranceDocument",
        healthInsuranceDocument?.url || ""
      ); // Use the URL
      formData.append("ayushmancard", ayushmancard);
      formData.append("ayushmanCardNumber", ayushmanCardNumber);
      formData.append("ayushmanCardFront", ayushmanCardFront?.url || ""); // Use the URL
      formData.append("diseaseDetails", diseaseDetails);
      formData.append("bloodGroup", bloodGroup);
      formData.append(
        "ambulancetype",
        ambulanceData?.ambulancetype || ambulancetype
      );
      formData.append(
        "ambulancecategory",
        ambulanceData?.ambulancecategory || ambulancecategory
      );
      formData.append(
        "hospitaltype",
        ambulanceData?.ambulance?.AmbulanceHsp?.categories
          ?.map((cat) => cat?.hspcategory?.title)
          .filter(Boolean)
          .join(", ") || hospitaltype
      );
      formData.append(
        "ambulanceVaichicleId",
        ambulanceData?.id || "Not specified"
      );

      const registerRes = await fetch("/api/bookambulance", {
        method: "POST",
        body: formData,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        const errorMessage = errorData.message || "Failed to Book Ambulance";
        throw new Error(errorMessage);
      }

      setShowAlert(true);
      setOpen(false);
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
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Populate patient data if Aadhar Card Number is found
  useEffect(() => {
    if (aadharCardNumber && patientdata) {
      const patient = patientdata.find(
        (p) => p.aadharCardNumber === aadharCardNumber
      );
      if (patient) {
        setFirstName(patient.firstName || "");
        setMiddleName(patient.middleName || "");
        setLastName(patient.lastName || "");
        setDateOfBirth(patient.dateOfBirth || null);
        setGender(patient.gender || "");
        setMobileNumber(patient.mobile || "");
        setEmail(patient.email || "");
        setBloodGroup(patient.bloodgroup || "");
        setDiseaseDetails(patient.diseaseDetails || "");

        setHealthInsurance(patient.healthInsurance ? "Yes" : "No");
        setAyushmancard(patient.ayushmancard ? "Yes" : "No");
        setHealthcard(patient.healthcard ? "Yes" : "No");

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

        setHealthInsuranceNumber(patient.healthInsuranceNumber || "");
        setAyushmanCardNumber(patient.ayushmanCard || "");
      }
    }
  }, [aadharCardNumber, patientdata]);

  // Function to handle radio button change for Health Card
  const handleHealthCardChange = (e) => {
    const value = e.target.value === "yes";
    setHealthcard(value ? "Yes" : "No");
  };

  // Function to handle radio button change for Health Insurance
  const handleHealthInsuranceChange = (e) => {
    const value = e.target.value === "yes";
    setHealthInsurance(value ? "Yes" : "No");
  };

  // Function to handle radio button change for Ayushman Card
  const handleAyushmanChange = (e) => {
    const value = e.target.value === "yes";
    setAyushmancard(value ? "Yes" : "No");
  };
  const handleUploadComplete = (
    res,
    setDocumentState,
    setLoadingState,
    successMessage
  ) => {
    if (res && res.length > 0) {
      // Update the document state with the uploaded file information
      setDocumentState(res[0]); // Assuming res[0] contains the relevant file data

      // Update the loading state to false
      setLoadingState(false);

      // Optionally, display a success message
      toast(successMessage);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="">
          <div
            className={` ${
              design || "flex items-center p-2  justify-center font-bold  min-[1000px]:text-[12px] min-[1100px]:text-[14px] xl:text-[18px] rounded-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] text-[#243460] hover:from-[#FFDE59] hover:to-[#FF914D]"
            }`}
          >
            <FaAmbulance className="h-5 w-5 min-[1100px]:h-7 min-[1100px]:w-7  bg-blue-600 text-white p-1 rounded-full mr-1" />
            <span className="text-sm">
              {title || "Book Ambulance"}
            </span>
          </div>
        </DialogTrigger>
        <div className=" ">
          <DialogContent className="bg-gray-100 h-[400px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle></DialogTitle>

              <DialogDescription>
                <div className="w-full  flex justify-center font-poppins space-x-4 ">
                  {/* <div className="w-5/12  p-1 rounded-[15px] md:py-2">
                    <Emergencyambulance />
                  </div> */}
                  {/* Second div */}
                  <div className=" bg-gray-100 p-1 rounded-[15px] ">
                    <div className="text-center justify-center mx-auto">
                      <h1 className="text-2xl font-bold text-blue-950">
                        Book Your Ambulance
                      </h1>
                      <p className="text-blue-950 font-semibold">
                        Patient Details
                      </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="w-full mt-4">
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                  disabled={
                                    patientdata &&
                                    !!patientdata.find(
                                      (p) =>
                                        p.aadharCardNumber === aadharCardNumber
                                    )
                                  }
                                />
                              </div>
                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                  disabled={
                                    patientdata &&
                                    !!patientdata.find(
                                      (p) =>
                                        p.aadharCardNumber === aadharCardNumber
                                    )
                                  }
                                />
                              </div>
                            
                            </div>
                          </div>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                disabled={
                                  patientdata &&
                                  !!patientdata.find(
                                    (p) =>
                                      p.aadharCardNumber === aadharCardNumber
                                  )
                                }
                              />
                            </div>
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                  placeholderText="DD/MM/YYYY"
                                  className="border-[1px] border-black bg-transparent rounded-xl pl-4  text-[14px] placeholder:text-black p-2 w-full h-9 pr-20"
                                  disabled={
                                    patientdata &&
                                    !!patientdata.find(
                                      (p) =>
                                        p.aadharCardNumber === aadharCardNumber
                                    )
                                  }
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <CalendarDays className="h-5 w-5" />
                                </span>
                              </div>
                            </div>
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                Gender*
                              </h1>
                              <div className="relative">
                                <Select
                                  value={gender}
                                  onValueChange={setGender}
                                  disabled={
                                    patientdata &&
                                    !!patientdata.find((p) => p.aadharCardNumber === aadharCardNumber)
                                  }
                                >
                                  <SelectTrigger className="w-full h-10 placeholder:text-base px-4 rounded-xl border border-[#453565] bg-transparent text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-300">
                                    <SelectValue placeholder="Select your Gender" />
                                  </SelectTrigger>
                                  <SelectContent className="text-[13px]">
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Transgender</SelectItem>
                                  </SelectContent>
                                </Select>

                              </div>
                            </div>
                          
                          </div>
                        </div>
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                Mobile Number*
                              </h1>
                              <Input
                                type="text"
                                value={mobileNumber}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d{0,10}$/.test(value)) {
                                    setMobileNumber(value);
                                  }
                                }}
                                className="pl-4"
                                placeholder="Enter 10-Digit Mobile Number"
                                required
                                disabled={
                                  patientdata &&
                                  !!patientdata.find(
                                    (p) =>
                                      p.aadharCardNumber === aadharCardNumber
                                  )
                                }
                              />
                            </div>
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                Email ID*
                              </h1>
                              <div className="relative">
                                <Input
                                  type="Email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="pl-4"
                                  placeholder="Enter Email ID"
                                  required
                                  disabled={
                                    patientdata &&
                                    !!patientdata.find(
                                      (p) =>
                                        p.aadharCardNumber === aadharCardNumber
                                    )
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={handleSendOtp}
                                  disabled={
                                    isOtpSent || isSubmitting || isOtpSent
                                  }
                                  className="absolute right-1 bg-[#243460] text-[12px]  font-poppins text-white rounded-xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
                                  className="absolute right-1 bg-[#243460] text-[12px]  text-white font-poppins rounded-xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {!ambulanceData && (
                                <>
                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins mb-2">
                                      Ambulance Type*
                                    </h1>
                                    <div className="relative">
                                      <Select
                                        value={ambulancetype}
                                        onValueChange={setambulancetype}
                                        required
                                      >
                                        <SelectTrigger className="w-full h-10 placeholder:text-base px-4 rounded-xl border border-[#453565] bg-transparent text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-300">
                                          <SelectValue placeholder="Select Ambulance Type" />
                                        </SelectTrigger>
                                        <SelectContent className="text-[13px]">
                                          {["Basic Ambulance",
                                            "O2 Ambulance",
                                            "Without O2 Ambulance",
                                            "Cardiac Ambulance",
                                            "Mobile Equipped Unit",
                                            "Air Ambulance",].map((category, index) => (
                                            <SelectItem key={index} value={category}>
                                              {category}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins mb-2">
                                      Ambulance Category*
                                    </h1>
                                    <div className="relative">
                                      <Select
                                        value={ambulancecategory}
                                        onValueChange={setambulancecategory}
                                        required
                                      >
                                        <SelectTrigger className="w-full h-10 placeholder:text-base px-4 rounded-xl border border-[#453565] bg-transparent text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-300">
                                          <SelectValue placeholder="Select Ambulance Category" />
                                        </SelectTrigger>
                                        <SelectContent className="text-[13px]">
                                          {[
                                            "102 Ambulance",
                                            "108 Ambulance",
                                            "Private Ambulance",
                                            "Hospital Ambulance",
                                            "RED Health Ambulance",
                                            "Medulance Ambulance",
                                            "AmbiPalm Ambulance",
                                            "MedCap Ambulance",
                                            "Ziqitza Ambulance",
                                          ]
                                          .map((category, index) => (
                                            <SelectItem key={index} value={category}>
                                              {category}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins mb-2">
                                      Hospital Type*
                                    </h1>
                                    <div className="relative">
                                      <Select
                                        value={hospitaltype}
                                        onValueChange={sethospitaltype}
                                        required
                                      >
                                        <SelectTrigger className="w-full h-10 placeholder:text-base px-4 rounded-xl border border-[#453565] bg-transparent text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-300">
                                          <SelectValue placeholder="Select Hospital Type" />
                                        </SelectTrigger>
                                        <SelectContent className="text-[13px]">
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
                                            <SelectItem key={index} value={type}>
                                              {type}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* New Fields */}
                          <div className="space-y-4 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                  Blood Group*
                                </h1>
                                <div className="relative">
                                  <Select
                                    value={bloodGroup}
                                    onValueChange={setBloodGroup}
                                    disabled={
                                      patientdata &&
                                      !!patientdata.find((p) => p.aadharCardNumber === aadharCardNumber)
                                    }
                                  >
                                    <SelectTrigger className="w-full h-10 text-[14px] px-4 rounded-xl border border-[#453565]  text-gray-700 bg-transparent shadow-sm focus:ring-2 focus:ring-blue-300">
                                      <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent className="text-[13px]">
                                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                                        <SelectItem key={group} value={group}>
                                          {group}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                      "w-auto bg-transparent text-[10px] text-white font-bold rounded-xl",
                                    container:
                                      "rounded-xl border w-auto  bg-[#243460]",
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
                                    handleUploadError(
                                      error,
                                      setIsUploadingAadhar
                                    )
                                  }
                                  onUploadStart={() =>
                                    handleUploadStart(setIsUploadingAadhar)
                                  }
                                  disabled={
                                    patientdata &&
                                    !!patientdata.find(
                                      (p) =>
                                        p.aadharCardNumber === aadharCardNumber
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {" "}
                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                  Disease Details
                                </h1>
                                <Textarea
                                  value={diseaseDetails}
                                  onChange={(e) =>
                                    setDiseaseDetails(e.target.value)
                                  }
                                  className="w-full h-20 placeholder:text-[14px] text-[14px] p-2 border rounded-xl pl-4 text-gray-700"
                                  placeholder="Enter Disease Details"
                                />
                              </div>
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                  Medical Documents*
                                </h1>
                                {[1, 2, 3].map((docNumber) => (
                                  <div
                                    key={docNumber}
                                    className="w-full relative"
                                  >
                                    <UploadButton
                                      endpoint="fileUploader"
                                      content={{
                                        button({ ready }) {
                                          return (
                                            <div>
                                              {isMedicalDocsUploaded[
                                                docNumber - 1
                                              ] ? (
                                                "Uploaded"
                                              ) : isUploadingMedicalDocs[
                                                  docNumber - 1
                                                ] ? (
                                                "Uploading..."
                                              ) : ready ? (
                                                <>
                                                  Upload Medical Document{" "}
                                                  {docNumber}{" "}
                                                  {docNumber <= 1
                                                    ? "*"
                                                    : "(Optional)"}
                                                </>
                                              ) : (
                                                "Preparing..."
                                              )}
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
                                          "w-auto bg-transparent text-[10px] text-white font-bold rounded-xl",
                                        container:
                                          "rounded-xl border w-auto  bg-[#243460]",
                                        allowedContent: "hidden",
                                      }}
                                      onClientUploadComplete={(res) => {
                                        console.log(
                                          `Upload completed for Document ${docNumber}`,
                                          res
                                        ); // Debugging log
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
                                            newLoadingState[docNumber - 1] =
                                              loading;
                                            setIsUploadingMedicalDocs(
                                              newLoadingState
                                            );
                                          },
                                          `Upload Completed for Document ${docNumber}`
                                        );
                                        const newUploadedState = [
                                          ...isMedicalDocsUploaded,
                                        ];
                                        newUploadedState[docNumber - 1] = true;
                                        setIsMedicalDocsUploaded(
                                          newUploadedState
                                        );
                                        toast(
                                          `Upload Completed for Document ${docNumber}`
                                        ); // Trigger toast notification
                                      }}
                                      onUploadError={(error) =>
                                        handleUploadError(error, (loading) => {
                                          const newLoadingState = [
                                            ...isUploadingMedicalDocs,
                                          ];
                                          newLoadingState[docNumber - 1] =
                                            loading;
                                          setIsUploadingMedicalDocs(
                                            newLoadingState
                                          );
                                        })
                                      }
                                      onUploadStart={() => {
                                        const newLoadingState = [
                                          ...isUploadingMedicalDocs,
                                        ];
                                        newLoadingState[docNumber - 1] = true;
                                        setIsUploadingMedicalDocs(
                                          newLoadingState
                                        );
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                              {healthInsurance === "Yes" && (
                                <>
                                  <div className="w-full">
                                    <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                      Health Insurance Number
                                    </h1>
                                    <Input
                                      type="text"
                                      value={healthInsuranceNumber}
                                      onChange={(e) => {
                                        const val = e.target.value.toUpperCase(); // Convert to uppercase
                                        // Allow only A–Z and 0–9
                                        if (/^[A-Z0-9]*$/.test(val)) {
                                          setHealthInsuranceNumber(val);
                                        }
                                      }}
                                      className=""
                                      placeholder="Enter Health Insurance Number"
                                      disabled={
                                        !!patientdata.find(
                                          (p) => p.aadharCardNumber === aadharCardNumber
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                          "w-auto bg-transparent text-[10px]  text-white font-bold rounded-xl",
                                        container:
                                          "rounded-xl border w-auto bg-[#243460]",
                                        allowedContent: "hidden",
                                      }}
                                      onClientUploadComplete={(res) => {
                                        handleUploadComplete(
                                          res,
                                          setHealthInsuranceDocument,
                                          setIsUploadingHealthInsurance,
                                          "Health Insurance Document Upload Completed"
                                        );
                                        setIsHealthInsuranceDocumentUploaded(
                                          true
                                        );
                                      }}
                                      onUploadError={(error) =>
                                        handleUploadError(
                                          error,
                                          setIsUploadingHealthInsurance
                                        )
                                      }
                                      onUploadStart={() =>
                                        handleUploadStart(
                                          setIsUploadingHealthInsurance
                                        )
                                      }
                                      disabled={
                                        !!patientdata.find(
                                          (p) =>
                                            p.aadharCardNumber ===
                                            aadharCardNumber
                                        )
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                              {ayushmancard === "Yes" && (
                                <>
                                  <div className="w-full">
                                    <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                      Ayushman Card Number*
                                    </h1>
                                    <Input
                                      type="text"
                                      value={ayushmanCardNumber}
                                      onChange={(e) => {
                                        const val = e.target.value.toUpperCase(); // Convert to uppercase
                                        // Allow only A–Z and 0–9
                                        if (/^[A-Z0-9]*$/.test(val)) {
                                          setAyushmanCardNumber(val);
                                        }
                                      }}
                                      className=""
                                      placeholder="Enter Ayushman Card Number"
                                      required
                                      disabled={
                                        !!patientdata.find(
                                          (p) => p.aadharCardNumber === aadharCardNumber
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
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
                                          "w-auto bg-transparent text-[10px]  text-white font-bold rounded-xl",
                                        container:
                                          "rounded-xl border w-auto bg-[#243460]",
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
                                        handleUploadStart(
                                          setIsUploadingAyushmanCard
                                        )
                                      }
                                      disabled={
                                        !!patientdata.find(
                                          (p) =>
                                            p.aadharCardNumber ===
                                            aadharCardNumber
                                        )
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold text-1xl ml-4 font-poppins">
                                  Health Card*
                                </h1>
                                <div className="flex items-center space-x-6 ml-4">
                                  <label className="inline-flex items-center">
                                    <Input
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
                                    <Input
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
                            </div>
                          </div>

                          <div className="mx-auto w-full flex items-center justify-center">
                            <button
                              className="w-full bg-[#5271FF] rounded-xl p-3 shadow-2xl border border-[#243460]  text-white font-bold flex justify-center items-center gap-1 text-center"
                              type="submit"
                            >
                              {isLoading
                                ? "Please Wait"
                                : "  Click Here for Booking"}
                              <span className="bg-white text-[#5271FF] rounded-full  flex items-center justify-center">
                                <Check className="h-4 w-4" />
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div></div>
                  </div>
                </div>
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
                  Thank you for Ambulance Booking
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

export default BookAmbulance;
