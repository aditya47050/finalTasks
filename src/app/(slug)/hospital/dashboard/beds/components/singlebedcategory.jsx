"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Bed,
  Users,
  Settings,
  AlertCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  User,
  CreditCard,
  Building2,
} from "lucide-react";
import { PiCurrencyInrBold } from "react-icons/pi";
import { FaBedPulse } from "react-icons/fa6";

const BedStatus = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  RESERVED: "RESERVED",

  ADMITTED: "CONFIRMED",
  DISCHARGED: "AVAILABLE",
};
const validStatuses = [
  "AVAILABLE",
  "BOOKED",
  "RESERVED",
  "ADMITTED",
  "DISCHARGED",
  "AVAILABLE_SOON",
  "CONFIRMED",
];

export default function BedCategoryDetail({
  categorydata,
  bedsdata,
  bookingdata,
  doctorsdata,
}) {
  const params = useParams();
  const router = useRouter();

  const [category, setCategory] = useState(categorydata);
  const [beds, setBeds] = useState(bedsdata);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(bookingdata);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
    setIsDialogOpen(true);

    if (bed.status === BedStatus.BOOKED || bed.status === BedStatus.RESERVED) {
      const foundBooking = bookingdata.find(
        (booking) => booking.bedId === bed.id
      );
      setBookingDetails(foundBooking || null);
    } else {
      setBookingDetails(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validStatuses.includes(status)) {
      setMessage("Invalid status selected.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/hospital/${params.hospitalid}/beds/bed-category/${selectedBed.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, doctorId: selectedDoctor }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status.");
      }
      setBeds((prevBeds) =>
        prevBeds.map((bed) =>
          bed.id === selectedBed.id ? { ...bed, status: data.status } : bed
        )
      );
      setMessage(`Status updated to ${data.status}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getBedStatusColor = (status, facility) => {
    // Facility-dependent overrides
    if (status === BedStatus.AVAILABLE) {
      return facility === "Government"
        ? "bg-green-50 text-emerald-700 border-blue-500  hover:bg-green-100"
        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    }

    if (status === BedStatus.BOOKED) {
      return facility === "Government"
        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
        : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
    }

    // Common colors for remaining statuses
    const commonColors = {
      [BedStatus.RESERVED]:
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      [BedStatus.CONFIRMED]:
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      [BedStatus.AVAILABLE_SOON]:
        "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",

      [BedStatus.ADMITTED]:
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
      [BedStatus.DISCHARGED]:
        "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    };

    return (
      commonColors[status] ??
      "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    );
  };
  const getBedStatusIcon = (status) => {
    switch (status) {
      default:
        return <FaBedPulse className="w-4 h-4 md:h-8 md:w-8" />;
    }
  };

  const getBedStats = () => {
    const available = beds.filter(
      (bed) => bed.status === BedStatus.AVAILABLE
    ).length;
    const booked = beds.filter((bed) => bed.status === BedStatus.BOOKED).length;
    const reserved = beds.filter(
      (bed) => bed.status === BedStatus.RESERVED
    ).length;

    const total = beds.length;

    return { available, booked, reserved, total };
  };

  const getOccupancyRate = () => {
    const stats = getBedStats();
    if (stats.total === 0) return 0;
    return Math.round((stats.booked / stats.total) * 100);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Category not found
          </h2>
          <p className="text-slate-600 mb-4">
            The bed category {"you're looking for doesn't"} exist.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const stats = getBedStats();
  const occupancyRate = getOccupancyRate();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">
              {category.name}
            </h1>
            <p className="text-slate-600 mt-1">Bed layout and availability</p>
          </div>
        </div>

        {/* Category Info Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2  bg-blue-100 rounded-xl">
                    <FaBedPulse className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      {category.chargeType && (
                        <span className="flex items-center gap-1">
                          {category.chargeType === "Hourly" ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Calendar className="w-4 h-4" />
                          )}
                          {category.chargeType} charges
                        </span>
                      )}
                      {category.minPrice && category.maxPrice && (
                        <span className="flex items-center gap-1">
                          <PiCurrencyInrBold className="w-4 h-4" />₹
                          {category.minPrice} - ₹{category.maxPrice}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500]">
                    {stats.available}
                  </div>
                  <div className="text-sm text-slate-600">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">
                    {stats.total}
                  </div>
                  <div className="text-sm text-slate-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {occupancyRate}%
                  </div>
                  <div className="text-sm text-slate-600">Occupied</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={occupancyRate} className="h-2 bg-slate-100" />
              <div className="flex justify-between text-xs text-slate-600">
                <span>0% Occupancy</span>
                <span>100% Occupancy</span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-700">
                  {stats.available} Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-slate-700">{stats.booked} Booked</span>
              </div>
              {stats.reserved > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-700">
                    {stats.reserved} Reserved
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Bed Layout */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Bed Layout
            </CardTitle>
            <CardDescription>
              Click on any bed to view details or booking information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {beds.map((bed) => (
                <div
                  key={bed.id}
                  onClick={() => handleBedClick(bed)}
                  className={`relative p-4 rounded-xl border-2 border-[#5271ff] transition-all duration-200 cursor-pointer hover:scale-105 ${getBedStatusColor(
                    bed.status,
                    bed.scheme
                  )}`}
                >
                  {/* Government badge */}
                  {bed.scheme === "Government" && (
                    <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                      G
                    </span>
                  )}

                  <div className="justify-center items-center flex">
                    {getBedStatusIcon(bed.status)}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg">{bed.bedNumber}</span>
                    <Badge className="text-xs truncate w-full justify-center mt-1">
                      {bed.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bed Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] h-[400px] overflow-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bed className="w-5 h-5" />
                Bed #{selectedBed?.bedNumber} Details
              </DialogTitle>
              <DialogDescription>
                {selectedBed?.status === BedStatus.BOOKED ||
                selectedBed?.status === BedStatus.RESERVED
                  ? "View booking information and patient details"
                  : "Bed status and availability information"}
              </DialogDescription>
            </DialogHeader>

            {selectedBed && (
              <div className="space-y-6">
                {/* Bed Status */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {getBedStatusIcon(selectedBed.status)}
                    <div>
                      <h3 className="font-semibold">Bed Status</h3>
                      <p className="text-sm text-slate-600">
                        {selectedBed.status.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getBedStatusColor(
                      selectedBed.status
                    )} border-current`}
                  >
                    {selectedBed.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                {/* Doctor Details */}
                {selectedBed.doctor && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-medium text-slate-900 mb-2">
                      Assigned Doctor
                    </h4>
                    <p className="text-sm text-slate-600">
                      {selectedBed.doctor.firstName}{" "}
                      {selectedBed.doctor.lastName}
                    </p>
                  </div>
                )}

                {/* Booking Details */}
                {(selectedBed.status === BedStatus.BOOKED ||
                  selectedBed.status === BedStatus.RESERVED) &&
                  bookingDetails && (
                    <div className="space-y-4 ">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Patient Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                            <User className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-slate-900">
                                {bookingDetails.firstName}{" "}
                                {bookingDetails.middleName}{" "}
                                {bookingDetails.lastName}
                              </p>
                              <p className="text-sm text-slate-600">
                                Patient Name
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                            <Phone className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-slate-900">
                                {bookingDetails.mobileNumber}
                              </p>
                              <p className="text-sm text-slate-600">
                                Mobile Number
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                            <Mail className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium text-slate-900">
                                {bookingDetails.email}
                              </p>
                              <p className="text-sm text-slate-600">
                                Email Address
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                            <Calendar className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="font-medium text-slate-900">
                                {new Date(
                                  bookingDetails.dateOfBirth
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-slate-600">
                                Date of Birth
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                            <Users className="w-5 h-5 text-pink-600" />
                            <div>
                              <p className="font-medium text-slate-900">
                                {bookingDetails.gender}
                              </p>
                              <p className="text-sm text-slate-600">Gender</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                            <CreditCard className="w-5 h-5 text-indigo-600" />
                            <div>
                              <p className="font-medium text-slate-900">
                                {bookingDetails.aadharCardNumber}
                              </p>
                              <p className="text-sm text-slate-600">
                                Aadhar Number
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl">
                        <h4 className="font-medium text-slate-900 mb-2">
                          Hospital Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Hospital:</span>
                            <span className="ml-2 font-medium">
                              {bookingDetails.hospitalName}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Type:</span>
                            <span className="ml-2 font-medium">
                              {bookingDetails.hospitalType}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">City:</span>
                            <span className="ml-2 font-medium">
                              {bookingDetails.city}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Pincode:</span>
                            <span className="ml-2 font-medium">
                              {bookingDetails.pinCode}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl">
                        <h4 className="font-medium text-slate-900 mb-2">
                          Booking Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">Booked on:</span>
                            <span className="ml-2 font-medium">
                              {new Date(
                                bookingDetails.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">
                              Last updated:
                            </span>
                            <span className="ml-2 font-medium">
                              {new Date(
                                bookingDetails.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Blood Group:</span>
                            <span className="ml-2 font-medium">
                              {bookingDetails.bloodGroup}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">Doctor:</span>
                            <span className="ml-2 font-medium">
                              {selectedBed.doctor?.firstName}{" "}
                              {selectedBed.doctor?.lastName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="text-gray-700">Select Bed Status</span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="">-- Choose Status --</option>
                      {validStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Assign Doctor</span>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="">-- Choose Doctor --</option>
                      {doctorsdata.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.firstName} {doctor.lastName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Status"}
                  </button>

                  {message && (
                    <p className="text-sm text-gray-800">{message}</p>
                  )}
                </form>

                {/* Available Bed Actions */}
                {selectedBed.status === BedStatus.AVAILABLE && (
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <h4 className="font-medium text-[#243460] mb-2">
                      Available for Booking
                    </h4>
                    <p className="text-sm text-[#243460] mb-4">
                      This bed is currently available and ready for patient
                      admission.
                    </p>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      Book This Bed
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
