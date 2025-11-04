"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PharmacyProfilePreview({ form, onEdit, onSave, saveLoading = false }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#243460] mb-2">Review Your Information</h2>
        <p className="text-gray-600">Please review all the information before saving</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Registration & General</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Email:</span> {form.email || "Not provided"}</div>
          <div><span className="font-medium">Mobile:</span> {form.mobile || "Not provided"}</div>
          <div><span className="font-medium">Pincode:</span> {form.pincode || "Not provided"}</div>
          <div><span className="font-medium">Reg. Name:</span> {form.regname || "Not provided"}</div>
          <div><span className="font-medium">Reg. No.:</span> {form.regno || "Not provided"}</div>
          <div><span className="font-medium">Reg. Date:</span> {form.regdate ? form.regdate.toLocaleDateString() : "Not provided"}</div>
          <div><span className="font-medium">Reg. Certificate:</span> {form.regcertificate ? "Uploaded" : "Not uploaded"}</div>
          <div><span className="font-medium">PAN Number:</span> {form.pharmacypancardno || "Not provided"}</div>
          <div><span className="font-medium">PAN Document:</span> {form.pharmacypancarddoc ? "Uploaded" : "Not uploaded"}</div>
          <div><span className="font-medium">Service Time:</span> {form.serviceStartTime && form.serviceEndTime ? `${form.serviceStartTime} - ${form.serviceEndTime}` : (form.servicetimeinday || "Not provided")}</div>
          <div className="md:col-span-2">
            <span className="font-medium">Service Days:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {form.servicetimeinweek?.length ? form.servicetimeinweek.map((d) => (
                <span key={d} className="px-2 py-1 bg-[#5271FF] text-white text-xs rounded">{d}</span>
              )) : <span className="text-gray-500">Not provided</span>}
            </div>
          </div>
          <div><span className="font-medium">Online Platform Service:</span> {form.onlineplotformservice || "Not provided"}</div>
          <div><span className="font-medium">Home Delivery:</span> {form.homedelivery || "Not provided"}</div>
          <div><span className="font-medium">Pharmacy Type:</span> {form.pharmacytype || "Not provided"}</div>
          <div><span className="font-medium">Total Reg. Pharmacist:</span> {form.TotalregPharmacist || "Not provided"}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Address & Contact</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Full Address:</span> {form.fulladdress || "Not provided"}</div>
          <div><span className="font-medium">City:</span> {form.city || "Not provided"}</div>
          <div><span className="font-medium">State:</span> {form.state || "Not provided"}</div>
          <div><span className="font-medium">District:</span> {form.district || "Not provided"}</div>
          <div><span className="font-medium">Taluka:</span> {form.taluka || "Not provided"}</div>
          <div><span className="font-medium">Primary Contact:</span> {form.primarycontactno || "Not provided"}</div>
          <div><span className="font-medium">Alternate Mobile:</span> {form.alternatemobile || "Not provided"}</div>
          <div><span className="font-medium">Secondary Email:</span> {form.secondaryemail || "Not provided"}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Banking</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Bank Name:</span> {form.bankName || "Not provided"}</div>
          <div><span className="font-medium">Account Number:</span> {form.accountNumber || "Not provided"}</div>
          <div><span className="font-medium">IFSC Code:</span> {form.ifscCode || "Not provided"}</div>
          <div><span className="font-medium">Account Type:</span> {form.accountType || "Not provided"}</div>
          <div><span className="font-medium">Cancelled Cheque:</span> {form.cancelledCheque ? "Uploaded" : "Not uploaded"}</div>
          <div><span className="font-medium">MICR Code:</span> {form.micrCode || "Not provided"}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Other</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Pharmacy Logo:</span> {form.pharmacylogo ? "Uploaded" : "Not uploaded"}</div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" className="bg-gray-100 text-[#243460] border-[#243460] rounded-xl" onClick={onEdit}>Edit Information</Button>
        <Button className="bg-[#5271FF] rounded-xl" onClick={onSave} disabled={saveLoading}>
          {saveLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Saving...</span>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </div>
  );
}


