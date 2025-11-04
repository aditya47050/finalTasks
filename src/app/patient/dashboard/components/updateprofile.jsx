"use client";
import { ArrowDown, CalendarDays, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FaEdit, FaCheckCircle } from "react-icons/fa";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image"; // Example for icon use
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UploadButton } from "@uploadthing/react";
import ProfileUploadPage from "./profile-upload";
import Link from "next/link";
import TermsAndConditionOnSubmission from "@/app/components/termsandcondition";
import PatientPreViewBeforeSubmit from "./patientpreviewbeforesubmit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import PatientPreViewWithTicking from "./patientpreviewwithticking";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";
import AddHealthInsurance from "./addhealthinsurance";
const Patientprofile = ({ userdata, state, data, dist, subdist, isUpdateMode = false, rejectedFields = {} }, patientId = userdata?.id) => {
  const formatDate = (date) => {
    if (!date) return ""; // Return an empty string if date is invalid

    const day = date.getDate().toString().padStart(2, "0"); // Get day and pad with 0 if needed
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Return formatted date
  };
  const [open, setOpen] = useState(false); // State to manage dialog visibility

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

const [email, setEmail] = useState(userdata.email);
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadComplete, setUploadComplete] = useState(false); // State to track upload status
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    pincode: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: null, // Use null for DateTime to indicate no value
    gender: "",
    maritalStatus: "",
    religion: "",
    alternateMobile: "",
    presentAddress: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    bloodgroup: "",
    aadharCardNumber: "",
    aadharCardFront: "",
    aadharCardBack: "",
    abhacard: false, // Default to false for Boolean fields
    abhaCardNumber: "",
    abhaCardFront: "",
    healthInsurance: false,
    healthInsuranceNumber: "",
    healthInsuranceDocument: "",
    ayushmancard: false,
    ayushmanCard: "",
    ayushmanCardFront: "",
    rationcard: "",
    rationCardNumber: "",
    rationcardtype: "",
    rationCardFront: "",
    rationCardBack: "",
    organDonation: false,
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    cancelledCheque: "", // Optional field, can initialize as empty
    micrCode: "",
    income: false,
    incomeCertificateimg: "", // Optional field, can initialize as empty
    incomeCertificateNo: "", // Optional field, can initialize as empty
    incomerange: { lakh: "", thousand: "" },
    hasPanCard: false,
    panCardNumber: "",
    panCard: "", // Optional field, can initialize as empty
    contactPersonName: "",
    contactPersonRelation: "",

    contactmanaadharNumber: "",
    isCompanyRegistered: false, // Default to false for Boolean fields
    companyRegistrationNo: "", // Optional field, can initialize as empty
    employeeIdCard: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsAgreed(event.target.checked);
  };
  const handleDateChange = (date) => {
    console.log("Selected Date:", date); // Log the selected date

    // Check if the input date is a valid Date object
    if (date instanceof Date && !isNaN(date)) {
      console.log("Valid Date:", date);
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: date, // Store the valid date in formData
      }));
    } else {
      console.error("Invalid Date Selected:", date);
      toast("Please select a valid date."); // Notify the user about the invalid date
    }
  };

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

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
        district: "",
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
        district: selectedDistrict.district, // Save the district name
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

  const handleimageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("Selected file:", file); // Log the selected file
      setSelectedFile(file);
    } else {
      setSelectedFile(null); // Reset if no file is selected
    }
  };
  const handleFileHealthincardChange = (e) => {
    setFormData({ ...formData, healthInsuranceDocument: e.target.files[0] });
  };
  const handleAadharFrontChange = (e) => {
    setFormData({ ...formData, aadharCardFront: e.target.files[0] });
  };
  const handleAadharBackChange = (e) => {
    setFormData({ ...formData, aadharCardBack: e.target.files[0] });
  };
  const handleabhafront = (e) => {
    setFormData({ ...formData, abhaCardFront: e.target.files[0] });
  };
  const handleayushmanfront = (e) => {
    setFormData({ ...formData, ayushmanCardFront: e.target.files[0] });
  };
  const handlerationfront = (e) => {
    setFormData({ ...formData, rationCardFront: e.target.files[0] });
  };
  const handlerationback = (e) => {
    setFormData({ ...formData, rationCardBack: e.target.files[0] });
  };
  const handlecancelledchecque = (e) => {
    setFormData({ ...formData, cancelledCheque: e.target.files[0] });
  };
  const handleincomeimg = (e) => {
    setFormData({ ...formData, incomeCertificateimg: e.target.files[0] });
  };

  const handleContactAadharFrontChange = (e) => {
    setFormData({ ...formData, contactManaadharFront: e.target.files[0] });
  };
  const handleContactAadharBackChange = (e) => {
    setFormData({ ...formData, contactmanaadharBack: e.target.files[0] });
  };
  const handleEmplCard = (e) => {
    setFormData({ ...formData, employeeIdCard: e.target.files[0] });
  };
  const handlePancard = (e) => {
    setFormData({ ...formData, panCard: e.target.files[0] });
  };
  const [date, setDate] = useState();
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const [isAbhaSelected, setIsAbhaSelected] = useState(false);
  const [ispancardselected, setispancardselected] = useState(false);
  const [isOrganChange, setIsOrganChange] = useState(false);
  const [isHealthInsuranceSelected, setIsHealthInsuranceSelected] =
    useState(false);
  const [isAyushmanSelected, setIsAyushmanSelected] = useState(false);
  const [isincomeyes, setisincomeyes] = useState(false);
  const [iscompanyyes, setiscompanyyes] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    // Set the state to show the preview
    setShowPreview(true);
  };
  const handleCancelPreview = () => {
    setShowPreview(false); // Close the preview and allow editing the form again
  };

  const [hiddenFields, setHiddenFields] = useState([
    "panCard",
    "aadharCardFront",
    "aadharCardBack",
    "abhaCardFront",
    "healthInsuranceDocument",
    "ayushmanCardFront",
    "rationCardFront",
    "rationCardBack",
    "cancelledCheque",
    "incomeCertificateimg",

    "employeeIdCard",
  ]);

  const Preview = ({ formData }) => {
    useEffect(() => {
      if (!userdata?.passportPhoto) {
        toast.error("Please go back and upload a profile photo.");
      }
    }, [userdata?.passportPhoto]);
    return (
      <>
        <PatientPreViewWithTicking formdata={formData} userdata={userdata} />{" "}
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
        <div className="flex mb-8 justify-center space-x-6 mt-2">
          <button
            className="px-6 py-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 focus:outline-none flex items-center space-x-2"
            onClick={handleCancelPreview}
          >
            <span>Edit</span>
          </button>

            <button
              className="px-6 py-3 bg-blue-600 rounded-xl disabled:bg-blue-300 text-white hover:bg-blue-700 focus:outline-none flex items-center space-x-2"
              onClick={() => submitPatientForm()} 
             disabled={!isAgreed || isSubmitting}
            >
             {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          
        </div>
      </>
    );
  };

  const handleAbhaChange = (e) => {
    const isYes = e.target.value === "yes";

    // Update the local state for UI handling
    setIsAbhaSelected(isYes);

    // Update the form data with the boolean value directly
    setFormData((prevFormData) => ({
      ...prevFormData,
      abhacard: isYes, // Set the actual boolean value, true or false
      // Optionally clear ABHA fields if 'No' is selected
      ...(isYes ? {} : { abhaCardNumber: "", abhaCardFront: "" }), // Clear fields if 'No'
    }));
  };

  const handlePancardChange = (e) => {
    const isYes = e.target.value === "yes";

    // Update the local state for UI handling
    setispancardselected(isYes);

    // Update the form data with the boolean value directly
    setFormData((prevFormData) => ({
      ...prevFormData,
      hasPanCard: isYes, // Set the actual boolean value, true or false
      // Optionally clear ABHA fields if 'No' is selected
      ...(isYes ? {} : { panCardNumber: "", panCard: "" }), // Clear fields if 'No'
    }));
  };

  const handleOrganChange = (event) => {
    const isYes = event.target.value === "yes";

    // Update local state for UI control
    setIsOrganChange(isYes);

    // Update form data with actual boolean value
    setFormData({
      ...formData,
      organDonation: isYes, // true or false
    });
  };

  const handleHealthInsuranceChange = (event) => {
    const isYes = event.target.value === "yes";

    // Update local state for conditional rendering and form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      healthInsurance: isYes, // true or false
      ...(isYes
        ? {}
        : { healthInsuranceNumber: "", healthInsuranceDocument: "" }), // Clear fields if 'No'
    }));

    // Update local state for UI handling
    setIsHealthInsuranceSelected(isYes);
  };
  const [rationselected, setrationselected] = useState(false);
  const handleRationChange = (event) => {
    const isYes = event.target.value === "yes";

    // Update local state for conditional rendering and form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      rationcard: isYes, // true or false
      ...(isYes
        ? {}
        : { rationcardtype: "", rationCardNumber: "", rationCardFront: "" }), // Clear fields if 'No'
    }));

    // Update local state for UI handling
    setrationselected(isYes);
  };
  const handleAyushmanChange = (event) => {
    const isYes = event.target.value === "yes";

    // Update local state for conditional rendering and form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      ayushmancard: isYes, // true or false
      ...(isYes ? {} : { ayushmanCard: "", ayushmanCardFront: "" }), // Clear fields if 'No'
    }));

    // Update local state for UI handling
    setIsAyushmanSelected(isYes);
  };

  const handleisincome = (event) => {
    const isYes = event.target.value === "yes";

    // Update local state for conditional rendering and form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      income: isYes, // true or false
      ...(isYes
        ? {}
        : {
            incomeCertificateNo: "",
            incomeCertificateimg: "",
            incomerange: "",
          }), // Clear fields if 'No'
    }));

    // Update local state for UI handling
    setisincomeyes(isYes);
  };

  const handleiscompany = (event) => {
    const isYes = event.target.value === "yes";

    // Update local state for UI control and form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      isCompanyRegistered: isYes,
      ...(isYes ? {} : { companyRegistrationNo: "", employeeIdCard: "" }), // Reset companyRegistrationNo if 'No' is selected
    }));

    // Update local state for UI handling
    setiscompanyyes(isYes);
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

  const handleSecondSubmit = async (e) => {
    e.preventDefault();
    const appendFormData = (formData, data) => {
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });
    };

    // Check if all required fields are filled
    const requiredFields = ["aadharCardNumber"];
    // Add PAN-related fields to validation only if hasPanCard is true
    if (formData.abhacard) {
      requiredFields.push("abhaCardFront", "abhaCardNumber");
    }
    if (formData.rationcard) {
      requiredFields.push("rationCardNumber", "rationCardFront");
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
    setIsSubmitting(true);
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
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  const handleThirdSubmit = async (e) => {
    e.preventDefault();

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
    setIsSubmitting(true);
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
      toast("Form Saved successfully!");
      router.push("/patient/dashboard/profile");
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false); // Hide loading spinner
    }
  };
  const handleFirstSubmit = async (e) => {
    e.preventDefault();
    
    if (isUpdateMode) {
      try {
        const res = await fetch(`/api/patient/${userdata.id}/profileupdate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            mobile: formData.mobile,
            pincode: formData.pincode,
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth?.toISOString(),
            gender: formData.gender,
            bloodgroup: formData.bloodgroup,
            maritalStatus: formData.maritalStatus,
            religion: formData.religion,
            alternateMobile: formData.alternateMobile,
            presentAddress: formData.presentAddress,
            city: formData.city,
            state: formData.state,
            district: formData.district,
            taluka: formData.taluka,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update profile");
        }

        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    } else {
      // Original create profile logic
      const requiredFields = [
        "email", "mobile", "firstName", "lastName", "dateOfBirth", 
        "gender", "maritalStatus", "bloodgroup", "religion", 
        "alternateMobile", "presentAddress", "city", "state", 
        "district", "taluka"
      ];

      for (const field of requiredFields) {
        if (!formData[field]) {
          toast(`Please fill the details: ${field}`);
          return;
        }
      }

      setIsSubmitting(true);
      setIsLoading(true);

      const formPayload = new FormData();
      const formFields = {
        email: formData.email,
        mobile: formData.mobile,
        pincode: formData.pincode,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        gender: formData.gender,
        bloodgroup: formData.bloodgroup,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        alternateMobile: formData.alternateMobile,
        presentAddress: formData.presentAddress,
        city: formData.city,
        state: formData.state,
        district: formData.district,
        taluka: formData.taluka,
      };

      Object.keys(formFields).forEach(key => {
        if (formFields[key]) formPayload.append(key, formFields[key]);
      });

      try {
        const registerRes = await fetch(`/api/patient/${userdata.id}/basic-info`, {
          method: "PUT",
          body: formPayload,
        });

        if (!registerRes.ok) {
          const errorData = await registerRes.json();
          throw new Error(errorData.message || "Failed to update the form.");
        }

        toast("Form submitted successfully!");
      } catch (error) {
        toast(`Error: ${error.message}`);
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
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
      toast(`Please fill the details: ${field}`);
      return;
    }
  }

  setIsSubmitting(true);
  setIsLoading(true);

  if (isUpdateMode) {
    // Handle update without payment
    try {
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
        incomerange: JSON.stringify(formData.incomerange || { lakh: '', thousand: '' })
      };

      Object.keys(formFields).forEach(key => {
        if (formFields[key]) formPayload.append(key, formFields[key]);
      });

      const fileFields = ["panCard", "incomeCertificateimg", "employeeIdCard"];
      fileFields.forEach(field => {
        if (formData[field]) formPayload.append(field, formData[field]);
      });

      const res = await fetch(`/api/patient/${userdata.id}/profileupdate`, {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!");
      router.push("/patient/dashboard/profile");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  } else {
    // Handle create with payment (original flow)
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
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
          const verifyRes = await fetch("/api/patient/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              patientId: userdata.id,
              amount: 100,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast("Payment Successful. Submitting form...");
            await submitPatientForm();
          } else {
            toast("Payment verification failed.");
            setIsSubmitting(false);
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: userdata.email,
          contact: userdata.mobile,
        },
        theme: { color: "#243460" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment failed:", err);
      toast("Payment process failed.");
      setIsSubmitting(false);
      setIsLoading(false);
    }
  }
};
const submitPatientForm = async () => {
  setIsSubmitting(true);
  setIsLoading(true);

  try {
    const formPayload = new FormData();

    // Convert incomerange to a string before appending
    if (formData.incomerange) {
      formPayload.append('incomerange', JSON.stringify(formData.incomerange));
    }
    
    // Prepare all form data with proper type conversion
    const formFields = {
      // Personal Info
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth?.toISOString(), // Convert Date to ISO string
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      religion: formData.religion,
      alternateMobile: formData.alternateMobile,
      presentAddress: formData.presentAddress,
      city: formData.city,
      state: formData.state,
      district: formData.district,
      taluka: formData.taluka,
      pincode: formData.pincode,
      bloodgroup: formData.bloodgroup,
      
      // Documents
      aadharCardNumber: formData.aadharCardNumber,
      abhacard: String(formData.abhacard), // Convert boolean to string
      abhaCardNumber: formData.abhaCardNumber,
      healthInsurance: String(formData.healthInsurance),
      healthInsuranceNumber: formData.healthInsuranceNumber,
      ayushmancard: String(formData.ayushmancard),
      ayushmanCard: formData.ayushmanCard,
      rationcard: String(formData.rationcard),
      rationCardNumber: formData.rationCardNumber,
      rationcardtype: formData.rationcardtype,
      organDonation: String(formData.organDonation),
      
      // Bank & Contact
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      accountType: formData.accountType,
      micrCode: formData.micrCode,
      income: String(formData.income),
      incomeCertificateNo: formData.incomeCertificateNo,
      incomerange: JSON.stringify(formData.incomerange || { lakh: '', thousand: '' }),
      contactPersonName: formData.contactPersonName,
      contactPersonRelation: formData.contactPersonRelation,
      contactmanaadharNumber: formData.contactmanaadharNumber,
      hasPanCard: String(formData.hasPanCard),
      panCardNumber: formData.panCardNumber,
      isCompanyRegistered: String(formData.isCompanyRegistered),
      companyRegistrationNo: formData.companyRegistrationNo,
    };

    // Append all non-file fields
    Object.entries(formFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formPayload.append(key, value);
      }
    });

    // Handle file uploads
    const fileFields = [
      "aadharCardFront",
      "aadharCardBack",
      "abhaCardFront",
      "healthInsuranceDocument",
      "ayushmanCardFront",
      "rationCardFront",
      "rationCardBack",
      "cancelledCheque",
      "incomeCertificateimg",
      "panCard",
      "employeeIdCard"
    ];

    fileFields.forEach(field => {
      if (formData[field]) {
        formPayload.append(field, formData[field]);
      }
    });

    const endpoint = isUpdateMode 
      ? `/api/patient/${patientId}/profileupdate`
      : '/api/patient/complete-submission';

    const method = isUpdateMode ? 'PATCH' : 'POST';
    const res = await fetch(endpoint, {
      method,
      body: formPayload,
      // Note: Don't set Content-Type header - the browser will set it automatically with the correct boundary
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(errorData.message || errorData.error || "Failed to submit form");
    }

    const responseData = await res.json();
    console.log('Success response:', responseData);

    toast.success(
      isUpdateMode 
        ? "Profile updated successfully!" 
        : "Application submitted successfully!"
    );

    router.push(
      isUpdateMode 
        ? "/patient/dashboard" 
        : "/patient/dashboard/digitalhealthcard"
    );

  } catch (err) {
    console.error("Submission error:", err);
    toast.error(
      isUpdateMode
        ? "Failed to update profile. Please try again."
        : "Form submission failed. Please try again."
    );
  } finally {
    setIsSubmitting(false);
    setIsLoading(false);
  }
};

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
          ? userdata.dateOfBirth // Ensure it's stored as YYYY-MM-DD
          : "",
        gender: userdata.gender || "",
        maritalStatus: userdata.maritalStatus || "",
        religion: userdata.religion || "",
        alternateMobile: userdata.alternateMobile || "",
        presentAddress: userdata.presentAddress || "",
        city: userdata.city || "",
        state: userdata.state || "",
        district: userdata.district || "", // Ensure this is set correctly
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
        ayushmancard: userdata.ayushmancard ?? false,
        ayushmanCard: userdata.ayushmanCard || "",
        rationcard: userdata.rationcard ?? false,
        ayushmanCardFront: userdata.ayushmanCardFront || "",
        rationCardNumber: userdata.rationCardNumber || "",
        rationCardFront: userdata.rationCardFront || "",
        rationcardtype: userdata?.rationcardtype || "",
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
        panCard: userdata.panCard || "",
        contactPersonName: userdata.contactPersonName || "",
        contactPersonRelation: userdata.contactPersonRelation || "",
        contactmanaadharNumber: userdata.contactmanaadharNumber || "",
        isCompanyRegistered: userdata.isCompanyRegistered ?? false,
        companyRegistrationNo: userdata.companyRegistrationNo || "",
        employeeIdCard: userdata.employeeIdCard || "",
        panCardNumber: userdata.panCardNumber || "",
        hasPanCard: userdata.hasPanCard ?? false,
      };

      // Check if district is being fetched correctly

      setFormData((prevState) => ({
        ...prevState,
        ...fetchedData,
      }));
    };

    setFormDataOnMount();
  }, []);

  // Helper: Determine if a field should be shown (missing or rejected)
  const isFieldMissingOrRejected = (field) => {
    return !userdata[field] || rejectedFields[field];
  };
  // Helper: Get admin remark for a field
  const getFieldRemark = (field) => rejectedFields[field] || null;

  return (
    <>
      {" "}
      {data?.approvalStatus !== "SUBMITTED" && "APPROVED" ? (
        <div>
          <div className="md:mt-0 lg:mt-7 max-w-6xl   container space-y-2 lg:h-[540px] h-full pb-[200px] md:mb-0 rounded-[15px]">
            {" "}
            <div className="bg-white rounded-xl shadow-xl xl:p-4 p-2 ">
              {" "}
              <div className="justify-center font-poppins text-center pt-1">
                <h1 className="text-[20px] text-[#243460] font-extrabold">
                  Profile Information
                </h1>
                <p className="text-[#5271FF] text-[12px]">
                  Required All Details
                </p>
              </div>
              {/* Main Div container */}{" "}
              {!showPreview ? (
                <div>
                  {/* 1st step form */}
                  {currentStep === 1 && (
                    <form onSubmit={handleFirstSubmit}>
                      <div className="md:mx-0 px-2 md:px-0">
                        <div className="space-y-1  font-poppins md:pt-2">
                          <div className="flex flex-wrap space-y-0 md:space-y-0 md:flex-nowrap md:space-x-4">
                            {isFieldMissingOrRejected('mobile') && (
                              <div className="w-full ">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">Mobile Number*</h1>
                                <input
                                  type="text"
                                  name="mobile"
                                  value={formData.mobile}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    handleChange({ target: { name: "mobile", value } });
                                  }}
                                  className="w-full xl:h-9 md:h-8 h-8 p-2 pr-10 placeholder:ml-4  border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full  border-2 "
                                  placeholder="Enter Number"
                                  required
                                />
                                {getFieldRemark('mobile') && (
                                  <div className="text-red-500 text-xs mt-1">{getFieldRemark('mobile')}</div>
                                )}
                              </div>
                            )}
                            {isFieldMissingOrRejected('email') && (
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">User ID / Email ID*</h1>
                                <div className="relative">
                                  <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full xl:h-9 md:h-8 h-8 p-2 border-2  border-[#243460] placeholder:ml-4 placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full "
                                    placeholder={userdata.email}
                                    disabled={!rejectedFields.email}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isOtpSent || isSubmitting || isOtpSent}
                                    className="absolute right-1 bg-[#243460] text-[8px] md:text-[12px] xl:text-[14px] font-poppins text-white rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
                                  >
                                    {isLoading && !isOtpSent ? "wait!" : isOtpSent ? "Sent" : "Send OTP"}
                                  </button>
                                </div>
                                {getFieldRemark('email') && (
                                  <div className="text-red-500 text-xs mt-1">{getFieldRemark('email')}</div>
                                )}
                              </div>
                            )}
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                Enter Email OTP*
                              </h1>
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
                                  className="w-full xl:h-9 md:h-8 h-8 p-2 pr-10 rounded-full  placeholder:ml-4 border-2 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white"
                                  placeholder="Enter OTP"
                                  // required
                                />
                                <button
                                  type="button"
                                  onClick={handleVerifyOtp}
                                  disabled={isSubmitting}
                                  className="absolute right-1 bg-[#243460] text-[8px] md:text-[12px] xl:text-[14px] text-white font-poppins rounded-2xl px-2 py-1 top-1/2 transform -translate-y-1/2"
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
                        {/* {2nd row} */}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap font-poppins">
                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                First Name*
                              </h1>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z\s]/g,
                                    ""
                                  ); // Allow only alphabets & spaces
                                  handleChange({
                                    target: { name: "firstName", value },
                                  });
                                }}
                                className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] md:text-[11px] text-[10px] p-2 border-2 border-[#243460] rounded-full"
                                placeholder="Enter Patient First Name"
                                required
                              />
                            </div>
                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Middle Name*
                              </h1>
                              <input
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z\s]/g,
                                    ""
                                  ); // Allow only alphabets & spaces
                                  handleChange({
                                    target: { name: "middleName", value },
                                  });
                                }}
                                className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] md:text-[11px] text-[10px] p-2 border-2 border-[#243460] rounded-full "
                                placeholder="Enter Patient Middle Name"
                                required
                              />
                            </div>
                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Last Name*
                              </h1>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z\s]/g,
                                    ""
                                  ); // Allow only alphabets & spaces
                                  handleChange({
                                    target: { name: "lastName", value },
                                  });
                                }}
                                className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] md:text-[11px] text-[10px] p-2 border-2 border-[#243460] rounded-full "
                                placeholder="Enter Patient Last Name"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                            {/* Date of Birth Field */}
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Date Of Birth*
                              </h1>
                              <div className="w-full relative">
                                <DatePicker
                                  selected={formData.dateOfBirth}
                                  onChange={handleDateChange}
                                  dateFormat="dd/MM/yyyy"
                                  showYearDropdown
                                  yearDropdownItemNumber={100}
                                  scrollableYearDropdown
                                  maxDate={new Date()} // Disable next years
                                  showMonthDropdown // Add this to allow month selection
                                  placeholderText="DD/MM/YYYY"
                                  className=" rounded-full p-2  xl:text-[14px] w-[280px] sm:w-[500px] md:text-[11px] md:w-[224px] text-[10px] border-[#243460] lg:w-[220px]  border-2 xl:w-[21rem] xl:h-9 md:h-8 h-8 pr-10" // Base styles for DatePicker
                                  style={{ paddingRight: "2.5rem" }} // Adjusted padding to prevent text from overlapping with the icon
                                  aria-label="Date of Birth" // Accessibility improvement
                                />
                                <span className="absolute xl:right-3 right-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                                  {" "}
                                  {/* Added z-index */}
                                  <CalendarDays
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              </div>
                            </div>

                            {/* Gender Field */}
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins ">
                                Gender*
                              </h1>
                              <div className="relative">
                                <select
                                  className="w-full xl:h-9 md:h-8 h-8 border-2 xl:text-[14px] md:text-[11px] text-[10px] border-[#243460] p-2 rounded-full appearance-none" // Ensures full-width and padding
                                  required
                                  name="gender"
                                  value={formData.gender}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      gender: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select your Gender</option>
                                  <option value="male" className="text-black">
                                    Male
                                  </option>
                                  <option value="female" className="text-black">
                                    Female
                                  </option>
                                  <option value="other" className="text-black">
                                    Other
                                  </option>
                                </select>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                </span>
                              </div>
                            </div>

                            {/* Blood Group Field */}
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins ">
                                Blood Group*
                              </h1>
                              <div className="relative">
                                <select
                                  name="bloodgroup"
                                  className="w-full xl:h-9 md:h-8 h-8 border-2 xl:text-[14px] md:text-[11px] text-[10px] border-[#243460] p-2 rounded-full appearance-none" // Ensures full-width and padding
                                  required
                                  value={formData.bloodgroup}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      bloodgroup: e.target.value,
                                    })
                                  } // Update blood group in formData
                                >
                                  <option value="">Select Blood Group</option>
                                  <option value="A+" className="text-black">
                                    A+
                                  </option>
                                  <option value="A-" className="text-black">
                                    A-
                                  </option>
                                  <option value="B+" className="text-black">
                                    B+
                                  </option>
                                  <option value="B-" className="text-black">
                                    B-
                                  </option>
                                  <option value="O+" className="text-black">
                                    O+
                                  </option>
                                  <option value="O-" className="text-black">
                                    O-
                                  </option>
                                  <option value="AB+" className="text-black">
                                    AB+
                                  </option>
                                  <option value="AB-" className="text-black">
                                    AB-
                                  </option>
                                </select>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4 */}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins ">
                                Marital Status*
                              </h1>
                              <div className="relative">
                                <select
                                  name="maritalStatus"
                                  className="w-full xl:h-9 md:h-8 h-8 border-2 xl:text-[14px] md:text-[11px] text-[10px] font-poppins  border-[#243460] p-1 space-y-3 pl-2  text-gray-600 rounded-full appearance-none"
                                  value={formData.maritalStatus}
                                  onChange={handleChange}
                                >
                                  <option value="">
                                    Select Marital Status
                                  </option>
                                  <option value="unmarried">Unmarried</option>
                                  <option value="married">Married</option>
                                </select>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                </span>
                              </div>
                            </div>
                            <div className="w-full  relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins ">
                                Religion*
                              </h1>
                              <div className="relative">
                                <select
                                  className="w-full xl:h-9 xl:text-[14px] pl-2 md:text-[11px] text-[10px] font-poppins md:h-8 h-8 border-2 border-[#243460] p-1  text-gray-600 rounded-full appearance-none"
                                  name="religion"
                                  value={formData.religion}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Religion</option>
                                  <option value="hinduism">Hinduism</option>
                                  <option value="islam">Islam</option>
                                  <option value="christianity">
                                    Christianity
                                  </option>
                                  <option value="sikhism">Sikhism</option>
                                  <option value="buddhism">Buddhism</option>
                                  <option value="jainism">Jainism</option>
                                  <option value="kabirpanth">
                                    Kabir Panth
                                  </option>

                                  <option value="zoroastrianism">
                                    Zoroastrianism
                                  </option>

                                  <option value="other">Other</option>
                                </select>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                </span>
                              </div>
                            </div>

                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Alternate Mobile Number
                              </h1>
                              <input
                                type="text"
                                name="alternateMobile"
                                value={formData.alternateMobile}
                                onChange={(e) => {
                                  const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10); // Allow only alphabets & spaces
                                  handleChange({
                                    target: { name: "alternateMobile", value },
                                  });
                                }}
                                className="w-full xl:h-9 md:h-8 h-8  xl:text-[14px] md:text-[11px] text-[10px] font-poppins p-2 border-2 border-[#243460] rounded-full "
                                placeholder="Enter Alternate Number"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        {/* 5 */}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                            <div className="w-full">
                              <h1 className="text-[#FF5E00]  font-bold xl:text-[14px] md:text-[11px] text-[10px] ml-4 font-poppins">
                                Present Address*
                              </h1>
                              <input
                                name="presentAddress"
                                type="text"
                                value={formData.presentAddress}
                                onChange={handleChange}
                                className="w-full xl:h-9 md:h-8 h-8 p-2 xl:text-[14px] md:text-[11px] text-[10px] font-poppins border-2 border-[#243460] rounded-full "
                                placeholder="Enter Full Address"
                                required
                              />
                            </div>
                            <div className="w-full">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                City*
                              </h1>
                              <input
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^A-Za-z\s]/g,
                                    ""
                                  ); // Allow only alphabets & spaces
                                  handleChange({
                                    target: { name: "city", value },
                                  });
                                }}
                                className="w-full xl:h-9 md:h-8 h-8 p-2 xl:text-[14px] md:text-[11px] text-[10px] font-poppins border-2 border-[#243460] rounded-full "
                                placeholder="Enter City Name"
                                required
                              />
                            </div>
                            {/* State Dropdown */}
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                {userdata.state ? (
                                  <span className="text-gray-600">
                                    State : {userdata.state}
                                  </span>
                                ) : (
                                  "State*"
                                )}
                              </h1>

                              <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full xl:h-9 md:h-8 h-8 p-2 xl:text-[14px] md:text-[11px] text-[10px] font-poppins border-2 border-[#243460] rounded-full appearance-none"
                              >
                                <option value="">Select State</option>
                                {state.map((state) => (
                                  <option
                                    key={state.id}
                                    value={state.stateName}
                                  >
                                    {state.stateName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* 6 */}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                {userdata.district ? (
                                  <span className="text-gray-600">
                                    {" "}
                                    District : {userdata.district}
                                  </span>
                                ) : (
                                  "District*"
                                )}
                              </h1>
                              <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="w-full xl:h-9 md:h-8 h-8 p-2 xl:text-[14px] md:text-[11px] text-[10px] font-poppins border-2 border-[#243460] rounded-full appearance-none"
                              >
                                <option value="">Select District</option>
                                {filteredDistricts.map((district) => (
                                  <option
                                    key={district.id}
                                    value={district.district}
                                  >
                                    {district.district}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-full ">
                              <h1 className="text-[#FF5E00]  font-bold xl:text-[14px] md:text-[11px] text-[10px] ml-4 font-poppins">
                                {userdata.taluka ? (
                                  <span className="text-gray-600">
                                    {" "}
                                    Taluka : {userdata.taluka}
                                  </span>
                                ) : (
                                  "Taluka*"
                                )}
                              </h1>
                              <div className="relative">
                                <select
                                  name="taluka"
                                  className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] md:text-[11px] text-[10px] pl-2 font-poppins border-2 border-[#243460] p-1  text-gray-600 rounded-full appearance-none"
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
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                </span>
                              </div>
                            </div>
                            <div className="w-full ">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Pin Code*
                              </h1>
                              <input
                                type="text"
                                name="pincode"
                                className="w-full xl:h-9 md:h-8 h-7 p-2 border-2 border-[#243460] xl:text-[14px] md:text-[11px] text-[10px] rounded-full"
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
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center flex-wrap md:flex-nowrap mt-4">
                          <button
                            className=" mt-2  px-4 py-2 bg-[#2b73ec] shadow-xl xl:text-[14px] md:text-[11px] text-[10px] border border-white rounded-full font-poppins  text-white"
                            type="submit"
                          >
                            {data?.approvalStatus !== "APPROVED" ? (
                              <>
                                {isLoading
                                  ? "submitting Please wait.."
                                  : "Save Form"}
                              </>
                            ) : (
                              <>
                                {"You have already submitted your application"}
                              </>
                            )}
                          </button>
                          <button
                            className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white from-[#ffde59] to-[#ff914d] px-4 py-2 rounded-full font-poppins text-white"
                            onClick={handleNext}
                          >
                            Next Page
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* 2nd step form */}
                  {currentStep === 2 && (
                    <form onSubmit={handleSecondSubmit}>
                      <div className="md:mx-0 xl:mt-0 mt-10 mx-2 font-poppins">
                        <div className="space-y-0 md:pt-2">
                          <div className="flex flex-wrap space-y-0 md:space-y-0 md:flex-nowrap md:space-x-4">
                            <div className="w-full ">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                {" "}
                                Aadhar Card Number*
                              </h1>
                              <input
                                name="aadharCardNumber"
                                type="text"
                                className="w-full xl:h-9 md:h-8 h-8 p-2 border-2 border-[#243460] placeholder:ml-4 placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full"
                                placeholder="Enter Aadhar Number"
                                required
                                maxLength="12"
                                value={formData.aadharCardNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  ); // Remove non-numeric characters
                                  handleChange({
                                    target: { name: "aadharCardNumber", value },
                                  });
                                }}
                                onBlur={() => {
                                  if (formData.aadharCardNumber.length !== 12) {
                                    toast.error(
                                      "Aadhar number must be exactly 12 digits."
                                    );
                                  }
                                }}
                              />
                            </div>
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Aadhar Card Front Side*
                              </h1>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="aadharCardFront"
                                  id="aadharFrontInput"
                                  className="hidden"
                                />
                                <label
                                  htmlFor="aadharFrontInput"
                                  className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                >
                                  <span className="text-gray-600">
                                    {userdata.aadharCardFront ||
                                    formData.aadharCardFront
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
                                        "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                      container:
                                        "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                      allowedContent:
                                        "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                    }}
                                    onClientUploadComplete={(res) => {
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          aadharCardFront: res[0].url, // Ensure res structure matches
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

                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Aadhar Card Back Side*
                              </h1>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="aadharBackInput"
                                  id="aadharBackInput"
                                  className="hidden"
                                  onChange={handleAadharBackChange}
                                />
                                <label
                                  htmlFor="aadharBackInput"
                                  className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460]  placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                >
                                  <span className="text-gray-600">
                                    {userdata.aadharCardBack ||
                                    formData.aadharCardBack
                                      ? "Uploaded Already"
                                      : "Back Side"}
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
                                        "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                      container:
                                        "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                      allowedContent:
                                        "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                    }}
                                    onClientUploadComplete={(res) => {
                                      console.log("Files: ", res);
                                      if (res.length > 0) {
                                        setFormData((prevData) => ({
                                          ...prevData,
                                          aadharCardBack: res[0].url, // Ensure res structure matches
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
                          </div>
                        </div>
                        {/* {2nd row} */}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                ABHA Card*
                              </h1>
                              <div className="flex items-center space-x-6 ml-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="ABHA"
                                    value="yes"
                                    checked={formData.abhacard === true}
                                    onChange={handleAbhaChange}
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
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
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                    No
                                  </span>
                                </label>
                              </div>
                            </div>

                            {formData.abhacard === true && (
                              <>
                                <div className="w-full">
                                  <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                    ABHA Card Number*
                                  </h1>
                                  <input
                                    name="abhaCardNumber"
                                    type="text"
                                    value={formData.abhaCardNumber}
                                    onChange={handleChange}
                                    className="w-full xl:h-9 md:h-8 h-8 p-2 border-2 border-[#243460] placeholder:ml-4 placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full"
                                    placeholder="Enter ABHA Number"
                                    required
                                    maxLength="14"
                                  />
                                </div>

                                <div className="w-full relative">
                                  <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                    ABHA Card Front Side*
                                  </h1>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="abhacard"
                                      name="abhaCardFront"
                                      className="hidden"
                                      onChange={handleabhafront}
                                    />
                                    <label
                                      htmlFor="abhacard"
                                      className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                    >
                                      <span className="text-gray-600">
                                        {userdata.abhaCardFront ||
                                        formData.abhaCardFront
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
                                            "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                          container:
                                            "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                          allowedContent:
                                            "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                        }}
                                        onClientUploadComplete={(res) => {
                                          console.log("Files: ", res);
                                          if (res.length > 0) {
                                            setFormData((prevData) => ({
                                              ...prevData,
                                              abhaCardFront: res[0].url, // Ensure res structure matches
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
                              </>
                            )}
                          </div>
                        </div>

                        {/* 3*/}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Health Insurance*
                              </h1>
                              <div className="flex items-center space-x-6 ml-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="health"
                                    value="yes"
                                    checked={formData.healthInsurance === true}
                                    onChange={handleHealthInsuranceChange}
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
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
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                    No
                                  </span>
                                </label>
                              </div>
                            </div>
                            {formData.healthInsurance === true && (
                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Health Insurance Number*
                                </h1>
                                <input
                                  type="text"
                                  name="healthInsuranceNumber"
                                  value={formData.healthInsuranceNumber}
                                  onChange={handleChange}
                                  className="w-full xl:h-9 md:h-8 h-8 p-2 border-2 border-[#243460] placeholder:ml-4 placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full"
                                  placeholder="Enter Policy Number"
                                  required
                                />
                              </div>
                            )}

                            {formData.healthInsurance === true && (
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Health Insurance Document*
                                </h1>
                                <div className="relative">
                                  <input
                                    type="text"
                                    name="healthInsuranceDocument"
                                    id="hea"
                                    className="hidden"
                                    onChange={handleFileHealthincardChange}
                                  />
                                  <label
                                    htmlFor="hea"
                                    className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                  >
                                    <span className="text-gray-600">
                                      {userdata.healthInsuranceDocument ||
                                      formData.healthInsuranceDocument
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
                                          "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                        container:
                                          "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                        allowedContent:
                                          "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                      }}
                                      onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        if (res.length > 0) {
                                          setFormData((prevData) => ({
                                            ...prevData,
                                            healthInsuranceDocument: res[0].url, // Ensure res structure matches
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
                            )}
                          </div>
                        </div>
                        {/* 4 */}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Ayushman Bharat Card*
                              </h1>
                              <div className="flex items-center space-x-6 ml-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="Ayushman"
                                    value="yes"
                                    checked={formData.ayushmancard === true}
                                    onChange={handleAyushmanChange}
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
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
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                    No
                                  </span>
                                </label>
                              </div>
                            </div>
                            {formData.ayushmancard === true && (
                              <div className="w-full ">
                                <h1 className="text-[#FF5E00] truncate font-bold xl:text-[14px] md:text-[11px] text-[10px] ml-4 font-poppins">
                                  {" "}
                                  Ayushman Bharat Card No*
                                </h1>
                                <input
                                  type="text"
                                  name="ayushmanCard"
                                  value={formData.ayushmanCard}
                                  onChange={handleChange}
                                  className="w-full xl:h-9 md:h-8 h-8 p-2 border-2 border-[#243460] placeholder:ml-4 placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full "
                                  placeholder="Enter Card Number"
                                  required
                                  maxLength="14"
                                />
                              </div>
                            )}
                            {formData.ayushmancard === true && (
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                  Ayushman Bharat Card*
                                </h1>
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="bca"
                                    className="hidden"
                                    name="ayushmanCard"
                                    onChange={handleayushmanfront}
                                  />
                                  <label
                                    htmlFor="bca"
                                    className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                  >
                                    <span className="text-gray-600">
                                      {userdata.ayushmanCardFront ||
                                      formData.ayushmanCardFront
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
                                          "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                        container:
                                          "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                        allowedContent:
                                          "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                      }}
                                      onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        if (res.length > 0) {
                                          setFormData((prevData) => ({
                                            ...prevData,
                                            ayushmanCardFront: res[0].url, // Ensure res structure matches
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
                            )}
                          </div>
                        </div>
                        {/* 5 */}
                        <div className="space-y-0 md:pt-2">
                          <div className="flex flex-wrap space-y-0 md:space-y-0 md:flex-nowrap md:space-x-4">
                            <div className="w-full relative">
                              <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                Ration Card*
                              </h1>
                              <div className="flex items-center space-x-6 ml-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="rationcard"
                                    value="yes"
                                    checked={formData.rationcard === true}
                                    onChange={handleRationChange}
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
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
                                    className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                  />
                                  <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                    No
                                  </span>
                                </label>
                              </div>
                            </div>{" "}
                            {formData.rationcard === true && (
                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Ration Card Type*
                                </h1>
                                <div className="relative">
                                  <select
                                    className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] pl-2 md:text-[11px] text-[10px] border-2 border-[#243460] p-1 space-y-3  text-gray-600 rounded-full   appearance-none"
                                    required
                                    name="rationcardtype"
                                    value={formData.rationcardtype}
                                    onChange={handleChange}
                                  >
                                    <option value="">Select Type</option>
                                    <option value="White">
                                      White(For households above the poverty
                                      line)
                                    </option>

                                    <option value="Orange">
                                      Orange(For Above Poverty Line (APL)
                                      households)
                                    </option>
                                    <option value="Yellow">
                                      Yellow ( For Non-Priority households,
                                      generally the middle and
                                      upper-middle-class)
                                    </option>
                                  </select>
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                  </span>
                                </div>{" "}
                              </div>
                            )}
                            {formData.rationcard === true && (
                              <div className="w-full ">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  {" "}
                                  Ration Card Number*
                                </h1>
                                <input
                                  type="text"
                                  value={formData.rationCardNumber}
                                  onChange={handleChange}
                                  name="rationCardNumber"
                                  maxLength="10"
                                  className="w-full xl:h-9 md:h-8 h-8 p-2 border-2 border-[#243460] placeholder:ml-4 placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full "
                                  placeholder="Enter Ration Card Number"
                                  required
                                />
                              </div>
                            )}
                            {formData.rationcard === true && (
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                  Ration Card Document*
                                </h1>
                                <div className="relative">
                                  <input
                                    type="text"
                                    name="rationCardFront"
                                    id="ration"
                                    className="hidden"
                                    onChange={handlerationfront}
                                  />
                                  <label
                                    htmlFor="ration"
                                    className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                  >
                                    <span className="text-gray-600 truncate ">
                                      {userdata.rationCardFront ||
                                      formData.rationCardFront
                                        ? "Uploaded Already"
                                        : "Upload Full Image"}
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
                                          "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[10px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                        container:
                                          "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                        allowedContent:
                                          "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                      }}
                                      onClientUploadComplete={(res) => {
                                        console.log("Files: ", res);
                                        if (res.length > 0) {
                                          setFormData((prevData) => ({
                                            ...prevData,
                                            rationCardFront: res[0].url, // Ensure res structure matches
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
                            )}
                          </div>
                        </div>
                        <div className="flex justify-center mt-2 items-center gap-2">
                          <div className="w-full">
                            <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                              Are you interested in organ donation?
                            </h1>
                            <div className="flex items-center space-x-6 ml-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="organDonation" // Use a consistent name for grouping
                                  value="yes"
                                  checked={formData.organDonation === true}
                                  onChange={handleOrganChange}
                                  className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                />
                                <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                  Yes
                                </span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  checked={formData.organDonation === false}
                                  name="organDonation" // Ensure this matches the first radio button
                                  value="no"
                                  onChange={handleOrganChange}
                                  className="form-radio md:h-8 md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                />
                                <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                  No
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap justify-center mt-4">
                          <button
                            className=" mt-2  px-4 py-2 bg-[#2b73ec] shadow-xl xl:text-[14px] md:text-[11px] text-[10px] border border-white rounded-full font-poppins  text-white"
                            type="submit"
                          >
                            {data?.approvalStatus !== "APPROVED" ? (
                              <>
                                {isLoading
                                  ? "submitting Please wait.."
                                  : "Save Form"}
                              </>
                            ) : (
                              <>
                                {"You have already submitted your application"}
                              </>
                            )}
                          </button>
                          <button
                            className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white from-[#ffde59] to-[#ff914d] px-4 py-2 rounded-full font-poppins text-white"
                            onClick={handlePrevious}
                          >
                            Previous Page
                          </button>
                          <button
                            className="bg-gradient-to-r mt-2 xl:text-[14px] md:text-[11px] text-[10px] border border-white from-[#ffde59] to-[#ff914d] px-4 py-2 rounded-full font-poppins text-white"
                            onClick={handleNext}
                          >
                            Next Page
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                  {/* 3rd stepform */}
                  {currentStep === 3 && (
                    <>
                      {userdata.passportPhoto ? (
                        <span className="flex justify-center rounded-xl items-center bg-blue-300 text-white py-2 px-6">
                          Uploaded Profile Image
                        </span>
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
                      <AddHealthInsurance
                        patientId={userdata.id}
                        healthinsurancedata={userdata.HealthInsurance}
                      />
                      <form onSubmit={handleSubmit}>
                        <div className="md:mx-0 mx-2 font-poppins">
                          <div className="space-y-0 md:pt-2">
                            <div className="flex flex-wrap space-y-0 md:space-y-0 md:flex-nowrap md:space-x-4">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins ">
                                  Bank Name*
                                </h1>
                                <div className="relative">
                                  <select
                                    className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] pl-2 md:text-[11px] text-[10px] border-2 border-[#243460] p-1 space-y-3  text-gray-600 rounded-full   appearance-none"
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
                                    <option value="icici_bank">
                                      ICICI Bank
                                    </option>
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
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                  </span>
                                </div>
                              </div>
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold  xl:text-[14px] md:text-[11px] text-[10px]  ml-4 font-poppins">
                                  Bank Account Number*
                                </h1>
                                <div className="relative">
                                  <input
                                    type="number"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    className="w-full xl:h-9 md:h-8 h-8  p-2 pr-10 placeholder:ml-4  border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full  border-2 "
                                    placeholder="Enter Account Number"
                                  />
                                </div>
                              </div>
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                  IFSC Code*
                                </h1>
                                <div className="relative">
                                  <input
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full xl:h-9 md:h-8 h-8 p-2 pr-10 rounded-full  placeholder:ml-4 border-2 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white"
                                    placeholder="Enter IFSC Code"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* {2nd row} */}
                          <div className="space-y-0 md:pt-2">
                            <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px]  md:text-[11px] text-[10px] ml-4 font-poppins ">
                                  Account Type*
                                </h1>
                                <div className="relative">
                                  <select
                                    name="accountType"
                                    className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] md:text-[11px] text-[10px] border-2 border-[#243460] p-1 space-y-3 pl-2  text-gray-600 rounded-full   appearance-none"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                  >
                                    <option value="">
                                      Select Account Type
                                    </option>
                                    <option value="current">Current</option>
                                    <option value="saving">Saving</option>
                                  </select>
                                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                  </span>
                                </div>
                              </div>
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                  Cancelled Cheque*
                                </h1>
                                <div className="relative">
                                  <input
                                    name="cancelledCheque"
                                    type="text"
                                    id="cc"
                                    className="hidden"
                                    onChange={handlecancelledchecque}
                                  />
                                  <label
                                    htmlFor="cc"
                                    className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                  >
                                    <span className="text-gray-600">
                                      {userdata.cancelledCheque ||
                                      formData.cancelledCheque
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
                                          "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                        container:
                                          "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                        allowedContent:
                                          "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
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
                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  MICR Code*
                                </h1>
                                <input
                                  name="micrCode"
                                  type="text"
                                  className="w-full xl:h-9 md:h-8 xl:text-[14px] md:text-[11px] text-[10px] h-8 p-2 border-2 border-[#243460] rounded-full "
                                  placeholder="Enter MICR Code"
                                  value={formData.micrCode}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-0 md:pt-2">
                            <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Income Certificate*
                                </h1>
                                <div className="flex items-center space-x-6 ml-4">
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      name="Income"
                                      value="yes"
                                      checked={formData.income === true}
                                      onChange={handleisincome}
                                      className="form-radio md:h-8 xl:text-[14px] md:text-[11px] text-[10px] md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                    />
                                    <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                      Yes
                                    </span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      checked={formData.income === false}
                                      name="Income"
                                      value="no"
                                      onChange={handleisincome}
                                      className="form-radio md:h-8 xl:text-[14px] md:text-[11px] text-[10px] md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                    />
                                    <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                      No
                                    </span>
                                  </label>
                                </div>
                              </div>
                              {formData.income === true && (
                                <div className="w-full relative">
                                  <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                    Income Certificate No*
                                  </h1>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="incomeCertificateNo"
                                      className="w-full xl:h-9 md:h-8  h-8 p-2  placeholder:ml-4  border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full  border-2 "
                                      placeholder="Enter Certificate No"
                                      value={formData.incomeCertificateNo}
                                      onChange={handleChange}
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                              {formData.income === true && (
                                <div className="w-full">
                                  <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                    Income in Lakh*
                                  </h1>
                                  <div className="relative">
                                    <select
                                      className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] pl-2 md:text-[11px] text-[10px] border-2 border-[#243460] p-1 space-y-3  text-gray-600 rounded-full appearance-none"
                                      required
                                      name="incomeinlakh"
                                      value={formData.incomerange.lakh}
                                      onChange={handleChange}
                                    >
                                      <option value="">Select in Lakh</option>
                                      {Array.from({ length: 100 }, (_, i) => (
                                        <option key={i} value={i}>
                                          {i} Lakh
                                        </option>
                                      ))}
                                    </select>
                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                    </span>
                                  </div>
                                </div>
                              )}

                              {formData.income === true && (
                                <div className="w-full">
                                  <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                    Income in Thousand*
                                  </h1>
                                  <div className="relative">
                                    <select
                                      className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] pl-2 md:text-[11px] text-[10px] border-2 border-[#243460] p-1 space-y-3  text-gray-600 rounded-full appearance-none"
                                      required
                                      name="incomeinthousand"
                                      value={formData.incomerange.thousand}
                                      onChange={handleChange}
                                    >
                                      <option value="">
                                        Select in Thousand
                                      </option>
                                      {Array.from({ length: 10 }, (_, i) => (
                                        <option key={i} value={i * 10}>
                                          {i * 10} Thousand
                                        </option>
                                      ))}
                                    </select>
                                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                      <ArrowDown className="h-5 w-5 p-1 text-white bg-[#243460] rounded-full" />
                                    </span>
                                  </div>
                                </div>
                              )}

                              {formData.income === true && (
                                <div className="w-full relative">
                                  <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                    Income Certificate*
                                  </h1>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      name="incomeCertificateimg"
                                      id="cca"
                                      className="hidden"
                                      onChange={handleincomeimg}
                                    />
                                    <label
                                      htmlFor="cca"
                                      className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                    >
                                      <span className="text-gray-600">
                                        {userdata.incomeCertificateimg ||
                                        formData.incomeCertificateimg
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
                                            "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                          container:
                                            "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                          allowedContent:
                                            "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                        }}
                                        onClientUploadComplete={(res) => {
                                          console.log("Files: ", res);
                                          if (res.length > 0) {
                                            setFormData((prevData) => ({
                                              ...prevData,
                                              incomeCertificateimg: res[0].url, // Ensure res structure matches
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
                              )}
                            </div>
                          </div>
                          {/* 4 */}

                          {/* 4 */}
                          <div className="space-y-0 md:pt-2">
                            <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Contact Person Name*
                                </h1>
                                <input
                                  type="text"
                                  name="contactPersonName"
                                  className="w-full xl:h-9 md:h-8 xl:text-[14px] md:text-[11px] text-[10px] h-8 p-2 border-2 border-[#243460] rounded-full "
                                  placeholder="Enter Full Name"
                                  value={formData.contactPersonName}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^A-Za-z\s]/g,
                                      ""
                                    ); // Allow only alphabets & spaces
                                    handleChange({
                                      target: {
                                        name: "contactPersonName",
                                        value,
                                      },
                                    });
                                  }}
                                  required
                                />
                              </div>
                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Contact Person Relation*
                                </h1>
                                <select
                                  className="w-full xl:h-9 md:h-8 h-8 appearance-none xl:text-[14px] md:text-[11px] text-[10px] p-2 border-2 border-[#243460] rounded-full bg-white"
                                  required
                                  name="contactPersonRelation"
                                  value={formData.contactPersonRelation}
                                  onChange={handleChange}
                                >
                                  <option value="">Select Relation</option>
                                  <option value="father">Father</option>
                                  <option value="mother">Mother</option>
                                  <option value="mother">Husband</option>
                                  <option value="mother">Wife</option>

                                  <option value="brother">Brother</option>
                                  <option value="sister">Sister</option>
                                  <option value="spouse">Spouse</option>
                                  <option value="son">Son</option>
                                  <option value="daughter">Daughter</option>
                                </select>
                              </div>

                              <div className="w-full">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Contact Person Mobile*
                                </h1>
                                <input
                                  type="text"
                                  className="w-full xl:h-9 md:h-8 h-8 xl:text-[14px] md:text-[11px] text-[10px] p-2 border-2 border-[#243460] rounded-full "
                                  placeholder="Enter Mobile Number"
                                  value={formData.contactmanaadharNumber}
                                  onChange={(e) => {
                                    const value = e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 10); // Allow only alphabets & spaces
                                    handleChange({
                                      target: {
                                        name: "contactmanaadharNumber",
                                        value,
                                      },
                                    });
                                  }}
                                  required
                                  maxLength="10"
                                  name="contactmanaadharNumber"
                                />
                              </div>
                            </div>
                          </div>
                          {/* 5*/}
                          <div className="space-y-0 md:pt-2">
                            <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                              <div className="w-full relative">
                                <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                  Do you have a PAN Card?*
                                </h1>
                                <div className="flex items-center space-x-6 ml-4">
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      name="hasPanCard"
                                      value="yes"
                                      checked={formData.hasPanCard === true}
                                      onChange={handlePancardChange}
                                      className="form-radio md:h-8 xl:text-[14px] md:text-[11px] text-[10px] md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                    />
                                    <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
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
                                      className="form-radio md:h-8 xl:text-[14px] md:text-[11px] text-[10px] md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                    />
                                    <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                      No
                                    </span>
                                  </label>
                                </div>
                              </div>

                              {formData.hasPanCard === true && (
                                <>
                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                      PAN Card Number*
                                    </h1>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        name="panCardNumber"
                                        className="w-full xl:h-9 md:h-8 h-8 p-2 pr-10 placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2"
                                        placeholder="Enter PAN Card Number"
                                        value={formData.panCardNumber}
                                        onChange={handleChange}
                                        required
                                        maxLength="10"
                                      />
                                    </div>
                                  </div>

                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                      Upload PAN Card*
                                    </h1>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        id="pan"
                                        name="panCard"
                                        className="hidden"
                                        onChange={handlePancard}
                                      />
                                      <label
                                        htmlFor="pan"
                                        className="w-full xl:h-9 md:h-8 h-8 p-2 placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                      >
                                        <span className="text-gray-600">
                                          {userdata.panCard || formData.panCard
                                            ? "Uploaded Already"
                                            : "Upload PAN Card"}
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
                                              "w-auto bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                            container:
                                              "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4 border w-auto py-1 bg-[#243460]",
                                            allowedContent:
                                              "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                          }}
                                          onClientUploadComplete={(res) => {
                                            console.log("Files: ", res);
                                            if (res.length > 0) {
                                              setFormData((prevData) => ({
                                                ...prevData,
                                                panCard: res[0].url,
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
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-0 md:pt-2">
                            <div className="space-y-0 md:pt-2">
                              <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                                <div className="w-full relative">
                                  <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                    Your Company Registered?
                                  </h1>
                                  <div className="flex items-center space-x-6 ml-4">
                                    <label className="inline-flex items-center">
                                      <input
                                        type="radio"
                                        name="isCompanyRegistered"
                                        value="yes"
                                        checked={
                                          formData.isCompanyRegistered === true
                                        }
                                        onChange={handleiscompany}
                                        className="form-radio md:h-8 xl:text-[14px] md:text-[11px] text-[10px] md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                      />
                                      <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                        Yes
                                      </span>
                                    </label>
                                    <label className="inline-flex items-center">
                                      <input
                                        type="radio"
                                        name="isCompanyRegistered"
                                        value="no"
                                        checked={
                                          formData.isCompanyRegistered === false
                                        }
                                        onChange={handleiscompany}
                                        className="form-radio md:h-8 xl:text-[14px] md:text-[11px] text-[10px] md:w-7 h-4 w-4 text-[#243460] border-gray-300"
                                      />
                                      <span className="ml-2 text-[#243460] font-bold xl:text-[14px] md:text-[11px] text-[10px]">
                                        No
                                      </span>
                                    </label>
                                  </div>
                                </div>
                                {formData.isCompanyRegistered === true && (
                                  <div className="w-full ">
                                    <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px] ml-4 font-poppins">
                                      {" "}
                                      Company Registration No*
                                    </h1>
                                    <input
                                      type="text"
                                      className="w-full xl:h-9 md:h-8 h-8 p-2 border-2 border-[#243460] placeholder:ml-4 placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full "
                                      placeholder="Enter Registration Number"
                                      required
                                      name="companyRegistrationNo"
                                      value={formData.companyRegistrationNo}
                                      onChange={handleChange}
                                    />
                                  </div>
                                )}
                                {formData.isCompanyRegistered === true && (
                                  <div className="w-full relative">
                                    <h1 className="text-[#FF5E00] font-bold xl:text-[14px] md:text-[11px] md:mt-0 mt-2 text-[10px]  ml-4 font-poppins">
                                      Employee ID Card*
                                    </h1>
                                    <div className="relative">
                                      <input
                                        type="text"
                                        id="cpap"
                                        name="employeeIdCard"
                                        className="hidden"
                                        onChange={handleEmplCard}
                                      />
                                      <label
                                        htmlFor="cpap"
                                        className="w-full xl:h-9 md:h-8 h-8 p-2  placeholder:ml-4 border-[#243460] placeholder:text-gray-600 xl:text-[14px] md:text-[11px] text-[10px] bg-white rounded-full border-2 cursor-pointer flex items-center justify-between"
                                      >
                                        <span className="text-gray-600">
                                          {userdata.employeeIdCard ||
                                          formData.employeeIdCard
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
                                              "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                                            container:
                                              "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                                            allowedContent:
                                              "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                                          }}
                                          onClientUploadComplete={(res) => {
                                            console.log("Files: ", res);
                                            if (res.length > 0) {
                                              setFormData((prevData) => ({
                                                ...prevData,
                                                employeeIdCard: res[0].url, // Ensure res structure matches
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
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col mb-8  gap-4">
                            <div className="flex flex-wrap md:flex-nowrap justify-center gap-2">
                              <button
                                className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white from-[#ffde59] to-[#ff914d] px-4 py-2 rounded-full font-poppins text-white"
                                onClick={handlePrevious}
                              >
                                Previous Page
                              </button>
                              <button
                                className=" mt-2 bg-gradient-to-r shadow-xl xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-blue-600 px-4 py-2 rounded-full font-poppins  text-white"
                                onClick={handleThirdSubmit}
                              >
                                {isLoading
                                  ? "Saving Please wait.."
                                  : "Save Form"}
                              </button>
                              <button
                                className=" mt-2 bg-gradient-to-r shadow-xl xl:text-[14px] md:text-[11px] text-[10px] border border-white bg-blue-600 px-4 py-2 rounded-full font-poppins  text-white"
                                onClick={handlePreview}
                              >
                                Preview & Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              ) : (
                <Preview formData={formData} onCancel={handleCancelPreview} />
              )}
              {/* {currentStep === 4 && (
            <>
              {" "}
              <ProfileUploadPage userdata={userdata} data={data} />
              <div className="flex justify-between">
                {" "}
                <button
                  className="bg-gradient-to-r mt-2 xl:text-[14px] shadow-xl md:text-[11px] text-[10px] border border-white from-[#ffde59] to-[#ff914d] px-4 py-2 rounded-full font-poppins text-white"
                  onClick={handlePrevious}
                >
                  Previous Page
                </button>
              </div>{" "}
            </>
          )} */}
            </div>
          </div>
        </div>
      ) : (
        <PatientPreViewBeforeSubmit FormData={formData} userdata={userdata} />
      )}
    </>
  );
};

export default Patientprofile;
