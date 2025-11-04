"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PrescriptionForm from "../components/PrescriptionForm"

export default function PrescriptionDialog({ 
  isOpen, 
  onClose, 
  doctor, 
  patient, 
  appointment, 
  templates, 
  onSave,
  doctorProducts // ✅ Receive doctor products
}) {
  const [loading, setLoading] = useState(false)

  const handleSavePrescription = async (data) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/doctor/${doctor.id}/prescription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || "Failed to save prescription")
      }
      onSave(result.data)
    } catch (error) {
      console.error("Error saving prescription:", error)
      alert("Failed to save prescription. Please check all required fields and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl w-full p-0 sm:p-0 overflow-hidden"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create Prescription</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full overflow-y-auto">
          <PrescriptionForm
            doctor={doctor}
            patient={patient}
            appointment={appointment}
            templates={templates}
            onSave={handleSavePrescription}
            onCancel={() => onClose()}
            loading={loading}
            isDialog
            doctorProducts={doctorProducts} // ✅ Pass to PrescriptionForm
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}