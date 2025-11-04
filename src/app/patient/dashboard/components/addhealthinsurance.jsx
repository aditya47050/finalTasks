import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadButton } from "@uploadthing/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AddHealthInsurance = ({ patientId, healthinsurancedata }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    provider: "",
    policyNumber: "",
    document: "",
    coverage: "",
    copay: "",
  });
  const [existingData, setExistingData] = useState(healthinsurancedata);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopayChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setFormData((prev) => ({ ...prev, copay: value }));
  };

  const handleFileUploadComplete = (res) => {
    if (res?.[0]?.url) {
      setFormData((prev) => ({ ...prev, document: res[0].url }));
      toast.success("Document uploaded successfully!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form data
    if (!formData.provider || !formData.policyNumber) {
      toast("Please fill in all required fields.");
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formPayload.append(key, formData[key]);
      }
    });

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/patient/${patientId}/health-insurance`,
        {
          method: "POST",
          body: formPayload,
        }
      );

      if (response.ok) {
        toast("Health insurance added successfully!");
        setOpen(false); // Close the dialog on success
        // Refresh the existing data
        const updatedData = await response.json();
        setExistingData((prev) => [...prev, updatedData]);
      } else {
        toast("Failed to add health insurance.");
      }
    } catch (error) {
      toast("An error occurred. Please try again.");
    }
    finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-2 gap-4 mb-4">
        {existingData.map((insurance) => (
          <div
            key={insurance.id}
            className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {insurance.provider}
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Policy Number:</strong> {insurance.policyNumber}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Coverage:</strong> {insurance.coverage}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Copay:</strong> {insurance.copay}%
            </p>
            {insurance.document && (
              <Link
                href={insurance.document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Document
              </Link>
            )}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#5271FF] hover:bg-[#4460e6] text-white font-bold md:text-[11px] text-[9px] xl:text-[13px] md:py-2 md:px-4 px-2 py-1 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
            Add Health Insurance
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-2xl font-bold text-[#5271FF]">
              Add Health Insurance
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="bg-white p-2 rounded-xl shadow-sm border">
              <Label
                htmlFor="provider"
                className="text-sm font-semibold text-gray-700"
              >
                Provider *
              </Label>
              <Input
                id="provider"
                type="text"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                placeholder="Provider"
                required
                className="mt-1"
              />
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border">
              <Label
                htmlFor="policyNumber"
                className="text-sm font-semibold text-gray-700"
              >
                Policy Number *
              </Label>
              <Input
                id="policyNumber"
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="Policy Number"
                required
                className="mt-1"
              />
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border">
              <Label className="text-sm font-semibold text-gray-700 block mb-2">
                Document
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#5271FF] transition-colors">
                <UploadButton
                  endpoint="fileUploader"
                  onClientUploadComplete={handleFileUploadComplete}
                  appearance={{
                    button:
                      "w-full bg-[#5271FF] hover:bg-[#4460e6] text-white py-2 px-4 rounded font-medium flex justify-center items-center",
                    allowedContent: "text-xs text-gray-500 mt-2",
                  }}
                />
                {formData.document && (
                  <div className="mt-2 text-green-600 text-sm flex items-center justify-center">
                    Document uploaded successfully
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border">
              <Label
                htmlFor="coverage"
                className="text-sm font-semibold text-gray-700"
              >
                Coverage
              </Label>
              <Input
                id="coverage"
                type="text"
                name="coverage"
                value={formData.coverage}
                onChange={handleChange}
                placeholder="Coverage"
                className="mt-1"
              />
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border">
              <Label
                htmlFor="copay"
                className="text-sm font-semibold text-gray-700"
              >
                Copay (%)
              </Label>
              <Input
                id="copay"
                type="text"
                name="copay"
                value={formData.copay}
                onChange={handleCopayChange}
                placeholder="Copay (%)"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddHealthInsurance;