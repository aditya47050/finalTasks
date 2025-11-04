"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ProfilePreview({ form, onEdit, onSave, saveLoading = false }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#243460] mb-2">Review Your Information</h2>
        <p className="text-gray-600">Please review all the information before saving</p>
      </div>

      {/* Company Information Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Company Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Company Name:</span> {form.companyName || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Company Type:</span> {form.companyType || "Not provided"}
          </div>
          <div>
            <span className="font-medium">CIN Number:</span> {form.cinNumber || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Date of Incorporation:</span>{" "}
            {form.dateOfIncorporation ? form.dateOfIncorporation.toLocaleDateString() : "Not provided"}
          </div>
          <div>
            <span className="font-medium">Company PAN:</span> {form.companyPan || "Not provided"}
          </div>
          <div>
            <span className="font-medium">GST Number:</span> {form.gstNumber || "Not provided"}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium">Service Types:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {form.companyServiceTypes.length > 0 ? (
                form.companyServiceTypes.map((service) => (
                  <span key={service} className="px-2 py-1 bg-[#5271FF] text-white text-xs rounded">
                    {service}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Not provided</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Email:</span> {form.userEmail || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Mobile:</span> {form.mobile || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Additional Email:</span> {form.additionalEmail || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Emergency Contact:</span> {form.emergencyContact || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Contact Person:</span> {form.contactPersonName || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Contact Relation:</span> {form.contactPersonRelation || "Not provided"}
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Address Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Present Address:</span> {form.presentAddress || "Not provided"}
          </div>
          <div>
            <span className="font-medium">City:</span> {form.city || "Not provided"}
          </div>
          <div>
            <span className="font-medium">State:</span> {form.state || "Not provided"}
          </div>
          <div>
            <span className="font-medium">District:</span> {form.district || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Taluka:</span> {form.taluka || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Pin Code:</span> {form.pincode || "Not provided"}
          </div>
        </div>
      </div>

      {/* Banking Information Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Banking Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Bank Name:</span> {form.bankName || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Account Number:</span> {form.bankAccountNumber || "Not provided"}
          </div>
          <div>
            <span className="font-medium">IFSC Code:</span> {form.ifscCode || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Account Type:</span> {form.accountType || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Cancelled Cheque:</span> {form.cancelledCheque ? "Uploaded" : "Not uploaded"}
          </div>
        </div>
      </div>

      {/* Employee & Insurance Information Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Employee & Insurance Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Employee Count:</span> {form.employeeCount || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Corporate Health Insurance:</span>{" "}
            {form.corporateHealthInsurance ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium">Factory Inspector:</span> {form.factoryInspector ? "Yes" : "No"}
          </div>
          {form.corporateHealthInsurance && (
            <div className="md:col-span-2">
              <span className="font-medium">Health Insurance Partners:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {form.healthInsurancePartners.length > 0 ? (
                  form.healthInsurancePartners.map((partner) => (
                    <span key={partner} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {partner}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#243460] mb-4 border-b pb-2">Documents & Identity</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Company Logo:</span> {form.companyLogo ? "Uploaded" : "Not uploaded"}
          </div>
          <div>
            <span className="font-medium">Employee ID Card:</span> {form.employeeIdCard ? "Uploaded" : "Not uploaded"}
          </div>
          <div>
            <span className="font-medium">Aadhar Number:</span> {form.aadharCardNumber || "Not provided"}
          </div>
          <div>
            <span className="font-medium">Aadhar Front:</span> {form.aadharCardFront ? "Uploaded" : "Not uploaded"}
          </div>
          <div>
            <span className="font-medium">Aadhar Back:</span> {form.aadharCardBack ? "Uploaded" : "Not uploaded"}
          </div>
          <div>
            <span className="font-medium">PAN Card:</span> {form.panCard ? "Uploaded" : "Not uploaded"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" className="bg-gray-100 text-[#243460] border-[#243460] rounded-xl" onClick={onEdit}>
          Edit Information
        </Button>
        <Button className="bg-[#5271FF] rounded-xl" onClick={onSave} disabled={saveLoading}>
          {saveLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" /> Saving...
            </span>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </div>
  )
}
