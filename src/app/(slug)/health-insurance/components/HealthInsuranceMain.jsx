"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown, 
  Briefcase, 
  GraduationCap, 
  Search, 
  Shield, 
  Building2, 
  Users, 
  Star,
  Filter,
  ChevronDown,
  Heart,
  FileText,
  Award,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { FaArrowCircleDown, FaShieldAlt, FaHospital } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HealthInsuranceMain = ({ government, privateIns, tpa, tpaAdmin,stateList, districtList, subdistrictList }) => {
  const [searchQuery, setSearchQuery] = useState("");
//   const [filteredDoctors, setFilteredDoctors] = useState(doctordetails);
  const [visibledoctors, setVisibledoctors] = useState(9);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
    const [states] = React.useState(stateList);
  const [dist] = React.useState(districtList);
  const [subdist] = React.useState(subdistrictList);

  const [filteredDistricts, setFilteredDistricts] = React.useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);
const router = useRouter();
  // Function to load more doctors when "View More" is clicked
  const handleViewMore = () => {
    setVisibledoctors(visibledoctors + 8); // Increase the number of visible doctors
  };

  // Filter function to filter doctors based on search query
//   const handleFilter = () => {
//     const filtered = doctordetails.filter((item) => {
//       return item.firstName.toLowerCase().includes(searchQuery.toLowerCase()); // Filter based on hospital name
//     });
//     setFilteredDoctors(filtered); // Update filtered doctors
//   };
const handleChange = (e) => {
  const id = e.target.value;
  const category = e.target.selectedOptions[0].getAttribute("data-category");

  if (id && category) {
    router.push(`/health-insurance/${id}?category=${category}`);
  }
};

console.log(government, privateIns, tpa, tpaAdmin );


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/20 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Health Insurance
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the perfect health insurance plan that suits your needs and budget. 
              Compare government, private, and TPA insurance options.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side: Filters */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg rounded-2xl sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <Filter className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Search Filters</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search Insurance</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search insurance plans..."
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Insurance Name</label>
                    <input
                      type="text"
                      className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter insurance name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Insurance Company</label>
                    <div className="relative">
                      <select className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                        <option value="">Select Company</option>
                        <option value="company1">Company 1</option>
                        <option value="company2">Company 2</option>
                        <option value="company3">Company 3</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Insurance Type</label>
                    <div className="relative">
                      <select className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                        <option value="">Select Type</option>
                        <option value="individual">Individual</option>
                        <option value="family">Family</option>
                        <option value="group">Group</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Budget Range</label>
                    <div className="relative">
                      <select className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                        <option value="">Select Range</option>
                        <option value="0-5000">₹0 - ₹5,000</option>
                        <option value="5000-10000">₹5,000 - ₹10,000</option>
                        <option value="10000-25000">₹10,000 - ₹25,000</option>
                        <option value="25000+">₹25,000+</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Coverage Type</label>
                    <div className="relative">
                      <select className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                        <option value="">Select Coverage</option>
                        <option value="basic">Basic</option>
                        <option value="comprehensive">Comprehensive</option>
                        <option value="premium">Premium</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-lg transition-colors">
                    <Search className="h-4 w-4 mr-2" />
                    Search Insurance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Insurance Cards */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Insurance Plans</h2>
              <p className="text-gray-600">Choose from government, private, and TPA insurance options</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Government Health Insurance Card */}
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-500/10 rounded-full">
                      <Building2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Government Health Insurance</h3>
                      <p className="text-sm text-gray-600">Affordable government schemes</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Government backed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Heart className="h-4 w-4 text-green-500" />
                      <span>Comprehensive coverage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4 text-green-500" />
                      <span>Subsidized rates</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <select
                      className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                      onChange={handleChange}
                    >
                      <option value="">Select Government Insurance</option>
                      {government?.map((pkg) => (
                        <option
                          key={pkg.id}
                          value={`${pkg.id}`} 
                          data-category={pkg.category}
                        >
                          {pkg.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>


              {/* Private Health Insurance Card */}
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Private Health Insurance</h3>
                      <p className="text-sm text-gray-600">Premium private insurance plans</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span>Premium coverage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Family plans available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Quick claim processing</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <select
                      className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      onChange={handleChange}
                    >
                      <option value="">Select Private Insurance</option>
                      {privateIns?.map((pkg) => (
                        <option
                          key={pkg.id}
                          value={`${pkg.id}`} 
                          data-category={pkg.category}
                        >
                          {pkg.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
              {/* TPA Health Insurance Card */}
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-full">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">TPA Health Insurance</h3>
                      <p className="text-sm text-gray-600">Third Party Administrator services</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4 text-purple-500" />
                      <span>Network hospitals</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-purple-500" />
                      <span>24/7 support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span>Cashless treatment</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <select
                      className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                      onChange={handleChange}
                    >
                      <option value="">Select TPA Insurance</option>
                      {tpa?.map((tpaItem) => (
                        <option
                          key={tpaItem.id}
                          value={`${tpaItem.id}`}  
                          data-category={tpaItem.category}
                        >
                          {tpaItem.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* TPA Administration Services Card */}
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-full">
                      <GraduationCap className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">TPA Administration Services</h3>
                      <p className="text-sm text-gray-600">Professional administration support</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span>Expert administration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-orange-500" />
                      <span>Documentation support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4 text-orange-500" />
                      <span>Quality assurance</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <select
                      className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
                      onChange={handleChange}
                    >
                      <option value="">Select Service</option>
                      {tpaAdmin.map((service) => (
                        <option
                          key={service.id}
                          value={service.id}
                          data-category={service.category}
                        >
                          {service.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsuranceMain;
