"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff, FiMapPin } from "react-icons/fi";
import { UploadButton } from "@uploadthing/react";

export default function MartSellerRegisterStepwise() {
  const router = useRouter();
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Email & Business
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [pincode, setPincode] = useState("");

  // Step 2: Documents & Brand
  const [panNumber, setPanNumber] = useState("");
  const [panCardUrl, setPanCardUrl] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharCardUrl, setAadharCardUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");

  // Step 3: Password & Security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // General states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>?]).{8,}$/.test(password);

  const onCaptchaChange = (value) => setCaptchaVerified(!!value);

  // OTP functions
  const handleSendOtp = async () => {
    if (!validateEmail(email)) return toast.error("Enter a valid email");
    setIsLoading(true);
    try {
      const res = await fetch("/api/aarogyamart/martseller/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setIsOtpSent(true);
      toast.success("OTP sent to email");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter valid 6-digit OTP");
    setIsLoading(true);
    try {
      const res = await fetch("/api/aarogyamart/martseller/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpVerified(true);
        toast.success("OTP verified");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (!validatePassword(password)) return setError("Weak password. Must contain 8+ chars, 1 uppercase, 1 number, 1 special char");
    if (!captchaVerified) return setError("Please complete captcha");

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/aarogyamart/martseller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          address,
          pincode,
          gstNumber,
          panNumber,
          panCardUrl,
          aadharNumber,
          aadharCardUrl,
          brandName,
          brandLogoUrl,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => router.push("/martseller/login"), 2000);
      }
    } catch (err) {
      setError("Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = ["Email & Business Details", "Documents & Brand", "Password & Security"];
  const nextStep = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  return (
    <div className="my-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#5271FF]">Mart Seller Registration</h1>
          <p className="text-[#5271FF] text-lg">Create your account to sell on Mart</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  i + 1 <= currentStep
                    ? "bg-[#5271FF] text-white"
                    : "bg-white border-2 border-[#5271FF] text-[#5271FF]"
                }`}
              >
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    i + 1 < currentStep ? "bg-[#5271FF]" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#5271FF] rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {stepTitles[currentStep - 1]}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <FiMail /> Enter Email Id*
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                      disabled={isOtpVerified}
                      placeholder="Enter Email Id"
                      required
                    />
                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="absolute right-2 top-2 px-3 py-1 rounded-xl bg-white text-[#5271FF] text-sm"
                      >
                        {isOtpSent ? "Resend" : "Send OTP"}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="font-semibold">Email OTP*</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={otp}
                      onChange={(e) =>
                        /^\d{0,6}$/.test(e.target.value) && setOtp(e.target.value)
                      }
                      className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                      required
                      placeholder="Enter 6-Digit OTP"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="absolute right-2 top-2 px-3 py-1 rounded-xl bg-white text-[#5271FF] text-sm"
                      disabled={isOtpVerified}
                    >
                      {isOtpVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <FiUser /> Mobile*
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                    required
                    placeholder="Enter 10-Digit Mobile No"
                  />
                </div>
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <FiMapPin /> Address*
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                    required
                    placeholder="Enter Full Address"
                  />
                </div>
                <div>
                  <label className="font-semibold">Pincode</label>
                  <input
                    type="number"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                    placeholder="Enter 6-Digit Pincode"
                  />
                </div>
                <div>
                  <label className="font-semibold">GST Number</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                    placeholder="Enter GST Number"
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PAN Number */}
                <div>
                  <label className="font-semibold">PAN Number*</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                    required
                    placeholder="Enter Pan Card Number"
                  />
                </div>

                {/* PAN Upload */}
                <div>
                  <label className="font-semibold flex gap-2 items-center">
                    Upload PAN Card
                  </label>
                  <label className="w-full h-12 bg-white px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                    <span className="text-gray-600">
                      {panCardUrl ? "Uploaded" : "Upload PAN Card"}
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
                      onClientUploadComplete={(res) => {
                        if (res.length > 0) {
                          setPanCardUrl(res[0].url);
                          toast.success("Upload Completed");
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(`ERROR! ${error.message}`);
                      }}
                    />
                  </label>
                </div>

                {/* Aadhaar Number */}
                <div>
                  <label className="font-semibold">Aadhaar Number*</label>
                  <input
                    type="text"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                    required
                    placeholder="Enter Aadhar Number"
                  />
                </div>

                {/* Aadhaar Upload */}
                <div>
                  <label className="font-semibold flex gap-2 items-center">
                    Upload Aadhaar Card
                  </label>
                  <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white">
                    <span className="text-gray-600">
                      {aadharCardUrl ? "Uploaded" : "Upload Aadhaar Card"}
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
                      onClientUploadComplete={(res) => {
                        if (res.length > 0) {
                          setAadharCardUrl(res[0].url);
                          toast.success("Upload Completed");
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(`ERROR! ${error.message}`);
                      }}
                    />
                  </label>
                </div>
                
                {/* Brand Name */}
                <div>
                  <label className="font-semibold">Brand Name*</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300"
                    required
                    placeholder="Enter Brand Name"
                  />
                </div>

                {/* Brand Logo Upload */}
                <div>
                  <label className="font-semibold flex gap-2 items-center">
                    Upload Brand Logo
                  </label>
                  <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white">
                    <span className="text-gray-600">
                      {brandLogoUrl ? "Uploaded" : "Upload Brand Logo"}
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
                      onClientUploadComplete={(res) => {
                        if (res.length > 0) {
                          setBrandLogoUrl(res[0].url);
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
            )}
            {/* Step 3 */}
            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-semibold flex items-center gap-2">
                      <FiLock /> Password*
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-10 rounded-xl text-black border-2 border-gray-300"
                        required
                        placeholder="Enter Password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      >
                        {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold flex items-center gap-2">
                      <FiLock /> Confirm Password*
                    </label>
                    <div className="relative">
                      <input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-10 rounded-xl text-black border-2 border-gray-300"
                        required
                        placeholder="Enter Confirm Password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                        onClick={() =>
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                        }
                      >
                        {isConfirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center py-6">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                </div>
              </>
            )}

            {/* Error & Success */}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 rounded-xl bg-white text-[#5271FF] disabled:opacity-50"
              >
                Previous
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 rounded-xl bg-white text-[#5271FF]"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-white text-[#5271FF]"
                >
                  {isSubmitting ? "Submitting..." : "Register"}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link
            href="/martseller/login"
            className="text-orange-500 hover:underline font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}