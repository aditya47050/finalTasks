"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiFile, FiEye, FiEyeOff } from "react-icons/fi";
import { UploadButton } from "@uploadthing/react";
export default function EmployerRegisterStepwise() {
  const router = useRouter();
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Employer details
  const [employerName, setEmployerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Step 2: Company + Documents
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [panCardUrl, setPanCardUrl] = useState("");
  const [gstNumberUrl, setGstNumberUrl] = useState("");
  const [addressProofUrl, setAddressProofUrl] = useState("");
  const [idProofUrl, setIdProofUrl] = useState("");

  // Step 3: Password + Confirm + Captcha
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSamePasswordVisible, setIsSamePasswordVisible] = useState(false);
  const [rePassword, setRePassword] = useState("");

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
  const onCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleSendOtp = async () => {
      if (!validateEmail(email)) {
        toast("Please enter a valid email address.");
        return;
      }
      setIsSubmitting(true);
      setIsLoading(true);
      try {
        const res = await fetch("/api/jobaadhar/employer/loginsendotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Failed to send OTP");
        toast("OTP sent to your email");
        setIsOtpSent(true);
      } catch (error) {
        toast("Something went wrong: " + error.message);
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    };
  
    const handleVerifyOtp = async () => {
      if (otp.length !== 6) {
        toast("Please enter a valid 6-digit OTP.");
        return;
      }
      setIsSubmitting(true);
      setIsLoading(true);
      try {
        const verifyRes = await fetch("/api/jobaadhar/employer/loginverifyotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
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

  // Password validation
  if (password !== rePassword) {
    setError("Passwords do not match.");
    return;
  }
  if (!validatePassword(password)) {
    setError("Password does not meet requirements.");
    return;
  }

  setIsSubmitting(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch("/api/jobaadhar/employer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employerName,
        email,
        phone,
        companyName,
        logoUrl,
        documents: {
          panCardUrl,
          gstNumberUrl,
          addressProofUrl,
          idProofUrl,
        },
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed");
    } else {
      setSuccess(
        "Registration successful! Please wait for admin approval before you can login."
      );
      setTimeout(() => router.push("/jobaadhar/employer/login"), 5000);
    }
  } catch (err) {
    console.error(err);
    setError("Unexpected error occurred.");
  } finally {
    setIsSubmitting(false);
  }
};


  const stepTitles = ["Employer Details", "Company & Documents", "Password & Security"];

  return (
    <div className="my-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#5271FF]">Employer Registration</h1>
          <p className="text-[#5271FF] text-lg">Create your company account to post jobs</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i + 1 <= currentStep ? "bg-[#5271FF] text-white" : "bg-white border-2 border-[#5271FF] text-[#5271FF]"}`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && <div className={`flex-1 h-1 mx-2 ${i + 1 < currentStep ? "bg-[#5271FF]" : "bg-gray-300"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[#5271FF] rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-xl font-semibold mb-6 text-center">{stepTitles[currentStep - 1]}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Step 1: Employer Details */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Email */}
                <div className="flex flex-col w-full">
                  <label className="text-white font-semibold flex items-center gap-2">
                      <FiMail className="text-white" />
                      Email ID*
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 px-4 pr-28 border-2 text-black border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                        placeholder="Enter your email"
                        required
                        disabled={isOtpVerified} // Disable if OTP is verified
                      />
                      {!isOtpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="absolute right-2 top-2 bg-white text-[#5271FF] px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                        >
                          {isLoading && !isOtpSent
                            ? "Sending..."
                            : isOtpSent
                              ? "Resend"
                              : "Send OTP"}
                        </button>
                      )}
                    </div>
                </div>
                {/* OTP Verification */}
                <div className="flex flex-col w-full">
                  <label className="text-white font-semibold">
                      Email OTP*
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={otp}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d{0,6}$/.test(inputValue)) {
                            setOtp(inputValue);
                          }
                        }}
                        className="w-full h-12 px-4 pr-28 border-2 border-gray-200 text-black rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                        placeholder="Enter 6-digit OTP"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isOtpVerified || isLoading}
                        className="absolute right-2 top-2 bg-white text-[#5271FF] px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {isLoading && isOtpSent && !isSubmitting
                          ? "Verifying..."
                          : isOtpVerified
                            ? "Verified"
                            : "Verify"}
                      </button>
                    </div>
                </div>
                {/* Full Name */}
                <div className="flex flex-col w-full">
                  <label className="flex items-center gap-2 text-white font-medium">
                    <FiUser /> Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Employer Name"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="mt-1 w-full h-12 text-black px-4 rounded-xl border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
                    required
                  />
                </div>
                {/* Mobile Number */}
                <div className="flex flex-col w-full">
                  <label className="flex items-center gap-2 text-white font-medium">
                    <FiUser /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Company & Documents */}
            {currentStep === 2 && (
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
  {/* Company Name */}
  <div className="flex flex-col w-full">
    <label className="flex items-center gap-2 text-white font-medium">
      <FiUser /> Company Name
    </label>
    <input
      type="text"
      placeholder="Company Name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      className="mt-1 w-full h-12 px-4 rounded-xl border-2 border-gray-300 focus:border-white focus:outline-none text-black"
      required
    />
  </div>

  {/* Company Logo Upload */}
  <div className="flex flex-col w-full">
    <label className="flex items-center gap-2 text-white font-medium">
      <FiFile /> Company Logo (optional)
    </label>
    <div className="relative mt-1">
      <label className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600">
          {logoUrl ? "Uploaded" : "Upload Logo"}
        </span>
        <UploadButton
          endpoint="fileUploader"
          content={{
            button: ({ ready }) => <div>{ready && <div>Upload</div>}</div>,
            allowedContent: () => "",
          }}
          appearance={{
            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onClientUploadComplete={(res) => {
            if (res.length > 0) {
              setLogoUrl(res[0].url);
              toast.success("Logo uploaded successfully!");
            }
          }}
          onUploadError={(error) => toast.error(`ERROR! ${error.message}`)}
        />
      </label>
    </div>
  </div>

  {/* PAN Card Upload */}
  <div className="flex flex-col w-full">
    <label className="flex items-center gap-2 text-white font-medium">
      <FiFile /> PAN Card of Company
    </label>
    <div className="relative mt-1">
      <label className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600">
          {panCardUrl ? "Uploaded" : "Upload PAN"}
        </span>
        <UploadButton
          endpoint="fileUploader"
          content={{
            button: ({ ready }) => <div>{ready && <div>Upload</div>}</div>,
            allowedContent: () => "",
          }}
          appearance={{
            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onClientUploadComplete={(res) => {
            if (res.length > 0) {
              setPanCardUrl(res[0].url);
              toast.success("PAN uploaded successfully!");
            }
          }}
          onUploadError={(error) => toast.error(`ERROR! ${error.message}`)}
        />
      </label>
    </div>
  </div>

  {/* GST Upload */}
  <div className="flex flex-col w-full">
    <label className="flex items-center gap-2 text-white font-medium">
      <FiFile /> GST Document (if applicable)
    </label>
    <div className="relative mt-1">
      <label className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600">
          {gstNumberUrl ? "Uploaded" : "Upload GST"}
        </span>
        <UploadButton
          endpoint="fileUploader"
          content={{
            button: ({ ready }) => <div>{ready && <div>Upload</div>}</div>,
            allowedContent: () => "",
          }}
          appearance={{
            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onClientUploadComplete={(res) => {
            if (res.length > 0) {
              setGstNumberUrl(res[0].url);
              toast.success("GST uploaded successfully!");
            }
          }}
          onUploadError={(error) => toast.error(`ERROR! ${error.message}`)}
        />
      </label>
    </div>
  </div>

  {/* Address Proof Upload */}
  <div className="flex flex-col w-full">
    <label className="flex items-center gap-2 text-white font-medium">
      <FiFile /> Official Address Proof
    </label>
    <div className="relative mt-1">
      <label className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600">
          {addressProofUrl ? "Uploaded" : "Upload Address Proof"}
        </span>
        <UploadButton
          endpoint="fileUploader"
          content={{
            button: ({ ready }) => <div>{ready && <div>Upload</div>}</div>,
            allowedContent: () => "",
          }}
          appearance={{
            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onClientUploadComplete={(res) => {
            if (res.length > 0) {
              setAddressProofUrl(res[0].url);
              toast.success("Address proof uploaded successfully!");
            }
          }}
          onUploadError={(error) => toast.error(`ERROR! ${error.message}`)}
        />
      </label>
    </div>
  </div>

  {/* ID Proof Upload */}
  <div className="flex flex-col w-full">
    <label className="flex items-center gap-2 text-white font-medium">
      <FiFile /> ID Proof of Employer/HR
    </label>
    <div className="relative mt-1">
      <label className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600">
          {idProofUrl ? "Uploaded" : "Upload ID Proof"}
        </span>
        <UploadButton
          endpoint="fileUploader"
          content={{
            button: ({ ready }) => <div>{ready && <div>Upload</div>}</div>,
            allowedContent: () => "",
          }}
          appearance={{
            button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
            container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onClientUploadComplete={(res) => {
            if (res.length > 0) {
              setIdProofUrl(res[0].url);
              toast.success("ID proof uploaded successfully!");
            }
          }}
          onUploadError={(error) => toast.error(`ERROR! ${error.message}`)}
        />
      </label>
    </div>
  </div>
</div>



            )}

            {/* Step 3: Password & Security */}
            {currentStep === 3 && (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="flex flex-col w-full">
                  <label className="text-white font-semibold flex items-center gap-2">
                    <FiLock className="text-white" />
                    Password*
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 pr-12 border-2 text-black border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-xl"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      disabled={!password}
                    >
                      {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {!validatePassword(password) && password && (
                    <p className="text-red-500 text-sm">
                      Password must be at least 8 characters, include 1
                      uppercase, 1 lowercase, 1 number, and 1 special
                      character.
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                   <label className="text-white font-semibold flex items-center gap-2">
                      <FiLock className="text-white" />
                      Re-type Password*
                    </label>
                    <div className="relative">
                      <input
                        type={isSamePasswordVisible ? "text" : "password"}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 border-2 text-black border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                        placeholder="Re-type your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-xl"
                        onClick={() =>
                          setIsSamePasswordVisible(!isSamePasswordVisible)
                        }
                        disabled={!rePassword}
                      >
                        {isSamePasswordVisible ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {rePassword && rePassword !== password && (
                      <p className="text-red-500 text-sm">
                        Passwords do not match.
                      </p>
                    )}
                </div>
              </div>
                {/* TODO: Add CAPTCHA component here */}

              <div className="flex justify-center py-6">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                </div>
              </>
            )}

            {/* Error / Success */}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button type="button" onClick={prevStep} disabled={currentStep === 1}
                      className="px-6 py-2 rounded-xl bg-white text-[#5271FF] disabled:opacity-50">Previous</button>
              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep}
                        className="px-6 py-2 rounded-xl bg-white text-[#5271FF]">Next</button>
              ) : (
                <button type="submit" disabled={isSubmitting}
                        className="px-6 py-2 rounded-xl bg-white text-[#5271FF]">
                  {isSubmitting ? "Submitting..." : "Register"}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link href="/jobaadhar/employer/login" className="text-orange-500 hover:underline font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
