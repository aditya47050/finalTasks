"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import TermsAndConditionOnSubmission from "../components/termsandcondition";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";
import { Eye, EyeOff, FileCheck2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const EsevaSubAdminProfileClient = ({ esevaId, userdata, activeSubAdminCount }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    mobile: "",
    address: "",
    aadharno: "",
    aadhardoc: "",
    panno: "",
    pandoc: "",
    profilepic: "",
    password: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [subAdminId, setSubAdminId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState({
    aadhardoc: false,
    pandoc: false,
    profilepic: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userdata.email }), // Use E-Seva email for OTP
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your E-Seva email.");
      } else {
        toast.error(data.error);
      }
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
        body: JSON.stringify({ email: userdata.email , otp }), // Verify using E-Seva email
      });
      const data = await response.json();
      if (data.success) {
        setOtpVerified(true);
        toast.success("OTP verified successfully.");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error verifying OTP: " + error.message);
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/e-seva/subadminprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          esevaId,
          role: "SubAdmin"
        }),
      });
  
      const result = await response.json(); // Move this line here to ensure result is initialized
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to save Eseva Sub-Admin profile");
      }
  
      setSubAdminId(result.subAdmin.id);
      toast.success("Eseva Sub-Admin profile saved successfully!");
      if (activeSubAdminCount < 4) {
        router.push("/e-seva/dashboard");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayment = async () => {
    if (!subAdminId) {
      toast.error("Please save the profile first before proceeding to payment");
      return;
    }
    setIsPaying(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }
  
    try {
      const res = await fetch("/api/e-seva/subadmin/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subAdminId, esevaId, amount: 36500 }) // Rs. 365 in paise
      });
  
      const { order } = await res.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Eseva Service",
        description: "Eseva Sub-Admin Registration",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch("/api/e-seva/subadmin/payment-verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subAdminId,
              amount: order.amount,
            }),
          });
  
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success("Payment Successful. SubAdmin profile created Successfully!");
            router.push("/e-seva/dashboard");
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
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
    } finally {
      setIsPaying(false);
    }
  };


  const setFieldLoading = (field, value) => {
    setUploadLoading((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (currentStep === 2 && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    if (currentStep === 2 && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return false;
    }
    return true;
  };

  const validateCurrentStep = () => {
    let requiredFields = [];
  
    if (currentStep === 1) {
      requiredFields = ["name", "email", "mobile", "aadharno", "panno", "address"];
    } else if (currentStep === 2) {
      requiredFields = ["password", "confirmPassword"];
    }
  
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill the ${field} field.`);
        return false;
      }
    }
  
    if (currentStep === 2 && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
  
    return true;
  };
  
  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#243460] mb-2">
            E-Seva Sub-Admin Profile
          </h1>
          <p className="text-[#5271FF] text-lg">
            Update your Eseva Sub-Admin profile details
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* OTP Verification Section */}
                <div className="space-y-6 mb-8 p-4 border rounded-xl bg-gray-50">
                  <h2 className="text-xl font-bold text-[#243460]">Verify E-Seva Email</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold">
                        E-Seva Email*
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="esevaEmail"
                          value={userdata.email}
                          readOnly
                          className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300 bg-gray-100"
                          placeholder="E-Seva Email ID"
                          required
                        />
                        <Button
                          type="button"
                          onClick={sendOtp}
                          disabled={otpSent || sendOtpLoading || !userdata.email}
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

                    <div className="space-y-2">
                      <label className="text-[#243460] font-semibold">
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
                          disabled={otpVerified}
                        />
                        <Button
                          type="button"
                          onClick={verifyOtp}
                          disabled={otpVerified || verifyOtpLoading || !otp}
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
                  </div>
                </div>

                {/* Basic Details Section */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                        !otpVerified
                          ? 'cursor-not-allowed relative'
                          : 'border-gray-200 focus:border-[#5271FF] focus:outline-none'
                      }`}
                      placeholder="Enter Full Name"
                      required
                      disabled={!otpVerified} 
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
                      className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                        !otpVerified
                          ? 'cursor-not-allowed relative'
                          : 'border-gray-200 focus:border-[#5271FF] focus:outline-none'
                      }`}
                      placeholder="Enter Sub-Admin Email"
                      required
                      disabled={!otpVerified} // Disable until OTP is verified
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Mobile Number*
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        handleChange({ target: { name: "mobile", value } });
                      }}
                      className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                        !otpVerified
                          ? 'cursor-not-allowed relative'
                          : 'border-gray-200 focus:border-[#5271FF] focus:outline-none'
                      }`}
                      placeholder="Enter Mobile Number"
                      required
                      disabled={!otpVerified} // Disable until OTP is verified
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Aadhar Number*
                    </label>
                    <input
                      type="text"
                      name="aadharno"
                      value={formData.aadharno}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                        handleChange({ target: { name: "aadharno", value } });
                      }}
                      className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                        !otpVerified
                          ? 'cursor-not-allowed relative'
                          : 'border-gray-200 focus:border-[#5271FF] focus:outline-none'
                      }`}
                      placeholder="Enter Aadhar Number"
                      required
                      disabled={!otpVerified} // Disable until OTP is verified
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Aadhar Document*
                    </label>
                    <div className="relative">
                      <label       className={`w-full h-12 px-4 border-2 rounded-xl flex items-center justify-between transition-all duration-300 ${
        !otpVerified
          ? 'cursor-not-allowed relative'
          : 'border-gray-200 cursor-pointer'
      }`}>
                        <span className="text-gray-600">
                          {formData.aadhardoc ? "Uploaded" : "Upload Aadhar Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.aadhardoc ? (
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
                            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onUploadBegin={() => setFieldLoading("aadhardoc", true)}
                          onClientUploadComplete={(res) => {
                            setFieldLoading("aadhardoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                aadhardoc: res[0].url,
                              }));
                              toast("Aadhar Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("aadhardoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                          disabled={!otpVerified} // Disable until OTP is verified
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Profile Picture
                    </label>
                    <div className="relative">
                    <label       className={`w-full h-12 px-4 border-2 rounded-xl flex items-center justify-between transition-all duration-300 ${
        !otpVerified
          ? 'cursor-not-allowed relative'
          : 'border-gray-200 cursor-pointer'
      }`}>
                        <span className="text-gray-600">
                          {formData.profilepic ? "Uploaded" : "Upload Profile Picture"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.profilepic ? (
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
                            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onUploadBegin={() => setFieldLoading("profilepic", true)}
                          onClientUploadComplete={(res) => {
                            setFieldLoading("profilepic", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                profilepic: res[0].url,
                              }));
                              toast("Profile Picture Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("profilepic", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                          disabled={!otpVerified} // Disable until OTP is verified
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      PAN Number*
                    </label>
                    <input
                      type="text"
                      name="panno"
                      value={formData.panno}
                      onChange={handleChange}
                      className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                        !otpVerified
                          ? 'cursor-not-allowed relative'
                          : 'border-gray-200 focus:border-[#5271FF] focus:outline-none'
                      }`}
                      placeholder="Enter PAN Number"
                      required
                      disabled={!otpVerified} // Disable until OTP is verified
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      PAN Document*
                    </label>
                    <div className="relative">
                    <label
      className={`w-full h-12 px-4 border-2 rounded-xl flex items-center justify-between transition-all duration-300 ${
        !otpVerified
          ? 'cursor-not-allowed relative'
          : 'border-gray-200 cursor-pointer'
      }`}
    >
                        <span className="text-gray-600">
                          {formData.pandoc ? "Uploaded" : "Upload PAN Document"}
                        </span>
                        <UploadButton
                          endpoint="fileUploader"
                          content={{
                            button({ ready }) {
                              return (
                                <div>
                                  {uploadLoading.pandoc ? (
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
                            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                            allowedContent: "hidden",
                          }}
                          onUploadBegin={() => setFieldLoading("pandoc", true)}
                          onClientUploadComplete={(res) => {
                            setFieldLoading("pandoc", false);
                            if (res.length > 0) {
                              setFormData((prevData) => ({
                                ...prevData,
                                pandoc: res[0].url,
                              }));
                              toast("PAN Document Uploaded");
                            }
                          }}
                          onUploadError={(error) => {
                            setFieldLoading("pandoc", false);
                            toast(`ERROR! ${error.message}`);
                          }}
                          disabled={!otpVerified} // Disable until OTP is verified
                        />
                      </label>
                    </div>
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
                      className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                        !otpVerified
                          ? 'cursor-not-allowed relative'
                          : 'border-gray-200 focus:border-[#5271FF] focus:outline-none'
                      }`}
                      placeholder="Enter Address"
                      required
                      disabled={!otpVerified} // Disable until OTP is verified
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#243460]">Set Password</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        placeholder="Enter Password"
                        required
                        disabled={!otpVerified} // Disable until OTP is verified
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[#243460] font-semibold">
                      Confirm Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#5271FF] focus:outline-none transition-all duration-300"
                        placeholder="Confirm Password"
                        required
                        disabled={!otpVerified} // Disable until OTP is verified
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="text-red-500 text-sm mt-2">
                    Password and Confirm Password do not match.
                  </div>
                )}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Password Requirements:</strong>
                    <br />• Minimum 6 characters
                    <br />• Must match in both fields
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#243460]">
                  Review & Submit
                </h2>
                <p className="text-lg text-gray-600">
                  Please review all the information you have entered. If everything is correct, click submit to update your profile.
                </p>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-4 h-4"
                    disabled={!otpVerified} // Disable until OTP is verified
                  />
                  <label htmlFor="terms" className="text-[#243460]">
                    I agree to the <TermsAndConditionOnSubmission />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full h-12 bg-[#5271FF] text-white font-bold rounded-xl hover:bg-[#405dcf] transition-all duration-300 flex items-center justify-center"
                  disabled={isLoading || !isAgreed || !otpVerified} // Disable until OTP is verified
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : "Save Profile"}
                </button>
                {activeSubAdminCount >= 4 && (
                  <button
                    type="button"
                    onClick={handlePayment}
                    className="w-full h-12 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
                    disabled={isLoading || !isAgreed || !otpVerified} // Disable until OTP is verified
                  >
                    {isPaying ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : "Proceed to Payment"}
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="w-32 h-12 bg-gray-300 text-[#243460] font-bold rounded-xl hover:bg-gray-400 transition-all duration-300"
                  disabled={!otpVerified} // Disable until OTP is verified
                >
                  Previous
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`w-32 h-12 bg-[#5271FF] text-white font-bold rounded-xl hover:bg-[#405dcf] transition-all duration-300 ${
                    !otpVerified
                      ? 'cursor-not-allowed'
                      : 'w-32 h-12 bg-[#5271FF] text-white font-bold rounded-xl hover:bg-[#405dcf] transition-all duration-300'
                  }`}
                  disabled={!otpVerified} // Disable until OTP is verified
                >
                  Next
                </button>
              ) : (
                <div className="w-32"></div> // Empty div for spacing
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EsevaSubAdminProfileClient;