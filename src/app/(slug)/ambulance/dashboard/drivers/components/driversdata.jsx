"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  User,
  ChevronRight,
  Filter,
  Calendar,
  Droplets,
  MapPin,
  CheckCircle,
  CreditCard,
  FileText,
  Phone,
  ChevronUp,
  ChevronDown,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AddAmbulanceDriverDialog } from "./addorEditdrivers";
import HeadingClientMain from "@/app/components/heading";

export default function AllAmbulanceDrivers({ drivers ,ambulances }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredDrivers = drivers.filter((driver) => {
    const query = searchQuery.toLowerCase();
    return (
      driver.firstname?.toLowerCase().includes(query) ||
      driver.lastname?.toLowerCase().includes(query) ||
      driver.mobile?.toLowerCase().includes(query) ||
      driver.aadharcardno?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <HeadingClientMain main={"Drivers Details"} sub="" />
       
        

      <Card className="bg-white">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search drivers..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
              <AddAmbulanceDriverDialog ambulances={ambulances} />
        
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl  overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Mobile
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Aadhar No.
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                     First Aid Training
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No drivers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          {driver.photo ? (
                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={driver.photo || "/placeholder.svg"}
                                alt={driver.firstname || "Driver"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            {driver.firstname} {driver.lastname}
                          </div>
                          <div className="text-sm text-muted-foreground sm:hidden">
                            {driver.mobile}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {driver.mobile || "N/A"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {driver.aadharcardno || "N/A"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={
                              driver.firstaidtraining ? "outline" : "secondary"
                            }
                            className={
                              driver.firstaidtraining
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }
                          >
                            {driver.firstaidtraining
                              ? "First Aid Trained"
                              : "Basic Training"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 rounded-xl"
                            onClick={() => {
                              setSelectedDriver(driver);
                              setIsDialogOpen(true);
                            }}
                          >
                            <span className="hidden sm:inline">View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]  overflow-hidden bg-white">
         
          <div className="px-0 py-4 max-h-[80vh] overflow-y-auto">
            <DriverDetails driver={selectedDriver} ambulances={ambulances} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DriverDetails({ driver , ambulances }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!driver) return null;

  return (
    <Card className="w-full shadow-sm ">
      <CardHeader className=" pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-primary" />
       
          {driver.firstname && driver.lastname && (
            <span className="hidden sm:inline">
              {driver.firstname} {driver.lastname}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 px-6">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Personal Details
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="contact"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"

            >
              Contact Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="p-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Profile Photo
                  </h3>
                  <div className="relative aspect-square  w-full max-w-[250px] mx-auto rounded-xl overflow-hidden border bg-muted/10">
                    {driver.photo ? (
                      <Image
                        src={driver.photo || "/placeholder.svg"}
                        alt={`${driver.firstname || ""} ${
                          driver.lastname || ""
                        }`}
                     width={1250}
                        height={1250}
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem
                      icon={<User className="h-4 w-4 text-primary" />}
                      label="Full Name"
                      value={
                        `${driver.firstname || ""} ${driver.middlename || ""} ${
                          driver.lastname || ""
                        }`.trim() || "N/A"
                      }
                    />

                    <InfoItem
                      icon={<Calendar className="h-4 w-4 text-primary" />}
                      label="Date of Birth"
                      value={driver.dateofbirth || "N/A"}
                    />

                    <InfoItem
                      icon={<User className="h-4 w-4 text-primary" />}
                      label="Gender"
                      value={driver.gender || "N/A"}
                    />

                    <InfoItem
                      icon={<Droplets className="h-4 w-4 text-primary" />}
                      label="Blood Group"
                      value={driver.bloodgroup || "N/A"}
                    />

                    <InfoItem
                      icon={<MapPin className="h-4 w-4 text-primary" />}
                      label="Pincode"
                      value={driver.pincode || "N/A"}
                    />

                    <InfoItem
                      icon={<CheckCircle className="h-4 w-4 text-primary" />}
                      label="First Aid Training"
                      value={driver.firstaidtraining ? "Yes" : "No"}
                      valueClassName={
                        driver.firstaidtraining
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    ID Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem
                      icon={<CreditCard className="h-4 w-4 text-primary" />}
                      label="Aadhar Card No."
                      value={driver.aadharcardno || "N/A"}
                    />

                    <InfoItem
                      icon={<CreditCard className="h-4 w-4 text-primary" />}
                      label="PAN No."
                      value={driver.panno || "N/A"}
                    />

                    <InfoItem
                      icon={<FileText className="h-4 w-4 text-primary" />}
                      label="Driving License"
                      value={driver.drivinglicence || "N/A"}
                    />
                  </div>
                </div>
              </div>
            </div>
            
             <AddAmbulanceDriverDialog ambulances={ambulances} driverId={driver.id}   driverData={driver} />
          </TabsContent>

          <TabsContent value="documents" className="p-6 pt-4">
            <div className="space-y-6">
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Identity Documents
                  </h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentCard
                      title="Aadhar Card Front"
                      src={driver.aadharcardfront}
                      id={driver.aadharcardno}
                    />

                    <DocumentCard
                      title="Aadhar Card Back"
                      src={driver.aadharcardback}
                      id={driver.aadharcardno}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Professional Documents
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DocumentCard
                    title="PAN Card"
                    src={driver.panfront}
                    id={driver.panno}
                  />

                  <DocumentCard
                    title="Driving License"
                    src={driver.drivinglicencefront}
                    id={driver.drivinglicence}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="p-6 pt-4">
            <div className="space-y-6">
              <h3 className="font-medium text-sm text-muted-foreground">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-xl border p-4 bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Primary Mobile</h4>
                      <p className="text-sm text-muted-foreground">
                        Main contact number
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-medium">
                    {driver.mobile || "N/A"}
                  </p>
                  {driver.mobile && (
                    <Button variant="outline" size="sm" className="mt-2 gap-2">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  )}
                </div>

                <div className="rounded-xl border p-4 bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Alternate Mobile</h4>
                      <p className="text-sm text-muted-foreground">
                        Secondary contact
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-medium">
                    {driver.alternatemobileno || "N/A"}
                  </p>
                  {driver.alternatemobileno && (
                    <Button variant="outline" size="sm" className="mt-2 gap-2">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  )}
                </div>

                <div className="rounded-xl border p-4 bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Address</h4>
                      <p className="text-sm text-muted-foreground">
                        Electronic mail
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-medium">{driver.email || "N/A"}</p>
                  {driver.email && (
                    <Button variant="outline" size="sm" className="mt-2 gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Helper component for displaying info items
function InfoItem({ icon, label, value, valueClassName = "" }) {
  return (
    <div className="rounded-xl border p-3 bg-muted/10 hover:bg-muted/20 transition-colors">
      <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
        {icon} {label}
      </h4>
      <p className={`text-sm font-medium ${valueClassName}`}>{value}</p>
    </div>
  );
}

// Helper component for displaying document cards
function DocumentCard({ title, src, id }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="p-3 bg-muted/10 border-b">
        <h4 className="font-medium text-sm">{title}</h4>
        {id && <p className="text-xs text-muted-foreground mt-1">ID: {id}</p>}
      </div>
      <div className="relative aspect-[3/2] w-full">
        {src ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10">
            <FileText className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              Document not available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
