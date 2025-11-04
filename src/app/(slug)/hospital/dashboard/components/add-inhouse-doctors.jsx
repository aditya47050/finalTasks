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
  SelectGroup,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import HeadingClientMain from "@/app/components/heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";

import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Label } from '@/components/ui/label';
import { FaUser } from 'react-icons/fa6';
import { FiMail } from 'react-icons/fi';
import { FiPhone } from 'react-icons/fi';

export default function HospitalDoctorForm({
  hospitalId,
  specialties,
  doctors,
}) {
  const [loading, setLoading] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(""); // Selected specialty
  const [selectedDoctors, setSelectedDoctors] = useState([]); // Selected doctor IDs
  const [search, setSearch] = useState(""); // Search input
  const [errors, setErrors] = useState({});

  // 🔹 Filter doctors based on specialty & search term
  const filteredDoctors = doctors.filter(
    (doc) =>
      (!selectedSpecialty ||
        doc.specialities.some((s) => s.speciality.id === selectedSpecialty)) &&
      (!search ||
        doc.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        doc.mobile?.toLowerCase().includes(search.toLowerCase()) ||
        doc.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        doc.doctorinfo?.aadharcardno
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        doc.email?.toLowerCase().includes(search.toLowerCase()) ||
        doc.DoctorCertificate?.some((cert) =>
          cert.cardNo?.toLowerCase().includes(search.toLowerCase())
        ))
  );

  // 🔹 Handle checkbox selection
  const handleCheckboxChange = (checked, id) => {
    setSelectedDoctors((prev) =>
      checked ? [...prev, id] : prev.filter((d) => d !== id)
    );
  };

  // 🔹 Form submission
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (selectedDoctors.length === 0) {
      setErrors({ doctors: "Please select at least one doctor." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/hospital/${hospitalId}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId, doctors: selectedDoctors }),
      });

      if (!res.ok) throw new Error("Failed to add doctors");
      toast.success("Doctors added successfully!");
      setSelectedDoctors([]); // Reset selection
      setErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    specialty: "",
    mmc: "",
    hospitalconsultationdays: [],
    hospitalinouttime: {}, // { Monday: [{ from: "09:00", to: "12:00" }] }
    fee: "",
    contact: "",
    pincode: "",
    email: "",
  });

  const updateForm = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleDaySelection = (day) => {
    setFormData((prev) => {
      const updatedDays = prev.hospitalconsultationdays.includes(day)
        ? prev.hospitalconsultationdays.filter((d) => d !== day)
        : [...prev.hospitalconsultationdays, day];
      return { ...prev, hospitalconsultationdays: updatedDays };
    });
  };
  const addTimeSlot = (day) => {
    setFormData((prev) => {
      const updatedSlots = {
        ...prev.hospitalinouttime,
        [day]: [...(prev.hospitalinouttime[day] || []), { from: "", to: "" }],
      };
      return { ...prev, hospitalinouttime: updatedSlots };
    });
  };
  const removeTimeSlot = (day, index) => {
    setFormData((prev) => {
      const slots = [...(prev.hospitalinouttime[day] || [])];
      slots.splice(index, 1);
      return {
        ...prev,
        hospitalinouttime: { ...prev.hospitalinouttime, [day]: slots },
      };
    });
  };
  const handleTimeChange = (day, index, key, value) => {
    setFormData((prev) => {
      const daySlots = [...(prev.hospitalinouttime[day] || [])];
      daySlots[index][key] = value;
      return {
        ...prev,
        hospitalinouttime: { ...prev.hospitalinouttime, [day]: daySlots },
      };
    });
  };
  const validateForm = (formData) => {
    const errors = [];

    // Required text fields
    if (!formData.firstName) errors.push("First Name is required.");
    if (!formData.lastName) errors.push("Last Name is required.");
    if (!formData.specialty) errors.push("Specialty must be selected.");
    if (!formData.mmc) errors.push("MMC Registration Number is required.");
    if (!formData.contact) errors.push("Mobile Number is required.");
    if (!formData.email) errors.push("Email is required.");
    if (!formData.fee) errors.push("Consultation Fee is required.");
    if (!formData.aadharcardno) errors.push("Aadhar Card Number is required.");
    if (!formData.pincode) errors.push("Pincode is required.");
    if (formData.hospitalconsultationdays.length === 0)
      errors.push("At least one consultation day must be selected.");

    // Validate Aadhaar Number
    if (!/^\d{12}$/.test(formData.aadharcardno))
      errors.push("Aadhar Card Number must be 12 digits.");

    // Validate Mobile Number
    if (!/^\d{10}$/.test(formData.contact))
      errors.push("Mobile Number must be 10 digits.");

    // Validate Email Format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.push("Invalid email format.");

    // Validate Pincode
    if (!/^\d{6}$/.test(formData.pincode))
      errors.push("Pincode must be 6 digits.");

    // Validate OPD Timings
    for (const day of formData.hospitalconsultationdays) {
      const slots = formData.hospitalinouttime?.[day];
      if (!slots || slots.length === 0) {
        errors.push(`At least one time slot must be added for ${day}.`);
      } else {
        for (const slot of slots) {
          if (!slot.from || !slot.to) {
            errors.push(
              `All time slots for ${day} must have both from and to times.`
            );
          }
        }
      }
    }

    return errors;
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (errors.length > 0) {
      toast.error("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }
    const payload = {
      firstName: formData.firstName.trim(),
      middleName: formData.middleName.trim(),
      lastName: formData.lastName.trim(),
      specialtyId: formData.specialty,
      mmcRegistrationNumber: formData.mmc,
      consultationDays: formData.hospitalconsultationdays,
      opdTimings: formData.hospitalinouttime, // This is a map of { day: [{ from, to }] }
      consultationFee: formData.fee,
      contactNumber: formData.contact,
      pincode: formData.pincode,
      email: formData.email,
      aadharcardno: formData.aadharcardno,
      hospitalId,
    };

    try {
      const response = await fetch(
        `/api/hospital/${hospitalId}/doctors/create-doctors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit doctor");
      }

      const data = await response.json();
      console.log("Doctor submitted successfully:", data);
      // Optionally reset form or show success toast
    } catch (error) {
      console.error("Submission error:", error.message);
      // Show error toast or dialog
    }
  };

  return (
    <>
      {" "}
      <Dialog>
        <div className="flex justify-end">
          <DialogTrigger>
            <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-500  hover:opacity-100 transition-none">
              Add Doctors From Aarogya Aadhar
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="xs:max-w-[90%] md:max-w-lg max-h-[75vh] bg-gradient-to-br from-white to-blue-50 overflow-y-auto">
          <DialogHeader>
            <DialogDescription>
              <div className=" flex flex-col text-center items-center justify-center">
              <DialogTitle className="text-center text-xl font-bold text-[#243460]">Hospital Doctors</DialogTitle>
              <DialogTitle className="text-center text-lg font-bold text-[#243460]">Select Doctors</DialogTitle>
            </div>
            </DialogDescription>
          </DialogHeader>
                <form
                  onSubmit={onSubmit}
                >
                  <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Select Speciality</Label>
                        {/* Specialty Selection */}
                        <Select
                          onValueChange={setSelectedSpecialty}
                          value={selectedSpecialty}
                        >
                          <SelectTrigger className="w-full border">
                            <SelectValue placeholder="Select Speciality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {specialties.map((specialty) => (
                                <SelectItem
                                  key={specialty.id}
                                  value={specialty.speciality.id}
                                >
                                  {specialty.speciality.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {errors.specialty && (
                          <p className="text-red-500 text-sm">{errors.specialty}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Search Doctor</Label>
                        {/* Search Box */}
                        <Input
                          type="text"
                          placeholder="Search Doctor"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      {/* Doctor List */}
                      <div className="rounded p-2 max-h-40 overflow-y-auto border">
                        {filteredDoctors.length > 0 ? (
                          filteredDoctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              className="flex items-center gap-4 p-2 border-b last:border-none"
                            >
                              {/* Doctor Image */}
                              <Image
                                src={
                                  doctor.doctorinfo?.passportphoto ||
                                  "/default-avatar.png"
                                }
                                width={400}
                                height={400}
                                alt={`${doctor.firstName} ${doctor.lastName}`}
                                className="w-10 h-10 rounded-full object-cover border"
                              />

                              {/* Doctor Details */}
                              <div className="flex flex-col flex-1">
                                <span className="text-sm font-medium">
                                  {doctor.firstName} {doctor.lastName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {doctor.email} |{" "}
                                  {doctor.DoctorCertificate?.[0]?.cardNo ||
                                    "No Card No"}
                                </span>
                              </div>

                              {/* Checkbox */}
                              <Checkbox
                                id={doctor.id}
                                checked={selectedDoctors.includes(doctor.id)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(checked, doctor.id)
                                }
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm text-center p-4">
                            No doctors found
                          </p>
                        )}
                      </div>

                      {errors.doctors && (
                        <p className="text-red-500 text-sm">{errors.doctors}</p>
                      )}
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
      <>
        {/* Add Doctor Manually Dialog */}
        <Dialog>
          <div className="flex justify-end ">
            <DialogTrigger>
              <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-500 hover:opacity-100 transition-none">
                Create Doctor Manually
              </Button>
            </DialogTrigger>
          </div>

          <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
            <DialogHeader>
              <DialogDescription>
                <div className=" flex flex-col text-center items-center justify-center">
              <DialogTitle className="text-center text-xl font-bold text-[#243460]">Hospital Doctors</DialogTitle>
              <DialogTitle className="text-center text-lg font-bold text-[#243460]">Create Doctor</DialogTitle>
            </div>
            </DialogDescription>
            </DialogHeader>
                <form onSubmit={handleManualSubmit}>
                  <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                    <div className="grid grid-cols-1  gap-3">
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Enter First Name*</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                            <FaUser />
                          </span>
                          <Input
                            placeholder="First Name"
                            className="!pl-8"
                            value={formData.firstName}
                            onChange={(e) => updateForm("firstName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Enter Middel Name*</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                            <FaUser />
                          </span>
                          <Input
                            className="!pl-8"
                            placeholder="Middle Name"
                            value={formData.middleName}
                            onChange={(e) => updateForm("middleName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Enter Last Name*</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                            <FaUser />
                          </span>
                          <Input
                            className="!pl-8"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => updateForm("lastName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        {/* Specialty Dropdown */}
                        <Label className="text-[#243460] font-semibold ml-0">Select Speciality*</Label>
                        <Select
                          value={formData.specialty}
                          onValueChange={(val) => updateForm("specialty", val)}
                        >
                          <SelectTrigger className=" pl-4 border-[1px] border-[#243460]">
                            <SelectValue placeholder="Select Speciality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {specialties.map((specialty) => (
                                <SelectItem
                                  key={specialty.id}
                                  value={specialty.speciality.id}
                                >
                                  {specialty.speciality.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Enter Doctor MMC Reg No*</Label>
                        {/* MMC Registration */}
                        <Input
                          placeholder="Doctor MMC Reg No"
                          value={formData.mmc}
                          className="pl-4"
                          onChange={(e) => updateForm("mmc", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Enter Consultation Fee*</Label>
                        <Input
                          placeholder="Consultation Fee"
                          type="text"
                          value={formData.fee}
                          className="pl-4"
                          onChange={(e) => updateForm("fee", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ">Enter Phone Number*</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                                  <FiPhone />
                                </span>
                        <Input
                          placeholder="Mobile No"
                          value={formData.contact}
                          className="pl-8"
                          onChange={(e) => updateForm("contact", e.target.value)}
                        />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Enter Email ID*</Label>
                        <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                                  <FiMail />
                                </span>
                        <Input
                          placeholder="Enter Email ID"
                          type="email"
                          value={formData.email}
                          className="!pl-8"
                          onChange={(e) => updateForm("email", e.target.value)}
                        />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Aadhar Card No*</Label>
                        <Input
                          placeholder="Aadhar Card No"
                          value={formData.aadharcardno}
                          type="text"
                          maxLength={12}
                          minLength={12}
                          className="pl-4"
                          onChange={(e) => updateForm("aadharcardno", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-[#243460] font-semibold ml-0">Pincode*</Label>
                        <Input
                          placeholder="Pincode"
                          value={formData.pincode}
                          className="pl-4"
                          onChange={(e) => updateForm("pincode", e.target.value)}
                        />
                      </div>
                      <div className=" bg-white rounded-xl shadow-md">
                        <Label className="text-[#243460] font-semibold ">
                          Select Consultation Days:
                        </Label>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {[
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ].map((day) => (
                            <div
                              key={day}
                              className="h-10 flex truncate items-center gap-2 bg-gray-100 p-3 rounded-xl shadow-sm"
                            >
                              <input
                                type="checkbox"
                                value={day}
                                checked={formData.hospitalconsultationdays.includes(
                                  day
                                )}
                                onChange={() => handleDaySelection(day)}
                                className="w-4 h-4 accent-blue-500"
                              />
                              <span className="text-xs font-medium">{day}</span>
                              <button
                                type="button"
                                onClick={() => addTimeSlot(day)}
                                className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-xl"
                              >
                                + Add Slot
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Time Slots */}
                        <div className="mt-4 space-y-2">
                          {Object.entries(formData.hospitalinouttime || {}).map(
                            ([day, slots]) =>
                              (slots || []).map((slot, index) => (
                                <div
                                  key={`${day}-${index}`}
                                  className="flex flex-wrap justify-center lg:flex-nowrap items-center gap-2 p-3 border border-gray-200 rounded-xl"
                                >
                                  <span className="text-xs font-semibold w-full sm:w-auto">
                                    {day}
                                  </span>

                                  <TimePicker
                                    onChange={(time) =>
                                      handleTimeChange(day, index, "from", time)
                                    }
                                    value={slot.from || ""}
                                    clockIcon={
                                      <span className="text-gray-500">🕒</span>
                                    }
                                    clearIcon={null}
                                    format="hh:mm a"
                                    className="border rounded p-1 text-xs w-full sm:w-auto"
                                  />

                                  <span className="text-sm">to</span>

                                  <TimePicker
                                    onChange={(time) =>
                                      handleTimeChange(day, index, "to", time)
                                    }
                                    value={slot.to || ""}
                                    clockIcon={
                                      <span className="text-gray-500">🕒</span>
                                    }
                                    clearIcon={null}
                                    format="hh:mm a"
                                    className="border rounded p-1 text-xs w-full sm:w-auto"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeTimeSlot(day, index)}
                                    className="xs:mx-auto md:ml-auto bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-xl"
                                  >
                                    <IoClose className=" inline-block h-4 w-4" />
                                    Remove
                                  </button>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                      <div className="!mt-6 text-center">
                        <Button
                          type="submit"
                          className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                          disabled={loading}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* OPD Timing Section */}

                </form>
              
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}
