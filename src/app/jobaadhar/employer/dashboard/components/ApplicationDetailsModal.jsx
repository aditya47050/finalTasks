"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function ApplicationDetailsModal({ open, setOpen, details }) {
  if (!details) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Applicant Info */}
          <div className="flex gap-4 items-center">
            <Image
              width={100}
              height={100}
              src={details.seeker?.profilePhoto || "/placeholder.svg"}
              alt="profile"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{details.seeker?.user?.fullName || "N/A"}</p>
              <p className="text-sm text-gray-500">{details.seeker?.user?.email}</p>
            </div>
          </div>

          {/* Resume */}
          <div>
            <p className="font-medium">Resume:</p>
            {details.seeker?.resumeUrl ? (
              <a
                href={details.seeker.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Resume
              </a>
            ) : (
              <span className="text-gray-400">No resume</span>
            )}
          </div>

          {/* Education */}
          <div>
            <p className="font-medium">Education:</p>
            {details.seeker?.education?.length ? (
              <ul className="list-disc pl-5 text-sm">
                {details.seeker.education.map((edu) => (
                  <li key={edu.id}>
                    {edu.degree} in {edu.field} @ {edu.institution} ({edu.startYear} -{" "}
                    {edu.endYear || "Present"})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No education info</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <p className="font-medium">Experience:</p>
            {details.seeker?.experience?.length ? (
              <ul className="list-disc pl-5 text-sm">
                {details.seeker.experience.map((exp) => (
                  <li key={exp.id}>
                    {exp.title} at {exp.company} (
                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No experience info</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <p className="font-medium">Skills:</p>
            {details.seeker?.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {details.seeker.skills.map((s) => (
                  <Badge key={s.id} variant="secondary">
                    {s.skill?.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No skills</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
