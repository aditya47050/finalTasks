"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import HeadingClientMain from "@/app/components/heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FaUser } from "react-icons/fa6";
import { FiMail, FiPhone } from "react-icons/fi";
const roles = [
  { name: "Ambulance" },

  { name: "Patient Coordinator" },
  { name: "Appointment Booking" },
  { name: "Billing" },
  { name: "Health Insurance" },
  { name: "Pathology & Laboratory" },
  { name: "Radiology & Imaging " },
  { name: "Pharmacy" },
  { name: "Intensive Care Unit (ICU)" },
  { name: "Administration & Management" },
];

export default function DepartmentinfoForm({ hospitalId }) {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    let newErrors = {};

    // Mobile Number Validation (10 digits)
    if (!/^\d{10}$/.test(data.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits.";
    }

    // Email Validation (Valid email format)
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.hospitalId = hospitalId;

    if (!validateForm(data)) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/hospital/${hospitalId}/department-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add staff");
      toast.success("Department info added successfully!");
      event.target.reset();
      setSelectedRole(""); // Reset role selection
      setErrors({});
      window.location.href = "/hospital/dashboard/department-contact";
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <div className="flex justify-end">
          <DialogTrigger>
            <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-500 hover:opacity-100 transition-none">
              Create New
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
          <DialogHeader>
            <div className=" flex flex-col text-center items-center justify-center">
              <DialogTitle className="text-center text-xl font-bold text-[#243460]">Department Info</DialogTitle>
              <DialogTitle className="text-center text-lg font-bold text-[#243460]">Add New</DialogTitle>
            </div>
          </DialogHeader>
            <form onSubmit={onSubmit}>
              <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                <div className="grid grid-cols-1  gap-3">    
                  <div>
                    <Label className="text-[#243460] font-semibold ml-0">Department</Label>
                    <Select
                      name="department"
                      required
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger className=" pl-4 border-[1px] border-[#243460]">
                        <SelectValue placeholder="Select a Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-base text-gray-700">
                        {roles.map((role) => (
                          <SelectItem key={role.name} value={role.name}
                          className="cursor-pointer hover:bg-gray-100 text-xs md:text-sm">
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                      <Label className="text-[#243460] font-semibold ">Enter Phone Number*</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                          <FiPhone />
                        </span>
                        <Input
                          name="mobileNumber"
                          required
                          placeholder="Enter 10-Digit Mobile Number"
                          className="pl-8"
                        />
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.mobileNumber}
                        </p>
                      )}
                  </div>
                  <div>
                      <Label className="text-[#243460] font-semibold ">Enter Email ID (Optional)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                          <FiMail />
                        </span>
                        <Input
                          name="email"
                          placeholder="Enter Email ID (optional)"
                          className="pl-8"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                  </div>
                  <div className="!mt-6 text-center">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                    >
                      {loading ? "Saving..." : "Submit"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
