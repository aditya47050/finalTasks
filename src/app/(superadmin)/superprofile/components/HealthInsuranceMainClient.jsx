"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Edit, Eye, Building2, Phone, FileText, Save } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { UploadButton } from '@uploadthing/react';
import HeadingClientMain from "@/app/components/heading";

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

const HealthInsuranceMainClient = ({ data }) => {
  const [insuranceData, setInsuranceData] = useState(data || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingInsurance, setEditingInsurance] = useState(null)
  const [open, setOpen] = useState(false)
  const [selectedInsurance, setSelectedInsurance] = useState(null)

  const filteredData = useMemo(() => {
    return insuranceData.filter((insurance) => {
      const matchesSearch =
        insurance.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insurance.policyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insurance.category?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || insurance.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [insuranceData, searchTerm, selectedCategory])

  const handleCreateNew = () => {
    setEditingInsurance(null)
    setShowForm(true)
  }

  const handleEdit = (insurance) => {
    setEditingInsurance(insurance)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingInsurance(null)
  }

  const handleFormSuccess = (newInsurance) => {
    if (editingInsurance) {
      setInsuranceData((prev) => prev.map((item) => (item.id === editingInsurance.id ? newInsurance : item)))
    } else {
      setInsuranceData((prev) => [newInsurance, ...prev])
    }
    handleFormClose()
  }

  const getCategoryColor = (category) => {
    const colors = {
      government: "bg-green-100 text-green-800",
      private: "bg-blue-100 text-blue-800",
      tpa: "bg-purple-100 text-purple-800",
      tpa_admin: "bg-orange-100 text-orange-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }



  if (showForm) {
    return <InsuranceForm insurance={editingInsurance} onClose={handleFormClose} onSuccess={handleFormSuccess} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <HeadingClientMain main={"Health Insurance Management"} sub={"Manage and track all your health insurance policies"} />
            <div className="bg-white rounded-lg shadow-sm p-6 my-3">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by company name, policy number, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {INSURANCE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl  text-white flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Insurance
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg h-[70vh] bg-white">
                    <DialogHeader>
                    <DialogTitle className="text-center">
                        {selectedInsurance ? "Edit Insurance" : "Add Insurance"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {selectedInsurance
                        ? "Update insurance policy details"
                        : "Fill out the form to add a new insurance policy"}
                    </DialogDescription>
                    </DialogHeader>

                    <InsuranceForm
                    insurance={selectedInsurance}
                    onClose={() => {}} // not needed here, dialog auto-closes
                    onSuccess={() => {}} 
                    />
                </DialogContent>
            </Dialog>
          </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredData.length} of {insuranceData.length} insurance policies
          </p>
        </div>

        {/* Insurance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((insurance) => (
            <Card
              key={insurance.id}
              className="hover:shadow-xl transition-shadow duration-200 border-[1px] rounded-xl "
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {insurance.companyName || "Insurance Policy"}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className={getCategoryColor(insurance.category)}>
                        {INSURANCE_CATEGORIES.find((cat) => cat.value === insurance.category)?.label ||
                          insurance.category}
                      </Badge>

                    </div>
                  </div>
                  {insurance.logo && (
                    <img
                      src={insurance.logo || "/placeholder.svg"}
                      alt="Insurance Logo"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Policy Number</p>
                    <p className="font-medium text-gray-900">{insurance.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cover Amount</p>
                    <p className="font-medium text-blue-600">₹{insurance.coverAmount || "N/A"}</p>
                  </div>
                </div>

                {insurance.insurancePackage && (
                  <div className="text-sm">
                    <p className="text-gray-500">Package</p>
                    <p className="font-medium text-gray-900">{insurance.insurancePackage}</p>
                  </div>
                )}

                {insurance.contactNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{insurance.contactNumber}</span>
                  </div>
                )}

                {insurance.networkHospitals && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>{insurance.networkHospitals} Network Hospitals</span>
                  </div>
                )}

                {insurance.description && <p className="text-sm text-gray-600 line-clamp-2">{insurance.description}</p>}

                <div className="flex gap-2 pt-3 border-t">
                  <Link href={`/superprofile/healthinsurance/${insurance.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  
                  <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm"  className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
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
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insurance policies found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first insurance policy."}
              </p>
              {!searchTerm && selectedCategory === "all"  && (
                <Button onClick={handleCreateNew} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Insurance
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthInsuranceMainClient
