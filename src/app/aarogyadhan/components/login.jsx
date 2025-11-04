"Use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Lock, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiLock, FiMail, FiPhone } from "react-icons/fi";

const LoginForm = ({
  userType,
  email,
  setEmail,
  otp,
  setOtp,
  mobile,
  setMobile,
  password,
  setPassword,
  ...props
}) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/;
    return passwordRegex.test(password);
  };
  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/otps/loginsendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type: "donor" }),
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

  // Handle verifying OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      const verifyRes = await fetch("/api/otps/loginverifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
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
  const handleSubmit = async (e, userType) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Please verify your email with OTP first");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Please enter a valid password");
      return;
    }

    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `/api/${userType === "donor" ? "aarogyadhan/donor" : userType}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, mobile }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to login");
      }

      const data = await res.json();
      toast.success("Login successful!");
      router.push(`/${userType}/dashboard`);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e, userType)} className="space-y-6">
      {/* Email and OTP Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#243460] font-semibold">
            Email Address *
          </Label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="xs:pl-8 sm:pl-10 pr-20 text-sm bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter Your Email ID"
              required
            />
            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={isSubmitting || !email}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white text-[#243460] hover:bg-gray-100 rounded-full px-3 py-1 xs:text-[0.5rem] sm:text-xs font-medium h-8"
            >
              {isLoading && !isOtpSent
                ? "Sending..."
                : isOtpSent
                ? "Resend"
                : "Send OTP"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp" className="text-[#243460] font-semibold">
            Email OTP *
          </Label>
          <div className="relative">
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d{0,6}$/.test(inputValue)) {
                  setOtp(inputValue);
                }
              }}
              className="pr-20 bg-[#5271FF] border-[#5271FF] text-sm text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter 6-Digit OTP"
              maxLength={6}
              disabled={!isOtpSent}
            />
            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isOtpVerified || !otp || !isOtpSent}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white text-[#243460] hover:bg-gray-100 rounded-full px-3 py-1 xs:text-[0.5rem] sm:text-xs font-medium h-8"
            >
              {isLoading && !isOtpVerified
                ? "Verifying..."
                : isOtpVerified
                ? "✓ Verified"
                : "Verify"}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile and Password Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-[#243460] font-semibold">
            Mobile Number *
          </Label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
            <Input
              id="mobile"
              type="tel"
              value={mobile}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                  setMobile(value);
                }
              }}
              className="xs:pl-8 sm:pl-10 text-sm bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter 10-Digit Mobile Number"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#243460] font-semibold">
            Password *
          </Label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
            <Input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="xs:pl-8 sm:pl-10 pr-12 text-sm bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter Your Password"
              required
            />
            <Button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              disabled={!password}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-transparent p-0 h-auto"
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4 text-white" />
              ) : (
                <Eye className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-[#ff5e00] text-sm font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      {/* Password Validation */}
      {password && !validatePassword(password) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-red-600 text-sm">
            Password must contain at least 8 characters, including 1 uppercase
            letter, 1 lowercase letter, 1 number, and 1 special character.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !isOtpVerified}
          className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-8 py-2 rounded-full min-w-[120px] transition-all duration-200"
        >
          {isLoading ? "Please Wait..." : "Log In"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
