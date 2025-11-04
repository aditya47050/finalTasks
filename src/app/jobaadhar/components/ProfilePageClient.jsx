"use client"

import useSWR from "swr"
import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, ChevronLeft, ChevronRight, Check, Save } from "lucide-react"
import { ProfileProgress } from "./profile-progress"
import { SectionCard } from "./section-card"
import { UploadButton } from "@uploadthing/react"
import { IoOpenOutline } from "react-icons/io5"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const fetcher = (url) => fetch(url).then((r) => r.json())

function computeCompletion(p) {
  const weights = {
    personal: 20,
    bio: 10,
    photo: 10,
    resume: 15,
    skills: 15,
    education: 15,
    experience: 15,
  }

  let score = 0
  const personalFilled =
    (p.fullName && p.fullName.trim().length > 0 ? 1 : 0) + (p.phone && p.phone.trim().length > 0 ? 1 : 0)
  score += weights.personal * Math.min(1, personalFilled / 2)

  if (p.bio && p.bio.trim().length > 0) score += weights.bio
  if (p.profilePhoto && p.profilePhoto.trim().length > 0) score += weights.photo
  if (p.resumeUrl && p.resumeUrl.trim().length > 0) score += weights.resume

  const skillsScore = Math.min(1, (p.skills?.length || 0) / 5)
  score += weights.skills * skillsScore

  const eduScore = Math.min(1, (p.education?.length || 0) / 2)
  score += weights.education * eduScore

  const expScore = Math.min(1, (p.experience?.length || 0) / 2)
  score += weights.experience * expScore

  return Math.round(score)
}

const steps = [
  { id: "overview", name: "Overview", title: "Profile Snapshot" },
  { id: "personal", name: "Personal Info", title: "Personal Information" },
  { id: "education", name: "Education", title: "Education" },
  { id: "experience", name: "Experience", title: "Experience" },
  { id: "skills", name: "Skills", title: "Skills" },
  { id: "resume", name: "Resume & Photo", title: "Resume & Photo" },
]

export default function ProfilePageClient({ user }) {
  const userId = user.id
  const initialName = user.fullName || user.name || ""
  const [currentStep, setCurrentStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
    education: [],
    experience: [],
    skills: [],
    resumeUrl: "",
    profilePhoto: "",
  })

  // Add this state
const [isInitialized, setIsInitialized] = useState(false);

const { data, mutate, isLoading } = useSWR(
  `/api/jobaadhar/job-seeker/profile?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(user.email)}`,
  fetcher,
  { revalidateOnFocus: false }
)

