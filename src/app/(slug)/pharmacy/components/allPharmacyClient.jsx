"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FaArrowCircleDown, FaHospitalAlt, FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

const productCategories = [
  { id: "1", title: "Pain Relief" },
  { id: "2", title: "Vitamins" },
];

const homeDeliveryService = [
  { id: "1", name: "Available" },
  { id: "2", name: "Not Available" },
];

const NearbyPharma = ["Within 1km", "Within 5km", "Within 10km"];

const PharmacyMainClient = ({pharmacyList,productList ,stateList, districtList, subdistrictList}) => {
    const [states] = React.useState(stateList);
      const [dist] = React.useState(districtList);
      const [subdist] = React.useState(subdistrictList);
    
      const [filteredDistricts, setFilteredDistricts] = React.useState([]);
      const [filteredSubDistricts, setFilteredSubDistricts] = React.useState([]);
    
      const [member, setMember] = React.useState({
        state: "",
        district: "",
        taluka: "",
      });
    
      const [errors, setErrors] = React.useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [filteredPharmacy, setFilteredPharmacy] = useState(pharmacyList);
    const [visibleBeds, setVisibleBeds] = useState(6);  
    const [searchQuery, setSearchQuery] = useState("");
    const [onlinePharmacyProvider, setOnlinePharmacyProvider] = useState("");
    const [pharmacyName, setPharmacyName] = useState("");
    const [hospitalCategory, setHospitalCategory] = useState("");
    const [typeOfHospital, setTypeOfHospital] = useState("");
    const [bedType, setBedType] = useState("");
    const [nearByPharma, setNearByPharma] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState("");

    const handleSearch = (e) => setSearchQuery(e.target.value);
    const handleViewMore = () => {
      setVisibleBeds(visibleBeds + 3);
    };
    const clearFilters = () => {
      setSearchQuery("");
      setOnlinePharmacyProvider("");
      setPharmacyName("");
      setHospitalCategory("");
      setTypeOfHospital("");
      setBedType("");
      setNearByPharma("");
      setCity("");
      setPincode("");
    };
   const handleFilter = () => {
  const filtered = productList
    .map((product) => {
      const matchedProviders = product.providers.filter((provider) => {
        const providerMatch = selectedProvider
          ? provider.name.toLowerCase().includes(selectedProvider.toLowerCase())
          : true;
        const searchMatch = searchQuery
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        return providerMatch && searchMatch;
      });

      return matchedProviders.length
        ? { ...product, providers: matchedProviders }
        : null;
    })
    .filter(Boolean);

  setFilteredPharmacy(filtered);
  setIsFiltered(true);
};
const handleChange = (event) => {
  const { name, value } = event.target ?? event;

  if (name === "state") {
    const selectedState = stateList.find((s) => s.stateName === value);

    const filteredDistricts = districtList.filter(
      (d) => d.stateId === selectedState?.id
    );

    setFilteredDistricts(filteredDistricts);
    setFilteredSubDistricts([]);

    setMember((prev) => ({
      ...prev,
      state: selectedState?.stateName || "",
      district: "",
      taluka: "",
    }));
  }

  else if (name === "district") {
    const selectedDistrict = districtList.find((d) => d.district === value);

    const filteredSubdistricts = subdistrictList.filter(
      (sd) => sd.districtId === selectedDistrict?.id
    );

    setFilteredSubDistricts(filteredSubdistricts);

    setMember((prev) => ({
      ...prev,
      district: selectedDistrict?.district || "",
      taluka: "",
    }));
  }

  else if (name === "taluka") {
    setMember((prev) => ({
      ...prev,
      taluka: value
    }));
  }

  else {
    setMember((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Remove undefined validateField, just clear error for now
  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

useEffect(() => {
  handleFilter();
  setIsFiltered(false);
}, [
  searchQuery,
  onlinePharmacyProvider,
  pharmacyName,
  city,
  pincode,
  hospitalCategory,
  typeOfHospital,
  nearByPharma,
  selectedProvider, // add this
]);


    const PharmacyCard = ({ item }) => (
    <Card className="h-full xs:min-h-[100px] md:min-h-[300px] flex flex-col  overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-white rounded-3xl">
        <CardContent className="p-0 flex flex-col flex-grow justify-between">
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-t-3xl">
            <Link href="#">
                {item.image ? (
                <Image
                    src={item.image}
                    width={400}
                    height={240}
                    alt={item.name || "Bed"}
                    className="w-full h-48 xs:h-36 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                ) : (
                <div className="w-full md:h-48 xs:h-36 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center">
                    <FaHospitalAlt className="w-12 h-12 text-white/50" />
                </div>
                )}
            </Link>
            </div>
            
        

            {/* Content */}
            <div className="xs:p-2 md:p-6 text-center flex flex-col items-center justify-center flex-1">
              <Link href="#">
                <div className="mb-4 cursor-pointer">
                  <h3 className="font-bold xs:text-[15px] md:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#5271FF] transition-colors">
                    {item.name}
                  </h3>
                </div>
              </Link>

              {/* Rating and Reviews */}
              <div className="flex xs:flex-col md:flex-row items-center justify-center gap-2 mb-4">
                <div className="flex items-center text-yellow-500 xs:text-xs md:text-sm">
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar
                      key={index}
                      className={`h-4 w-4 ${
                        index < item.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({item.reviews} Reviews)</span>
              </div>
            </div>
        </CardContent>
    </Card>

  );
  const ProductCard = ({ product, provider }) => (
  <Card className="h-full xs:min-h-[80px] md:min-h-[300px] flex flex-col  overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-white rounded-3xl">
    <CardContent className="p-0 flex flex-col flex-grow justify-between">
      <div className="relative overflow-hidden rounded-t-3xl">
            <Link href="#">
                {product.image ? (
                <Image
                    src={item.image}
                    width={400}
                    height={240}
                    alt={item.name || "Bed"}
                    className="w-full h-48 xs:h-36 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                ) : (
                <div className="w-full md:h-48 xs:h-28 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center">
                    <FaHospitalAlt className="w-12 h-12 text-white/50" />
                </div>
                )}
            </Link>
            </div>
            <div className="xs:p-2 md:p-6 text-center flex flex-col items-center justify-center flex-1">
              <h3 className="font-bold xs:text-[12px] md:text-lg text-gray-800 mb-1">{product.name}</h3>
            <p className="text-xs md:text-sm text-gray-600">Price: ₹{provider.price}</p>
              <p className="text-xs md:text-sm text-green-600">Discount: {provider.discount}</p>
              <div className="mb-2 border-t pt-2">
                <p className="text-xs md:text-sm text-gray-700 font-semibold">{(provider.name)}</p>
              </div>
              <Button className="mt-4 xs:text-[10px] xs:!mt-0 md:text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                Order Now
              </Button>
            </div>
    </CardContent>
  </Card>
);



    return (
        <div className="md:min-h-screen md:container lg:pl-[40px] lg:pr-[50px] xl:px-[60px] xlg:container ">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-[20px] md:text-[25px] text-[#5271FF] font-bold">
              Pharmacy
            </h1>
            <p className="text-[14px] md:text-[15px] text-blue-500 mb-4">
              {isFiltered && filteredPharmacy.length > 0
                ? filteredPharmacy[0]?.name || "Partner Pharmacy Service Providers"
                : "Partner Pharmacy Service Providers"}
            </p>

          </div>

          <div className="flex xs:justify-center min-[900px]:justify-end  mt-1 gap-2">
          <Select onValueChange={setSelectedProvider} className="">
            <SelectTrigger className="border-blue-600 !text-[#5271FF] font-poppins !placeholder:text-[#5271FF] !w-40 font-bold">
              <SelectValue placeholder="Select Provider" />
            </SelectTrigger>
            <SelectContent>
             {Array.from(new Set(pharmacyList.map((p) => p.name))).map((prov) => (
  <SelectItem key={prov} value={prov}>
    {prov}
  </SelectItem>
))}

            </SelectContent>
          </Select>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-blue-600 text-blue-600 rounded-xl"
            >
              Filters <Badge className="bg-blue-600 text-white">12</Badge>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {showFilters && (
          <div className="absolute xs:top-[15rem] min-[500px]:top-[16rem] left-[20%] z-10 xs:w-[60%] p-4 bg-[#D9D9D9] min-[900px]:static min-[900px]:z-0  min-[900px]:w-72 min-[1000px]:h-full rounded-xl mb-2">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-[#243460]">All Filters</span>
              <Button
                onClick={clearFilters}
                variant="ghost"
                className="text-red-600 p-0 h-6"
              >
                Clear
              </Button>
            </div>

            <div className="space-y-4">
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="Enter Product Name"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="Online Pharmacy Provider"
                  value={onlinePharmacyProvider}
                  onChange={(e) => setOnlinePharmacyProvider(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="Enter Pharmacy Name"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <div className="mb-2 relative">
                <select
                  name="hospitalCategory"
                  value={hospitalCategory}
                  onChange={(e) => setHospitalCategory(e.target.value)}
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                >
                  <option value="" className="bg-gray-50 text-[#453565]">Product Category</option>
                  {productCategories.map((cat) => (
                    <option key={cat.id} value={cat.title} className="bg-gray-50 text-[#453565]">
                      {cat.title}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <select
                  name="typeOfHospital"
                  value={typeOfHospital}
                  onChange={(e) => setTypeOfHospital(e.target.value)}
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                >
                  <option value="" className="bg-gray-50 text-[#453565]">Type of Pharmacy</option>
                  <option value="private" className="bg-gray-50 text-[#453565]">Private</option>
                  <option value="government" className="bg-gray-50 text-[#453565]">Government</option>
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <select
                  name="bedType"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                >
                  <option value="" className="bg-gray-50 text-[#453565]">Home Delivery Service</option>
                  {homeDeliveryService.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-gray-50 text-[#453565]">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <select
                  name="nearByPharma"
                  value={nearByPharma}
                  onChange={(e) => setNearByPharma(e.target.value)}
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                >
                  <option value="" className="bg-gray-50 text-[#453565]">Nearby Pharmacies</option>
                  {NearbyPharma.map((scheme) => (
                    <option key={scheme} value={scheme} className="bg-gray-50 text-[#453565]">
                      {scheme}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <select
                  name="state"
                  value={member.state}
                  onChange={handleChange}
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  required
                >
                  <option value="" className="bg-gray-50 text-[#453565]">Select State</option>
                  {stateList.map((s) => (
                    <option key={s.id} value={s.stateName} className="bg-gray-50 text-[#453565]">
                      {s.stateName}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <select
                  name="district"
                  value={member.district}
                  onChange={handleChange}
                  disabled={!filteredDistricts.length}
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none disabled:opacity-50"
                  required
                >
                  <option value="" className="bg-gray-50 text-[#453565]">Select District</option>
                  {filteredDistricts.map((d) => (
                    <option key={d.id} value={d.district} className="bg-gray-50 text-[#453565]">
                      {d.district}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <select
                  name="taluka"
                  value={member.taluka}
                  onChange={handleChange}
                  disabled={!filteredSubDistricts.length}
                  className="w-full md:h-10 h-9 p-2 pr-10 md:text-[14px] text-[12px] rounded-full placeholder:pl-2 placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none disabled:opacity-50"
                  required
                >
                  <option value="" className="bg-gray-50 text-[#453565]">Select Taluka</option>
                  {filteredSubDistricts.map((sd) => (
                    <option key={sd.id} value={sd.subDistrict} className="bg-gray-50 text-[#453565]">
                      {sd.subDistrict}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FaArrowCircleDown className="md:h-6 md:w-6 h-4 w-4 text-white rounded-full" />
                </span>
              </div>
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="Enter City Name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <div className="mb-2 relative">
                <Input
                  type="text"
                  placeholder="ENter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="bg-blue-600 text-white placeholder-blue-200 border-0 rounded-full"
                />
              </div>
              <Button
                onClick={handleFilter}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full mt-4"
              >
                Search
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1">
          {isFiltered && filteredPharmacy.length > 0 ? (
  <div className="grid xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 min-[1100px]:grid-cols-3 xl:grid-cols-4 gap-4">
    {filteredPharmacy
      .flatMap((product) =>
        product.providers.map((provider) => ({
          product,
          provider,
        }))
      )
      .slice(0, visibleBeds)
      .map(({ product, provider }, index) => (
        <ProductCard key={index} product={product} provider={provider} />
      ))}
  </div>
) : (
  <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 min-[1100px]:grid-cols-3 xl:grid-cols-4 gap-4">
    {pharmacyList.slice(0, visibleBeds).map((item) => (
      <PharmacyCard key={item.id} item={item} />
    ))}
  </div>
)}

        {filteredPharmacy.length > 6 && (
                    <div className="text-center mt-6">
                      <Button
                        onClick={handleViewMore}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full"
                      >
                        View More
                      </Button>
                    </div>
                  )}
        </div>
      </div>
    </div>
    );
}
export default PharmacyMainClient;