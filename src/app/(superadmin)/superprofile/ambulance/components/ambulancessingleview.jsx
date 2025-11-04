"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Truck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Building,
  Clock,
  Activity,
  Banknote,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  User,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Modal from "react-modal"
import { toast } from "react-toastify"

const AmbulanceSingleView = ({ ambulanceData }) => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [currentVehicleAction, setCurrentVehicleAction] = useState(null)
  const [currentVehicleId, setCurrentVehicleId] = useState(null)
  const [vehicleRemark, setVehicleRemark] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedVehicleIssues, setSelectedVehicleIssues] = useState([])

  const generateVehicleIssues = () => {
    const vehicleFields = [
      "ambulancemodel",
      "ambulancecharges",
      "ambulanceareapincode",
      "ambulanceregdate",
      "ambulancercno",
      "ambulancetype",
      "ambulancecategory",
      "facilities",
      "puc",
      "insurance",
    ]

    const fieldIssues = vehicleFields.map((f) => `Invalid ${f.charAt(0).toUpperCase() + f.slice(1)}`)

    const documentIssues = [
      "Missing Vehicle Registration Certificate",
      "Invalid RC Book",
      "Missing PUC Certificate",
      "Invalid Insurance Documents",
      "Expired Insurance",
      "Missing Vehicle Images",
      "Poor Image Quality",
      "Vehicle Images Not Clear",
    ]

    const vehicleConditionIssues = [
      "Vehicle Not Roadworthy",
      "Missing Safety Equipment",
      "Inadequate Medical Equipment",
      "Vehicle Condition Poor",
      "Missing Emergency Equipment",
      "Oxygen Cylinder Issues",
      "Stretcher Problems",
      "Ambulance Lighting Issues",
    ]

    const complianceIssues = [
      "Does Not Meet Ambulance Standards",
      "Missing Required Permits",
      "Vehicle Type Mismatch",
      "Category Classification Wrong",
      "Facility Claims Unverified",
      "Driver Assignment Issues",
    ]

    const generalIssues = ["Incomplete Vehicle Information", "Verification Failed", "Other"]

    return [...fieldIssues, ...documentIssues, ...vehicleConditionIssues, ...complianceIssues, ...generalIssues]
  }

  const vehicleIssues = generateVehicleIssues()

  const toggleVehicleIssue = (issue) => {
    setSelectedVehicleIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]))
  }

  if (!ambulanceData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No data available</h3>
          <p className="text-sm text-muted-foreground">Ambulance information could not be loaded.</p>
        </div>
      </div>
    )
  }

  const {
    email,
    mobile,
    pincode,
    category,
    createdAt,
    updatedAt,
    ownerfirstname,
    ownerlastname,
    ownermiddlename,
    dateofbirth,
    gender,
    alternatemobileno,
    owneraadharcardno,
    ownerpanno,
    passportphoto,
    approvalStatus,
    adminname,
    admincontact,
    adminemail,
    AmbulanceVaichicle,
    AmbulanceHsp,
    HospitalAmbulance,
    AmbulanceDriver,
  } = ambulanceData

  const stats = [
    {
      title: "Total Vehicles",
      value: AmbulanceVaichicle?.length?.toString() || "0",
      icon: Truck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Drivers",
      value: AmbulanceDriver?.length?.toString() || "0",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Hospital Partners",
      value: HospitalAmbulance?.length?.toString() || "0",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Online Vehicles",
      value: AmbulanceVaichicle?.filter((v) => v.isOnline)?.length?.toString() || "0",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const getVehicleStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "text-green-600 bg-green-50"
      case "BOOKED":
        return "text-blue-600 bg-blue-50"
      case "CONFIRMED":
        return "text-purple-600 bg-purple-50"
      case "ADMITTED":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getVehicleStatusIcon = (status) => {
    switch (status) {
      case "AVAILABLE":
        return CheckCircle
      case "BOOKED":
        return AlertCircle
      case "CONFIRMED":
        return CheckCircle
      case "ADMITTED":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const openVehicleModal = (action, vehicleId) => {
    setCurrentVehicleAction(action)
    setCurrentVehicleId(vehicleId)
    setIsVehicleModalOpen(true)
  }

  const closeVehicleModal = () => {
    setIsVehicleModalOpen(false)
    setVehicleRemark("")
    setSelectedVehicleIssues([])
  }

  const handleVehicleApproval = async () => {
    if (currentVehicleAction === "reject" && vehicleRemark.trim() === "" && selectedVehicleIssues.length === 0) {
      toast.error("Please provide a remark or select issues for rejection!")
      return
    }

    try {
      setLoading(true)
      const fullRemark =
        selectedVehicleIssues.length > 0
          ? `${vehicleRemark}\n\nIssues:\n- ${selectedVehicleIssues.join("\n- ")}`
          : vehicleRemark

      const response = await fetch(`/api/ambulance/vehicle/${currentVehicleId}/approval`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: currentVehicleAction,
          remark: fullRemark.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update vehicle status")
      }

      toast.success(`Vehicle ${currentVehicleAction === "approve" ? "approved" : "rejected"} successfully!`)
      closeVehicleModal()
      window.location.reload()
    } catch (error) {
      console.error("Error updating vehicle:", error)
      toast.error(error.message || "Failed to update vehicle status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-orange-600 to-red-800 text-white p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage src={passportphoto || "/placeholder.svg?height=96&width=96"} alt="Owner Photo" />
                  <AvatarFallback className="text-2xl bg-white/20">
                    <Truck className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {ownerfirstname} {ownermiddlename} {ownerlastname}
                  </h1>
                  {category && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {category}
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className={`${
                      approvalStatus === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : approvalStatus === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {approvalStatus || "PENDING"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-orange-100 mb-4">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{mobile}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{pincode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">First Name</p>
                <p className="text-sm">{ownerfirstname || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                <p className="text-sm">{ownerlastname || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="text-sm">{dateofbirth || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-sm">{gender || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alternate Mobile</p>
                <p className="text-sm">{alternatemobileno || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aadhar Number</p>
                <p className="text-sm font-mono">{owneraadharcardno || "N/A"}</p>
              </div>
            </div>
            {ownerpanno && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">PAN Number</p>
                <p className="text-sm font-mono">{ownerpanno}</p>
              </div>
            )}

            <Separator />
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hospital Information */}
        {AmbulanceHsp && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Hospital Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Name</p>
                <p className="text-sm">{AmbulanceHsp.hspregname || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ambulances</p>
                <p className="text-sm">{AmbulanceHsp.totalambulance || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm">{AmbulanceHsp.presentaddress || "N/A"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p className="text-sm">{AmbulanceHsp.city || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">State</p>
                  <p className="text-sm">{AmbulanceHsp.state || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">District</p>
                  <p className="text-sm">{AmbulanceHsp.district || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pincode</p>
                  <p className="text-sm">{AmbulanceHsp.pincode || "N/A"}</p>
                </div>
              </div>
              {AmbulanceHsp.hspdescription && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{AmbulanceHsp.hspdescription}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ambulance Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Ambulance Vehicles ({AmbulanceVaichicle?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AmbulanceVaichicle?.map((vehicle, index) => {
              const StatusIcon = getVehicleStatusIcon(vehicle.status)
              const isAmbulanceApproved = approvalStatus === "APPROVED"
              const isAmbulanceRejected = approvalStatus === "REJECTED"

              return (
                <Card key={index} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{vehicle.ambulancemodel || "Unknown Model"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getVehicleStatusColor(vehicle.status)}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{vehicle.status}</span>
                        </div>
                        {/* Vehicle Approval Status */}
                        <div className="text-center">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              vehicle.approvalStatus === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : vehicle.approvalStatus === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {vehicle.approvalStatus || "PENDING"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span>{vehicle.ambulancetype || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{vehicle.ambulancecategory || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RC Number:</span>
                        <span className="font-mono">{vehicle.ambulancercno || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Charges:</span>
                        <span>₹{vehicle.ambulancecharges || "N/A"}</span>
                      </div>
                      {vehicle.facilities && (
                        <div>
                          <span className="text-muted-foreground">Facilities:</span>
                          <p className="text-xs mt-1">{vehicle.facilities}</p>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Online:</span>
                        <Badge variant={vehicle.isOnline ? "default" : "secondary"}>
                          {vehicle.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                      {vehicle.driver && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Driver:</span>
                          <span>
                            {vehicle.driver.firstname} {vehicle.driver.lastname}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Images */}
                    {(vehicle.ambulanceimagefront || vehicle.ambulanceimageback) && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Vehicle Images:</p>
                        <div className="flex gap-2">
                          {vehicle.ambulanceimagefront && (
                            <div className="w-16 h-12 overflow-hidden rounded border">
                              <Image
                                src={vehicle.ambulanceimagefront || "/placeholder.svg"}
                                alt="Front view"
                                width={64}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {vehicle.ambulanceimageback && (
                            <div className="w-16 h-12 overflow-hidden rounded border">
                              <Image
                                src={vehicle.ambulanceimageback || "/placeholder.svg"}
                                alt="Back view"
                                width={64}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Vehicle Approval Actions */}
                    <div className="mt-4">
                      {isAmbulanceRejected ? (
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-600 font-medium">
                            Cannot approve vehicles - Ambulance is rejected
                          </p>
                        </div>
                      ) : !isAmbulanceApproved ? (
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-600 font-medium">
                            Approve ambulance first to enable vehicle approval
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => openVehicleModal("approve", vehicle.id)}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                            disabled={vehicle.approvalStatus === "APPROVED"}
                          >
                            {vehicle.approvalStatus === "APPROVED" ? "Already Approved" : "Approve Vehicle"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openVehicleModal("reject", vehicle.id)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                            disabled={vehicle.approvalStatus === "REJECTED"}
                          >
                            {vehicle.approvalStatus === "REJECTED" ? "Already Rejected" : "Reject Vehicle"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Drivers */}
      {AmbulanceDriver && AmbulanceDriver.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Drivers ({AmbulanceDriver.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AmbulanceDriver.map((driver, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={driver.photo || "/placeholder.svg"} alt="Driver Photo" />
                        <AvatarFallback>
                          {driver.firstname?.[0]}
                          {driver.lastname?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {driver.firstname} {driver.lastname}
                        </p>
                        <p className="text-xs text-muted-foreground">{driver.mobile}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-xs">{driver.email || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blood Group:</span>
                        <span>{driver.bloodgroup || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First Aid:</span>
                        <Badge variant={driver.firstaidtraining ? "default" : "secondary"}>
                          {driver.firstaidtraining ? "Trained" : "Not Trained"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hospital Partners */}
      {HospitalAmbulance && HospitalAmbulance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Hospital Partners ({HospitalAmbulance.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {HospitalAmbulance.map((ha, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl border">
                  <div>
                    <p className="font-medium">{ha.hospital?.hspInfo?.regname || "Hospital"}</p>
                    <p className="text-sm text-muted-foreground">
                      {ha.hospital?.hspcontact?.city}, {ha.hospital?.hspcontact?.state}
                    </p>
                  </div>
                  <Badge variant="outline">Partner</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banking Details */}
      {AmbulanceHsp && (AmbulanceHsp.bankname || AmbulanceHsp.accountnumber) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Banking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {AmbulanceHsp.bankname && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                  <p className="text-sm">{AmbulanceHsp.bankname}</p>
                </div>
              )}
              {AmbulanceHsp.accountnumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                  <p className="text-sm font-mono">{AmbulanceHsp.accountnumber}</p>
                </div>
              )}
              {AmbulanceHsp.ifsccode && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
                  <p className="text-sm font-mono">{AmbulanceHsp.ifsccode}</p>
                </div>
              )}
              {AmbulanceHsp.accounttype && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                  <p className="text-sm">{AmbulanceHsp.accounttype}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Approval Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={isVehicleModalOpen}
        onRequestClose={closeVehicleModal}
        contentLabel="Vehicle Approval"
        className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[600px] overflow-y-auto mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {currentVehicleAction === "approve" ? "Approve Vehicle" : "Reject Vehicle"}
        </h2>
        <textarea
          value={vehicleRemark}
          onChange={(e) => setVehicleRemark(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={5}
          placeholder={
            currentVehicleAction === "approve"
              ? "Enter approval remarks (optional)"
              : "Please specify the reason for rejection"
          }
        ></textarea>

        {currentVehicleAction === "reject" && (
          <div className="mb-4 max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-2">Select Vehicle Issues:</h3>
            <div className="grid grid-cols-1 gap-2">
              {vehicleIssues.map((issue) => (
                <label key={issue} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedVehicleIssues.includes(issue)}
                    onChange={() => toggleVehicleIssue(issue)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{issue}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={closeVehicleModal} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button
            onClick={handleVehicleApproval}
            className={`${
              currentVehicleAction === "approve" ? "bg-green-500" : "bg-red-500"
            } text-white px-4 py-2 rounded`}
            disabled={loading}
          >
            {loading ? "Processing..." : currentVehicleAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default AmbulanceSingleView
