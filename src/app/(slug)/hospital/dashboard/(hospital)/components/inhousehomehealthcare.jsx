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
import { Search, Building2, Phone, Mail, HeartPulse } from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import Image from "next/image";
import InhouseHomeHealthcareForm from "../components/add-inhouse-homehealthcare";

export default function InhouseHomeHealthcareComponent({
  hospitalId,
  homeHealthcareCenters = [],
  allHomeHealthcareCenters = [],
}) {
  const [filteredCenters, setFilteredCenters] = useState(homeHealthcareCenters);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  // 🔍 Search + Filter
  useEffect(() => {
    let filtered = homeHealthcareCenters;

    if (searchTerm) {
      filtered = filtered.filter((center) =>
        center.homeHealthcare.hspInfo.regname
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCenters(filtered);
  }, [searchTerm, homeHealthcareCenters]);

  return (
    <div className="mx-auto space-y-6">
      <HeadingClientMain main="In-House Home Healthcare" sub="Manage your linked home healthcare centers" />

      {/* Search + View Toggle + Add Home Healthcare Form */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search home healthcare centers..."
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

        <InhouseHomeHealthcareForm
          hospitalId={hospitalId}
          allHomeHealthcareCenters={allHomeHealthcareCenters}
        />
      </div>

      {/* Home Healthcare Centers List */}
      {filteredCenters.length > 0 ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCenters.map(({ homeHealthcare }) => (
                <Card key={homeHealthcare.id} className="p-1 border hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-4">
                      <Image
                        src={"/homehealthcare-icon.png"}
                        width={40}
                        height={40}
                        alt="Home Healthcare Center"
                        className="rounded-full object-cover border"
                      />
                      <span>{homeHealthcare.hspInfo.regname}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2 w-full break-words">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="block w-full">{homeHealthcare.email}</span>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span className="block w-full">{homeHealthcare.mobile}</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full bg-green-600 text-white">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCenters.map(({ homeHealthcare }) => (
                <Card key={homeHealthcare.id} className="p-4 border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Image
                        src={"/homehealthcare-icon.png"}
                        width={40}
                        height={40}
                        alt="Home Healthcare Center"
                        className="rounded-full object-cover border"
                      />
                      <div>
                        <p className="text-sm font-medium">{homeHealthcare.hspInfo.regname}</p>
                        <p className="text-xs text-gray-500">{homeHealthcare.email}</p>
                        <p className="text-xs">{homeHealthcare.mobile}</p>
                      </div>
                    </div>
                    <Button className="bg-green-600 text-white">View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <HeartPulse className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No home healthcare centers linked</h3>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm
              ? `No results found for "${searchTerm}".`
              : "You haven’t linked any home healthcare centers yet."}
          </p>
        </div>
      )}
    </div>
  );
}