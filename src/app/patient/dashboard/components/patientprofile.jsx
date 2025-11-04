"use client";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
  FiLock,
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
} from "react-icons/fi";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import TermsAndConditionOnSubmission from "@/app/components/termsandcondition";
import PatientPreViewBeforeSubmit from "./patientpreviewbeforesubmit";
import PatientPreViewWithTicking from "./patientpreviewwithticking";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";

import ProfileUploadPage from "./profile-upload";

const CompletePatientProfile = ({ userdata, state, data, dist, subdist }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
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

  const [formData, setFormData] = useState({
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
    caste: "",
    alternateMobile: "",
    educationlevel: "",
    occupation: "",
    presentAddress: "",
    permanentAddress:"",
    city: "",
    state: "",
    district: "",
    taluka: "",
    bloodgroup: "",
    aadharCardNumber: "",
    aadharCardFront: "",
    aadharCardBack: "",
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
    organDonation: false,
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    cancelledCheque: "",
    micrCode: "",
    income: false,
    incomeCertificateimg: "",
    incomeCertificateNo: "",
    incomerange: { lakh: "", thousand: "" },
    hasPanCard: false,
    panCardNumber: "",
    panCard: "",
    contactPersonName: "",
    contactPersonRelation: "",
    contactmanaadharNumber: "",
    isCompanyRegistered: false,
    companyRegistrationNo: "",
    employeeIdCard: "",
    ekycdoc: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userdata.email);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
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

  // Add new state for manual entry fields
  // removed manual subcaste related inputs

  const stepTitles = [
    "Personal Information",
    "Documents & Health Cards",
    "Bank & Additional Details",
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: date,
      }));
    } else {
      toast.error("Please select a valid date.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // All other dropdown and input logic remains unchanged
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    if (name === "state") {
      const selectedState = state.find((state) => state.stateName === value);
      const districts = dist.filter(
        (district) => district.stateId === selectedState?.id
      );
      setFilteredDistricts(districts);
      setFilteredSubDistricts([]);
      setFormData((prev) => ({
        ...prev,
        district: "",
        taluka: "",
      }));
    }

    if (name === "district") {
      const selectedDistrict = dist.find(
        (district) => district.district === value
      );
      const subDistricts = subdist.filter(
        (subDistrict) => subDistrict.districtId === selectedDistrict?.id
      );
      setFilteredSubDistricts(subDistricts);
      setFormData((prev) => ({
        ...prev,
        taluka: "",
      }));
    }
    if (name === "religion") {
      setFormData((prev) => ({
        ...prev,
        religion: value,
        caste: "",
      }));
      return;
    }
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

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
  };

  // OTP handlers
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }

      toast.success("OTP sent to your email");
      setIsOtpSent(true);
    } catch (error) {
      toast.error("Something went wrong: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
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
      setIsLoading(false);
    }
  };
  // 🔹 Validate fields by step
  const validateFields = (step, formData) => {
    const errors = [];

    // Step 1: Personal Info
    if (step === 1) {
      const required = [
        "email",
        "mobile",
        "firstName",
        "lastName",
        "dateOfBirth",
        "gender",
        "maritalStatus",
        "bloodgroup",
        "religion",
        "caste",
        "alternateMobile",
        "presentAddress",
        "permanentAddress",
        "city",
        "educationlevel",
        "occupation",
        "state",
        "district",
        "taluka",
      ];

      required.forEach((field) => {
        if (!formData[field] || formData[field].toString().trim() === "") {
          errors.push(`${field} is required`);
        }
      });

      // Simple mobile number format
      if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
        errors.push("Enter a valid mobile number");
      }

      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.push("Enter a valid email address");
      }
    }

    // Step 2: Documents & Health Cards
    if (step === 2) {
      if (!formData.aadharCardNumber) {
        errors.push("Aadhar card number is required");
      }
      if (formData.abhacard) {
        if (!formData.abhaCardNumber) errors.push("ABHA card number required");
        if (!formData.abhaCardFront) errors.push("ABHA card front required");
      }
      if (formData.healthInsurance) {
        if (!formData.healthInsuranceNumber)
          errors.push("Health insurance number required");
        if (!formData.healthInsuranceDocument)
          errors.push("Health insurance document required");
      }
      if (formData.ayushmancard) {
        if (!formData.ayushmanCardNumber)
          errors.push("Ayushman card number required");
        if (!formData.ayushmanCardFront)
          errors.push("Ayushman card front required");
      }
      if (formData.rationcard) {
        if (!formData.rationCardNumber)
          errors.push("Ration card number required");
        if (!formData.rationCardFront)
          errors.push("Ration card front required");
      }
    }

    // Step 3: Bank & Additional Details
    if (step === 3) {
      const required = [
        "contactPersonName",
        "contactPersonRelation",
        "contactmanaadharNumber",
      ];
      required.forEach((field) => {
        if (!formData[field] || formData[field].toString().trim() === "") {
          errors.push(`${field} is required`);
        }
      });

      if (formData.hasPanCard) {
        if (!formData.panCardNumber) errors.push("PAN card number required");
        if (!formData.panCard) errors.push("PAN card file required");
      }

      if (formData.income) {
        if (!formData.incomeCertificateNo)
          errors.push("Income certificate number required");
        if (!formData.incomeCertificateimg)
          errors.push("Income certificate image required");
      }

      if (formData.isCompanyRegistered) {
        if (!formData.companyRegistrationNo)
          errors.push("Company registration number required");
        if (!formData.employeeIdCard)
          errors.push("Employee ID card required");
      }
    }

    // Show all errors as toast notifications
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false; // ❌ stop submission
    }

    return true; // ✅ all good
  };

  // Form submission handlers
  const handleSecondSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields(2, formData)) return;
    const appendFormData = (formData, data) => {
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });
    };

    // Check if all required fields are filled
    const requiredFields = ["aadharCardNumber", "aadharCardFront", "aadharCardBack"];
    // Add PAN-related fields to validation only if hasPanCard is true
    if (formData.abhacard) {
      requiredFields.push("abhaCardFront", "abhaCardNumber");
    }
    if (formData.rationcard) {
      requiredFields.push("rationCardNumber", "rationCardFront");
    }
    if (formData.ekycdoc) {
      requiredFields.push("ekycdoc");
    }
    if (formData.healthInsurance) {
      requiredFields.push("healthInsuranceNumber", "healthInsuranceDocument");
    }
    if (formData.ayushmancard) {
      requiredFields.push("ayushmanCard", "ayushmanCardFront");
    }
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast(`Please fill the details: ${field}`);
        return;
      }
    }

    // Disable submit button and show loading spinner while submitting

    setIsLoading(true);

    // Prepare form data for submission
    const formPayload = new FormData();

    // Append form fields dynamically
    const formFields = {
      bloodgroup: formData.bloodgroup,
      aadharCardNumber: formData.aadharCardNumber,
      abhacard: formData.abhacard,
      healthInsurance: formData.healthInsurance,
      abhaCardNumber: formData.abhaCardNumber,
      healthInsuranceNumber: formData.healthInsuranceNumber,
      rationCardNumber: formData.rationCardNumber,
      rationcardtype: formData.rationcardtype,
      organDonation: formData.organDonation,
      ekycdoc: formData.ekycdoc,
    };

    // Append the form fields dynamically
    appendFormData(formPayload, formFields);

    // Append file fields if any
    const fileFields = [
      "aadharCardFront",
      "aadharCardBack",
      "abhaCardFront",
      "healthInsuranceDocument",
      "ayushmanCardFront",
      "rationcard",
      "rationCardFront",
      "ekycdoc",
        ];

    fileFields.forEach((field) => {
      if (formData[field]) formPayload.append(field, formData[field]);
    });

    try {
      // Make the API request to submit the form
      const registerRes = await fetch(`/api/patient/${userdata.id}/docs`, {
        method: "PUT",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Update the form.");
      }

      // Success: show success alert and reset form
      toast.success("Form Saved successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };
  const handleThirdSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields(3, formData)) return;

    const appendFormData = (formData, data) => {
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });
    };

    // Check if all required fields are filled
    const requiredFields = [
      "contactPersonName",
      "contactPersonRelation",
      "contactmanaadharNumber",
    ];
    // Add PAN-related fields to validation only if hasPanCard is true
    if (formData.hasPanCard) {
      requiredFields.push("panCardNumber", "panCard");
    }
    if (formData.income) {
      requiredFields.push("incomeCertificateimg", "incomeCertificateNo");
    }
    if (formData.isCompanyRegistered) {
      requiredFields.push("companyRegistrationNo", "employeeIdCard");
    }
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast(`Please fill the details: ${field}`);
        return;
      }
    }

    // Disable submit button and show loading spinner while submitting

    setIsLoading(true);

    // Prepare form data for submission
    const formPayload = new FormData();

    // Append form fields dynamically
    const formFields = {
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      accountType: formData.accountType,
      micrCode: formData.micrCode,
      incomeCertificateNo: formData.incomeCertificateNo,
      contactPersonName: formData.contactPersonName,
      contactPersonRelation: formData.contactPersonRelation,
      contactmanaadharNumber: formData.contactmanaadharNumber,
      isCompanyRegistered: formData.isCompanyRegistered,
      companyRegistrationNo: formData.companyRegistrationNo,
      ayushmancard: formData.ayushmancard,
      income: formData.income,
      incomerange: JSON.stringify(formData.incomerange),
      ayushmanCard: formData.ayushmanCard,
      hasPanCard: formData.hasPanCard,
      panCardNumber: formData.panCardNumber,
    };

    // Append the form fields dynamically
    appendFormData(formPayload, formFields);

    // Append file fields if any
    const fileFields = [
      "panCard",
      "incomeCertificateimg",
      "cancelledCheque",
      "employeeIdCard",
    ];

    fileFields.forEach((field) => {
      if (formData[field]) formPayload.append(field, formData[field]);
    });

    try {
      // Make the API request to submit the form
      const registerRes = await fetch(
        `/api/patient/${userdata.id}/bank-company-contact-person`,
        {
          method: "PUT",
          body: formPayload,
        }
      );

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Update the form.");
      }

      // Success: show success alert and reset form
      toast.success("Form Saved successfully!");
      router.push("/patient/dashboard/profile");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };
  const handleFirstSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields(1, formData)) return;

    // // Check if OTP is verified before proceeding
    if (!isOtpVerified) {
      toast("Please verify OTP before submitting.");
      return;
    }
    // Helper function to dynamically append form fields to formData
    const appendFormData = (formData, data) => {
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });
    };

    // Check if all required fields are filled
    const requiredFields = [
      "email",
      "mobile",
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodgroup",
      "religion",
      "caste",
      "alternateMobile",
      "presentAddress",
      "city",
      "educationlevel",
      "occupation",
      "state",
      "district",
      "taluka",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill the details: ${field}`);
        return;
      }
    }

    const formattedDateOfBirth = formData.dateOfBirth
      ? new Date(formData.dateOfBirth).toLocaleDateString("en-GB") // Format date as 'dd/MM/yyyy'
      : userdata.dateOfBirth;

    // Disable submit button and show loading spinner while submitting

    setIsLoading(true);

    // Prepare form data for submission
    const formPayload = new FormData();

    // Append form fields dynamically
    const formFields = {
      email: formData.email,
      mobile: formData.mobile,
      pincode: formData.pincode,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formattedDateOfBirth,
      gender: formData.gender,
      bloodgroup: formData.bloodgroup,
      maritalStatus: formData.maritalStatus,
      religion: formData.religion,
      alternateMobile: formData.alternateMobile,
      presentAddress: formData.presentAddress,
      permanentAddress:formData.permanentAddress,
      city: formData.city,
      state: formData.state,
      district: formData.district,
      taluka: formData.taluka,
      educationlevel: formData.educationlevel,
      occupation: formData.occupation,
      caste: formData.caste,
    };

    // Append the form fields dynamically
    appendFormData(formPayload, formFields);

    // Append file fields if any
    const fileFields = [];

    fileFields.forEach((field) => {
      if (formData[field]) formPayload.append(field, formData[field]);
    });

    try {
      // Make the API request to submit the form
      const registerRes = await fetch(
        `/api/patient/${userdata.id}/basic-info`,
        {
          method: "PUT",
          body: formPayload,
        }
      );

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Update the form.");
      }

      // Success: show success alert and reset form
      toast.success("Form submitted successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "contactPersonName",
      "contactPersonRelation",
      "contactmanaadharNumber",
    ];

    if (formData.hasPanCard) {
      requiredFields.push("panCardNumber", "panCard");
    }
    if (formData.income) {
      requiredFields.push("incomeCertificateimg", "incomeCertificateNo");
    }
    if (formData.isCompanyRegistered) {
      requiredFields.push("companyRegistrationNo", "employeeIdCard");
    }

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill the details: ${field}`);
        return;
      }
    }

    setIsLoading(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/patient/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: userdata.id }),
      });

      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aarogya Aadhar",
        description: "Health Card Registration",
        order_id: order.id,
        handler: async function (response) {
          // After successful payment, verify it
          const verifyRes = await fetch("/api/patient/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              patientId: userdata.id,
              amount: order.amount
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.success("Payment Successful. Submitting form...");
            await submitPatientForm();
          } else {
            toast.error("Payment verification failed.");

            setIsLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: userdata.email,
          contact: userdata.mobile,
        },
        theme: {
          color: "#243460",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error("Payment process failed.");

      setIsLoading(false);
    }
  };
  const submitPatientForm = async () => {
    const formPayload = new FormData();

    const formFields = {
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      accountType: formData.accountType,
      micrCode: formData.micrCode,
      incomeCertificateNo: formData.incomeCertificateNo,
      contactPersonName: formData.contactPersonName,
      contactPersonRelation: formData.contactPersonRelation,
      contactmanaadharNumber: formData.contactmanaadharNumber,
      isCompanyRegistered: formData.isCompanyRegistered,
      companyRegistrationNo: formData.companyRegistrationNo,
      ayushmancard: formData.ayushmancard,
      income: formData.income,
      ayushmanCard: formData.ayushmanCard,
      hasPanCard: formData.hasPanCard,
      panCardNumber: formData.panCardNumber,
    };

    Object.keys(formFields).forEach((key) => {
      if (formFields[key]) formPayload.append(key, formFields[key]);
    });

    const fileFields = ["panCard", "incomeCertificateimg", "employeeIdCard"];
    fileFields.forEach((field) => {
      if (formData[field]) formPayload.append(field, formData[field]);
    });

    try {
      const res = await fetch(`/api/patient/${userdata.id}`, {
        method: "PUT",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Failed to submit form");

      toast.success("Application Submitted successfully!");
      router.push("/patient/dashboard/digitalhealthcard");
    } catch (err) {
      toast.error("Form submission failed.");
    } finally {
      setIsLoading(false);
    }
  };
function onFormSubmit(e) {
  e.preventDefault();

  // Use userdata.Payment, not userdata.patient.Payment
  if (
    userdata.Payment?.some(
      (payment) => payment.forwhat === "Registration" && payment.paymentStatus === "SUCCESS"
    )
  ) {
    submitPatientForm();
    return;
  }

  handleSubmit(e);
}
  // Preview Component
  const Preview = ({ formData }) => {
    useEffect(() => {
      if (!userdata?.passportPhoto) {
        toast.error("Please go back and upload a profile photo.");
      }
    }, [userdata?.passportPhoto]);

    return (
      <div className="space-y-6">
        <PatientPreViewWithTicking
          formdata={{ ...formData, passportPhoto: userdata?.passportPhoto }}
          userdata={userdata}
        />

        <div className="flex items-center justify-center gap-2 mt-6">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={isAgreed}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
          <label htmlFor="termsCheckbox" className="text-sm text-gray-600">
            <TermsAndConditionOnSubmission />
          </label>
        </div>

        <div className="flex mb-8 justify-center space-x-6 mt-2">
          <button
            className="px-6 py-3 bg-gray-500 rounded-xl text-white hover:bg-gray-600 focus:outline-none flex items-center space-x-2"
            onClick={handleCancelPreview}
          >
            <span>Edit</span>
          </button>

          {userdata.passportPhoto && (
            <button
              className="px-6 py-3 bg-[#5271FF] rounded-xl disabled:bg-blue-300 text-white hover:bg-[#4161ef] focus:outline-none flex items-center space-x-2"
              onClick={onFormSubmit}
              disabled={!isAgreed}
            >
              {data?.approvalStatus !== "APPROVED" ? (
                <>
                  {isLoading
                    ? "Submitting Please wait.."
                    : " Final Submit"}
                </>
              ) : (
                <>{"You have already submitted your application"}</>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Initialize form data
  useEffect(() => {
    const setFormDataOnMount = () => {
      const fetchedData = {
        email: userdata.email || "",
        mobile: userdata.mobile || "",
        pincode: userdata.pincode || "",
        firstName: userdata.firstName || "",
        middleName: userdata.middleName || "",
        lastName: userdata.lastName || "",
        dateOfBirth: userdata.dateOfBirth
          ? new Date(userdata.dateOfBirth)
          : null,
        gender: userdata.gender || "",
        maritalStatus: userdata.maritalStatus || "",
        religion: userdata.religion || "",
        caste: userdata.caste || "",
        alternateMobile: userdata.alternateMobile || "",
        educationlevel: userdata.educationlevel || "",
        occupation: userdata.occupation || "",
        presentAddress: userdata.presentAddress || "",
        permanentAddress: userdata.permanentAddress || "",
        city: userdata.city || "",
        state: userdata.state || "",
        district: userdata.district || "",
        taluka: userdata.taluka || "",
        bloodgroup: userdata.bloodgroup || "",
        aadharCardNumber: userdata.aadharCardNumber || "",
        aadharCardFront: userdata.aadharCardFront || "",
        aadharCardBack: userdata.aadharCardBack || "",
        abhacard: userdata.abhacard ?? false,
        abhaCardNumber: userdata.abhaCardNumber || "",
        abhaCardFront: userdata.abhaCardFront || "",
        healthInsurance: userdata.healthInsurance ?? false,
        healthInsuranceNumber: userdata.healthInsuranceNumber || "",
        healthInsuranceDocument: userdata.healthInsuranceDocument || "",
        provider: userdata.provider || "",
        coverage: userdata.coverage || "",
        copay: userdata.copay || "",
        ayushmancard: userdata.ayushmancard ?? false,
        ayushmanCard: userdata.ayushmanCard || "",
        ayushmanCardFront: userdata.ayushmanCardFront || "",
        rationcard: userdata.rationcard ?? false,
        rationCardNumber: userdata.rationCardNumber || "",
        rationcardtype: userdata.rationcardtype || "",
        rationCardFront: userdata.rationCardFront || "",
        rationCardBack: userdata.rationCardBack || "",
        organDonation: userdata.organDonation ?? false,
        bankName: userdata.bankName || "",
        accountNumber: userdata.accountNumber || "",
        ifscCode: userdata.ifscCode || "",
        accountType: userdata.accountType || "",
        cancelledCheque: userdata.cancelledCheque || "",
        micrCode: userdata.micrCode || "",
        income: userdata.income ?? false,
        incomeCertificateimg: userdata.incomeCertificateimg || "",
        incomeCertificateNo: userdata.incomeCertificateNo || "",
        incomerange: userdata.incomerange
          ? JSON.parse(userdata.incomerange)
          : { lakh: "", thousand: "" },
        panCard: userdata.panCard || "",
        contactPersonName: userdata.contactPersonName || "",
        contactPersonRelation: userdata.contactPersonRelation || "",
        contactmanaadharNumber: userdata.contactmanaadharNumber || "",
        isCompanyRegistered: userdata.isCompanyRegistered ?? false,
        companyRegistrationNo: userdata.companyRegistrationNo || "",
        employeeIdCard: userdata.employeeIdCard || "",
        panCardNumber: userdata.panCardNumber || "",
        hasPanCard: userdata.hasPanCard ?? false,
        ekycdoc: userdata.ekycdoc || "",
      };

      setFormData((prevState) => ({
        ...prevState,
        ...fetchedData,
      }));
    };

    setFormDataOnMount();
  }, [userdata]);

  if (
    data?.approvalStatus === "SUBMITTED" ||
    data?.approvalStatus === "APPROVED"
  ) {
    return <Preview formData={formData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 xs:py-4 lg:py-8">
      <div className="max-w-6xl mx-auto xs:px-2 md:px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#243460] mb-2">
            Patient Profile Information
          </h1>
          <p className="text-[#5271FF] text-lg">
            Complete your profile with all required details
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex xs:justify-evenly lg:justify-between items-center">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    i + 1 <= currentStep
                      ? "bg-[#5271FF] text-white"
                      : "bg-white text-[#5271FF] border-2 border-[#5271FF]"
                  }`}
                >
                  {i + 1 < currentStep ? <FiCheck /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      i + 1 < currentStep ? "bg-[#5271FF]" : "bg-gray-300"
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

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-8">
          {!showPreview ? (
            <form
              onSubmit={
                currentStep === 1
                  ? handleFirstSubmit
                  : currentStep === 2
                  ? handleSecondSubmit
                  : currentStep === 3
                  ? handleThirdSubmit
                  : onFormSubmit
              }
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Basic Info Row 1 */}
                  <div
                    className={`grid gap-6 ${
                      isOtpSent ? "md:grid-cols-4" : "md:grid-cols-3"
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
                        readOnly
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
                          value={email}
                          readOnly
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                          placeholder="Enter Email ID"
                          required
                        />
                       <Button
  type="button"
  onClick={handleSendOtp}
  disabled={isOtpSent || isLoading}
  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
>
  {isOtpSent ? "Sent" : isLoading ? "Sending..." : "Send OTP"}
</Button>
                      </div>
                    </div>

                    {/* OTP + Verify Button (only if OTP is sent) */}
                    {isOtpSent && (
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
  onClick={handleVerifyOtp}
  disabled={isOtpVerified || isLoading}
  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
>
  {isOtpVerified ? "Verified" : isLoading ? "Verifying..." : "Verify"}
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
                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold flex items-center gap-2">
                        <FiDroplet className="text-[#5271FF]" />
                        Blood Group*
                      </label>
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

                  {/* Marital Status, Religion, Alternate Mobile */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Religion Dropdown */}
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
                    </div>
<div className="flex items-center gap-2">
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


                    {/* Subcaste removed */}
                  </div>

                  {/* Education Level and Occupation */}

                  {/* Address Row */}
                  <div className="grid md:grid-cols-3 gap-6">
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
                        {state.map((state) => (
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
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold flex items-center gap-2">
                        <FiHeart className="text-[#5271FF]" />
                        Marital Status*
                      </label>
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
                                return <div>{ready && <div>Upload</div>}</div>;
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
                              onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                            onClientUploadComplete={(res) => {
                              if (res.length > 0) {
                                setFormData((prev) => ({
                                  ...prev,
                                  aadharCardFront: res[0].url,
                                }));
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
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
                                return <div>{ready && <div>Upload</div>}</div>;
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
                              onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                            onClientUploadComplete={(res) => {
                              if (res.length > 0) {
                                setFormData((prev) => ({
                                  ...prev,
                                  aadharCardBack: res[0].url,
                                }));
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
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
                                      <div>{ready && <div>Upload</div>}</div>
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
                                onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      abhaCardFront: res[0].url,
                                    }));
                                    toast.success("Upload Completed");
                                  }
                                }}
                                onUploadError={(error) => {
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
                            placeholder="Enter Provider Name"
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
                            placeholder="Enter Coverage Amount"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[#243460] font-semibold flex items-center gap-2">
                            <FiCreditCard className="text-[#5271FF]" />
                            Copay (in %)*
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
                                  : "Upload Document"}
                              </span>
                              <UploadButton
                                endpoint="fileUploader"
                                content={{
                                  button({ ready }) {
                                    return (
                                      <div>{ready && <div>Upload</div>}</div>
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
                                onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      healthInsuranceDocument: res[0].url,
                                    }));
                                    toast.success("Upload Completed");
                                  }
                                }}
                                onUploadError={(error) => {
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
                                  : "Upload Card"}
                              </span>
                              <UploadButton
                                endpoint="fileUploader"
                                content={{
                                  button({ ready }) {
                                    return (
                                      <div>{ready && <div>Upload</div>}</div>
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
                                onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      ayushmanCardFront: res[0].url,
                                    }));
                                    toast.success("Upload Completed");
                                  }
                                }}
                                onUploadError={(error) => {
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
                                  : "Upload Document"}
                              </span>
                              <UploadButton
                                endpoint="fileUploader"
                                content={{
                                  button({ ready }) {
                                    return (
                                      <div>{ready && <div>Upload</div>}</div>
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
                                onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      rationCardFront: res[0].url,
                                    }));
                                    toast.success("Upload Completed");
                                  }
                                }}
                                onUploadError={(error) => {
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
                  <div className="grid md:grid-cols-2 gap-6">
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
                          <span className="text-gray-600">
                            {formData.ekycdoc
                              ? "Uploaded"
                              : "Upload Ekyc Document"}
                          </span>
                          <UploadButton
                            endpoint="fileUploader"
                            content={{
                              button({ ready }) {
                                return <div>{ready && <div>Upload</div>}</div>;
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
                            onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                            onClientUploadComplete={(res) => {
                              if (res.length > 0) {
                                setFormData((prev) => ({
                                  ...prev,
                                  ekycdoc: res[0].url,
                                }));
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
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
                  {/* Profile Photo Upload */}
                  <div className="text-center mb-6">
                    {userdata.passportPhoto ? (
                      <div className="flex flex-col items-center space-y-4">
                        <Image
                          src={userdata.passportPhoto || "/placeholder.svg"}
                          alt="Profile"
                          width={120}
                          height={120}
                          className="rounded-xl border-2 border-[#5271FF]"
                        />
                        <span className="text-[#5271FF] font-semibold">
                          Profile Photo Uploaded
                        </span>
                      </div>
                    ) : (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="w-full flex justify-center items-center bg-[#5271FF] text-white rounded-xl px-6 py-3 hover:bg-[#4161ef] transition-colors">
                          Upload Profile Photo
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogDescription>
                              <ProfileUploadPage userdata={userdata} />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

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
                                return <div>{ready && <div>Upload</div>}</div>;
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
                            onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                            onClientUploadComplete={(res) => {
                              if (res.length > 0) {
                                setFormData((prev) => ({
                                  ...prev,
                                  cancelledCheque: res[0].url,
                                }));
                                toast.success("Upload Completed");
                              }
                            }}
                            onUploadError={(error) => {
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
                                  : "Upload Certificate"}
                              </span>
                              <UploadButton
                                endpoint="fileUploader"
                                content={{
                                  button({ ready }) {
                                    return (
                                      <div>{ready && <div>Upload</div>}</div>
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
                                onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      incomeCertificateimg: res[0].url,
                                    }));
                                    toast.success("Upload Completed");
                                  }
                                }}
                                onUploadError={(error) => {
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
                                      <div>{ready && <div>Upload</div>}</div>
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
                                onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      panCard: res[0].url,
                                    }));
                                    toast.success("Upload Completed");
                                  }
                                }}
                                onUploadError={(error) => {
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
                                      <div>{ready && <div>Upload</div>}</div>
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
                                onBeforeUploadBegin={(files) => {
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/png",
                                  "image/jpg",
                                ];

                                for (const file of files) {
                                  if (!allowedTypes.includes(file.type)) {
                                    toast.error("Only PDF, JPG, and PNG files are allowed!");
                                    throw new Error("Invalid file type");
                                  }
                                }

                                return files; // continue upload if valid
                              }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      employeeIdCard: res[0].url,
                                    }));
                                    toast.success("Upload Completed");
                                  }
                                }}
                                onUploadError={(error) => {
                                  toast.error(`ERROR! ${error.message}`);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className={` px-8 py-3 rounded-xl font-semibold transition-colors ${
                    currentStep === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-[#243460] hover:bg-gray-300"
                  }`}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>

                <div className="flex gap-4">
                  {currentStep < totalSteps && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-gray-200 text-[#243460] hover:bg-gray-300 font-semibold px-8 py-3 rounded-xl transition-colors"
                    >
                      Next
                    </button>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="submit"
                      className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save & Continue"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                    >
                      Preview & Submit
                    </button>
                  )}
                </div>
              </div>
            </form>
          ) : (
            <Preview formData={formData} onCancel={handleCancelPreview} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletePatientProfile;
