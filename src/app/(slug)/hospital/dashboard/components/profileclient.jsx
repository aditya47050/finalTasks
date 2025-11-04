"use client";
import { ArrowDown, CalendarDays, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import HospitalPreview from "./HospitalPreview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  FiAward,
  FiFileText,
  FiHash,
  FiPhoneCall,
  FiHome,
} from "react-icons/fi";
import TermsAndConditionOnSubmission from "@/app/components/termsandcondition";
import { FaHospital, FaClinicMedical, FaFileAlt, FaVideo, FaUserNurse, FaAmbulance, FaPills, FaVials, FaXRay, FaMoneyCheckAlt, FaUniversity, FaUtensils } from "react-icons/fa"
import { FaCertificate, FaCalendarAlt, FaCheckCircle, FaAward, FaLayerGroup, FaGlobe } from "react-icons/fa"
import { MdCategory } from "react-icons/md"
import { AiOutlineFileExcel } from "react-icons/ai";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import "react-toastify/dist/ReactToastify.css";
import { UploadButton } from "@uploadthing/react";
import Image from "next/image";

import { useRouter } from 'next/navigation';

// Razorpay script is loaded once for the patient AND hospital flows in _app.js or via effect below

const HospitalProfile = ({
  userdata,
  hspcategory,
  state,
  dist,
  subdist,
  diagnosticcategory,
}) => {
  const role = userdata.role;
  const router = useRouter();
  // Inject Razorpay script (like in patient profile, only if not loaded)
  React.useEffect(() => {
    const existingScript = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  const finalHospitalSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/hospital/${userdata.id}/finalsubmit`, {
        method: "PUT"
      });
      setIsLoading(false);
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Could not finalize hospital registration: ${errorData.error}`);
        return;
      }
      const updatedHospital = await res.json();
      toast.success("Registration Complete!");
      // Redirect or reload as desired
    } catch (e) {
      setIsLoading(false);
      toast.error(`Final registration failed: ${e.message}`);
    }
  };



  // Final Preview & Submit logic for hospital registration with payment check
  const handleFinalHospitalSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Check if already paid
      const isPaid = Array.isArray(userdata.HospitalPayment)
        ? userdata.HospitalPayment.some(
            (p) =>
              p.forwhat === "Yearly Subscription Fee" &&
              p.paymentStatus === "SUCCESS"
          )
        : false;
      if (isPaid) {
        await finalHospitalSubmit();
        router.push("/hospital/dashboard/certificate");
        return;
      }
      // 2. Not paid? Initiate payment
      // Razorpay script is already loaded above
      // 3. Create order
      const orderRes = await fetch("/api/hospital/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId: userdata.id })
      });
      const { order } = await orderRes.json();
      console.log("Order Response:", order); // Log order response
      if (!order) throw new Error("Failed to create Razorpay order");
      // 4. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Hospital Registration",
        description: "Yearly Registration Fee",
        order_id: order.id,
        handler: async function (response) {
          // Step 5. Verify
          const verifyRes = await fetch("/api/hospital/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              hospitalId: userdata.id,
              amount: order.amount,
              role: userdata.role || "Hospital"
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Payment Successful. Submitting registration...");
            
            await finalHospitalSubmit();
          } else {
            toast.error("Payment verification failed.");
          }
          setIsLoading(false);
        },
        prefill: {
          email: userdata.email
        },
        theme: { color: "#5271FF" },
      };
      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      toast.error("Final submit failed: " + (err?.message || err));
      setIsLoading(false);
    }
  };
  const categoryList =
    role === "DiagnosticCenter" ? diagnosticcategory : hspcategory;
  const formatDate = (date) => {
    if (!date) return ""; // Return an empty string if date is invalid

    const day = date.getDate().toString().padStart(2, "0"); // Get day and pad with 0 if needed
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Return formatted date
  };

  const [email, setEmail] = useState(userdata.email);

  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadComplete, setUploadComplete] = useState(false); // State to track upload status
  const [isAgreed, setIsAgreed] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [isCashlessDropdownOpen, setIsCashlessDropdownOpen] = useState(false);
  const [isGovDropdownOpen, setIsGovDropdownOpen] = useState(false);
  const totalSteps = 3;
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
  const [formData, setFormData] = useState({
    email: "",
    regname: "",
    hspcategory: [],
    totalnoofbed: "",
    totalspeciality: "",
    totaldoctor: "",
    totalambulance: "", // Use null for DateTime to indicate no value
    onlineconsultation: "",
    homehealthcare: "",
    hspbranches: "",
    pharmacy: "",
    pathology: "",
    diagnosticservices: "",
    cashlessservices: [],
    governmentschemes: [],
    inhousecanteen: "",
    hsplogo: "",
    hspregno: "",
    hspregcertificate: "",
    hspregdate: "",
    nabhnablapproved: "",
    nabhnablcertificate: "",
    nabhnabllevel: " ",
    pancardno: "",
    pancardimg: "",
    isoapproved: "",
    bankname: "",
    bankaccountno: "",
    ifsccode: "",
    accounttype: "",
    cancelledcheque: "",
    micrcode: "",
    address: "",
    city: "",
    state: "",
    dist: "",
    taluka: "",
    pincode: "",
    receptioncontact1: "",
    receptioncontact2: "",
    receptionemail: "",
    managername: "",
    managercontact: "",
    manageremail: "",
    adminname: "",
    admincontact: "",
    adminemail: "",
    escalationmatrixsheet: "",
    alternateno: "",
    branchname: "",
    branchregno: "",
    branchcity: "",
    branchpincode: "",
    branchreceptionno1: "",
    branchreceptionno2: "",
    branchreceptionemail: "",
    branchaddress: "",
    branchmanagername: "",
    branchmanagerno: "",
    branchmanageremail: "",
    branchadminname: "",
    branchadminno: "",
    branchadminemail: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleMultiSelectChange = (event, field) => {
    const { value, checked } = event.target;

    setFormData((prevState) => {
      const prevValues = Array.isArray(prevState[field])
        ? prevState[field]
        : [];
      const updatedList = checked
        ? [...prevValues, value] // Add value if checked
        : prevValues.filter((item) => item !== value); // Remove if unchecked

      return { ...prevState, [field]: updatedList };
    });
  };

  const handleMultiCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prev) => {
      const updatedSelection = checked
        ? [...prev.hspcategory, value] // Add to array if checked
        : prev.hspcategory.filter((item) => item !== value); // Remove if unchecked

      return { ...prev, hspcategory: updatedSelection };
    });
  };
  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      hspregdate: date, // Update form data with the selected date
    }));
  };
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pancardno" || name === "ifsccode") {
      const filteredValue = value.replace(/[^a-zA-Z0-9]/g, ""); // only A-Z, a-z, 0-9
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
      return;
    }
    // ✅ Email validation for specific fields
    if (["receptionemail", "manageremail", "adminemail"].includes(name)) {
      // Allow normal typing
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }
    // ✅ Restrict MICR code to max 9 digits only
    if (name === "micrcode") {
      const numericValue = value.replace(/[^0-9]/g, ""); // only digits
      if (numericValue.length <= 9) {
        setFormData((prev) => ({ ...prev, micrcode: numericValue }));
      }
      return;
    }
    // Handle incomeinlakh and incomeinthousand updates inside incomerange
    if (name === "incomeinlakh" || name === "incomeinthousand") {
      setFormData((prev) => ({
        ...prev,
        incomerange: {
          ...prev.incomerange, // Preserve existing incomerange values
          [name === "incomeinlakh" ? "lakh" : "thousand"]: value,
        },
      }));
      return; // Exit early to prevent unnecessary state updates
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      // Filter districts based on selected state
      const selectedState = state.find((state) => state.stateName === value);
      const districts = dist.filter(
        (district) => district.stateId === selectedState.id
      );
      setFilteredDistricts(districts);
      setFilteredSubDistricts([]); // Reset sub-districts
      setFormData((prev) => ({
        ...prev,
        dist: "",
        taluka: "",
        state: selectedState.stateName, // Save the state name
      }));
    }

    if (name === "district") {
      // Filter sub-districts based on selected district
      const selectedDistrict = dist.find(
        (district) => district.district === value
      );
      const subDistricts = subdist.filter(
        (subDistrict) => subDistrict.districtId === selectedDistrict.id
      );
      setFilteredSubDistricts(subDistricts);
      setFormData((prev) => ({
        ...prev,
        taluka: "",
        dist: selectedDistrict.district, // Save the district name
      }));
    }

    if (name === "taluka") {
      // Update the taluka value with the selected taluka name
      setFormData((prev) => ({
        ...prev,
        taluka: value, // Save the taluka name
      }));
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
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
      const res = await fetch("/api/send-otp", {
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
      toast.error("Something went wrong: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  const cashlessServicesOptions = [
    {
      category: "Insurance Company",
      subCategory: "National Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Go Digit General Insurance Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Bajaj Allianz General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Cholamandalam MS General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Bharti AXA General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "HDFC ERGO General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Future Generali India Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "The New India Assurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "IffcoTokio General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Reliance General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Royal Sundaram General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "The Oriental Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Tata AIG General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "SBI General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Acko General Insurance Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Navi General Insurance Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Edelweiss General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "ICICI Lombard General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Kotak Mahindra General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Liberty General Insurance Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Magma HDI General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Raheja QBE General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Shriram General Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "United India Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Manipal Cigna Health Insurance Company Limited",
    },
    {
      category: "Insurance Company",
      subCategory: "Aditya Birla Health Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Star Health & Allied Insurance Co. Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Max Bupa Health Insurance Company Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Care Health Insurance Ltd.",
    },
    {
      category: "Insurance Company",
      subCategory: "Universal Sompo General Insurance Co. Ltd.",
    },

    // TPA Companies
    {
      category: "TPA (Third Party Administration)",
      subCategory: "United Health Care Parekh Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Medi Assist Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "MDIndia Health Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Anyuta Insurance TPA In Health Care Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Vidal Health Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Genins India Insurance TPA Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Medsave Health Insurance TPA Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "East West Assist Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Raksha Health Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Paramount Health Services & Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Family Health Plan Insurance TPA Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Heritage Health Insurance TPA Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Health India Insurance TPA Services Private Limited",
    },
    {
      category: "TPA (Third Party Administration)",
      subCategory: "Alankit Insurance TPA Limited",
    },

    // Government Health Insurance
    {
      category: "Government Health Insurance",
      subCategory: "Aam Aadmi Bima Yojana",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Central Government Health Scheme",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Pradhan Mantri Suraksha Bima Yojana",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Chief Minister's Comprehensive Health Insurance Scheme",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Universal Health Insurance Scheme (UHIS)",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Bhamashah Swasthya Bima Yojana",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Yeshasvini Health Insurance Scheme",
    },
    {
      category: "Government Health Insurance",
      subCategory: "West Bengal Health Scheme",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Mukhyamantri Amrutum Yojana",
    },
    {
      category: "Government Health Insurance",
      subCategory:
        "Ayushman Bharat Mahatma Gandhi Rajasthan Swasthya Bima Yojana",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Employment State Insurance Scheme (ESIC)",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Ayushman Bharat Yojana (PMJAY)",
    },
    {
      category: "Government Health Insurance",
      subCategory: "Janshree Bima Yojana",
    },
  ];

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const verifyRes = await fetch("/api/verify-otp", {
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
  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "email",
      "regname",

      "hspregno",
      "onlineconsultation",
      "homehealthcare",
      "totalambulance",
      "pharmacy",
      "pathology",
      "diagnosticservices",
      "cashlessservices",
      "governmentschemes",
      "inhousecanteen",
      "totalambulance",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill the details: ${field}`);
        return;
      }
    }
    // Disable submit button and show loading spinner while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();

    // Add email and other form data fields
    formPayload.append("email", formData.email);
    formPayload.append("regname", formData.regname || "");
    const hspcategoryArray = Array.isArray(formData.hspcategory)
      ? formData.hspcategory
      : formData.hspcategory
        ? [formData.hspcategory] // Wrap in an array if it's a single value
        : [];

    hspcategoryArray.forEach((type) => {
      formPayload.append("hspcategory[]", type);
    });
    formPayload.append("hspregno", formData.hspregno || "");
    formPayload.append("totalambulance", formData.totalambulance || "");
    formPayload.append("onlineconsultation", formData.onlineconsultation || "");
    formPayload.append("homehealthcare", formData.homehealthcare || "");
    formPayload.append("pharmacy", formData.pharmacy || "");
    formPayload.append("pathology", formData.pathology || "");
    formPayload.append("diagnosticservices", formData.diagnosticservices || "");
    formPayload.append("cashlessservices", formData.cashlessservices || "");
    formPayload.append("governmentschemes", formData.governmentschemes || "");
    formPayload.append("inhousecanteen", formData.inhousecanteen || "");

    try {
      // Make the API request to submit the form
      const registerRes = await fetch(`/api/hospital/${userdata.id}/hspinfo`, {
        method: "PUT",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to Update the form.");
      }

      // Success: show success alert and reset form
      toast.success("Information Updated successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  const handlehspdetails = async (e) => {
    e.preventDefault();

    const requiredFieldsStep2 = [
    "hsplogo",
    "hspregcertificate",
    "hspregdate",
    "nabhnablapproved",
    "nabhnablcertificate",
    "nabhnabllevel",
    "pancardno",
    "pancardimg",
    "isoapproved",
    "bankname",
    "bankaccountno",
    "ifsccode",
    "accounttype",
    "cancelledcheque",
    "micrcode",
  ];
  for (const field of requiredFieldsStep2) {
    if (!formData[field]) {
      toast.error(`Please fill the details: ${field}`);
      return;
    }
    // For file fields, ensure they are not empty strings
    if (["hsplogo", "hspregcertificate", "nabhnablcertificate", "pancardimg", "cancelledcheque"].includes(field) && !formData[field].trim()) {
      toast.error(`Please upload the required file for: ${field}`);
      return;
    }
  }
    // Disable submit button and show loading spinner while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("hsplogo", formData.hsplogo || "");
    formPayload.append("hspregcertificate", formData.hspregcertificate || "");
    formPayload.append("hspregdate", formData.hspregdate || "");
    formPayload.append("nabhnablapproved", formData.nabhnablapproved || "");
    formPayload.append("nabhnablcertificate", formData.nabhnablcertificate || "");
    formPayload.append("nabhnabllevel", formData.nabhnabllevel || " ");
    formPayload.append("pancardno", formData.pancardno || "");
    formPayload.append("pancardimg", formData.pancardimg || "");
    formPayload.append("isoapproved", formData.isoapproved || "");
    formPayload.append("bankname", formData.bankname || "");
    formPayload.append("bankaccountno", formData.bankaccountno || "");
    formPayload.append("ifsccode", formData.ifsccode || "");
    formPayload.append("accounttype", formData.accounttype || "");
    formPayload.append("cancelledcheque", formData.cancelledcheque || "");
    formPayload.append("micrcode", formData.micrcode || "");

    try {
      // Make the API request to submit the form
      const registerRes = await fetch(
        `/api/hospital/${userdata.id}/hspdetails`,
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
      toast.success("Information Updated successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  const handleSubmitHspContact = async (e) => {
    e.preventDefault();

    const requiredFieldsStep3 = [
    "address",
    "city",
    "state",
    "dist",  // Using "dist" as per formData state
    "taluka",
    "pincode",
    "receptioncontact1",
    "receptioncontact2",
    "receptionemail",
    "managername",
    "managercontact",
    "manageremail",
    "adminname",
    "admincontact",
    "adminemail",
    "escalationmatrixsheet",
    "alternateno",
  ];
  for (const field of requiredFieldsStep3) {
    if (!formData[field]) {
      toast.error(`Please fill the details: ${field}`);
      return;
    }
    // For file fields
    if (field === "escalationmatrixsheet" && !formData[field].trim()) {
      toast.error(`Please upload the required file for: ${field}`);
      return;
    }
  }
    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();



    formPayload.append("address", formData.address || "");
    formPayload.append("city", formData.city || "");
    formPayload.append("state", formData.state || "");
    formPayload.append("dist", formData.dist || "");
    formPayload.append("taluka", formData.taluka || "");
    formPayload.append("pincode", formData.pincode || "");
    formPayload.append("receptioncontact1", formData.receptioncontact1 || "");
    formPayload.append("receptioncontact2", formData.receptioncontact2 || "");
    formPayload.append("receptionemail", formData.receptionemail || "");
    formPayload.append("managername", formData.managername || "");
    formPayload.append("managercontact", formData.managercontact || "");
    formPayload.append("manageremail", formData.manageremail || "");
    formPayload.append("adminname", formData.adminname || "");
    formPayload.append("admincontact", formData.admincontact || "");
    formPayload.append("adminemail", formData.adminemail || "");
    formPayload.append("escalationmatrixsheet", formData.escalationmatrixsheet || "");
    formPayload.append("alternateno", formData.alternateno || "");
    try {
      // Make the API request to submit the form
      const registerRes = await fetch(
        `/api/hospital/${userdata.id}/hspcontact`,
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
      toast.success("HSP Contact Information Updated successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  const Preview = ({ formData }) => {
      useEffect(() => {
        if (!formData?.hsplogo) {
          toast.error("Please go back and upload a profile photo.");
        }
      }, [formData?.hsplogo]);
  
      return (
        <div className="space-y-6">
          <HospitalPreview
              hospitalData={formData}
              onSubmit={finalHospitalSubmit}
              onPayment={handleFinalHospitalSubmit}
              onReferPatient={() => alert("Refer Patient Clicked")}
              isLoading={isLoading}
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
  
            {formData.hsplogo && (
              <button
                className="px-6 py-3 bg-[#5271FF] rounded-xl disabled:bg-blue-300 text-white hover:bg-[#4161ef] focus:outline-none flex items-center space-x-2"
                onClick={handleFinalHospitalSubmit}
                disabled={!isAgreed}
              >
                {userdata?.approvalStatus !== "APPROVED" ? (
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
  useEffect(() => {
    // Fetch or load any data that needs to prepopulate the form here
    const setFormDataOnMount = () => {
      // Example: If you had initial form data or fetched from an API, you could set it here
      const selectedhspcategory =
        role === "DiagnosticCenter"
          ? diagnosticcategory.find(
            (type) => type.id === userdata.hspcategoryId
          )
          : hspcategory.find((type) => type.id === userdata.hspcategoryId);
      const fetchedData = {
        email: userdata.email || "",
        mobile: userdata.mobile || "",
        regname: userdata.hspInfo?.regname || "",
        hspcategory: selectedhspcategory ? selectedhspcategory.title : "",
        totalnoofbed: userdata.hspInfo?.totalnoofbed || "",
        totalspeciality: userdata.hspInfo?.totalspeciality || "",
        totaldoctor: userdata.hspInfo?.totaldoctor || "",
        totalambulance: userdata.hspInfo?.totalambulance || "",
        onlineconsultation: userdata.hspInfo?.onlineconsultation || "",
        homehealthcare: userdata.hspInfo?.homehealthcare || "",
        hspbranches: userdata.hspInfo?.hspbranches || "",
        pharmacy: userdata.hspInfo?.pharmacy || "",
        pathology: userdata.hspInfo?.pathology || "",
        diagnosticservices: userdata.hspInfo?.diagnosticservices || "",
        cashlessservices: userdata.hspInfo?.cashlessservices || "",
        governmentschemes: userdata.hspInfo?.governmentschemes || "",
        inhousecanteen: userdata.hspInfo?.inhousecanteen || "",
        hsplogo: userdata.hspdetails?.hsplogo || "",
        hspregno: userdata.hspdetails?.hspregno || "",
        hspregcertificate: userdata.hspdetails?.hspregcertificate || "",
        hspregdate: userdata.hspdetails?.hspregdate || "",
        nabhnablapproved: userdata.hspdetails?.nabhnablapproved || "",
        nabhnablcertificate: userdata.hspdetails?.nabhnablcertificate || "",
        nabhnabllevel: userdata.hspdetails?.nabhnabllevel || " ", // Default to space if missing
        pancardno: userdata.hspdetails?.pancardno || "",
        pancardimg: userdata.hspdetails?.pancardimg || "",
        isoapproved: userdata.hspdetails?.isoapproved || "",
        bankname: userdata.hspdetails?.bankname || "",
        bankaccountno: userdata.hspdetails?.bankaccountno || "",
        ifsccode: userdata.hspdetails?.ifsccode || "",
        accounttype: userdata.hspdetails?.accounttype || "",
        cancelledcheque: userdata.hspdetails?.cancelledcheque || "",
        micrcode: userdata.hspdetails?.micrcode || "",
        address: userdata.hspcontact?.address || "",
        city: userdata.hspcontact?.city || "",
        state: userdata.hspcontact?.state || "",
        dist: userdata.hspcontact?.dist || "",
        taluka: userdata.hspcontact?.taluka || "",
        pincode: userdata.hspcontact?.pincode || "",
        receptioncontact1: userdata.hspcontact?.receptioncontact1 || "",
        receptioncontact2: userdata.hspcontact?.receptioncontact2 || "",
        receptionemail: userdata.hspcontact?.receptionemail || "",
        managername: userdata.hspcontact?.managername || "",
        managercontact: userdata.hspcontact?.managercontact || "",
        manageremail: userdata.hspcontact?.manageremail || "",
        adminname: userdata.hspcontact?.adminname || "",
        admincontact: userdata.hspcontact?.admincontact || "",
        adminemail: userdata.hspcontact?.adminemail || "",
        escalationmatrixsheet: userdata.hspcontact?.escalationmatrixsheet || "",
        alternateno: userdata.hspcontact?.alternateno || "",
      };

      // Set the fetched data in the form state
      setFormData((prevState) => ({
        ...prevState,
        ...fetchedData,
      }));
    };

    // Call the function to set form data
    setFormDataOnMount();
  }, [hspcategory, diagnosticcategory]);
  const [showPreview, setShowPreview] = useState(false);

  // Define the handlePreview function
  const handlePreview = () => {
    setShowPreview(true);
  };
  const handleCancelPreview = () => {
    setShowPreview(false);
  };
  return (
    <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 xs:py-4 lg:py-8">
          <div className="max-w-6xl mx-auto xs:px-2 md:px-4">
            {" "}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#243460] mb-2">
                {role + " Profile Information"}
              </h1>
              <p className="text-[#5271FF] text-lg">Complete your profile with all required details</p>
            </div>{" "}
            <div className="mb-8">
              <div className="flex xs:justify-evenly lg:justify-between items-center">
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
              {/* <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-[#5271FF]">
                  {stepTitles[currentStep - 1]}
                </h2>
              </div> */}
            </div>
            {/* Main Div container */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-8">
              {!showPreview ? (
                <>
                <form onSubmit={handleSubmit} >
                  <div>
                    {/* 1st step form */}
                    {currentStep === 1 && (
                      <div className="">
                        <div className="space-y-6  font-poppins md:pt-2">
                          <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiPhone className="text-[#5271FF]" />
                                Mobile Number*
                              </label>
                              <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Mobile Number"
                              //required
                              />
                            </div>
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
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                  placeholder={userdata.email}
                                  disabled
                                ////required
                                />
                                <Button
                                  type="button"
                                  onClick={handleSendOtp}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                                >
                                  {isLoading && !isOtpSent
                                    ? "wait!"
                                    : isOtpSent
                                      ? "Sent"
                                      : "Send OTP"}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiLock className="text-[#5271FF]" />
                                Enter OTP
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name="otp"
                                  value={otp}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    // Allow only numbers and limit to 6 digits
                                    if (/^\d{0,6}$/.test(inputValue)) {
                                      setOtp(inputValue);
                                    }
                                  }}
                                  className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                  placeholder="Enter OTP"
                                //required
                                />
                                <Button
                                  type="button"
                                  onClick={handleVerifyOtp}
                                  disabled={isSubmitting}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                                >
                                  {isLoading && isOtpSent && !isOtpVerified
                                    ? "wait!"
                                    : isOtpVerified
                                      ? "Verified"
                                      : "Verify OTP"}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaHospital className="text-[#5271FF]" />
                                HSP Reg. Name*
                              </label>
                              <input
                                type="text"
                                name="regname"
                                value={formData.regname}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Reg Name"
                              //required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <MdCategory className="text-[#5271FF]" />
                                HSP Category*:
                              </label>
                              <div className="relative">
                                {/* Clickable Select Box */}
                                <div
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white flex items-center"
                                  onClick={toggleDropdown}
                                >
                                  {/* Fixed-height container with vertical scroll */}
                                  <div className="flex-1 max-h-8 overflow-y-auto flex flex-wrap items-center gap-1 text-black">
                                    {formData.hspcategory.length > 0 ? (
                                      formData.hspcategory.map((item, index) => (
                                        <span
                                          key={index}
                                          className="bg-gray-200 text-black px-2 py-1 rounded-md text-xs"
                                        >
                                          {item}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-gray-400">
                                        Select Category
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Dropdown with Checkboxes */}
                                <div className="relative">
                                  {/* Selected Heading */}

                                  {/* Dropdown Section */}
                                  {isDropdownOpen && (
                                    <div className="absolute w-full max-h-40 overflow-y-auto bg-white border border-[#243460] mt-1 rounded-xl shadow-lg z-50">
                                      <>
                                        <div className="p-1">
                                          <h2 className="text-lg font-semibold text-[#243460] mb-1">
                                            Selected
                                          </h2>
                                          {userdata.hspInfo?.hspcategory?.length >
                                            0 ? (
                                            <ul>
                                              {userdata.hspInfo.hspcategory.map(
                                                (category, index) => {
                                                  const categoryName =
                                                    role === "DiagnosticCenter"
                                                      ? category.diagnosticcategory
                                                        ?.title
                                                      : category.hspcategory?.title;

                                                  return (
                                                    <li
                                                      key={index}
                                                      className="py-1 text-black"
                                                    >
                                                      {categoryName || "N/A"}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          ) : (
                                            <p className="px-3 py-2 text-gray-500">
                                              N/A
                                            </p>
                                          )}
                                        </div>

                                        {/* Mapping Speciality Type Checkboxes */}
                                        {categoryList.map((c) => (
                                          <label
                                            key={c.id}
                                            className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                          >
                                            <input
                                              type="checkbox"
                                              value={c.title}
                                              checked={formData.hspcategory.includes(
                                                c.title
                                              )}
                                              onChange={handleMultiCheckboxChange}
                                              className="mr-2"
                                            />
                                            <span className="text-black">
                                              {c.title}
                                            </span>
                                          </label>
                                        ))}
                                      </>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaFileAlt className="text-[#5271FF]" />
                                HSP Reg. Number*
                              </label>
                              <input
                                name="hspregno"
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Number"
                                //required
                                value={formData.hspregno}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaVideo className="text-[#5271FF]" />
                                Online Consultation*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  name="onlineconsultation"
                                  value={formData.onlineconsultation}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      onlineconsultation: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Yes/no</option>
                                  <option value="yes" >
                                    Yes
                                  </option>
                                  <option value="no" >
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaUserNurse className="text-[#5271FF]" />
                                Home Healthcare*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  name="homehealthcare"
                                  value={formData.homehealthcare}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      homehealthcare: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Yes/no</option>
                                  <option value="yes" className="text-black">
                                    Yes
                                  </option>
                                  <option value="no" className="text-black">
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaAmbulance className="text-[#5271FF]" />
                                Total Ambulance*
                              </label>
                              <div className="relative">
                                <input
                                  name="totalambulance"
                                  value={formData.totalambulance}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      totalambulance: e.target.value,
                                    })
                                  }
                                  type="text"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Enter Count"
                                //required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaPills className="text-[#5271FF]" />
                                Pharmacy*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="pharmacy"
                                  value={formData.pharmacy}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      pharmacy: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Yes/No</option>
                                  <option value="yes">
                                    Yes
                                  </option>
                                  <option value="no">
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaVials className="text-[#5271FF]" />
                                Pathology*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="pathology"
                                  value={formData.pathology}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      pathology: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Yes/No</option>
                                  <option value="yes">
                                    Yes
                                  </option>
                                  <option value="no">
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaXRay className="text-[#5271FF]" />
                                Diagnostic Services*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="diagnosticservices"
                                  value={formData.diagnosticservices}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      diagnosticservices: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Services</option>
                                  <option value="yes">
                                    Yes
                                  </option>
                                  <option value="no">
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaMoneyCheckAlt className="text-[#5271FF]" />
                                Cashless Services
                              </label>
                              <div className="relative">
                                {/* Select Box (Click to open dropdown) */}
                                <div
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white flex items-center"
                                  onClick={() =>
                                    setIsCashlessDropdownOpen(!isCashlessDropdownOpen)
                                  }
                                >
                                  <div className="flex-1 max-h-8 overflow-y-auto flex flex-wrap items-center gap-1 text-black">
                                    {Array.isArray(formData.cashlessservices) ? (
                                      formData.cashlessservices.map((item, index) => (
                                        <span
                                          key={index}
                                          className="bg-gray-200 text-black px-2 py-1 rounded-md text-xs"
                                        >
                                          {item}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-gray-400">
                                        Select Services
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Dropdown Section */}
                                {isCashlessDropdownOpen && (
                                  <div className="absolute w-full max-h-40 overflow-y-auto bg-white border border-[#243460] mt-1 rounded-xl shadow-lg z-50">
                                    {cashlessServicesOptions
                                      .filter(
                                        (item) =>
                                          item.category !==
                                          "Government Health Insurance"
                                      ) // Exclude Government Schemes
                                      .map((item) => (
                                        <label
                                          key={item.subCategory}
                                          className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            value={item.subCategory}
                                            checked={formData.cashlessservices.includes(
                                              item.subCategory
                                            )}
                                            onChange={(e) =>
                                              handleMultiSelectChange(
                                                e,
                                                "cashlessservices"
                                              )
                                            }
                                            className="mr-2"
                                          />
                                          <span className="text-black">
                                            {item.subCategory}
                                          </span>
                                        </label>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaUniversity className="w-4 h-4 text-[#5271FF]" />
                                Government Schemes*
                              </label>
                              <div className="relative">
                                {/* Select Box */}
                                <div
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white flex items-center"
                                  onClick={() =>
                                    setIsGovDropdownOpen(!isGovDropdownOpen)
                                  }
                                >
                                  <div className="flex-1 max-h-8 overflow-y-auto flex flex-wrap items-center gap-1 text-black">
                                    {(Array.isArray(formData.governmentschemes)
                                      ? formData.governmentschemes
                                      : []
                                    ).length > 0 ? (
                                      (Array.isArray(formData.governmentschemes)
                                        ? formData.governmentschemes
                                        : []
                                      ).map((item, index) => (
                                        <span
                                          key={index}
                                          className="bg-gray-200 text-black px-2 py-1 rounded-md text-xs"
                                        >
                                          {item}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-gray-400">
                                        Select Services
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Dropdown Section */}
                                {isGovDropdownOpen && (
                                  <div className="absolute w-full max-h-40 overflow-y-auto bg-white border border-[#243460] mt-1 rounded-xl shadow-lg z-50">
                                    {cashlessServicesOptions
                                      .filter(
                                        (item) =>
                                          item.category ===
                                          "Government Health Insurance"
                                      )
                                      .map((item) => (
                                        <label
                                          key={item.subCategory}
                                          className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            value={item.subCategory}
                                            checked={formData.governmentschemes.includes(
                                              item.subCategory
                                            )}
                                            onChange={(e) =>
                                              handleMultiSelectChange(
                                                e,
                                                "governmentschemes"
                                              )
                                            }
                                            className="mr-2"
                                          />
                                          <span className="text-black">
                                            {item.subCategory}
                                          </span>
                                        </label>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaUtensils className="text-[#5271FF]" />
                                In-House Canteen*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="inhousecanteen"
                                  value={formData.inhousecanteen}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      inhousecanteen: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Yes/No</option>
                                  <option value="yes" >
                                    Yes
                                  </option>
                                  <option value="no" >
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between gap-4 mt-8">
                          <button
                            className={` px-8 py-3 rounded-xl font-semibold transition-colors ${currentStep === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-[#243460] hover:bg-gray-300"
                              }`}
                            onClick={prevStep}
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
                                className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                                type="submit"
                              >
                                {isLoading
                                  ? "Submitting, Please Wait..."
                                  : "Save Form"}
                              </button>
                            ) : (
                              <button
                                className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                                type="button"
                                onClick={handleFinalHospitalSubmit}
                                disabled={isLoading}
                              >
                                {isLoading ? "Submitting..." : "Preview & Submit"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
                <form onSubmit={handlehspdetails} >
                  <div>
                    {/* 2nd step form */}
                    {currentStep === 2 && (
                      <div className="md:mx-0 xl:mt-0 mt-10 mx-2 font-poppins">
                        <div className="space-y-6  ">
                          <div className="flex flex-wrap space-y-0 md:space-y-0 md:flex-nowrap md:space-x-4">
                            <div className="w-full flex flex-col items-end text-end justify-end">
                              <div className="flex items-center space-x-4">
                                <div className="flex flex-col gap-2">
                                  <label className="text-[#243460] font-semibold flex items-center justify-end gap-2">
                                    <FaHospital className="text-[#5271FF]" />
                                    HSP Logo*
                                  </label>
                                  {/* <label className="w-auto xl:h-9 md:h-8 h-7 px-4 border xl:text-[14px] md:text-[11px] text-[10px] bg-[#002e6e] text-white font-bold rounded-full flex items-center justify-center cursor-pointer">
                                Upload Photo Here */}

                                  <UploadButton
                                    endpoint="fileUploader"
                                    content={{
                                      button({ ready }) {
                                        return (
                                          <div>
                                            {ready
                                              ? uploadComplete
                                                ? "Uploaded" // Button text after upload completes
                                                : "Upload Logo Here"
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
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          hsplogo: res[0].url, // Ensure res structure matches
                                        }));
                                        setUploadComplete(true); // Set the upload as complete
                                        toast.success("Upload Completed");
                                      }
                                    }}
                                    onUploadError={(error) => {
                                      toast.error(`ERROR! ${error.message}`);
                                    }}
                                  />

                                  {/* </label> */}
                                </div>
                                <div className="bg-[#2b73ec] rounded-xl flex items-center justify-center">
                                  {userdata.hspdetails?.hsplogo ? (
                                    <Image
                                      src={formData.hsplogo}
                                      height={100}
                                      width={100}
                                      alt=""
                                      className="h-16 w-16 xl:h-20 xl:w-20"
                                    />
                                  ) : (
                                    <User
                                      className="h-16 w-16 xl:h-20 xl:w-20"
                                      color="#fff"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6 mt-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaCertificate className="text-[#5271FF]" />
                                HSP Reg. Certificate*
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="hspregcertificate"
                                  id="hspregcertificate"
                                  className="hidden"
                                //required
                                />
                                <label
                                  htmlFor="hspregcertificate"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.hspdetails?.hspregcertificate ||
                                      formData.hspregcertificate
                                      ? "Uploaded Already"
                                      : "Upload Document"}
                                  </span>

                                  <UploadButton
                                    endpoint="fileUploader"
                                    content={{
                                      button({ ready }) {
                                        return (
                                          <div>{ready && <div> Upload</div>}</div>
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
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          hspregcertificate: res[0].url, // Ensure res structure matches
                                        }));
                                        setUploadComplete(true); // Set the upload as complete
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
                                <FaCalendarAlt className="text-[#5271FF]" />
                                HSP Reg. Date*
                              </label>
                              <div className="relative">
                                <DatePicker
                                  selected={formData.hspregdate}
                                  onChange={handleDateChange}
                                  dateFormat="dd/MM/yyyy" // Change to month/year format
                                  showYearDropdown
                                  yearDropdownItemNumber={100}
                                  scrollableYearDropdown
                                  placeholderText="DD/MM/YYYY"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  style={{ paddingRight: "2.5rem" }}
                                  maxDate={new Date()} // Disable next years
                                  showMonthDropdown // Add this to allow month selection
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <CalendarDays className="h-5 w-5" />
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaCheckCircle className="text-[#5271FF]" />
                                NABH/NABL Approved*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="nabhnablapproved"
                                  value={formData.nabhnablapproved}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      nabhnablapproved: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Yes/No</option>
                                  <option value="yes" >
                                    Yes
                                  </option>
                                  <option value="no" >
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaAward className="text-[#5271FF]" />
                                NABH/NABL Certificate*
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="nabhnablcertificate"
                                  id="nabhnablcertificate"
                                  className="hidden"
                                //required
                                />
                                <label
                                  htmlFor="nabhnablcertificate"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.hspdetails?.nabhnablcertificate ||
                                      formData.nabhnablcertificate
                                      ? "Uploaded Already"
                                      : "Upload Document"}
                                  </span>

                                  <UploadButton
                                    endpoint="fileUploader"
                                    content={{
                                      button({ ready }) {
                                        return (
                                          <div>{ready && <div> Upload</div>}</div>
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
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          nabhnablcertificate: res[0].url, // Ensure res structure matches
                                        }));
                                        setUploadComplete(true); // Set the upload as complete
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
                                <FaLayerGroup className="text-[#5271FF]" />
                                NABH/NABL Level*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="nabhnabllevel"
                                  value={formData.nabhnabllevel}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      nabhnabllevel: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Level</option>
                                  <option value="" ></option>
                                  <option value="" ></option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiCreditCard className="text-[#5271FF]" />
                                PAN Card*
                              </label>
                              <input
                                name="pancardno"
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter PAN Number"
                                //required
                                value={formData.pancardno}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiFile className="text-[#5271FF]" />
                                PAN Card Upload*
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="pancardimg"
                                  id="pancardimg"
                                  className="hidden"
                                //required
                                />
                                <label
                                  htmlFor="pancardimg"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.hspdetails?.pancardimg ||
                                      formData.pancardimg
                                      ? "Uploaded Already"
                                      : "Upload Document"}
                                  </span>

                                  <UploadButton
                                    endpoint="fileUploader"
                                    content={{
                                      button({ ready }) {
                                        return (
                                          <div>{ready && <div> Upload</div>}</div>
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
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          pancardimg: res[0].url, // Ensure res structure matches
                                        }));
                                        setUploadComplete(true); // Set the upload as complete
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
                                <FaGlobe className="text-[#5271FF]" />
                                ISO Approved*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="isoapproved"
                                  value={formData.isoapproved}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      isoapproved: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Selec Yes/No</option>
                                  <option value="yes" >
                                    Yes
                                  </option>
                                  <option value="no" >
                                    No
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiBriefcase className="text-[#5271FF]" />
                                Bank Name*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  name="bankname"
                                  value={formData.bankname}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Bank</option>
                                  <option value="state_bank_of_india">
                                    State Bank of India
                                  </option>
                                  <option value="bank_of_baroda">
                                    Bank of Baroda
                                  </option>
                                  <option value="punjab_national_bank">
                                    Punjab National Bank
                                  </option>
                                  <option value="canara_bank">Canara Bank</option>
                                  <option value="union_bank_of_india">
                                    Union Bank of India
                                  </option>
                                  <option value="bank_of_india">
                                    Bank of India
                                  </option>
                                  <option value="indian_bank">Indian Bank</option>
                                  <option value="central_bank_of_india">
                                    Central Bank of India
                                  </option>
                                  <option value="indian_overseas_bank">
                                    Indian Overseas Bank
                                  </option>
                                  <option value="uco_bank">UCO Bank</option>
                                  <option value="bank_of_maharashtra">
                                    Bank of Maharashtra
                                  </option>
                                  <option value="punjab_and_sind_bank">
                                    Punjab & Sind Bank
                                  </option>
                                  <option value="hdfc_bank">HDFC Bank</option>
                                  <option value="icici_bank">ICICI Bank</option>
                                  <option value="axis_bank">Axis Bank</option>
                                  <option value="kotak_mahindra_bank">
                                    Kotak Mahindra Bank
                                  </option>
                                  <option value="indusind_bank">
                                    IndusInd Bank
                                  </option>
                                  <option value="yes_bank">Yes Bank</option>
                                  <option value="federal_bank">
                                    Federal Bank
                                  </option>
                                  <option value="idfc_first_bank">
                                    IDFC First Bank
                                  </option>
                                  <option value="bandhan_bank">
                                    Bandhan Bank
                                  </option>
                                  <option value="rbl_bank">
                                    RBL Bank
                                  </option>
                                  <option value="citibank">Citibank</option>
                                  <option value="standard_chartered_bank">
                                    Standard Chartered Bank
                                  </option>
                                  <option value="hsbc">HSBC</option>
                                  <option value="deutsche_bank">
                                    Deutsche Bank
                                  </option>
                                  <option value="dbs_bank">DBS Bank</option>
                                  <option value="andhra_pradesh_grameena_vikas_bank">
                                    Andhra Pradesh Grameena Vikas Bank
                                  </option>
                                  <option value="baroda_up_bank">
                                    Baroda UP Bank
                                  </option>
                                  <option value="kerala_gramin_bank">
                                    Kerala Gramin Bank
                                  </option>
                                  <option value="karnataka_gramin_bank">
                                    Karnataka Gramin Bank
                                  </option>
                                  <option value="punjab_gramin_bank">
                                    Punjab Gramin Bank
                                  </option>
                                </select>

                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiCreditCard className="text-[#5271FF]" />
                                Bank Account Number*
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  name="bankaccountno"
                                  value={formData.bankaccountno}
                                  onChange={handleChange}
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Enter Account Number"
                                //required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiInfo className="text-[#5271FF]" />
                                IFSC Code*
                              </label>
                              <div className="relative">
                                <input
                                  name="ifsccode"
                                  value={formData.ifsccode}
                                  onChange={handleChange}
                                  type="text"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Enter IFSC Code"
                                //required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiList className="text-[#5271FF]" />
                                Account Type*
                              </label>
                              <div className="relative">
                                <select
                                  name="accounttype"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  //required
                                  value={formData.accounttype}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Account Type</option>
                                  <option value="current">Current</option>
                                  <option value="saving">Saving</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiFile className="text-[#5271FF]" />
                                Cancelled Cheque*
                              </label>
                              <div className="relative">
                                <input
                                  name="cancelledcheque"
                                  type="file"
                                  id="cc"
                                  className="hidden"
                                />
                                <label
                                  htmlFor="cc"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.hspdetails?.cancelledcheque ||
                                      formData.cancelledcheque
                                      ? "Uploaded Already"
                                      : "Front Side"}
                                  </span>

                                  <UploadButton
                                    endpoint="fileUploader"
                                    content={{
                                      button({ ready }) {
                                        return (
                                          <div>{ready && <div> Upload</div>}</div>
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
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          cancelledcheque: res[0].url, // Ensure res structure matches
                                        }));
                                        setUploadComplete(true); // Set the upload as complete
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
                                name="micrcode"
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter MICR Code"
                                //required
                                value={formData.micrcode}
                                onChange={handleChange}
                                onBlur={() => {
                                  if (formData.micrcode && formData.micrcode.length !== 9) {
                                    toast.error("MICR Code must be exactly 9 digits.");
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between gap-4 mt-8">
                          <button
                            className={` px-8 py-3 rounded-xl font-semibold transition-colors ${currentStep === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-[#243460] hover:bg-gray-300"
                              }`}
                            onClick={prevStep}
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
                                className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                                type="submit"
                              >
                                {isLoading
                                  ? "Submitting, Please Wait..."
                                  : "Save Form"}
                              </button>
                            ) : (
                              <button
                                className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                                onClick={handlePreview}
                              >
                                Preview & Submit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
                <form onSubmit={handleSubmitHspContact}>
                  <div>
                    {/* 3 step form */}
                    {currentStep === 3 && (
                      <div className="md:mx-0 xl:mt-0 mt-10 mx-2 font-poppins">
                        <div className="space-y-6 ">
                          <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiMapPin className="text-[#5271FF]" />
                                HSP Full Address*
                              </label>
                              <input
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Full Address"
                              //required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiMapPin className="text-[#5271FF]" />
                                City*
                              </label>
                              <input
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter City Name"
                              //required
                              />
                            </div>
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
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  required
                                  value={formData.taluka}
                                  onChange={handleChange}
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
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiMapPin className="text-[#5271FF]" />
                                Pin Code*
                              </label>
                              <input
                                name="pincode"
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Pin Code"
                                value={formData.pincode}
                                onChange={handleChange}
                              //required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiPhone className="text-[#5271FF]" />
                                Reception Contact No 1*
                              </label>
                              <input
                                name="receptioncontact1"
                                type="number"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Number"
                                //required
                                value={formData.receptioncontact1}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiPhone className="text-[#5271FF]" />
                                Reception Contact No 2*
                              </label>
                              <input
                                name="receptioncontact2"
                                type="number"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Number"
                                //required
                                value={formData.receptioncontact2}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiMail className="text-[#5271FF]" />
                                Reception Email ID*
                              </label>
                              <input
                                name="receptionemail"
                                type="text"
                                className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                placeholder="Enter Email"
                                //required
                                value={formData.receptionemail}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiUser className="text-[#5271FF]" />
                                Manager Full Name*
                              </label>
                              <input
                                name="managername"
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Full Name"
                                //required
                                value={formData.managername}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiPhone className="text-[#5271FF]" />
                                Manager Contact No 1*
                              </label>
                              <input
                                name="managercontact"
                                type="number"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Number"
                                //required
                                value={formData.managercontact}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiMail className="text-[#5271FF]" />
                                Manager Email ID*
                              </label>
                              <input
                                name="manageremail"
                                type="text"
                                className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                placeholder="Enter Email ID"
                                //required
                                value={formData.manageremail}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiUser className="text-[#5271FF]" />
                                Admin Full Name*
                              </label>
                              <input
                                name="adminname"
                                type="text"
                                className="w-full h-12 pr-2 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                placeholder="Enter Full Name*"
                                //required
                                value={formData.adminname}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiPhone className="text-[#5271FF]" />
                                Admin Contact No*
                              </label>
                              <input
                                name="admincontact"
                                type="number"
                                className="w-full h-12 pr-2 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                placeholder="Enter Number"
                                //required
                                value={formData.admincontact}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiMail className="text-[#5271FF]" />
                                Admin Email ID*
                              </label>
                              <input
                                name="adminemail"
                                type="text"
                                className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                placeholder="Enter Email ID"
                                //required
                                value={formData.adminemail}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <AiOutlineFileExcel className="text-[#5271FF] " />
                                Escalation Matrix Sheet*
                              </label>
                              <div className="relative">
                                <input
                                  type=""
                                  name="sheet"
                                  className="w-full h-12 pr-24 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                                  placeholder="Download Sheet"
                                  disabled
                                ////required
                                />
                                <Button
                                  type="button"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                                >
                                  {isLoading && !isOtpSent
                                    ? "wait!"
                                    : isOtpSent
                                      ? "Sent"
                                      : "Click Here"}
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2 min-[1000px]:gap-0 min-[1100px]:gap-2">
                                <FiFile className="text-[#5271FF] xs:block md:hidden lg:block" />
                                Escalation Matrix Upload*
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="escalationmatrixsheet"
                                  id="escalationmatrixsheet"
                                  className="hidden"
                                //required
                                />
                                <label
                                  htmlFor="escalationmatrixsheet"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.hspcontact?.escalationmatrixsheet ||
                                      formData.escalationmatrixsheet
                                      ? "Uploaded Already"
                                      : "Upload Document"}
                                  </span>

                                  <UploadButton
                                    endpoint="fileUploader"
                                    content={{
                                      button({ ready }) {
                                        return (
                                          <div>{ready && <div> Upload</div>}</div>
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
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          escalationmatrixsheet: res[0].url, // Ensure res structure matches
                                        }));
                                        setUploadComplete(true); // Set the upload as complete
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
                                <FiPhone className="text-[#5271FF]" />
                                Alternate Number*
                              </label>
                              <input
                                name="alternateno"
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Mobile Number"
                                //required
                                value={formData.alternateno}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between gap-4 mt-8">
                          <button
                            className={` px-8 py-3 rounded-xl font-semibold transition-colors ${currentStep === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-[#243460] hover:bg-gray-300"
                              }`}
                            onClick={prevStep}
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

                              <button
                                className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                                type="submit"
                              >
                                {isLoading
                                  ? "Submitting, Please Wait..."
                                  : "Save Form"}
                              </button>

                              <button
                                className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                                type="button"
                                onClick={handlePreview}
                              >
                                Preview & Submit
                              </button>
  
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
                </>
              ):(
                <Preview formData={formData} onCancel={handleCancelPreview} />
              )}
            </div>
          </div>
        </div>
    </>
  );
};

export default HospitalProfile;