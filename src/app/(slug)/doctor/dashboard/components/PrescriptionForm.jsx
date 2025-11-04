"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Plus,
  Trash2,
  Save,
  FileText,
  User,
  Stethoscope,
  X,
  Check,
  UserCheck,
  Activity,
  Pill,
  Calendar,
  MapPin,
  Phone,
  Search,
  Package,
} from "lucide-react"
import {
  COMMON_MEDICATIONS,
  COMMON_DIAGNOSES,
  COMMON_DIETS,
  DOSAGE_FREQUENCIES,
  MEDICATION_UNITS,
} from "@/lib/prescription-data"

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return ""
  const birthDate = new Date(dateOfBirth)
  const ageDifMs = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export default function PrescriptionForm({
  doctor,
  patient,
  appointment,
  templates = [],
  onSave,
  onCancel,
  loading: externalLoading,
  isDialog = false,
  doctorProducts = [] // ✅ Receive doctor's linked pharmacy products
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDrugSuggestions, setShowDrugSuggestions] = useState([])
  const [activeMedicationIndex, setActiveMedicationIndex] = useState(0)

  const isLoading = externalLoading !== undefined ? externalLoading : loading

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return doctorProducts
    const q = searchTerm.toLowerCase()
    return doctorProducts.filter(product =>
      product.name.toLowerCase().includes(q) ||
      product.brand?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q)
    )
  }, [searchTerm, doctorProducts])

  const [prescriptionData, setPrescriptionData] = useState({
    patientName:
      `${patient?.firstName || ""} ${patient?.middleName ? patient.middleName + " " : ""}${patient?.lastName || ""}`.trim(),
    patientAge: patient?.dateOfBirth ? calculateAge(patient.dateOfBirth) : "",
    patientGender: patient?.gender || "",
    patientPhone: patient?.mobile || patient?.mobileNumber || patient?.patientMobile || "",
    patientAddress:
      patient?.patientAddress || patient?.presentAddress || patient?.address || appointment?.patientAddress || "",
    dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split("T")[0] : "",
    healthCardNo:
      patient?.healthcard?.[0]?.cardNo ||
      patient?.healthCards?.[0]?.cardNo ||
      appointment?.healthCards?.[0]?.cardNo ||
      patient?.cardNo ||
      patient?.healthCardNumber ||
      "N/A",
    patientIdNo: patient?.id || "",
    occupation: patient?.occupation || "Not specified",
    cellNo: patient?.mobile || patient?.mobileNumber || patient?.patientMobile || "",
    aadharCardNumber: patient?.aadharCardNumber || "Not provided",
    panCardNumber: patient?.panCardNumber || "Not provided",
    bloodGroup: patient?.bloodgroup || "Not specified",
    maritalStatus: patient?.maritalStatus || "Not specified",
    religion: patient?.religion || "Not specified",
    email: patient?.email || "",

    doctorName:
      `${doctor?.firstName || ""} ${doctor?.middleName ? doctor.middleName + " " : ""}${doctor?.lastName || ""}`.trim(),
    doctorSpecialty: doctor?.specialities?.[0]?.speciality?.title || "General Medicine",
    doctorRegistration: doctor?.regno || "Not provided",
    doctorPhone: doctor?.mobile || "",
    doctorEmail: doctor?.email || "",
    doctorAddress:
      `${doctor?.doctorinfo?.presentaddress || ""}, ${doctor?.doctorinfo?.city || ""}, ${doctor?.doctorinfo?.state || ""} - ${doctor?.doctorinfo?.pincode || ""}`
        .replace(/^,\s*|,\s*$|,\s*,/g, "")
        .trim(),
    doctorEducation: doctor?.education || "MBBS",
    doctorExperience: doctor?.totalexperience || "Not specified",
    consultationFee: doctor?.doctorinfo?.consultationfee || "Not specified",

    // Prescription details
    prescriptionDate: new Date().toISOString().split("T")[0],

    // Vitals
    bloodPressure: patient?.bpvalue || appointment?.bpvalue || "",
    pulseRate: patient?.pulseRate || appointment?.pulseRate || "",
    weight: patient?.weight || appointment?.weight || "",
    temperature: "",

    // Medical info
    diagnosis: "",
    allergies: patient?.allergies || appointment?.allergies || "",
    disabilities: "",

    // Medications
    medications: [],

    // Additional info
    dietInstructions: "",
    patientHistory: "",
    followUpInstructions: "",
    followUpPhysician: `Dr. ${doctor?.firstName || ""} ${doctor?.lastName || ""}`.trim(),
    doctorSignature: `Dr. ${doctor?.firstName || ""} ${doctor?.lastName || ""}`.trim(),
  })

  const applyTemplate = (template) => {
    setSelectedTemplate(template)
    setPrescriptionData((prev) => ({
      ...prev,
      diagnosis: template.commonDiagnoses?.[0] || prev.diagnosis,
      dietInstructions: template.commonDiets?.[0] || prev.dietInstructions,
      followUpInstructions: template.defaultInstructions || prev.followUpInstructions,
      medications:
        template.commonMedications?.map((med) => ({
          ...med,
          frequency: "Twice daily",
          instructions: "Take after meals",
        })) || prev.medications,
    }))
  }

  const addMedication = () => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          unit: "Tablet",
          dosage: "",
          frequency: "Twice daily",
          instructions: "Take after meals",
          isCustomDrug: true, // Default to custom until a product is selected
        },
      ],
    }))
    setActiveMedicationIndex(prescriptionData.medications.length)
  }

  const updateMedication = (index, field, value) => {
    setPrescriptionData((prev) => {
      const newMedications = prev.medications.map((med, i) => {
        if (i === index) {
          return { ...med, [field]: value }
        }
        return med
      })
      return {
        ...prev,
        medications: newMedications,
      }
    })
  }

  const handleDrugNameChange = (index, value) => {
    updateMedication(index, "name", value)
    setSearchTerm(value)
    
    // Show suggestions if there's text and it matches products
    if (value.length > 1) {
      const suggestions = filteredProducts.slice(0, 5)
      setShowDrugSuggestions(suggestions)
    } else {
      setShowDrugSuggestions([])
    }
  }

  const handleProductSelect = (index, product) => {
    updateMedication(index, "name", product.name)
    
    // Auto-fill some details based on the product
    if (product.unit) {
      updateMedication(index, "unit", product.unit)
    }
    if (product.composition) {
      updateMedication(index, "instructions", `Composition: ${product.composition}`)
    }
    
    // Mark as linked product (not custom)
    updateMedication(index, "isCustomDrug", false)
    updateMedication(index, "linkedProductId", product.id)
    
    setShowDrugSuggestions([])
    setSearchTerm("")
  }

  const removeMedication = (index) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prescriptionData.medications.length === 0) {
      alert("Please add at least one medication before saving the prescription.");
      return;
    }
    if (!externalLoading) setLoading(true);

    try {
      const dataToSave = {
        patientName: prescriptionData.patientName,
        patientAge: prescriptionData.patientAge || null,
        patientGender: prescriptionData.patientGender || null,
        patientPhone: prescriptionData.patientPhone || null,
        patientAddress: prescriptionData.patientAddress || null,
        doctorName: prescriptionData.doctorName,
        doctorSpecialty: prescriptionData.doctorSpecialty || null,
        doctorRegistration: prescriptionData.doctorRegistration || null,
        prescriptionDate: prescriptionData.prescriptionDate ? new Date(prescriptionData.prescriptionDate) : new Date(),
        bloodPressure: prescriptionData.bloodPressure || null,
        pulseRate: prescriptionData.pulseRate || null,
        weight: prescriptionData.weight || null,
        temperature: prescriptionData.temperature || null,
        diagnosis: prescriptionData.diagnosis || null,
        allergies: prescriptionData.allergies || "None",
        disabilities: prescriptionData.disabilities || null,
        medications: prescriptionData.medications.map((med) => ({
          name: med.name || "",
          unit: med.unit || "Tablet",
          dosage: med.dosage || "",
          frequency: med.frequency || "Twice daily",
          instructions: med.instructions || "",
          isCustomDrug: med.isCustomDrug !== false, // Default to true if not specified
          linkedProductId: med.linkedProductId || null,
        })),
        dietInstructions: prescriptionData.dietInstructions || null,
        patientHistory: prescriptionData.patientHistory || null,
        followUpInstructions: prescriptionData.followUpInstructions || null,
        followUpPhysician: prescriptionData.followUpPhysician || null,
        doctorSignature: prescriptionData.doctorSignature || null,
        templateId: selectedTemplate?.id || null,
        appointmentId: appointment?.id || null,
        patientId: patient?.id,
        doctorId: doctor?.id,
      }

      await onSave(dataToSave)
    } catch (error) {
      console.error("Error saving prescription:", error)
      alert("Failed to save prescription. Please check all required fields and try again.")
    } finally {
      if (!externalLoading) setLoading(false)
    }
  }

  const addQuickDiagnosis = (diagnosis) => {
    if (!prescriptionData.diagnosis.includes(diagnosis)) {
      setPrescriptionData((prev) => ({
        ...prev,
        diagnosis: prev.diagnosis ? `${prev.diagnosis}, ${diagnosis}` : diagnosis,
      }))
    }
  }

  const addQuickDiet = (diet) => {
    if (!prescriptionData.dietInstructions.includes(diet)) {
      setPrescriptionData((prev) => ({
        ...prev,
        dietInstructions: prev.dietInstructions ? `${prev.dietInstructions}\n${diet}` : diet,
      }))
    }
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
      isDialog ? "max-w-3xl mx-auto w-full" : ""
    )}>
      {/* Header */}
      <div className={cn(
        "mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8",
        isDialog ? "max-w-3xl w-full" : "max-w-7xl"
      )}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
            {/* Left side - Prescription title */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Medical Prescription</h1>
                <p className="text-muted-foreground">Create new prescription</p>
              </div>
            </div>
            {/* Right side - Doctor information card */}
            <Card className="w-full lg:w-auto lg:min-w-[350px] border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {prescriptionData.doctorName
                      ? `${prescriptionData.doctorName.split(" ")[0]?.[0] || ""}${prescriptionData.doctorName.split(" ")[1]?.[0] || ""}`
                      : "DR"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">Dr. {prescriptionData.doctorName}</h3>
                    <p className="text-sm text-muted-foreground">{prescriptionData.doctorSpecialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3" />
                        Reg: {prescriptionData.doctorRegistration}
                      </span>
                      {prescriptionData.doctorPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {prescriptionData.doctorPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className={cn(
        "mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8",
        isDialog ? "max-w-3xl w-full" : "max-w-7xl"
      )}>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Templates */}
          {templates.length > 0 && (
            <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Stethoscope className="h-5 w-5" />
                  Quick Start Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedTemplate?.id === template.id
                          ? "ring-2 ring-primary bg-primary/5 border-primary"
                          : "hover:border-primary/30",
                      )}
                      onClick={() => applyTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {template.includeVitals && (
                            <Badge variant="outline" className="text-xs">
                              <Activity className="h-3 w-3 mr-1" />
                              Vitals
                            </Badge>
                          )}
                          {template.includeMedications && (
                            <Badge variant="outline" className="text-xs">
                              <Pill className="h-3 w-3 mr-1" />
                              Meds
                            </Badge>
                          )}
                          {template.includeDiet && (
                            <Badge variant="outline" className="text-xs">
                              Diet
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {selectedTemplate && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-primary font-medium">
                        <Check className="h-4 w-4 inline mr-2" />
                        Template Applied: {selectedTemplate.name}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTemplate(null)}
                        className="text-primary hover:text-primary/80"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Patient Info & Vitals */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
            {/* Patient Information */}
            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Patient&apos;s Name</Label>
                    <Input
                      value={prescriptionData.patientName}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, patientName: e.target.value }))}
                      className="bg-blue-50/50 border-blue-200 mt-1"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={prescriptionData.prescriptionDate}
                        onChange={(e) => setPrescriptionData((prev) => ({ ...prev, prescriptionDate: e.target.value }))}
                        className="pl-10 mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Age</Label>
                    <Input
                      value={prescriptionData.patientAge}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, patientAge: e.target.value }))}
                      className="bg-blue-50/50 border-blue-200 mt-1"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Gender</Label>
                    <Input
                      value={prescriptionData.patientGender}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, patientGender: e.target.value }))}
                      className="bg-blue-50/50 border-blue-200 mt-1"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Cell No</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={prescriptionData.patientPhone}
                        onChange={(e) => setPrescriptionData((prev) => ({ ...prev, patientPhone: e.target.value }))}
                        className="bg-blue-50/50 border-blue-200 pl-10 mt-1"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Health Card No</Label>
                    <Input
                      value={prescriptionData.healthCardNo}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, healthCardNo: e.target.value }))}
                      className="bg-blue-50/50 border-blue-200 mt-1"
                      placeholder="Health Card Number"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Patient ID</Label>
                    <Input
                      value={prescriptionData.patientIdNo}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, patientIdNo: e.target.value }))}
                      className="bg-blue-50/50 border-blue-200 mt-1"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Patient&apos;s Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      value={prescriptionData.patientAddress}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, patientAddress: e.target.value }))}
                      className="bg-blue-50/50 border-blue-200 pl-10 mt-1 min-h-[60px] resize-none"
                      placeholder="Patient's full address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Vital Signs */}
            <Card className="shadow-lg border-l-4 border-l-green-500">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Activity className="h-5 w-5" />
                  Vital Signs & Medical Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Blood Pressure</Label>
                    <Input
                      value={prescriptionData.bloodPressure}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, bloodPressure: e.target.value }))}
                      placeholder="Enter Blood Pressure"
                      className="bg-green-50/50 border-green-200 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Pulse Rate</Label>
                    <Input
                      value={prescriptionData.pulseRate}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, pulseRate: e.target.value }))}
                      placeholder="Enter Pulse Rate"
                      className="bg-green-50/50 border-green-200 mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Weight</Label>
                    <Input
                      value={prescriptionData.weight}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, weight: e.target.value }))}
                      placeholder="Enter Weight"
                      className="bg-green-50/50 border-green-200 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Temperature</Label>
                    <Input
                      value={prescriptionData.temperature}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, temperature: e.target.value }))}
                      placeholder="Enter temperature"
                      className="bg-green-50/50 border-green-200 mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Allergies</Label>
                    <Input
                      value={prescriptionData.allergies}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, allergies: e.target.value }))}
                      placeholder="Enter if any Allergies"
                      className="bg-green-50/50 border-green-200 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Disabilities</Label>
                    <Input
                      value={prescriptionData.disabilities}
                      onChange={(e) => setPrescriptionData((prev) => ({ ...prev, disabilities: e.target.value }))}
                      placeholder="Yes/No"
                      className="bg-green-50/50 border-green-200 mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Diagnosis */}
          <Card className="shadow-lg border-l-4 border-l-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
              <CardTitle className="text-yellow-700">Diagnosis</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Textarea
                value={prescriptionData.diagnosis}
                onChange={(e) => setPrescriptionData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                placeholder="Enter detailed diagnosis..."
                rows={4}
                className="bg-yellow-50/50 border-yellow-200 resize-none"
              />
              {/* Quick Diagnosis Options */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Quick Add Common Diagnoses:</Label>
                <div className="flex flex-wrap gap-2">
                  {(selectedTemplate?.commonDiagnoses || COMMON_DIAGNOSES.slice(0, 8)).map((diagnosis) => (
                    <Button
                      key={diagnosis}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickDiagnosis(diagnosis)}
                      className="text-xs hover:bg-yellow-50 hover:border-yellow-300 rounded-xl"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {diagnosis}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medications Table */}
          <Card className="shadow-lg border-l-4 border-l-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Pill className="h-5 w-5" />
                  Medications
                </CardTitle>
                <Button type="button" onClick={addMedication} className="bg-primary hover:bg-primary/90" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="space-y-4 overflow-x-auto">
                {/* Header */}
                <div className="min-w-[750px] grid grid-cols-[50px_1fr_120px_100px_120px_80px] gap-2 sm:gap-3 font-semibold text-xs sm:text-sm bg-purple-50 p-2 sm:p-3 rounded-lg border border-purple-200">
                  <div className="text-center">#</div>
                  <div>Drug Name</div>
                  <div>Unit/Form</div>
                  <div>Dosage</div>
                  <div>Frequency</div>
                  <div className="text-center">Action</div>
                </div>

                {/* Rows */}
                {prescriptionData.medications.map((medication, index) => (
                  <div
                    key={index}
                    className="min-w-[750px] grid grid-cols-[50px_1fr_120px_100px_120px_80px] gap-2 sm:gap-3 items-center p-2 sm:p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    {/* Index */}
                    <div className="text-center font-semibold text-purple-600">
                      {index + 1}
                    </div>

                    {/* Drug Name with Search/Suggestions */}
                    <div className="relative">
                      <Input
                        value={medication.name}
                        onChange={(e) => handleDrugNameChange(index, e.target.value)}
                        placeholder="Type drug name or select from your products"
                        className={cn(
                          "w-full pr-10",
                          index % 2 === 0
                            ? "bg-blue-50/50 border-blue-200"
                            : "bg-yellow-50/50 border-yellow-200"
                        )}
                        onFocus={() => setActiveMedicationIndex(index)}
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                      {/* Drug Suggestions Dropdown */}
                      {showDrugSuggestions.length > 0 && activeMedicationIndex === index && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto top-full">
                          {showDrugSuggestions.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              onClick={() => handleProductSelect(index, product)}
                            >
                              <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 truncate">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {product.brand && `${product.brand} • `}{product.category}
                                  {product.pharmacy?.regname && ` • ${product.pharmacy.regname}`}
                                </div>
                              </div>
                              <div className="text-xs text-green-600 font-medium">
                                ₹{product.price?.toFixed(2)}
                              </div>
                            </div>
                          ))}
                          <div className="p-2 bg-gray-50 border-t">
                            <div className="text-xs text-gray-500 text-center">
                              Continue typing for custom drug
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Unit/Form */}
                    <div>
                      <Select
                        value={medication.unit}
                        onValueChange={(value) => updateMedication(index, "unit", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            index % 2 === 0
                              ? "bg-blue-50/50 border-blue-200"
                              : "bg-yellow-50/50 border-yellow-200"
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MEDICATION_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dosage */}
                    <div>
                      <Input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                        placeholder="500mg"
                        className={cn(
                          index % 2 === 0
                            ? "bg-blue-50/50 border-blue-200"
                            : "bg-yellow-50/50 border-yellow-200"
                        )}
                      />
                    </div>

                    {/* Frequency */}
                    <div>
                      <Select
                        value={medication.frequency}
                        onValueChange={(value) => updateMedication(index, "frequency", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            index % 2 === 0
                              ? "bg-blue-50/50 border-blue-200"
                              : "bg-yellow-50/50 border-yellow-200"
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DOSAGE_FREQUENCIES.map((freq) => (
                            <SelectItem key={freq} value={freq}>
                              {freq}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action */}
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {prescriptionData.medications.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Pill className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">No medications added yet</h3>
                    <p>Click &quot;Add Medication&quot; to start prescribing</p>
                  </div>
                )}
              </div>

              {/* Instructions for linked products */}
              {doctorProducts.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">Tip:</span>
                    <span>Start typing to search from your {doctorProducts.length} linked pharmacy products</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diet Instructions */}
          <Card className="shadow-lg border-l-4 border-l-orange-500">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardTitle className="text-orange-700">Diet Instructions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Textarea
                value={prescriptionData.dietInstructions}
                onChange={(e) => setPrescriptionData((prev) => ({ ...prev, dietInstructions: e.target.value }))}
                placeholder="Enter diet instructions and recommendations..."
                rows={4}
                className="bg-orange-50/50 border-orange-200 resize-none"
              />
              {/* Quick Diet Options */}
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Quick Add Diet Recommendations:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(selectedTemplate?.commonDiets || COMMON_DIETS.slice(0, 6)).map((diet) => (
                    <Button
                      key={diet}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickDiet(diet)}
                      className="text-xs hover:bg-orange-50 hover:border-orange-300 rounded-xl"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {diet}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient History & Follow-up */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
            <Card className="shadow-lg border-l-4 border-l-indigo-500">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                <CardTitle className="text-indigo-700">Patient History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={prescriptionData.patientHistory}
                  onChange={(e) => setPrescriptionData((prev) => ({ ...prev, patientHistory: e.target.value }))}
                  placeholder="Enter relevant patient medical history..."
                  rows={6}
                  className="bg-indigo-50/50 border-indigo-200 resize-none"
                />
              </CardContent>
            </Card>
            <Card className="shadow-lg border-l-4 border-l-teal-500">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100">
                <CardTitle className="text-teal-700">Follow-up Instructions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Textarea
                  value={prescriptionData.followUpInstructions}
                  onChange={(e) => setPrescriptionData((prev) => ({ ...prev, followUpInstructions: e.target.value }))}
                  placeholder="Enter follow-up instructions and next appointment details..."
                  rows={4}
                  className="bg-teal-50/50 border-teal-200 resize-none"
                />
                <div>
                  <Label className="text-sm font-medium text-foreground">Follow-up Physician</Label>
                  <Input
                    value={prescriptionData.followUpPhysician}
                    onChange={(e) => setPrescriptionData((prev) => ({ ...prev, followUpPhysician: e.target.value }))}
                    placeholder="Dr. Name or Same Doctor"
                    className="bg-teal-50/50 border-teal-200 mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 sm:pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent w-full sm:w-auto rounded-xl"
              size="lg"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading || prescriptionData.medications.length === 0}
              className="bg-primary hover:bg-primary/90 min-w-[150px] w-full sm:w-auto rounded-xl"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Prescription"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}