"use client";
import { ArrowDown, CalendarDays, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import Image from "next/image";
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
import { FaHospital, FaClinicMedical, FaFileAlt, FaVideo, FaUserNurse, FaAmbulance, FaPills, FaVials, FaXRay, FaMoneyCheckAlt, FaUniversity, FaUtensils } from "react-icons/fa"
import { FaCertificate, FaCalendarAlt, FaCheckCircle, FaAward, FaLayerGroup, FaGlobe } from "react-icons/fa"
import { MdCategory } from "react-icons/md"
import { AiOutlineFileExcel } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TermsAndConditionOnSubmission from "@/app/components/termsandcondition";
// import DoctorPreViewWithTicking from "./doctorpreviewwithticking";
import HspPolicyAgree from "@/app/components/hsp-policy";
import ProfileUploadPage from "./components/uploadprofile";
import ImageUploadCropper from "@/app/components/uplodcropimage";
import AmbulancePreview from "./components/ambulancepreview";
import { Button } from "@/components/ui/button";
const AmbulanceProfile = ({
  userdata,
    hspcategory,
  state,
  data,
  dist,
  subdist,
}) => {
  const [date, setDate] = useState();
  const [email, setEmail] = useState(userdata.email);
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadComplete, setUploadComplete] = useState(false); // State to track upload status
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const [open, setOpen] = useState(false); // State to manage dialog visibility

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [formData, setFormData] = useState({
    email: "",
    hspcategory: [],
    ownerfirstname: "",
    ownerlastname: "",
    ownermiddlename: "",
    dateofbirth: "",
    gender: "",
    alternatemobileno: "",
    owneraadharcardno: "",
    owneraadharcardfront: "",
    owneraadharcardback: "",
    ownerpanno: "",
    ownerpanfront: "",
    resetToken: "",
    resetTokenExpiration: "", // You might convert this to a Date object
    role: "Ambulance", // default value

    // AmbulanceHsp related fields
    hspregname: "",
    hsplogo: "",
    hspregcertificate: "",
    hsppancard: "",
    totalambulance: "",
    presentaddress: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    accounttype: "",
    cancelledcheque: "",
    micrcode: "",
    bankname: "",
    accountnumber: "",
    ifsccode: "",
    inhousedoctor: "",
    hspdescription: "",
    adminname: "",
    admincontact: "",
    adminemail: "",
  });

  // Common handler for date changes
  const handleDateChange = (date, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date, // Dynamically update the relevant date field
    }));
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
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation rules
    const onlyLetters = /^[A-Za-z\s]+$/; // Allows only letters and spaces
    const onlyNumbers = /^[0-9]+$/; // Allows only numbers
    const alphanumeric = /^[A-Za-z0-9]+$/; // Allows only alphanumeric characters

    // Define fields that should only contain letters
    const stringFields = [
      "ownerfirstname",
      "ownermiddlename",
      "ownerlastname",
      "education",

      "city",
    ];

    // Define fields that should only contain numbers
    const numericFields = [
      "alternatemobileno",

      "consultationfee",
      "owneraadharcardno",

      "  accountnumber",
      "micrcode",
    ];
    // ✅ PAN Card validation
  if (name === "ownerpanno") {
    // Restrict to alphanumeric only
    if (value && !alphanumeric.test(value)) {
      toast.error("Invalid PAN! Only letters and numbers are allowed.");
      return;
    }

    // Auto-uppercase PAN number
    const formattedValue = value.toUpperCase();

    // Limit to 10 characters
    if (formattedValue.length > 10) return;

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    return;
  }
    // Validate string fields
    if (stringFields.includes(name) && value && !onlyLetters.test(value)) {
      alert(`Invalid input! ${name} should contain only letters.`);
      return;
    }

    // Validate numeric fields
    if (numericFields.includes(name) && value && !onlyNumbers.test(value)) {
      alert(`Invalid input! ${name} should contain only numbers.`);
      return;
    }

    // Validate IFSC Code (Example format: ABCD0123456)
    if (name === "ifsccode" && value && !alphanumeric.test(value)) {
      alert("Invalid IFSC Code! It should be alphanumeric.");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      const selectedState = state.find((state) => state.stateName === value);
      if (selectedState) {
        const districts = dist.filter(
          (district) => district.stateId === selectedState.id
        );
        setFilteredDistricts(districts);
        setFilteredSubDistricts([]); // Reset sub-districts
        setFormData((prev) => ({
          ...prev,
          district: "",
          taluka: "",
          state: selectedState.stateName, // Save the state name
        }));
      }
    }

    if (name === "district") {
      const selectedDistrict = dist.find(
        (district) => district.district === value
      );
      if (selectedDistrict) {
        const subDistricts = subdist.filter(
          (subDistrict) => subDistrict.districtId === selectedDistrict.id
        );
        setFilteredSubDistricts(subDistricts);
        setFormData((prev) => ({
          ...prev,
          taluka: "",
          district: selectedDistrict.district, // Save the district name
        }));
      }
    }

    if (name === "taluka") {
      setFormData((prev) => ({
        ...prev,
        taluka: value, // Save the taluka name
      }));
    }
  };

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  // OTP and form states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isAgreedHspPolicy, setIsAgreedHspPolicy] = useState(false);
   const totalSteps = 2;
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
  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };
  const handleCheckboxChangeHspPolicy = (event) => {
    setIsAgreedHspPolicy(event.target.checked);
  };
  const handleCancelPreview = () => {
    setShowPreview(false); // Close the preview and allow editing the form again
  };
    const handlePreview = () => {
    // Set the state to show the preview
    setShowPreview(true);
  };
  const Preview = ({ formData }) => {
    useEffect(() => {
      if (!userdata?.passportphoto) {
        toast.error("Please go back and upload a profile photo.");
      }
    }, [userdata?.passportphoto]);
    return (
      <>
      <AmbulancePreview hspData={formData} ambulanceData={formData} ownerphoto={userdata.passportphoto}/>
        <div className="flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={isAgreed}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
          <TermsAndConditionOnSubmission />{" "}
        </div>
        <div className="flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={isAgreedHspPolicy}
            onChange={handleCheckboxChangeHspPolicy}
            className="w-4 h-4"
          />
          <HspPolicyAgree />{" "}
        </div>
        <div className="flex mb-8 justify-center space-x-6 mt-2">
          <button
            className="px-6 py-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 focus:outline-none flex items-center space-x-2"
            onClick={handleCancelPreview}
          >
            <span>Edit</span>
          </button>

          {userdata?.passportphoto && (
            <button
              className="px-6 py-3 bg-blue-600 rounded-xl disabled:bg-blue-300 text-white hover:bg-blue-700 focus:outline-none flex items-center space-x-2"
              onClick={handleSubmit}
              disabled={!(isAgreed && isAgreedHspPolicy)}
            >
              {userdata?.approvalStatus !== "APPROVED" ? (
                <>{isLoading ? "Submitting Please wait.." : "Submit Form"}</>
              ) : (
                <>{"You have already submitted your application"}</>
              )}
            </button>
          )}
        </div>
      </>
    );
  };
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
      const verifyRes = await fetch("/api/verify-otp", {
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

    // if (!isOtpVerified) {
    //   toast.error("Please verify OTP before submitting.");
    //   return;
    // }

    // All user-facing fields required for validation
    const requiredFields = {
      ownerfirstname: "First Name",
      ownermiddlename: "Middle Name",
      ownerlastname: "Last Name",
      dateofbirth: "Date of Birth",
      gender: "Gender",
      alternatemobileno: "Alternate Mobile Number",
      owneraadharcardno: "Aadhaar Card Number",
    adminname: "Admin Name",
      admincontact: "Admin Contact",
      adminemail: "Admin Email",
      ownerpanno: "PAN Number",
    };

    // Find missing fields
    const missingFields = Object.keys(requiredFields).filter((field) => {
      const value = formData[field];

      // Check for empty string or file not selected
      if (value === null || value === undefined || value === "") return true;

      // Special case for File objects
      if (
        field.toLowerCase().includes("front") ||
        field.toLowerCase().includes("back")
      ) {
        return !(value instanceof File);
      }

      return false;
    });

    if (missingFields.length > 0) {
      const formattedFields = missingFields
        .map((field) => requiredFields[field])
        .join(", ");
      toast.error(`Please fill in or upload: ${formattedFields}.`);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("ownerfirstname", formData.ownerfirstname);
    formPayload.append("ownermiddlename", formData.ownermiddlename);
    formPayload.append("ownerlastname", formData.ownerlastname);
    formPayload.append("dateofbirth", formData.dateofbirth);
    formPayload.append("gender", formData.gender);
        const hspcategoryArray = Array.isArray(formData.hspcategory)
      ? formData.hspcategory
      : formData.hspcategory
      ? [formData.hspcategory] // Wrap in an array if it's a single value
      : [];

    hspcategoryArray.forEach((type) => {
      formPayload.append("hspcategory[]", type);
    });
    formPayload.append("alternatemobileno", formData.alternatemobileno);
    formPayload.append("owneraadharcardno", formData.owneraadharcardno);
    formPayload.append("owneraadharcardfront", formData.owneraadharcardfront);
    formPayload.append("owneraadharcardback", formData.owneraadharcardback);
    formPayload.append("ownerpanno", formData.ownerpanno);
    formPayload.append("ownerpanfront", formData.ownerpanfront);
    formPayload.append("resetToken", formData.resetToken || "");
    formPayload.append("adminname", formData.adminname);
    formPayload.append("admincontact", formData.admincontact);
    formPayload.append("adminemail", formData.adminemail);
    formPayload.append(
      "resetTokenExpiration",
      formData.resetTokenExpiration || ""
    );
    formPayload.append("role", formData.role || "Ambulance");

    try {
      const registerRes = await fetch(`/api/ambulance/${userdata.id}`, {
        method: "PUT",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to update the form.");
      }

      toast.success("Information updated successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();

    // Map of required fields for display
    const requiredFields = {
      hspregname: "Hospital Name",
      hspregcertificate: "Registration Certificate",
      hsppancard: "PAN Card",
      totalambulance: "Total Ambulances",
      presentaddress: "Present Address",
      city: "City",
      state: "State",
      district: "District",
      taluka: "Taluka",
      accounttype: "Account Type",
      cancelledcheque: "Cancelled Cheque",
      micrcode: "MICR Code",
      bankname: "Bank Name",
      accountnumber: "Account Number",
      ifsccode: "IFSC Code",
   
      hspdescription: "Hospital Description",
  
    };

    const missingFields = Object.keys(requiredFields).filter((field) => {
      const value = formData[field];
      return !value || value === "";
    });

    if (missingFields.length > 0) {
      const formattedFields = missingFields
        .map((field) => requiredFields[field])
        .join(", ");
      toast.error(`Please fill in: ${formattedFields}.`);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    // Build the final payload from formData
    const hospitalData = {
      hspregname: formData.hspregname,
      hspregcertificate: formData.hspregcertificate,
      hsppancard: formData.hsppancard,
      totalambulance: formData.totalambulance,
      presentaddress: formData.presentaddress,
      city: formData.city,
      state: formData.state,
      district: formData.district,
      taluka: formData.taluka,
      accounttype: formData.accounttype,
      cancelledcheque: formData.cancelledcheque,
      micrcode: formData.micrcode,
      bankname: formData.bankname,
      accountnumber: formData.accountnumber,
      ifsccode: formData.ifsccode,
      inhousedoctor: formData.inhousedoctor,
      hspdescription: formData.hspdescription,
 
    };

    try {
      const registerRes = await fetch(
        `/api/ambulance/${userdata.id}/ambulance-hsp-final-submission`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hospitalData),
        }
      );

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(
          errorData.message || "Failed to submit final approval."
        );
      }

      toast.success("Final submission completed successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch or load any data that needs to prepopulate the form here
    const setFormDataOnMount = () => {
      // Example: If you had initial form data or fetched from an API, you could set it here
   const selectedhspcategory = hspcategory.find(
        (type) => type.id === userdata.hspcategoryId
      );
      const fetchedData = {
        mobile: userdata.mobile || "",
        ownerfirstname: userdata.ownerfirstname || "",
        ownermiddlename: userdata.ownermiddlename || "",
        ownerlastname: userdata.ownerlastname || "",
        dateofbirth: userdata.dateofbirth,
        hspcategory: selectedhspcategory ? selectedhspcategory.title : "",

        gender: userdata.gender || "",
        alternatemobileno: userdata.alternatemobileno || "",
        owneraadharcardno: userdata.owneraadharcardno || "",
        owneraadharcardfront: userdata.owneraadharcardfront || "",
        owneraadharcardback: userdata.owneraadharcardback || "",
        ownerpanno: userdata.ownerpanno || "",
        ownerpanfront: userdata.ownerpanfront || "",
        hspregname: userdata.AmbulanceHsp?.hspregname || "",
        hsplogo: userdata.AmbulanceHsp?.hsplogo || "",
        hspregcertificate: userdata.AmbulanceHsp?.hspregcertificate || "",
        hsppancard: userdata.AmbulanceHsp?.hsppancard || "",
        totalambulance: userdata.AmbulanceHsp?.totalambulance || "",
        presentaddress: userdata.AmbulanceHsp?.presentaddress || "",
        city: userdata.AmbulanceHsp?.city || "",
        state: userdata.AmbulanceHsp?.state || "",
        district: userdata.AmbulanceHsp?.district || "",
        taluka: userdata.AmbulanceHsp?.taluka || "",
        accounttype: userdata.AmbulanceHsp?.accounttype || "",
        cancelledcheque: userdata.AmbulanceHsp?.cancelledcheque || "",
        bankname: userdata.AmbulanceHsp?.bankname || "",
        accountnumber: userdata.AmbulanceHsp?.accountnumber || "",
        ifsccode: userdata.AmbulanceHsp?.ifsccode || "",
        inhousedoctor: userdata.AmbulanceHsp?.inhousedoctor || "",
        hspdescription: userdata.AmbulanceHsp?.hspdescription || "",
        adminname: userdata?.adminname || "",
        admincontact: userdata?.admincontact || "",
        adminemail: userdata?.adminemail || "",
        pincode: userdata.pincode || "",
        micrcode: userdata.AmbulanceHsp?.micrcode || "",
      };

      // Set the fetched data in the form state
      setFormData((prevState) => ({
        ...prevState,
        ...fetchedData,
      }));
    };

    // Call the function to set form data
    setFormDataOnMount();
  }, [userdata , hspcategory]);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 xs:py-4 lg:py-8">
        <div className="max-w-6xl mx-auto xs:px-2 md:px-4">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#243460] mb-2">
              Ambulance Profile Information
            </h1>
            <p className="text-[#5271FF] text-lg">Complete your profile with all required details</p>
          </div>
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
            {/* <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-[#5271FF]">
                {stepTitles[currentStep - 1]}
              </h2>
            </div> */}
          </div>
          {/* Main Div container */}
          {!showPreview ? (
            <div>
              {/* 1st step form */}

              <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-8">
                {currentStep === 1 && (
                  <>

                    {userdata?.AmbulanceHsp?.hsplogo ? (
                      <span className="flex justify-center rounded-xl items-center bg-blue-300 text-white py-2 px-6">
                        Uploaded HSP Profile Image
                      </span>
                    ) : (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="w-full flex justify-center items-center bg-blue-600 text-white rounded-full px-6 py-2 my-2">
                          Upload HSP Profile Image
                        </DialogTrigger>
                        <DialogContent className="container mx-auto">
                          <DialogHeader>
                            <DialogDescription>
                              {userdata?.AmbulanceHsp?.hsplogo ? (
                                <span className="flex justify-center rounded-xl items-center bg-blue-300 text-white py-2 px-6">
                                  Uploaded HSP Profile Image
                                </span>
                              ) : (
                                <ProfileUploadPage
                                  userdata={userdata}
                                  onClose={handleClose}
                                />
                              )}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}
                    {/* --- Correction: All fields should use formData --- */}
                    {/* You can add any additional UI or logic here if needed */}
                    <form onSubmit={handleSubmitFinal}>
                      <div>
                        {" "}
                        {/* 2nd step form */}
                        <div className="xl:mt-6 mt-10">
                          {/* 3*/}
                          <div className="space-y-6 ">
                            <div className="grid gap-6 md:grid-cols-3">
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FaHospital className="text-[#5271FF]" />
                            HSP Reg. Name*
                          </label>
                                <input
                                  type="text"
                                   className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Enter Business Name"
                                  name="hspregname"
                                  value={formData.hspregname}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^a-zA-Z\s]/g,
                                      ""
                                    ); // Allow only letters and spaces
                                    handleChange({
                                      target: { name: "hspregname", value },
                                    });
                                  }}
                                  onBlur={() => {
                                    if (
                                      formData.hspregname &&
                                      /[^a-zA-Z\s]/.test(formData.hspregname)
                                    ) {
                                      toast.error(
                                        "Only alphabetic characters are allowed."
                                      );
                                    }
                                  }}
                                />
                              </div>
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
                                      {userdata.AmbulanceHsp
                                        ?.hspregcertificate ||
                                      formData.hspregcertificate
                                        ? "Uploaded Already"
                                        : "Upload Document"}
                                    </span>

                                    <UploadButton
                                      endpoint="fileUploader"
                                      content={{
                                        button({ ready }) {
                                          return (
                                            <div>
                                              {ready && <div> Upload</div>}
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
                                      onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        if (res.length > 0) {
                                          setFormData((prevData) => ({
                                            ...prevData,
                                            hspregcertificate: res[0].url, // Ensure res structure matches
                                          }));
                                          setUploadComplete(true); // Set the upload as complete
                                          toast("Upload Completed");
                                        }
                                      }}
                                      onUploadError={(error) => {
                                        toast(`ERROR! ${error.message}`);
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>{" "}
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                            <FiCreditCard className="text-[#5271FF]" />
                                  HSP Pan Card*
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    name="hsppancard"
                                    id="hsppancard"
                                    className="hidden"
                                    //required
                                  />
                                  <label
                                    htmlFor="hsppancard"
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                  >
                                    <span className="text-gray-400 text-[12px]">
                                      {userdata.AmbulanceHsp?.hsppancard ||
                                      formData.hsppancard
                                        ? "Uploaded Already"
                                        : "Upload Document"}
                                    </span>

                                    <UploadButton
                                      endpoint="fileUploader"
                                      content={{
                                        button({ ready }) {
                                          return (
                                            <div>
                                              {ready && <div> Upload</div>}
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
                                      onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        if (res.length > 0) {
                                          setFormData((prevData) => ({
                                            ...prevData,
                                            hsppancard: res[0].url, // Ensure res structure matches
                                          }));
                                          setUploadComplete(true); // Set the upload as complete
                                          toast("Upload Completed");
                                        }
                                      }}
                                      onUploadError={(error) => {
                                        toast(`ERROR! ${error.message}`);
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                            <FiMapPin className="text-[#5271FF]" />
                                  Present Address*
                                </label>
                                <input
                                  type="text"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Enter Full Address"
                                  name="presentaddress"
                                  value={formData.presentaddress}
                                  onChange={handleChange}
                                  // required
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                  <FiMapPin className="text-[#5271FF]" />
                                                  City*
                                                </label>
                                <input
                                  type="text"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Enter City Name"
                                  // required
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                  <FiMapPin className="text-[#5271FF]" />
                                                  State*
                                                </label>
                                <div className="relative">
                                  <select
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                    // required
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                  >
                                    <option className="text-black" value="">
                                      Select State
                                    </option>
                                    {state.map((state) => (
                                      <option
                                        key={state.id}
                                        value={state.stateName}
                                        className="text-black"
                                      >
                                        {state.stateName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                  <FiMapPin className="text-[#5271FF]" />
                                                  District*
                                                </label>
                                <div className="relative">
                                  <select
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                    // required
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                  >
                                    <option className="text-black" value="">
                                      Select District
                                    </option>
                                    {filteredDistricts.map((district) => (
                                      <option
                                        key={district.id}
                                        value={district.district}
                                        className="text-black"
                                      >
                                        {district.district}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                  <FiMapPin className="text-[#5271FF]" />
                                                  Taluka*
                                                </label>
                                <div className="relative">
                                  <select
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                    // required
                                    name="taluka"
                                    value={formData.taluka}
                                    onChange={handleChange}
                                  >
                                    <option className="text-black" value="">
                                      Select Taluka
                                    </option>
                                    {filteredSubDistricts.map((subDistrict) => (
                                      <option
                                        key={subDistrict.id}
                                        value={subDistrict.subDistrict}
                                        className="text-black"
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
                                  type="text"
                                  name="pincode"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Enter Pin Code"
                                  maxLength={6} // Works only with text type
                                  value={formData.pincode}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    ); // Remove non-numeric characters
                                    if (value.length <= 6) {
                                      handleChange({
                                        target: { name: "pincode", value },
                                      });
                                    }
                                  }}
                                  onBlur={() => {
                                    if (formData.pincode.length !== 6) {
                                      toast.error(
                                        "Pin code must be exactly 6 digits."
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                            <FiBriefcase className="text-[#5271FF]" />
                                                            Bank Name*
                                                          </label>
                                <div className="relative">
                                  <select
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
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
                                    <option value="canara_bank">
                                      Canara Bank
                                    </option>
                                    <option value="union_bank_of_india">
                                      Union Bank of India
                                    </option>
                                    <option value="bank_of_india">
                                      Bank of India
                                    </option>
                                    <option value="indian_bank">
                                      Indian Bank
                                    </option>
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
                                    <option value="rbl_bank">RBL Bank</option>
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
                                    name="accountnumber"
                                    value={formData.accountnumber}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                    placeholder="Enter Account Number"
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
                                    type="text"
                                    id="cc"
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor="cc"
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                  >
                                    <span className="text-gray-600">
                                      {userdata?.AmbulanceHsp?.cancelledcheque ||
                                      formData.cancelledcheque
                                        ? "Uploaded Already"
                                        : "Front Side"}
                                    </span>

                                    <UploadButton
                                      endpoint="fileUploader"
                                      content={{
                                        button({ ready }) {
                                          return (
                                            <div>
                                              {ready && <div> Upload</div>}
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
                                      onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        if (res.length > 0) {
                                          setFormData((prevData) => ({
                                            ...prevData,
                                            cancelledcheque: res[0].url, // Ensure res structure matches
                                          }));
                                          setUploadComplete(true); // Set the upload as complete
                                          toast("Upload Completed");
                                        }
                                      }}
                                      onUploadError={(error) => {
                                        toast(`ERROR! ${error.message}`);
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
                                  value={formData.micrcode}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FaAmbulance  className="text-[#5271FF]" />
                              Total Ambulance*
                            </label>
                                <div className="relative">
                                  <select
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                    name="totalambulance"
                                    value={formData.totalambulance}
                                    onChange={handleChange}
                                  >
                                    <option className="text-black" value="">
                                      Select Count
                                    </option>

                                    {[...Array(50)].map((_, i) => (
                                      <option
                                        key={i + 1}
                                        className="text-black"
                                        value={i + 1}
                                      >
                                        {i + 1}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[#243460] font-semibold flex items-center gap-2">
                                  <FaUserNurse className="text-[#5271FF]" />
                                  In-House Doctor*
                                </label>
                                <div className="relative">
                                  <select
                                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                    name="inhousedoctor"
                                    value={formData.inhousedoctor}
                                    onChange={handleChange}
                                  >
                                    <option  value="">
                                      Select Yes/No
                                    </option>
                                    <option  value="yes">
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
                              <FaCertificate className="text-[#5271FF]" />
                                  HSP Description*
                                </label>
                                <input
                                  type="text"
                                  name="hspdescription"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  placeholder="Max 1000 Words Description "
                                  value={formData.hspdescription}
                                  onChange={handleChange}
                                  maxLength={2500}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                        <div className="flex justify-between gap-4 mt-8">
                      <button
                        className={` px-8 py-3 rounded-xl font-semibold transition-colors ${
                        currentStep === 1
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
                            ):(
                            <button
                              className="bg-[#5271FF] hover:bg-[#4161ef] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                              onClick={handlePreview}
                            >
                              Preview & Submit
                            </button>
                            )}
                      </div>
                    </div>
                    </form>
                  </>
                )}
                {currentStep === 2 && (
                  <div className="md:mx-0 mx-2 space-y-3 ">
                    {userdata.passportphoto ? (
                      <span className="flex justify-center rounded-xl items-center bg-blue-300 text-white py-2 px-6">
                        Uploaded Owner Passport Photo
                      </span>
                    ) : (
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger className="w-full flex justify-center items-center bg-blue-600 text-white rounded-full px-6 py-2 my-2">
                          Upload Owner Passport Photo
                        </DialogTrigger>
                        <DialogContent className="container mx-auto">
                          <DialogHeader>
                            <DialogDescription>
                              {userdata.passportphoto ? (
                                <span className="flex justify-center rounded-xl items-center bg-blue-300 text-white py-2 px-6">
                                  Uploaded Owner Passport Photo
                                </span>
                              ) : (
                                <ImageUploadCropper
                                  userId={userdata.id}
                                  title="Upload Your Passport Photo"
                                  description="Please upload a clear, recent photo with a neutral background."
                                  formFieldName="passportphoto"
                                  uploadEndpoint={`/api/ambulance/${userdata.id}/ambulance-owner-photo`}
                                  redirectAfterUpload="/ambulance/dashboard/profile"
                                  aspectRatio={1}
                                />
                              )}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    )}

                    <form onSubmit={handleSubmit}>
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
                              placeholder="Enter Number"
                              // required
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
                                //required
                              />
                              <Button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={
                                  isOtpSent || isSubmitting || isOtpSent
                                }
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
                                // required
                              />
                              <button
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
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <User className="h-4 w-4 text-[#5271FF]" />
                              Owner First Name*
                            </label>
                            <input
                              type="text"
                              name="ownerfirstname"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter  First Name"
                              value={formData.ownerfirstname}
                              onChange={handleChange}
                              // required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <User className="h-4 w-4 text-[#5271FF]" />
                              Owner Middle Name*
                            </label>
                            <input
                              type="text"
                              name="ownermiddlename"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Middle Name"
                              value={formData.ownermiddlename}
                              onChange={handleChange}
                              // required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <User className="h-4 w-4 text-[#5271FF]" />
                              Owner Last Name*
                            </label>
                            <input
                              type="text"
                              name="ownerlastname"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Last Name"
                              value={formData.ownerlastname}
                              onChange={handleChange}
                              // required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FaCalendarAlt className="text-[#5271FF]" />
                              Date Of Birth*
                            </label>
                            <div className="relative">
                              <DatePicker
                                selected={formData.dateofbirth}
                                onChange={(date) =>
                                  handleDateChange(date, "dateofbirth")
                                }
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                yearDropdownItemNumber={100}
                                name="dateofbirth"
                                scrollableYearDropdown
                                maxDate={new Date()} // Disable next years
                                showMonthDropdown // Add this to allow month selection
                                placeholderText="DD/MM/YYYY"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                style={{ paddingRight: "2.5rem" }} // Adjusted padding to prevent text from overlapping with the icon
                                aria-label="Date of Birth" // Accessibility improvement
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <CalendarDays className="h-5 w-5" />
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <User className="h-4 w-4 text-[#5271FF]" />
                              Gender*
                            </label>
                            <div className="relative">
                              <select
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                // required
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                              >
                                <option  value="">
                                  Select your Gender
                                </option>
                                <option  value="male">
                                  Male
                                </option>
                                <option  value="female">
                                  Female
                                </option>
                                <option  value="other">
                                  Other
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                                                    <FiPhone className="text-[#5271FF]" />
                                                        Alternate Number*
                                                      </label>
                            <input
                              type="text"
                              name="alternatemobileno"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Alternate Number"
                              value={formData.alternatemobileno}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                        <FiCreditCard className="text-[#5271FF]" />
                              Aadhar Card Number*
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Aadhar Number"
                              name="owneraadharcardno"
                              value={formData.owneraadharcardno}
                              maxLength="12" // Restricts input to 12 characters
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                                handleChange({
                                  target: { name: "owneraadharcardno", value },
                                });
                              }}
                              onBlur={() => {
                                if (formData.owneraadharcardno.length !== 12) {
                                  toast.error(
                                    "Aadhar number must be exactly 12 digits."
                                  );
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                        <FiFile className="text-[#5271FF]" />
                              Aadhar Card Front Side*
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="owneraadharcardfront"
                                id="owneraadharcardfront"
                                className="hidden"
                                //required
                              />
                              <label
                                htmlFor="pancardimg"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                              >
                                <span className="text-gray-400 text-[12px]">
                                  {userdata.owneraadharcardfront ||
                                  formData.owneraadharcardfront
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
                                  onClientUploadComplete={(res) => {
                                    console.log("Files: ", res);
                                    if (res.length > 0) {
                                      setFormData((prevData) => ({
                                        ...prevData,
                                        owneraadharcardfront: res[0].url, // Ensure res structure matches
                                      }));
                                      setUploadComplete(true); // Set the upload as complete
                                      toast("Upload Completed");
                                    }
                                  }}
                                  onUploadError={(error) => {
                                    toast(`ERROR! ${error.message}`);
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
                              <input
                                type="text"
                                name="owneraadharcardback"
                                id="owneraadharcardback"
                                className="hidden"
                                //required
                              />
                              <label
                                htmlFor="pancardimg"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                              >
                                <span className="text-gray-400 text-[12px]">
                                  {userdata.owneraadharcardback ||
                                  formData.owneraadharcardback
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
                                  onClientUploadComplete={(res) => {
                                    console.log("Files: ", res);
                                    if (res.length > 0) {
                                      setFormData((prevData) => ({
                                        ...prevData,
                                        owneraadharcardback: res[0].url, // Ensure res structure matches
                                      }));
                                      setUploadComplete(true); // Set the upload as complete
                                      toast("Upload Completed");
                                    }
                                  }}
                                  onUploadError={(error) => {
                                    toast(`ERROR! ${error.message}`);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                        <FiCreditCard className="text-[#5271FF]" />
                                                        PAN Card*
                                                      </label>
                            <input
                              type="text"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter PAN Number"
                              name="ownerpanno"
                              value={formData.ownerpanno}
                              maxLength="10"
                              minLength="10"
                              onChange={(e) => {
                                const value = e.target.value;
                                handleChange({
                                  target: { name: "ownerpanno", value },
                                });
                              }}
                              onBlur={() => {
                                if (formData.ownerpanno.length !== 10) {
                                  toast.error(
                                    "Pan Card must be exactly 10 digits."
                                  );
                                }
                              }}
                            />
                          </div>
                          {/* PAN Card Front Upload */}
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                        <FiFile className="text-[#5271FF]" />
                              PAN Card Front Side*
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="ownerpanfront"
                                id="ownerpanfront"
                                className="hidden"
                              />

                              <label
                                htmlFor="pancardimg"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                              >
                                <span className="text-gray-400 text-[12px]">
                                  {userdata.ownerpanfront ||
                                  formData.ownerpanfront
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
                                  onClientUploadComplete={(res) => {
                                    if (res.length > 0) {
                                      setFormData((prevData) => ({
                                        ...prevData,
                                        ownerpanfront: res[0].url,
                                      }));
                                      setUploadComplete(true);
                                      toast("Upload Completed");
                                    }
                                  }}
                                  onUploadError={(error) => {
                                    toast(`ERROR! ${error.message}`);
                                  }}
                                />
                              </label>
                            </div>
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
                                          (category, index) => (
                                            <li
                                              key={index}
                                              className="py-1 text-black"
                                            >
                                              {category.hspcategory?.title ||
                                                "N/A"}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    ) : (
                                      <p className="px-3 py-2 text-gray-500">
                                        N/A
                                      </p>
                                    )}
                                  </div>

                                  {/* Mapping Speciality Type Checkboxes */}
                                  {hspcategory.map((c) => (
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
                            <User className="h-4 w-4 text-[#5271FF] xs:block md:hidden lg:block" />
                              Admin / Manager Full Name*
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                              placeholder="Enter Admin Name"
                              name="adminname"
                              value={formData.adminname}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleChange({
                                  target: { name: "adminname", value },
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FiPhone className="text-[#5271FF] xs:block md:hidden lg:block" />
                              Admin / Manager Mobile No*
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                              placeholder="Enter Number"
                              name="admincontact"
                              value={formData.admincontact}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleChange({
                                  target: { name: "admincontact", value },
                                });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                                                                                    <FiMail className="text-[#5271FF]" />
                              Admin / Manager Email
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white"
                              placeholder="Enter Admin Email"
                              name="adminemail"
                              value={formData.adminemail}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleChange({
                                  target: { name: "adminemail", value },
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    

                   <div className="flex justify-between gap-4 mt-8">
                      <button
                        className={` px-8 py-3 rounded-xl font-semibold transition-colors ${
                        currentStep === 1
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
                            ):(
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
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Preview formData={formData} onCancel={handleCancelPreview} />
          )}
        </div>
      </div>
    </>
  );
};

export default AmbulanceProfile;
