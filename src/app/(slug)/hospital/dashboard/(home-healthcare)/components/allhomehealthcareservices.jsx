"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  List,
  LayoutGrid,
  Stethoscope,
  Tag,
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
  IndianRupeeIcon,
} from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import HomeHealthcareDialog from "./addhomehealthcareform";

export default function HomeHealthcareServicesList({
  homeHealthcareServices = [],
  hospitalId,
}) {
  const [filteredServices, setFilteredServices] = useState(
    homeHealthcareServices
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  // Search and filter services
  useEffect(() => {
    let filtered = homeHealthcareServices;
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.serviceName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.startingPrice?.toString().includes(searchTerm) ||
          service.minPrice?.toString().includes(searchTerm) ||
          service.maxPrice?.toString().includes(searchTerm)
      );
    }
    setFilteredServices(filtered);
  }, [searchTerm, homeHealthcareServices]);

  return (
    <div className="mx-auto p-4 md:p-8 space-y-6">
      <HeadingClientMain
        main="Home Healthcare Services"
        sub="Manage home healthcare services"
      />
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <HomeHealthcareDialog hospitalId={hospitalId} />
          <Tabs
            defaultValue="grid"
            className="w-full sm:w-[180px]"
            onValueChange={setView}
          >
            <TabsList className="w-full flex flex-wrap">
              <TabsTrigger value="grid" className="flex-1">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="flex-1">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Services List */}
      {filteredServices.length > 0 ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="p-4 border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <CardHeader className="pb-2">
  <CardTitle className="text-lg font-semibold">
    <div className="flex flex-col gap-1">
      <span className="text-base font-medium text-foreground flex items-center gap-2">
        <Home className="h-4 w-4 text-blue-600" />
        {service.serviceName}
      </span>

      {/* Price Section */}
      <div className="flex flex-col items-start gap-2 mt-1">
                        {service.finalprice ? (
                          <>
                            <span className=" text-gray-400 text-sm flex items-center gap-2">
                              <Tag className="h-3.5 w-3.5 text-gray-500" />
                              Starting Price : ₹{service.startingPrice || "N/A"}
                            </span>
                            <div className="flex text-sm gap-1">
                              Final Price :
                              <span className="text-[#5271FF] font-semibold">
                                 ₹{service.finalprice}
                              </span>
                              {service.discount && (
                                <span className="text-green-600 text-sm font-medium">
                                  ({service.discount}% OFF)
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm truncate text-muted-foreground flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-gray-500" />
                            Starting Price: {service.startingPrice || "N/A"}
                          </span>
                        )}
                      </div>
    </div>
  </CardTitle>
</CardHeader>

                  <CardContent className="pt-2 text-sm text-muted-foreground">
                    <p className="mb-1 flex items-center gap-2">
                      {service.isAvailable ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      Available: {service.isAvailable ? "Yes" : "No"}
                    </p>
                    <p className="flex items-center gap-2">
                      <IndianRupeeIcon className="h-4 w-4 text-yellow-600" />
                      Price Range: {service.minPrice || "N/A"} -{" "}
                      {service.maxPrice || "N/A"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="p-4 border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-medium text-foreground flex items-center gap-2">
                        <Home className="h-4 w-4 text-blue-600" />
                        {service.serviceName}
                      </span>
                      {/* Price Section */}
                      <div className="flex flex-col items-start gap-2 mt-1">
                        {service.finalprice ? (
                          <>
                            <span className=" text-gray-400 text-sm flex items-center gap-2">
                              <Tag className="h-3.5 w-3.5 text-gray-500" />
                              Starting Price : ₹{service.startingPrice || "N/A"}
                            </span>
                            <div className="flex gap-1">
                              Discount Price :
                              <span className="text-[#5271FF] font-semibold">
                                 ₹{service.finalprice}
                              </span>
                              {service.discount && (
                                <span className="text-green-600 text-sm font-medium">
                                  ({service.discount}% OFF)
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm truncate text-muted-foreground flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-gray-500" />
                            Starting Price: {service.startingPrice || "N/A"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                        {service.isAvailable ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        Available: {service.isAvailable ? "Yes" : "No"}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <IndianRupeeIcon className="h-4 w-4 text-yellow-600" />
                        Price Range: {service.minPrice || "N/A"} -{" "}
                        {service.maxPrice || "N/A"}
                      </p>
                    </div>
                    {/* You can add a details button or actions here */}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20 max-w-md mx-auto text-center">
          <List className="h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-xl font-semibold mb-2">No services found</h3>
          <p className="text-base text-muted-foreground">
            {searchTerm
              ? `No results found for "${searchTerm}".`
              : "No services available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
