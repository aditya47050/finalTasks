// src/app/aarogyadhan/components/DonorRegistrationForm.jsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";

const DonorRegistrationForm = ({ userData }) => {
  const [email, setEmail] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [otp, setOtp] = useState("");
  const [pancardImage, setPancardImage] = useState(null);
  const [aadharCardImage, setAadharCardImage] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRetypePasswordVisible, setIsRetypePasswordVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [showUserLookup, setShowUserLookup] = useState(false);
  const [panno, setPanNo] = useState();
  const [aadharno, setAadharno] = useState();
  const router = useRouter();
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
      setPanNo(user.panCardNumber || "");
      setAadharno(user.aadharCardNumber || "");
      setPancardImage(user.panCard || "");
      setAadharCardImage(user.aadharCardFront || "");
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

  const handleDonorRegistration = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please fill the Password ");
      return;
    }

    setIsLoading(true);
    try {
      if (!pancardImage || !aadharCardImage) {
        toast.error("Please upload all required documents.");
        return;
      }

      const donorData = {
        email: foundUser.email,
        mobile: foundUser.mobile,
        fullName: `${foundUser.firstName} ${foundUser.middleName || ""} ${
          foundUser.lastName
        }`.trim(),
        pincode: foundUser.pincode,
        password,
        pancardImage,
        aadharCardImage,
        patientId: foundUser.id,
      };

      const response = await fetch("/api/aarogyadhan/donor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donorData),
      });

      console.log("Response received:", response);

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push("/aarogyadhan/donor/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
          id="isDonorRegistered"
          checked={isRegistered}
          onCheckedChange={handleRegistrationCheck}
          className="border-[#5271FF]"
        />
        <Label
          htmlFor="isDonorRegistered"
          className="text-sm text-[#243460] cursor-pointer"
        >
          Are you already registered with Aarogya Aadhar?
        </Label>
      </div>

      {showUserLookup && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="donorSearchQuery"
              className="text-[#243460] font-semibold ml-4"
            >
              Enter Email or Aadhar Card Number *
            </Label>
            <Input
              id="donorSearchQuery"
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
            <form onSubmit={handleDonorRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#243460] font-semibold ml-4">
                  Full Name
                </Label>
                <Input
                  type="text"
                  value={fullName}
                  readOnly
                  className="bg-gray-100 border-gray-300 text-gray-700 rounded-full h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#243460] font-semibold ml-4">
                  Mobile Number
                </Label>
                <Input
                  type="tel"
                  value={mobile}
                  readOnly
                  className="bg-gray-100 border-gray-300 text-gray-700 rounded-full h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#243460] font-semibold ml-4">Email ID</Label>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="bg-gray-100 border-gray-300 text-gray-700 rounded-full h-10"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="donorOtp"
                  className="text-[#243460] font-semibold ml-4"
                >
                  Email OTP *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="donorOtp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    placeholder="Enter 6-Digit OTP"
                    // required
                    autoFocus
                  />
                  <Button
                    type="button"
                    onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                    disabled={isSubmitting}
                    className="bg-[#ff5e00] hover:bg-[#e54d00] text-white font-semibold px-4 py-2 rounded-full whitespace-nowrap"
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
                  htmlFor="donorNewPassword"
                  className="text-[#243460] font-semibold ml-4"
                >
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="donorNewPassword"
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

              <div className="space-y-2">
                <Label
                  htmlFor="donorRetypePassword"
                  className="text-[#243460] font-semibold ml-4"
                >
                  Retype Password *
                </Label>
                <div className="relative">
                  <Input
                    id="donorRetypePassword"
                    type={isRetypePasswordVisible ? "text" : "password"}
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 pr-10"
                    placeholder="Retype Your Password"
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

              <div className="space-y-2">
                <Label
                  htmlFor="donorpanno"
                  className="text-[#243460] font-semibold ml-4"
                >
                  Pan Card No *
                </Label>
                <Input
                  id="donorpanno"
                  type="text"
                  value={panno}
                  onChange={(e) => {
                    // Allow only letters and numbers
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                    setPanNo(value);
                  }}
                  className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                  placeholder="Enter your PAN Card No"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="donorAadhar"
                  className="text-[#243460] font-semibold ml-4"
                >
                  Aadhar Card no *
                </Label>
                <Input
                  id="donorAadhar"
                  type="text"
                  value={aadharno}
                  onChange={(e) => {
                    // Allow only digits
                    const value = e.target.value.replace(/\D/g, "");
                    setAadharno(value);
                  }}
                  className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                  placeholder="Enter your 12-Digit Aadhar No"
                  maxLength={12}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="pancardImage"
                  className="text-[#243460] font-semibold ml-4"
                >
                  Pancard Image *
                </Label>
                {pancardImage ? (
                  <span className="flex items-center text-center text-blue-600">
                    Uploaded{" "}
                  </span>
                ) : (
                  <UploadButton
                    endpoint="fileUploader"
                    content={{
                      button({ ready }) {
                        return <div>{ready && <div> Upload</div>}</div>;
                      },

                      allowedContent({ ready, fileTypes, isUploading }) {
                        if (!ready) return "Checking allowed files...";
                        if (isUploading) return "Uploading your files...";
                        return `Allowed file types: ${fileTypes.join(", ")}`;
                      },
                    }}
                    appearance={{
                      button:
                        "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                      container:
                        "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                      allowedContent:
                        "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                    }}
                    onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      if (res.length > 0) {
                        setPancardImage(res[0].ufsUrl); // Use ufsUrl instead of url
                        toast.success("PAN Upload Completed");
                      }
                    }}
                    onUploadError={(error) => {
                      toast(`ERROR! ${error.message}`);
                    }}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="aadharCardImage"
                  className="text-[#243460] font-semibold ml-4"
                >
                  Aadhar Card Image *
                </Label>
                {aadharCardImage ? (
                  <span className="flex items-center text-center text-blue-600">
                    Uploaded{" "}
                  </span>
                ) : (
                  <UploadButton
                    endpoint="fileUploader"
                    content={{
                      button({ ready }) {
                        return <div>{ready && <div> Upload</div>}</div>;
                      },

                      allowedContent({ ready, fileTypes, isUploading }) {
                        if (!ready) return "Checking allowed files...";
                        if (isUploading) return "Uploading your files...";
                        return `Allowed file types: ${fileTypes.join(", ")}`;
                      },
                    }}
                    appearance={{
                      button:
                        "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                      container:
                        "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                      allowedContent:
                        "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                    }}
                    onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      if (res.length > 0) {
                        setAadharCardImage(res[0].ufsUrl); // Use ufsUrl
                        toast.success("Aadhar Upload Completed");
                      }
                    }}
                    onUploadError={(error) => {
                      toast(`ERROR! ${error.message}`);
                    }}
                  />
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-8 py-2 rounded-full min-w-[120px] transition-all duration-200"
              >
                {isLoading ? "Registering..." : "Register as Donor"}
              </Button>
            </form>
          )}

          {foundUser && foundUser.userType === "patient" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-600 font-medium">
                This account is registered as a patient. Please use the Patient
                Registration tab.
              </p>
            </div>
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
        <form onSubmit={handleDonorRegistration} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <Label
              htmlFor="donorNewEmail"
              className="text-[#243460] font-semibold ml-4"
            >
              Email Address *
            </Label>
            <Input
              id="donorNewEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#5271FF] border-[#5271FF]  text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
              placeholder="Enter Your Email ID"
              required
            />
          </div>

          <div className="">
            <Label
              htmlFor="donorEmailOtp"
              className="text-[#243460] font-semibold ml-4"
            >
              Email OTP *
            </Label>
            <div className="relative">
              <Input
                id="donorEmailOtp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
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
              <Label
                htmlFor="donorNewMobile"
                className="text-[#243460] font-semibold ml-4"
              >
                Mobile Number *
              </Label>
              <Input
                id="donorNewMobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                placeholder="Enter 10-Digit Your Mobile Number"
                required
              />
            </div>

            <div className="">
              <Label
                htmlFor="donorNewPincode"
                className="text-[#243460] font-semibold ml-4"
              >
                Pincode *
              </Label>
              <Input
                id="donorNewPincode"
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                placeholder="Enter Your Pincode"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="donorNewPassword"
                className="text-[#243460] font-semibold ml-4"
              >
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="donorNewPassword"
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

            <div className="">
              <Label
                htmlFor="donorRetypePassword"
                className="text-[#243460] font-semibold ml-4"
              >
                Retype Password *
              </Label>
              <div className="relative">
                <Input
                  id="donorRetypePassword"
                  type={isRetypePasswordVisible ? "text" : "password"}
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50 pr-10"
                  placeholder="Retype Your Password"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="donorpanno"
                className="text-[#243460] font-semibold ml-4"
              >
                Pan Card No *
              </Label>
              <Input
                id="donorpanno"
                type="text"
                value={panno}
                onChange={(e) => {
                  // Allow only letters and numbers
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                  setPanNo(value);
                }}
                className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                placeholder="Enter Your Pan Card No"
                required
              />
            </div>

            <div className="">
              <Label
                htmlFor="donorAadhar"
                className="text-[#243460] font-semibold ml-4"
              >
                Aadhar Card no *
              </Label>
              <Input
                id="donorAadhar"
                type="text"
                value={aadharno}
                onChange={(e) => {
                  // Allow only digits
                  const value = e.target.value.replace(/\D/g, "");
                  setAadharno(value);
                }}
                className="bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-10 focus:ring-2 focus:ring-[#5271FF]/50"
                placeholder="Enter Your 12-Digit Aadhar No"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="pancardImage"
                className="text-[#243460] font-semibold ml-4"
              >
                Pancard Image *
              </Label>
              {pancardImage ? (
                <span className="flex items-center text-center text-blue-600">
                  Uploaded{" "}
                </span>
              ) : (
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && <div> Upload</div>}</div>;
                    },

                    allowedContent({ ready, fileTypes, isUploading }) {
                      if (!ready) return "Checking allowed files...";
                      if (isUploading) return "Uploading your files...";
                      return `Allowed file types: ${fileTypes.join(", ")}`;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                    container:
                      "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                    allowedContent:
                      "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    if (res.length > 0) {
                      setPancardImage(res[0].ufsUrl); // Use ufsUrl instead of url
                      toast.success("PAN Upload Completed");
                    }
                  }}
                  onUploadError={(error) => {
                    toast(`ERROR! ${error.message}`);
                  }}
                />
              )}
            </div>

            <div >
              <Label
                htmlFor="aadharCardImage"
                className="text-[#243460] font-semibold ml-4"
              >
                Aadhar Card Image *
              </Label>
              {aadharCardImage ? (
                <span className="flex items-center text-center text-blue-600">
                  Uploaded{" "}
                </span>
              ) : (
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && <div> Upload</div>}</div>;
                    },

                    allowedContent({ ready, fileTypes, isUploading }) {
                      if (!ready) return "Checking allowed files...";
                      if (isUploading) return "Uploading your files...";
                      return `Allowed file types: ${fileTypes.join(", ")}`;
                    },
                  }}
                  appearance={{
                    button:
                      "w-auto  bg-transparent text-[10px] xl:text-[14px] py-1 md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                    container:
                      "rounded-full md:right-0 right-2 -mr-1 xl:-mr-1 xl:h-8 md:h-7 h-6 px-4  border w-auto py-1 bg-[#243460]",
                    allowedContent:
                      "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                  }}
                  onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    if (res.length > 0) {
                      setAadharCardImage(res[0].ufsUrl); // Use ufsUrl
                      toast.success("Aadhar Upload Completed");
                    }
                  }}
                  onUploadError={(error) => {
                    toast(`ERROR! ${error.message}`);
                  }}
                />
              )}
            </div>
          </div>
          <div className="mx-auto flex justify-center">
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

export default DonorRegistrationForm;
