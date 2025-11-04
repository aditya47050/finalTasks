"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Search,
  Truck,
  CheckCircle,
  FileText,
  ImageIcon,
  Tag,
  IndianRupee,
  MapPin,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddAmbulanceVehicleDialog } from "./create-ambulance";
import HeadingClientMain from "@/app/components/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FaPencilAlt } from "react-icons/fa";

export default function AllAmbulancesData({ ambulances, mainambulanceId }) {
 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Filter ambulances based on search query
  const filteredAmbulances = ambulances.filter((ambulance) => {
    const searchString = searchQuery.toLowerCase();
    return (
      ambulance.ambulancemodel?.toLowerCase().includes(searchString) ||
      ambulance.ambulancetype?.toLowerCase().includes(searchString) ||
      ambulance.ambulanceareapincode?.toLowerCase().includes(searchString) ||
      ambulance.ambulancercno?.toLowerCase().includes(searchString) ||
      ambulance.status?.toLowerCase().includes(searchString)
    );
  });

  // Function to handle status change
  const handleStatusChange = async (vehicleId, newStatus) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/ambulance/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleId, newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setMessage("Status updated successfully!");
      window.location.href="/ambulance/driver/ambulances"
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
   console.log(filteredAmbulances);

  return (
    <div className="container w-[300px] md:w-full mx-auto py-6">
      <HeadingClientMain main={"Ambulance Details"} sub="" />
      <Card className="border-none">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ambulances..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {mainambulanceId && (
              <AddAmbulanceVehicleDialog mainambulanceId={mainambulanceId} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Charges
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Discount</TableHead>
                  <TableHead className="hidden md:table-cell">Final Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Area Code
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Registration Date
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAmbulances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No ambulances found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAmbulances.map((ambulance) => {
                    const currentStatus = ambulance.status;
                    return (
                      <TableRow key={ambulance.id}>
                        <TableCell>
                          {ambulance.ambulanceimagefront ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                              <Image
                                src={ambulance.ambulanceimagefront}
                                alt={ambulance.ambulancemodel || "Ambulance"}
                                fill
                                className="object-cover rounded-full"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                              <Truck className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {ambulance.ambulancemodel || "N/A"}
                        </TableCell>
                        <TableCell>
                          {ambulance.ambulancetype || "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {ambulance.ambulancecharges
                            ? `₹${ambulance.ambulancecharges}`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {ambulance.ambulancediscount ? `${ambulance.ambulancediscount}%` : "0%"}
                        </TableCell>

                        <TableCell className="hidden md:table-cell font-semibold">
                          {ambulance.ambulancefinalcharge
                            ? `₹${
                                ambulance.ambulancefinalcharge}`
                            : "0"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {ambulance.ambulanceareapincode || "N/A"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {ambulance.ambulanceregdate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ambulance.status === "AVILABLE"
                                ? "success"
                                : ambulance.status === "pending"
                                ? "warning"
                                : "secondary"
                            }
                            className={
                              ambulance.status === "AVILABLE"
                                ? "bg-green-100 text-green-800"
                                : ambulance.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                            }
                          >
                            {ambulance.status || "N/A"}
                          </Badge>
                          <Dialog>
                            <DialogTrigger><FaPencilAlt/> </DialogTrigger>
                            <DialogContent className="!w-64">
                               <HeadingClientMain main={"Change the Status "} /> 
                               {" "}
                              <div className="flex justify-center">
                               
                               
                               <select
                                  value={currentStatus}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      ambulance.id,
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                  className="h-auto p-2 rounded-xl"
                                >
                                 
                                  <option value="AVAILABLE">AVILABLE</option>
                                  <option value="BOOKED">Booked</option>
                                  <option value="CONFIRMED">Confirmed</option>
                                  <option value="AVAILABLE">ADMITTED</option>
                                </select>
                                {message && <p>{message}</p>}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <span
                                className=" text-black border rounded-xl px-2 py-1 hover:bg-white"
                                onClick={() => setSelectedAmbulance(ambulance)}
                              >
                                View
                              </span>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] bg-white">
                              <DialogHeader></DialogHeader>
                              <div className="grid gap-4 py-4 bg-white">
                                <AmbulanceDetails
                                  ambulance={selectedAmbulance}
                                  mainambulanceId={mainambulanceId}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AmbulanceDetails({ ambulance, mainambulanceId }) {
  if (!ambulance) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="w-full h-[400px] overflow-auto space-y-6">
      {/* Header Section */}
      <Card className="shadow-sm border-muted rounded-xl">
        <CardHeader className="bg-gradient-to-r rounded-xl from-blue-500 to-indigo-500 ">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white font-poppins">
                  {ambulance.ambulancemodel || "Ambulance"}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={getStatusColor("active")}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  {ambulance.ambulancetype && (
                    <Badge variant="secondary text-white">
                      {ambulance.ambulancetype}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Quick Stats */}

        {/* Detailed Information */}
        <div className="xl:col-span-4">
          <Card className="shadow-sm">
            <Tabs defaultValue="overview" className="w-full flex flex-wrap">
              <TabsList className="w-full flex flex-wrap justify-start rounded-none border-b bg-transparent md:h-12 h-24 px-6">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-background"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-background"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-background"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="data-[state=active]:bg-background"
                >
                  Location
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-8">
                  {/* Basic Information Grid */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                      <DetailCard
                        icon={<Truck className="h-5 w-5 text-blue-600" />}
                        label="Model"
                        value={ambulance.ambulancemodel || "N/A"}
                        bgColor="bg-blue-50"
                      />
                      <DetailCard
                        icon={<Tag className="h-5 w-5 text-green-600" />}
                        label="Type"
                        value={ambulance.ambulancetype || "N/A"}
                        bgColor="bg-green-50"
                      />
                      <DetailCard
                        icon={
                          <IndianRupee className="h-5 w-5 text-purple-600" />
                        }
                        label="Charges/km"
                        value={
                          ambulance.ambulancecharges
                            ? `₹${ambulance.ambulancecharges}`
                            : "N/A"
                        }
                        bgColor="bg-purple-50"
                      />
                      <DetailCard
                        icon={<MapPin className="h-5 w-5 text-orange-600" />}
                        label="Area Pincode"
                        value={ambulance.ambulanceareapincode || "N/A"}
                        bgColor="bg-orange-50"
                      />
                      <DetailCard
                        icon={<Calendar className="h-5 w-5 text-red-600" />}
                        label="Registration Date"
                        value={
                          ambulance.ambulanceregdate
                            ? format(
                                new Date(ambulance.ambulanceregdate),
                                "MMM dd, yyyy"
                              )
                            : "N/A"
                        }
                        bgColor="bg-red-50"
                      />
                      <DetailCard
                        icon={<FileText className="h-5 w-5 text-indigo-600" />}
                        label="RC Number"
                        value={ambulance.ambulancercno || "N/A"}
                        bgColor="bg-indigo-50"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Additional Details
                    </h3>
                    <div className="bg-muted/30 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">
                            Registration Information
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            This ambulance was registered on{" "}
                            {ambulance.ambulanceregdate
                              ? format(
                                  new Date(ambulance.ambulanceregdate),
                                  "MMMM dd, yyyy"
                                )
                              : "an unknown date"}{" "}
                            with RC number{" "}
                            {ambulance.ambulancercno || "not provided"}.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Service Area</h4>
                          <p className="text-sm text-muted-foreground">
                            Currently serving in the{" "}
                            {ambulance.ambulanceareapincode || "unspecified"}{" "}
                            pincode area with a rate of ₹
                            {ambulance.ambulancecharges || "0"} per kilometer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Ambulance Gallery
                    </h3>
                  </div>

                  {hasAmbulanceImages(ambulance) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ImageCard
                        src={
                          ambulance.ambulanceimagefront || "/placeholder.svg"
                        }
                        alt="Front View"
                        label="Front View"
                        description="Front exterior view of the ambulance"
                      />
                      <ImageCard
                        src={
                          ambulance.ambulanceimageright || "/placeholder.svg"
                        }
                        alt="Right Side View"
                        label="Right Side"
                        description="Right side exterior view"
                      />
                      <ImageCard
                        src={ambulance.ambulanceimageback || "/placeholder.svg"}
                        alt="Back View"
                        label="Back View"
                        description="Rear exterior view"
                      />
                      <ImageCard
                        src={ambulance.ambulanceimageleft || "/placeholder.svg"}
                        alt="Left Side View"
                        label="Left Side"
                        description="Left side exterior view"
                      />
                      <ImageCard
                        src={
                          ambulance.ambulanceimageinternal || "/placeholder.svg"
                        }
                        alt="Internal View"
                        label="Interior"
                        description="Internal equipment and layout"
                      />
                    </div>
                  ) : (
                    <div className="flex h-60 items-center justify-center rounded-xl border-2 border-dashed bg-muted/30">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-muted-foreground mb-2">
                          No images available
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Upload images to showcase this ambulance
                        </p>
                        <Button variant="outline" className="mt-4">
                          Upload Images
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Legal Documents
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DocumentCard
                      title="Registration Certificate (RC)"
                      src={ambulance.ambulancercbook}
                      description="Official vehicle registration document"
                      id={ambulance.ambulancercno}
                    />
                    <DocumentCard
                      title="PUC Certificate"
                      src={ambulance.puc}
                      description="Pollution Under Control certificate"
                      id={"PUC-" + (ambulance.ambulancercno || "Unknown")}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location & Coverage
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h4 className="font-medium mb-4">Current Location</h4>
                      {ambulance.latitude && ambulance.longitude ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">
                              {ambulance.latitude.toFixed(6)},{" "}
                              {ambulance.longitude.toFixed(6)}
                            </span>
                          </div>
                          <Button
                            className="w-full gap-2"
                            onClick={() => {
                              const url = `https://www.google.com/maps/search/?api=1&query=${ambulance.latitude},${ambulance.longitude}`;
                              window.open(url, "_blank");
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            View on Google Maps
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Location not available
                          </p>
                        </div>
                      )}
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-medium mb-4">Service Coverage</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Primary Area:
                          </span>
                          <span className="text-sm font-medium">
                            {ambulance.ambulanceareapincode || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Coverage Radius:
                          </span>
                          <span className="text-sm font-medium">25 km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Response Time:
                          </span>
                          <span className="text-sm font-medium">
                            8-12 minutes
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          <div className="xl:col-span-1 space-y-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{ambulance.ambulancecharges || "0"}
                </div>
                <div className="text-sm text-muted-foreground">Per KM</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">
                    {ambulance.ambulanceareapincode || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Service Area
                  </div>
                </div>
              </div>
            </Card>

            <AddAmbulanceVehicleDialog
              ambulanceId={ambulance.id}
              ambulance={ambulance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Detail Card Component
function DetailCard({ icon, label, value, bgColor = "bg-gray-50" }) {
  return (
    <div
      className={`rounded-xl border p-4 ${bgColor} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {label}
          </h4>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// Enhanced Image Card Component
function ImageCard({ src, alt, label, description }) {
  return (
    <div className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted/10">
        {src ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="mt-3">
        <h4 className="font-medium text-sm">{label}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

// Enhanced Document Card Component
function DocumentCard({ title, src, description, id }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            {id && (
              <p className="text-xs text-muted-foreground mt-1">ID: {id}</p>
            )}
          </div>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full">
        {src ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              Document not available
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Upload Document
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// Helper function to check if ambulance has any images
function hasAmbulanceImages(ambulance) {
  return !!(
    ambulance.ambulanceimagefront ||
    ambulance.ambulanceimageright ||
    ambulance.ambulanceimageback ||
    ambulance.ambulanceimageleft ||
    ambulance.ambulanceimageinternal
  );
}
