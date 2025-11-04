"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Megaphone,
  UserIcon,
  Mail,
  TargetIcon,
  MapPin,
  Ruler,
  CalendarRange,
  CalendarDays,
  Clock,
  RefreshCw,
  StickyNote,
} from "lucide-react"
import AmbulancePreview from './ambulancepreview';
import DoctorPreViewWithTicking from './doctorpreviewwithticking';
import HospitalPreview from './HospitalPreview';
import PharmacyProfilePreview from './pharmacy-profile-preview';

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function DetailView({ ad, id, user }) {
  const roleFromUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("role") : null
  const role = roleFromUrl || "Admin"
  const canModerate = (role) => ["Admin", "Doctor", "Hospital"].includes(role)

  const { data, isLoading, mutate } = useSWR(`/api/ad-request/${id}`, fetcher)

  const act = async (action) => {
    const res = await fetch(`/api/ad-request/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      toast.success(`Request ${action}d successfully`)
      mutate()
    } else {
      toast.error("Action failed")
    }
  }

  if (isLoading)
    return (
      <Card className="border-blue-100 bg-white shadow-sm">
        <CardContent className="flex items-center gap-3 p-4 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span>Loading ad request…</span>
        </CardContent>
      </Card>
    )

  if (!data)
    return (
      <Card className="border-blue-100 bg-white shadow-sm">
        <CardContent className="flex items-center gap-2 p-4 text-gray-600">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span>Not found</span>
        </CardContent>
      </Card>
    )

  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  const diffMs = endDate - startDate
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const durationText = `${diffDays} day${diffDays !== 1 ? "s" : ""}, ${diffHours} hour${diffHours !== 1 ? "s" : ""}`

  const statusColors = {
    APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  }
  const statusClass = statusColors[data.status?.toUpperCase()] || "bg-gray-50 text-gray-700 border-gray-200"

  return (
    <div className="space-y-6 animate-fadeIn bg-blue-50 p-4 rounded-xl">
      {/* Header */}
      <div className="group flex justify-center items-center gap-2 mb-2 text-xl">
        <Megaphone className="h-6 w-6 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
        <h2 className="font-semibold text-blue-700">Ad Request Detail</h2>
      </div>

      {/* Info sections */}
      <div className="space-y-4">
        {/* User Info */}
        <Card className="border border-blue-100 bg-white shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center gap-2 border-b border-blue-100 bg-blue-50/60">
            <UserIcon className="h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:scale-105" />
            <CardTitle className="text-base font-semibold text-blue-800">User Info</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm">
            <dl className="grid grid-cols-3 gap-2">
              <dt className="col-span-1 flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>Email</span>
              </dt>
              <dd className="col-span-2 text-gray-800 break-words">{data.userEmail}</dd>

              <dt className="col-span-1 text-gray-600">Role</dt>
              <dd className="col-span-2 text-gray-800 font-medium">{data.role}</dd>
            </dl>
          </CardContent>
        </Card>

        {/* 3 Cards with distinct backgrounds */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Targeting - white */}
          <Card className="border border-blue-100 bg-white shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-blue-100 bg-blue-50/60">
              <TargetIcon className="h-5 w-5 text-blue-600 transition-transform duration-300 hover:rotate-6" />
              <CardTitle className="text-sm font-semibold text-blue-800">Targeting</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm">
              <dl className="grid grid-cols-3 gap-2">
                <dt className="col-span-1 flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>Cities</span>
                </dt>
                <dd className="col-span-2 text-gray-800 break-words">{data.cityTargets}</dd>

                <dt className="col-span-1 flex items-center gap-2 text-gray-600">
                  <Ruler className="h-4 w-4 text-blue-500" />
                  <span>Radius (km)</span>
                </dt>
                <dd className="col-span-2 text-gray-800">{data.radiusKm ?? "-"}</dd>
              </dl>
            </CardContent>
          </Card>

          {/* Duration - blue-50 */}
          <Card className="border border-blue-100 bg-blue-50 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-blue-100 bg-white/70">
              <CalendarRange className="h-5 w-5 text-blue-600 transition-transform duration-300 hover:rotate-6" />
              <CardTitle className="text-sm font-semibold text-blue-800">Duration</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm">
              <dl className="grid grid-cols-3 gap-2">
                <dt className="col-span-1 flex items-center gap-2 text-gray-700">
                  <CalendarDays className="h-4 w-4 text-blue-500" />
                  <span>Start</span>
                </dt>
                <dd className="col-span-2 text-gray-900">{startDate.toLocaleString()}</dd>

                <dt className="col-span-1 flex items-center gap-2 text-gray-700">
                  <CalendarDays className="h-4 w-4 text-blue-500" />
                  <span>End</span>
                </dt>
                <dd className="col-span-2 text-gray-900">{endDate.toLocaleString()}</dd>

                <dt className="col-span-1 flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Difference</span>
                </dt>
                <dd className="col-span-2 font-semibold text-blue-700">{durationText}</dd>
              </dl>
            </CardContent>
          </Card>

          {/* Status - blue-100 tint */}
          <Card className="border border-blue-100 bg-blue-100/60 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-blue-100 bg-white/70">
              <RefreshCw className="h-5 w-5 text-blue-600 transition-transform duration-300 hover:rotate-6" />
              <CardTitle className="text-sm font-semibold text-blue-800">Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm">
              <dl className="grid grid-cols-3 gap-2">
                <dt className="col-span-1 text-gray-700">Status</dt>
                <dd className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold ${statusClass}`}
                  >
                    <Clock className="h-3 w-3" />
                    {data.status}
                  </span>
                </dd>

                <dt className="col-span-1 flex items-center gap-2 text-gray-700">
                  <StickyNote className="h-4 w-4 text-blue-600" />
                  <span>Remarks</span>
                </dt>
                <dd className="col-span-2 text-gray-900">{data.adminRemarks ?? "-"}</dd>

                <dt className="col-span-1 flex items-center gap-2 text-gray-700">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  <span>Created</span>
                </dt>
                <dd className="col-span-2 text-gray-900">{new Date(data.createdAt).toLocaleString()}</dd>

                <dt className="col-span-1 flex items-center gap-2 text-gray-700">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  <span>Updated</span>
                </dt>
                <dd className="col-span-2 text-gray-900">{new Date(data.updatedAt).toLocaleString()}</dd>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {canModerate(role) && data.status === "PENDING" && (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => act("approve")}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Approve</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => act("reject")}
            className="gap-2 border-red-500 text-red-600 hover:bg-red-50 transition"
          >
            <XCircle className="h-4 w-4" />
            <span>Reject</span>
          </Button>
        </div>
      )}

      {/* Unified Previews */}
      {ad.role === "Doctor" && <DoctorPreViewWithTicking doctorData={user} />}
      {ad.role === "Hospital" && <HospitalPreview hospitalData={user} />}
      {ad.role === "Ambulance" && <AmbulancePreview ambulanceData={user} />}
      {ad.role === "Pharmacy" && <PharmacyProfilePreview form={user} />}
    </div>
  )
}
