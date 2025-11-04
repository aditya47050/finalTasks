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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Phone, Mail } from "lucide-react";
import HospitalAmbulanceForm from "./add-inhouse-ambulances";
import HeadingClientMain from "@/app/components/heading";
import { FaAmbulance } from "react-icons/fa";

export default function HospitalAmbulanceList({ hospitalId, ambulances, unassignedAmbulances = [] }) {
  const [filteredAmbulances, setFilteredAmbulances] = useState(ambulances);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  // 🔎 Filter ambulances based on search term
  useEffect(() => {
    let filtered = ambulances;

    if (searchTerm) {
      filtered = filtered.filter(
        (ambulance) =>
          ambulance.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ambulance.mobile.includes(searchTerm)
      );
    }

    setFilteredAmbulances(filtered);
  }, [searchTerm, ambulances]);

  return (
    <div className="mx-auto p-4 md:p-8 space-y-6">
      <HeadingClientMain main="Hospital Ambulances" sub="Manage ambulances" />

      {/* 🔎 Search & View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ambulances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        {/* Toggle between Grid and List View */}
        <Tabs defaultValue="grid" className="w-[180px]" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Add Ambulance Form */}
        <HospitalAmbulanceForm
          hospitalId={hospitalId}
          ambulances={unassignedAmbulances}
        />
      </div>

      {/* 🚑 Display Ambulances */}
      {filteredAmbulances.length > 0 ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAmbulances.map((ambulance) => (
                <Card key={ambulance.id} className="p-2 border hover:shadow-md flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FaAmbulance className="h-5 w-5 text-muted-foreground" />
                      {ambulance.category || "Ambulance"}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    {/* Email */}
                    <p className="flex items-center gap-2 break-all">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate max-w-full">{ambulance.email}</span>
                    </p>

                    {/* Phone */}
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" /> {ambulance.mobile}
                    </p>

                    {/* Status below the number */}
                    <p className="flex items-center gap-2 mt-1">
                      <span className="font-medium">Status:</span>
                      {ambulance.status === "APPROVED" && <span className="text-green-600">●</span>}
                      {ambulance.status === "PENDING" && <span className="text-yellow-600">●</span>}
                      {ambulance.status === "REJECTED" && <span className="text-red-600">●</span>}
                      <span>{ambulance.status || "PENDING"}</span>
                    </p>
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full bg-blue-600 text-white">View Details</Button>
                  </CardFooter>
                </Card>


              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAmbulances.map((ambulance) => (
                <Card key={ambulance.id} className="p-4 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <FaAmbulance className="h-4 w-4 md:h-6 md:w-6 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {ambulance.category || "Ambulance"}
                          </span>
                        </div>

                        <span className="text-xs text-gray-500">
                          <Mail className="h-4 w-4 inline-block mr-1" />{" "}
                          {ambulance.email}
                        </span>
                        <span className="text-xs text-gray-500">
                          <Phone className="h-4 w-4 inline-block mr-1" />{" "}
                          {ambulance.mobile}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-blue-600 text-white">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <FaAmbulance className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No ambulances found</h3>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm
              ? `No results found for "${searchTerm}".`
              : "No ambulances assigned yet."}
          </p>
        </div>
      )}
    </div>
  );
}
