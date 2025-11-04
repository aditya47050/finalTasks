"use client"

import useSWR from "swr"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Building, Mail, Briefcase, FileText } from "lucide-react"

const fetcher = (url) => fetch(url).then((r) => r.json())

function renderValue(v, fallback = "Not provided") {
  if (v === null || v === undefined || (typeof v === "string" && v.trim() === "")) return fallback
  return v 
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase()
  const variant = s === "approved" ? "default" : s === "rejected" ? "destructive" : "secondary"
  return <Badge variant={variant}>{status || "Unknown"}</Badge>
}

export default function EmployerProfile() {
  const params = useParams()
  const employerId = params?.id
  const { data, error, isLoading } = useSWR(
    employerId ? `/api/jobaadhar/superadmin/employer/${employerId}` : null,
    fetcher,
  )

  const success = data?.success
  const employer = success ? data?.data : null
  const jobs = employer?.company?.jobs || []

  const appData = [
    { name: "Applied", value: jobs.reduce((acc, j) => acc + (j.applications || []).filter(a => a.status === "APPLIED").length, 0) },
    { name: "Under Review", value: jobs.reduce((acc, j) => acc + (j.applications || []).filter(a => a.status === "UNDER_REVIEW").length, 0) },
    { name: "Shortlisted", value: jobs.reduce((acc, j) => acc + (j.applications || []).filter(a => a.status === "SHORTLISTED").length, 0) },
    { name: "Rejected", value: jobs.reduce((acc, j) => acc + (j.applications || []).filter(a => a.status === "REJECTED").length, 0) },
    { name: "Hired", value: jobs.reduce((acc, j) => acc + (j.applications || []).filter(a => a.status === "HIRED").length, 0) },
  ]

  const COLORS = ["#0EA5E9", "#38BDF8", "#7DD3FC", "#BAE6FD", "#E0F2FE"]
  const totalApplications = appData.reduce((a, b) => a + b.value, 0)

  return (
    <div className="space-y-6 container bg-gradient-to-b from-sky-50 via-white to-slate-50 min-h-screen p-4">
      
      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-60" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      )}

      {/* Error state */}
      {!isLoading && (error || (!success && data)) && (
        <Card className="bg-gradient-to-r from-red-100 to-red-200 border-red-300">
          <CardHeader>
            <CardTitle>Unable to load employer</CardTitle>
            <CardDescription>There was a problem fetching this employer. Please try again.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && success && !employer && (
        <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
          <CardHeader>
            <CardTitle>No employer data</CardTitle>
            <CardDescription>We couldn&apos;t find details for this employer.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Content */}
      {!isLoading && employer && (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-100 via-white to-indigo-50 shadow-md">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-auto overflow-hidden rounded-md border">
                <img
                  src={employer.company?.logoUrl || "/placeholder.svg"}
                  alt={`${renderValue(employer.company?.name, "Company")} logo`}
                  fill
                  className="object-cover w-auto h-14"
                />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Building className="w-5 h-5 text-sky-500" /> {renderValue(employer.user.fullName, "Employer")}
                </h1>
                <p className="text-sm text-gray-500">
                  {renderValue(employer.company?.name, "Company")} • {renderValue(employer.company?.city, "City")},{" "}
                  {renderValue(employer.company?.state, "State")}, {renderValue(employer.company?.country, "Country")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={employer.status} />
              <Badge variant="outline" className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> {renderValue(employer.user.email, "No email")}
              </Badge>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-r from-blue-100 to-blue-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1"><Briefcase className="w-4 h-4" /> Jobs Posted</CardTitle>
                <CardDescription>Total jobs created by this company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{jobs.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-100 to-green-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1"><Briefcase className="w-4 h-4" /> Applications</CardTitle>
                <CardDescription>Across all jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalApplications}</div>
              </CardContent>
            </Card>
          </div>

          {/* Company & Documents */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 bg-gradient-to-r from-purple-50 via-white to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-1"><Building className="w-4 h-4" /> Company</CardTitle>
                <CardDescription>Overview and culture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-500">{renderValue(employer.company?.about)}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Founded:</span>{" "} <span className="text-foreground">{renderValue(employer.company?.founded)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Location:</span>{" "} <span className="text-foreground">{renderValue(employer.company?.city)}, {renderValue(employer.company?.state)}, {renderValue(employer.company?.country)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(employer.company?.tags?.length ? employer.company.tags.map(t => t.tag.name) : []).map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                  {!employer.company?.tags?.length && <span className="text-sm text-gray-500">No tags</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(employer.company?.benefits?.length ? employer.company.benefits.map(b => b.benefit.name) : []).map(b => (
                    <Badge key={b} className="bg-blue-500 text-blue-50 hover:bg-blue-600">{b}</Badge>
                  ))}
                  {!employer.company?.benefits?.length && <span className="text-sm text-gray-500">No benefits listed</span>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 via-white to-yellow-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-1"><FileText className="w-4 h-4" /> Documents</CardTitle>
                <CardDescription>Compliance files</CardDescription>
              </CardHeader>
              <CardContent>
                {employer.documents?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Link</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employer.documents.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.type}</TableCell>
                          <TableCell>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline text-blue-500">View</a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-gray-500">No documents provided</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Applications Chart */}
          <Card className="bg-gradient-to-r from-cyan-50 via-white to-cyan-100">
            <CardHeader>
              <CardTitle>Applications Status</CardTitle>
              <CardDescription>Distribution across all jobs</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              {jobs.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {appData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500">No jobs to chart</p>
              )}
            </CardContent>
          </Card>

          {/* Jobs */}
          <Card className="bg-gradient-to-r from-indigo-50 via-white to-indigo-100">
            <CardHeader>
              <CardTitle>Jobs Posted</CardTitle>
              <CardDescription>Recent job listings by this company</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {jobs.length ? (
                jobs.map(job => {
                  const apps = job.applications || []
                  return (
                    <Card key={job.id} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{renderValue(job.title, "Untitled Job")}</CardTitle>
                        <CardDescription className="line-clamp-2">{renderValue(job.description, "No description")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline">Applications {apps.length}</Badge>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <p className="text-sm text-gray-500">No jobs posted</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
