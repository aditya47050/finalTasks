'use client';
import { useState } from 'react';
import { ChevronDown, Filter, Grid3X3, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MobileFilters({ filteredDiseases, sections, char }) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="md:hidden mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">Filters & Categories</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="space-y-4">
            {/* Disease Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disease Categories
              </label>
              <Select
                onValueChange={(val) => {
                  const element = document.getElementById(
                    val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                  );
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    setShowFilters(false);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a disease category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDiseases.map((item, index) => (
                    <SelectItem key={index} value={item.title}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Specialties
              </label>
              <Select
                onValueChange={(val) => {
                  const element = document.getElementById(
                    val.toLowerCase().replace(/\s+/g, "-")
                  );
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    setShowFilters(false);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a medical specialty" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
