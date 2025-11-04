"use client";
import Image from "next/image";
import React, { useState } from "react";
import { HiMiniUsers } from "react-icons/hi2";
import { FaBedPulse, FaUserDoctor } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import Link from "next/link";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowDown ,AlertCircle} from "lucide-react";
import { toast } from "react-toastify";
import { FaArrowCircleDown, FaUser } from "react-icons/fa";
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from "react-icons/fi";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const Aarogyamitraclient1 = () => {
  const OurServices = [
    {
      id:1,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227235/Consultant_Doctor_glkhw3.png",
      text: "Consultant Doctor",
    },
    {
      id:2,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227521/super_Consultant_Doctor_huvbcq.png",
      text: "Super  Consultant Doctor",
    },
    {
      id:3,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227406/MBBS_Doctor_e1y9xc.png",
      text: "MBBS  Doctor",
    },
    {
      id:4,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227230/CMO_Doctor_aro9tw.png",
      text: "CMO  Doctor",
    },
    {
      id:5,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227510/RMO_Doctor_d1gewe.png",
      text: "RMO  Doctor",
    },
    {
      id:6,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227423/Nurse_s_xdtp4m.png",
      text: "Nurse's & Brother's",
    },
    {
      id:7,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227487/Pharmacist_staff_s9fx3t.png",
      text: "Pharmacist Staff",
    },
    {
      id:8,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227285/Fresher_Intern_staff_ijofyl.png",
      text: "Fresher/Intern Staff",
    },
    {
      id:9,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733562975/Administration_Staff_c34hae.png",
      text: "Administration Staff",
    },
    {
      id:10,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733562986/HR_Staff_ef2rvj.png",
      text: "Human Resource",
    },
    {
      id:11,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229225/Radiology_Technician_aalnxz.png",
      text: "Radiology Technician",
    },
    {
      id:12,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563023/Pathology_Staff_gtqghh.png",
      text: "Pathology Technician",
    },
    {
      id:13,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227929/Healthcare_Reception_segg9d.png",
      text: "Healthcare Reception",
    },
    {
      id:14,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229190/Insurance_f5ialr.png",
      text: "Insurance Coordinator",
    },
    {
      id:15,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563034/Senior_Management_Staff_gxet10.png",
      text: "Senior Management Staff",
    },
    {
      id:16,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229204/Marketing_staff_qljtrt.png",
      text: "Marketing Staff",
    },
    {
      id:17,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227953/Ambulance_d_ng8jvf.png",
      text: "Ambulance Driver",
    },
    {
      id:18,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227959/Healthcare_Coordinator_gxrpdp.png",
      text: "Healthcare Coordinator",
    },
    {
      id:19,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729229175/Housekeeping_staff_ivbecs.png",
      text: "Housekeeping Staff",
    },
    {
      id:20,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1733563029/Security_Guard_Staff_i4nudc.png",
      text: "Security Staff",
    },
    {
      id:21,
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729227945/Accountant_staff_ycxdqq.png",
      text: "Accountant Staff",
    },
  ];
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    email: "",
    mobile: "",
    city: "",
    pincode: "",
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
    if (name === "city" && /\d/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "City should not contain numbers",
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

    if (name === "pincode" && (!/^\d{0,6}$/.test(value) || value.length > 6)) {
      setErrors((prev) => ({
        ...prev,
        pincode: "Pincode should be exactly 6 digits",
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
      if (name === "pincode" && !/^\d{6}$/.test(value)) {
        errorMsg = "Invalid pincode (6 digits required)";
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
        setLoading(false);
        return;
      }

      const response = await fetch("/api/aarogyamitraenq", {
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
        city: "",
        pincode: "",
      });
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Something went wrong! Please try again.");
      setloading(false);
    }
  };

  return (
    <>
      <div className="font-poppins  xl:mt-2 md:mt-2 xs:mt-2 xl:mx-[2rem]">
        {" "}
        <div className="text-center">
          <h1 className="md:text-[25px] text-[20px] leading-6 lg:leading-8 text-[#5271FF] font-extrabold lg:mt-4">
            <span className="">AarogyaMitra</span>
          </h1>
          <p className="text-[#5271FF] text-[15px] leading-5 lg:leading-6">Home Healthcare Services</p>
        </div>
        <div className="relative w-full lg:px-0  px-4 xl:ml-auto xl:mr-[2rem] mt-0 md:mt-1">
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732110828/18_ik9qp9.png"
            width={4000}
            height={844}
            className="w-full lg:mr-5 lg:ml-1 xl:mx-auto  h-[80px] hidden lg:block md:h-full md:rounded-[15px]"
            alt="Trigger Dialog"
          />
            <Image
            src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743654934/39_qqtold.png"
            width={4000}
            height={844}
            className="w-full block lg:hidden h-full rounded-[15px]"
            alt="Trigger Dialog"
          />
          <div className="absolute top-[86%] left-[83%] md:left-[84%] lg:top-[80%] lg:left-[70%] transform -translate-x-1/2 -translate-y-1/2 text-white px-2 md:px-4 md:py-2 py-1 rounded-md">
            <p>
              <Dialog>
                <DialogTrigger>
                  <div className="relative hidden lg:block shadow-xl w-full">
                    <p className="lg:text-[12px] text-[7px] font-semibold">
                      Click Here For
                    </p>
                    <button className="relative w-auto  lg:w-auto bg-white p-0 lg:p-1 text-[#FF914D] rounded-full flex items-center  text-center justify-center">
                      <span className=" text-[7px] md:text-[14px] font-poppins px-2 font-bold text-orange-600 relative shadow-2xl">
                        Enquiry Now
                      </span>
                    </button>
                  </div>

                  <div className="relative block lg:hidden  w-full">
                   
                    <button className="relative lg:w-auto bg-white p-0 lg:p-2 text-[#FF914D] rounded-full flex ">
                     
                      <span className="md:flex-grow text-[8px] sm:text-[10px] md:text-[14px] font-poppins px-3 py-1 md:py-2 font-bold text-orange-600 relative shadow-2xl">
                       Registration
                      </span>
                    </button>
                  </div>
                </DialogTrigger>
                <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
                  <DialogHeader>
                    <DialogDescription>
                      {/* Enquiry button */}
                        {/* Enquiry Button */}
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

                        {/* Form Fields */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                          
                          {/* Category & Name */}
                          <div className="grid grid-cols-1  gap-3">
                            <div>
                              <Label className="text-[#243460] font-semibold ml-0">Select Category*</Label>
                              <div className="relative">
                                <Select
                                  value={formData.category}
                                  onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, category: value }))
                                  }
                                >
                                  <SelectTrigger className=" pl-4 border-[1px] border-[#243460]">
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>

                                  <SelectContent className="bg-white text-base text-gray-700">
                                    {OurServices.map((category, index) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.text}
                                        className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                                      >
                                        {category.text}
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
                            <div>
                              <Label className="text-[#243460] font-semibold ">Your Full Name*</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                                  <FaUser />
                                </span>
                              <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className=" pl-8"
                                placeholder="Enter Your Full Name"
                                required
                              />
                              </div>
                              {errors.name && (
                                <p className="text-red-500 text-sm">
                                  {errors.name}
                                </p>
                              )}
                            </div>
                            <div>
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
                                placeholder="Enter Your Email ID"
                                required
                              />
                              </div>
                              {errors.email && (
                                <p className="text-red-500 text-sm">
                                  {errors.email}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="text-[#243460] font-semibold ">Enter Phone Number*</Label>
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
                                placeholder="Enter 10-Digit Mobile Number"
                                required
                              />
                              </div>
                              {errors.mobile && (
                                <p className="text-red-500 text-sm">
                                  {errors.mobile}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="text-[#243460] font-semibold ">Enter Your City*</Label>
                              <Input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="pl-4"
                                placeholder="Enter Your City"
                                required
                              />
                              {errors.city && (
                                <p className="text-red-500 text-sm">
                                  {errors.city}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="text-[#243460] font-semibold ">Enter Pincode*</Label>
                              <Input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="pl-4"

                                placeholder="Enter 6-Digit Pincode"
                                required
                              />
                              {errors.pincode && (
                                <p className="text-red-500 text-sm">
                                  {errors.pincode}
                                </p>
                              )}
                            </div>
                          </div>
                        {/* Submit Button */}
                        <div className="!mt-6 text-center">
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
            </p>
          </div>
        </div>
        <div className="px-4 mt-4 flex text-center items-center justify-center">
          {" "}
          <div className="relative  xl:w-[70%] lg:w-[80%] min-[800px]:w-[90%]   flex-wrap md:flex-nowrap flex items-center justify-center">
            <div className="bg-gradient-to-r hidden lg:block from-[#ffde59] to-[#ff914d] py-2 relative lg:mr-[-40px]  px-8 lg:text-[19px] text-[12px] rounded-xl font-bold font-poppins">
              AarogyaMitra
            </div>
            <div className="bg-[#4671b8] py-3   md:mt-0 text-center md:px-14 md:space-y-0 space-y-1 xs:text-[10px] lg:text-[15px] text-[10px] rounded-xl text-white font-poppins">
              You are Certified by Aarogya Aadhar Portal, with Aarogya Aadhar
              Portal you are calling as Qualified, Professional, Expert &
              Experience <strong>AarogyaMitra</strong>
            </div>
          </div>
        </div>
        <div className="text-center text-[#2b73ec] my-4 font-bold text-[20px] lg:text-[25px] xl:text-[30px]">
          <p>5000+ Happy AarogyaMitra’s</p>
        </div>
        {/* Stats Section */}
        <div className="flex xs:gap-1 md:px-8 md:p-4 md:py-2  w-full md:mx-auto items-center justify-center md:container ">
          {[
            {
              label: "Patient’s",
              value: "9000+",
              iconSrc: <FaBedPulse className="md:h-8 md:w-8 h-5 w-5" />,
            },
            {
              label: "Cities",
              value: "20+",
              iconSrc: <IoLocation className="md:h-8 md:w-8 h-5 w-5" />,
            },
            {
              label: "Doctor’s",
              value: "20+",
              iconSrc: <FaUserDoctor className="md:h-8 md:w-8 h-5 w-5" />,
            },
            {
              label: "Professionals",
              value: "1000+",
              iconSrc: <HiMiniUsers className="md:h-8 md:w-8 h-5 w-5" />,
            },
          ].map((stat, index) => (
            <div key={index} className="w-1/5">
              <div className="flex justify-center font-poppins text-[#ff5e00] space-x-1 md:space-x-2">
                <span className="">{stat.iconSrc}</span>
                <span className=" text-[#243460] font-bold font-sans text-[10px] md:text-xl xl:text-2xl">
                  {stat.value}
                </span>
              </div>
              <div className="flex justify-center text-[#243460]  text-[10px] md:text-xl xl:text-2xl space-x-2 font-poppins font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <div className="py-4">
          <div className="w-full  flex flex-wrap md:flex-nowrap items-center justify-center text-center md:space-y-0 space-y-2  mx-auto container">
            <div className="md:w-4/12 w-full">
              <div className="font-extrabold">
                <p className="text-[#243460] lg:text-3xl xl:text-4xl font-amster ">
                  Why join as{" "}
                </p>
                <p className="text-[#ff5e00] font-cursive lg:text-4xl xl:text-5xl ">
                  AarogyaMitra?
                </p>
              </div>
            </div>
            <div className="md:w-5/12 w-full lg:px-10">
              <p className="text-[#243460]  text-start font-sans font-semibold xl:text-[16px] text-[12px]">
                At Aarogya Aadhar portal, we respect your time and efforts. We
                know you deserve the best, so we strive to give you the best.{" "}
                <br />
                <strong>Free* Patient Lead, More Earning with us..</strong>{" "}
              </p>
            </div>
            <div className="md:w-3/12 w-full hidden md:block">
              <Image
                src={
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1732347141/1_iwikvi.png"
                }
                width={400}
                height={400}
                alt=""
                className="h-[160px] lg:h-[180px] w-full lg:w-[180px]"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 xl:gap-2 justify-center mx-auto sm:mt-2 md:mt-4  lg:ml-[2rem] lg:mr-[1.5rem] xl:mx-[2rem] xs:mx-2">
          {reasons.map((reason, index) => (
            <div
              className="relative flex flex-col pb-4  mb-4 bg-[#93c2ee] bg-opacity-30 p-1 md:p-2 border-[#4671b8] rounded-2xl border"
              key={index}
            >
              <p className="bg-[#4671b8] inline-block items-start mt-6 ml-[-4px] md:ml-[-8px] px-2 md:w-[160px] py-1  rounded-r-full lg:text-[13px] text-[11px]  font-semibold text-white  font-poppins xs:w-[100px]">
                {reason.no}
              </p>
              <div className="relative z-10">
                <p className="text-[#243561] font-poppins text-start lg:text-[14px] text-[11px] mt-4">
                  {reason.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Aarogyamitraclient1;
const reasons = [
  {
    title:
      "Get Hassle Free Daily payment directly in your bank account without any wait.",
    no: "Get Paid Quick",
  },
  {
    title:
      "Choose your home healthcare work hours according to your convenience working hrs",
    no: "Flexible Work",
  },
  {
    title:
      "Safe service with our 24/7 accidental insurance  support with Hassle Free document work",
    no: "Accidental Insurance",
  },
  {
    title:
      "Equipped First Aid Kit with pepper spray & a torch for women health worker safety and location tracker",
    no: "First Aid & Safety Kit",
  },
];
