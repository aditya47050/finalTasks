"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { Textarea } from '@/components/ui/textarea';

export function JobCreateForm({ companyId, employerId, job }) {
  const isEdit = !!job

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    employmentType: "",
    exp: "",
    openings: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    responsibilities: "",
    requirements: "",
    description: "",
  })

  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState("")

  const resRef = useRef(null)
  const reqRef = useRef(null)

  // Prefill in edit mode
  useEffect(() => {
    if (isEdit) {
      const [min, max] = job.salary?.split("-") || ["", ""]
      setFormData({
        jobTitle: job.title || "",
        jobType: job.workMode || "",
        employmentType: job.employmentType || "",
        exp: job.exp || "",
        openings: job.openings || "",
        location: job.location || "",
        salaryMin: min || "",
        salaryMax: max || "",
        responsibilities: job.responsibilities || "",
        requirements: job.requirements || "",
        description: job.description || "",
      })
      setSkills(job.skills?.map((s) => s.skill.name) || [])
    }
  }, [job, isEdit])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault()
      if (!skills.includes(skillInput.trim())) {
        setSkills((prev) => [...prev, skillInput.trim()])
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  // Bullet List Handling
  const handleBulletInput = (e, type) => {
    const text = e.target.innerText
    setFormData((prev) => ({
      ...prev,
      [type]: text,
    }))
  }

  const handleBulletKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      document.execCommand("insertHTML", false, "\n• ")
    }
  }

  // Pre-fill bullets on edit
  useEffect(() => {
    if (resRef.current && formData.responsibilities) {
      resRef.current.innerText = formData.responsibilities.startsWith("•")
        ? formData.responsibilities
        : "• " + formData.responsibilities.replace(/\n/g, "\n• ")
    }
    if (reqRef.current && formData.requirements) {
      reqRef.current.innerText = formData.requirements.startsWith("•")
        ? formData.requirements
        : "• " + formData.requirements.replace(/\n/g, "\n• ")
    }
  }, [formData.responsibilities, formData.requirements])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const method = isEdit ? "PUT" : "POST"
      const url = isEdit ? `/api/jobaadhar/employer/jobs/${job.id}` : "/api/jobaadhar/employer/jobs"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.jobTitle,
          description: formData.description,
          workMode: formData.jobType,
          location: formData.location,
          salary: formData.salaryMax
            ? `${formData.salaryMin}-${formData.salaryMax}`
            : formData.salaryMin,
          employerId,
          companyId,
          exp: formData.exp,
          openings: parseInt(formData.openings) || 0,
          employmentType: formData.employmentType,
          responsibilities: formData.responsibilities,
          requirements: formData.requirements,
          skills,
        }),
      })

      if (!response.ok) throw new Error("Failed to save job")

      const data = await response.json()
      alert(isEdit ? "Job Updated Successfully!" : "Job Posted Successfully!")
    } catch (error) {
      console.error(error)
      alert("Error saving job")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Job Title */}
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
          </div>

          {/* Work Mode */}
          <div>
            <Label htmlFor="jobType">Work Mode</Label>
            <Select
              onValueChange={(value) => handleSelectChange("jobType", value)}
              value={formData.jobType}
            >
              <SelectTrigger id="jobType">
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-site">On-Site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employment Type */}
          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select
              onValueChange={(value) => handleSelectChange("employmentType", value)}
              value={formData.employmentType}
            >
              <SelectTrigger id="employmentType">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div>
            <Label htmlFor="exp">Experience Level</Label>
            <Select
              onValueChange={(value) => handleSelectChange("exp", value)}
              value={formData.exp}
            >
              <SelectTrigger id="exp">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Openings */}
          <div>
            <Label htmlFor="openings">Number of Openings</Label>
            <Input
              id="openings"
              type="number"
              value={formData.openings}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <Label>Responsibilities</Label>
            <div
              ref={resRef}
              contentEditable
              onInput={(e) => handleBulletInput(e, "responsibilities")}
              onKeyDown={handleBulletKeyDown}
              placeholder="Type responsibilities (press Enter for new point)"
              className="mt-2 min-h-[120px] p-3 border rounded-md bg-white text-gray-800 whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ lineHeight: "1.6" }}
            />
          </div>

          {/* Requirements */}
          <div>
            <Label>Requirements</Label>
            <div
              ref={reqRef}
              contentEditable
              onInput={(e) => handleBulletInput(e, "requirements")}
              onKeyDown={handleBulletKeyDown}
              placeholder="Type requirements (press Enter for new point)"
              className="mt-2 min-h-[120px] p-3 border rounded-md bg-white text-gray-800 whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ lineHeight: "1.6" }}
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={formData.location} onChange={handleChange} />
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input id="salaryMin" type="number" value={formData.salaryMin} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input id="salaryMax" type="number" value={formData.salaryMax} onChange={handleChange} />
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter (e.g. React, Node.js)"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-white">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} required />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            {isEdit ? "Update Job" : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
