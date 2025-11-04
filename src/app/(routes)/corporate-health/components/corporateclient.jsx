"use client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "../../../../components/ui/dialog";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiMail, FiPhone } from "react-icons/fi";

import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const CorporateClient = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    mobile: "",
    gender: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    let error = "";
    if (name === "mobile" && !/^\d*$/.test(value)) {
      error = "Only numbers allowed";
    } else if (
      (name === "name" || name === "designation") &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      error = "Only letters allowed";
    }

    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for errors
    let validationErrors = {};
    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.designation)
      validationErrors.designation = "Designation is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.mobile) validationErrors.mobile = "Mobile is required";
    if (!formData.gender) validationErrors.gender = "Gender is required";
    if (!formData.category) validationErrors.category = "Category is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Submit data to API
    try {
      const response = await fetch("/api/corporatehealthenq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(
        "Form submitted successfully!. Our team will connect you shortly"
      );
      setFormData({
        name: "",
        designation: "",
        email: "",
        mobile: "",
        gender: "",
        category: "",
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (errors.name) toast.error(errors.name, { toastId: "name-error" });
    if (errors.designation)
      toast.error(errors.designation, { toastId: "designation-error" });
    if (errors.mobile) toast.error(errors.mobile, { toastId: "mobile-error" });
  }, [errors]);
  return (
    <>
      <div className="hidden font-poppins lg:block xl:mt-2 lg:mt-2">
        <div className="container mx-auto mb-5 px-4">
          <div className="text-center">
            <h1 className="text-[25px] text-[#5271FF] font-extrabold leading-7">
              <span className="">Corporate Health</span>
            </h1>
            <p className="text-[#5271FF] text-[15px]">
              Corporate Employee Health & Wellness
            </p>
          </div>
          <div className="relative w-full mt-4">
            <div className="relative w-full h-[270px]">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731671508/10_naw0sb.png"
                width={1600}
                height={420}
                className="w-full h-full rounded-[15px]"
                alt=""
              />
            </div>

            {/* Certified section */}
            <div className="absolute top-1/2 w-1/2  z-10  text-center mt-8">
              <marquee
                direction="left"
                className="w-full"
                behavior="scroll"
                scrollamount="5"
              >
                <div className="inline-block p-2  text-[17px] text-white font-poppins font-light pointer-events-none">
                  <h1 className="bg-gradient-to-r from-[#5de0e6] via-[#004aad] to-[#004aad] inline-block px-5 py-2 rounded-[50px]">
                    Certified by <span className="font-extrabold">DISH</span>
                    <br /> Approved by Government of{" "}
                    <span className="font-extrabold">India</span>
                  </h1>
                </div>
              </marquee>
            </div>
            {/* Enquiry button */}
            <div className="absolute top-0 right-0 min-[1200px]:mr-[20px]  md:mr-8  xl:mr-[15px] xlg:mr-[15px] lg:pl-[120px] text-center transform -translate-y-1/2 p-2 rounded-full font-poppins font-light md:w-1/3">
              <button className="relative w-full lg:w-auto bg-gradient-to-r from-[#FFDE59] to-[#FF914D] p-1 text-white rounded-full flex items-center justify-between lg:justify-start">
                <span className="mr-1 rounded-full">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726912370/Icons/ifjpfg2kziotitq7u14o.png"
                    width={400}
                    height={1200}
                    alt=""
                    className="h-8 w-8 rounded-full max-[1200px]:h-6 max-[1200px]:w-6"
                  />
                </span>
                <span className="flex-grow text-[17px] max-[1200px]:text-[15px] font-poppins pr-2 font-bold text-[#243460] relative shadow-2xl">
                  Enquiry Now
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input fields */}
              <div className="absolute top-0 right-20 md:pt-[300px] lg:pl-[80px] lg:pt-[230px] xl:pl-[110px] xl:mr-[32px] text-center transform -translate-y-1/2 p-2 rounded-full font-poppins font-light md:w-1/3 z-10">
                <div className="space-y-4 font-poppins">
                  <div className="flex space-x-4">
                    <div className="w-full relative z-20">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                        <FaUser className="h-3 w-3 max-[1200px]:h-[8px] max-[1200px]:w-[8px]"/>
                      </span>
                      <input
                        type="text"
                        className="xl:w-48 md:w-36 min-[1200px]:w-[170px] h-9 p-2 pl-8 max-[1200px]:h-7  xl:text-[13px] font-poppins md:text-[12px] max-[1200px]:text-[10px] placeholder:max-[1200px]:text-[10px] placeholder:text-white text-white bg-[#5271FF] rounded-full border border-transparent focus:border-white focus:outline-none"
                        placeholder="Enter Full Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        name="name"
                      />
                    </div>
                    <div className="w-full relative z-20">
                      <input
                        type="text"
                        className="xl:w-48 md:w-36 min-[1200px]:w-[170px] h-9 xl:text-[13px] max-[1200px]:h-7 pl-3 font-poppins md:text-[12px] max-[1200px]:text-[10px] placeholder:max-[1200px]:text-[10px] placeholder:text-white text-white bg-[#5271FF] rounded-full border border-transparent focus:border-white focus:outline-none"
                        placeholder="Enter Your Designation"
                        required
                        value={formData.designation}
                        onChange={handleChange}
                        name="designation"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-full relative z-20">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                        <FiMail className="h-3 w-3 max-[1200px]:h-[8px] max-[1200px]:w-[8px]"/>
                      </span>
                      <input
                        type="text"
                        className="xl:w-48 md:w-36 min-[1200px]:w-[170px] h-9 p-2 pl-8  xl:text-[13px] max-[1200px]:h-7 font-poppins md:text-[12px] max-[1200px]:text-[10px] placeholder:max-[1200px]:text-[10px] placeholder:text-white text-white bg-[#5271FF] rounded-full border border-transparent focus:border-white focus:outline-none"
                        placeholder="Enter Your Email ID"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                      />
                    </div>
                    <div className="w-full relative z-20">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                        <FiPhone className="h-3 w-3 max-[1200px]:h-[8px] max-[1200px]:w-[8px]"/>
                      </span>
                      <input
                        type="text"
                        className="xl:w-48 md:w-36 min-[1200px]:w-[170px] h-9 p-2 pl-8  xl:text-[13px] max-[1200px]:h-7 font-poppins md:text-[12px] min-[1200px]:text-[13px] max-[1200px]:text-[10px] placeholder:max-[1200px]:text-[10px] placeholder:text-white text-white bg-[#5271FF] rounded-full border border-transparent focus:border-white focus:outline-none"
                        placeholder="Enter Mobile Number"
                        required
                        value={formData.mobile}
                        onChange={handleChange}
                        name="mobile"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-full relative z-20">
                        <select
                          className="xl:w-48 md:w-36 min-[1200px]:w-[170px] h-9 xl:text-[13px] max-[1200px]:h-7 pl-4 font-poppins  max-[1200px]:text-[10px] min-[1200px]:text-[13px] placeholder:max-[1200px]:text-[10px] placeholder:text-white text-white bg-[#5271FF] rounded-full border border-transparent focus:border-white focus:outline-none"
                          required
                          value={formData.gender}
                          onChange={handleChange}
                          name="gender"
                        >
                          <option value="">Select Your Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
                          <FaArrowCircleDown className="h-5 w-5 text-white max-[1200px]:h-[15px] max-[1200px]:w-[15px]"/>
                        </span>
                      </div>
                      <div className="w-full relative z-20">
                        <select
                          className="xl:w-48 md:w-36 min-[1200px]:w-[170px] h-9 xl:text-[13px] max-[1200px]:h-7 pl-4 font-poppins  max-[1200px]:text-[10px] min-[1200px]:text-[13px] placeholder:max-[1200px]:text-[10px] placeholder:text-white text-white bg-[#5271FF] rounded-full border border-transparent focus:border-white focus:outline-none"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          name="category"
                        >
                          <option value="">Select Category</option>
                          {corporatehealth.map((category, index) => (
                            <option
                              key={index}
                              value={category.link}
                              className="text-black"
                            >
                              {category.text}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
                          <FaArrowCircleDown className="h-5 w-5 text-white max-[1200px]:h-[15px] max-[1200px]:w-[15px]"/>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="absolute top-0 right-0 xl:pt-[420px] min-[1200px]:pt-[420px] md:pt-[380px] min-[1200px]:mr-[-20px] xl:mr-[-40px] lg:pl-[120px] max-[1200px]:mr-[0px] max-[1200px]:text-[10px] text-center transform -translate-y-1/2 p-2 rounded-full font-poppins font-light md:w-1/3">
                <button
                  type="submit"
                  className="relative lg:w-auto bg-[#5271FF] text-[14px] max-[1200px]:text-[10px] font-sans font-bold px-4 py-1 text-white rounded-full flex items-center justify-between"
                >
                  {loading ? "Please Wait.." : "   Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* m */}
      <div>
        {" "}
        <div className="container font-poppins mx-auto lg:hidden block mt-4  px-4">
          <div className="text-center ">
            <h1 className="text-[20px] text-[#5271FF] font-extrabold  leading-6 lg:leading-6">
              <span className="">Corporate Health</span>
            </h1>
            <p className="text-[#5271FF] text-[14px]  leading-5 lg:leading-6">
              Corporate Employee Health & Wellness
            </p>
          </div>
          <div className="relative w-full mt-0">
            <div className=" w-full h-full ">
              <Image
                src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743659081/44_xfrvjv.png"
                width={1600}
                height={420}
                className="w-full rounded-[15px]"
                alt=""
              />
            </div>
            {/* <div className=" absolute bottom-0  text-center  text-[12px] text-[#243460] font-poppins ">
              <marquee>
                {" "}
                <h1>
                  Certified by <span className="font-extrabold">DISH</span>
                  {""} Approved by Government of{" "}
                  <span className="font-extrabold">India</span>
                </h1>
              </marquee>
            </div> */}

            </div>
            <div className=" mt-7 justify-center items-center text-center flex">
              <Dialog>
                <DialogTrigger>
                  <div className="flex items-center justify-center text-center  ">
                    <div className=" transform -translate-y-1/2 p-1 rounded-full font-poppins font-light">
                      <button className="relative !w-full bg-gradient-to-r from-[#FFDE59] to-[#FF914D] px-1 py-1 text-white rounded-full flex items-center justify-between lg:justify-start">
                        <span className="mr-1">
                          <Image
                            src={
                              "https://res.cloudinary.com/dnckhli5u/image/upload/v1726912370/Icons/ifjpfg2kziotitq7u14o.png"
                            }
                            width={400}
                            height={1200}
                            alt=""
                            className="h-6 rounded-full w-6"
                          />
                        </span>
                        <span className="flex-grow text-[10px] pr-2 font-bold text-[#243460] relative shadow-2xl">
                          Enquiry Now
                        </span>
                      </button>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
                  <DialogHeader>
                    <DialogDescription>
                      <div className=" flex text-center items-center justify-center">
                        <button className="relative lg:w-auto bg-gradient-to-r from-[#FFDE59] to-[#FF914D] p-1 text-white rounded-full flex items-center justify-between lg:justify-start">
                          <span className="mr-1 rounded-full">
                            <Image
                              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726912370/Icons/ifjpfg2kziotitq7u14o.png"
                              width={400}
                              height={1200}
                              alt="?"
                              className="h-6 w-6 rounded-full"
                            />
                          </span>
                          <DialogTitle className="text-center text-xl font-bold text-[#243460]">Enquiry Form</DialogTitle>
                        </button>
                      </div>
                      </DialogDescription>
                                        </DialogHeader>
                      <form onSubmit={handleSubmit} className="">
                        {/* Input fields */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                          <div className="grid grid-cols-1  gap-3">
                            {/* Name Input */}
                            <div className="w-full relative z-20">
                              <Label className="text-[#243460] font-semibold ml-2">Enter Full Name*</Label>
                              <Input
                                type="text"
                                className="pl-4"
                                placeholder="Enter Full Name "
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>
                            {/* Designation Input */}
                            <div className="w-full relative z-20">
                              <Label className="text-[#243460] font-semibold ml-2">Enter Designation*</Label>
                              <Input
                                type="text"
                                className="pl-4"
                                placeholder="Enter Designation"
                                required
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                              />
                            </div>
                            {/* Email Input */}
                            <div className="w-full relative z-20">
                              <Label className="text-[#243460] font-semibold ml-2">Enter Email ID*</Label>
                              <Input
                                type="text"
                                className="pl-4"
                                placeholder="Enter Email ID"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
                              />
                            </div>
                            {/* Mobile Number Input */}
                            <div className="w-full relative z-20">
                              <Label className="text-[#243460] font-semibold ml-2">Enter Mobile Number*</Label>
                              <Input
                                type="text"
                                className="pl-4"
                                placeholder="Enter Mobile Number"
                                required
                                value={formData.mobile}
                                onChange={handleChange}
                                name="mobile"
                              />
                            </div>
                            {/* Gender Select */}
                            <div className="w-full relative z-20">
                              <Label className="text-[#243460] font-semibold ml-2">Select Gender*</Label>
                              <Select
                                value={formData.gender}
                                onValueChange={(value) => handleChange({ target: { name: "gender", value } })}
                              >
                                <SelectTrigger className=" pl-4 border-[1px] border-[#243460]">
                                  <SelectValue placeholder="Select your Gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-sm text-gray-700">
                                  <SelectItem className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm" value="Male">Male</SelectItem>
                                  <SelectItem className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm" value="Female">Female</SelectItem>
                                  <SelectItem className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm" value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {/* Category Select */}
                            <div className="w-full relative z-20">
                              <Label className="text-[#243460] font-semibold ml-2">Select Category*</Label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                  handleChange({ target: { name: "category", value } })
                                }
                              >
                                <SelectTrigger className="pl-4 border-[1px] border-[#243460]">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-sm text-gray-700">
                                  {corporatehealth.map((category, index) => (
                                    <SelectItem
                                      key={index}
                                      value={category.link}
                                      className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                    >
                                      {category.text}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        {/* Submit button */}
                        <div className="mt-6 text-center">
                          <Button
                            type="submit"
                            className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                          >
                            {loading ? "Please Wait.." : "   Submit"}
                          </Button>
                        </div>
                        </div>

                      </form>
                </DialogContent>
              </Dialog>
            </div>
          
        </div>
      </div>
    </>
  );
};

export default CorporateClient;

const corporatehealth = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "Employees Vaccination",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "Medical personal Manning",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "Employee Health Insurance",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "Healthcare CSR Services",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "OHC Health Center",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "Health Talks & Seminars",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "Annual Health Check-Ups",
  },
  {
    src: "https://res.cloudinary.com/dwsc0vedb/image/upload/v1743861055/WhatsApp_Image_2025-04-05_at_7.20.17_PM_njaqer.jpg",
    alt: "",
    text: "24/7 Ambulance Services",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "Equipped Mobile Medical Unit",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1724494857/Icons/zpqoopeo4opdqd4qpi1t.png",
    alt: "",
    text: "OHC AFIH Doctor & Medical Staff",
  },
];
