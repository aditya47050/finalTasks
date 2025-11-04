"use client"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UploadButton } from "@uploadthing/react"
import { FaAmbulance } from "react-icons/fa"
import { FaBedPulse } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator"
import { Bed, FileText, Calendar, Clock, Loader2, User, Phone, Mail, Heart, ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from "next/navigation";

const YesNoIndicator = ({ value, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <div className="flex items-center gap-2">
      {value ? (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <Check className="w-3 h-3 mr-1" />
          Yes
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
          <X className="w-3 h-3 mr-1" />
          No
        </Badge>
      )}
    </div>
  </div>
)

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className="shadow-sm border-l-4 border-l-blue-500">
      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </CardHeader>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  )
}

const Patientsingleviewpage = ({ userdata, doctors = [], hospitalId, ambulances = [], bedsForBooking = [], surgeryServices = [],
  treatmentServices = [], role }) => {
  const [remark, setRemark] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState(userdata)
  const [loading, setLoading] = useState(false)
  const healthCardId = userdata.healthcard[0]?.id
  const [currentAction, setCurrentAction] = useState(null)
  const [currentHealthCardId, setCurrentHealthCardId] = useState(healthCardId)
  const [selectedIssues, setSelectedIssues] = useState([])
  const [approvalStatus, setApprovalStatus] = useState(userdata.healthcard[0]?.approvalStatus || "Pending")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingNotes, setBookingNotes] = useState("")
  const [showBedForm, setShowBedForm] = useState(false)
  const router = useRouter();


  // Ambulance booking states
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState("")
  const [diseaseDetails, setDiseaseDetails] = useState("")
  const [medicalDoc1, setMedicalDoc1] = useState(null)
  const [medicalDoc2, setMedicalDoc2] = useState(null)
  const [medicalDoc3, setMedicalDoc3] = useState(null)
  const [ambulanceLoading, setAmbulanceLoading] = useState(false)

  //bed booking
  const [selectedBed, setSelectedBed] = useState(null)
  const [availableBeds, setAvailableBeds] = useState(bedsForBooking)
  const [bedBookingLoading, setBedBookingLoading] = useState(false)

  //surgery and treatment
  const [selectedSurgery, setSelectedSurgery] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [bookingType, setBookingType] = useState("");

  const [preferredDate, setPreferredDate] = useState(null)
  const [preferredTime, setPreferredTime] = useState(null)
  const [notes, setNotes] = useState("")

  const surgeries = surgeryServices;
  const treatments = treatmentServices;

  const patientModelFields = [
    "email",
    "mobile",
    "password",
    "pincode",
    "firstName",
    "middleName",
    "lastName",
    "dateOfBirth",
    "gender",
    "maritalStatus",
    "religion",
    "alternateMobile",
    "presentAddress",
    "city",
    "state",
    "district",
    "taluka",
    "bloodgroup",
    "passportPhoto",
    "aadharCardNumber",
    "aadharCardFront",
    "aadharCardBack",
    "abhacard",
    "abhaCardNumber",
    "abhaCardFront",
    "healthInsurance",
    "healthInsuranceNumber",
    "healthInsuranceDocument",
    "ayushmancard",
    "ayushmanCard",
    "ayushmanCardFront",
    "rationCardNumber",
    "rationCardFront",
    "rationCardBack",
    "organDonation",
    "bankName",
    "accountNumber",
    "ifscCode",
    "accountType",
    "cancelledCheque",
    "micrCode",
    "income",
    "incomeCertificateimg",
    "incomeCertificateNo",
    "panCard",
    "contactPersonName",
    "contactPersonRelation",
    "contactManaadharFront",
    "contactmanaadharBack",
    "contactmanaadharNumber",
    "isCompanyRegistered",
    "companyRegistrationNo",
    "employeeIdCard",
  ]

  const issues = [
    ...patientModelFields.map((field) => `Incorrect ${field.charAt(0).toUpperCase() + field.slice(1)}`),
    "Missing Documents",
    "Other",
  ]

  const openModal = (action) => {
    setCurrentAction(action)
    setIsModalOpen(true)
  }

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]))
  }

  // Function to format text
  const formatText = (text) => {
    if (!text) return "N/A"
    return text
      .toString()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const handleBookAppointment = async () => {
    try {
      if (!selectedDoctor) {
        toast.error("Please select a doctor")
        return
      }
      if (!userdata?.id) {
        toast.error("Missing patientId")
        return
      }
      if (!preferredDate || !preferredTime) {
        toast.error("Please select both date and time")
        return
      }

      const doctorObj = doctors.find(d => d.id === selectedDoctor);

      // Extract the first speciality's ID if available
      const selectedCategoryId = doctorObj?.specialities?.[0]?.speciality?.id || null;

      setLoading(true)
      const formattedDate = preferredDate.toLocaleDateString("en-CA");
      const formattedTime = preferredTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const appointmentData = {
        firstName: userdata.firstName || "",
        middleName: userdata.middleName || "",
        lastName: userdata.lastName || "",
        mobileNumber: userdata.mobile || "",
        email: userdata.email || "",
        city: userdata.city || "",
        pinCode: userdata.pincode || "",
        gender: userdata.gender || "",
        dateOfBirth: userdata.dateOfBirth || null,
        patientId: userdata.id,
        doctorId: selectedDoctor,
        expertDoctorsCategoryId: selectedCategoryId,
        preferredDate: formattedDate,
        preferredTime: formattedTime,
        notes: notes || "",
        status: "PENDING",
      }
      const res = await fetch(`/api/doctor/${selectedDoctor}/doctorappointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      })
      const data = await res.json()
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to book appointment")
      }
      toast.success("Appointment booked successfully!")
      setShowBookingModal(false)
      setPreferredDate(null)
      setPreferredTime(null)
      setNotes("")
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast.error(error.message || "Something went wrong while booking appointment")
    } finally {
      setLoading(false)
    }
  }

  // Ambulance booking function
  const handleBookAmbulance = async () => {
    if (!selectedAmbulance) {
      toast.error("Please select an ambulance")
      return
    }

    setAmbulanceLoading(true)
    try {
      const selectedAmbulanceData = ambulances.find((amb) => amb.id === selectedAmbulance)

      const ambulanceData = {
        patientId: userdata.id,
        firstName: userdata.firstName || "",
        middleName: userdata.middleName || "",
        lastName: userdata.lastName || "",
        dateOfBirth: userdata.dateOfBirth || "",
        gender: userdata.gender || "",
        aadharCardNumber: userdata.aadharCardNumber || "",
        mobileNumber: userdata.mobile || "",
        email: userdata.email || "",
        ambulancetype: selectedAmbulanceData?.type || "",
        ambulancecategory: selectedAmbulanceData?.category || "",
        hospitaltype: "Hospital Ambulance Service",
        healthcard: userdata.healthcard?.length > 0,
        healthInsurance: userdata.healthInsurance || false,
        healthInsuranceNumber: userdata.healthInsuranceNumber || "",
        healthInsuranceDocument: userdata.healthInsuranceDocument || "",
        ayushmancard: userdata.ayushmancard || false,
        ayushmanCardNumber: userdata.ayushmanCard || "",
        ayushmanCardFront: userdata.ayushmanCardFront || "",
        diseaseDetails: diseaseDetails,
        medicaldoc1: medicalDoc1,
        medicaldoc2: medicalDoc2,
        medicaldoc3: medicalDoc3,
        bloodgroup: userdata.bloodgroup || "",
        ambulanceVaichicleId: selectedAmbulance,
      }

      const res = await fetch("/api/ambulance/book-ambulance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ambulanceData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Ambulance booking failed")
      }

      toast.success("Ambulance booked successfully!")
      setShowAmbulanceModal(false)
      setSelectedAmbulance("")
      setDiseaseDetails("")
      setMedicalDoc1(null)
      setMedicalDoc2(null)
      setMedicalDoc3(null)
    } catch (err) {
      toast.error(err.message || "Failed to book ambulance")
    } finally {
      setAmbulanceLoading(false)
    }
  }

  const handleBookBed = async () => {
    if (!selectedBed) return toast.error("Please select a bed")
    if (!diseaseDetails.trim()) return toast.error("Please enter disease details")

    setBedBookingLoading(true)

    try {
      const res = await fetch("/api/bedbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userdata.id,   // ✅ matches backend expectation
          bedId: selectedBed.id,
          hospitalId: selectedBed.hospitalId || selectedBed.hospital?.id,
          firstName: userdata.firstName,
          middleName: userdata.middleName,
          lastName: userdata.lastName,
          dateOfBirth: userdata.dateOfBirth,
          gender: userdata.gender,
          aadharCardNumber: userdata.aadharCardNumber,
          mobileNumber: userdata.mobileNumber,
          email: userdata.email,
          diseaseDetails,
          medicaldoc1: medicalDoc1,
          medicaldoc2: medicalDoc2,
          medicaldoc3: medicalDoc3,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Bed booking failed")

      toast.success("Bed booked successfully!")

      // Remove the booked bed from available beds
      setAvailableBeds((prevBeds) => prevBeds.filter((b) => b.id !== selectedBed.id))

      // Reset form
      setSelectedBed(null)
      setDiseaseDetails("")
      setMedicalDoc1(null)
      setMedicalDoc2(null)
      setMedicalDoc3(null)

      // Close dialog automatically
      setShowBedForm(false)
    } catch (err) {
      toast.error(err.message || "Failed to book bed")
    } finally {
      setBedBookingLoading(false)
    }
  }

  const handleBookSurgeryTreatment = async (serviceId, type) => {
    if (!userdata?.id) {
      toast.error("Missing patientId");
      return;
    }
    if (!hospitalId) {
      toast.error("Missing hospitalId");
      return;
    }
    if (!serviceId) {
      toast.error(`Please select a ${type.toLowerCase()}`);
      return;
    }

    try {
      setLoading(true);

      const formattedDate = preferredDate
        ? preferredDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      const formattedTime = preferredTime
        ? preferredTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
        : "10:00";

      const payload = {
        patientId: userdata.id,
        serviceId,
        preferredDate: formattedDate,
        preferredTimeSlot: formattedTime,
        notes: notes || `${type} booking requested`,
      };

      const res = await fetch(
        `/api/hospital/${hospitalId}/surgery-treatment/book-services`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Server error: ${res.status}`);
      }

      toast.success(data?.message || `${type} booked successfully!`);

      // Reset form
      setSelectedSurgery("");
      setSelectedTreatment("");
      setPreferredDate(null);
      setPreferredTime(null);
      setNotes("");
      setShowBookingModal(false);

    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {userdata.passportPhoto ? (
                  <Image
                    className="w-20 h-20 rounded-full border-4 border-white object-cover"
                    src={userdata.passportPhoto || "/placeholder.svg"}
                    alt="Patient Photo"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">
                    {formatText(userdata.firstName)} {formatText(userdata.lastName)}
                  </h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-blue-100">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{userdata.mobile || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{userdata.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatText(userdata.bloodgroup)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {formatText(userdata.gender)}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Age:{" "}
                  {userdata.dateOfBirth
                    ? new Date().getFullYear() - new Date(userdata.dateOfBirth).getFullYear()
                    : "N/A"}
                </Badge>
                {userdata.organDonation && (
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    Organ Donor
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>



        <div className="space-y-4">
          <Card className="shadow-sm border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Medical Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Date of Birth:</span>
                    <span>
                      {userdata.dateOfBirth ? new Date(userdata.dateOfBirth).toLocaleDateString("en-GB") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Blood Group:</span>
                    <Badge variant="outline" className="font-semibold text-red-600 border-red-200">
                      {formatText(userdata.bloodgroup)}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Gender:</span>
                    <span>{formatText(userdata.gender)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Marital Status:</span>
                    <span>{formatText(userdata.maritalStatus)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <YesNoIndicator value={userdata.organDonation} label="Organ Donation" />
                  <YesNoIndicator value={userdata.healthInsurance} label="Health Insurance" />
                  <YesNoIndicator value={userdata.ayushmancard} label="Ayushman Card" />
                  <YesNoIndicator value={userdata.abhacard} label="ABHA Card" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <CardTitle className="text-lg">Emergency Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Primary Mobile:</span>
                    <span className="font-semibold text-blue-600">{userdata.mobile || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Alternate Mobile:</span>
                    <span>{userdata.alternateMobile || "N/A"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Emergency Contact:</span>
                    <span>{formatText(userdata.contactPersonName)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-gray-600">Relation:</span>
                    <span>{formatText(userdata.contactPersonRelation)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {(role  === "receptionist" || role === "Hospital") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Book Doctor Appointment</h2>
              </div>

              <div className="space-y-4">
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select a Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>

                <Button
                  onClick={() => setShowBookingModal(true)}
                  disabled={!selectedDoctor}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          {ambulances.length > 0 && (
            <Card className="shadow-lg border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaAmbulance className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Emergency Ambulance</h2>
                </div>

                <div className="space-y-4">
                  <select
                    value={selectedAmbulance}
                    onChange={(e) => setSelectedAmbulance(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">-- Select Ambulance --</option>
                    {ambulances.map((amb) => (
                      <option key={amb.id} value={amb.id}>
                        {amb.model} - {amb.type} (₹{amb.charges})
                      </option>
                    ))}
                  </select>

                  <Dialog open={showAmbulanceModal} onOpenChange={setShowAmbulanceModal}>
                    <DialogTrigger asChild>
                      <Button
                        disabled={!selectedAmbulance}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        size="lg"
                      >
                        Book Ambulance
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-xl">
                      <DialogHeader className="flex justify-center">
                        <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
                          Book Emergency Ambulance
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 p-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Disease Details *</label>
                          <textarea
                            placeholder="Describe the medical emergency, symptoms, and urgency level..."
                            value={diseaseDetails}
                            onChange={(e) => setDiseaseDetails(e.target.value)}
                            className="w-full min-h-[100px] border rounded-lg p-3"
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Medical Documents (Optional)</h4>
                          {[1, 2, 3].map((num) => (
                            <div key={num}>
                              <label className="block text-sm text-gray-600 mb-1">Document {num}</label>
                              <UploadButton
                                endpoint="fileUploader"
                                appearance={{
                                  button: "w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2",
                                }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    const setters = [setMedicalDoc1, setMedicalDoc2, setMedicalDoc3];
                                    setters[num - 1](res[0].url);
                                    toast.success(`Document ${num} uploaded`);
                                  }
                                }}
                                onUploadError={() => toast.error("Upload failed")}
                              />
                            </div>

                          ))}
                        </div>

                        <Button
                          onClick={handleBookAmbulance}
                          disabled={ambulanceLoading || !diseaseDetails.trim()}
                          className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl"
                          size="lg"
                        >
                          {ambulanceLoading ? "Booking..." : "Confirm Booking"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
          {bedsForBooking.length > 0 && (
            <Card className="shadow-lg border-l-4 border-l-green-500 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaBedPulse className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Book Bed</h2>
                </div>

                {/* Bed dropdown */}
                <select
                  value={selectedBed?.id || ""}
                  onChange={(e) => {
                    setSelectedBed(availableBeds.find((b) => b.id === e.target.value) || null);
                    setShowBedForm(false);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select a Bed --</option>
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      Bed #{b.bedNumber} ({b.category})
                    </option>
                  ))}
                </select>

                <Dialog open={showBedForm} onOpenChange={setShowBedForm}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={!selectedBed || bedBookingLoading}
                      className={`mt-4 w-full ${bedBookingLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} rounded-xl`}
                    >
                      {bedBookingLoading ? "Booking..." : "Book Bed"}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-xl">
                    <DialogHeader className="flex justify-center">
                      <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
                        Book Hospital Bed
                      </DialogTitle>
                    </DialogHeader>

                    {selectedBed && selectedBed.status === "AVAILABLE" && (
                      <div className="space-y-4 p-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Disease Details *</label>
                          <textarea
                            placeholder="Describe the medical situation..."
                            value={diseaseDetails}
                            onChange={(e) => setDiseaseDetails(e.target.value)}
                            className="w-full min-h-[100px] border border-gray-300 rounded-xl p-3 resize-none"
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Medical Documents (Optional)</h4>
                          {[1, 2, 3].map((num) => (
                            <div key={num}>
                              <label className="block text-sm text-gray-600 mb-1">Document {num}</label>
                              <UploadButton
                                endpoint="fileUploader"
                                appearance={{
                                  button: "w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2",
                                }}
                                onClientUploadComplete={(res) => {
                                  if (res.length > 0) {
                                    [setMedicalDoc1, setMedicalDoc2, setMedicalDoc3][num - 1](res[0].url);
                                    toast.success(`Document ${num} uploaded`);
                                  }
                                }}
                                onUploadError={() => toast.error("Upload failed")}
                              />
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={handleBookBed}
                          disabled={!diseaseDetails.trim()}
                          className="w-full bg-green-600 hover:bg-green-700 rounded-xl text-white text-lg py-3"
                        >
                          <FaBedPulse className="w-5 h-5 mr-2 inline-block" /> Confirm Bed Booking
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}


          {/* Surgery booking card */}
          {surgeries.length > 0 && (
            <Card className="shadow-lg border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Book Surgery</h2>
                </div>
                <div className="space-y-4">
                  <select
                    value={selectedSurgery}
                    onChange={(e) => setSelectedSurgery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">-- Select a Surgery --</option>
                    {surgeries.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.serviceName} ({s.category}) - ₹{s.minPrice} to ₹{s.maxPrice}
                      </option>
                    ))}
                  </select>

                  <Button
                    onClick={() => setShowBookingModal("surgery")}
                    disabled={!selectedSurgery || loading}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="lg"
                  >
                    {loading ? "Booking..." : "Book Surgery"}

                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Treatment booking card */}
          {treatments.length > 0 && (
            <Card className="shadow-lg border-l-4 border-l-indigo-500">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Book Treatment</h2>
                </div>
                <div className="space-y-4">
                  <select
                    value={selectedTreatment}
                    onChange={(e) => setSelectedTreatment(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">-- Select a Treatment --</option>
                    {treatments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.serviceName} ({t.category}) - ₹{t.minPrice} to ₹{t.maxPrice}
                      </option>
                    ))}
                  </select>

                  <Button
                    onClick={() => setShowBookingModal("treatment")}
                    disabled={!selectedTreatment || loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                  >
                    {loading ? "Booking..." : "Book Treatment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        )}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="relative mb-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {selectedSurgery ? "Book Surgery" : selectedTreatment ? "Book Treatment" : "Book Appointment"}
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                {/* Date Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    Select Date *
                  </label>
                  <DatePicker
                    selected={preferredDate}
                    onChange={(date) => setPreferredDate(date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs"
                    placeholderText="Choose date"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    Select Time *
                  </label>
                  <DatePicker
                    selected={preferredTime}
                    onChange={(time) => setPreferredTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="hh:mm aa"
                    placeholderText="Select time"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs"
                  />
                </div>

                {/* Notes Section */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-600" />
                    Notes / Instructions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Add instructions (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={() => {
                    if (selectedSurgery) {
                      handleBookSurgeryTreatment(selectedSurgery, "Surgery");
                    } else if (selectedTreatment) {
                      handleBookSurgeryTreatment(selectedTreatment, "Treatment");
                    } else {
                      handleBookAppointment();
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Booking...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Submit Booking
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patientsingleviewpage
