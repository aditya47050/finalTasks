"use client";

import { useState } from "react";
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

export default function AddBranchDialog({ pharmacyId }) {
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

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.regname) return toast.error("Enter branch name");
    try {
      setLoading(true);
      const res = await fetch(`/api/pharmacy/${pharmacyId}/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add branch");
      toast.success("Branch added");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[#243460] font-semibold">Branch Name*</label>
              <input
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                value={form.regname}
                onChange={(e) => setField("regname", e.target.value)}
                placeholder="Enter Branch Name"
              />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Reg. No</label>
              <input
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                value={form.regno}
                onChange={(e) => setField("regno", e.target.value)}
                placeholder="Enter Registration No"
              />
            </div>
          </div>

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

          <div className="grid md:grid-cols-3 gap-6">
            <input
              placeholder="City"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
            />
            <input
              placeholder="State"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.state}
              onChange={(e) => setField("state", e.target.value)}
            />
            <input
              placeholder="Pincode"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.pincode}
              onChange={(e) => setField("pincode", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <input
              placeholder="District"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.dist}
              onChange={(e) => setField("dist", e.target.value)}
            />
            <input
              placeholder="Taluka"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.taluka}
              onChange={(e) => setField("taluka", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              placeholder="Reception No 1"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.receptionno1}
              onChange={(e) => setField("receptionno1", e.target.value)}
            />
            <input
              placeholder="Reception No 2"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.receptionno2}
              onChange={(e) => setField("receptionno2", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              placeholder="Reception Email"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.receptionemail}
              onChange={(e) => setField("receptionemail", e.target.value)}
            />
            <input
              placeholder="Branch Manager Name"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.branchmanagername}
              onChange={(e) => setField("branchmanagername", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              placeholder="Branch Manager No"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.branchmanagerno}
              onChange={(e) => setField("branchmanagerno", e.target.value)}
            />
            <input
              placeholder="Branch Manager Email"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl"
              value={form.branchmanageremail}
              onChange={(e) => setField("branchmanageremail", e.target.value)}
            />
          </div>

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
