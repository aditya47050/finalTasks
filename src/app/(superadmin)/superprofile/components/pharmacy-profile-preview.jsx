"use client"

export default function PharmacyProfilePreview({ form }) {
  return (
    <div className="min-h-screen bg-blue-50 font-poppins py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Review Your Information</h2>
          <p className="text-gray-600">Please review all the information before saving</p>
        </div>

        <div className="rounded-2xl bg-white border border-blue-100 p-6 hover:shadow-sm transition">
          <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">
            Registration & General
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-blue-700">Email:</span> {form.email || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Mobile:</span> {form.mobile || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Pincode:</span> {form.pincode || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Reg. Name:</span> {form.regname || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Reg. No.:</span> {form.regno || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Reg. Date:</span>{" "}
              {form.regdate ? new Date(form.regdate).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Reg. Certificate:</span>{" "}
              {form.regcertificate ? "Uploaded" : "Not uploaded"}
            </div>
            <div>
              <span className="font-medium text-blue-700">PAN Number:</span> {form.pharmacypancardno || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">PAN Document:</span>{" "}
              {form.pharmacypancarddoc ? "Uploaded" : "Not uploaded"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Service Time:</span>{" "}
              {form.serviceStartTime && form.serviceEndTime
                ? `${form.serviceStartTime} - ${form.serviceEndTime}`
                : form.servicetimeinday || "Not provided"}
            </div>

            <div className="md:col-span-2">
              <span className="font-medium text-blue-700">Service Days:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.servicetimeinweek ? (
                  form.servicetimeinweek.split(",").map((d) => (
                    <span
                      key={d}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium text-blue-700">Online Platform Service:</span>{" "}
              {form.onlineplotformservice || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Home Delivery:</span> {form.homedelivery || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Pharmacy Type:</span> {form.pharmacytype || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Total Reg. Pharmacist:</span>{" "}
              {form.TotalregPharmacist || "Not provided"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 hover:shadow-sm transition">
          <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Address & Contact</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-blue-700">Full Address:</span> {form.fulladdress || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">City:</span> {form.city || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">State:</span> {form.state || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">District:</span> {form.district || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Taluka:</span> {form.taluka || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Primary Contact:</span>{" "}
              {form.primarycontactno || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Alternate Mobile:</span>{" "}
              {form.alternatemobile || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Secondary Email:</span>{" "}
              {form.secondaryemail || "Not provided"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-blue-100 p-6 hover:shadow-sm transition">
          <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Banking</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-blue-700">Bank Name:</span> {form.bankName || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Account Number:</span> {form.accountNumber || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">IFSC Code:</span> {form.ifscCode || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Account Type:</span> {form.accountType || "Not provided"}
            </div>
            <div>
              <span className="font-medium text-blue-700">Cancelled Cheque:</span>{" "}
              {form.cancelledCheque ? "Uploaded" : "Not uploaded"}
            </div>
            <div>
              <span className="font-medium text-blue-700">MICR Code:</span> {form.micrCode || "Not provided"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 hover:shadow-sm transition">
          <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-100 pb-2">Other</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium text-blue-700">Pharmacy Logo:</span>{" "}
              {form.pharmacylogo ? "Uploaded" : "Not uploaded"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