// Initialize formData only once when data arrives
useEffect(() => {
  if (data && !isInitialized) {
    setFormData({
      fullName: data.user.fullName || "",
      phone: data.user.phone || "",
      bio: data.bio || "",
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills?.map((s) => s.skill?.name || s) || [],
      resumeUrl: data.resumeUrl || "",
      profilePhoto: data.profilePhoto || "",
    })
    setIsInitialized(true)
  }
}, [data, isInitialized])



  const profile = data
  const completion = useMemo(() => computeCompletion(formData), [formData])

  const saveCurrentStep = async () => {
    if (!profile) return

    setIsSaving(true)
    setSaveError(null)

    try {
      let payload = { userId, step: currentStep }

      // Add step-specific data to payload
      switch (currentStep) {
        case 1: // Personal Info
          payload = { ...payload, fullName: formData.fullName, phone: formData.phone, bio: formData.bio }
          break
        case 2: // Education
          payload = { ...payload, education: formData.education }
          break
        case 3: // Experience
          payload = { ...payload, experience: formData.experience }
          break
        case 4: // Skills
          payload = { ...payload, skills: formData.skills }
          break
        case 5: // Resume & Photo
          payload = { ...payload, resumeUrl: formData.resumeUrl, profilePhoto: formData.profilePhoto }
          break
      }

      const res = await fetch("/api/jobaadhar/job-seeker/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save")
      }

      const updated = await res.json()
      mutate(updated, false)
      toast.success("Step saved successfully!")
    } catch (error) {
      console.error("Save error:", error)
      setSaveError(error.message)
      toast.error(`Save failed: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  function addSkill(skill) {
    if (!skill.trim()) return
    const newSkills = Array.from(new Set([...formData.skills, skill.trim()]))
    updateFormData({ skills: newSkills })
  }

  function removeSkill(skill) {
    const newSkills = formData.skills.filter((s) => s !== skill)
    updateFormData({ skills: newSkills })
  }

  function addEducation() {
    const newEducation = [
      ...formData.education,
      { degree: "", field: "", institution: "", startYear: undefined, endYear: undefined },
    ]
    updateFormData({ education: newEducation })
  }

  function updateEducation(idx, patch) {
    const newEducation = [...formData.education]
    newEducation[idx] = { ...newEducation[idx], ...patch }
    updateFormData({ education: newEducation })
  }

  function removeEducation(idx) {
    const newEducation = formData.education.filter((_, i) => i !== idx)
    updateFormData({ education: newEducation })
  }

  function addExperience() {
    const today = new Date().toISOString().slice(0, 10)
    const newExperience = [
      ...formData.experience,
      { title: "", company: "", startDate: today, endDate: "", description: "" },
    ]
    updateFormData({ experience: newExperience })
  }

  function updateExperience(idx, patch) {
    const newExperience = [...formData.experience]
    newExperience[idx] = { ...newExperience[idx], ...patch }
    updateFormData({ experience: newExperience })
  }

  function removeExperience(idx) {
    const newExperience = formData.experience.filter((_, i) => i !== idx)
    updateFormData({ experience: newExperience })
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    await saveCurrentStep()
    alert("Profile submitted successfully!")
  }

  const currentStepData = steps[currentStep]
      console.log(formData);

  return (
    <div className="container mx-auto px-4 lg:px-12 py-8 md:py-10">
      {(isSaving || saveError) && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            isSaving
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isSaving ? "💾 Saving changes..." : `❌ ${saveError}`}
        </div>
      )}

      <div className="rounded-xl bg-blue-500 text-white p-6 md:p-8 mb-6 md:mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className=" flex items-center gap-8">
            <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted">
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto || "/placeholder.svg"}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">No photo</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-balance">
                {data?.user?.fullName || initialName || "Complete Your Profile"}
              </h1>
              <p className="text-white/90 mt-1">
                {user.email} {profile?.phone ? "• " + profile.phone : ""}
              </p>
            </div>
          </div>
          <div className="min-w-[220px] bg-white/15 rounded-xl p-3">
            <ProfileProgress value={completion} />
          </div>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="text-sm font-medium text-blue-600">{completion}% Complete</div>
        </div>

        <div className="flex justify-evenly items-center gap-0 w-full mb-4 xl:pl-40">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center w-full">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index + 1 <= currentStep ? "bg-[#5271FF] text-white" : "bg-white border-2 border-[#5271FF] text-[#5271FF]"}`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < 6 - 1 && (
                <div className={`flex-1 h-1 mx-2 ${index + 1 < currentStep ? "bg-[#5271FF]" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold">{currentStepData.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentStep > 0 && `Previous: ${steps[currentStep - 1].name}`}
            {currentStep > 0 && currentStep < steps.length - 1 && " • "}
            {currentStep < steps.length - 1 && `Next: ${steps[currentStep + 1].name}`}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-5">
        {currentStep === 0 && (
          <SectionCard title="Profile Snapshot" description="Quick summary of your profile details.">
            {isLoading || !profile ? (
              <p className="text-sm text-muted-foreground">Loading profile…</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium">{data.user.fullName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{data.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{data.user.phone || "—"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Bio</p>
                    <p className="font-medium whitespace-pre-wrap">{data.bio?.trim() || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Resume</p>
                    {profile.resumeUrl ? (
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit flex items-center gap-2 bg-blue-600 text-white p-2 rounded-xl"
                      >
                        View resume <IoOpenOutline />
                      </a>
                    ) : (
                      <p className="font-medium">—</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </SectionCard>
        )}

        {currentStep === 1 && (
          <SectionCard title="Personal Information" description="Recruiters use this to contact you.">
            <form
              className="grid md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => updateFormData({ fullName: e.target.value })}
                  placeholder={data.user.fullName}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  placeholder={data.user.phone}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => updateFormData({ bio: e.target.value })}
                  placeholder={data?.bio ? data.bio : "Write a short summary about your experience and goals"}
                  className="min-h-[100px]"
                />
              </div>
            </form>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={saveCurrentStep}
                disabled={isSaving}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Personal Info"}
              </Button>
            </div>
          </SectionCard>
        )}

        {currentStep === 2 && (
          <SectionCard title="Education" description="Add your degrees and institutions.">
            <div className="space-y-4">
              {formData.education.map((ed, idx) => (
                <div key={idx} className="rounded-md border p-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Degree</label>
                      <Input
                        value={ed.degree}
                        onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                        placeholder="B.Tech, B.Sc, M.Sc, MBA…"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Field</label>
                      <Input
                        value={ed.field || ""}
                        onChange={(e) => updateEducation(idx, { field: e.target.value })}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Institution</label>
                      <Input
                        value={ed.institution}
                        onChange={(e) => updateEducation(idx, { institution: e.target.value })}
                        placeholder="University name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Year</label>
                        <Input
                          type="number"
                          value={ed.startYear || ""}
                          onChange={(e) => updateEducation(idx, { startYear: Number(e.target.value) || undefined })}
                          placeholder="2019"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Year</label>
                        <Input
                          type="number"
                          value={ed.endYear || ""}
                          onChange={(e) => updateEducation(idx, { endYear: Number(e.target.value) || undefined })}
                          placeholder="2023"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="gap-2 bg-red-500 hover:bg-red-500 text-white rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={addEducation}
                  className="gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  Add Education
                </Button>
                <Button
                  onClick={saveCurrentStep}
                  disabled={isSaving}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl ml-auto"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Education"}
                </Button>
              </div>
            </div>
          </SectionCard>
        )}

        {currentStep === 3 && (
          <SectionCard title="Experience" description="Add your roles and achievements.">
            <div className="space-y-4">
              {formData.experience.map((ex, idx) => (
                <div key={idx} className="rounded-md border p-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={ex.title}
                        onChange={(e) => updateExperience(idx, { title: e.target.value })}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <Input
                        value={ex.company}
                        onChange={(e) => updateExperience(idx, { company: e.target.value })}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Input
                          type="date"
                          value={ex.startDate ? new Date(ex.startDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => updateExperience(idx, { startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                          type="date"
                          value={ex.endDate ? new Date(ex.endDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => updateExperience(idx, { endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={ex.description || ""}
                        onChange={(e) => updateExperience(idx, { description: e.target.value })}
                        placeholder="Key responsibilities and achievements"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeExperience(idx)}
                      className="gap-2 bg-red-500 hover:bg-red-500 text-white rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={addExperience}
                  className="gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  Add Experience
                </Button>
                <Button
                  onClick={saveCurrentStep}
                  disabled={isSaving}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl ml-auto"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Experience"}
                </Button>
              </div>
            </div>
          </SectionCard>
        )}

        {currentStep === 4 && (
          <SectionCard title="Skills" description="Add your top skills to improve discoverability.">
            <SkillEditor
              skills={formData.skills.map(s => typeof s === "string" ? s : s.skill.name)}
              onAdd={addSkill}
              onRemove={removeSkill}
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={saveCurrentStep}
                disabled={isSaving}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Skills"}
              </Button>
            </div>
          </SectionCard>
        )}

        {currentStep === 5 && (
          <SectionCard title="Resume & Photo" description="Upload links for recruiters to view.">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Resume Upload */}
              <div className="space-y-2">
                <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                  <span className="text-gray-600">{formData.resumeUrl ? "Uploaded" : "Upload Resume"}</span>
                  <UploadButton
                    endpoint="fileUploader"
                    content={{
                      button({ ready }) {
                        return <div>{ready && <div>Upload</div>}</div>
                      },
                      allowedContent: () => "",
                    }}
                    appearance={{
                      button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                      container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                      allowedContent: "hidden",
                    }}
                    onClientUploadComplete={(res) => {
                      if (res.length > 0) {
                        updateFormData({ resumeUrl: res[0].url })
                        toast.success("Resume Upload Completed")
                      }
                    }}
                    onUploadError={(error) => {
                      toast.error(`ERROR! ${error.message}`)
                    }}
                  />
                </label>
              </div>

              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                  <span className="text-gray-600">{formData.profilePhoto ? "Uploaded" : "Upload Photo"}</span>
                  <UploadButton
                    endpoint="fileUploader"
                    content={{
                      button({ ready }) {
                        return <div>{ready && <div>Upload</div>}</div>
                      },
                      allowedContent: () => "",
                    }}
                    appearance={{
                      button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                      container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                      allowedContent: "hidden",
                    }}
                    onClientUploadComplete={(res) => {
                      if (res.length > 0) {
                        updateFormData({ profilePhoto: res[0].url })
                        toast.success("Photo Upload Completed")
                      }
                    }}
                    onUploadError={(error) => {
                      toast.error(`ERROR! ${error.message}`)
                    }}
                  />
                </label>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto || "/placeholder.svg"}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No photo</span>
                )}
              </div>
              {formData.resumeUrl ? (
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white p-2 rounded-xl"
                >
                  Preview resume <IoOpenOutline />
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">No resume added</span>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={saveCurrentStep}
                disabled={isSaving}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Resume & Photo"}
              </Button>
            </div>
          </SectionCard>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="gap-2 bg-gray-200 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="text-sm text-gray-500">
          {currentStep + 1} / {steps.length}
        </div>

        {currentStep === steps.length - 1 ? (
          <Button
            type="button"
            onClick={handleSubmit}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            <Check className="h-4 w-4" />
            Submit Profile
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function SkillEditor({ skills, onAdd, onRemove }) {
  const [value, setValue] = useState("")
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a skill (e.g., React, Node.js)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onAdd(value)
              setValue("")
            }
          }}
        />
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          onClick={() => {
            onAdd(value)
            setValue("")
          }}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? <p className="text-sm text-muted-foreground">No skills added yet.</p> : null}
        {skills.map((s) => (
          <Badge key={s} variant="secondary" className="px-2 py-1">
            <span className="mr-2 bg-blue-500 text-white p-1 px-2 rounded-xl">{s}</span>
            <button
              className="text-xs text-gray-500 hover:text-gray-800"
              onClick={() => onRemove(s)}
              aria-label={`Remove ${s}`}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
