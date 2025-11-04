"use client";
import Mobilenav from "@/app/components/mobilenav";
import NavBar from "@/app/components/nav";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaArrowCircleDown, FaUser } from "react-icons/fa";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const HspClient = () => {
  const pathname = usePathname();

  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation Rules
    if (name === "name" && /\d/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Name should not contain numbers",
      }));
      return;
    }
    if (name === "designation" && /\d/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Designation should not contain numbers",
      }));
      return;
    }
    if (name === "mobile" && (!/^\d{0,10}$/.test(value) || value.length > 10)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Mobile should be exactly 10 digits",
      }));
      return;
    }

 

    // Clear error if valid
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function
  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value.trim()) {
      errorMsg = `${name} is required`;
    } else {
      if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        errorMsg = "Invalid email format";
      }
      if (name === "mobile" && !/^\d{10}$/.test(value)) {
        errorMsg = "Invalid mobile number (10 digits required)";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setErrors({}); // Reset previous errors

    try {
      // Validate fields before sending request
      const newErrors = {};
      Object.keys(formData).forEach((key) => {
        if (!formData[key].trim()) {
          newErrors[key] = `${key} is required`;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setloading(false);
        return;
      }

      const response = await fetch("/api/hspportalenq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors); // Set field-specific validation errors
        } else {
          toast.error(data.message || "Something went wrong");
        }
        setloading(false);
        return;
      }

      toast.success(
        "Form Submitted Successfully! Our team will connect you shortly "
      );
      setloading(false);

      setFormData({
        category: "",
        name: "",
        email: "",
        mobile: "",
        gender: "",
        designation: "",
      });
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Something went wrong! Please try again.");
      setloading(false);
    }
  };

  return (
    <>
      <div className="font-poppins relative z-10 xs:my-4 lg:my-1">
        <div className="container pt-2 hidden lg:block mx-auto  lg:pl-[40px] lg:pr-[50px] xl:pl-[50px] xl:pr-[50px] xl:mx-auto xlg:container">
          <div className="text-center">
            <h1 className="text-[25px] text-[#5271FF] font-extrabold lg:leading-7">
              <span className="">HSP Portal</span>
            </h1>
            <p className="text-[#5271FF] text-[15px]">
              Healthcare Services for HSP
            </p>
          </div>
          <div className="relative mt-2 w-full">
            <Dialog>
              <DialogTrigger>
                <div className="relative w-full">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731825705/22_aukjtd.png"
                    width={4000}
                    height={844}
                    className="w-full h-full rounded-[15px] "
                    alt="Trigger Dialog"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
                <DialogHeader>
                  <DialogDescription>
                  
                      {/* Enquiry Button */}
                      <div className="mb-0 flex text-center items-center justify-center">
                        <button className="relative lg:w-auto bg-gradient-to-r from-[#FFDE59] to-[#FF914D] p-1 text-white rounded-full flex items-center justify-between lg:justify-start">
                          <span className="mr-1 rounded-full">
                            <Image
                              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726912370/Icons/ifjpfg2kziotitq7u14o.png"
                              width={400}
                              height={1200}
                              alt=""
                              className="h-6 w-6 rounded-full"
                            />
                          </span>
                          <span className="flex-grow text-[14px] font-poppins pr-2 font-bold text-[#243460] relative shadow-2xl">
                            Enquiry Now
                          </span>
                        </button>
                      </div>

                    
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                            {/* Category & Name */}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              <div className="relative">
                                <Label className="text-[#243460] font-semibold ">Enter Full Name*</Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                                    <FaUser />
                                  </span>
                                  <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-8"
                                    placeholder="Enter Your Full Name"
                                    required
                                  />
                                </div>
                              </div>
                              {errors.name && (
                                <p className="text-red-500 text-sm">
                                  {errors.name}
                                </p>
                              )}
                            <div>

                              <Label className="text-[#243460] font-semibold ">Enter Designation*</Label>
                              <Input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="pl-4"
                                placeholder="Enter Designation"
                                required
                              />
                              {errors.designation && (
                                <p className="text-red-500 text-sm">
                                  {errors.designation}
                                </p>
                              )}
                              </div>
                            </div>

                            {/* Email & Mobile */}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              <div className="relative">
                              <Label className="text-[#243460] font-semibold ">Enter Email ID*</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                                  <FiMail />
                                </span>
                                <Input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="pl-8"
                                  placeholder="Enter Email ID"
                                  required
                                />
                              </div>
                              </div>
                              {errors.email && (
                                <p className="text-red-500 text-sm">
                                  {errors.email}
                                </p>
                              )}
                              <div className="relative">
                            <Label className="text-[#243460] font-semibold ">Enter Mobile Number*</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                                <FiPhone />
                              </span>
                              <Input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="pl-8"
                                placeholder="Enter Mobile Number"
                                required
                              />
                            </div>
                              </div>
                              {errors.mobile && (
                                <p className="text-red-500 text-sm">
                                  {errors.mobile}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                              <div className="relative">
                                <Label className="text-[#243460] font-semibold ">Select Gender*</Label>
                                <Select
                                  value={formData.gender}
                                  onValueChange={(value) =>
                                    handleChange({ target: { name: "gender", value } })
                                  }
                                >
                                <SelectTrigger className=" pl-4 border-[1px] border-[#243460] text-[14px]">
                                  <SelectValue placeholder="Select Gender" />
                                  
                                </SelectTrigger>
                                <SelectContent className="bg-white text-base text-gray-700">
                                  <SelectItem
                                    value="Male"
                                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                  >
                                    Male
                                  </SelectItem>
                                  <SelectItem
                                    value="Female"
                                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                  >
                                    Female
                                  </SelectItem>
                                  <SelectItem
                                    value="Other"
                                    className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                  >
                                    Other
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                                {errors.category && (
                                  <p className="text-red-500 text-sm">
                                    {errors.category}
                                  </p>
                                )}
                              </div>
                              <div className="relative">
                                <Label className="text-[#243460] font-semibold ">Select Category*</Label>
                                <Select
                                  value={formData.category}
                                  onValueChange={(value) =>
                                    handleChange({ target: { name: "category", value } })
                                  }
                                >
                                  <SelectTrigger className="pl-4 border-[1px] border-[#243460] text-[14px] truncate ">
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white text-base text-gray-700">
                                    {hspportal.map((category, index) => (
                                      <SelectItem
                                        key={index}
                                        value={category.text.trim()} // ✅ Ensure unique, clean value
                                        className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                      >
                                        {category.text.trim()}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {errors.category && (
                                  <p className="text-red-500 text-sm">
                                    {errors.category}
                                  </p>
                                )}
                              </div>
                            </div>

                          {/* Submit Button */}
                          <div className="mt-6 text-center">
                            <Button
                              type="submit"
                              className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                            >
                              {loading ? "Submitting" : "  Submit"}
                            </Button>
                          </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* m */}
        <div className="font-poppins ">
          {" "}
          <div className="container mx-auto lg:hidden block  px-4">
            <div className="text-center mb-0 ">
              <h1 className="text-[20px] text-[#5271FF] font-extrabold  leading-6 lg:leading-6">
                <span className="">HSP Portal</span>
              </h1>
              <p className="text-[#5271FF] text-[14px]  leading-5 lg:leading-6">
                Healthcare Services for HSP
              </p>
            </div>
            <div className="relative mt-0 w-full">
              <Dialog>
                <DialogTrigger>
                  <div className="relative w-full">
                    <Image
                      src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743657794/40_mw7pcf.png"
                      width={4000}
                      height={844}
                      className="w-full h-full rounded-[15px] "
                      alt="Trigger Dialog"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
                  <DialogHeader>
                    <DialogDescription>
                        {/* Enquiry Button */}
                        <div className="mb-6 flex text-center items-center justify-center">
                          <button className="relative lg:w-auto bg-gradient-to-r from-[#FFDE59] to-[#FF914D] p-1 text-white rounded-full flex items-center justify-between lg:justify-start">
                            <span className="mr-1 rounded-full">
                              <Image
                                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726912370/Icons/ifjpfg2kziotitq7u14o.png"
                                width={400}
                                height={1200}
                                alt=""
                                className="h-6 w-6 rounded-full"
                              />
                            </span>
                            <span className="flex-grow text-[14px] font-poppins pr-2 font-bold text-[#243460] relative shadow-2xl">
                              Enquiry Now
                            </span>
                          </button>
                        </div>
                        </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="">
                        {/* Form Fields */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                          {/* Category & Name */}
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="relative">
                              <Label className="text-[#243460] font-semibold ml-2">Enter Full Name*</Label>
                            <Input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-4"
                              placeholder="Enter Your Full Name"
                              required
                            />
                            </div>
                            {errors.name && (
                              <p className="text-red-500 text-sm">
                                {errors.name}
                              </p>
                            )}
                            <div>

                            <Label className="text-[#243460] font-semibold ml-2">Select Designation*</Label>
                            <Input
                              type="text"
                              name="designation"
                              value={formData.designation}
                              onChange={handleChange}
                              className="pl-4"
                              placeholder="Enter Designation"
                              required
                            />
                            {errors.designation && (
                              <p className="text-red-500 text-sm">
                                {errors.designation}
                              </p>
                            )}
                            </div>
                          </div>

                          {/* Email & Mobile */}
                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="relative">
                            <Label className="text-[#243460] font-semibold ml-2">Enter Email ID*</Label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-4"
                              placeholder="Enter Email ID"
                              required
                            />
                            </div>
                            {errors.email && (
                              <p className="text-red-500 text-sm">
                                {errors.email}
                              </p>
                            )}
                            <div className="relative">
                          <Label className="text-[#243460] font-semibold ml-2">Enter Mobile Number*</Label>
                            <Input
                              type="text"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              className="pl-4"
                              placeholder="Enter Mobile Number"
                              required
                            />
                            </div>
                            {errors.mobile && (
                              <p className="text-red-500 text-sm">
                                {errors.mobile}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="relative">
                              <Label className="text-[#243460] font-semibold ml-2">Select Gender*</Label>
                              <Select
                                value={formData.gender}
                                onValueChange={(value) =>
                                  handleChange({ target: { name: "gender", value } })
                                }
                              >
                              <SelectTrigger className=" pl-4 border-[1px] border-[#243460] text-base">
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent className="bg-white text-base text-gray-700">
                                <SelectItem
                                  value="Male"
                                  className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                >
                                  Male
                                </SelectItem>
                                <SelectItem
                                  value="Female"
                                  className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                >
                                  Female
                                </SelectItem>
                                <SelectItem
                                  value="Other"
                                  className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                >
                                  Other
                                </SelectItem>
                              </SelectContent>
                            </Select>
                              {errors.category && (
                                <p className="text-red-500 text-sm">
                                  {errors.category}
                                </p>
                              )}
                            </div>
                            <div className="relative w-full">
                              <Label className="text-[#243460] font-semibold ml-2">Select Category*</Label>
                              <Select
  value={formData.category}
  onValueChange={(value) =>
    handleChange({ target: { name: "category", value } })
  }
>
  <SelectTrigger className="w-full pl-4 border-[1px] border-[#243460] text-[14px] truncate ">
    <SelectValue placeholder="Select Category" />
  </SelectTrigger>
  <SelectContent className="bg-white text-base text-gray-700">
    {hspportal.map((category, index) => (
      <SelectItem
        key={index}
        value={category.text.trim()} // ✅ Ensure unique, clean value
        className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
      >
        {category.text.trim()}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


                              {errors.category && (
                                <p className="text-red-500 text-sm">
                                  {errors.category}
                                </p>
                              )}
                            </div>
                          </div>

                        {/* Submit Button */}
                        <div className="mt-6 text-center">
                          <Button
                            type="submit"
                            className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                          >
                            {loading ? "Submitting" : "  Submit"}
                          </Button>
                        </div>
                        </div>
                      </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {/* Our Services Section */}
        <div className="absolute hidden lg:flex -mt-4 md:-mt-6 left-0 right-0 z-20 justify-center">
          <button className="bg-[#2b73ec] font-sans text-[10px] lg:text-[18px] rounded-full py-1 px-4 text-white font-bold">
            Our Services
          </button>
        </div>

        {/* mobile Screen */}
        <div className=" flex flex-col justify-center items-center mx-[10%] md:mx-[20%] lg:hidden rounded-xl py-2 bg-[#5880cb]">
<p className=" uppercase text-center text-white">Portal Services</p>
<p className=" text-center text-white text-xs">Healthcare Service Provider’s Support</p>
        </div>

        <div className="mx-auto xspx-4 md:container mt-4 mb-5 w-full z-10">
          <div className="md:mx-auto md:container md:gap-4 lg:gap-6 space-y-4  grid grid-cols-3 xs:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 justify-center sm:mt-2 lg:px-16">
            {hspportal.map((icon, index) => {
              const words = icon.text.split(" ");
              let firstLine, secondLine;

              if (words.length === 1) {
                firstLine = words[0];
                secondLine = "";
              } else if (words.length === 2) {
                firstLine = words.join(" ");
                secondLine = "";
              } else if (words.length === 3) {
                firstLine = words.slice(0, 2).join(" ");
                secondLine = words[2];
              } else {
                firstLine = words.slice(0, 3).join(" ");
                secondLine = words.slice(3).join(" ");
              }

              return (
                <div
                  className="flex flex-col text-center mt-[16px] items-center justify-center"
                  key={index}
                >
                  <span className="md:h-28 md:w-28 h-20 w-20 rounded-full transition-transform duration-300 transform hover:scale-110">
                    <Image
                      src={icon.src}
                      width={200}
                      height={200}
                      alt={icon.text}
                    />
                  </span>
                  <p className="text-[#5271FF] text-[10px] lg:text-[12px] font-poppins font-bold">
                    {firstLine}
                    <br />
                    {secondLine}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {pathname === "/" && (
          <div className="flex items-center justify-center mx-auto pt-4">
            <button
              className="bg-[#243460] font-sans shadow-lg rounded-2xl text-white text-[14px] font-medium border-white border px-4 py-2"
              onClick={() => (window.location.href = "/hsp-portal")}
            >
              View More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HspClient;

const hspportal = [
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743856452/WhatsApp_Image_2025-04-05_at_6.01.46_PM_uzaejm.jpg",
    alt: "",
    text: "Road OR Air Ambulance Support",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743856766/WhatsApp_Image_2025-04-05_at_6.01.47_PM_lnqhuc.jpg",
    alt: "",
    text: "HSP All Types of License Support",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729087306/29-removebg-preview_fhxatq.png",
    alt: "",
    text: "Free OPD & IPD Patients Leads",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743857211/WhatsApp_Image_2025-04-05_at_6.16.29_PM_mjijx7.jpg",
    alt: "",
    text: "All Types of Teleradiology",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563051/Govt_Pvt_Insurance_Help_i5qief.png",
    alt: "",
    text: "Govt & Pvt Insurance Help",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733562999/Health_Equipment_Pharma_Suppliers_v4kl7w.png",
    alt: "",
    text: "Health Equipment & Pharma Suppliers",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743858182/WhatsApp_Image_2025-04-05_at_6.32.29_PM_d2lg7f.jpg",
    alt: "",
    text: "Digital Health Record OR OPD ISO:27001 Support",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729160749/medical_tourisum_ox47af.png",
    alt: "",
    text: "Health Medical  Tourism Support",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729160721/HR_support_ognzsf.png",
    alt: "",
    text: "Entire HR  Support for HSP",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729087980/39-removebg-preview_glnaag.png",
    alt: "",
    text: "New HSP Project Plan & Support",
  },
];
