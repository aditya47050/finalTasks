"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Html5QrcodeScanner } from "html5-qrcode";

const PatientSearchDialog = ({ isOpen, onClose, onPatientFound }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setOtpError("");

    try {
      // First, check if the patient exists and get their email
      const res = await fetch(`/api/patient/search?query=${value}`);

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      console.log("API response raw:", data);

      if (data.patient) {
        // Store patient email for OTP verification
        setPatientEmail(data.patient.email);

        // Send OTP to the patient's email
        await sendOTP(data.patient.email);

        // Show OTP input
        setOtpSent(true);
      } else {
        setError("No patient found with this email or aadharCardNumber.");
      }
    } catch (err) {
      console.error("❌ Error while searching patient:", err);
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  const sendOTP = async (email) => {
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }

      console.log("OTP sent successfully");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Please try again.");
    }
  };
  // adjust path as per your project

  const verifyOTP = async () => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: patientEmail,
          otp: otp,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid OTP");
      }

      const data = await res.json();

      if (data.success) {
        // ✅ Create scan session for 30 mins
        await fetch("/api/scan-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: patientEmail }),
        });

        // After session created → continue flow
        const patientRes = await fetch(`/api/patient/search?query=${value}`);
        const patientData = await patientRes.json();

        if (patientData.patient) {
          setRedirecting(true);
          onPatientFound(patientData.patient);
        }
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setOtpError("Invalid OTP. Please try again.");
    }

    setOtpLoading(false);
  };

  const resendOTP = async () => {
    if (patientEmail) {
      await sendOTP(patientEmail);
      setOtpError("");
      setOtp("");
    }
  };

  const startScanner = () => {
    setScanning(true);
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        console.log("Scanned value:", decodedText);
        setValue(decodedText); // Autofill with scanned result
        scanner.clear();
        setScanning(false);
      },
      (errorMessage) => {
        console.warn("Scanner error:", errorMessage);
      }
    );
  };

  const resetForm = () => {
    setValue("");
    setOtp("");
    setOtpSent(false);
    setError("");
    setOtpError("");
    setPatientEmail("");
    setScanning(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-lg">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-blue-600 text-center text-lg font-semibold">
            Search Patient
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="grid gap-4 py-4">
          {!otpSent ? (
            <>
              <Input
                placeholder="Enter email or aadhar card number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Scanner */}
              {scanning ? (
                <div
                  id="qr-reader"
                  className="w-full h-[250px] border rounded-lg"
                />
              ) : (
                <Button
                  onClick={startScanner}
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl"
                >
                  Scan QR / Barcode
                </Button>
              )}

              {/* Search Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSearch}
                  disabled={loading || !value}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* OTP Input Section */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  OTP has been sent to{" "}
                  <span className="font-semibold">{patientEmail}</span>
                </p>

                <Input
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />

                {otpError && (
                  <p className="text-red-500 text-sm mt-2">{otpError}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={verifyOTP}
                    disabled={otpLoading || otp.length !== 6 || redirecting}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex-1"
                  >
                    {redirecting
                      ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      )
                      : otpLoading
                        ? "Verifying..."
                        : "Verify OTP"}
                  </Button>

                  <Button
                    onClick={resendOTP}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    Resend
                  </Button>
                </div>

                <Button
                  onClick={() => setOtpSent(false)}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700 mt-2"
                >
                  ← Back to Search
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientSearchDialog;
