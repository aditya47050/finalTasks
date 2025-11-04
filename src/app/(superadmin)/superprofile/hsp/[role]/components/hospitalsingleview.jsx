"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Stethoscope,
  UserCheck,
  Truck,
  Building,
  Hash,
  Clock,
  BedDouble,
  CreditCard,
  Shield,
  Award,
  FileText,
  Activity,
  Heart,
  Banknote,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const HospitalSingleView = ({ hospitalData, role }) => {
  const [showAllDetails, setShowAllDetails] = useState(false);
  
  if (!hospitalData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No data available
          </h3>
          <p className="text-sm text-muted-foreground">
            Hospital information could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const {
    email,
    mobile,
    pincode,
    createdAt,
    updatedAt,
    hspInfo,
    hspdetails,
    hspcontact,
    hspbranches,
    Bed,
    staff,
    HospitalDepartment,
    HospitalSpeciality,
    HospitalDoctor,
    HospitalAmbulance,
    BedCategory,
    BedBooking,
    diagnosticServices,
    Surgeytreatment,
  } = hospitalData;

  // Determine what to show based on role
  const showBeds = (role === "Hospital") && !showAllDetails;
  const showStaff = (role === "Hospital" || role === "homehealthcare" || role === "Pathology" || role === "DiagnosticCenter" || role === "Clinic") && !showAllDetails;
  const showDepartments = (role === "Hospital") && !showAllDetails;
  const showSpecialities = (role === "Hospital" || role === "homehealthcare") && !showAllDetails;
  const showDoctors = (role === "Hospital" || role === "homehealthcare") && !showAllDetails;
  const showAmbulance = (role === "Hospital") && !showAllDetails;
  const showDiagnosticServices = (role === "Hospital" || role === "DiagnosticCenter") && !showAllDetails;
  const showSurgeryTreatment = (role === "Hospital") && !showAllDetails;
  const showBedCategory = (role === "Hospital") && !showAllDetails;
  const showBedBooking = (role === "Hospital" ) && !showAllDetails;

  // Calculate bed occupancy
  const totalBeds = Bed?.length || 0;
  const availableBeds =
    Bed?.filter((bed) => bed.status === "AVAILABLE")?.length || 0;
  const occupiedBeds = totalBeds - availableBeds;
  const occupancyRate =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const stats = [
    {
      title: "Total Beds",
      value: totalBeds.toString(),
      icon: BedDouble,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      show: showBeds,
    },
    {
      title: "Specialities",
      value: HospitalSpeciality?.length?.toString() || "0",
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-50",
      show: showSpecialities,
    },
    {
      title: "Doctors",
      value: HospitalDoctor?.length?.toString() || "0",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      show: showDoctors,
    },
    {
      title: "Staff Members",
      value: staff?.length?.toString() || "0",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      show: showStaff,
    },
  ].filter(stat => stat.show);

  const getBedStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "text-green-600 bg-green-50";
      case "BOOKED":
        return "text-blue-600 bg-blue-50";
      case "CONFIRMED":
        return "text-purple-600 bg-purple-50";
      case "ADMITTED":
        return "text-red-600 bg-red-50";
      case "DISCHARGED":
        return "text-gray-600 bg-gray-50";
      case "UNDER_MAINTENANCE":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getBedStatusIcon = (status) => {
    switch (status) {
      case "AVAILABLE":
        return CheckCircle;
      case "BOOKED":
        return AlertCircle;
      case "CONFIRMED":
        return CheckCircle;
      case "ADMITTED":
        return XCircle;
      case "DISCHARGED":
        return CheckCircle;
      case "UNDER_MAINTENANCE":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage
                    src={
                      hspdetails?.hsplogo ||
                      "/placeholder.svg?height=96&width=96"
                    }
                    alt="Hospital Logo"
                  />
                  <AvatarFallback className="text-2xl bg-white/20">
                    <Building2 className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {hspInfo?.regname || "Hospital Name"}
                  </h1>
                  {role && (
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      {role}
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className="bg-white/20 text-white border-white/30 cursor-pointer"
                    onClick={() => setShowAllDetails(!showAllDetails)}
                  >
                    {showAllDetails ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Restricted View
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Show All
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-blue-100 mb-4">
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
                {/* Bed Occupancy */}
                {showBeds && (
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Bed Occupancy</span>
                      <span className="text-sm">
                        {occupiedBeds}/{totalBeds} ({occupancyRate}%)
                      </span>
                    </div>
                    <Progress value={occupancyRate} className="h-2 bg-white/20" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p className="text-sm">{hspcontact?.address || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  City
                </p>
                <p className="text-sm">{hspcontact?.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  State
                </p>
                <p className="text-sm">{hspcontact?.state || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  District
                </p>
                <p className="text-sm">{hspcontact?.dist || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taluka
                </p>
                <p className="text-sm">{hspcontact?.taluka || "N/A"}</p>
              </div>
            </div>

            {/* Reception Contacts */}
            {(hspcontact?.receptioncontact1 ||
              hspcontact?.receptioncontact2) && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Reception Contacts
                    </p>
                    <div className="space-y-1">
                      {hspcontact?.receptioncontact1 && (
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {hspcontact.receptioncontact1}
                        </p>
                      )}
                      {hspcontact?.receptioncontact2 && (
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {hspcontact.receptioncontact2}
                        </p>
                      )}
                      {hspcontact?.receptionemail && (
                        <p className="text-sm flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {hspcontact.receptionemail}
                        </p>
                      )}
                    </div>
                  </div>
                </>
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

        {/* Hospital Details & Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Registration & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Registration Number
              </p>
              <p className="text-sm font-mono">
                {hspdetails?.hspregno || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Registration Date
              </p>
              <p className="text-sm">{hspdetails?.hspregdate || "N/A"}</p>
            </div>

            {/* NABH/NABL Certification */}
            {hspdetails?.nabhnablapproved && (
              <div className="bg-green-50 p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    NABH/NABL Certified
                  </p>
                </div>
                <p className="text-xs text-green-600">
                  Level: {hspdetails?.nabhnabllevel || "N/A"}
                </p>
              </div>
            )}

            {/* ISO Certification */}
            {hspdetails?.isoapproved && (
              <div className="bg-blue-50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">
                    ISO Certified
                  </p>
                </div>
              </div>
            )}

            {/* PAN Details */}
            {hspdetails?.pancardno && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    PAN Number
                  </p>
                  <p className="text-sm font-mono">{hspdetails.pancardno}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hospital Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Hospital Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hspInfo?.onlineconsultation && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl">
                <Heart className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Online Consultation</span>
              </div>
            )}
            {hspInfo?.homehealthcare && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-xl">
                <Building2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Home Healthcare</span>
              </div>
            )}
            {hspInfo?.pharmacy && (
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-xl">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Pharmacy</span>
              </div>
            )}
            {hspInfo?.pathology && (
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-xl">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Pathology</span>
              </div>
            )}
            {hspInfo?.diagnosticservices && (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-xl">
                <Stethoscope className="h-4 w-4 text-red-600" />
                <span className="text-sm">Diagnostic Services</span>
              </div>
            )}
            {hspInfo?.cashlessservices && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-xl">
                <CreditCard className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Cashless Services</span>
              </div>
            )}
            {hspInfo?.governmentschemes && (
              <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-xl">
                <Shield className="h-4 w-4 text-indigo-600" />
                <span className="text-sm">Government Schemes</span>
              </div>
            )}
            {hspInfo?.inhousecanteen && (
              <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-xl">
                <Building className="h-4 w-4 text-pink-600" />
                <span className="text-sm">In-house Canteen</span>
              </div>
            )}
          </div>
          {hspInfo?.experience && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground">
                Experience
              </p>
              <p className="text-sm">{hspInfo.experience} years</p>
            </div>
          )}
        </CardContent>
      </Card>

      {(showSpecialities || showDepartments || showBedCategory) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Specialities */}
          {showSpecialities && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Specialities ({HospitalSpeciality?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {HospitalSpeciality?.map((speciality, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {speciality.speciality?.title || "N/A"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Departments */}
          {showDepartments && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Departments ({HospitalDepartment?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {HospitalDepartment?.map((department, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm p-2 hover:bg-muted/50 rounded"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium">{department.department}</p>
                        {department.email && (
                          <p className="text-xs text-muted-foreground">
                            {department.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bed Categories */}
          {showBedCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5" />
                  Bed Categories ({BedCategory?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {BedCategory?.map((category, index) => (
                    <div key={index} className="p-2 border rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{category.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {category.bedCount} beds
                        </Badge>
                      </div>
                      {(category.minPrice || category.maxPrice) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Banknote className="h-3 w-3" />
                          <span>
                            ₹{category.minPrice || 0} - ₹{category.maxPrice || 0}
                            {category.chargeType && ` (${category.chargeType})`}
                          </span>
                        </div>
                      )}
                      {category.hasgovernmentschema && (
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                          <Shield className="h-3 w-3" />
                          <span>Government Scheme Available</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Bed Status Overview */}
      {showBeds && Bed && Bed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Bed Status Overview ({Bed.length} Total Beds)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
              {Object.entries(
                Bed.reduce((acc, bed) => {
                  acc[bed.status] = (acc[bed.status] || 0) + 1;
                  return acc;
                }, {})
              ).map(([status, count]) => {
                const StatusIcon = getBedStatusIcon(status);
                return (
                  <div
                    key={status}
                    className={`p-3 rounded-xl ${getBedStatusColor(status)}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-lg font-bold">{count}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {(showDoctors || showStaff) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctors */}
          {showDoctors && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Doctors ({HospitalDoctor?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {HospitalDoctor?.map((hospitalDoctor, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {hospitalDoctor.doctor?.firstName?.[0] || "D"}
                          {hospitalDoctor.doctor?.lastName?.[0] || "R"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Dr. {hospitalDoctor.doctor?.firstName || ""}{" "}
                          {hospitalDoctor.doctor?.lastName || "Unknown"}
                        </p>
                        {hospitalDoctor.doctor?.education && (
                          <p className="text-xs text-muted-foreground">
                            {hospitalDoctor.doctor.education}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Staff */}
          {showStaff && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff Members ({staff?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {staff?.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2) || "ST"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.fullName}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {member.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Level {member.level}
                          </span>
                        </div>
                        {member.email && (
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(showAmbulance || hspbranches?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ambulances */}
          {showAmbulance && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Ambulance Services ({HospitalAmbulance?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {HospitalAmbulance?.map((ambulance, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {ambulance.ambulance?.category || "Ambulance"}
                        </p>
                        {ambulance.ambulance?.ownerfirstname && (
                          <p className="text-xs text-muted-foreground">
                            Owner: {ambulance.ambulance.ownerfirstname}{" "}
                            {ambulance.ambulance.ownerlastname}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {ambulance.ambulance?.approvalStatus || "Pending"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {ambulance.ambulance?.AmbulanceVaichicle?.length || 0} -
                        Ambulances
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Branches */}
          {hspbranches?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Branch Locations ({hspbranches?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hspbranches?.map((branch, index) => (
                    <div key={index} className="p-3 rounded-xl bg-muted/30">
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{branch.branchname}</p>
                          {branch.branchaddress && (
                            <p className="text-xs text-muted-foreground">
                              {branch.branchaddress}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {branch.branchcity}, {branch.state} -{" "}
                            {branch.branchpincode}
                          </p>
                        </div>
                      </div>
                      {(branch.branchreceptionno1 || branch.branchmanagername) && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          {branch.branchreceptionno1 && (
                            <p className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {branch.branchreceptionno1}
                            </p>
                          )}
                          {branch.branchmanagername && (
                            <p>Manager: {branch.branchmanagername}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Banking Details */}
      {hspdetails && (hspdetails.bankname || hspdetails.bankaccountno) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Banking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hspdetails.bankname && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bank Name
                  </p>
                  <p className="text-sm">{hspdetails.bankname}</p>
                </div>
              )}
              {hspdetails.bankaccountno && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Number
                  </p>
                  <p className="text-sm font-mono">
                    {hspdetails.bankaccountno}
                  </p>
                </div>
              )}
              {hspdetails.ifsccode && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    IFSC Code
                  </p>
                  <p className="text-sm font-mono">{hspdetails.ifsccode}</p>
                </div>
              )}
              {hspdetails.accounttype && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Type
                  </p>
                  <p className="text-sm">{hspdetails.accounttype}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div
        className={`grid gap-6 ${
          diagnosticServices?.length > 0 && Surgeytreatment?.length > 0
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* Diagnostic Services */}
        {showDiagnosticServices && diagnosticServices?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Diagnostic Services ({diagnosticServices.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {diagnosticServices.map((service, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-xl flex flex-col gap-1"
                  >
                    <p className="font-medium text-sm">{service.facility}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.category} → {service.subCategory}
                    </p>
                    {(service.minPrice || service.maxPrice) && (
                      <p className="text-xs text-green-600">
                        ₹{service.minPrice || 0} - ₹{service.maxPrice || 0}
                      </p>
                    )}
                    {service.available === false && (
                      <Badge variant="destructive" className="text-xs w-fit">
                        Not Available
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Surgery & Treatment Services */}
        {showSurgeryTreatment && Surgeytreatment?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Surgery & Treatments ({Surgeytreatment.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Surgeytreatment.map((treatment, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-xl flex flex-col gap-1"
                  >
                    <p className="font-medium text-sm">{treatment.serviceName}</p>
                    <p className="text-xs text-muted-foreground">
                      Category: {treatment.category}
                      {treatment.type && ` • Type: ${treatment.type}`}
                    </p>
                    {(treatment.minPrice || treatment.maxPrice) && (
                      <p className="text-xs text-green-600">
                        ₹{treatment.minPrice || 0} - ₹{treatment.maxPrice || 0}
                      </p>
                    )}
                    {!treatment.isAvailable && (
                      <Badge variant="destructive" className="text-xs w-fit">
                        Not Available
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Bed Bookings */}
      {showBedBooking && BedBooking && BedBooking.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bed Bookings ({BedBooking.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {BedBooking.slice(0, 5).map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {booking.firstName} {booking.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.bedCategory} • {booking.city}
                    </p>
                    {booking.Bookingdate && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.Bookingdate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {booking.recievedfrom || "Patient"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HospitalSingleView;