"use client";
// @ts-nocheck

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FaUser } from 'react-icons/fa6';
import { Label } from '@/components/ui/label';
import { FiMail, FiPhone } from 'react-icons/fi';

export default function CreateReceptionist({ hospitalId }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    if (form.password && form.password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/hospital/${hospitalId}/receptionists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create receptionist");
      toast({ title: "Receptionist created" });
      setOpen(false);
      setForm({ name: "", email: "", mobile: "", password: "" });
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-500 hover:opacity-100 transition-none">
  Create Receptionist
</Button>

      </DialogTrigger>
      <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        <DialogHeader>
          <div className=" flex text-center items-center justify-center">
            <DialogTitle className="text-center text-xl font-bold text-[#243460]">Create Receptionist</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <div className="grid grid-cols-1  gap-3">
              <div>
                <Label className="text-[#243460] font-semibold ml-0">Your Full Name*</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                    <FaUser />
                  </span>
                  <Input name="name" className=" pl-8" placeholder="Enter Your Full Name" value={form.name} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label className="text-[#243460] font-semibold ">Enter Email ID*</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                    <FiMail />
                  </span>
                  <Input name="email" className="pl-8" placeholder="Enter Your Email ID" type="email" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label className="text-[#243460] font-semibold ">Enter Phone Number*</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                    <FiPhone />
                  </span>
                <Input name="mobile" className="pl-8" placeholder="Enter 10-Digit Mobile Number" value={form.mobile} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label className="text-[#243460] font-semibold ">Enter Password (Optional)*</Label>
                <Input name="password" placeholder="Enter Password (optional)" type="password" value={form.password} onChange={handleChange} />
              </div>
            </div>
            <div className="!mt-6 text-center">
              <Button type="submit" disabled={loading} className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-1 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition">
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


