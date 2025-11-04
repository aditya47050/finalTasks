"use client";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiUser,
  FiMapPin,
  FiCheck,
} from "react-icons/fi";
import HeadingClientMain from "@/app/components/heading";

const RegistrationDesign2 = ({ states, dist, subdist }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // All state variables (same as original)
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [incharge, setIncharge] = useState("");
  const [inchargeAadharNo, setInchargeAadharNo] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [taluka, setTaluka] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSamePasswordVisible, setIsSamePasswordVisible] = useState(false);

  // All validation and handler functions (same as original)
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

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      toast("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
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
      const verifyRes = await fetch("/api/verify-otp", {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      const selectedState = states.find((state) => state.stateName === value);
      const districts = dist.filter(
        (district) => district.stateId === selectedState.id
      );
      setFilteredDistricts(districts);
      setFilteredSubDistricts([]);
      setState(selectedState.stateName);
      setDistrict("");
      setTaluka("");
    }
    if (name === "district") {
      const selectedDistrict = dist.find(
        (district) => district.district === value
      );
      const subDistricts = subdist.filter(
        (subDistrict) => subDistrict.districtId === selectedDistrict.id
      );
      setFilteredSubDistricts(subDistricts);
      setDistrict(selectedDistrict.district);
      setTaluka("");
    }
    if (name === "taluka") {
      setTaluka(value);
    }
    if (name === "role") {
      setRole(value);
      // Clear incharge fields when ASHA is selected
      if (value === "Asha") {
        setIncharge("");
        setInchargeAadharNo("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast("Please enter a valid email address.");
      return;
    }
    if (!captchaVerified) {
      toast("Please verify that you are not a robot.");
      return;
    }
    if (!isOtpVerified) {
      toast("Please verify OTP before submitting.");
      return;
    }
    if (!validatePassword(password)) {
      toast("Password does not meet the required criteria.");
      return;
    }
    if (password !== rePassword) {
      toast("Passwords don't match");
      return;
    }
    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      toast("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      toast("Please enter a valid 6-digit pincode.");
      return;
    }
    // Only validate Aadhar for E-seva (not ASHA)
    if (role === "Eseva" && inchargeAadharNo && !validateAadhar(inchargeAadharNo)) {
      toast("Please enter a valid 12-digit Aadhar number.");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const registerRes = await fetch("/api/e-seva/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          district,
          taluka,
          state,
          incharge: role === "Asha" ? "" : incharge,
          inchargeAadharNo: role === "Asha" ? "" : inchargeAadharNo,
          mobile,
          email,
          password,
          pincode,
          role,
        }),
      });

      const data = await registerRes.json();
      if (!registerRes.ok) {
        toast(data.message || "Failed to create an account");
        return;
      }
      toast(data?.message || "Account created successfully!");
      router.push("/e-seva/dashboard/profile");

    } catch (error) {
      toast("Failed to create an account: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const onCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const nextStep = () => {
    if (currentStep < totalSteps && areFieldsFilled()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const areFieldsFilled = () => {
    switch (currentStep) {
      case 1:
        return role !== "";
      case 2:
        return name !== "" && address !== "" && (role !== "Eseva" || (incharge !== "" && inchargeAadharNo !== ""));
      case 3:
        return state !== "" && district !== "" && taluka !== "" && mobile !== "" && pincode !== "";
      case 4:
        return email !== "" && otp !== "" && isOtpVerified;
      case 5:
        return password !== "" && rePassword !== "" && captchaVerified;
      default:
        return false;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    "Select Your Role",
    "Personal Information",
    "Location Details",
    "Contact & Authentication",
    "Security & Verification",
  ];

  return (
    <div className="xs:px-2 md:px-0 xs:mt-0 md:mt-1">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="justify-center font-poppins text-center ">
          <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
            <span className="shadow-inherit">Aarogya Aadhar</span>
          </h1>
          <p className="text-[#5271FF] text-[15px] md:text-[20px]">
            E-Seva/Asha Worker registration
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
                    : "bg-white text-[#5271FF]"
                    }`}
                >
                  {i + 1 < currentStep ? <FiCheck /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${i + 1 < currentStep ? "bg-[#5271FF]" : "bg-white"
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
        <div className="bg-[#5271FF] rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-white text-2xl font-bold mb-4">
                    Choose Your Registration Type
                  </h3>
                  <p className="text-white/80 text-lg">
                    Please select the type of account you want to create
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${role === "Asha"
                      ? "border-white bg-white bg-opacity-20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : "border-gray-300 hover:border-white hover:bg-white hover:bg-opacity-10 hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                      }`}
                    onClick={() => setRole("Asha")}
                    onDoubleClick={() => {
                      setRole("Asha");
                      nextStep();
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiUser className="text-[#5271FF] text-2xl" />
                      </div>
                      <h4 className="text-white font-bold text-xl mb-2">ASHA Worker</h4>
                      <p className="text-white/80 text-sm">
                        Register as an individual ASHA worker to provide community health services
                      </p>
                    </div>
                  </div>
                  <div
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${role === "Eseva"
                      ? "border-white bg-white bg-opacity-20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : "border-gray-300 hover:border-white hover:bg-white hover:bg-opacity-10 hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                      }`}
                    onClick={() => setRole("Eseva")}
                    onDoubleClick={() => {
                      setRole("Eseva");
                      nextStep();
                    }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMapPin className="text-[#5271FF] text-2xl" />
                      </div>
                      <h4 className="text-white font-bold text-xl mb-2">E-Seva Center</h4>
                      <p className="text-white/80 text-sm">
                        Register your E-Seva center to provide digital services to the community
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <FiUser className="text-white" />
                      {role === "Asha" ? "ASHA Worker Name*" : "Center Name*"}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                      placeholder={role === "Asha" ? "Enter ASHA worker name" : "Enter Center full name"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <FiMapPin className="text-white" />
                      Address*
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>
                {/* Show incharge fields only for E-seva */}
                {role === "Eseva" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white font-semibold">
                        Incharge Name*
                      </label>
                      <input
                        type="text"
                        value={incharge}
                        onChange={(e) => setIncharge(e.target.value)}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                        placeholder="Enter incharge name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white font-semibold">Incharge Aadhar Number</label>
                      <input
                        type="text"
                        value={inchargeAadharNo}
                        onChange={(e) =>
                          setInchargeAadharNo(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                        placeholder="Enter 12-digit Aadhar number"
                      />
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Step 3: Location Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-semibold">State*</label>
                    <select
                      name="state"
                      value={state}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
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
                    <label className="text-white font-semibold">
                      District*
                    </label>
                    <select
                      name="district"
                      value={district}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
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
                    <label className="text-white font-semibold">Taluka*</label>
                    <select
                      name="taluka"
                      value={taluka}
                      onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <FiPhone className="text-white" />
                      Mobile Number*
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      maxLength="10"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                          setMobile(value);
                        }
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                      placeholder="Enter 10-digit mobile number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-semibold">Pincode*</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                          setPincode(value);
                        }
                      }}
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
                      placeholder="Enter 6-digit pincode"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Authentication */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <FiMail className="text-white" />
                      Email ID*
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 px-4 pr-28 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
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
                  <div className="space-y-2">
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
                        className="w-full h-12 px-4 pr-28 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
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
                </div>
              </div>
            )}

            {/* Step 5: Security & Verification */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <FiLock className="text-white" />
                      Password*
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
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
                  <div className="space-y-2">
                    <label className="text-white font-semibold flex items-center gap-2">
                      <FiLock className="text-white" />
                      Re-type Password*
                    </label>
                    <div className="relative">
                      <input
                        type={isSamePasswordVisible ? "text" : "password"}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-white focus:outline-none transition-all duration-300 text-lg"
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

                {/* ReCAPTCHA */}
                <div className="flex justify-center py-6">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={onCaptchaChange}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className={`px-8 py-3 rounded-xl font-semibold transition-colors ${currentStep === 1
                  ? "bg-white text-gray-400 cursor-not-allowed"
                  : "bg-white text-[#5271FF] hover:bg-gray-200"
                  }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!areFieldsFilled()} // Disable if fields are not filled
                  className={`px-8 py-3 rounded-xl font-semibold transition-colors ${!areFieldsFilled()
                    ? "bg-white text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-200 text-[#5271FF]"
                    }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-200 text-[#5271FF] font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !captchaVerified}
                >
                  {isLoading && isOtpVerified && captchaVerified
                    ? "Creating Account..."
                    : "Create Account"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-[#5271FF] font-medium">
            Already have an account?{" "}
            <Link
              href="/e-seva/login"
              className="text-blue-500 font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDesign2;