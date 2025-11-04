"use client";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import PharmacyProfilePreview from "./pharmacy-profile-preview";

const ACCOUNT_TYPES = ["Saving", "Current"];
const BANK_OPTIONS = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function UploadInput({ label, value, onChange, onUploadBegin, onUploadDone, busy, placeholder = "Upload file" }) {
    return (
        <div>
            <label className="text-[#243460] font-semibold">{label}</label>
            <div className="relative">
                <input
                    className="w-full h-12 pr-[12%] px-4 border-2 border-gray-200 rounded-xl"
                    value={value ? "Uploaded" : ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    readOnly
                />
                <UploadButton
                    endpoint="fileUploader"
                    content={{
                        button({ ready }) {
                            return (
                                <div className="w-full h-full flex items-center justify-center">
                                    {busy ? <Loader2 className="animate-spin w-4 h-4" /> : ready && <div>Upload</div>}
                                </div>
                            );
                        },
                        allowedContent: () => "",
                    }}
                    appearance={{
                        container: "absolute right-2 top-1/2 -translate-y-1/2 w-[25%] h-8",
                        button: "w-full h-full bg-[#243460] text-white text-[11px] font-semibold rounded-xl",
                        allowedContent: "hidden",
                    }}
                    onUploadBegin={onUploadBegin}
                    onClientUploadComplete={(res) => {
                        const url = res?.[0]?.url || null;
                        onUploadDone(url);
                        if (url) toast.success("Upload completed");
                    }}
                    onUploadError={(err) => {
                        toast.error(err.message);
                        onUploadDone(null);
                    }}
                />
            </div>
        </div>
    );
}

export default function PharmacyProfileClient({ states, districts, subDistricts, existingProfile }) {
    const [step, setStep] = useState(1);
    const [uploadLoading, setUploadLoading] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [sendOtpLoading, setSendOtpLoading] = useState(false);
    const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [form, setForm] = useState({
        email: existingProfile?.email || "",
        mobile: existingProfile?.mobile || "",
        pincode: existingProfile?.pincode || "",
        regname: "",
        regno: "",
        regdate: null,
        regcertificate: "",
        pharmacypancardno: "",
        pharmacypancarddoc: "",
        servicetimeinday: "",
        serviceStartTime: "",
        serviceEndTime: "",
        servicetimeinweek: [],
        onlineplotformservice: "",
        homedelivery: "",
        pharmacytype: "",
        TotalregPharmacist: "",

        fulladdress: "",
        city: "",
        state: "",
        district: "",
        taluka: "",
        primarycontactno: "",
        alternatemobile: "",
        secondaryemail: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountType: "",
        cancelledCheque: "",
        micrCode: "",
        aboutus: "",
        pharmacylogo: "",
    });

    const setField = (name, value) => {
  // ✅ Define validation patterns
  const onlyDigits = /^[0-9]*$/;
  const alphanumeric = /^[A-Za-z0-9]*$/;
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/; // e.g., HDFC0001234
  const micrPattern = /^[0-9]{9}$/; // 9 digits

  // 🧾 Pharmacy Registration Number — alphanumeric only, up to 20 chars
  if (name === "regno") {
    if (!alphanumeric.test(value)) return;
    if (value.length > 20) return;
  }

  // 🪪 PAN — strict format (ABCDE1234F)
  if (name === "pharmacypancardno") {
    value = value.toUpperCase();
    if (!/^[A-Z0-9]*$/.test(value)) return;
    if (value.length > 10) return;
  }

  // 💳 Account Number — digits only (max 18)
  if (name === "accountNumber") {
    if (!onlyDigits.test(value)) return;
    if (value.length > 18) return;
  }

  // 🏦 IFSC Code — alphanumeric, formatted (max 11)
  if (name === "ifscCode") {
    value = value.toUpperCase().replace(/\s/g, "");
    if (!/^[A-Z0-9]*$/.test(value)) return;
    if (value.length > 11) return;
  }

  // 🔢 MICR Code — only digits, 9 max
  if (name === "micrCode") {
    if (!onlyDigits.test(value)) return;
    if (value.length > 9) return;
  }

  setForm((prev) => ({ ...prev, [name]: value }));
};

    const setUploadBusy = (key, v) => setUploadLoading((prev) => ({ ...prev, [key]: v }));

    const filteredDistricts = useMemo(() => {
        const st = states.find((s) => s.stateName === form.state);
        if (!st) return [];
        return districts.filter((d) => d.stateId === st.id);
    }, [form.state, states, districts]);

    const filteredSubDistricts = useMemo(() => {
        const dist = filteredDistricts.find((d) => d.district === form.district);
        if (!dist) return [];
        return subDistricts.filter((sd) => sd.districtId === dist.id);
    }, [filteredDistricts, form.district, subDistricts]);

    const toggleWeekday = (day) => {
        setForm((prev) => {
            const exists = prev.servicetimeinweek.includes(day);
            const next = exists ? prev.servicetimeinweek.filter((d) => d !== day) : [...prev.servicetimeinweek, day];
            return { ...prev, servicetimeinweek: next };
        });
    };

    // Multi-select dropdown for weekdays
    const [weekdaysQuery, setWeekdaysQuery] = useState("");
    const [weekdaysOpen, setWeekdaysOpen] = useState(false);
    const filteredWeekdays = useMemo(() => {
        if (!weekdaysQuery) return DAYS;
        return DAYS.filter((d) => d.toLowerCase().includes(weekdaysQuery.toLowerCase()));
    }, [weekdaysQuery]);

    // Service time dropdown open states
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    // Pharmacist count dropdown
    const [pharmCountOpen, setPharmCountOpen] = useState(false);

    // Email OTP handlers
    const sendOtp = async () => {
        if (!form.email) {
            toast.error("Enter Email");
            return;
        }
        setSendOtpLoading(true);
        try {
            const res = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email }),
            });
            if (!res.ok) throw new Error("Failed to send OTP");
            toast.success("OTP sent to your email");
            setOtpSent(true);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSendOtpLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Enter OTP");
            return;
        }
        setVerifyOtpLoading(true);
        try {
            const res = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, otp }),
            });
            if (!res.ok) throw new Error("Failed to verify OTP");
            toast.success("Email verified");
            setOtpVerified(true);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setVerifyOtpLoading(false);
        }
    };

    const saveProfile = async () => {
        try {
            if (!form.email) return toast.error("Enter Email");
            if (!form.mobile) return toast.error("Enter Mobile");
            if (!form.pincode) return toast.error("Enter Pincode");

            setSaveLoading(true);
            const payload = {
                ...form,
                regdate: form.regdate ? form.regdate.toISOString() : null,
                servicetimeinweek: Array.isArray(form.servicetimeinweek) ? form.servicetimeinweek : [],
                servicetimeinday: form.serviceStartTime && form.serviceEndTime ? `${form.serviceStartTime}-${form.serviceEndTime}` : form.servicetimeinday,
            };

            const res = await fetch("/api/pharmacy/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                let message = `HTTP ${res.status}`;
                try {
                    const j = await res.json();
                    message = j?.error || message;
                } catch {
                    const t = await res.text();
                    message = t || message;
                }
                throw new Error(message);
            }
            toast.success("Pharmacy profile saved");
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#243460] mb-2">Pharmacy Profile</h1>
                    <p className="text-[#5271FF] text-lg">Create your pharmacy profile</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s <= step ? "bg-[#5271FF] text-white" : "bg-white text-[#5271FF] border-2 border-[#5271FF]"}`}>
                                    {s}
                                </div>
                                {s < 3 && <div className={`flex-1 h-1 mx-4 ${s < step ? "bg-[#5271FF]" : "bg-gray-300"}`} />}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[#243460] font-semibold">Mobile*</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.mobile} onChange={(e) => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter Mobile" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#243460] font-semibold">Email*</label>
                                    <div className="relative">
                                        <input className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="Enter Email" />
                                        <Button type="button" onClick={sendOtp} disabled={otpSent || sendOtpLoading} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3">
                                            {sendOtpLoading ? (
                                                <span className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Sending...</span>
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#243460] font-semibold">Enter OTP</label>
                                    <div className="relative">
                                        <input className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter OTP" />
                                        <Button type="button" onClick={verifyOtp} disabled={verifyOtpLoading || otpVerified} className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3">
                                            {verifyOtpLoading ? (
                                                <span className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Verifying...</span>
                                            ) : otpVerified ? (
                                                "Verified"
                                            ) : (
                                                "Verify OTP"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">Pharmacy Reg. Name</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.regname} onChange={(e) => setField("regname", e.target.value)} placeholder="Enter Registration Name" />
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Pharmacy Reg. No.</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.regno} onChange={(e) => setField("regno", e.target.value)} placeholder="Enter Registration Number" />
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Pharmacy Reg. Date*</label>
                                    <DatePicker
                                        selected={form.regdate}
                                        onChange={(d) => setField("regdate", d)}
                                        dateFormat="dd/MM/yyyy"
                                        maxDate={new Date()}
                                        showYearDropdown
                                        showMonthDropdown
                                        placeholderText="DD/MM/YYYY"
                                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <UploadInput
                                    label="Pharmacy Reg. Certificate*"
                                    value={form.regcertificate}
                                    onChange={(v) => setField("regcertificate", v)}
                                    onUploadBegin={() => setUploadBusy("regcertificate", true)}
                                    onUploadDone={(url) => setUploadBusy("regcertificate", false) || (url && setField("regcertificate", url))}
                                    busy={uploadLoading.regcertificate}
                                />
                                <div>
                                    <label className="text-[#243460] font-semibold">Pharmacy PAN Card Number*</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.pharmacypancardno} onChange={(e) => setField("pharmacypancardno", e.target.value)} placeholder="Enter PAN Number" />
                                </div>
                                <UploadInput
                                    label="Pharmacy PAN Card*"
                                    value={form.pharmacypancarddoc}
                                    onChange={(v) => setField("pharmacypancarddoc", v)}
                                    onUploadBegin={() => setUploadBusy("pharmacypancarddoc", true)}
                                    onUploadDone={(url) => setUploadBusy("pharmacypancarddoc", false) || (url && setField("pharmacypancarddoc", url))}
                                    busy={uploadLoading.pharmacypancarddoc}
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">Service Time in Day</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <input
                                                readOnly
                                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer"
                                                placeholder="Start Time"
                                                value={(function () {
                                                    const i = form.serviceStartTime ? parseInt(form.serviceStartTime.split(":")[0], 10) : null;
                                                    if (i === null || Number.isNaN(i)) return "";
                                                    const hour12 = i % 12 === 0 ? 12 : i % 12;
                                                    const suffix = i < 12 ? "AM" : "PM";
                                                    return `${hour12}:00 ${suffix}`;
                                                })()}
                                                onClick={() => setStartOpen((o) => !o)}
                                            />
                                            {startOpen && (
                                                <div className="absolute z-10 mt-1 w-full max-h-40 overflow-auto bg-white border-2 border-gray-200 rounded-xl shadow">
                                                    {Array.from({ length: 24 }).map((_, i) => {
                                                        const hh24 = String(i).padStart(2, "0");
                                                        const value = `${hh24}:00`;
                                                        const hour12 = i % 12 === 0 ? 12 : i % 12;
                                                        const suffix = i < 12 ? "AM" : "PM";
                                                        const label = `${hour12}:00 ${suffix}`;
                                                        return (
                                                            <div key={value} className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${form.serviceStartTime === value ? "bg-blue-50" : ""}`} onClick={() => { setField("serviceStartTime", value); setStartOpen(false); }}>{label}</div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                readOnly
                                                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer"
                                                placeholder="End Time"
                                                value={(function () {
                                                    const i = form.serviceEndTime ? parseInt(form.serviceEndTime.split(":")[0], 10) : null;
                                                    if (i === null || Number.isNaN(i)) return "";
                                                    const hour12 = i % 12 === 0 ? 12 : i % 12;
                                                    const suffix = i < 12 ? "AM" : "PM";
                                                    return `${hour12}:00 ${suffix}`;
                                                })()}
                                                onClick={() => setEndOpen((o) => !o)}
                                            />
                                            {endOpen && (
                                                <div className="absolute z-10 mt-1 w-full max-h-40 overflow-auto bg-white border-2 border-gray-200 rounded-xl shadow">
                                                    {Array.from({ length: 24 }).map((_, i) => {
                                                        const hh24 = String(i).padStart(2, "0");
                                                        const value = `${hh24}:00`;
                                                        const hour12 = i % 12 === 0 ? 12 : i % 12;
                                                        const suffix = i < 12 ? "AM" : "PM";
                                                        const label = `${hour12}:00 ${suffix}`;
                                                        return (
                                                            <div key={value} className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${form.serviceEndTime === value ? "bg-blue-50" : ""}`} onClick={() => { setField("serviceEndTime", value); setEndOpen(false); }}>{label}</div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Service Days in Week</label>
                                    <div className="relative">
                                        <input
                                            className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                                            placeholder="Type to search days..."
                                            value={weekdaysQuery}
                                            onChange={(e) => { setWeekdaysQuery(e.target.value); setWeekdaysOpen(true); }}
                                            onFocus={() => setWeekdaysOpen(true)}
                                        />
                                        {weekdaysOpen && (
                                            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border-2 border-gray-200 rounded-xl shadow" onMouseLeave={() => setWeekdaysOpen(false)}>
                                                {filteredWeekdays.length === 0 && (
                                                    <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                                                )}
                                                {filteredWeekdays.map((d) => (
                                                    <div
                                                        key={d}
                                                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${form.servicetimeinweek.includes(d) ? "bg-blue-50" : ""}`}
                                                        onClick={() => { toggleWeekday(d); setWeekdaysOpen(true); }}
                                                    >
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {form.servicetimeinweek.map((d) => (
                                            <span key={d} className="px-3 py-1 text-xs rounded-full bg-[#5271FF] text-white flex items-center gap-2">
                                                {d}
                                                <button type="button" className="text-white/90" onClick={() => toggleWeekday(d)} aria-label={`Remove ${d}`}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Online Platform Service*</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.onlineplotformservice} onChange={(e) => setField("onlineplotformservice", e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">Home Delivery*</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.homedelivery} onChange={(e) => setField("homedelivery", e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Pharmacy Type</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.pharmacytype} onChange={(e) => setField("pharmacytype", e.target.value)}>
                                        <option value="">Select Type</option>
                                        <option value="Hospital">Hospital</option>
                                        <option value="Clinical">Clinical</option>
                                        <option value="Regulatory Pharmacy">Regulatory Pharmacy</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Total Reg. Pharmacist</label>
                                    <div className="relative">
                                        <input
                                            readOnly
                                            className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer"
                                            placeholder="Select"
                                            value={form.TotalregPharmacist || ""}
                                            onClick={() => setPharmCountOpen((o) => !o)}
                                        />
                                        {pharmCountOpen && (
                                            <div className="absolute z-10 mt-1 w-full max-h-40 overflow-auto bg-white border-2 border-gray-200 rounded-xl shadow">
                                                {Array.from({ length: 100 }).map((_, i) => {
                                                    const v = String(i + 1);
                                                    return (
                                                        <div key={v} className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${form.TotalregPharmacist === v ? "bg-blue-50" : ""}`} onClick={() => { setField("TotalregPharmacist", v); setPharmCountOpen(false); }}>{v}</div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button onClick={() => setStep(2)} className="bg-[#5271FF] rounded-xl">Next</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Logo upload moved to top */}
                            <div className="flex justify-end">
                                <div className="flex items-center gap-3">
                                    <UploadButton
                                        endpoint="fileUploader"
                                        content={{
                                            button({ ready }) {
                                                return <div>{uploadLoading.pharmacylogo ? <Loader2 className="animate-spin w-4 h-4" /> : (ready && <div>Upload Logo</div>)}</div>;
                                            },
                                            allowedContent: () => "",
                                        }}
                                        appearance={{ button: "w-auto bg-[#243460] text-white text-xs font-bold rounded-xl px-3 py-2", container: "rounded-xl" }}
                                        onUploadBegin={() => setUploadBusy("pharmacylogo", true)}
                                        onClientUploadComplete={(res) => {
                                            setUploadBusy("pharmacylogo", false);
                                            if (res?.length) {
                                                setField("pharmacylogo", res[0].url);
                                                toast.success("Logo uploaded");
                                            }
                                        }}
                                        onUploadError={(err) => {
                                            setUploadBusy("pharmacylogo", false);
                                            toast.error(err.message);
                                        }}
                                    />
                                    <div className="w-20 h-20 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                                        {form.pharmacylogo ? <img src={form.pharmacylogo} alt="logo" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Logo</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">Full Address</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.fulladdress} onChange={(e) => setField("fulladdress", e.target.value)} placeholder="Enter Address" />
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">City</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="Enter City" />
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">State</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.state} onChange={(e) => { setField("state", e.target.value); setField("district", ""); setField("taluka", ""); }}>
                                        <option value="">Select State</option>
                                        {states.map((s) => <option key={s.id} value={s.stateName}>{s.stateName}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">District</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.district} onChange={(e) => { setField("district", e.target.value); setField("taluka", ""); }}>
                                        <option value="">Select District</option>
                                        {filteredDistricts.map((d) => <option key={d.id} value={d.district}>{d.district}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Taluka</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.taluka} onChange={(e) => setField("taluka", e.target.value)}>
                                        <option value="">Select Taluka</option>
                                        {filteredSubDistricts.map((sd) => <option key={sd.id} value={sd.subDistrict}>{sd.subDistrict}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Pincode*</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter Pincode" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">Primary Contact No</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.primarycontactno} onChange={(e) => setField("primarycontactno", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter Primary Mobile" />
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Alternate Mobile</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.alternatemobile} onChange={(e) => setField("alternatemobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter Alternate Mobile" />
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Secondary Email</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.secondaryemail} onChange={(e) => setField("secondaryemail", e.target.value)} placeholder="Enter Secondary Email" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">Bank Name</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.bankName} onChange={(e) => setField("bankName", e.target.value)}>
                                        <option value="">Select Bank</option>
                                        {BANK_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">Account Number</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.accountNumber} onChange={(e) => setField("accountNumber", e.target.value)} placeholder="Enter Account Number" />
                                </div>
                                <div>
                                    <label className="text-[#243460] font-semibold">IFSC Code</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.ifscCode} onChange={(e) => setField("ifscCode", e.target.value)} placeholder="Enter IFSC Code" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-[#243460] font-semibold">Account Type</label>
                                    <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.accountType} onChange={(e) => setField("accountType", e.target.value)}>
                                        <option value="">Select Account Type</option>
                                        {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>


                                <UploadInput
                                    label="Cancelled Cheque*"
                                    value={form.cancelledCheque}
                                    onChange={(v) => setField("cancelledCheque", v)}
                                    onUploadBegin={() => setUploadBusy("cancelledCheque", true)}
                                    onUploadDone={(url) => setUploadBusy("cancelledCheque", false) || (url && setField("cancelledCheque", url))}
                                    busy={uploadLoading.cancelledCheque}
                                />
                                <div>
                                    <label className="text-[#243460] font-semibold">MICR Code</label>
                                    <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.micrCode} onChange={(e) => setField("micrCode", e.target.value)} placeholder="Enter MICR Code" />
                                </div>
                            </div>



                            <div className="flex justify-between mt-8">
                                <Button variant="outline" className="bg-gray-100 text-[#243460] border-[#243460] rounded-xl" onClick={() => setStep(1)}>Back</Button>
                                <Button className="bg-[#5271FF] rounded-xl" onClick={() => setStep(3)}>Preview</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            <PharmacyProfilePreview form={form} onEdit={() => setStep(2)} onSave={saveProfile} saveLoading={saveLoading} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


