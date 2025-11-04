"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiDroplet,
  FiHeart,
  FiGlobe,
  FiPhone,
  FiCreditCard,
  FiFile,
  FiList,
  FiBriefcase,
  FiInfo,
  FiBookOpen,
} from "react-icons/fi";
import { CalendarDays, FileCheck2, Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import { Button } from "@/components/ui/button";

const ComprehensiveEsevaPatientRegister = ({
  states,
  districts,
  subDistricts,
  esevaId,
  subAdminId,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const casteOptions = [
    "SC - SC & SC converts to Budhhism",
    "ST - ST Incl those living outside specified areas",
    "OBC - Other Backward Class",
    "SBC - Special Backward Class",
    "VJ - Vimukta Jati /Denotified Tribes",
    "NT-B - Nomadic Tribes - B",
    "NT-C - Dhangar - (Nomadic Tribes-C)",
    "NT-D - Vanjari - (Nomadic Tribes-D)",
    "OPEN - General Caste"
  ];

  const casteOptionsByReligion = {
    hinduism: casteOptions,
    islam: casteOptions,
    christianity: casteOptions,
    sikhism: casteOptions,
    buddhism: casteOptions,
    jainism: casteOptions,
    parsi: casteOptions,
    jews: casteOptions,
    other: casteOptions
  };
  // Form state - matching the patient profile structure
  const [formData, setFormData] = useState({
    // Basic Information
    email: "",
    mobile: "",
    pincode: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: null,
    gender: "",
    maritalStatus: "",
    religion: "",
    alternateMobile: "",
    presentAddress: "",
    permanentAddress:"",
    city: "",
    state: "",
    district: "",
    taluka: "",
    bloodgroup: "",
    educationlevel: "",
    occupation: "",
    caste: "",
    ekycdoc: "",
    form: "",
    // Document Information
    aadharCardNumber: "",
    aadharCardFront: "",
    aadharCardBack: "",
    passportPhoto: "",
    // Health Cards
    abhacard: false,
    abhaCardNumber: "",
    abhaCardFront: "",
    healthInsurance: false,
    healthInsuranceNumber: "",
    healthInsuranceDocument: "",
    provider: "",
    coverage: "",
    copay: "",
    ayushmancard: false,
    ayushmanCard: "",
    ayushmanCardFront: "",
    rationcard: false,
    rationCardNumber: "",
    rationcardtype: "",
    rationCardFront: "",
    rationCardBack: "",

    // Other preferences
    organDonation: false,

    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    cancelledCheque: "",
    micrCode: "",

    // Income Information
    income: false,
    incomeCertificateimg: "",
    incomeCertificateNo: "",
    incomerange: { lakh: "", thousand: "" },

    // PAN Card
    hasPanCard: false,
    panCardNumber: "",
    panCard: "",

    // Contact Person
    contactPersonName: "",
    contactPersonRelation: "",
    contactmanaadharNumber: "",

    // Company Information
    isCompanyRegistered: false,
    companyRegistrationNo: "",
    employeeIdCard: "",

    // Password
    password: "",
    confirmPassword: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [uploadLoading, setUploadLoading] = useState({
    aadharCardFront: false,
    aadharCardBack: false,
    abhaCardFront: false,
    healthInsuranceDocument: false,
    ayushmanCardFront: false,
    rationCardFront: false,
    ekycdoc: false,
    cancelledCheque: false,
    incomeCertificateimg: false,
    panCard: false,
    employeeIdCard: false,
    form: false,
  });
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [usePermanentAddress, setUsePermanentAddress] = useState(false);

    // Handle checkbox change
    const handlePermanentAddressCheckbox = (event) => {
      const isChecked = event.target.checked;
      setUsePermanentAddress(isChecked);
    
      if (isChecked) {
        // Prefill permanentAddress with presentAddress
        setFormData((prevData) => ({
          ...prevData,
          permanentAddress: prevData.presentAddress,
        }));
      } else {
        // Clear permanentAddress when unchecked
        setFormData((prevData) => ({
          ...prevData,
          permanentAddress: "",
        }));
      }
    };

  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
    } finally {
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (!response.ok) throw new Error("Failed to verify OTP");

      toast.success("OTP verified successfully");
      setOtpVerified(true);
    } catch (error) {
      toast.error("Error verifying OTP: " + error.message);
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };
  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };
  const stepTitles = [
    "Personal Information",
    "Documents & Health Cards",
    "Bank & Additional Details",
    "Security & Verification",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle income range updates
    if (name === "incomeinlakh" || name === "incomeinthousand") {
      setFormData((prev) => ({
        ...prev,
        incomerange: {
          ...prev.incomerange,
          [name === "incomeinlakh" ? "lakh" : "thousand"]: value,
        },
      }));
      return;
    }
    if (name === "religion") {
      setFormData((prev) => ({
        ...prev,
        religion: value,
        caste: "",
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      const selectedState = states.find((state) => state.stateName === value);
      const stateDistricts = districts.filter(
        (district) => district.stateId === selectedState?.id
      );
      setFilteredDistricts(stateDistricts);
      setFilteredSubDistricts([]);
      setFormData((prev) => ({
        ...prev,
        district: "",
        taluka: "",
      }));
    }

    if (name === "district") {
      const selectedDistrict = districts.find(
        (district) => district.district === value
      );
      const districtSubDistricts = subDistricts.filter(
        (subDistrict) => subDistrict.districtId === selectedDistrict?.id
      );
      setFilteredSubDistricts(districtSubDistricts);
      setFormData((prev) => ({
        ...prev,
        taluka: "",
      }));
    }
  };

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: date,
      }));
    } else {
      toast.error("Please select a valid date.");
    }
  };

  const setFieldLoading = (field, value) => {
    setUploadLoading((prev) => ({ ...prev, [field]: value }));
  };

  // Boolean field handlers
  const handleAbhaChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      abhacard: isYes,
      ...(isYes ? {} : { abhaCardNumber: "", abhaCardFront: "" }),
    }));
  };

  const handleHealthInsuranceChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      healthInsurance: isYes,
      ...(isYes
        ? {}
        : {
          healthInsuranceNumber: "",
          healthInsuranceDocument: "",
          provider: "",
          copay: "",
          coverage: "",
        }),
    }));
  };

  const handleAyushmanChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      ayushmancard: isYes,
      ...(isYes ? {} : { ayushmanCard: "", ayushmanCardFront: "" }),
    }));
  };

  const handleRationChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      rationcard: isYes,
      ...(isYes
        ? {}
        : { rationcardtype: "", rationCardNumber: "", rationCardFront: "" }),
    }));
  };

  const handleOrganChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      organDonation: isYes,
    }));
  };

  const handleIncomeChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      income: isYes,
      ...(isYes
        ? {}
        : {
          incomeCertificateNo: "",
          incomeCertificateimg: "",
          incomerange: { lakh: "", thousand: "" },
        }),
    }));
  };

  const handlePancardChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      hasPanCard: isYes,
      ...(isYes ? {} : { panCardNumber: "", panCard: "" }),
    }));
  };

  const handleCompanyChange = (e) => {
    const isYes = e.target.value === "yes";
    setFormData((prev) => ({
      ...prev,
      isCompanyRegistered: isYes,
      ...(isYes ? {} : { companyRegistrationNo: "", employeeIdCard: "" }),
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateAadhar = (aadhar) => {
    return /^\d{12}$/.test(aadhar);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [userData, setUserData] = useState(); // State to store user data

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprehensive validation
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify your email with OTP before submitting.");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    if (formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (formData.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!validateAadhar(formData.aadharCardNumber)) {
      toast.error("Please enter a valid 12-digit Aadhar number.");
      return;
    }

    // Validate conditional fields
    if (
      formData.abhacard &&
      (!formData.abhaCardNumber || !formData.abhaCardFront)
    ) {
      toast.error("Please fill ABHA card details.");
      return;
    }

    if (
      formData.healthInsurance &&
      (!formData.healthInsuranceNumber || !formData.healthInsuranceDocument)
    ) {
      toast.error("Please fill health insurance details.");
      return;
    }

    if (
      formData.ayushmancard &&
      (!formData.ayushmanCard || !formData.ayushmanCardFront)
    ) {
      toast.error("Please fill Ayushman card details.");
      return;
    }

    if (
      formData.rationcard &&
      (!formData.rationCardNumber ||
        !formData.rationCardFront ||
        !formData.rationcardtype)
    ) {
      toast.error("Please fill ration card details.");
      return;
    }

    if (formData.hasPanCard && (!formData.panCardNumber || !formData.panCard)) {
      toast.error("Please fill PAN card details.");
      return;
    }

    if (
      formData.income &&
      (!formData.incomeCertificateNo || !formData.incomeCertificateimg)
    ) {
      toast.error("Please fill income certificate details.");
      return;
    }

    if (
      formData.isCompanyRegistered &&
      (!formData.companyRegistrationNo || !formData.employeeIdCard)
    ) {
      toast.error("Please fill company registration details.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/e-seva/patient-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          esevaId,
          subAdminId,
          dateOfBirth: formData.dateOfBirth?.toISOString(),
          incomerange: JSON.stringify(formData.incomerange),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register patient");
      }

      const data = await response.json();

      toast.success("Patient registered successfully!");
      router.push(`/e-seva/dashboard/view-patients/${data.patient.id}`);
    } catch (error) {
      toast.error("Registration failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#243460] mb-2">
            Patient Registration
          </h1>
          <p className="text-[#5271FF] text-lg">
            Register a new patient through E-Seva with complete details
          </p>
        </div>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i + 1 <= currentStep
                      ? "bg-[#5271FF] text-white"
                      : "bg-white text-[#5271FF] border-2 border-[#5271FF]"
                    }`}
                >
                  {i + 1 < currentStep ? <FiCheck /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${i + 1 < currentStep ? "bg-[#5271FF]" : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-[#5271FF]">
              {stepTitles[currentStep - 1]}
            </h2>
          </div>
        </div>
        {/* Main Card */}{" "}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Basic Info Row 1 */}
                <div
                  className={`grid gap-6 ${otpSent ? "md:grid-cols-4" : "md:grid-cols-3"
                    }`}
                >
                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiPhone className="text-[#5271FF]" />
                      Mobile Number*
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        handleChange({ target: { name: "mobile", value } });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Mobile Number"
                      required
                    />
                  </div>

                  {/* Email + Send OTP */}
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiMail className="text-[#5271FF]" />
                      Email ID*
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        placeholder="Enter Email ID"
                        required
                      />
                      <Button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpSent || sendOtpLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                      >
                        {sendOtpLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" /> Sending...
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* OTP + Verify Button (only if OTP is sent) */}
                  {otpSent && (
                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold flex items-center gap-2">
                        <FiLock className="text-[#5271FF]" />
                        Enter OTP
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter OTP"
                          required
                        />
                        <Button
                          type="button"
                          onClick={verifyOtp}
                          disabled={otpVerified}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                        >
                          {verifyOtpLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="animate-spin h-4 w-4" /> Verifying...
                            </span>
                          ) : (
                            "Verify OTP"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Pincode */}
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiMapPin className="text-[#5271FF]" />
                      Pin Code*
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        handleChange({ target: { name: "pincode", value } });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Pin Code"
                      required
                    />
                  </div>
                </div>

                {/* Name Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiUser className="text-[#5271FF]" />
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleChange({
                          target: { name: "firstName", value },
                        });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter First Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiUser className="text-[#5271FF]" />
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleChange({
                          target: { name: "middleName", value },
                        });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Middle Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiUser className="text-[#5271FF]" />
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleChange({ target: { name: "lastName", value } });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Last Name"
                      required
                    />
                  </div>
                </div>

                {/* DOB, Gender, Blood Group Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiCalendar className="text-[#5271FF]" />
                      Date Of Birth*
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={formData.dateOfBirth}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        yearDropdownItemNumber={100}
                        scrollableYearDropdown
                        maxDate={new Date()}
                        showMonthDropdown
                        placeholderText="DD/MM/YYYY"
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiUser className="text-[#5271FF]" />
                      Gender*
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiDroplet className="text-[#5271FF]" />
                      Blood Group*
                    </label>
                    <div className="relative">
                      <select
                        name="bloodgroup"
                        value={formData.bloodgroup}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Marital Status, Religion, Alternate Mobile */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiHeart className="text-[#5271FF]" />
                      Marital Status*
                    </label>
                    <div className="relative">
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        required
                      >
                        <option value="">Select Marital Status</option>
                        <option value="unmarried">Unmarried</option>
                        <option value="married">Married</option>
                        <option value="single">Single</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiGlobe className="text-[#5271FF]" />
                      Religion*
                    </label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select Religion</option>
                      {Object.keys(casteOptionsByReligion).map((religion) => (
                        <option key={religion} value={religion}>
                          {religion.charAt(0).toUpperCase() +
                            religion.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Caste Dropdown */}
                  {formData.religion && (
                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold flex items-center gap-2">
                        Caste*
                      </label>
                      <select
                        name="caste"
                        value={formData.caste}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        required
                      >
                        <option value="">Select Caste</option>
                        {(
                          casteOptionsByReligion[formData.religion] || []
                        ).map((caste) => (
                          <option key={caste} value={caste}>
                            {caste}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiPhone className="text-[#5271FF]" />
                      Alternate Mobile Number
                    </label>
                    <input
                      type="text"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        handleChange({
                          target: { name: "alternateMobile", value },
                        });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Alternate Mobile Number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiList className="text-[#5271FF]" />
                      Education Level*
                    </label>
                    <select
                      name="educationlevel"
                      value={formData.educationlevel}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select your Education Level</option>
                      <option value="no_education">No Education</option>
                      <option value="primary_school">Primary School</option>
                      <option value="secondary_school">
                        Secondary School
                      </option>
                      <option value="high_school">High School</option>
                      <option value="associate_degree">
                        Associate Degree
                      </option>
                      <option value="bachelor_degree">
                        {"Bachelor's"} Degree
                      </option>
                      <option value="master_degree">
                        {"Master's"} Degree
                      </option>
                      <option value="professional_degree">
                        Professional Degree (e.g., JD, MD)
                      </option>
                      <option value="doctorate_degree">
                        Doctorate (PhD)
                      </option>
                      <option value="diploma_certificate">
                        Diploma/Certificate
                      </option>
                      <option value="some_college_no_degree">
                        Some College, No Degree
                      </option>
                      <option value="vocational_training">
                        Vocational Training
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiBriefcase className="text-[#5271FF]" />
                      Occupation*
                    </label>
                    <select
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select your Occupation</option>
                      <option value="employed_full_time">
                        Employed Full-Time
                      </option>
                      <option value="employed_part_time">
                        Employed Part-Time
                      </option>
                      <option value="self_employed">Self-Employed</option>
                      <option value="freelancer_contract">
                        Freelancer / Contractor
                      </option>
                      <option value="unemployed_looking">
                        Unemployed - Looking for Work
                      </option>
                      <option value="unemployed_not_looking">
                        Unemployed - Not Looking
                      </option>
                      <option value="student">Student</option>
                      <option value="homemaker">Homemaker</option>
                      <option value="retired">Retired</option>
                      <option value="unable_to_work">Unable to Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Address Row */}
                <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
  <label className="text-[#243460] font-semibold flex items-center gap-2">
    <FiMapPin className="text-[#5271FF]" />
    Present Address*
  </label>
  <input
    type="text"
    name="presentAddress"
    value={formData.presentAddress}
    onChange={handleChange}
    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
    placeholder="Enter Present Address"
    required
  />
  <div className="flex items-center gap-2 mt-2">
    <input
      type="checkbox"
      id="sameAsPresentAddress"
      checked={usePermanentAddress}
      onChange={handlePermanentAddressCheckbox}
      className="form-checkbox h-4 w-4 text-[#243460]"
    />
    <label htmlFor="sameAsPresentAddress" className="text-[#243460] font-semibold">
      Use Present Address as Permanent Address
    </label>
  </div>
</div>
<div className="space-y-2">
  <label className="text-[#243460] font-semibold flex items-center gap-2">
    <FiMapPin className="text-[#5271FF]" />
    Permanent Address*
  </label>
  <input
    type="text"
    name="permanentAddress"
    value={formData.permanentAddress}
    onChange={handleChange}
    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
    placeholder="Enter Permanent Address"
    required
  />
</div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiMapPin className="text-[#5271FF]" />
                      City*
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleChange({ target: { name: "city", value } });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter City"
                      required
                    />
                  </div>
                </div>

                {/* District, Taluka Row */}
                <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiMapPin className="text-[#5271FF]" />
                      State*
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.stateName}>
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiMapPin className="text-[#5271FF]" />
                      District*
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select District</option>
                      {filteredDistricts.map((district) => (
                        <option key={district.id} value={district.district}>
                          {district.district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiMapPin className="text-[#5271FF]" />
                      Taluka*
                    </label>
                    <div className="relative">
                      <select
                        name="taluka"
                        value={formData.taluka}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        required
                      >
                        <option value="">Select Taluka</option>
                        {filteredSubDistricts.map((subDistrict) => (
                          <option
                            key={subDistrict.id}
                            value={subDistrict.subDistrict}
                          >
                            {subDistrict.subDistrict}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Documents & Health Cards */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Aadhar Card Section */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiCreditCard className="text-[#5271FF]" />
                      Aadhar Card Number*
                    </label>
                    <input
                      type="text"
                      name="aadharCardNumber"
                      value={formData.aadharCardNumber}
                      maxLength="12"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: { name: "aadharCardNumber", value },
                        });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Aadhar Card Number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Aadhar Card Front Side*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.aadharCardFront
                            ? "Uploaded"
                            : "Upload Front Side"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.aadharCardFront ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                  ) : (
                                    ready && <div>Upload</div>
                                  )}
                                </div>
                              );
                            },
                            allowedContent: () => "",
                          }}
                          appearance={{
                            button:
                              "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                            container:
                              "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onUploadBegin={() => setFieldLoading("aadharCardFront", true)}
                          onClientUploadComplete={(res) => {
                            setFieldLoading("aadharCardFront", false);
                            if (res.length > 0) {
                              setFormData((prev) => ({
                                ...prev,
                                aadharCardFront: res[0].url,
                              }));
                              toast.success("Upload Completed");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("aadharCardFront", false);
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Aadhar Card Back Side*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.aadharCardBack
                            ? "Uploaded"
                            : "Upload Back Side"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.aadharCardBack ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                  ) : (
                                    ready && <div>Upload</div>
                                  )}
                                </div>
                              );
                            },
                            allowedContent: () => "",
                          }}
                          appearance={{
                            button:
                              "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                            container:
                              "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onUploadBegin={() => setFieldLoading("aadharCardBack", true)}
                          onClientUploadComplete={(res) => {
                            if (res.length > 0) {
                              setFieldLoading("aadharCardBack", false);
                              setFormData((prev) => ({
                                ...prev,
                                aadharCardBack: res[0].url,
                              }));
                              toast.success("Upload Completed");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("aadharCardBack", false);
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* ABHA Card Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      ABHA Card*
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="ABHA"
                          value="yes"
                          checked={formData.abhacard === true}
                          onChange={handleAbhaChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="ABHA"
                          value="no"
                          checked={formData.abhacard === false}
                          onChange={handleAbhaChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.abhacard && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          ABHA Card Number*
                        </label>
                        <input
                          type="text"
                          name="abhaCardNumber"
                          value={formData.abhaCardNumber}
                          onChange={handleChange}
                          maxLength="14"
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter ABHA Card Number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiFile className="text-[#5271FF]" />
                          ABHA Card Front Side*
                        </label>
                        <div className="relative">
                          <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                            <span className="text-gray-600">
                              {formData.abhaCardFront
                                ? "Uploaded"
                                : "Upload Front Side"}
                            </span>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {uploadLoading.abhaCardFront ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                      ) : (
                                        ready && <div>Upload</div>
                                      )}
                                    </div>
                                  );
                                },
                                allowedContent: () => "",
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                                container:
                                  "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onUploadBegin={() => setFieldLoading("abhaCardFront", true)}
                              onClientUploadComplete={(res) => {
                                setFieldLoading("abhaCardFront", false);
                                if (res.length > 0) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    abhaCardFront: res[0].url,
                                  }));
                                  toast.success("Upload Completed");
                                }
                              }}
                              onUploadError={(error) => {
                                setFieldLoading("abhaCardFront", false);
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Health Insurance Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Health Insurance*
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="health"
                          value="yes"
                          checked={formData.healthInsurance === true}
                          onChange={handleHealthInsuranceChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="health"
                          value="no"
                          checked={formData.healthInsurance === false}
                          onChange={handleHealthInsuranceChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.healthInsurance && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          Health Insurance Number*
                        </label>
                        <input
                          type="text"
                          name="healthInsuranceNumber"
                          value={formData.healthInsuranceNumber}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Health Insurance Number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          Provider Name*
                        </label>
                        <input
                          type="text"
                          name="provider"
                          value={formData.provider}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Provider Name "
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          Coverage*
                        </label>
                        <input
                          type="text"
                          name="coverage"
                          value={formData.coverage}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Coverage Amount "
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          Copay (in % )*
                        </label>
                        <input
                          type="text"
                          name="copay"
                          value={formData.copay}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Copay in %"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiFile className="text-[#5271FF]" />
                          Health Insurance Document*
                        </label>
                        <div className="relative">
                          <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                            <span className="text-gray-600">
                              {formData.healthInsuranceDocument
                                ? "Uploaded"
                                : "Upload Health Insurance Document"}
                            </span>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {uploadLoading.healthInsuranceDocument ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                      ) : (
                                        ready && <div>Upload</div>
                                      )}
                                    </div>
                                  );
                                },
                                allowedContent: () => "",
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                                container:
                                  "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onUploadBegin={() => setFieldLoading("healthInsuranceDocument", true)}
                              onClientUploadComplete={(res) => {
                                setFieldLoading("healthInsuranceDocument", false);
                                if (res.length > 0) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    healthInsuranceDocument: res[0].url,
                                  }));
                                  toast.success("Upload Completed");
                                }
                              }}
                              onUploadError={(error) => {
                                setFieldLoading("healthInsuranceDocument", false);
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ayushman Bharat Card Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Ayushman Bharat Card*
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="Ayushman"
                          value="yes"
                          checked={formData.ayushmancard === true}
                          onChange={handleAyushmanChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="Ayushman"
                          value="no"
                          checked={formData.ayushmancard === false}
                          onChange={handleAyushmanChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.ayushmancard && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          Ayushman Bharat Card No*
                        </label>
                        <input
                          type="text"
                          name="ayushmanCard"
                          value={formData.ayushmanCard}
                          onChange={handleChange}
                          maxLength="14"
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Ayushman Bharat Card No"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiFile className="text-[#5271FF]" />
                          Ayushman Bharat Card*
                        </label>
                        <div className="relative">
                          <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                            <span className="text-gray-600">
                              {formData.ayushmanCardFront
                                ? "Uploaded"
                                : "Upload Ayushman Bharat Card"}
                            </span>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {uploadLoading.ayushmanCardFront ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                      ) : (
                                        ready && <div>Upload</div>
                                      )}
                                    </div>
                                  );
                                },
                                allowedContent: () => "",
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                                container:
                                  "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onUploadBegin={() => setFieldLoading("ayushmanCardFront", true)}
                              onClientUploadComplete={(res) => {
                                setFieldLoading("ayushmanCardFront", false);
                                if (res.length > 0) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    ayushmanCardFront: res[0].url,
                                  }));
                                  toast.success("Upload Completed");
                                }
                              }}
                              onUploadError={(error) => {
                                setFieldLoading("ayushmanCardFront", false);
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ration Card Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Ration Card*
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="rationcard"
                          value="yes"
                          checked={formData.rationcard === true}
                          onChange={handleRationChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="rationcard"
                          value="no"
                          checked={formData.rationcard === false}
                          onChange={handleRationChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.rationcard && (
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiList className="text-[#5271FF]" />
                          Ration Card Type*
                        </label>
                        <select
                          name="rationcardtype"
                          value={formData.rationcardtype}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          required
                        >
                          <option value="">Select Ration Card Type</option>
                          <option value="White">
                            White (Above poverty line)
                          </option>
                          <option value="Orange">
                            Orange (APL households)
                          </option>
                          <option value="Yellow">
                            Yellow (Non-Priority households)
                          </option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          Ration Card Number*
                        </label>
                        <input
                          type="text"
                          name="rationCardNumber"
                          value={formData.rationCardNumber}
                          onChange={handleChange}
                          maxLength="10"
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Ration Card Number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiFile className="text-[#5271FF]" />
                          Ration Card Document*
                        </label>
                        <div className="relative">
                          <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                            <span className="text-gray-600 truncate">
                              {formData.rationCardFront
                                ? "Uploaded"
                                : "Upload Ration Card Document"}
                            </span>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {uploadLoading.rationCardFront ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                      ) : (
                                        ready && <div>Upload</div>
                                      )}
                                    </div>
                                  );
                                },
                                allowedContent: () => "",
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                                container:
                                  "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onUploadBegin={() => setFieldLoading("rationCardFront", true)}
                              onClientUploadComplete={(res) => {
                                setFieldLoading("rationCardFront", false);
                                if (res.length > 0) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    rationCardFront: res[0].url,
                                  }));
                                  toast.success("Upload Completed");
                                }
                              }}
                              onUploadError={(error) => {
                                setFieldLoading("rationCardFront", false);
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Organ Donation */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiHeart className="text-[#5271FF]" />
                      Are you interested in organ donation?
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="organDonation"
                          value="yes"
                          checked={formData.organDonation === true}
                          onChange={handleOrganChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="organDonation"
                          value="no"
                          checked={formData.organDonation === false}
                          onChange={handleOrganChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Ekyc Document*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600 truncate">
                          {formData.ekycdoc
                            ? "Uploaded"
                            : "Upload Ekyc Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.ekycdoc ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                  ) : (
                                    ready && <div>Upload</div>
                                  )}
                                </div>
                              );
                            },
                            allowedContent: () => "",
                          }}
                          appearance={{
                            button:
                              "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                            container:
                              "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onUploadBegin={() => setFieldLoading("ekycdoc", true)}
                          onClientUploadComplete={(res) => {
                            setFieldLoading("ekycdoc", false);
                            if (res.length > 0) {
                              setFormData((prev) => ({
                                ...prev,
                                ekycdoc: res[0].url,
                              }));
                              toast.success("Upload Completed");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("ekycdoc", false);
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank & Additional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Bank Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiBriefcase className="text-[#5271FF]" />
                      Bank Name*
                    </label>
                    <select
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select Bank</option>
                      <option value="state_bank_of_india">
                        State Bank of India
                      </option>
                      <option value="hdfc_bank">HDFC Bank</option>
                      <option value="icici_bank">ICICI Bank</option>
                      <option value="axis_bank">Axis Bank</option>
                      <option value="punjab_national_bank">
                        Punjab National Bank
                      </option>
                      <option value="bank_of_baroda">Bank of Baroda</option>
                      <option value="canara_bank">Canara Bank</option>
                      <option value="union_bank_of_india">
                        Union Bank of India
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiCreditCard className="text-[#5271FF]" />
                      Bank Account Number*
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Bank Account Number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiInfo className="text-[#5271FF]" />
                      IFSC Code*
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter IFSC Code"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiList className="text-[#5271FF]" />
                      Account Type*
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select Account Type</option>
                      <option value="current">Current</option>
                      <option value="saving">Saving</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Cancelled Cheque*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.cancelledCheque
                            ? "Uploaded"
                            : "Upload Cancelled Cheque"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.cancelledCheque ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                  ) : (
                                    ready && <div>Upload</div>
                                  )}
                                </div>
                              );
                            },
                            allowedContent: () => "",
                          }}
                          appearance={{
                            button:
                              "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                            container:
                              "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onUploadBegin={() => setFieldLoading("cancelledCheque", true)}
                          onClientUploadComplete={(res) => {
                            setFieldLoading("cancelledCheque", false);
                            if (res.length > 0) {
                              setFormData((prev) => ({
                                ...prev,
                                cancelledCheque: res[0].url,
                              }));
                              toast.success("Upload Completed");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("cancelledCheque", false);
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiInfo className="text-[#5271FF]" />
                      MICR Code*
                    </label>
                    <input
                      type="text"
                      name="micrCode"
                      value={formData.micrCode}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter MICR Code"
                      required
                    />
                  </div>
                </div>

                {/* Income Certificate Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Income Certificate*
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="Income"
                          value="yes"
                          checked={formData.income === true}
                          onChange={handleIncomeChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="Income"
                          value="no"
                          checked={formData.income === false}
                          onChange={handleIncomeChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.income && (
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiInfo className="text-[#5271FF]" />
                          Income Certificate No*
                        </label>
                        <input
                          type="text"
                          name="incomeCertificateNo"
                          value={formData.incomeCertificateNo}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Income Certificate No"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiList className="text-[#5271FF]" />
                          Income in Lakh*
                        </label>
                        <select
                          name="incomeinlakh"
                          value={formData.incomerange.lakh}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          required
                        >
                          <option value="">Select Income in Lakh</option>
                          {Array.from({ length: 100 }, (_, i) => (
                            <option key={i} value={i}>
                              {i} Lakh
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiList className="text-[#5271FF]" />
                          Income in Thousand*
                        </label>
                        <select
                          name="incomeinthousand"
                          value={formData.incomerange.thousand}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          required
                        >
                          <option value="">Select Income in Thousand</option>
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={i * 10}>
                              {i * 10} Thousand
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiFile className="text-[#5271FF]" />
                          Income Certificate*
                        </label>
                        <div className="relative">
                          <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                            <span className="text-gray-600">
                              {formData.incomeCertificateimg
                                ? "Uploaded"
                                : "Upload Income Certificate"}
                            </span>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {uploadLoading.incomeCertificateimg ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                      ) : (
                                        ready && <div>Upload</div>
                                      )}
                                    </div>
                                  );
                                },
                                allowedContent: () => "",
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                                container:
                                  "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onUploadBegin={() => setFieldLoading("incomeCertificateimg", true)}
                              onClientUploadComplete={(res) => {
                                setFieldLoading("incomeCertificateimg", false);
                                if (res.length > 0) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    incomeCertificateimg: res[0].url,
                                  }));
                                  toast.success("Upload Completed");
                                }
                              }}
                              onUploadError={(error) => {
                                setFieldLoading("incomeCertificateimg", false);
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Person Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiUser className="text-[#5271FF]" />
                      Contact Person Name*
                    </label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          ""
                        );
                        handleChange({
                          target: { name: "contactPersonName", value },
                        });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Contact Person Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiHeart className="text-[#5271FF]" />
                      Contact Person Relation*
                    </label>
                    <select
                      name="contactPersonRelation"
                      value={formData.contactPersonRelation}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select Contact Person Relation</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="husband">Husband</option>
                      <option value="wife">Wife</option>
                      <option value="brother">Brother</option>
                      <option value="sister">Sister</option>
                      <option value="son">Son</option>
                      <option value="spouse">Spouse</option>
                      <option value="daughter">Daughter</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiPhone className="text-[#5271FF]" />
                      Contact Person Mobile*
                    </label>
                    <input
                      type="text"
                      name="contactmanaadharNumber"
                      value={formData.contactmanaadharNumber}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        handleChange({
                          target: { name: "contactmanaadharNumber", value },
                        });
                      }}
                      maxLength="10"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Contact Person Mobile"
                      required
                    />
                  </div>
                </div>

                {/* PAN Card Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Do you have a PAN Card?*
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasPanCard"
                          value="yes"
                          checked={formData.hasPanCard === true}
                          onChange={handlePancardChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasPanCard"
                          value="no"
                          checked={formData.hasPanCard === false}
                          onChange={handlePancardChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.hasPanCard && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiCreditCard className="text-[#5271FF]" />
                          PAN Card Number*
                        </label>
                        <input
                          type="text"
                          name="panCardNumber"
                          value={formData.panCardNumber}
                          onChange={handleChange}
                          maxLength="10"
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter PAN Card Number"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiFile className="text-[#5271FF]" />
                          Upload PAN Card*
                        </label>
                        <div className="relative">
                          <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                            <span className="text-gray-600">
                              {formData.panCard
                                ? "Uploaded"
                                : "Upload PAN Card"}
                            </span>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {uploadLoading.panCard ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                      ) : (
                                        ready && <div>Upload</div>
                                      )}
                                    </div>
                                  );
                                },
                                allowedContent: () => "",
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                                container:
                                  "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onUploadBegin={() => setFieldLoading("panCard", true)}
                              onClientUploadComplete={(res) => {
                                setFieldLoading("panCard", false);
                                if (res.length > 0) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    panCard: res[0].url,
                                  }));
                                  toast.success("Upload Completed");
                                }
                              }}
                              onUploadError={(error) => {
                                setFieldLoading("panCard", false);
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Company Registration Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiFile className="text-[#5271FF]" />
                      Your Company Registered?
                    </label>
                    <div className="flex items-center space-x-6 ml-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="isCompanyRegistered"
                          value="yes"
                          checked={formData.isCompanyRegistered === true}
                          onChange={handleCompanyChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          Yes
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="isCompanyRegistered"
                          value="no"
                          checked={formData.isCompanyRegistered === false}
                          onChange={handleCompanyChange}
                          className="form-radio h-4 w-4 text-[#243460]"
                        />
                        <span className="ml-2 text-[#243460] font-semibold">
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.isCompanyRegistered && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiInfo className="text-[#5271FF]" />
                          Company Registration No*
                        </label>
                        <input
                          type="text"
                          name="companyRegistrationNo"
                          value={formData.companyRegistrationNo}
                          onChange={handleChange}
                          className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Company Registration No"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#243460] font-semibold flex items-center gap-2">
                          <FiFile className="text-[#5271FF]" />
                          Employee ID Card*
                        </label>
                        <div className="relative">
                          <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                            <span className="text-gray-600">
                              {formData.employeeIdCard
                                ? "Uploaded"
                                : "Upload Employee ID Card"}
                            </span>
                            <UploadButton
                              endpoint="fileUploader"
                              content={{
                                button({ ready }) {
                                  return (
                                    <div>
                                      {uploadLoading.employeeIdCard ? (
                                        <Loader2 className="animate-spin w-4 h-4" />
                                      ) : (
                                        ready && <div>Upload</div>
                                      )}
                                    </div>
                                  );
                                },
                                allowedContent: () => "",
                              }}
                              appearance={{
                                button:
                                  "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                                container:
                                  "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                                allowedContent: "hidden",
                              }}
                              onUploadBegin={() => setFieldLoading("employeeIdCard", true)}
                              onClientUploadComplete={(res) => {
                                setFieldLoading("employeeIdCard", false);
                                if (res.length > 0) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    employeeIdCard: res[0].url,
                                  }));
                                  toast.success("Upload Completed");
                                }
                              }}
                              onUploadError={(error) => {
                                setFieldLoading("employeeIdCard", false);
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                    <div className="grid md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="text-[#243460] font-semibold flex items-center gap-2">
      <FiFile className="text-[#5271FF]" />
      Consent Form*
    </label>
    <p className="text-sm text-gray-600 ml-6">
      Please upload the signed consent form for processing Applicantion
    </p>
    <div className="relative">
      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600 truncate">
          {formData.form
            ? "Consent Form Uploaded"
            : "Upload Consent Form (PDF/DOC/Image)"}
        </span>
        <UploadButton
          endpoint="fileUploader"
          content={{
            button({ ready }) {
              return (
                <div>
                  {uploadLoading.form ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    ready && <div>Upload</div>
                  )}
                </div>
              );
            },
            allowedContent: () => "",
          }}
          appearance={{
            button:
              "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
            container:
              "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onUploadBegin={() => setFieldLoading("form", true)}
          onClientUploadComplete={(res) => {
            setFieldLoading("form", false);
            if (res.length > 0) {
              setFormData((prev) => ({
                ...prev,
                form: res[0].url,
              }));
              toast.success("Consent Form Upload Completed");
            }
          }}
          onUploadError={(error) => {
            setFieldLoading("form", false);
            toast.error(`ERROR! ${error.message}`);
          }}
        />
      </label>
    </div>
  </div>
</div>
              </div>
            )}

            {/* Step 4: Security & Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiLock className="text-[#5271FF]" />
                      Password*
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 text-lg"
                        placeholder="Enter Password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      >
                        {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {formData.password &&
                      !validatePassword(formData.password) && (
                        <p className="text-red-500 text-sm">
                          Password must be at least 8 characters with uppercase,
                          lowercase, number, and special character.
                        </p>
                      )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold flex items-center gap-2">
                      <FiLock className="text-[#5271FF]" />
                      Confirm Password*
                    </label>
                    <div className="relative">
                      <input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 text-lg"
                        placeholder="Confirm Password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl"
                        onClick={() =>
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                        }
                      >
                        {isConfirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          Passwords do not match.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className={`px-8 py-3 rounded-xl font-semibold transition-colors ${currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-[#243460] hover:bg-gray-300"
                  }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                  Next
                </button>
              ) : (
                <>
                  {" "}
                  <button
                    type="submit"
                    className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering Patient..." : "Register Patient"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveEsevaPatientRegister;
