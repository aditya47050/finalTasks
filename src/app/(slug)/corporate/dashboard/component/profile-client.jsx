"use client";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import { ProfilePreview } from "./profile-preview"
import Image from "next/image"

const COMPANY_TYPES = [
  "Sole Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company (Pvt. Ltd.)",
  "Public Limited Company (Ltd.)",
  "One Person Company (OPC)",
  "Section 8 Company (Non-Profit Company)",
  "Charitable Trust - NGO (Non-Profit Company)",
  "Joint Venture (JV)",
  "Cooperative (Co-op)",
];

const SERVICE_TYPES = [
  "Professional & Business Services",
  "Information Technology (IT) & Digital Services",
  "Financial Services",
  "Healthcare & Wellness Services",
  "Education & Training Services",
  "Hospitality & Tourism Services",
  "Logistics & Transportation Services",
  "Real Estate & Infrastructure Services",
  "Creative & Media Services",
  "Utilities & Support Services",
  "Manufacturing Plant",
];

const ACCOUNT_TYPES = ["Saving", "Current"];

// Bank options copied to match patient registration
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

// Full Health Insurance Partner list (multi-select dropdown)
const HEALTH_PARTNERS = [
  "Medi Assist Insurance TPA Pvt Ltd",
  "MD India Health Insurance TPA Pvt Ltd",
  "Heritage Health Insurance TPA Pvt Ltd",
  "Family Health Plan Insurance TPA Ltd (FHPL)",
  "Paramount Health Services & Insurance TPA Pvt Ltd",
  "East West Assist TPA Pvt Ltd",
  "Genins India Insurance TPA Ltd",
  "Alankit Insurance TPA Ltd",
  "Good Health Plan TPA Ltd",
  "Vidal Health Insurance TPA Pvt Ltd",
  "Health India Insurance TPA Services Pvt Ltd",
  "Raksha Health Insurance TPA Pvt Ltd",
  "Pristyn Care",
  "Acko",
  "Mediassist",
  "Alankit",
  "Medibuddy",
  "Alyve Health",
  "Practo Care",
  "TATA 1mg",
  "HCL Healthcare",
  "Health On Surity",
  "SSAS Healthcare",
  "Avyukt Healthcare",
  "My Care India",
  "ICICI Lombard",
  "Other (Type your own)",
];

