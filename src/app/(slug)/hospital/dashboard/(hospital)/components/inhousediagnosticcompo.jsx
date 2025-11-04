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
import { Search, Building2, Phone, Mail } from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import Image from "next/image";
import InhouseDiagnosticForm from "./add-inhouse-diagnostic";

export default function InhouseDiagnosticComponent({
  hospitalId,
  diagnosticCenters = [],
  allDiagnosticCenters = [],
}) {
  const [filteredCenters, setFilteredCenters] = useState(diagnosticCenters);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  // 🔍 Search + Filter
  useEffect(() => {
    let filtered = diagnosticCenters;

    if (searchTerm) {
      filtered = filtered.filter((center) =>
        center.diagnosticCenter.hspInfo.regname
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCenters(filtered);
  }, [searchTerm, diagnosticCenters]);

  return (
    <div className="mx-auto space-y-6">
      <HeadingClientMain main="In-House Diagnostic Centers" sub="Manage your linked diagnostic centers" />

      {/* Search + View Toggle + Add Diagnostic Form */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search diagnostic centers..."
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

        <InhouseDiagnosticForm
          hospitalId={hospitalId}
          allDiagnosticCenters={allDiagnosticCenters}
        />
      </div>

      {/* Diagnostic Centers List */}
      {filteredCenters.length > 0 ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCenters.map(({ diagnosticCenter }) => (
                <Card key={diagnosticCenter.id} className="p-1 border hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-4">
                      <Image
                        src={"/lab-icon.png"}
                        width={40}
                        height={40}
                        alt="Diagnostic Center"
                        className="rounded-full object-cover border"
                      />
                      <span>{diagnosticCenter.hspInfo.regname}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {diagnosticCenter.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {diagnosticCenter.mobile}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 text-white">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCenters.map(({ diagnosticCenter }) => (
                <Card key={diagnosticCenter.id} className="p-4 border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Image
                        src={"/lab-icon.png"}
                        width={40}
                        height={40}
                        alt="Diagnostic Center"
                        className="rounded-full object-cover border"
                      />
                      <div>
                        <p className="text-sm font-medium">{diagnosticCenter.hspInfo.regname}</p>
                        <p className="text-xs text-gray-500">{diagnosticCenter.email}</p>
                        <p className="text-xs">{diagnosticCenter.mobile}</p>
                      </div>
                    </div>
                    <Button className="bg-blue-600 text-white">View Details</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No diagnostic centers linked</h3>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm
              ? `No results found for "${searchTerm}".`
              : "You haven’t linked any diagnostic centers yet."}
          </p>
        </div>
      )}
    </div>
  );
}
