"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react"

export default function DoctorLogin() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Step 1: Send OTP
  const sendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/otps/doctor-login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");

      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error("User not found");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/otps/doctor-login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("OTP verified successfully!");
        setStep(3);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to verify OTP: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Validate password
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/.test(password);

  // Step 3: Final Sign In
  const handleSignIn = async () => {
    if (!validatePassword(password)) {
      toast.error("Password must have 8+ chars, uppercase, lowercase, number & special char.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mobile }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Login failed. Please try again.");
        return;
      }

      toast.success("Login Success");
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-background">
      {/* Header */}
      <div className="relative bg-blue-600 text-white">
        <div className="h-44 relative">
          <div className="absolute left-0 p-2">
            <img
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
              alt="Logo"
              className=" object-contain mx-auto p-1 w-full max-w-[120px] rounded-xl"
            />
          </div>
          <div className="mx-auto pt-20 max-w-2xl text-center">
            <h1 className="text-2xl font-semibold">Sign in to continue</h1>
            <p className="mt-1 text-sm text-white">Step {step} of 3</p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <section className=" rounded-t-xl bg-background px-6 pb-16 mx-0 my-2 pt-16">
        <div className="mx-auto mt-6 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Enter your email"}
                  {step === 2 && "Enter OTP"}
                  {step === 3 && "Mobile & Password"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {step === 1 && "We’ll send a one-time code to your email."}
                  {step === 2 && "Check your inbox and enter the code below."}
                  {step === 3 && "Complete your sign in with mobile and password."}
                </p>
              </CardHeader>

              <CardContent className="grid gap-4">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                                          key="step-1"
                                          initial={{ opacity: 0, y: 8 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -8 }}
                                          transition={{ duration: 0.25 }}
                                          className="grid gap-4"
                                        >
                                          <EmailField value={email} onChange={setEmail} />
                                          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                              onClick={sendOtp}
                                              className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-600/90"
                                            >
                                              Send OTP
                                            </Button>
                                          </motion.div>
                                        </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                                          key="step-2"
                                          initial={{ opacity: 0, y: 8 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -8 }}
                                          transition={{ duration: 0.25 }}
                                          className="grid gap-4"
                                        >
                                          <OtpField value={otp} onChange={setOtp} onVerify={verifyOtp} />
                                        </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                                          key="step-3"
                                          initial={{ opacity: 0, y: 8 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -8 }}
                                          transition={{ duration: 0.25 }}
                                          className="grid gap-4"
                                        >
                                          <MobilePasswordFields
                                            mobile={mobile}
                                            setMobile={setMobile}
                                            password={password}
                                            setPassword={setPassword}
                                          />
                                          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                              onClick={handleSignIn}
                                              className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-600/90"
                                            >
                                              Sign In
                                            </Button>
                                          </motion.div>
                                        </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
function EmailField({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Input
        id="email"
        type="email"
        placeholder="name@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Email"
      />
    </div>
  )
}
function OtpField({ value, onChange, onVerify }) {
  return (
    <div className="grid gap-3">
      <Input
        id="otp"
        inputMode="numeric"
        placeholder="Enter OTP"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="One-time password"
      />
      <motion.button
        type="button"
        onClick={onVerify}
        className="w-full rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-600/90"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        Verify
      </motion.button>
    </div>
  )
}
function MobilePasswordFields({ mobile, setMobile, password, setPassword }) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="grid gap-3">
      <Input
        id="mobile"
        type="tel"
        inputMode="numeric"
        placeholder="Enter 10 digit mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        aria-label="Mobile number"
      />
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
          className="pr-10" // space for the icon
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Forgot password link */}
      <div className="text-right">
        <a
          href="/doctor/authforgot"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </a>
      </div>
    </div>
  )
}