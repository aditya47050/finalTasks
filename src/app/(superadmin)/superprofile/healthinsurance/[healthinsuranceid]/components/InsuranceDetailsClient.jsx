"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from '@uploadthing/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Phone, MapPin, Building2, Users, DollarSign, Shield, AlertCircle, Info, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaRupeeSign } from "react-icons/fa"
export const INSURANCE_CATEGORIES = [
  { value: "government", label: "Government Health Insurance" },
  { value: "private", label: "Private Health Insurance" },
  { value: "tpa", label: "TPA Health Insurance" },
  { value: "tpa_admin", label: "TPA Administration Services" },
]
export const DISEASE_CATEGORIES = [
  { value: "cardiology", label: "Cardiology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "neurology", label: "Neurology" },
  { value: "oncology", label: "Oncology" },
  // add more as needed
]

export const BUDGET_RANGES = [
  "Under ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "Above ₹1,00,000",
]
const InsuranceForm = ({ insurance, onClose, onSuccess }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
  policyNumber: insurance?.policyNumber || "",
  companyName: insurance?.companyName || "",
  category: insurance?.category || "",
  diseaseCategory: insurance?.diseaseCategory || "", // <-- new field
  insuranceType: insurance?.insuranceType || "",
  insurancePackage: insurance?.insurancePackage || "",
  coverAmount: insurance?.coverAmount || "",
  startingAmount: insurance?.startingAmount || "",
  copay: insurance?.copay || "",
  discount: insurance?.discount || "",
  budgetRange: insurance?.budgetRange || "",
  coverage: insurance?.coverage || "",
  contactNumber: insurance?.contactNumber || "",
  headOffice: insurance?.headOffice || "",
  networkHospitals: insurance?.networkHospitals || "",
  beneficiaryCount: insurance?.beneficiaryCount || "",
  facilities: insurance?.facilities || "",
  requiredDocs: insurance?.requiredDocs || "",
  description: insurance?.description || "",
  logo: insurance?.logo || "",
  patientId: insurance?.patientId || "temp-patient-id",
})


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = insurance ? `/api/health-insurance/${insurance.id}` : "/api/health-insurance"
      const method = insurance ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save insurance")

      const result = await response.json()
      toast({
        title: insurance ? "Insurance Updated" : "Insurance Created",
        description: `Insurance has been ${insurance ? "updated" : "created"} successfully.`,
      })
      onSuccess(result)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to save insurance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="Enter insurance company name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="policyNumber">Policy Number *</Label>
          <Input
            id="policyNumber"
            value={formData.policyNumber}
            onChange={(e) => handleInputChange("policyNumber", e.target.value)}
            placeholder="Enter policy number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {INSURANCE_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="insuranceType">Insurance Type</Label>
          <Input
            id="insuranceType"
            value={formData.insuranceType}
            onChange={(e) => handleInputChange("insuranceType", e.target.value)}
            placeholder="e.g., Individual, Family, Group"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurancePackage">Insurance Package</Label>
          <Input
            id="insurancePackage"
            value={formData.insurancePackage}
            onChange={(e) => handleInputChange("insurancePackage", e.target.value)}
            placeholder="e.g., Basic, Premium, Platinum"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverAmount">Cover Amount</Label>
          <Input
            id="coverAmount"
            value={formData.coverAmount}
            onChange={(e) => handleInputChange("coverAmount", e.target.value)}
            placeholder="e.g., 5,00,000"
          />
        </div>
        <div className="space-y-2">
            <Label htmlFor="diseaseCategory">Disease Category</Label>
            <Select
                value={formData.diseaseCategory}
                onValueChange={(value) => handleInputChange("diseaseCategory", value)}
            >
                <SelectTrigger>
                <SelectValue placeholder="Select disease category" />
                </SelectTrigger>
                <SelectContent>
                {DISEASE_CATEGORIES.map((disease) => (
                    <SelectItem key={disease.value} value={disease.value}>
                    {disease.label}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startingAmount">Premium Amount</Label>
          <Input
            id="startingAmount"
            value={formData.startingAmount}
            onChange={(e) => handleInputChange("startingAmount", e.target.value)}
            placeholder="e.g., 15,000 per year"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="copay">Co-pay</Label>
          <Input
            id="copay"
            value={formData.copay}
            onChange={(e) => handleInputChange("copay", e.target.value)}
            placeholder="e.g., 10% copay"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount</Label>
          <Input
            id="discount"
            value={formData.discount}
            onChange={(e) => handleInputChange("discount", e.target.value)}
            placeholder="e.g., 15%"
          />
        </div>
        <div className="space-y-2">
            <Label htmlFor="budgetRange">Budget Range</Label>
            <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange("budgetRange", value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
                {BUDGET_RANGES.map((range) => (
                <SelectItem key={range} value={range}>
                    {range}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        {/* Coverage & Contact Details */}
        <div className="space-y-2">
            <Label htmlFor="coverage">Coverage Description</Label>
            <Textarea
            id="coverage"
            value={formData.coverage}
            onChange={(e) => handleInputChange("coverage", e.target.value)}
            placeholder="Describe what treatments/diseases are covered"
            rows={3}
            />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            placeholder="Enter contact number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headOffice">Head Office</Label>
          <Input
            id="headOffice"
            value={formData.headOffice}
            onChange={(e) => handleInputChange("headOffice", e.target.value)}
            placeholder="Enter head office location"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="networkHospitals">Network Hospitals</Label>
          <Input
            id="networkHospitals"
            type="number"
            value={formData.networkHospitals}
            onChange={(e) => handleInputChange("networkHospitals", e.target.value)}
            placeholder="Number of network hospitals"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beneficiaryCount">Beneficiary Count</Label>
          <Input
            id="beneficiaryCount"
            type="number"
            value={formData.beneficiaryCount}
            onChange={(e) => handleInputChange("beneficiaryCount", e.target.value)}
            placeholder="Number of beneficiaries"
          />
        </div>
        <div className="space-y-2">
            <Label htmlFor="facilities">Facilities</Label>
            <Textarea
            id="facilities"
            value={formData.facilities}
            onChange={(e) => handleInputChange("facilities", e.target.value)}
            placeholder="List available facilities"
            rows={3}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="requiredDocs">Required Documents</Label>
            <Textarea
            id="requiredDocs"
            value={formData.requiredDocs}
            onChange={(e) => handleInputChange("requiredDocs", e.target.value)}
            placeholder="List required documents for claims"
            rows={3}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Additional description about the insurance policy"
            rows={4}
            />
        </div>
        <div className="space-y-2">
      <Label htmlFor="logo">Logo</Label>
      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600">
          {formData.logo ? "Logo Uploaded" : "Upload Logo"}
        </span>
        <UploadButton
          endpoint="fileUploader"
          content={{
            button({ ready }) {
              return <div>{ready && <div>Upload</div>}</div>
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
              setFormData((prev) => ({
                ...prev,
                logo: res[0].url, // store uploaded file URL
              }))
              toast.success("Logo upload completed")
            }
          }}
          onUploadError={(error) => {
            toast.error(`ERROR! ${error.message}`)
          }}
        />
      </label>
    </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row gap-4 justify-end">
        <Button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {insurance ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {insurance ? "Update Insurance" : "Create Insurance"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
const InsuranceDetailsClient = ({ insurance }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const getCategoryColor = (category) => {
    const colors = {
      government: "bg-green-100 text-green-800",
      private: "bg-blue-100 text-blue-800",
      tpa: "bg-purple-100 text-purple-800",
      tpa_admin: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getProviderColor = (provider) => {
    const colors = {
      Government: "bg-emerald-500",
      Private: "bg-blue-500",
      TPA: "bg-purple-500",
    }
    return colors[provider] || "bg-gray-500"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "coverage", label: "Coverage & Financial", icon: Shield },
    { id: "contact", label: "Contact & Network", icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/superprofile/healthinsurance">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                {insurance.logo && (
                  <img
                    src={insurance.logo || "/placeholder.svg"}
                    alt="Insurance Logo"
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">{insurance.companyName || "Insurance Policy"}</h1>
                  <p className="text-gray-600 mt-1">Policy #{insurance.policyNumber}</p>
                </div>
              </div>
            </div>
            <Dialog>
                            <DialogTrigger asChild>
                                <Button   className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Policy
                              </Button>
                            </DialogTrigger>
            
                            <DialogContent className="max-w-lg h-[70vh] bg-white">
                                <DialogHeader >
                                <DialogTitle className="text-center">
                                    { "Edit Insurance" }
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    {"Update insurance policy details"}
                                </DialogDescription>
                                </DialogHeader>
            
                                <InsuranceForm
                                insurance={insurance}
                                onClose={() => {}} // not needed here, dialog auto-closes
                                onSuccess={() => {}} 
                                />
                            </DialogContent>
                        </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FaRupeeSign className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Cover Amount</p>
                  <p className="font-semibold text-blue-600">₹{insurance.coverAmount || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Network Hospitals</p>
                  <p className="font-semibold text-gray-900">{insurance.networkHospitals || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Beneficiaries</p>
                  <p className="font-semibold text-gray-900">{insurance.beneficiaryCount || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category and Status Badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge className={getCategoryColor(insurance.category)}>
            {INSURANCE_CATEGORIES.find((cat) => cat.value === insurance.category)?.label || insurance.category}
          </Badge>
          {insurance.insuranceType && <Badge variant="outline">{insurance.insuranceType}</Badge>}
          {insurance.insurancePackage && <Badge variant="outline">{insurance.insurancePackage}</Badge>}
          {insurance.budgetRange && <Badge variant="outline">{insurance.budgetRange}</Badge>}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policy Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Policy Number</p>
                      <p className="font-medium">{insurance.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Insurance Type</p>
                      <p className="font-medium">{insurance.insuranceType || "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Package</p>
                      <p className="font-medium">{insurance.insurancePackage || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Disease Category</p>
                      <p className="font-medium">{insurance.diseaseCategory || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p className="font-medium">{formatDate(insurance.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {insurance.description || "No description available for this insurance policy."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "coverage" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Coverage Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Coverage Description</p>
                    <p className="text-gray-700 leading-relaxed">
                      {insurance.coverage || "No coverage details available."}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Facilities</p>
                    <p className="text-gray-700 leading-relaxed">
                      {insurance.facilities || "No facility information available."}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Required Documents</p>
                    <p className="text-gray-700 leading-relaxed">
                      {insurance.requiredDocs || "No document requirements specified."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Financial Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Cover Amount</p>
                      <p className="font-semibold text-blue-600 text-lg">₹{insurance.coverAmount || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Premium Amount</p>
                      <p className="font-semibold text-gray-900">₹{insurance.startingAmount || "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Co-pay</p>
                      <p className="font-medium">{insurance.copay || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Discount</p>
                      <p className="font-medium text-green-600">{insurance.discount || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget Range</p>
                    <p className="font-medium">{insurance.budgetRange || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insurance.complaints && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Complaints/Issues</p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <p className="text-yellow-800 text-sm">{insurance.complaints}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {insurance.document && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Document</p>
                      <p className="font-medium">{insurance.document}</p>
                    </div>
                  )}
                </CardContent>
              </Card> */}
            </div>

          )}

          {activeTab === "contact" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insurance.contactNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact Number</p>
                        <p className="font-medium">{insurance.contactNumber}</p>
                      </div>
                    </div>
                  )}
                  {insurance.headOffice && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Head Office</p>
                        <p className="font-medium">{insurance.headOffice}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-500" />
                    Network Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insurance.networkHospitals && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Network Hospitals</p>
                        <p className="font-semibold text-lg">{insurance.networkHospitals}</p>
                      </div>
                    </div>
                  )}
                  {insurance.beneficiaryCount && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Beneficiaries</p>
                        <p className="font-semibold text-lg">{insurance.beneficiaryCount}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InsuranceDetailsClient
