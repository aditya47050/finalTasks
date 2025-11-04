"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowDown,
  Check,
  CheckCircle,
  IndianRupee,
  Phone,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { IoCall } from "react-icons/io5";
import CommonMBanner from "../../components/commonmobilebanner";
import { FaArrowCircleDown } from "react-icons/fa";

const Crowdfund3 = () => {
  const [text, setText] = useState();
  const [email, setEmail] = useState("");
  
  const handleSubscribe = async () => {
    if (!email) return toast.error("Please enter your email!");

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.error || "Subscription failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const url = new URL(window.location.href);

    if (!text) {
      url.searchParams.delete("query");
    } else {
      url.searchParams.set("query", text);
    }

    router.push(`${url}`);
  };

  // Array of images and texts for both grid and carousel
  const crowdfundingcategory = [
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/tuxittmxdtivblh2hbba.png",
      link: "#",
      text: "Help to NGO’s",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/ejzr8jxma88a3qgs7ecc.png",
      link: "#",
      text: " Child Health",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/vpgxhzpydivabu1irhpw.png",
      link: "#",
      text: "Emergency Help",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/yststufrq8q0jiobj32p.png",
      link: "#",
      text: "Medical Help",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/eadfqhg8qvfzsumpwmdj.png",
      link: "#",
      text: "Cancer Care",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/poosxlvu7tfzurz3lqx9.png",
      link: "#",
      text: "Transplant Surgery",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/qmqk3gn6dyz07zcwj822.png",
      link: "#",
      text: " Personal Cause",
    },
  ];
  const items = [
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/s66redc0tjmethfcg3zh.png",
      alt: "3000+ Fundraisers",
      text: "3000+ Fundraisers",
    },

    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/wbdzd4kklxbhi3djjzcb.png",
      alt: "Rs 50 Lakhs+ Raised",
      text: "Rs 50 Lakhs+ Raised",
    },
    {
      src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/mmf2qhsysfskuxxkdpvr.png",
      alt: "650+ Donations",
      text: "650+ Donations",
    },
  ];
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    why: "",
    cost: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "name" && /\d/.test(value)) {
      error = "Name cannot contain numbers";
    }
    if (name === "mobile" && (!/^\d+$/.test(value) || value.length > 10)) {
      error = "Mobile must be exactly 10 digits and contain only numbers";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) return;

    setLoading(true);

    try {
      const response = await fetch("/api/aarogya-dhan-enq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("Enquiry submitted successfully!");
      setFormData({ name: "", mobile: "", why: "", cost: "" });
      setErrors({});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto mb-4 hidden md:block">
        <div className="mx-auto container w-full flex  lg:flex-row space-y-5 lg:space-y-0 space-x-9">
          {/* Main Section with Background Image */}
          <div
            className="w-full px-2 lg:w-11/12 rounded-[15px] h-auto pb-4"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png')",
              backgroundSize: "cover",
              backgroundPosition: "right",
            }}
          >
            <div className="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
              {/* Left Image */}
              <div className="w-full md:w-1/2 flex xl:flex-row flex-col items-center">
                <div className="w-auto h-auto pb-4">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729088909/csr_fund_1_ebfbxf.png"
                    width={1265}
                    height={700}
                    alt=""
                    className="xl:h-40 lg:h-32 lg:w-full w-auto mt-8"
                  />
                </div>

                <button className="relative w-auto lg:ml-4 bg-gradient-to-r from-[#FFDE59] to-[#FF914D] pl-1 pr-3 py-1 text-white rounded-full flex items-center justify-between">
                  <span className=" bg-[#5271FF] p-1 rounded-full mr-2">
                    <Image
                      src="https://res.cloudinary.com/dnckhli5u/image/upload/v1725257022/aarogya%20aadhar/SiteImages/wlvx9w3k5losp57aswjv.png"
                      width={1200}
                      height={400}
                      alt="Aarogya Aadhar"
                      className="h-7 w-7"
                    />
                  </span>
                  <span className="flex-grow text-sm font-poppins lg:text-[17px] font-bold text-[#243460]">
                    Request For CSR
                  </span>
                </button>
              </div>

              {/* Grid Section */}
              <div className="w-full md:w-1/2 md:px-10 md:py-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center mx-auto">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Image
                        src={item.src}
                        width={100}
                        height={100}
                        alt={item.alt}
                        className="object-cover bg-[#5271FF] rounded-[15px] xl:h-28 lg:h-20 lg:w-20 xl:w-28"
                      />
                      <p className="text-[#242460] xl:text-[14px] text-center text-[13px] lg:text-[13px] font-poppins font-bold lg:font-extrabold mt-2">
                        {index === 0 || index === 2 ? (
                          <>
                            {item.text.split(" ")[0]} <br />
                            {item.text.split(" ").slice(1).join(" ")}
                          </>
                        ) : (
                          <>
                            {item.text.split(" ").slice(0, 3).join(" ")} <br />
                            {item.text.split(" ")[3]}
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Button Section */}
          <div className="w-full pl-4 px-2 md:w-1/12 text-center font-poppins flex lg:flex-col md:flex-col md:space-x-0 lg:space-x-0 md:space-y-5 lg:space-y-6 items-center md:justify-center lg:rounded-2xl md:p-4 lg:p-4">
            <button className="bg-[#5271FF] px-2 font-poppins lg:py-3 md:py-2 xl:py-4 text-[16px] text-white w-full md:w-[6rem] lg:w-[8rem] font-bold rounded-[10px] hover:bg-[#365c99]">
              Help
            </button>
            <button className="bg-[#5271FF] px-2 xl:py-4 lg:py-3 md:py-2 text-[16px] hover:bg-[#365c99] text-white rounded-[10px] w-full font-bold md:w-[6rem] lg:w-[8rem] border border-blue-500">
              Login
            </button>
            <button className="bg-[#5271FF] px-2 xl:py-4 lg:py-3 md:py-2 text-[16px] hover:bg-[#365c99] font-bold text-white rounded-[10px] w-full md:w-[6rem] lg:w-[8rem] border border-blue-500">
              INR
            </button>
          </div>
        </div>

        {/* Crowdfunding Categories */}
        <div className="justify-center flex text-center pt-4">
          <h1 className="text-[21px] font-poppins text-[#5271FF] font-extrabold">
            Request a Call Back
          </h1>
          {/* <p className="text-[#5271FF] text-xl">Select the Speciality</p> */}
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 container mx-auto pt-3">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
                {/* Full Name */}
                <div className="w-full">
                  <h1 className="text-[#243460] font-poppins font-bold text-[14px] ml-4">
                    Full Name*
                  </h1>
                  <input
                    type="text"
                    name="name"
                    className="w-full h-9 text-[12px] min-[500px]:pl-4 xl:pl-4 border placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none rounded-full"
                    placeholder="Enter Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="w-full">
                  <h1 className="text-[#243460] font-poppins font-bold text-[14px] ml-4">
                    Mobile Number*
                  </h1>
                  <input
                    type="text"
                    name="mobile"
                    className="w-full h-9 text-[12px] min-[500px]:pl-4 xl:pl-4 border placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none rounded-full"
                    placeholder="Enter 10-Digit Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength="10"
                    required
                  />
                </div>

                {/* Estimated Cost */}

                <div className="w-full relative">
                  <h1 className="text-[#243460] font-poppins font-bold text-[14px] ml-4 mb-2 lg:mb-0">
                    Estimated Cost*
                  </h1>
                  <div className="relative">
                    <select
                      name="cost"
                      className="w-full h-9  text-[12px] min-[500px]:pl-4 xl:pl-4  border placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none rounded-full"
                      value={formData.cost}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className="bg-[#e9e8e9] text-[#243460]">Select Cost Range</option>
                      <option value="1 Lakh to 2 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        1 Lakh to 2 Lakh
                      </option>
                      <option value="2 Lakh to 3 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        2 Lakh to 3 Lakh
                      </option>
                      <option value="3 Lakh to 5 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        3 Lakh to 5 Lakh
                      </option>
                      <option value="5 Lakh to 8 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        5 Lakh to 8 Lakh
                      </option>
                      <option value="8 Lakh to 10 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        8 Lakh to 10 Lakh
                      </option>
                      <option value="10 Lakh to 15 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        10 Lakh to 15 Lakh
                      </option>
                      <option value="15 Lakh to 20 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        15 Lakh to 20 Lakh
                      </option>
                      <option value="20 Lakh to 30 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                        20 Lakh to 30 Lakh
                      </option>
                      <option value="30 Lakh Above" className="bg-[#e9e8e9] text-[#243460]">
                        30 Lakh Above
                      </option>
                    </select>
                    {/* Dropdown Arrow */}
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                              <FaArrowCircleDown
                                                className="h-6 w-6 text-white"
                                                
                                              />
                                            </span>
                  </div>
                </div>

                {/* Fundraising Reason */}
                <div className="w-full relative">
                  <h1 className="text-[#243460] font-poppins font-bold text-[14px] ml-4 mb-2 lg:mb-0">
                    Why are you Fundraising?*
                  </h1>
                  <div className="relative">
                    <select
                      name="why"
                      className="w-full h-9  text-[12px] min-[500px]:pl-4 xl:pl-4 p-1 border placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none rounded-full"
                      value={formData.why}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className="bg-[#e9e8e9] text-[#243460]">Select Need</option>
                      {crowdfundingcategory.map((category, index) => (
                        <option
                          key={index}
                          value={category.text}
                          className="bg-[#e9e8e9] text-[#243460]"
                        >
                          {category.text}
                        </option>
                      ))}
                    </select>
                    {/* Dropdown Arrow */}
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FaArrowCircleDown
                            className="h-6 w-6 text-white "
                            
                          />
                        </span>
                  </div>
                </div>
              </div>
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-xs">{errors.mobile}</p>
            )}
            {/* Submit Button */}
            <div className="flex pt-2 justify-end items-end pr-6 w-full min-[800px]:pr-8 min-[800px]:pt-4 xl:pr-8 xl:pt-4">
              <button
                type="submit"
                className="bg-blue-600 rounded-full p-2 border border-[#243460] font-sans shadow-2xl px-4 text-white text-[14px] font-bold"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Your Request"}
              </button>
            </div>
          </form>

          <div className="mb-1 md:w-[24rem] xl:w-[25rem] container mx-auto ">
            <div className="">
              <div className="relative w-full max-w-md flex items-center">
                  {/* Icon */}
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <IoCall
                      className="h-6 w-6 bg-white rounded-full p-1 md:h-7 md:w-7"
                      color="#243451"
                    />
                  </span>
        
                  {/* Input Field */}
                  <Input
                    type="email"
                    placeholder="Enter Number/Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full  bg-[#243451] font-poppins placeholder:text-[12px] text-white placeholder-blue-950 placeholder:font-semibold pl-10 md:pl-12 w-full"
                  />
        
                  {/* Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubscribe}
                    className="absolute right-0 mr-[6px] -mt-1"
                  >
                    <span className="text-[#243451] p-2 text-[10px]  font-bold bg-white px-4 rounded-full">
                      Subscribe
                    </span>
                  </button>
                </div>
            </div>
          </div>
          <div className="flex space-x-1 text-center font-poppins text-[#002e6e] text-[20px] font-bold justify-center items-center">
            <span>Join The </span>{" "}
            <span className="text-[#FF5E00]"> AarogyaDhan </span>
            <span> Community</span>
          </div>
        </div>
      </div>
      {/* mobile */}
      <div className="px-2  md:hidden block">
        <div className="w-full flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
          {/* Main Section with Background Image */}
          <div
            className="w-full lg:w-11/12 rounded-3xl h-auto pb-4"
            style={{
              backgroundColor: "#dbdbdb",
            }}
          >
            <div className="w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
              <div className="px-6 flex justify-center mt-4">
                {" "}
                <button className=" relative   bg-gradient-to-r from-[#FFDE59] to-[#FF914D] pl-1 pr-3 py-1 text-white text-center rounded-full flex items-center justify-center ">
                  <span className=" bg-[#5271FF] p-1 rounded-full mr-1">
                    <IndianRupee className="h-6 w-6" />
                  </span>
                  <span className=" text-[10px] font-bold text-[#243460] relative">
                    Request For CSR
                  </span>
                </button>
              </div>

              {/* Grid Section */}
              <div className="w-full px-10 ">
                <div className="grid grid-cols-3  gap-2 text-center mx-auto">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Image
                        src={item.src}
                        width={100}
                        height={100}
                        alt={item.alt}
                        className="object-cover bg-[#5271FF] rounded-2xl h-20 w-20"
                      />
                      <p className="text-[#242460] text-center text-[10px]  font-poppins font-extrabold mt-2">
                        {index === 0 || index === 2 ? (
                          <>
                            {item.text.split(" ")[0]} <br />
                            {item.text.split(" ").slice(1).join(" ")}
                          </>
                        ) : (
                          <>
                            {item.text.split(" ").slice(0, 3).join(" ")} <br />
                            {item.text.split(" ")[3]}
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crowdfunding Categories */}
        <div className="justify-center text-center pt-4">
          <h1 className="text-[15px] text-[#5271FF] font-extrabold">
            Request a Call Back
          </h1>
          <p className="text-[#5271FF] text-[10px]">Fill the Details</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 lg:pl-24 pt-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 items-center">
            {/* Name */}
            <div className="w-full">
              <h1 className="text-[#243460] font-bold text-[10px] ml-2">
                Full Name*
              </h1>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-8 text-[9px] p-1 pl-2 border rounded-[40px] placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                placeholder="Enter Your Full Name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Mobile */}
            <div className="w-full">
              <h1 className="text-[#243460] font-bold text-[10px] ml-2">
                Mobile Number*
              </h1>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full h-8 text-[9px] p-1 pl-2 border rounded-[40px] placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                placeholder="Enter 10-Digit Mobile Number"
                required
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs">{errors.mobile}</p>
              )}
            </div>
            {/* Estimated Cost */}

            <div className="w-full relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-2">
                Estimated Cost*
              </h1>
              <div className="relative">
                <select
                  name="cost"
                  className="w-full h-8 text-[9px] p-1 pl-2 border rounded-[40px] placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                >
                  <option value="" className="bg-[#e9e8e9] text-[#243460]">Select Cost Range</option>
                  <option value="1 Lakh to 2 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    1 Lakh to 2 Lakh
                  </option>
                  <option value="2 Lakh to 3 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    2 Lakh to 3 Lakh
                  </option>
                  <option value="3 Lakh to 5 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    3 Lakh to 5 Lakh
                  </option>
                  <option value="5 Lakh to 8 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    5 Lakh to 8 Lakh
                  </option>
                  <option value="8 Lakh to 10 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    8 Lakh to 10 Lakh
                  </option>
                  <option value="10 Lakh to 15 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    10 Lakh to 15 Lakh
                  </option>
                  <option value="15 Lakh to 20 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    15 Lakh to 20 Lakh
                  </option>
                  <option value="20 Lakh to 30 Lakh" className="bg-[#e9e8e9] text-[#243460]">
                    20 Lakh to 30 Lakh
                  </option>
                  <option value="30 Lakh Above" className="bg-[#e9e8e9] text-[#243460]">
                    30 Lakh Above
                  </option>
                </select>
                {/* Dropdown Arrow */}
                <span className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FaArrowCircleDown
                            className="h-6 w-6 text-white "
                            
                          />
                        </span>
              </div>
            </div>

            {/* Fundraising Reason */}
            <div className="w-full relative">
              <h1 className="text-[#243460] font-bold text-[10px] ml-2">
                Why are you Fundraising?*
              </h1>
              <div className="relative">
                <select
                  name="why"
                  className="w-full h-8 text-[9px] p-1 pl-2 border rounded-[40px] placeholder:text-white text-white bg-[#5271FF] border-[#453565] appearance-none"
                  value={formData.why}
                  onChange={handleChange}
                  required
                >
                  <option value="" className="bg-[#e9e8e9] text-[#243460]">Select Need</option>
                  {crowdfundingcategory.map((category, index) => (
                    <option
                      key={index}
                      value={category.text}
                      className="bg-[#e9e8e9] text-[#243460]"
                    >
                      {category.text}
                    </option>
                  ))}
                </select>
                {/* Dropdown Arrow */}
                <span className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <FaArrowCircleDown
                            className="h-6 w-6 text-white "
                            
                          />
                        </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex pt-2 items-center mt-2 justify-center w-full mb-2">
            <button
              type="submit"
              className="bg-[#5271FF] rounded-full px-4 py-2 shadow-2xl text-white text-[10px] font-bold flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Your Request"}
            </button>
          </div>
        </form>

        <div className="mt-2">
          {" "}
          <CommonMBanner />
          <div className="flex text-center font-poppins  text-[#002e6e] text-[12px] font-bold justify-center items-center">
            Join The <span className="text-[#FF5E00] mx-1"> AarogyaDhan </span>{" "}
            Community
          </div>
        </div>
      </div>
    </>
  );
};

export default Crowdfund3;
const crowdfundingcategory = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/tuxittmxdtivblh2hbba.png",
    link: "#",
    text: "Help to NGO’s",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/ejzr8jxma88a3qgs7ecc.png",
    link: "#",
    text: "Child Health",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1728846799/aarogya_aadhar_ambulance_help_icon_lpx50v.png",
    link: "#",
    text: "Emergency Help",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/yststufrq8q0jiobj32p.png",
    link: "#",
    text: "Medical Help",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/eadfqhg8qvfzsumpwmdj.png",
    link: "#",
    text: "Cancer Care",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/poosxlvu7tfzurz3lqx9.png",
    link: "#",
    text: "Transplant Surgery",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723878707/Icons/qmqk3gn6dyz07zcwj822.png",
    link: "#",
    text: "Personal Cause",
  },
];
