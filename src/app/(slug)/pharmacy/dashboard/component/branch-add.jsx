"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

export default function AddBranchDialog({
  pharmacyId,
  states = [],
  districts = [],
  subDistricts = [],
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    regname: "",
    regno: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    dist: "",
    taluka: "",
    receptionno1: "",
    receptionno2: "",
    receptionemail: "",
    branchmanagername: "",
    branchmanagerno: "",
    branchmanageremail: "",
  });

  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedTalukaId, setSelectedTalukaId] = useState("");

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  // ===== Validation patterns =====
  const onlyLetters = /^[A-Za-z\s]*$/;
  const onlyNumbers = /^[0-9]*$/;
  const alphanumeric = /^[A-Za-z0-9]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ===== On Change Validation =====
  const handleChange = (field, value) => {
    switch (field) {
      case "regname":
      case "branchmanagername":
      case "city":
        if (!onlyLetters.test(value)) return;
        break;

      case "regno":
        if (!alphanumeric.test(value)) return;
        break;

      case "pincode":
      case "receptionno1":
      case "receptionno2":
      case "branchmanagerno":
        if (!onlyNumbers.test(value)) return;
        break;

      default:
        break;
    }

    setField(field, value);
  };

  // ===== Normalizers =====
  const normalizeStates = useMemo(
    () =>
      (Array.isArray(states) ? states : []).map((s) => ({
        id: String(s.id ?? s._id ?? ""),
        name: s.stateName ?? "",
      })),
    [states]
  );

  const normalizeDistricts = useMemo(
    () =>
      (Array.isArray(districts) ? districts : []).map((d) => ({
        id: String(d.id ?? d._id ?? ""),
        name: d.district ?? "",
        parentId: String(d.stateId ?? ""),
      })),
    [districts]
  );

  const normalizeTalukas = useMemo(
    () =>
      (Array.isArray(subDistricts) ? subDistricts : []).map((t) => ({
        id: String(t.id ?? t._id ?? ""),
        name: t.subDistrict ?? "",
        parentId: String(t.districtId ?? ""),
      })),
    [subDistricts]
  );

  // ===== Filters =====
  const filteredDistricts = normalizeDistricts.filter(
    (d) => d.parentId === selectedStateId
  );
  const filteredTalukas = normalizeTalukas.filter(
    (t) => t.parentId === selectedDistrictId
  );

  // ===== Handlers =====
  const handleStateSelect = (stateId) => {
    setSelectedStateId(stateId || "");
    setSelectedDistrictId("");
    setSelectedTalukaId("");
    const st = normalizeStates.find((s) => s.id === stateId);
    setForm((prev) => ({ ...prev, state: st ? st.name : "", dist: "", taluka: "" }));
  };

  const handleDistrictSelect = (districtId) => {
    setSelectedDistrictId(districtId || "");
    setSelectedTalukaId("");
    const dt = normalizeDistricts.find((d) => d.id === districtId);
    setForm((prev) => ({ ...prev, dist: dt ? dt.name : "", taluka: "" }));
  };

  const handleTalukaSelect = (talukaId) => {
    setSelectedTalukaId(talukaId || "");
    const t = normalizeTalukas.find((x) => x.id === talukaId);
    setForm((prev) => ({ ...prev, taluka: t ? t.name : "" }));
  };

  // ===== Final Submit Validation =====
  const submit = async (e) => {
    e.preventDefault();

    if (!form.regname) return toast.error("Enter branch name");
    if (!form.city) return toast.error("Enter city");
    if (!form.pincode || form.pincode.length !== 6)
      return toast.error("Enter valid 6-digit pincode");
    if (form.receptionemail && !emailRegex.test(form.receptionemail))
      return toast.error("Enter valid reception email");
    if (form.branchmanageremail && !emailRegex.test(form.branchmanageremail))
      return toast.error("Enter valid branch manager email");
    if (form.receptionno1 && form.receptionno1.length !== 10)
      return toast.error("Reception No 1 must be 10 digits");
    if (form.branchmanagerno && form.branchmanagerno.length !== 10)
      return toast.error("Branch Manager No must be 10 digits");

    try {
      setLoading(true);
      const res = await fetch(`/api/pharmacy/${pharmacyId}/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to add branch");
      }

      toast.success("Branch added successfully!");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err?.message || "Error while adding branch");
    } finally {
      setLoading(false);
    }
  };

  // ===== UI =====
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-600">
          Add Branch
        </Button>
      </DialogTrigger>

      <DialogContent className="xs:max-w-[90%] md:max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#243460]">
            Add Branch
          </DialogTitle>
          <DialogDescription className="text-center">
            Provide branch details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-6">
          {/* Branch Name & Reg No */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[#243460] font-semibold">Branch Name*</label>
              <input
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                value={form.regname}
                onChange={(e) => handleChange("regname", e.target.value)}
                placeholder="Enter Branch Name"
              />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Reg. No</label>
              <input
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                value={form.regno}
                onChange={(e) => handleChange("regno", e.target.value)}
                placeholder="Enter Registration No"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-[#243460] font-semibold">Address</label>
            <textarea
              rows={2}
              className="w-full px-4 border-2 border-gray-200 rounded-xl"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="Branch Address"
            />
          </div>

          {/* City / Pincode */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[#243460] font-semibold">City*</label>
              <input
                placeholder="City"
                className="h-12 px-4 border-2 border-gray-200 rounded-xl w-full"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Pincode*</label>
              <input
                placeholder="Pincode"
                maxLength={6}
                className="h-12 px-4 border-2 border-gray-200 rounded-xl w-full"
                value={form.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
              />
            </div>
          </div>

          {/* State / District / Taluka */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-[#243460] font-semibold">State*</label>
              <select
                className="h-12 w-full px-4 border-2 border-gray-200 rounded-xl"
                value={selectedStateId}
                onChange={(e) => handleStateSelect(e.target.value)}
              >
                <option value="">Select State</option>
                {normalizeStates.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#243460] font-semibold">District*</label>
              <select
                className="h-12 w-full px-4 border-2 border-gray-200 rounded-xl"
                value={selectedDistrictId}
                onChange={(e) => handleDistrictSelect(e.target.value)}
                disabled={!selectedStateId}
              >
                <option value="">Select District</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#243460] font-semibold">Taluka*</label>
              <select
                className="h-12 w-full px-4 border-2 border-gray-200 rounded-xl"
                value={selectedTalukaId}
                onChange={(e) => handleTalukaSelect(e.target.value)}
                disabled={!selectedDistrictId}
              >
                <option value="">Select Taluka</option>
                {filteredTalukas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

{/* Reception Numbers */}
<div className="grid md:grid-cols-2 gap-6">
  <div>
    <label className="text-[#243460] font-semibold">Reception No 1</label>
    <input
      placeholder="Reception No 1"
      className={`h-12 px-4 border-2 rounded-xl w-full transition-all duration-300 ${
        form.receptionno1 && !/^\d{10}$/.test(form.receptionno1)
          ? "border-red-400 focus:border-red-500"
          : "border-gray-200 focus:border-[#5271FF]"
      }`}
      value={form.receptionno1}
      maxLength={10}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, ""); // allow only digits
        setField("receptionno1", value);
      }}
      onBlur={() => {
        if (form.receptionno1 && !/^\d{10}$/.test(form.receptionno1)) {
          toast.error("Reception No 1 must be a valid 10-digit number");
        }
      }}
    />
  </div>

  <div>
    <label className="text-[#243460] font-semibold">Reception No 2</label>
    <input
      placeholder="Reception No 2"
      className={`h-12 px-4 border-2 rounded-xl w-full transition-all duration-300 ${
        form.receptionno2 && !/^\d{10}$/.test(form.receptionno2)
          ? "border-red-400 focus:border-red-500"
          : "border-gray-200 focus:border-[#5271FF]"
      }`}
      value={form.receptionno2}
      maxLength={10}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        setField("receptionno2", value);
      }}
      onBlur={() => {
        if (form.receptionno2 && !/^\d{10}$/.test(form.receptionno2)) {
          toast.error("Reception No 2 must be a valid 10-digit number");
        }
      }}
    />
  </div>
</div>

{/* Reception Email / Branch Manager Name */}
<div className="grid md:grid-cols-2 gap-6">
  <div>
    <label className="text-[#243460] font-semibold">Reception Email</label>
    <input
      placeholder="Reception Email"
      className={`h-12 px-4 border-2 rounded-xl w-full transition-all duration-300 ${
        form.receptionemail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.receptionemail)
          ? "border-red-400 focus:border-red-500"
          : "border-gray-200 focus:border-[#5271FF]"
      }`}
      value={form.receptionemail}
      onChange={(e) => setField("receptionemail", e.target.value)}
      onBlur={() => {
        if (
          form.receptionemail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.receptionemail)
        ) {
          toast.error("Enter a valid Reception Email");
        }
      }}
    />
  </div>

  <div>
    <label className="text-[#243460] font-semibold">Branch Manager Name</label>
    <input
      placeholder="Branch Manager Name"
      className="h-12 px-4 border-2 border-gray-200 rounded-xl w-full focus:border-[#5271FF]"
      value={form.branchmanagername}
      onChange={(e) => setField("branchmanagername", e.target.value)}
    />
  </div>
</div>

{/* Branch Manager No / Email */}
<div className="grid md:grid-cols-2 gap-6">
  <div>
    <label className="text-[#243460] font-semibold">Branch Manager No</label>
    <input
      placeholder="Branch Manager No"
      className={`h-12 px-4 border-2 rounded-xl w-full transition-all duration-300 ${
        form.branchmanagerno && !/^\d{10}$/.test(form.branchmanagerno)
          ? "border-red-400 focus:border-red-500"
          : "border-gray-200 focus:border-[#5271FF]"
      }`}
      value={form.branchmanagerno}
      maxLength={10}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        setField("branchmanagerno", value);
      }}
      onBlur={() => {
        if (form.branchmanagerno && !/^\d{10}$/.test(form.branchmanagerno)) {
          toast.error("Branch Manager No must be a valid 10-digit number");
        }
      }}
    />
  </div>

  <div>
    <label className="text-[#243460] font-semibold">Branch Manager Email</label>
    <input
      placeholder="Branch Manager Email"
      className={`h-12 px-4 border-2 rounded-xl w-full transition-all duration-300 ${
        form.branchmanageremail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.branchmanageremail)
          ? "border-red-400 focus:border-red-500"
          : "border-gray-200 focus:border-[#5271FF]"
      }`}
      value={form.branchmanageremail}
      onChange={(e) => setField("branchmanageremail", e.target.value)}
      onBlur={() => {
        if (
          form.branchmanageremail &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.branchmanageremail)
        ) {
          toast.error("Enter a valid Branch Manager Email");
        }
      }}
    />
  </div>
</div>


          {/* Submit */}
          <div className="!mt-6 text-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5271FF] hover:bg-[#405dff] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
            >
              {loading ? "Saving..." : "Create Branch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
