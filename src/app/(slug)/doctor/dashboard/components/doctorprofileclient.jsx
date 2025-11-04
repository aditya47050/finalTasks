"use client";
import { ArrowDown, CalendarDays, User, Stethoscope  } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import Image from "next/image";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileUploadPage from "./doctorprofileuploadpage";
import TermsAndConditionOnSubmission from "@/app/components/termsandcondition";
import DoctorPreViewWithTicking from "./doctorpreviewwithticking";
import HspPolicyAgree from "@/app/components/hsp-policy";
const Doctorprofile = ({
  userdata,
  specialitytype,
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
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  alternatemobileno: "",
  education: "",
  specialitytype: [],
  totalexperience: "",
  degreecertificate: "",
  registrationcertificate: "",
  specialitydegreecertificate: "",
  registrationdate: "",
  regrenewaldate: "",
  regno: "",
  passportphoto: "",
  profiledescription: "",
  consultationfee: "",
  onlineappointment: "",
  homehealthcarevisit: "",
  pancardno: "",
  pancardfront: "",
  aadharcardno: "",
  aadharcardfront: "",
  aadharcardback: "",
  presentaddress: "",
  city: "",
  state: "",
  district: "",
  taluka: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  accountType: "",
  cancelledCheque: "",
  micrCode: "",

  // ✅ New fields
  finalPrice: "",
  discount: "",
});

  // Common handler for date changes
  const handleDateChange = (date, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: date, // Dynamically update the relevant date field
    }));
  };

  const handleMultiCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prev) => {
      const updatedSelection = checked
        ? [...prev.specialitytype, value] // Add to array if checked
        : prev.specialitytype.filter((item) => item !== value); // Remove if unchecked

      return { ...prev, specialitytype: updatedSelection };
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
      "firstName",
      "middleName",
      "lastName",
      "education",

      "city",
    ];

    // Define fields that should only contain numbers
    const numericFields = [
  "alternatemobileno",
  "consultationfee",
  "aadharcardno",
  "accountNumber",
  "micrCode",
  "finalPrice",   // ✅ added
  "discount",     // ✅ added
];

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
    if (name === "ifscCode" && value && !alphanumeric.test(value)) {
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

  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };
  const handleCheckboxChangeHspPolicy = (event) => {
    setIsAgreedHspPolicy(event.target.checked);
  };
  const handlePreview = () => {
    // Set the state to show the preview
    setShowPreview(true);
  };
  const handleCancelPreview = () => {
    setShowPreview(false); // Close the preview and allow editing the form again
  };
  // Handle sending OTP
  const Preview = ({ formData }) => {
    useEffect(() => {
      if (!userdata?.doctorinfo.passportphoto) {
        toast.error("Please go back and upload a profile photo.");
      }
    }, [userdata?.doctorinfo.passportphoto]);
    console.log(formData);
    return (
      <>
        <DoctorPreViewWithTicking doctorData={formData} userdata={userdata} />{" "}
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

          {userdata.doctorinfo.passportphoto && (
            <button
              className="px-6 py-3 bg-blue-600 rounded-xl disabled:bg-blue-300 text-white hover:bg-blue-700 focus:outline-none flex items-center space-x-2"
              onClick={handleSubmitFinal}
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

    // Check if OTP is verified before proceeding
    // if (!isOtpVerified) {
    //   toast.error("Please verify OTP before submitting.");
    //   return;
    // }

    // Required fields validation
    const requiredFields = {
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      education: "Education",
      specialitytype: "Speciality Type",
      totalexperience: "Total Experience",
      degreecertificate: "Degree Certificate",
      registrationcertificate: "Registration Certificate",
      registrationdate: "Registration Date",
      regrenewaldate: "Renewal Date",
    };

    // Find missing fields
    const missingFields = Object.keys(requiredFields).filter((field) => {
      const value = formData[field];

      // Check for empty strings, null, undefined
      if (typeof value === "string" && value.trim() === "") return true;

      // Check for null or undefined values
      if (value === null || value === undefined) return true;

      return false; // If value exists, it's fine
    });

    if (missingFields.length > 0) {
      const formattedFields = missingFields
        .map((field) => requiredFields[field])
        .join(", ");
      toast.error(
        `Please fill in the following required fields: ${formattedFields}.`
      );
      return;
    }

    // Disable submit button and show loading spinner while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("firstName", formData.firstName);
    formPayload.append("middleName", formData.middleName);
    formPayload.append("lastName", formData.lastName);
    formPayload.append("dateOfBirth", formData.dateOfBirth);
    formPayload.append("gender", formData.gender);
    formPayload.append("alternatemobileno", formData.alternatemobileno);
    formPayload.append("education", formData.education);
    formData.specialitytype.forEach((type) => {
      formPayload.append("specialitytype[]", type); // Use "specialitytype[]" to send as an array
    });
    formPayload.append("totalexperience", formData.totalexperience);
    formPayload.append("degreecertificate", formData.degreecertificate);
    formPayload.append(
      "registrationcertificate",
      formData.registrationcertificate
    );
    formPayload.append(
      "specialitydegreecertificate",
      formData.specialitydegreecertificate
    );
    formPayload.append("registrationdate", formData.registrationdate);
    formPayload.append("regrenewaldate", formData.regrenewaldate);
    formPayload.append("regno", formData.regno);

    try {
      // Make the API request to submit the form
      const registerRes = await fetch(`/api/doctor/${userdata.id}`, {
        method: "PUT",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to update the form.");
      }

      // Success: show success alert and reset form
      toast.success("Information updated successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };

  const handleSubmitDoctorinfo = async (e) => {
    e.preventDefault();

    // List of required fields with user-friendly names
    const requiredFields = [
  { key: "profiledescription", name: "Profile Description" },
  { key: "consultationfee", name: "Consultation Fee" },
  { key: "onlineappointment", name: "Online Appointment" },
  { key: "homehealthcarevisit", name: "Home Healthcare Visit" },
  { key: "pancardno", name: "PAN Card Number" },
  { key: "pancardfront", name: "PAN Card Front" },
  { key: "aadharcardno", name: "Aadhar Card Number" },
  { key: "aadharcardfront", name: "Aadhar Card Front" },
  { key: "aadharcardback", name: "Aadhar Card Back" },
  { key: "presentaddress", name: "Present Address" },
  { key: "city", name: "City" },
  { key: "state", name: "State" },
  { key: "district", name: "District" },
  { key: "taluka", name: "Taluka" },
  { key: "bankName", name: "Bank Name" },
  { key: "accountNumber", name: "Account Number" },
  { key: "ifscCode", name: "IFSC Code" },
  { key: "accountType", name: "Account Type" },
  { key: "cancelledCheque", name: "Cancelled Cheque" },
  { key: "micrCode", name: "MICR Code" },

  // ✅ New required fields
  { key: "finalPrice", name: "Final Price" },
  { key: "discount", name: "Discount" },
];


    // Find missing fields
    const missingFields = requiredFields
      .filter((field) => !formData[field.key]) // Check if the field is empty
      .map((field) => field.name); // Get the user-friendly field name
 
    if (missingFields.length > 0) {
      // Show toast message with missing fields
      toast.error(
        `Please fill the following fields: ${missingFields.join(", ")}`
      );
      return; // Stop form submission
    }

    // Disable submit button and show loading spinner while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();
    requiredFields.forEach((field) =>
      formPayload.append(field.key, formData[field.key])
    );
        for (let pair of formPayload.entries()) {
      console.log(pair[0], pair[1]);
    }


    try {
      // Make the API request to submit the form
      const registerRes = await fetch(`/api/doctor/${userdata.id}/doctorinfo`, {
        method: "PUT",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to update the form.");
      }

      // Success: show success alert and redirect
      toast.success("Information updated successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  React.useEffect(() => {
    const existingScript = document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  const handleSubmitFinal = async (e) => {
    e.preventDefault();

    // Disable submit button and show loading spinner while submitting
    setIsSubmitting(true);
    setIsLoading(true);

    try {

      // 1. Check if already paid
      const isPaid = Array.isArray(userdata.HospitalPayment)
        ? userdata.DoctorPayment.some(
            (p) =>
              p.forwhat === "Yearly Subscription Fee" &&
              p.paymentStatus === "SUCCESS"
          )
        : false;
      if (isPaid) {
        await finalHospitalSubmit();
        router.push("/doctor/dashboard/certificate");
        return;
      }
      const orderRes = await fetch("/api/doctor/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: userdata.id })
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
          const verifyRes = await fetch("/api/doctor/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              doctorId: userdata.id,
              amount: order.amount,
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast("Payment Successful. Submitting registration...");
            
            await finalHospitalSubmit();
          } else {
            toast("Payment verification failed.");
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
      // Make the API request to submit the final approval request
      const registerRes = await fetch(
        `/api/doctor/${userdata.id}/finalsubmission`,
        {
          method: "PUT",
        }
      );

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.error || "Failed to submit final approval.");
      }

      // Success: show success toast and redirect
      toast.success("Final submission completed successfully!");
      window.location.href = "/doctor/dashboard/certificate";
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };

  useEffect(() => {
    // Fetch or load any data that needs to prepopulate the form here
    const setFormDataOnMount = () => {
      // Example: If you had initial form data or fetched from an API, you could set it here
      const selectedSpecialityType = specialitytype.find(
        (type) => type.id === userdata.specialitytypeId
      );
      const fetchedData = {
        email: userdata.email || "",
        mobile: userdata.mobile || "",
        firstName: userdata.firstName || "",
        middleName: userdata.middleName || "",
        lastName: userdata.lastName || "",
        dateOfBirth: userdata.dateOfBirth || "",
        gender: userdata.gender || "",
        alternatemobileno: userdata.alternatemobileno || "",
        education: userdata.education || "",
        specialitytype: selectedSpecialityType
          ? selectedSpecialityType.title
          : "",

        totalexperience: userdata.totalexperience || "",
        degreecertificate: userdata.degreecertificate || "",
        registrationcertificate: userdata.registrationcertificate || "",
        specialitydegreecertificate: userdata.specialitydegreecertificate || "",
        registrationdate: userdata.registrationdate || "",
        regrenewaldate: userdata.regrenewaldate || "",
        regno: userdata.regno || "",
        passportphoto: userdata.doctorinfo?.passportphoto || "",
        profiledescription: userdata.doctorinfo?.profiledescription || "",
        consultationfee: userdata.doctorinfo?.consultationfee || "",
        onlineappointment: userdata.doctorinfo?.onlineappointment || "",
        homehealthcarevisit: userdata.doctorinfo?.homehealthcarevisit || "",
        pancardno: userdata.doctorinfo?.pancardno || "",
        pancardfront: userdata.doctorinfo?.pancardfront || "",
        aadharcardno: userdata.doctorinfo?.aadharcardno || "",
        aadharcardfront: userdata.doctorinfo?.aadharcardfront || "",
        aadharcardback: userdata.doctorinfo?.aadharcardback || "",
        presentaddress: userdata.doctorinfo?.presentaddress || "",
        city: userdata.doctorinfo?.city || "",
        state: userdata.doctorinfo?.state || "",
        district: userdata.doctorinfo?.district || "",
        taluka: userdata.doctorinfo?.taluka || "",
        bankName: userdata.doctorinfo?.bankName || "",
        pincode: userdata.doctorinfo?.pincode || "",
        accountNumber: userdata.doctorinfo?.accountNumber || "",
        ifscCode: userdata.doctorinfo?.ifscCode || "",
        accountType: userdata.doctorinfo?.accountType || "",
        cancelledCheque: userdata.doctorinfo?.cancelledCheque || "",
        micrCode: userdata.doctorinfo?.micrCode || "",
        finalPrice: userdata.doctorinfo?.finalPrice || "",
        discount: userdata.doctorinfo?.discount || "",
      };

      // Set the fetched data in the form state
      setFormData((prevState) => ({
        ...prevState,
        ...fetchedData,
      }));
    };

    // Call the function to set form data
    setFormDataOnMount();
  }, [userdata, specialitytype]);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 xs:py-4 lg:py-8">
        <div className="max-w-6xl mx-auto xs:px-2 md:px-4">
          {" "}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#243460] mb-2">
              Doctor Profile Information
            </h1>
            <p className="text-[#5271FF] text-lg">Complete your profile with all required details</p>
          </div>{" "}
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
          {/* <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-[#5271FF]">
              {stepTitles[currentStep - 1]}
            </h2>
          </div> */}
        </div>
          {/* Main Div container */}
          {!showPreview ? (
            <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-8">
              {/* 1st step form */}
              {currentStep === 1 && (
              <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
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
                              <FiUser className="text-[#5271FF]" />
                              First Name*
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter  First Name"
                              value={formData.firstName}
                              onChange={handleChange}
                              // required
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
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Middle Name"
                              value={formData.middleName}
                              onChange={handleChange}
                              // required
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
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Last Name"
                              value={formData.lastName}
                              onChange={handleChange}
                              // required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FiCalendar className="text-[#5271FF]" />
                              Date Of Birth*
                            </label>
                            <div className="relative">
                              <DatePicker
                                selected={formData.dateOfBirth}
                                onChange={(date) =>
                                  handleDateChange(date, "dateOfBirth")
                                }
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                yearDropdownItemNumber={100}
                                name="dateOfBirth"
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
                              <FiUser className="text-[#5271FF]" />
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
                                <option value="male">
                                  Male
                                </option>
                                <option value="female">
                                  Female
                                </option>
                                <option value="other">
                                  Other
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FiPhone className="text-[#5271FF]" />
                              Alternate Mobile Number
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
                              <FiList className="text-[#5271FF]" />
                              Education Level*
                            </label>
                            <input
                              type="text"
                              name="education"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Education Details"
                              value={formData.education}
                              onChange={handleChange}
                              // required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <Stethoscope className="w-4 h-4 text-[#5271FF]" />
                              Specialty Type*
                            </label>
                            <div className="relative">
                              {/* Clickable Select Box */}
                              <div
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-white flex items-center"
                                onClick={toggleDropdown}
                              >
                                {/* Fixed-height container with vertical scroll */}
                                <div className="flex-1 max-h-8 overflow-y-auto flex flex-wrap items-center gap-1 text-black">
                                  {formData.specialitytype.length > 0 ? (
                                    formData.specialitytype.map(
                                      (item, index) => (
                                        <span
                                          key={index}
                                          className="bg-gray-200 text-black px-2 py-1 rounded-md text-xs"
                                        >
                                          {item}
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <span className="flex justify-center items-start text-gray-400">
                                      Select Specialty
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
                                      {userdata.specialities && (
                                        <div className="p-1">
                                          <h2 className="text-lg font-semibold text-[#243460] mb-1">
                                            Selected
                                          </h2>

                                          {userdata.specialities.length > 0 ? (
                                            <ul>
                                              {userdata.specialities.map(
                                                (spec, index) => (
                                                  <li
                                                    key={index}
                                                    className="py-1 text-black"
                                                  >
                                                    {spec.speciality?.title ||
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
                                      )}

                                      {/* Mapping Speciality Type Checkboxes */}
                                      {specialitytype.map((c) => (
                                        <label
                                          key={c.id}
                                          className="flex items-center px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            value={c.title}
                                            checked={formData.specialitytype.includes(
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
                              <FiBriefcase  className="text-[#5271FF]" />
                              Total Experience*
                            </label>
                            <div className="relative">
                              <select
                                name="totalexperience"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                // required
                                value={formData.totalexperience}
                                onChange={handleChange}
                              >
                                <option
                                  value=""
                                  disabled
                                  selected
                                >
                                  Select Experience
                                </option>
                                {Array.from({ length: 51 }, (_, i) => i).map(
                                  (num) => (
                                    <option
                                      key={num}
                                      value={num}
                                    >
                                      {num === 50
                                        ? "50+ years"
                                        : `${num} years`}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FiAward itCard className="text-[#5271FF]" />
                              Degree Certificate*
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="degreecertificate"
                                id="degreecertificate"
                                className="hidden"
                              />
                              <label
                                htmlFor="degreecertificate"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                              >
                                <span className="text-gray-400 text-[12px]">
                                  {userdata.degreecertificate ||
                                  formData.degreecertificate
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
                                        degreecertificate: res[0].url, // Ensure res structure matches
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
                              <FiFileText  className="text-[#5271FF]" />
                              Registration Certificate*
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="registrationcertificate"
                                id="registrationcertificate"
                                className="hidden"
                              />
                              <label
                                htmlFor="registrationcertificate"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                              >
                                <span className="text-gray-400 text-[12px]">
                                  {userdata.registrationcertificate ||
                                  formData.registrationcertificate
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
                                        registrationcertificate: res[0].url, // Ensure res structure matches
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
                            <label className="text-[#243460] font-semibold flex items-center gap-2 min-[1000px]:gap-1 min-[1100px]:gap-2">
                              <FiAward itCard className="text-[#5271FF] xs:block md:hidden lg:block" />
                              Specialty Degree Certificate
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="specialitydegreecertificate"
                                id="specialitydegreecertificate"
                                className="hidden"
                              />
                              <label
                                htmlFor="specialitydegreecertificate"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                              >
                                <span className="text-gray-400 text-[12px]">
                                  {userdata.specialitydegreecertificate ||
                                  formData.specialitydegreecertificate
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
                                        specialitydegreecertificate: res[0].url, // Ensure res structure matches
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
                              <FiHash  className="text-[#5271FF]" />
                              Registration no*
                            </label>
                            <input
                              type="text"
                              name="regno"
                              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                              placeholder="Enter Registration No"
                              value={formData.regno}
                              onChange={(e) => {
                                let value = e.target.value.toUpperCase();
                                value = value.replace(/[^A-Z0-9]/g, ""); // ✅ Alphanumeric only
                                handleChange({ target: { name: "regno", value } });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[#243460] font-semibold flex items-center gap-2">
                              <FiCalendar className="text-[#5271FF]" />
                              Registration Date*
                            </label>
                            <div className="relative">
                              <DatePicker
                                selected={formData.registrationdate}
                                onChange={(date) =>
                                  handleDateChange(date, "registrationdate")
                                }
                                dateFormat="dd/MM/yyyy"
                                name="registrationdate"
                                showYearDropdown
                                yearDropdownItemNumber={100}
                                scrollableYearDropdown
                                placeholderText="DD/MM/YYYY"
                                maxDate={new Date()} // Disable next years
                                showMonthDropdown // Add this to allow month selection
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
                              <FiCalendar className="text-[#5271FF]" />
                              Reg. Renewal Date*
                            </label>
                            <div className="relative">
                              <DatePicker
                                selected={formData.regrenewaldate}
                                onChange={(date) =>
                                  handleDateChange(date, "regrenewaldate")
                                }
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                yearDropdownItemNumber={100}
                                scrollableYearDropdown
                                placeholderText="DD/MM/YYYY"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                style={{ paddingRight: "2.5rem" }} // Adjusted padding to prevent text from overlapping with the icon
                                aria-label="Date of Birth" // Accessibility improvement
                                minDate={
                                  formData.registrationdate || new Date()
                                }
                                showMonthDropdown // Add this to allow month selection
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <CalendarDays className="h-5 w-5" />
                              </span>
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
              )}
              {currentStep === 2 && (
                <>
                  {" "}
                  {userdata.doctorinfo.passportphoto ? (
                    <div className="flex flex-col items-center space-y-4">
                      <Image
                            src={userdata.doctorinfo.passportphoto || "/placeholder.svg"}
                            alt="Profile"
                            width={120}
                            height={120}
                            className="rounded-xl border-2 border-[#5271FF]"
                          />
                      <span className="flex justify-center rounded-xl items-center bg-blue-300 text-white py-2 px-6">
                        Uploaded Profile Image
                      </span>
                    </div>
                  ) : (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger className="w-full flex justify-center items-center bg-blue-600 text-white rounded-full px-6 py-2 my-2">
                        Upload Profile Image
                      </DialogTrigger>
                      <DialogContent className="container mx-auto">
                        <DialogHeader>
                          <DialogDescription>
                            {userdata.passportPhoto ? (
                              <span className="flex justify-center rounded-xl items-center bg-blue-300 text-white py-2 px-6">
                                Uploaded Profile Image
                              </span>
                            ) : (
                              <ProfileUploadPage
                                userdata={userdata}
                                data={data}
                                onClose={handleClose}
                              />
                            )}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  )}
                  <form onSubmit={handleSubmitDoctorinfo}>
                    <div>
                      {" "}
                      {/* 2nd step form */}
                      <div className="md:mx-0  mt-6 mx-2">
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiUser className="text-[#5271FF]" />
                                Profile Description*
                              </label>
                              <input
                                type="text"
                                name="profiledescription"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Max 1000 Words Description "
                                value={formData.profiledescription}
                                onChange={handleChange}
                                maxLength={2500}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiCreditCard className="text-[#5271FF]" /> 
                                Consultation Fee*
                              </label>
                              <input
                                type="text"
                                name="consultationfee"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Consultation Fee"
                                value={formData.consultationfee}
                                onChange={handleChange}
                                // required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiCreditCard className="text-[#5271FF]" />
                                Discount*
                              </label>
                              <input
                                type="text"
                                name="discount"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Discount"
                                value={formData.discount}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiCreditCard className="text-[#5271FF]" />
                                Final Price*
                              </label>
                              <input
                                type="text"
                                name="finalPrice"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Final Price"
                                value={formData.finalPrice}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                                <FiPhoneCall className="text-[#5271FF]" />
                                Online Appointment*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  // required
                                  name="onlineappointment"
                                  value={formData.onlineappointment}
                                  onChange={handleChange}
                                >
                                  <option  value="">
                                    Select Yes / No
                                  </option>
                                  <option value="yes">
                                    Yes
                                  </option>
                                  <option  value="no">
                                    No
                                  </option>
                                </select>
                                
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                        <FiHome  className="text-[#5271FF]" />
                                Home Healthcare Visit*
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  // required
                                  name="homehealthcarevisit"
                                  value={formData.homehealthcarevisit}
                                  onChange={handleChange}
                                >
                                  <option  value="">
                                    Select Yes / No
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
                            <FiCreditCard className="text-[#5271FF]" />
                                PAN Card*
                              </label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter PAN Number"
                                name="pancardno"
                                value={formData.pancardno}
                                maxLength="10"
                                minLength="10"
                                onChange={(e) => {
                                  let value = e.target.value.toUpperCase(); // PAN is usually uppercase
                                  value = value.replace(/[^A-Z0-9]/g, ""); // ✅ Only A-Z and 0-9 allowed
                                  handleChange({ target: { name: "pancardno", value } });
                                }}
                                onBlur={() => {
                                  if (formData.pancardno.length !== 10) {
                                    toast.error("PAN Card must be exactly 10 alphanumeric characters.");
                                  }
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[#243460] font-semibold flex items-center gap-2">
                            <FiFile className="text-[#5271FF]" />
                                PAN Card Front Side*
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="pancardfront"
                                  id="pancardfront"
                                  className="hidden"
                                  //required
                                />
                                <label
                                  htmlFor="pancardimg"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.doctorinfo?.pancardfront ||
                                    formData.pancardfront
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
                                          pancardfront: res[0].url, // Ensure res structure matches
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
                                Aadhar Card Number*
                              </label>
                              <input
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter Aadhar Number"
                                name="aadharcardno"
                                value={formData.aadharcardno}
                                maxLength="12" // Restricts input to 12 characters
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  ); // Remove non-numeric characters
                                  handleChange({
                                    target: { name: "aadharcardno", value },
                                  });
                                }}
                                onBlur={() => {
                                  if (formData.aadharcardno.length !== 12) {
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
                                  name="aadharcardfront"
                                  id="aadharcardfront"
                                  className="hidden"
                                  //required
                                />
                                <label
                                  htmlFor="pancardimg"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.doctorinfo?.aadharcardfront ||
                                    formData.aadharcardfront
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
                                          aadharcardfront: res[0].url, // Ensure res structure matches
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
                                  name="aadharcardback"
                                  id="aadharcardback"
                                  className="hidden"
                                  //required
                                />
                                <label
                                  htmlFor="pancardimg"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-400 text-[12px]">
                                    {userdata.doctorinfo?.aadharcardback ||
                                    formData.aadharcardback
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
                                          aadharcardback: res[0].url, // Ensure res structure matches
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
                                  name="bankName"
                                  value={formData.bankName}
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
                                  name="accountNumber"
                                  value={formData.accountNumber}
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
                                  name="ifscCode"
                                  value={formData.ifscCode}
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
                                  name="accountType"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                  value={formData.accountType}
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
                                  name="cancelledCheque"
                                  type="text"
                                  id="cc"
                                  className="hidden"
                                />
                                <label
                                  htmlFor="cc"
                                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white"
                                >
                                  <span className="text-gray-600">
                                    {userdata.doctorinfo.cancelledCheque ||
                                    formData.cancelledCheque
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
                                          cancelledCheque: res[0].url, // Ensure res structure matches
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
                                name="micrCode"
                                type="text"
                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                                placeholder="Enter MICR Code"
                                value={formData.micrCode}
                                onChange={handleChange}
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
                            onClick={handlePreview}
                          >
                            Preview & Submit
                          </button>
                        </div>
                      </div>
                  </form>
                </>
              )}
            </div>
          ) : (
            <Preview formData={formData} onCancel={handleCancelPreview} />
          )}
        </div>
      </div>
    </>
  );
};

export default Doctorprofile;
