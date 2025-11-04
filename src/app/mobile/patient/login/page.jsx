"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")

  // Send OTP
  const sendOtp = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }
    try {
      const res = await fetch("/api/otps/loginsendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Failed to send OTP")
      toast.success("OTP sent to your email")
      setStep(2)
    } catch (err) {
      toast.error("User not found")
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await fetch("/api/otps/loginverifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("OTP verified successfully!")
        setStep(3)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error("Failed to verify OTP")
    }
  }

  // Final login
  const handleSignIn = async () => {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/.test(password)
    ) {
      toast.error("Password must have 8+ chars, upper, lower, number, and special char.")
      return
    }
    try {
      const res = await fetch("/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mobile }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.msg || "Login failed.")
        return
      }
      toast.success("Login successful!")
      router.push("/")
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
      router.push("/mobile/patient/login")
    }
  }

  return (
    <main className="min-h-dvh bg-background">
      {/* Top Header */}
      <div className="relative bg-blue-600 text-white">
        <div className="h-48 relative">
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

      {/* Main Card */}
      <section className="rounded-t-xl px-6 pb-16 mx-0 my-2 pt-16">
        <div className="mx-auto mt-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card className={cn(
        // Default (mobile): soft tint + backdrop blur + ring + light shadow
        "relative overflow-hidden  backdrop-blur-sm ring-1 ring-border/60 shadow-sm",
        // Revert on md+ to avoid impacting desktop/tablet
        "md:bg-card md:backdrop-blur-0 md:ring-0 md:shadow-none"
      )}>
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
  )
}

/* Components */
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
          href="/patient/authforgot"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </a>
      </div>
    </div>
  )
}

