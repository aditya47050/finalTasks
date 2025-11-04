"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Phone, Mail } from "lucide-react";
import HospitalDoctorForm from "./add-inhouse-doctors";
import HeadingClientMain from "@/app/components/heading";
import Image from "next/image";

export default function HospitalDoctorsList({
  hospitalId,
  hospitalDoctors = [],
  specialties,
  doctors,
}) {
  const [filteredDoctors, setFilteredDoctors] = useState(hospitalDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  // Search and filter doctors
  useEffect(() => {
    let filtered = hospitalDoctors;

    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        `${doctor.doctor.firstName} ${doctor.doctor.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, hospitalDoctors]);

  return (
    <div className="mx-auto  space-y-6">
      <HeadingClientMain main="Hospital Doctors" sub="Manage doctors" />
      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        <Tabs defaultValue="grid" className="w-[180px]" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
        <HospitalDoctorForm
          hospitalId={hospitalId}
          specialties={specialties}
          doctors={doctors}
        />
      </div>

      {/* Doctors List */}
      {filteredDoctors.length > 0 ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map(({ doctor, status }) => (
                <Card key={doctor.id} className="p-1 border hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <div className="flex items-center gap-4 p-0 border-b last:border-none">
                        {/* Doctor Image */}
                        <Image
                          src={
                            doctor.doctorinfo?.passportphoto ||
                            "/default-avatar.png"
                          }
                          width={400}
                          height={400}
                          alt={`${doctor.firstName} ${doctor.lastName}`}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        {/* Doctor Details */}
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-medium">
                            {doctor.firstName[0].toUpperCase() + doctor.firstName.slice(1)} {doctor.lastName}
                          </span>

                          <span className="text-xs truncate text-gray-500">
                            {doctor.DoctorCertificate?.[0]?.cardNo ||
                              "No Card No"}
                          </span>
                          <span className="text-xs mt-1 font-semibold">
                            Status:{" "}
                            <span
                              className={
                                status === "APPROVED"
                                  ? "text-green-600"
                                  : status === "PENDING"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }
                            >
                              {status || "PENDING"}
                            </span>
                          </span>
                        </div>{" "}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="mb-2">
                      {doctor.specialities
                        .map((s) => s.speciality.title)
                        .join(", ")}
                    </p>
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{doctor.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {doctor.mobile}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 text-white">
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map(({ doctor }) => (
                <Card key={doctor.id} className="p-4 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-4 p-2 border-b last:border-none">
                        {/* Doctor Image */}
                        <Image
                          src={
                            doctor.doctorinfo?.passportphoto ||
                            "/default-avatar.png"
                          }
                          width={400}
                          height={400}
                          alt={`${doctor.firstName} ${doctor.lastName}`}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        {/* Doctor Details */}
                        <div className="flex flex-col flex-1">
                          <span className="text-sm font-medium">
                            {doctor.firstName} {doctor.lastName}
                          </span>
                          <span className="text-xs truncate text-gray-500">
                            {doctor.DoctorCertificate?.[0]?.cardNo ||
                              "No Card No"}
                          </span> <span> <p className="text-sm text-muted-foreground">
                            {doctor.specialities
                              .map((s) => s.speciality.title)
                              .join(", ")}
                          </p></span>
                        </div>{" "}
                      </div>

                    </div>
                    <Button className="bg-blue-600 text-white">
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No doctors found</h3>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm
              ? `No results found for "${searchTerm}".`
              : "No doctors assigned yet."}
          </p>
        </div>
      )}
    </div>
  );
}
