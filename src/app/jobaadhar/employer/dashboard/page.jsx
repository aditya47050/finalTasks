"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, FileText, List, User, PlusCircle, Building2, Phone, Mail, MapPin, CreditCard } from "lucide-react"
import { AppsTrendChart } from "./components/apps-trend-chart"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { GrStatusGood } from "react-icons/gr"

function AnimatedStat({ to, durationMs = 900, suffix }) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const from = 0

  useEffect(() => {
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3)
    }
    function step(ts) {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(1, elapsed / durationMs)
      const eased = easeOutCubic(progress)
      const current = Math.round(from + (to - from) * eased)
      setValue(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [to, durationMs])

  return (
    <span>
      {value.toLocaleString()} {suffix ? suffix : ""}
    </span>
  )
}

export default function EmployerDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const res = await fetch("/api/jobaadhar/employer/stats", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load stats")
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading)
  return (
    <main className="space-y-8 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-600 text-white h-48">
        <div className="absolute inset-0 bg-white/10" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col gap-6 justify-between h-full">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/30 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-5 w-48 bg-white/40 rounded"></div>
              <div className="h-3 w-32 bg-white/30 rounded"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-32 bg-white/30 rounded-lg"></div>
            <div className="h-8 w-28 bg-white/60 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Stat Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl h-28 bg-gradient-to-r from-gray-200 to-gray-100 shadow-sm"
          ></div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-xl border p-6">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-56 w-full bg-gray-100 rounded-lg"></div>
      </div>

      {/* Company Details Skeleton */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-100 rounded"></div>
          ))}
          <div className="sm:col-span-2 h-16 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Documents Skeleton */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl shadow-sm"></div>
          ))}
        </div>
      </div>
    </main>
  )

  if (error) return <p className="text-red-600">Error: {error}</p>

  // gradients for 4 cards
  const cardGradients = [
    "from-sky-500 to-cyan-400",
    "from-emerald-500 to-green-400",
    "from-amber-500 to-yellow-400",
    "from-rose-500 to-pink-400",
  ]

  const employer = stats?.employer ?? null
  const company = stats?.company ?? null
  const documents = employer?.documents ?? []

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-600 text-white">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 10%, rgba(255,255,255,.25) 0, rgba(255,255,255,0) 40%), radial-gradient(ellipse at 80% 50%, rgba(255,255,255,.2) 0, rgba(255,255,255,0) 50%)",
          }}
        />
        <div className="relative z-10 p-6 md:p-8 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {company?.logoUrl ? (
                <Image
                  src={company.logoUrl.startsWith("http") ? company.logoUrl : `/${company.logoUrl}`}
                  width={64}
                  height={64}
                  alt="Company logo"
                  className="h-16 w-auto rounded-xl border border-white/40 bg-white p-1"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl border border-white/40 bg-white/10 flex items-center justify-center">
                  <Building2 className="text-white/90" />
                </div>
              )}
              <div>
                <h1 className="text-balance text-2xl font-semibold leading-tight">{company?.name ?? "Your Company"}</h1>
                <p className="text-white/80 text-sm">Employer: {employer?.user?.fullName ?? employer?.name ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/jobaadhar/employer/dashboard/profile"
                className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur transition hover:bg-white/20"
              >
                Manage Profile
              </Link>
              <Link
                href="/jobaadhar/employer/dashboard/job-views"
                className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sky-700 transition hover:bg-blue-50"
              >
                Post a Job
              </Link>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {/* Contact Number */}
            <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20">
              <Phone />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Contact Number</span>
                <span className="text-sm">{employer?.user?.phone ?? "—"}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20">
              <Mail />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Email ID</span>
                <span className="text-sm">{employer?.user?.email ?? "—"}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20">
              <GrStatusGood size={25} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    employer?.status === "approved"
                      ? "bg-green-400 text-white"
                      : employer?.status === "pending"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {employer?.status ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCard
          title="Total Jobs Posted"
          icon={<Briefcase className="size-4 text-white" />}
          value={stats.totalJobs ?? 0}
          deltaLabel={stats.jobsDeltaLabel ?? ""}
          gradient={cardGradients[0]}
        />
        <DashboardCard
          title="Total Applications"
          icon={<FileText className="size-4 text-white" />}
          value={stats.totalApplications ?? 0}
          deltaLabel={stats.applicationsDeltaLabel ?? ""}
          gradient={cardGradients[1]}
        />
        <DashboardCard
          title="Shortlisted Candidates"
          icon={<List className="size-4 text-white" />}
          value={stats.shortlisted ?? 0}
          deltaLabel={stats.shortlistedDeltaLabel ?? ""}
          gradient={cardGradients[2]}
        />
        <DashboardCard
          title="Profile Completeness"
          icon={<User className="size-4 text-white" />}
          value={stats.profileCompleteness ?? 0}
          isPercent
          deltaLabel="Complete your profile for better visibility"
          gradient={cardGradients[3]}
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sky-600">Applications (last 6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-56 w-full animate-pulse rounded-xl bg-gray-100" />}>
            <AppsTrendChart data={stats.trend ?? []} />
          </Suspense>
        </CardContent>
      </Card>

      {company?.name && (
        <div className="">
          <Card className="md:col-span-2 transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2">
            <CardHeader>
              <CardTitle className="text-sky-600">Company Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground">Industry</div>
                <div>{company?.category?.name ?? "—"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Founded</div>
                <div>{company?.founded ?? "—"}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm text-muted-foreground">About</div>
                <div className="text-pretty">{company?.about ?? "—"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">City</div>
                <div>{company?.city ?? "—"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">State</div>
                <div>{company?.state ?? "—"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-2">
        <CardHeader>
          <CardTitle className="text-sky-600">Employer Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {documents.map((doc) => {
                // Map different background & icon based on doc type
                let bgColor = "bg-gray-100"
                let icon = <FileText className="text-gray-600" />
                switch (doc.type?.toLowerCase()) {
                  case "gst":
                    bgColor = "bg-yellow-100"
                    icon = <FileText className="text-yellow-600" />
                    break
                  case "id proof":
                    bgColor = "bg-purple-100"
                    icon = <User className="text-purple-600" />
                    break
                  case "address proof":
                    bgColor = "bg-green-100"
                    icon = <MapPin className="text-green-600" />
                    break
                  case "pan":
                    bgColor = "bg-red-100"
                    icon = <CreditCard className="text-red-600" />
                    break
                }

                const uploadedDate = new Date(doc.createdAt).toLocaleDateString("en-GB")

                return (
                  <li
                    key={doc.id}
                    className={`flex flex-col gap-3 rounded-xl p-4 ${bgColor} shadow-sm hover:shadow-md transition`}
                  >
                    <div className="flex items-center gap-3">
                      {icon}
                      <div className="font-medium">{doc.type ?? "Document"}</div>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-sky-600 hover:underline"
                    >
                      View File
                    </a>
                    <p className="text-xs text-gray-600">Uploaded on {uploadedDate}</p>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
              <FileText className="h-10 w-10 text-sky-600" />
              <div className="space-y-1">
                <h3 className="text-lg font-medium">No documents uploaded yet</h3>
                <p className="text-sm text-muted-foreground">Add PAN, GST, or ID documents to speed up verification.</p>
              </div>
              <Link
                href="/jobaadhar/employer/dashboard/profile"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 font-medium text-white transition hover:opacity-90"
              >
                <PlusCircle className="h-4 w-4" />
                Add a Document
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function DashboardCard({ title, value, deltaLabel, icon, isPercent = false, gradient }) {
  return (
    <Card
      className={cn(
        `bg-gradient-to-r ${gradient} text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`,
        "animate-in fade-in slide-in-from-bottom-2 rounded-xl ring-1 ring-white/15",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-wide">{title}</CardTitle>
        <div className="shrink-0 rounded-lg bg-white/15 p-2 ring-1 ring-white/20">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold drop-shadow-sm">
          <AnimatedStat to={value} suffix={isPercent ? "%" : undefined} />
        </div>
        {!!deltaLabel && <p className="text-xs opacity-90">{deltaLabel}</p>}
      </CardContent>
    </Card>
  )
}