// helper: input with right-end Upload button placed INSIDE the input
function UploadInput({ label, value, onChange, onUploadBegin, onUploadDone, busy }) {
  return (
    <div>
      <label className="text-[#243460] font-semibold">{label}</label>
      <div className="relative">
        <input
          className="w-full h-12 pr-[12%] px-4 border-2 border-gray-200 rounded-xl"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Uploaded file URL"
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

export default function CorporateProfileClient({ states, districts, subDistricts, existingProfile }) {
  const [step, setStep] = useState(1);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(existingProfile?.mobileVerified || false);
  const [uploadLoading, setUploadLoading] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);

  const [form, setForm] = useState({
    userEmail: existingProfile?.email || "",
    mobile: existingProfile?.mobile || "",
    companyName: "",
    additionalEmail: "",
    emergencyContact: "",
    dateOfIncorporation: null,
    cinNumber: "",
    companyType: "",
    companyServiceTypes: [],
    companyPan: "",
    gstNumber: "",
    presentAddress: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    pincode: existingProfile?.pincode || "",

    companyLogo: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    accountType: "",
    cancelledCheque: "",
    employeeCount: "",
    corporateHealthInsurance: false,
    healthInsurancePartners: [],
    factoryInspector: false,
    contactPersonName: "",
    contactPersonRelation: "",
    employeeIdCard: "",
    aadharCardNumber: "",
    aadharCardFront: "",
    aadharCardBack: "",
    panCard: "",
  });

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

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const sendOtp = async () => {
    if (!form.userEmail) {
      toast.error("Enter User Email");
      return;
    }
    setSendOtpLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.userEmail }),
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
        body: JSON.stringify({ email: form.userEmail, otp }),
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

  const setUploadBusy = (key, v) => setUploadLoading((prev) => ({ ...prev, [key]: v }));

  const toggleServiceType = (value) => {
    setForm((prev) => {
      const exists = prev.companyServiceTypes.includes(value);
      const next = exists
        ? prev.companyServiceTypes.filter((x) => x !== value)
        : [...prev.companyServiceTypes, value];
      return { ...prev, companyServiceTypes: next };
    });
  };

  const toggleHealthPartner = (value) => {
    setForm((prev) => {
      const exists = prev.healthInsurancePartners.includes(value);
      const next = exists
        ? prev.healthInsurancePartners.filter((x) => x !== value)
        : [...prev.healthInsurancePartners, value];
      return { ...prev, healthInsurancePartners: next };
    });
  };

  // Service Type multi-select input+dropdown
  const [serviceTypeQuery, setServiceTypeQuery] = useState("");
  const [serviceTypeOpen, setServiceTypeOpen] = useState(false);
  const filteredServiceOptions = useMemo(() => {
    if (!serviceTypeQuery) return SERVICE_TYPES;
    return SERVICE_TYPES.filter((s) =>
      s.toLowerCase().includes(serviceTypeQuery.toLowerCase())
    );
  }, [serviceTypeQuery]);

  // Health Partner multi-select input+dropdown
  const [healthPartnerQuery, setHealthPartnerQuery] = useState("");
  const [healthPartnerOpen, setHealthPartnerOpen] = useState(false);
  const filteredHealthPartners = useMemo(() => {
    if (!healthPartnerQuery) return HEALTH_PARTNERS;
    return HEALTH_PARTNERS.filter((s) =>
      s.toLowerCase().includes(healthPartnerQuery.toLowerCase())
    );
  }, [healthPartnerQuery]);

  const addCustomHealthPartner = () => {
    const val = healthPartnerQuery.trim();
    if (!val) return;
    if (!form.healthInsurancePartners.includes(val)) {
      setForm((prev) => ({
        ...prev,
        healthInsurancePartners: [...prev.healthInsurancePartners, val],
      }));
    }
    setHealthPartnerQuery("");
    setHealthPartnerOpen(false);
  };

  const saveProfile = async () => {
    try {
      if (!form.userEmail) return toast.error("Enter User Email");
      if (!form.mobile || form.mobile.length !== 10) return toast.error("Enter valid 10-digit mobile");
      if (!otpVerified) return toast.error("Please verify email OTP");
      if (!form.companyName) return toast.error("Enter Company Name");

      setSaveLoading(true);

      const payload = {
        ...form,
        dateOfIncorporation: form.dateOfIncorporation
          ? form.dateOfIncorporation.toISOString()
          : null,
        employeeCount: form.employeeCount ? String(form.employeeCount) : null,
        mobileVerified: otpVerified,
      };

      const res = await fetch("/api/corporate/profile", { // FIX: remove (site) from URL
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

      // Optional: if API returns JSON
      // const data = await res.json().catch(() => null);

      toast.success("Profile saved");
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
          <h1 className="text-3xl font-bold text-[#243460] mb-2">Corporate Profile</h1>
          <p className="text-[#5271FF] text-lg">Create your corporate profile</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Stepper */}
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
                                {/* Mobile Number (no OTP here) */}
                                <div className="space-y-2">
                  <label className="text-[#243460] font-semibold">Mobile Number*</label>
                  <input
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                    value={form.mobile}
                    onChange={(e) =>
                      setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="Enter Mobile Number"
                  />
                </div>
                {/* Email + Send OTP (moved here) */}
                <div className="space-y-2">
                  <label className="text-[#243460] font-semibold">Email*</label>
                  <div className="relative">
                    <input
                      className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl"
                      value={form.userEmail}
                      onChange={(e) => setField("userEmail", e.target.value)}
                      placeholder="Enter Email"
                    />
                    <Button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpSent || sendOtpLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                    >
                      {sendOtpLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin h-4 w-4" /> Sending...
                        </span>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>
                </div>
                {/* Enter Email OTP */}
                <div className="space-y-2">
                  <label className="text-[#243460] font-semibold">Enter Email OTP*</label>
                  <div className="relative">
                    <input
                      className="w-full h-12 pr-28 px-4 border-2 border-gray-200 rounded-xl"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter Email OTP"
                    />
                    <Button
                      type="button"
                      onClick={verifyOtp}
                      disabled={verifyOtpLoading || otpVerified}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 text-sm px-3"
                    >
                      {verifyOtpLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin h-4 w-4" /> Verifying...
                        </span>
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
                <div className="space-y-2">
                  <label className="text-[#243460] font-semibold">Company Name*</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.companyName} onChange={(e) => setField("companyName", e.target.value)} placeholder="Enter Company Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[#243460] font-semibold">Additional Email</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.additionalEmail} onChange={(e) => setField("additionalEmail", e.target.value)} placeholder="Enter Additional Email" />
                </div>
                <div className="space-y-2">
                  <label className="text-[#243460] font-semibold">Emergency Contact Number</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.emergencyContact} onChange={(e) => setField("emergencyContact", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter Emergency Contact" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[#243460] font-semibold">Date of Incorporation</label>
                  <DatePicker selected={form.dateOfIncorporation} onChange={(d) => setField("dateOfIncorporation", d)} dateFormat="dd/MM/yyyy" showYearDropdown yearDropdownItemNumber={100} scrollableYearDropdown maxDate={new Date()} showMonthDropdown placeholderText="DD/MM/YYYY" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="text-[#243460] font-semibold">CIN Number</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.cinNumber} onChange={(e) => setField("cinNumber", e.target.value)} placeholder="Enter CIN Number" />
                </div>
                <div>
                  <label className="text-[#243460] font-semibold">Company Type*</label>
                  <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.companyType} onChange={(e) => setField("companyType", e.target.value)}>
                    <option value="">Select Company Type</option>
                    {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Company Service Types: input + dropdown + chips */}
              <div className="space-y-2">
                <label className="text-[#243460] font-semibold">Company Service Type (Multiple)</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                    placeholder="Type to search services..."
                    value={serviceTypeQuery}
                    onChange={(e) => { setServiceTypeQuery(e.target.value); setServiceTypeOpen(true); }}
                    onFocus={() => setServiceTypeOpen(true)}
                  />
                  {serviceTypeOpen && (
                    <div
                      className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border-2 border-gray-200 rounded-xl shadow"
                      onMouseLeave={() => setServiceTypeOpen(false)}
                    >
                      {filteredServiceOptions.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                      )}
                      {filteredServiceOptions.map((s) => (
                        <div
                          key={s}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${form.companyServiceTypes.includes(s) ? "bg-blue-50" : ""}`}
                          onClick={() => {
                            toggleServiceType(s);
                            setServiceTypeOpen(true);
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.companyServiceTypes.map((s) => (
                    <span key={s} className="px-3 py-1 text-xs rounded-full bg-[#5271FF] text-white flex items-center gap-2">
                      {s}
                      <button type="button" className="text-white/90" onClick={() => toggleServiceType(s)} aria-label={`Remove ${s}`}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[#243460] font-semibold">Company PAN Number</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.companyPan} onChange={(e) => setField("companyPan", e.target.value)} placeholder="Enter PAN Number" />
                </div>
                <div>
                  <label className="text-[#243460] font-semibold">GST Number (If applicable)</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.gstNumber} onChange={(e) => setField("gstNumber", e.target.value)} placeholder="Enter GST Number" />
                </div>
                <div>
                  <label className="text-[#243460] font-semibold">Pin Code</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter Pincode" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[#243460] font-semibold">Present Address</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.presentAddress} onChange={(e) => setField("presentAddress", e.target.value)} placeholder="Enter Address" />
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

              <div className="grid md:grid-cols-2 gap-6">
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
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button onClick={() => setStep(2)} className="bg-[#5271FF] rounded-xl">Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Toggle logo: Upload button first, then box preview */}
              <div className="flex justify-end">
                <div className="flex items-center gap-3">
                  <UploadButton
                    endpoint="fileUploader"
                    content={{
                      button({ ready }) {
                        return <div>{uploadLoading.companyLogo ? <Loader2 className="animate-spin w-4 h-4" /> : (ready && <div>Upload Logo</div>)}</div>;
                      },
                      allowedContent: () => "",
                    }}
                    appearance={{ button: "w-auto bg-[#243460] text-white text-xs font-bold rounded-xl px-3 py-2", container: "rounded-xl" }}
                    onUploadBegin={() => setUploadBusy("companyLogo", true)}
                    onClientUploadComplete={(res) => {
                      setUploadBusy("companyLogo", false);
                      if (res?.length) {
                        setField("companyLogo", res[0].url);
                        toast.success("Logo uploaded");
                      }
                    }}
                    onUploadError={(err) => {
                      setUploadBusy("companyLogo", false);
                      toast.error(err.message);
                    }}
                  />
                  <div className="w-20 h-20 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                    {form.companyLogo ? <Image src={form.companyLogo} alt="logo" width={32} height={32} className="object-cover rounded-md border" /> : <span className="text-xs text-gray-400">Logo</span>}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[#243460] font-semibold">Bank Name</label>
                  <select
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                    value={form.bankName}
                    onChange={(e) => setField("bankName", e.target.value)}
                  >
                    <option value="">Select Bank</option>
                    {BANK_OPTIONS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#243460] font-semibold">Bank Account Number</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.bankAccountNumber} onChange={(e) => setField("bankAccountNumber", e.target.value)} placeholder="Enter Account Number" />
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
                  label="Cancelled Cheque"
                  value={form.cancelledCheque}
                  onChange={(v) => setField("cancelledCheque", v)}
                  onUploadBegin={() => setUploadBusy("cancelledCheque", true)}
                  onUploadDone={(url) => setUploadBusy("cancelledCheque", false) || (url && setField("cancelledCheque", url))}
                  busy={uploadLoading.cancelledCheque}
                />
                <div>
                  <label className="text-[#243460] font-semibold">Employee Count</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.employeeCount} onChange={(e) => setField("employeeCount", e.target.value.replace(/\D/g, ""))} placeholder="Enter Employee Count" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
  <div>
    <label className="text-[#243460] font-semibold">Corporate Health Insurance?</label>
    <div className="flex items-center gap-4 mt-2">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={form.corporateHealthInsurance === true}
          onChange={() => setForm((p) => ({ ...p, corporateHealthInsurance: true }))}
        />
        Yes
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={form.corporateHealthInsurance === false}
          onChange={() =>
            setForm((p) => ({
              ...p,
              corporateHealthInsurance: false,
              healthInsurancePartners: [], // clear when No
            }))
          }
        />
        No
      </label>
    </div>
  </div>
</div>
{form.corporateHealthInsurance && (
   <>
              {/* Health Insurance Partner: multi-select input + dropdown + chips */}
              <div className="space-y-2">
                <label className="text-[#243460] font-semibold">Health Insurance Partner (Multiple)</label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl"
                    placeholder="Type to search partners..."
                    value={healthPartnerQuery}
                    onChange={(e) => { setHealthPartnerQuery(e.target.value); setHealthPartnerOpen(true); }}
                    onFocus={() => setHealthPartnerOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (
                          healthPartnerQuery &&
                          !HEALTH_PARTNERS.some((p) => p.toLowerCase() === healthPartnerQuery.toLowerCase())
                        ) {
                          addCustomHealthPartner();
                        }
                      }
                    }}
                  />
                  {healthPartnerOpen && (
                    <div
                      className="absolute z-10 mt-1 w-full max-h-56 overflow-auto bg-white border-2 border-gray-200 rounded-xl shadow"
                      onMouseLeave={() => setHealthPartnerOpen(false)}
                    >
                      {filteredHealthPartners.length === 0 && (
                        <div
                        className="px-3 py-2 text-sm text-[#5271FF] cursor-pointer hover:bg-blue-50"
                        onClick={addCustomHealthPartner}
                      >
                        Add &quot;{healthPartnerQuery}&quot;
                      </div>
                      )}
                      {filteredHealthPartners.map((s) => (
                        <div
                          key={s}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${form.healthInsurancePartners.includes(s) ? "bg-blue-50" : ""}`}
                          onClick={() => {
                            if (s.startsWith("Other")) {
                              if (healthPartnerQuery.trim()) {
                                addCustomHealthPartner();
                              } else {
                                setHealthPartnerQuery("");
                              }
                              return;
                            }
                            toggleHealthPartner(s);
                            setHealthPartnerOpen(true);
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.healthInsurancePartners.map((s) => (
                    <span key={s} className="px-3 py-1 text-xs rounded-full bg-[#5271FF] text-white flex items-center gap-2">
                      {s}
                      <button type="button" className="text-white/90" onClick={() => toggleHealthPartner(s)} aria-label={`Remove ${s}`}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              </>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[#243460] font-semibold">Factory Inspector?</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={form.factoryInspector === true} onChange={() => setField("factoryInspector", true)} />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" checked={form.factoryInspector === false} onChange={() => setField("factoryInspector", false)} />
                      No
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-[#243460] font-semibold">Contact Person Name</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.contactPersonName} onChange={(e) => setField("contactPersonName", e.target.value)} placeholder="Enter Contact Person Name" />
                </div>
                <div>
                  <label className="text-[#243460] font-semibold">Contact Person Relation</label>
                  <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.contactPersonRelation} onChange={(e) => setField("contactPersonRelation", e.target.value)}>
                    <option value="">Select Relation</option>
                    {["Father", "Mother", "Husband", "Wife", "Brother", "Sister", "Son", "Daughter", "Spouse", "Other"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <UploadInput
                  label="Employee ID Card"
                  value={form.employeeIdCard}
                  onChange={(v) => setField("employeeIdCard", v)}
                  onUploadBegin={() => setUploadBusy("employeeIdCard", true)}
                  onUploadDone={(url) => setUploadBusy("employeeIdCard", false) || (url && setField("employeeIdCard", url))}
                  busy={uploadLoading.employeeIdCard}
                />
                <div>
                  <label className="text-[#243460] font-semibold">Aadhar Card Number</label>
                  <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.aadharCardNumber} onChange={(e) => setField("aadharCardNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="Enter Aadhar Number" />
                </div>
                <UploadInput
                  label="Aadhar Front"
                  value={form.aadharCardFront}
                  onChange={(v) => setField("aadharCardFront", v)}
                  onUploadBegin={() => setUploadBusy("aadharCardFront", true)}
                  onUploadDone={(url) => setUploadBusy("aadharCardFront", false) || (url && setField("aadharCardFront", url))}
                  busy={uploadLoading.aadharCardFront}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <UploadInput
                  label="Aadhar Back"
                  value={form.aadharCardBack}
                  onChange={(v) => setField("aadharCardBack", v)}
                  onUploadBegin={() => setUploadBusy("aadharCardBack", true)}
                  onUploadDone={(url) => setUploadBusy("aadharCardBack", false) || (url && setField("aadharCardBack", url))}
                  busy={uploadLoading.aadharCardBack}
                />
                <UploadInput
                  label="PAN Card"
                  value={form.panCard}
                  onChange={(v) => setField("panCard", v)}
                  onUploadBegin={() => setUploadBusy("panCard", true)}
                  onUploadDone={(url) => setUploadBusy("panCard", false) || (url && setField("panCard", url))}
                  busy={uploadLoading.panCard}
                />
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  className="bg-gray-100 text-[#243460] border-[#243460] rounded-xl"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="bg-[#5271FF] rounded-xl"
                  onClick={() => setStep(3)}
                >
                  Preview
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <ProfilePreview form={form} onEdit={() => setStep(2)} onSave={saveProfile} saveLoading={saveLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}