// components/employer/ProfileForm.jsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import { UploadButton } from "@uploadthing/react"

export function ProfileForm({
  initialCompany,
  category,
  initialDocuments = [],
  initialTags = [],
  initialBenefits = [],
  initialReviews = [],
  categoriesProp = null,
  userIdForDev = null,
}) {
  const [documents, setDocuments] = useState(
    initialDocuments.length > 0 ? initialDocuments : (initialCompany?.documents ?? []),
  )
  const [tags, setTags] = useState(initialTags)
  const [benefits, setBenefits] = useState(initialBenefits)
  const [reviews, setReviews] = useState(initialReviews)

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [serverCompanyId, setServerCompanyId] = useState(initialCompany?.company?.id ?? null)
  const [categories, setCategories] = useState(categoriesProp ?? [])
  const [formData, setFormData] = useState({
    name: initialCompany?.company?.name ?? "",
    logoUrl: initialCompany?.company?.logoUrl ?? "",
    founded: initialCompany?.company?.founded?.toString?.() ?? "",
    about: initialCompany?.company?.about ?? "",
    categoryId: initialCompany?.company?.categoryId ?? "",

    addressLine1: initialCompany?.company?.addressLine1 ?? "",
    addressLine2: initialCompany?.company?.addressLine2 ?? "",
    district: initialCompany?.company?.district ?? "",
    city: initialCompany?.company?.city ?? "",
    state: initialCompany?.company?.state ?? "",
    pincode: initialCompany?.company?.pincode ?? "",
    country: initialCompany?.company?.country ?? "India",

    mission: initialCompany?.company?.mission ?? "",
    values: initialCompany?.company?.values ?? "",
    culture: initialCompany?.company?.culture ?? "",

    // step 3 additions
    tagsText: initialTags.map(t => t.name).join(", "),
  benefitsText: initialBenefits.map(b => b.name).join(", "),
  rating: {
    culture: initialCompany?.company?.ratings?.culture ?? 0,
    skillDevelopment: initialCompany?.company?.ratings?.skillDevelopment ?? 0,
    workSatisfaction: initialCompany?.company?.ratings?.workSatisfaction ?? 0,
    workLife: initialCompany?.company?.ratings?.workLife ?? 0,
    careerGrowth: initialCompany?.company?.ratings?.careerGrowth ?? 0,
    jobSecurity: initialCompany?.company?.ratings?.jobSecurity ?? 0,
  },
  })

  useEffect(() => {
    if (!categoriesProp || categoriesProp.length === 0) {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setCategories(data)
          else if (data.categories) setCategories(data.categories)
        })
        .catch((e) => console.warn("Could not fetch categories:", e))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((p) => ({ ...p, [id]: value }))
  }

  const handleRatingChange = (e) => {
    const { id, value } = e.target
    setFormData((p) => ({
      ...p,
      rating: { ...p.rating, [id]: Number(value) },
    }))
  }

  const totalSteps = 3

  const mapFormToCompanyPayload = () => {
    // turn comma-separated tags/benefits into arrays
    const tags = (formData.tagsText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const benefits = (formData.benefitsText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    return {
      name: formData.name,
      logoUrl: formData.logoUrl || "",
      founded: formData.founded ? Number.parseInt(formData.founded, 10) : undefined,
      about: formData.about,
      categoryId: formData.categoryId || undefined,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      district: formData.district,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      country: formData.country,
      mission: formData.mission,
      values: formData.values,
      culture: formData.culture,
      tags,
      benefits,
      rating: formData.rating,
    }
  }

  const saveStepToServer = async (stepToSave = step) => {
    setSaving(true)
    try {
      const payload = {
        userId: userIdForDev,
        companyId: serverCompanyId,
        step: stepToSave,
        data: mapFormToCompanyPayload(),
        documents,
      }

      const res = await fetch("/api/jobaadhar/employer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (json?.company?.id) setServerCompanyId(json.company.id)
      toast.success("Step saved")
    } catch (err) {
      console.error("Save step error:", err)
      toast.error("Failed to save step")
    } finally {
      setSaving(false)
    }
  }

  const nextStep = async () => {
    await saveStepToServer(step)
    setStep((s) => Math.min(totalSteps, s + 1))
  }

  const prevStep = () => setStep((s) => Math.max(1, s - 1))

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const payload = {
        userId: userIdForDev,
        companyId: serverCompanyId,
        data: mapFormToCompanyPayload(),
        documents,
      }

      const res = await fetch("/api/jobaadhar/employer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (json.ok) {
        toast.success("Company profile saved successfully")
        setServerCompanyId(json.company.id)
      } else {
        console.error("Submit error:", json)
        toast.error("Failed to save profile")
      }
    } catch (err) {
      console.error("Submit error:", err)
      toast.error("Error saving profile")
    } finally {
      setSaving(false)
    }
  }

  const onLogoChoose = async (file) => {
    if (!file) return
    setLogoUploading(true)
    const url = URL.createObjectURL(file)
    setFormData((p) => ({ ...p, logoUrl: url }))
    setLogoUploading(false)
    toast.success("Logo selected")
  }

  const onDocChoose = async (docType,file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    const uploaded = { type: docType, fileUrl: url, verified: false }
    setDocuments((prev) => {
      const others = prev.filter((d) => d.type !== docType)
      return [...others, uploaded]
    })
    toast.success(`${docType} selected`)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mx-auto flex flex-col justify-center items-center mb-8">
              <Label className="my-2">Company Logo</Label>

              {formData.logoUrl ? (
  <div className="flex items-center gap-4">
    <Image
      height={100}
      width={100}
      src={
        formData.logoUrl ||
        "/placeholder.svg?height=100&width=200&query=company logo preview"
      }
      alt="Company Logo"
      className="w-32 h-16 object-contain rounded-xl border bg-white"
    />
    <Button
      variant="outline"
      onClick={() => setFormData((prev) => ({ ...prev, logoUrl: "" }))}
    >
      Remove
    </Button>
  </div>
) : (
  <label className="w-full max-w-sm h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
    <span className="text-gray-600 text-sm">Upload Logo</span>

    <UploadButton
      endpoint="fileUploader"
      content={{
        button({ ready }) {
          return <div>{ready && <div>Upload</div>}</div>
        },
        allowedContent: () => "",
      }}
      appearance={{
        button:
          "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
        container:
          "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
        allowedContent: "hidden",
      }}
      onClientUploadComplete={(res) => {
        if (res.length > 0) {
          const url = res[0].url
          setFormData((prev) => ({ ...prev, logoUrl: url }))
          toast.success("Logo uploaded successfully")
        }
      }}
      onUploadError={(error) => {
        toast.error(`ERROR! ${error.message}`)
      }}
    />
  </label>
)}

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="Acme Pvt Ltd" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Industry (Category)</Label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="border rounded-xl p-2 bg-background text-foreground"
                >
                  <option value="">Select Industry</option>
                  {category.map((c) => (
                    <option key={c.id || c._id || c.name} value={c.id ?? c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="founded">Founded (Year)</Label>
                <Input id="founded" value={formData.founded} onChange={handleChange} placeholder="2015" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="about">Company Description</Label>
                <Input
                  id="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="What does the company do?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 col-span-1 md:col-span-2 gap-6">
                {["PAN", "GST", "Address Proof", "ID Proof"].map((docType) => {
  const existing = documents.find((d) => d.type === docType)
  return (
    <div key={docType} className="w-full">
      <label className="block mb-1 text-sm text-muted-foreground">{docType}</label>

      <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
        <span className="text-gray-600 text-sm">
          {existing ? `${docType} Uploaded` : `Upload ${docType}`}
        </span>

        <UploadButton
          endpoint="fileUploader"
          content={{
            button({ ready }) {
              return <div>{ready && <div>Upload</div>}</div>
            },
            allowedContent: () => "",
          }}
          appearance={{
            button:
              "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
            container:
              "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
            allowedContent: "hidden",
          }}
          onClientUploadComplete={(res) => {
            if (res.length > 0) {
              const url = res[0].url
              setDocuments((prev) => {
                const others = prev.filter((d) => d.type !== docType)
                return [...others, { type: docType, fileUrl: url, verified: false }]
              })
              toast.success(`${docType} upload completed`)
            }
          }}
          onUploadError={(error) => {
            toast.error(`ERROR! ${error.message}`)
          }}
        />
      </label>

      {existing && (
        <div className="mt-1">
          <a
            href={existing.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-xs"
          >
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  )
})}

              </div>
            </div>
          </>
        )
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="123 MG Road"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Floor / Suite"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="district">District</Label>
              <Input id="district" value={formData.district} onChange={handleChange} placeholder="South Delhi" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={handleChange} placeholder="New Delhi" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={formData.state} onChange={handleChange} placeholder="Delhi" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" value={formData.pincode} onChange={handleChange} placeholder="110001" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mission">Mission</Label>
              <Input id="mission" value={formData.mission} onChange={handleChange} placeholder="Company mission" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="values">Values</Label>
              <Input
                id="values"
                value={formData.values}
                onChange={handleChange}
                placeholder="Integrity, Innovation..."
              />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="culture">Company Culture (short)</Label>
              <Input
                id="culture"
                value={formData.culture}
                onChange={handleChange}
                placeholder="Collaborative, fast-paced"
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="tagsText">Tags (comma-separated)</Label>
              <Input
                id="tagsText"
                value={formData.tagsText}
                onChange={handleChange}
                placeholder="Remote, FinTech, AI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="benefitsText">Benefits (comma-separated)</Label>
              <Input
                id="benefitsText"
                value={formData.benefitsText}
                onChange={handleChange}
                placeholder="Health insurance, Flexible hours, ESOP"
              />
            </div>

            <div className="md:col-span-2">
              <Label className="block mb-2">Employee Ratings (0-5)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["culture", "Culture"],
                  ["skillDevelopment", "Skill Development"],
                  ["workSatisfaction", "Work Satisfaction"],
                  ["workLife", "Work-Life Balance"],
                  ["careerGrowth", "Career Growth"],
                  ["jobSecurity", "Job Security"],
                ].map(([key, label]) => (
                  <div className="grid gap-2" key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={(formData.rating)[key] ?? 0}
                      onChange={handleRatingChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white">
      <CardHeader className="space-y-2">
        <CardTitle className="text-blue-500 text-center">
          Employer Profile - Step {step} of {totalSteps}
        </CardTitle>
        <CardDescription className="text-center">Complete your company profile to attract top talent.</CardDescription>

        <div className="mx-auto">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={[
                    "h-8 w-8 rounded-full grid place-items-center text-xs font-medium",
                    s <= step ? "bg-blue-500 text-white" : "bg-gray-500 text-white",
                  ].join(" ")}
                >
                  {s}
                </div>
                {s < totalSteps && <div className="h-[4px] w-24 md:w-[330px] bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderStep()}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button onClick={prevStep} variant="secondary" className="rounded-xl text-lg">
              Previous
            </Button>
          )}
          {step < totalSteps && (
            <Button onClick={nextStep} className="rounded-xl text-lg ml-auto">
              {saving ? "Saving..." : "Next (Save)"}
            </Button>
          )}
          {step === totalSteps && (
            <Button onClick={handleSubmit} className="rounded-xl text-lg ml-auto">
              {saving ? "Submitting..." : "Submit All"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
