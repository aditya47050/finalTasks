"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDown, CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiMail, FiPhone } from "react-icons/fi";
import { Button } from "@/components/ui/button";
const ChatbotIcon = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: null, // Date needs to be handled separately
    gender: "",
    mobile: "",
    email: "",
    category: "",
    pin: "",
  });

  // Handle input change for text and select fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Data Submitted:", formData);

    // // Reset the form after submission
    // setFormData({
    //   firstName: "",
    //   lastName: "",
    //   dob: null,
    //   gender: "",
    //   mobile: "",
    //   email: "",
    //   category: "",
    //   pin: "",
    // });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="fixed bottom-0 right-4 z-50 cursor-pointer hidden lg:block">
            <Image
              width={150}
              height={150}
              alt="Chatbot Icon"
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1727100832/aarogya%20aadhar/hmgen6xxjl425lwcugub.png"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
          <DialogHeader>
            <DialogDescription>
              {/* Heading */}
              <div className="pb-4 text-center">
                <h1 className="text-xl md:text-2xl text-[#243460] font-extrabold">
                  Aarogya <span className="text-[#ff5e00]">Rakshak</span>
                </h1>
                <p className="text-sm md:text-base text-[#5271FF]">
                  Fill Your Details
                </p>
              </div>

              {/* Form */}
              <form className="space-y-4 bg-white p-4 rounded-xl shadow-sm border " onSubmit={handleSubmit}>
                {/* Name Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      First Name*
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-4"
                      placeholder="Enter First Name"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      Last Name*
                    </Label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-4"
                      placeholder="Enter Last Name"
                      required
                    />
                  </div>
                </div>

                {/* DOB and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      Date of Birth*
                    </Label>
                    <div className="relative border-[1px] border-[#243460] rounded-xl bg-transparent">
                      <DatePicker
                        selected={formData.dob}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        maxDate={new Date()}
                        showMonthDropdown
                        placeholderText="DD/MM/YYYY"
                        className="w-full h-10 px-3 text-base md:text-sm bg-transparent placeholder:text-black pl-4 rounded-xl outline-none"
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CalendarDays className="h-5 w-5 text-[#243460]" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      Gender*
                    </Label>
                    <div className="relative">
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value }) // direct update
                        }
                      >
                        <SelectTrigger className="w-full bg-transparent h-10 text-sm text-black border-[1px] border-black rounded-xl px-3 ">
                          <SelectValue placeholder="Select your Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Mobile and Email */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      Mobile Number*
                    </Label>
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
                  </div>
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      Email ID*
                    </Label>
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
                </div>

                {/* Category and Pin Code */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      Category*
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="w-full bg-transparent h-10 text-sm text-black border-[1px] border-black rounded-xl px-3 ">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="option1">Category 1</SelectItem>
                            <SelectItem value="option2">Category 2</SelectItem>
                            <SelectItem value="option3">Category 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm font-bold text-[#243460]">
                      Pin Code*
                    </Label>
                    <Input
                      type="text"
                      name="pin"
                      value={formData.pin}
                      onChange={handleChange}
                      className="pl-4"
                      placeholder="Enter Pin Code"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition">
                    Submit
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotIcon;
