"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { FaUser } from "react-icons/fa6";
import { FiMail, FiPhone } from "react-icons/fi";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const HelpCenterDialog = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full">
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        <DialogHeader>
          <DialogDescription>
            <div className="flex text-center items-center justify-center">
                <span className="text-xl mt-2 font-bold text-[#5271FF] text-center">
                  Enter Details
                </span>

            </div>
            </DialogDescription>
        </DialogHeader>
            <form className="space-y-4 ">
               <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
  {/* Row 1: Name & Email */}
  <div className="grid grid-cols-1 gap-4">
    <div>
      <Label className="text-[#243460] font-semibold ml-2">Your Full Name*</Label>
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460] h-4 w-4" />
        <Input
          type="text"
          placeholder="Your Full Name"
          className="mt-1 pl-8"
        />
      </div>
    </div>
    <div>
      <Label className="text-[#243460] font-semibold ml-2">Enter Email ID*</Label>
      <div className="relative">
        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460] h-4 w-4" />
        <Input
          type="email"
          placeholder="Enter Your Email ID"
          className="mt-1 pl-8"
        />
      </div>
    </div>
  </div>

  {/* Row 2: Phone & Pincode */}
  <div className="grid grid-cols-1 gap-4">
    <div >
      <Label className="text-[#243460] font-semibold ml-2">Enter Phone Number*</Label>
      <div className="relative">
        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460] h-4 w-4" />
        <Input
          type="text"
          placeholder="Enter 10-Digit Phone No"
          className="mt-1 pl-8"
        />
      </div>
    </div>
    <div>
      <Label className="text-[#243460] font-semibold ml-2">Enter PinCode*</Label>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter 6-Digit Pincode"
          className="mt-1 pl-4"
        />
      </div>
    </div>
  </div>

  {/* Message */}
  <div>
    <Label className="text-[#243460] font-semibold ml-2">Enter Message*</Label>
    <Textarea
      rows={3}
      placeholder="Enter Message"
      className="mt-1 pl-4 bgg-white"
    />
  </div>

  {/* Submit Button */}
  <div className="flex justify-center ">
    <button
      type="submit"
      className="w-full px-6  bg-[#2b73ec] hover:bg-[#1c5bb7] text-white font-bold py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
    >
      {
        isLoading ? "Submitting" : "Submit"
      }
      
    </button>
  </div>
  </div>
</form>

          
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default HelpCenterDialog;
