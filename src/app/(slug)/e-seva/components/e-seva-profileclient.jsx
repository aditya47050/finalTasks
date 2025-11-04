"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FileCheck2, Loader2 } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import TermsAndConditionOnSubmission from "../components/termsandcondition";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";


const EsevaProfileClient = ({
  states,
  districts,
  subDistricts,
  esevaId,
  userdata,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    pincode: "",
    name: "",
    address: "",
    district: "",
    state: "",
    taluka: "",
    incharge: "",
    inchargeaadharno: "",
    inchargeaadhardoc: "",
    shopactdoc: "",
    inchargepanno: "",
    inchargepandoc: "",
    addressproofType: "",
    addressproofdoc: "",
    regcertificate: "",
    alternatemobile: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    cancelledCheque: "",
    micrCode: "",
    logo: "",
    inchargeprofilepic: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  // Add loading states for each upload field
  const [uploadLoading, setUploadLoading] = useState({
    inchargeaadhardoc: false,
    inchargeprofilepic: false,
    inchargepandoc: false,
    addressproofdoc: false,
    regcertificate: false,
    cancelledCheque: false,
    logo: false,
    shopactdoc: false,
  });

  // Determine role from userdata
  const role = userdata?.role || "Eseva";

  useEffect(() => {
    if (userdata) {
      setFormData({
        email: userdata.email || "",
        mobile: userdata.mobile || "",
        pincode: userdata.pincode || "",
        name: userdata.name || "",
        address: userdata.address || "",
        district: userdata.district || "",
        state: userdata.state || "",
        taluka: userdata.taluka || "",
        incharge: userdata.incharge || "",
        inchargeaadharno: userdata.inchargeaadharno || "",
        inchargeaadhardoc: userdata.inchargeaadhardoc || "",
        shopactdoc: userdata.shopactdoc || "",
        inchargepanno: userdata.inchargepanno || "",
        inchargepandoc: userdata.inchargepandoc || "",
        addressproofType: userdata.addressproofType || "",
        addressproofdoc: userdata.addressproofdoc || "",
        regcertificate: userdata.regcertificate || "",
        alternatemobile: userdata.alternatemobile || "",
        bankName: userdata.bankName || "",
        accountNumber: userdata.accountNumber || "",
        ifscCode: userdata.ifscCode || "",
        accountType: userdata.accountType || "",
        cancelledCheque: userdata.cancelledCheque || "",
        micrCode: userdata.micrCode || "",
        logo: userdata.logo || "",
        inchargeprofilepic: userdata.inchargeprofilepic || "",
      });
      // Populate filteredDistricts based on state
      if (userdata.state) {
        const selectedState = states.find(
          (s) => s.stateName === userdata.state
        );
        const stateDistricts = districts.filter(
          (d) => d.stateId === selectedState?.id
        );
        setFilteredDistricts(stateDistricts);

        // Populate filteredSubDistricts based on district
        if (userdata.district) {
          const selectedDistrict = stateDistricts.find(
            (d) => d.district === userdata.district
          );
          const districtSubDistricts = subDistricts.filter(
            (sd) => sd.districtId === selectedDistrict?.id
          );
          setFilteredSubDistricts(districtSubDistricts);
        }
      }
    }
  }, [userdata, states, districts, subDistricts]);

  // Define regex patterns at the top for reuse
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // Exact PAN format: 5 letters, 4 digits, 1 letter
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/; // Exact IFSC format
const MICR_REGEX = /^\d{9}$/; // Exactly 9 digits
const ACCOUNT_NUMBER_REGEX = /^\d+$/; // Only digits (with length check in validation)

const handleChange = (e) => {
  const { name, value } = e.target;
  let processedValue = value;

  // --- Numeric Only ---
  if (name === "mobile") {
    processedValue = value.replace(/\D/g, "").slice(0, 10); // Only digits, max 10
  } else if (name === "pincode") {
    processedValue = value.replace(/\D/g, "").slice(0, 6); // Only digits, max 6
  } else if (name === "inchargeaadharno") {
    processedValue = value.replace(/\D/g, "").slice(0, 12); // Only digits, max 12
  } else if (name === "accountNumber") {
    processedValue = value.replace(/\D/g, ""); // Only digits
  } else if (name === "micrCode") {
    processedValue = value.replace(/\D/g, "").slice(0, 9); // Only digits, max 9

  // --- Alphanumeric (Uppercase) ---
  } else if (name === "inchargepanno") {
    processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10); // PAN format (A-Z, 0-9)
  } else if (name === "ifscCode") {
    processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11); // IFSC format (A-Z, 0-9)
  }

  // ✅ Update with sanitized value (previously was `value`)
  setFormData((prev) => ({ ...prev, [name]: processedValue }));

  // --- Handle state/district cascading logic (unchanged) ---
  if (name === "state") {
    const selectedState = states.find((state) => state.stateName === processedValue);
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
      (district) => district.district === processedValue
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


  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Helper to set loading state
  const setFieldLoading = (field, value) => {
    setUploadLoading((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Only send relevant fields based on role
      const dataToSave = {
        ...formData,
        esevaId,
      };
      if (role === "Asha") {
        // Remove business/incharge/shopact/PAN/registration certificate fields
        delete dataToSave.incharge;

        delete dataToSave.shopactdoc;
        delete dataToSave.addressproofType;
      }
      const response = await fetch(`/api/e-seva/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });
      if (!response.ok) {
        throw new Error("Failed to save Eseva profile");
      }
      toast.success("Eseva profile saved successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    setIsLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/e-seva/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ esevaId }),
      });
      const { order } = await res.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Eseva Service",
        description: "Eseva Profile Payment",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/e-seva/payment-verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              esevaId,
              amount: order.amount,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast("Payment Successful. Submitting form...");
            await handleSubmit();
          } else {
            toast("Payment verification failed.");
          }
        },
        prefill: {
          name: userdata.name,
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
      toast("Payment process failed.");
    } finally {
      setIsLoading(false);
      setIsProcessingPayment(false);
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/e-seva/${esevaId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ esevaId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update Eseva profile");
      }
      toast.success("Eseva profile updated successfully!");
      router.push("/e-seva/dashboard");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNextWithValidation = () => {
  const isValid = validateCurrentStep();
  if (!isValid) return; // toast handled inside validation
  handleNext();
};

const validateCurrentStep = () => {
  // Helper for toast + return false
  const error = (msg) => {
    toast.error(msg);
    return false;
  };

  switch (currentStep) {
    // ✅ Step 1: Basic Info
    case 1:
      if (!formData.name?.trim()) return error("Name is required.");
      if (!formData.address?.trim()) return error("Address is required.");
      if (!formData.state) return error("Please select a state.");
      if (!formData.district) return error("Please select a district.");
      if (!formData.taluka) return error("Please select a taluka.");
      if (!formData.pincode || !/^\d{6}$/.test(formData.pincode))
        return error("Enter a valid 6-digit pincode.");
      if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
        return error("Enter a valid 10-digit mobile number.");
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        return error("Enter a valid email address.");
      return true;

    // ✅ Step 2: Documents (Eseva role only)
    case 2:
      if (role === "Eseva") {
        if (!formData.incharge?.trim()) return error("Incharge name is required.");
        if (!formData.inchargeaadharno || formData.inchargeaadharno.length !== 12)
          return error("Aadhar number must be 12 digits.");
        if (!formData.inchargeaadhardoc) return error("Upload Aadhar document.");
        if (!formData.inchargeprofilepic) return error("Upload Incharge profile photo.");
        if (
          !formData.inchargepanno ||
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.inchargepanno.toUpperCase())
        )
          return error("Enter a valid PAN number (e.g. ABCDE1234F).");
        if (!formData.inchargepandoc) return error("Upload PAN document.");
        if (!formData.addressproofType) return error("Select address proof type.");
        if (!formData.addressproofdoc) return error("Upload address proof document.");
        if (!formData.regcertificate) return error("Upload registration certificate.");
      }
      return true;

    // ✅ Step 3: Bank Details
    case 3:
      if (!formData.bankName?.trim()) return error("Bank name is required.");
      if (!formData.accountNumber || !/^\d+$/.test(formData.accountNumber))
        return error("Account number must contain only digits.");
      if (
        !formData.ifscCode ||
        !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())
      )
        return error("Enter a valid IFSC code (e.g. ABCD0123456).");
      if (!formData.accountType) return error("Select account type.");
      if (!formData.cancelledCheque) return error("Upload cancelled cheque.");
      if (!formData.micrCode || !/^\d{9}$/.test(formData.micrCode))
        return error("MICR code must be 9 digits.");
      return true;

    // ✅ Step 4: Agreement
    case 4:
      if (!isAgreed) return error("You must agree to the terms before continuing.");
      return true;

    default:
      return false;
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#243460] mb-2">
            {role === "Asha" ? "ASHA Worker Profile" : "E-Seva Profile"}
          </h1>
          <p className="text-[#5271FF] text-lg">
            Update your {role === "Asha" ? "ASHA Worker" : "Eseva"} profile with
            complete details
          </p>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    i + 1 <= currentStep
                      ? "bg-[#5271FF] text-white"
                      : "bg-white text-[#5271FF] border-2 border-[#5271FF]"
                  }`}
                >
                  {i + 1 < currentStep ? <FileCheck2 /> : i + 1}
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
              {
                [
                  "Personal Information",
                  role === "Asha" ? "Documents (Optional)" : "Documents",
                  "Bank Details",
                  "Review",
                ][currentStep - 1]
              }
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      {role === "Asha"
                        ? "ASHA Worker Name*"
                        : "Eseva Center Name*"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder={
                        role === "Asha"
                          ? "Enter ASHA Worker Name"
                          : "Enter Eseva Center Name"
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Address*
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
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
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
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
                    <label className="text-[#243460] font-semibold">
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
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Pincode*
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
                      placeholder="Enter Pincode"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
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
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Email"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && role === "Eseva" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Incharge Name*
                    </label>
                    <input
                      type="text"
                      name="incharge"
                      value={formData.incharge}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Incharge Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Incharge Aadhar Number*
                    </label>
                    <input
                      type="text"
                      name="inchargeaadharno"
                      value={formData.inchargeaadharno}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: { name: "inchargeaadharno", value },
                        });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Aadhar Number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Aadhar Document*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.inchargeaadhardoc
                            ? "Uploaded"
                            : "Upload Aadhar Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.inchargeaadhardoc ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("inchargeaadhardoc", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("inchargeaadhardoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                inchargeaadhardoc: res[0].url,
                              }));
                              toast("Aadhar Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("inchargeaadhardoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Incharge Profile Picture*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.inchargeprofilepic
                            ? "Uploaded"
                            : "Upload Incharge Profile Picture"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.inchargeprofilepic ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("inchargeprofilepic", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("inchargeprofilepic", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                inchargeprofilepic: res[0].url,
                              }));
                              toast("Incharge Profile Picture Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("inchargeprofilepic", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Incharge PAN Number*
                    </label>
                    <input
                      type="text"
                      name="inchargepanno"
                      value={formData.inchargepanno}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter PAN Number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      PAN Document*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.inchargepandoc
                            ? "Uploaded"
                            : "Upload PAN Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.inchargepandoc ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("inchargepandoc", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("inchargepandoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                inchargepandoc: res[0].url,
                              }));
                              toast("PAN Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("inchargepandoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Address Proof Type*
                    </label>
                    <select
                      name="addressproofType"
                      value={formData.addressproofType || ""}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          addressproofType: e.target.value,
                        }))
                      }
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      required
                    >
                      <option value="">Select Document Type</option>
                      <option value="Light Bill">Light Bill</option>
                      <option value="Rent Agreement">Rent Agreement</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Address Proof Document*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.addressproofdoc
                            ? "Uploaded"
                            : "Upload Address Proof Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.addressproofdoc ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("addressproofdoc", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("addressproofdoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                addressproofdoc: res[0].url,
                              }));
                              toast("Address Proof Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("addressproofdoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Registration Certificate*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.regcertificate
                            ? "Uploaded"
                            : "Upload Registration Certificate"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.regcertificate ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("regcertificate", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("regcertificate", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                regcertificate: res[0].url,
                              }));
                              toast("Registration Certificate Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("regcertificate", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && role === "Asha" && (
              <div className="space-y-6 text-center text-gray-500">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Aadhar Number*
                    </label>
                    <input
                      type="text"
                      name="inchargeaadharno"
                      value={formData.inchargeaadharno}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: { name: "inchargeaadharno", value },
                        });
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Aadhar Number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Aadhar Document*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.inchargeaadhardoc
                            ? "Uploaded"
                            : "Upload Aadhar Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.inchargeaadhardoc ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("inchargeaadhardoc", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("inchargeaadhardoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                inchargeaadhardoc: res[0].url,
                              }));
                              toast("Aadhar Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("inchargeaadhardoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      PAN Number*
                    </label>
                    <input
                      type="text"
                      name="inchargepanno"
                      value={formData.inchargepanno}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter PAN Number"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      PAN Document*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.inchargepandoc
                            ? "Uploaded"
                            : "Upload PAN Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.inchargepandoc ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("inchargepandoc", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("inchargepandoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                inchargepandoc: res[0].url,
                              }));
                              toast("PAN Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("inchargepandoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Asha Worker ID Document*
                    </label>
                    <div className="relative">
                      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                        <span className="text-gray-600">
                          {formData.addressproofdoc
                            ? "Uploaded"
                            : "Upload ID Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.addressproofdoc ? (
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
                          onUploadBegin={() =>
                            setFieldLoading("addressproofdoc", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("addressproofdoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                addressproofdoc: res[0].url,
                              }));
                              toast("Address Proof Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("addressproofdoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
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
                    <label className="text-[#243460] font-semibold">
                      Account Number*
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                      placeholder="Enter Account Number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
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
                    <label className="text-[#243460] font-semibold">
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
                    <label className="text-[#243460] font-semibold">
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
                          onUploadBegin={() =>
                            setFieldLoading("cancelledCheque", true)
                          }
                          onClientUploadComplete={(res) => {
                            setFieldLoading("cancelledCheque", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                cancelledCheque: res[0].url,
                              }));
                              toast("Cancelled Cheque Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("cancelledCheque", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
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
                {role !== "Asha" && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold">
                        Logo*
                      </label>
                      <div className="relative">
                        <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                          <span className="text-gray-600">
                            {formData.logo ? "Uploaded" : "Upload Logo"}
                          </span>
                          <UploadButton
                            endpoint="fileUploader"
                            content={{
                              button({ ready }) {
                                return (
                                  <div>
                                    {uploadLoading.logo ? (
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
                            onUploadBegin={() => setFieldLoading("logo", true)}
                            onClientUploadComplete={(res) => {
                              setFieldLoading("logo", false);
                              if (res.length > 0) {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  logo: res[0].url,
                                }));
                                toast("Logo Uploaded");
                              }
                            }}
                            onUploadError={(error) => {
                              setFieldLoading("logo", false);
                              toast(`ERROR! ${error.message}`);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold">
                        Shop Act Document*
                      </label>
                      <div className="relative">
                        <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                          <span className="text-gray-600">
                            {formData.shopactdoc
                              ? "Uploaded"
                              : "Upload Shop Act Document"}
                          </span>
                          <UploadButton
                            endpoint="fileUploader"
                            content={{
                              button({ ready }) {
                                return (
                                  <div>
                                    {uploadLoading.shopactdoc ? (
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
                            onUploadBegin={() =>
                              setFieldLoading("shopactdoc", true)
                            }
                            onClientUploadComplete={(res) => {
                              setFieldLoading("shopactdoc", false);
                              if (res.length > 0) {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  shopactdoc: res[0].url,
                                }));
                                toast("Shop Act Document Uploaded");
                              }
                            }}
                            onUploadError={(error) => {
                              setFieldLoading("shopactdoc", false);
                              toast(`ERROR! ${error.message}`);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#243460]">
                  Review & Submit
                </h2>
                <p className="text-lg text-gray-600">
                  Please review all the information you have entered. If
                  everything is correct, click submit to update your profile.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="terms" className="text-[#243460]">
                    I agree to the <TermsAndConditionOnSubmission />
                  </label>
                </div>
                {userdata.status !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full h-12 bg-[#5271FF] text-white font-bold rounded-xl hover:bg-[#405dcf] transition-all duration-300"
                    disabled={isLoading || !isAgreed}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                )}
                {userdata.payment.forwhat !== "Registration" ||
                  (role !== "Asha" && (
                    <button
                      type="button"
                      onClick={handlePayment}
                      className="w-full h-12 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 mt-4"
                      disabled={isProcessingPayment || !isAgreed}
                    >
                      {isProcessingPayment
                        ? "Processing Payment..."
                        : "Proceed to Payment"}
                    </button>
                  ))}
              </div>
            )}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="w-32 h-12 bg-gray-300 text-[#243460] font-bold rounded-xl hover:bg-gray-400 transition-all duration-300"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={handleNextWithValidation}
                  className="w-32 h-12 bg-[#5271FF] text-white font-bold rounded-xl hover:bg-[#405dcf] transition-all duration-300"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EsevaProfileClient;
