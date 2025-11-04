"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Printer as Print, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function PrescriptionView({ prescription, userRole  }) {
  const isPharmacy = userRole === "Pharmacy";
  const router = useRouter()
  const [medications, setMedications] = useState(prescription.medications || []);
  const [prescriptionState, setPrescriptionState] = useState(prescription);
  const [isSaving, setIsSaving] = useState(false);


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  const handleSavePharmacistNotes = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/doctor/${prescription.doctor?.id}/prescription/${prescription.id}/pharmacist-notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medications }),
      });
      if (!res.ok) throw new Error("Failed to save notes");

      // Option 1: Optimistically update local state (recommended)
      setPrescriptionState({ ...prescriptionState, medications });
      toast.success("Pharmacist notes saved!");

    } catch (err) {
      toast.error("Error saving pharmacist notes");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePharmacistNoteChange = (index, value) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], pharmacistNote: value };
    setMedications(updated);
  };

  const handlePrint = () => window.print()
  const handleDownload = () => window.print();


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            Back to Prescriptions
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload} className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint}>
              <Print className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Prescription Form */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          {/* Header with Doctor Info */}
          <div className="bg-white p-6 border-b-2 border-gray-800">
            <div className="flex items-center justify-between">
              <Image
                src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
                width={150}
                height={60}
                alt="Aarogya Aadhar Logo"
              />
              <div className="flex-1 text-center">
                <h2 className="text-3xl font-bold text-red-600">Medical Prescription</h2>
              </div>


              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {prescription.doctorName
                    ? `${prescription.doctorName.split(" ")[0]?.[0] || ""}${prescription.doctorName.split(" ")[1]?.[0] || ""}`
                    : "DR"}
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            {/* Doctor Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 grid grid-cols-2">
              <div>
                <h3 className="font-bold text-lg text-blue-800">Dr. {prescription.doctorName}</h3>
                <p className="text-sm text-blue-600">{prescription.doctorSpecialty}</p>
                <p className="text-xs text-gray-600 mt-1">Reg. No: {prescription.doctorRegistration}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-600">📞 {prescription.doctor?.mobile || "N/A"}</p>
                <p className="text-sm text-gray-600">✉️ {prescription.doctor?.email || "N/A"}</p>
              </div>
            </div>

          </div>

          {/* Patient Info Section */}
          <div className="p-6 space-y-2">
            <div className="border border-gray-800 rounded-lg overflow-hidden">
              {/* Row 1: Name and Date */}
              <div className="grid grid-cols-2">
                <div className="bg-blue-100 p-3 border-r border-b border-gray-800">
                  <span className="font-semibold">Patient&apos;s Name: </span>
                  <span>{prescription.patientName}</span>
                </div>
                <div className="bg-blue-100 p-3 border-b border-gray-800">
                  <span className="font-semibold">Date: </span>
                  <span>{formatDate(prescription.prescriptionDate)}</span>
                </div>
              </div>
              {/* Row 2: Age, Sex, Blood Group, Phone */}
              <div className="grid grid-cols-4">
                {[
                  { label: "Age", value: prescription.patientAge || "N/A" },
                  { label: "Sex", value: prescription.patientGender || "N/A" },
                  { label: "Blood Group", value: prescription.bloodGroup || "N/A" },
                  { label: "Phone", value: prescription.patient?.mobile || "N/A" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 ${idx < 3 ? "border-r border-gray-800" : ""} border-b border-gray-800 bg-blue-100`}
                  >
                    <span className="font-semibold">{item.label}: </span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
              {/* Row 3: Email & Health Card */}
              <div className="grid grid-cols-2">
                <div className="bg-white p-3 border-r border-b border-gray-800">
                  <span className="font-semibold">Email: </span>
                  <span>{prescription.patient?.email || "N/A"}</span>
                </div>
                <div className="bg-white p-3 border-b border-gray-800">
                  <span className="font-semibold">Health Card No: </span>
                  <span>{prescription.patient?.healthcard?.[0]?.cardNo || "N/A"}</span>
                </div>
              </div>
              {/* Row 4: Address */}
              <div className="bg-white p-3">
                <span className="font-semibold">Address: </span>
                <span>{prescription.patientAddress || "N/A"}</span>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="bg-yellow-100 p-4 border border-gray-800 min-h-[100px]">
              <div className="font-semibold mb-2">Diagnosed With:</div>
              <div>{prescription.diagnosis}</div>
            </div>

            {/* Vitals */}
            <div className="grid grid-cols-4 border border-gray-800">
              {[
                { label: "Blood Pressure", value: prescription.bloodPressure || "-" },
                { label: "Pulse Rate", value: prescription.pulseRate || "-" },
                { label: "Weight", value: prescription.weight || "-" },
                { label: "Temperature", value: prescription.temperature || "-" },
              ].map((item, idx) => (
                <div key={idx} className={`p-3 ${idx < 3 ? "border-r border-gray-800 bg-blue-100" : "bg-blue-100"}`}>
                  <span className="font-semibold">{item.label}: </span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Allergies & Disabilities */}
            <div className="grid grid-cols-2 border border-gray-800">
              <div className="bg-white p-3 border-r border-gray-800">
                <span className="font-semibold">Allergies: </span>
                <span>{prescription.allergies || "None"}</span>
              </div>
              <div className="bg-white p-3">
                <span className="font-semibold">Disabilities If any: </span>
                <span>{prescription.disabilities || "None"}</span>
              </div>
            </div>

            {/* Medications Table */}
            <div className="border border-gray-800">
              <div className="grid grid-cols-4 bg-blue-100 border-b border-gray-800">
                <div className="p-3 border-r border-gray-800 font-semibold text-center">Drugs</div>
                <div className="p-3 border-r border-gray-800 font-semibold text-center">Unit (Tablet / Syrup)</div>
                <div className="p-3 border-r border-gray-800 font-semibold text-center">Dosage (Per Day)</div>
                <div className="p-3 font-semibold text-center">Pharmacist Note</div>
              </div>
              {medications.map((med, idx) => (
                <div key={idx} className={`grid grid-cols-4 ${idx % 2 === 0 ? "bg-yellow-100" : "bg-blue-100"} border-b border-gray-800`}>
                  <div className="p-3 border-r border-gray-800">{idx + 1}. {med.name}</div>
                  <div className="p-3 border-r border-gray-800">{med.unit}</div>
                  <div className="p-3 border-r border-gray-800">{med.dosage}</div>
                  <div className="p-3">
                  <input
  type="text"
  value={med.pharmacistNote || ""}
  onChange={e => isPharmacy && handlePharmacistNoteChange(idx, e.target.value)}
  className="w-full border border-gray-300 rounded p-1"
  placeholder="Enter Pharmacist Note"
  readOnly={!isPharmacy}
/>
                  </div>
                </div>
              ))}
              {/* Extra empty rows */}
              {[...Array(3)].map((_, i) => (
                <div key={`extra-${i}`} className={`grid grid-cols-4 ${i % 2 === 0 ? "bg-yellow-50" : "bg-blue-50"} border-b border-gray-800`}>
                  <div className="p-3 border-r border-gray-800">&nbsp;</div>
                  <div className="p-3 border-r border-gray-800">&nbsp;</div>
                  <div className="p-3 border-r border-gray-800">&nbsp;</div>
                </div>
              ))}
            </div>
            {isPharmacy && (
  <div className="flex justify-end mt-4">
    <Button
      onClick={handleSavePharmacistNotes}
      className="bg-blue-600 text-white rounded-xl hover:bg-blue-600"
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <Loader className="animate-spin h-4 w-4 mr-2" />
          Saving...
        </>
      ) : (
        "Save Pharmacist Notes"
      )}
    </Button>
  </div>
)}

            {/* Diet Instructions */}
            <div className="bg-blue-100 p-4 border border-gray-800 min-h-[80px]">
              <div className="font-semibold mb-2">Diet To Follow:</div>
              <div>{prescription.dietInstructions}</div>
            </div>

            {/* Patient History */}
            <div className="bg-yellow-100 p-4 border border-gray-800 min-h-[120px]">
              <div className="font-semibold mb-2">Brief History of Patient:</div>
              <div>{prescription.patientHistory}</div>
            </div>

            {/* Follow Up Instructions */}
            <div className="bg-blue-100 p-3 border border-gray-800">
              <span className="font-semibold">Follow Up Instructions: </span>
              <span>{prescription.followUpInstructions}</span>
            </div>
          </div>


          {/* Footer with Signature */}
          <div className="bg-white p-6 border-t-2 border-gray-800">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="font-semibold mb-4">Digital Signature of Physician:</div>
                <div className="border-2 border-gray-800 w-64 pb-8 pt-2 px-4 bg-blue-50">
                  <div className="text-center font-bold text-blue-800">{prescription.doctorName}</div>
                  <div className="text-center text-xs text-gray-600 mt-1">{prescription.doctorSpecialty}</div>
                  <div className="text-center text-xs text-gray-600">Reg: {prescription.doctorRegistration}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
