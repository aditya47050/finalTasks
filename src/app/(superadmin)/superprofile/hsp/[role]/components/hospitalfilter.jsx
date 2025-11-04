"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, SelectField, DateFilter } from "@/app/components/input-selectui";
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from "date-fns";

export default function HospitalFilters({ filters, onFilterChange, states, districts, talukas, specialities, bedCategories }) {
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (field, value) => {
    onFilterChange(field, value);
  };

  const handleDateChange = (field, date) => {
    onFilterChange(field, date ? format(date, "yyyy-MM-dd") : "");
  };

  const clearAllFilters = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = key.includes("all") ? "all" : "";
      return acc;
    }, {});
    Object.keys(clearedFilters).forEach(key => {
      onFilterChange(key, clearedFilters[key]);
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== "all" && value !== "").length;
  };

  return (
    <div className="container mx-auto  !mt-0">
      <Card className="border-none">
     
          <div className="flex items-center justify-between my-4">
            <CardTitle className="flex items-center gap-2 text-black">
             
            </CardTitle>
            <div className="flex gap-2">
              {getActiveFilterCount() > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hover:text-blue-600 border-blue-200 bg-blue-500 hover:bg-blue-500 text-white hover:text-white rounded-xl "
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
      
        
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Basic Information */}
              <InputField
                label="Email"
                id="email"
                type="email"
                placeholder="Filter by email"
                value={filters.email}
                onChange={handleInputChange}
              />

              <InputField
                label="Mobile"
                id="mobile"
                type="text"
                placeholder="Filter by mobile"
                value={filters.mobile}
                onChange={handleInputChange}
              />

              <InputField
                label="Pincode"
                id="pincode"
                type="text"
                placeholder="Filter by pincode"
                value={filters.pincode}
                onChange={handleInputChange}
              />

              <SelectField
                label="Hospital Type"
                id="role"
                value={filters.role}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "Hospital", label: "Hospital" },
                  { value: "Clinic", label: "Clinic" },
                  { value: "homehealthcare", label: "Home Healthcare" },
                  { value: "Pathology", label: "Pathology" },
                  { value: "DiagnosticCenter", label: "Diagnostic Center" },
                ]}
              />

              {/* Date Filters */}
              <DateFilter
                label="Created From"
                id="createdAtFrom"
                selected={filters.createdAtFrom}
                onChange={handleDateChange}
              />

              <DateFilter
                label="Created To"
                id="createdAtTo"
                selected={filters.createdAtTo}
                onChange={handleDateChange}
              />

              {/* Hospital Information */}
              <InputField
                label="Registration Name"
                id="regname"
                type="text"
                placeholder="Filter by registration name"
                value={filters.regname}
                onChange={handleInputChange}
              />

              {/* Services */}
              <SelectField
                label="Online Consultation"
                id="onlineconsultation"
                value={filters.onlineconsultation}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="Home Healthcare"
                id="homehealthcare"
                value={filters.homehealthcare}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="Pharmacy"
                id="pharmacy"
                value={filters.pharmacy}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="Pathology"
                id="pathology"
                value={filters.pathology}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="Diagnostic Services"
                id="diagnosticservices"
                value={filters.diagnosticservices}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="Cashless Services"
                id="cashlessservices"
                value={filters.cashlessservices}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="Government Schemes"
                id="governmentschemes"
                value={filters.governmentschemes}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="In-house Canteen"
                id="inhousecanteen"
                value={filters.inhousecanteen}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              {/* Quality Certifications */}
              <SelectField
                label="NABH/NABL Approved"
                id="nabhnablapproved"
                value={filters.nabhnablapproved}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              <SelectField
                label="ISO Approved"
                id="isoapproved"
                value={filters.isoapproved}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />

              {/* Location */}
              <InputField
                label="City"
                id="city"
                type="text"
                placeholder="Filter by city"
                value={filters.city}
                onChange={handleInputChange}
              />

              <SelectField
                label="State"
                id="state"
                value={filters.state}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All States" },
                  ...states?.map((state) => ({
                    value: state.stateName,
                    label: state.stateName,
                  })),
                ]}
              />

              <SelectField
                label="District"
                id="dist"
                value={filters.dist}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All Districts" },
                  ...districts?.map((district) => ({
                    value: district.district,
                    label: district.district,
                  })),
                ]}
              />

              <SelectField
                label="Taluka"
                id="taluka"
                value={filters.taluka}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All Talukas" },
                  ...talukas?.map((taluka) => ({
                    value: taluka.subDistrict,
                    label: taluka.subDistrict,
                  })),
                ]}
              />

              <SelectField
                label="Speciality"
                id="speciality"
                value={filters.speciality}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All Specialities" },
                  ...specialities?.map((speciality) => ({
                    value: speciality.title,
                    label: speciality.title,
                  })),
                ]}
              />

              <SelectField
                label="Bed Category"
                id="bedCategory"
                value={filters.bedCategory}
                onChange={handleInputChange}
                options={[
                  { value: "all", label: "All Categories" },
                  ...bedCategories?.map((category) => ({
                    value: category.name,
                    label: category.name,
                  })),
                ]}
              />

              {/* Doctor Information */}
              <InputField
                label="Doctor First Name"
                id="doctorFirstName"
                type="text"
                placeholder="Filter by doctor first name"
                value={filters.doctorFirstName}
                onChange={handleInputChange}
              />

              <InputField
                label="Doctor Last Name"
                id="doctorLastName"
                type="text"
                placeholder="Filter by doctor last name"
                value={filters.doctorLastName}
                onChange={handleInputChange}
              />

              {/* Ambulance Information */}
              <InputField
                label="Ambulance Category"
                id="ambulanceCategory"
                type="text"
                placeholder="Filter by ambulance category"
                value={filters.ambulanceCategory}
                onChange={handleInputChange}
              />

              {/* Banking Information */}
              <InputField
                label="Bank Name"
                id="bankName"
                type="text"
                placeholder="Filter by bank name"
                value={filters.bankName}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}