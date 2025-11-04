"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AddPharmacistDialog({ pharmacyId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState({});
  const [form, setForm] = useState({
    regno: "",
    fullname: "",
    regdate: null,
    panno: "",
    pandoc: "",
    gender: "",
    aadharno: "",
    aadharfront: "",
    aadharback: "",
    profilepic: "",
  });

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const setUploadBusy = (key, v) => setUploadLoading((prev) => ({ ...prev, [key]: v }));

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!form.fullname) return toast.error("Enter full name");
    try {
      setLoading(true);
      const payload = {
        ...form,
        regdate: form.regdate ? form.regdate.toISOString() : null,
      };
      const res = await fetch(`/api/pharmacy/${pharmacyId}/pharmacists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { const j = await res.json(); msg = j?.error || msg; } catch {}
        throw new Error(msg);
      }
      toast.success("Pharmacist added");
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
        <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-600">Add Pharmacist</Button>
      </DialogTrigger>

      <DialogContent className="xs:max-w-[90%] md:max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#243460]">Add Pharmacist</DialogTitle>
          <DialogDescription className="text-center">Provide pharmacist details and upload required documents.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[#243460] font-semibold">Full Name*</label>
              <input
                className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                  form.fullname.trim() === "" ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#5271FF]"
                }`}
                value={form.fullname}
                onChange={(e) => setField("fullname", e.target.value)}
                onBlur={() => {
                  if (!form.fullname.trim()) toast.error("Enter full name");
                }}
                placeholder="Enter Full Name"
              />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Pharmacist Reg. No</label>
              <input
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                value={form.regno}
                onChange={(e) =>
                  setField("regno", e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                }
                onBlur={() => {
                  if (!form.regno) toast.error("Enter Registration No");
                }}
                placeholder="Enter Registration No"
              />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Pharmacist Reg. Date</label>
              <DatePicker selected={form.regdate} onChange={(d) => setField("regdate", d)} dateFormat="dd/MM/yyyy" maxDate={new Date()} showYearDropdown showMonthDropdown placeholderText="DD/MM/YYYY" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Gender</label>
              <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.gender} onChange={(e) => setField("gender", e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Aadhar Number</label>
              <input
                className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                  form.aadharno && form.aadharno.length !== 12 ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#5271FF]"
                }`}
                value={form.aadharno}
                maxLength={12}
                onChange={(e) => setField("aadharno", e.target.value.replace(/\D/g, ""))}
                onBlur={() => {
                  if (form.aadharno && form.aadharno.length !== 12) toast.error("Aadhar number must be 12 digits");
                }}
                placeholder="Enter Aadhar Number"
              />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">PAN Number</label>
              <input
                  className={`w-full h-12 px-4 border-2 rounded-xl transition-all duration-300 ${
                    form.panno && !/^[A-Z0-9]+$/.test(form.panno.toUpperCase())
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-[#5271FF]"
                  }`}
                  value={form.panno}
                  onChange={(e) =>
                    setField("panno", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
                  }
                  onBlur={() => {
                    if (!form.panno) toast.error("Enter PAN Number");
                  }}
                  placeholder="Enter PAN Number"
                />
            </div>
            <div>
              <label className="text-[#243460] font-semibold">PAN Document</label>
              <div className="relative">
                <input className="w-full h-12 pr-[12%] px-4 border-2 border-gray-200 rounded-xl" value={form.pandoc || ""} readOnly placeholder="Uploaded file URL" />
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          {uploadLoading.pandoc ? <Loader2 className="animate-spin w-4 h-4" /> : ready && <div>Upload</div>}
                        </div>
                      );
                    },
                    allowedContent: () => ".png,.jpg,.jpeg,.pdf",
                  }}
                  appearance={{
                    container: "absolute right-2 top-1/2 -translate-y-1/2 w-[25%] h-8",
                    button: "w-full h-full bg-[#243460] text-white text-[11px] font-semibold rounded-xl",
                    allowedContent: "hidden",
                  }}
                  onUploadBegin={() => setUploadBusy("pandoc", true)}
                  onClientUploadComplete={(res) => {
                    setUploadBusy("pandoc", false);
                    if (res?.length) setField("pandoc", res[0].url);
                    toast.success("Upload completed");
                  }}
                  onUploadError={(e) => {
                    setUploadBusy("pandoc", false);
                    toast.error(e.message);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Aadhar Front</label>
              <div className="relative">
                <input className="w-full h-12 pr-[12%] px-4 border-2 border-gray-200 rounded-xl" value={form.aadharfront || ""} readOnly placeholder="Uploaded file URL" />
                <UploadButton endpoint="fileUploader" content={{ button({ ready }) { return <div className="w-full h-full flex items-center justify-center">{uploadLoading.aadharfront ? <Loader2 className="animate-spin w-4 h-4" /> : ready && <div>Upload</div>}</div>; }, allowedContent: () => ".png,.jpg,.jpeg,.pdf", }} appearance={{ container: "absolute right-2 top-1/2 -translate-y-1/2 w-[25%] h-8", button: "w-full h-full bg-[#243460] text-white text-[11px] font-semibold rounded-xl", allowedContent: "hidden" }} onUploadBegin={() => setUploadBusy("aadharfront", true)} onClientUploadComplete={(res) => { setUploadBusy("aadharfront", false); if (res?.length) setField("aadharfront", res[0].url); toast.success("Upload completed"); }} onUploadError={(e) => { setUploadBusy("aadharfront", false); toast.error(e.message); }} />
              </div>
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Aadhar Back</label>
              <div className="relative">
                <input className="w-full h-12 pr-[12%] px-4 border-2 border-gray-200 rounded-xl" value={form.aadharback || ""} readOnly placeholder="Uploaded file URL" />
                <UploadButton endpoint="fileUploader" content={{ button({ ready }) { return <div className="w-full h-full flex items-center justify-center">{uploadLoading.aadharback ? <Loader2 className="animate-spin w-4 h-4" /> : ready && <div>Upload</div>}</div>; }, allowedContent: () => ".png,.jpg,.jpeg,.pdf", }} appearance={{ container: "absolute right-2 top-1/2 -translate-y-1/2 w-[25%] h-8", button: "w-full h-full bg-[#243460] text-white text-[11px] font-semibold rounded-xl", allowedContent: "hidden" }} onUploadBegin={() => setUploadBusy("aadharback", true)} onClientUploadComplete={(res) => { setUploadBusy("aadharback", false); if (res?.length) setField("aadharback", res[0].url); toast.success("Upload completed"); }} onUploadError={(e) => { setUploadBusy("aadharback", false); toast.error(e.message); }} />
              </div>
            </div>
            <div>
              <label className="text-[#243460] font-semibold">Profile Photo</label>
              <div className="flex items-center gap-3 mt-2">
                <UploadButton endpoint="fileUploader" content={{ button({ ready }) { return <div>{uploadLoading.profilepic ? <Loader2 className="animate-spin w-4 h-4" /> : (ready && <div>Upload Photo</div>)}</div>; }, allowedContent: () => ".png,.jpg,.jpeg,.pdf", }} appearance={{ button: "w-auto bg-[#243460] text-white text-xs font-bold rounded-xl px-3 py-2", container: "rounded-xl" }} onUploadBegin={() => setUploadBusy("profilepic", true)} onClientUploadComplete={(res) => { setUploadBusy("profilepic", false); if (res?.length) { setField("profilepic", res[0].url); toast.success("Photo uploaded"); } }} onUploadError={(err) => { setUploadBusy("profilepic", false); toast.error(err.message); }} />
                <div className="w-16 h-16 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                  {form.profilepic ? <img src={form.profilepic} alt="profile" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Photo</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="!mt-6 text-center">
            <Button type="submit" disabled={loading} className="w-full bg-[#5271FF] hover:bg-[#405dff] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition">
              {loading ? "Saving..." : "Create Pharmacist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}