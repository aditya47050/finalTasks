// src/app/aarogyadhan/components/PatientRegistrationForm.jsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const PatientRegistrationForm = ({ userData }) => {
  const [email, setEmail] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRetypePasswordVisible, setIsRetypePasswordVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [showUserLookup, setShowUserLookup] = useState(false);

  const handleRegistrationCheck = (checked) => {
    setIsRegistered(checked);
    setShowUserLookup(checked);
    if (!checked) {
      // Reset all fields when unchecked
      setFoundUser(null);
      setSearchQuery("");
      setEmail("");
      setAadharNumber("");
      setMobile("");
      setFullName("");
      setPincode("");
      setOtp("");
      setIsOtpSent(false);
      setIsOtpVerified(false);
    }
  };

  const handleUserSearch = (value) => {
    setSearchQuery(value);

    if (value.includes("@")) {
      setEmail(value);
      setAadharNumber("");
    } else {
      setAadharNumber(value);
      setEmail("");
    }

    if (value.trim() === "") {
      setFoundUser(null);
      return;
    }

    const user = userData.find(
      (user) =>
        user.email?.toLowerCase() === value.toLowerCase() ||
        user.aadharCardNumber === value
    );

    if (user) {
      setFoundUser(user);
      if (user.email && !email) setEmail(user.email);
      setMobile(user.mobile || "");
      if (user.firstName || user.middleName || user.lastName) {
        setFullName(
          `${user.firstName || ""} ${user.middleName || ""} ${
            user.lastName || ""
          }`.trim()
        );
      }
      setPincode(user.pincode || "");
    } else {
      setFoundUser(null);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP sent to your email");
      setIsOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP verified successfully!");
      setIsOtpVerified(true);
    } catch (error) {
      toast.error("Failed to verify OTP: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();

    if (!email || !mobile || !otp || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isOtpVerified) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mobile, password }),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Logged in successfully!");
      router.push("/patient/dashboard/aarogyadhan");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewUserRegistration = async (e) => {
    e.preventDefault();

    if (!email || !mobile || !password || !retypePassword || !pincode) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== retypePassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isOtpVerified) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        email,
        mobile,
        password,
        pincode,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Registration completed successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isRegistered"
          checked={isRegistered}
          onCheckedChange={handleRegistrationCheck}
          className="border-[#5271FF]"
        />
        <Label
          htmlFor="isRegistered"
          className="text-sm text-[#243460] cursor-pointer"
        >
          Are you already registered with Aarogya Aadhar?
        </Label>
      </div>

      {showUserLookup && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="searchQuery"
              className="text-[#243460] font-semibold"
            >
              Enter Email or Aadhar Card Number *
            </Label>
            <Input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => handleUserSearch(e.target.value)}
              className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter Your Email or Aadhar Card Number"
              autoComplete="off"
              required
              autoFocus
            />
          </div>

          {foundUser && (
            <form onSubmit={handlePatientLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#243460] font-semibold">
                  Email ID *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="bg-gray-100 border-gray-300 text-gray-700 rounded-full h-10"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mobile"
                  className="text-[#243460] font-semibold"
                >
                  Mobile Number *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  readOnly
                  className="bg-gray-100 border-gray-300 text-gray-700 rounded-full h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-[#243460] font-semibold">
                  Email OTP *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    placeholder="Enter 6-Digit OTP"
                    required
                    autoFocus
                  />
                  <Button
                    type="button"
                    onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                    disabled={isSubmitting}
                    className="bg-[#ff5e00] hover:bg-[#e54d00] text-white font-semibold xs:px-1 sm:px-4 py-2 rounded-full whitespace-nowrap xs:text-[0.8rem] sm:text-sm"
                  >
                    {isSubmitting
                      ? "..."
                      : isOtpSent
                      ? isOtpVerified
                        ? "✓ Verified"
                        : "Verify"
                      : "Send OTP"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[#243460] font-semibold"
                >
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 pr-10"
                    placeholder="Enter Your Password"
                    required
                    autoFocus
                  />
                  <Button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent p-0 h-auto"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-8 py-2 rounded-full min-w-[120px] transition-all duration-200"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}

          {searchQuery && !foundUser && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-700 font-medium">
                No user found with this email or Aadhar number. Please register
                as a new user by unchecking the registration option above.
              </p>
            </div>
          )}
        </div>
      )}

      {!isRegistered && (
        <form onSubmit={handleNewUserRegistration} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newEmail" className="text-[#243460] font-semibold m-4">
                Email Address *
              </Label>
              <Input
                id="newEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                placeholder="Enter Your Email ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="emailOtp" className="text-[#243460] font-semibold m-4">
                Email OTP *
              </Label>
              <div className="relative">
                <Input
                  id="emailOtp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 !lg:pr-[8px]"
                  placeholder="Enter 6-Digit OTP"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                  disabled={isSubmitting}
                  className=" bg-[#ff5e00] hover:bg-[#e54d00] absolute right-2 text-white 
                          min-[1100px]:text-[14px] 
                          max-[800px]:text-[16px] 
                          max-[1100px]:text-[10px]

                       font-poppins rounded-full px-2 xl:px-[8px] xs:py-[2px] md:py-[4px] xl:py-[2px] top-1/2 transform -translate-y-1/2"
                >
                  {isSubmitting
                    ? "..."
                    : isOtpSent
                    ? isOtpVerified
                      ? "✓ Verified"
                      : "Verify"
                    : "Send OTP"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <Label htmlFor="newMobile" className="text-[#243460] font-semibold m-4">
              Mobile Number *
            </Label>
            <Input
              id="newMobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter 10-Digit Your Mobile Number"
              required
            />
          </div>

          <div >
            <Label
              htmlFor="newPincode"
              className="text-[#243460] font-semibold m-4"
            >
              Pincode *
            </Label>
            <Input
              id="newPincode"
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter 6-Digit Your Pincode"
              required
            />
          </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <Label
                htmlFor="newPassword"
                className="text-[#243460] font-semibold m-4"
              >
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 pr-10"
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent p-0 h-auto"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4 text-white" />
                  ) : (
                    <Eye className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
            </div>

            <div className="">
              <Label
                htmlFor="retypePassword"
                className="text-[#243460] font-semibold m-4"
              >
                Retype Password *
              </Label>
              <div className="relative">
                <Input
                  id="retypePassword"
                  type={isRetypePasswordVisible ? "text" : "password"}
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 pr-10"
                  placeholder="Retype your password"
                  required
                />
                <Button
                  type="button"
                  onClick={() =>
                    setIsRetypePasswordVisible(!isRetypePasswordVisible)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent p-0 h-auto"
                >
                  {isRetypePasswordVisible ? (
                    <EyeOff className="h-4 w-4 text-white" />
                  ) : (
                    <Eye className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <div className="mx-auto my-2 flex justify-center">

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-8 py-2 rounded-full min-w-[120px] transition-all duration-200"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PatientRegistrationForm;
