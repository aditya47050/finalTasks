"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff, FiMapPin, FiFile } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { UploadButton } from "@uploadthing/react";
export default function ProfileUpdatePage() {
  const router = useRouter()
  const totalSteps = 3
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Step 1: Basic Info
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Step 2: Address Details
  const [pincode, setPincode] = useState("")
  const [address, setAddress] = useState("")

  // Step 3: Documents
  const [documents, setDocuments] = useState({
    panNumber: "",
    panCardUrl: "",
    gstNumber: "",
    gstCardUrl: "",
    aadharNumber: "",
    aadharCardUrl: "",
    brandName: "",
    brandLogoUrl: "",
  })

  // Fetch existing seller data on mount
  useEffect(() => {
    fetchSellerData()
  }, [])

  const fetchSellerData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/aarogyamart/martseller/profile")
      if (res.ok) {
        const data = await res.json()
        setEmail(data.data.email || "")
        setMobile(data.data.mobile || "")
        setPincode(data.data.pincode || "")
        setAddress(data.data.address || "")
        if (data.data.documents) {
          setDocuments({
            panNumber: data.data.documents.pan.number || "",
            panCardUrl: data.data.documents.pan.fileUrl || "",
            gstNumber: data.data.documents.gstNumber || "",
            aadharNumber: data.data.documents.aadhar.number || "",
            aadharCardUrl: data.data.documents.aadhar.fileUrl || "",
          })
        }
        const brand = data?.data?.brands[0] // assuming one brand per seller
        setDocuments((prev) => ({
          ...prev,
          brandName: brand?.name || "",
          brandLogoUrl: brand?.image || "",
        }))
      }
    } catch (error) {
      toast.error("Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveStep1 = async () => {
    setIsSaving(true)
    try {
      const payload = { email, mobile }

      // Only include password if user wants to change it
      if (currentPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("New passwords do not match")
          setIsSaving(false)
          return
        }
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      const res = await fetch("/api/aarogyamart/martseller/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success("Basic information saved successfully")
        // Clear password fields after successful save
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const data = await res.json()
        toast.error(data.message || "Failed to save")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveStep2 = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/aarogyamart/martseller/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode, address }),
      })

      if (res.ok) {
        toast.success("Address details saved successfully")
      } else {
        const data = await res.json()
        toast.error(data.message || "Failed to save")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveStep3 = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/aarogyamart/martseller/profile/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents ,brandName: documents.brandName,
    brandLogoUrl: documents.brandLogoUrl,}),
      })

      if (res.ok) {
        toast.success("Documents saved successfully")
      } else {
        const data = await res.json()
        toast.error(data.message || "Failed to save")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }
  const stepTitles = ["Basic Information", "Address Details", "Documents"]

  const nextStep = () => currentStep < totalSteps && setCurrentStep(currentStep + 1)
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-[#5271FF]">Update Profile</h1>
          <p className="text-[#5271FF] text-lg">Manage your seller account information</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between mb-8 w-full"
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  i + 1 <= currentStep
                    ? "bg-[#5271FF] text-white shadow-lg scale-110"
                    : "bg-white border-2 border-[#5271FF] text-[#5271FF]"
                }`}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#5271FF] rounded-2xl shadow-2xl p-8 text-white"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">{stepTitles[currentStep - 1]}</h2>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold flex items-center gap-2 mb-2">
                    <FiMail /> Email*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
                    placeholder="Enter Email"
                    disabled
                  />
                </div>

                <div>
                  <label className="font-semibold flex items-center gap-2 mb-2">
                    <FiUser /> Mobile*
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
                    placeholder="Enter Mobile Number"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveStep1}
                disabled={isSaving}
                className="w-full h-12 bg-white text-[#5271FF] hover:bg-gray-100 font-semibold rounded-xl"
              >
                {isSaving ? "Saving..." : "Save Basic Information"}
              </Button>
            </div>
          )}

          {/* Step 2: Address Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold flex items-center gap-2 mb-2">
                    <FiMapPin /> Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
                    placeholder="Enter 6-Digit Pincode"
                  />
                </div>

                <div>
                  <label className="font-semibold flex items-center gap-2 mb-2">
                    <FiMapPin /> Full Address*
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
                    placeholder="Enter Full Address"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleSaveStep2}
                disabled={isSaving}
                className="w-full h-12 bg-white text-[#5271FF] hover:bg-gray-100 font-semibold rounded-xl"
              >
                {isSaving ? "Saving..." : "Save Address Details"}
              </Button>
            </div>
          )}

          {/* Step 3: Documents */}
          {/* Show Brand Logo on Top Right */}
{currentStep === 3 && (
  // Brand Logo Preview + Upload
  <>
    <div className="flex flex-col justify-end items-end mb-4 gap-2">
      {documents.brandLogoUrl ? (
        <img
          src={documents.brandLogoUrl}
          alt="Brand Logo"
          className="h-20 w-20 object-contain rounded-xl border-2 border-gray-300"
        />
      ) : (
        <div className="h-20 w-20 flex items-center justify-center rounded-xl border-2 border-gray-300 text-gray-400">
          No Logo
        </div>
      )}
        <UploadButton
          endpoint="fileUploader"
          content={{
            button({ ready }) {
              return <div>{ready && <div>Upload</div>}</div>;
            },
            allowedContent: () => "",
          }}
          appearance={{
            button: "!w-12 bg-transparent text-xs text-white font-bold rounded-none",
            container: "rounded-xl h-8 px-4  w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onClientUploadComplete={(res) => {
            if (res.length > 0) {
              setDocuments((prev) => ({ ...prev, brandLogoUrl: res[0].url }));
              toast.success("Brand Logo Upload Completed");
            }
          }}
          onUploadError={(error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
        />
    </div>
  </>
)}


{/* Step 3: Documents */}
{currentStep === 3 && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PAN Card */}
      <div>
        <label className="font-semibold flex items-center gap-2 mb-2">
          <FiFile /> PAN Number
        </label>
        <input
          type="text"
          value={documents.panNumber}
          onChange={(e) => setDocuments({ ...documents, panNumber: e.target.value })}
          className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
          placeholder="Enter PAN Number"
        />
      </div>

      <div>
        <label className="font-semibold flex items-center gap-2 mb-2">
          <FiFile /> Upload PAN Card
        </label>
        <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white">
          <span className="text-gray-600">
            {documents.panCardUrl ? "Uploaded" : "Upload PAN / PDF"}
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
              button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
              container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
              allowedContent: "hidden",
            }}
            onClientUploadComplete={(res) => {
              if (res.length > 0) {
                setDocuments((prev) => ({ ...prev, panCardUrl: res[0].url }));
                toast.success("PAN Upload Completed");
              }
            }}
            onUploadError={(error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
          />
        </label>
      </div>

      {/* GST Number */}
      <div>
        <label className="font-semibold flex items-center gap-2 mb-2">
          <FiFile /> GST Number
        </label>
        <input
          type="text"
          value={documents.gstNumber}
          onChange={(e) => setDocuments({ ...documents, gstNumber: e.target.value })}
          className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
          placeholder="Enter GST Number"
        />
      </div>

      {/* Aadhaar Number */}
      <div>
        <label className="font-semibold flex items-center gap-2 mb-2">
          <FiFile /> Aadhaar Number
        </label>
        <input
          type="text"
          value={documents.aadharNumber}
          onChange={(e) => setDocuments({ ...documents, aadharNumber: e.target.value })}
          className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
          placeholder="Enter Aadhaar Number"
        />
      </div>

      {/* Upload Aadhaar */}
      <div>
        <label className="font-semibold flex items-center gap-2 mb-2">
          <FiFile /> Upload Aadhaar Card
        </label>
        <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between bg-white">
          <span className="text-gray-600">
            {documents.aadharCardUrl ? "Uploaded" : "Upload Aadhaar / PDF"}
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
              button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
              container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
              allowedContent: "hidden",
            }}
            onClientUploadComplete={(res) => {
              if (res.length > 0) {
                setDocuments((prev) => ({ ...prev, aadharCardUrl: res[0].url }));
                toast.success("Aadhaar Upload Completed");
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
        <label className="font-semibold mb-2">Brand Name*</label>
        <input
          type="text"
          value={documents.brandName || ""}
          onChange={(e) => setDocuments({ ...documents, brandName: e.target.value })}
          className="w-full h-12 px-4 rounded-xl text-black border-2 border-gray-300 focus:border-[#5271FF] focus:outline-none"
          placeholder="Enter Brand Name"
        />
      </div>
    </div>

    <Button
      onClick={handleSaveStep3}
      disabled={isSaving}
      className="w-full h-12 bg-white text-[#5271FF] hover:bg-gray-100 font-semibold rounded-xl"
    >
      {isSaving ? "Saving..." : "Save Documents"}
    </Button>
  </div>
)}


          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="px-6 py-2 rounded-xl bg-white text-[#5271FF] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === totalSteps}
              className="px-6 py-2 rounded-xl bg-white text-[#5271FF] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
