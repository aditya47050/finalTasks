"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, FileText, Stethoscope, Save, X } from "lucide-react"
import { COMMON_DIAGNOSES, COMMON_DIETS, MEDICATION_UNITS } from "@/lib/prescription-data"

export default function PrescriptionTemplateManager({ doctor, initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates || []);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeVitals: true,
    includeDiagnosis: true,
    includeMedications: true,
    includeDiet: true,
    includeHistory: true,
    includeFollowUp: true,
    commonDiagnoses: [],
    commonMedications: [],
    commonDiets: [],
    defaultInstructions: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      includeVitals: true,
      includeDiagnosis: true,
      includeMedications: true,
      includeDiet: true,
      includeHistory: true,
      includeFollowUp: true,
      commonDiagnoses: [],
      commonMedications: [],
      commonDiets: [],
      defaultInstructions: "",
    });
    setEditingTemplate(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingTemplate
        ? `/api/doctor/${doctor.id}/prescription-templates/${editingTemplate.id}`
        : `/api/doctor/${doctor.id}/prescription-templates`;

      const method = editingTemplate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedTemplate = await response.json();
        if (editingTemplate) {
          // Update existing
          setTemplates((prev) => prev.map((t) => (t.id === savedTemplate.id ? savedTemplate : t)));
        } else {
          // Add new
          setTemplates((prev) => [savedTemplate, ...prev]);
        }
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/doctor/${doctor.id}/prescription-templates/${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const addCommonItem = (field, item) => {
    if (item && !formData[field].includes(item)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], item],
      }));
    }
  };

  const removeCommonItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addCustomMedication = () => {
    const newMed = { name: "", unit: "Tablet", dosage: "" };
    setFormData((prev) => ({
      ...prev,
      commonMedications: [...prev.commonMedications, newMed],
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      commonMedications: prev.commonMedications.map((med, i) => (i === index ? { ...med, [field]: value } : med)),
    }));
  };

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              Prescription Templates
            </h2>
            <p className="text-blue-600 mt-1">Create and manage reusable prescription formats</p>
          </div>

          {/* Top Actions */}
          <div className="flex justify-end gap-2 items-end">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Template Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., General Consultation"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of template usage"
                      />
                    </div>
                  </div>

                  {/* Template Sections */}
                  <div>
                    <Label className="text-base font-semibold">Include Sections</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {[
                        { key: "includeVitals", label: "Vital Signs" },
                        { key: "includeDiagnosis", label: "Diagnosis" },
                        { key: "includeMedications", label: "Medications" },
                        { key: "includeDiet", label: "Diet Instructions" },
                        { key: "includeHistory", label: "Patient History" },
                        { key: "includeFollowUp", label: "Follow-up" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={formData[key]}
                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, [key]: checked }))}
                          />
                          <Label htmlFor={key}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Diagnoses */}
                  {formData.includeDiagnosis && (
                    <div>
                      <Label className="text-base font-semibold">Common Diagnoses</Label>
                      <div className="space-y-2">
                        <Select onValueChange={(value) => addCommonItem("commonDiagnoses", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add common diagnosis" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMMON_DIAGNOSES.map((diagnosis) => (
                              <SelectItem key={diagnosis} value={diagnosis}>
                                {diagnosis}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex flex-wrap gap-2">
                          {formData.commonDiagnoses.map((diagnosis, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {diagnosis}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeCommonItem("commonDiagnoses", index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common Medications */}
                  {formData.includeMedications && (
                    <div>
                      <Label className="text-base font-semibold">Common Medications</Label>
                      <div className="space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCustomMedication}
                          className="w-full bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Medication
                        </Button>

                        {formData.commonMedications.map((med, index) => (
                          <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded-lg">
                            <Input
                              placeholder="Medication name"
                              value={med.name || ""}
                              onChange={(e) => updateMedication(index, "name", e.target.value)}
                            />
                            <Select
                              value={med.unit || "Tablet"}
                              onValueChange={(value) => updateMedication(index, "unit", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MEDICATION_UNITS.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Dosage"
                              value={med.dosage || ""}
                              onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCommonItem("commonMedications", index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Diets */}
                  {formData.includeDiet && (
                    <div>
                      <Label className="text-base font-semibold">Common Diet Instructions</Label>
                      <div className="space-y-2">
                        <Select onValueChange={(value) => addCommonItem("commonDiets", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add diet instruction" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMMON_DIETS.map((diet) => (
                              <SelectItem key={diet} value={diet}>
                                {diet}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex flex-wrap gap-2">
                          {formData.commonDiets.map((diet, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {diet}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeCommonItem("commonDiets", index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Default Instructions */}
                  <div>
                    <Label htmlFor="defaultInstructions">Default Instructions</Label>
                    <Textarea
                      id="defaultInstructions"
                      value={formData.defaultInstructions}
                      onChange={(e) => setFormData((prev) => ({ ...prev, defaultInstructions: e.target.value }))}
                      placeholder="Default instructions that will appear in prescriptions using this template"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save Template"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          {templates.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="group h-full overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{template.name}</span>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(template.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-gray-600 mb-3">{template.description || "No description"}</p>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {template.includeVitals && <Badge variant="outline">Vitals</Badge>}
                        {template.includeDiagnosis && <Badge variant="outline">Diagnosis</Badge>}
                        {template.includeMedications && <Badge variant="outline">Medications</Badge>}
                        {template.includeDiet && <Badge variant="outline">Diet</Badge>}
                        {template.includeHistory && <Badge variant="outline">History</Badge>}
                        {template.includeFollowUp && <Badge variant="outline">Follow-up</Badge>}
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>Diagnoses: {template.commonDiagnoses?.length || 0}</p>
                        <p>Medications: {template.commonMedications?.length || 0}</p>
                        <p>Diet Options: {template.commonDiets?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
              <p className="text-gray-500 mb-4">Create your first prescription template to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
