"use client"

import { useCallback, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AdRequestsCards } from "./ad-requests-cards"
import useSWR from "swr"
import { Plus, Download } from "lucide-react"
import { motion } from "framer-motion"

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function AdRequestsManager({user}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState({ page: 1, pageSize: 10, search: "", status: "ALL" })

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    p.set("page", String(query.page))
    p.set("pageSize", String(query.pageSize))
    if (query.search) p.set("search", query.search)
    if (query.status && query.status !== "ALL") p.set("status", query.status)
    return p.toString()
  }, [query])

    const { data = {}, isLoading, mutate } = useSWR(
    `/api/doctor/ad-requests?${new URLSearchParams({
      page: String(query.page),
      pageSize: String(query.pageSize),
      search: query.search || "",
      ...(query.status && query.status !== "ALL" ? { status: query.status } : {}),
    }).toString()}`,
    fetcher
  )


  const resetAndClose = useCallback(() => {
    setEditing(null)
    setOpen(false)
  }, [])

  const onCreate = useCallback(() => {
    setEditing(null)
    setOpen(true)
  }, [])

  const onEdit = useCallback((row) => {
    setEditing(row)
    setOpen(true)
  }, [])

  const onDelete = useCallback(
    async (row) => {
      if (!confirm("Delete this ad request?")) return
      await fetch(`/api/doctor/ad-requests/${row.id}`, { method: "DELETE" })
      mutate()
    },
    [mutate]
  )

  // ✅ Export CSV utility
  const exportToCsv = (filename, rows) => {
    if (!rows || !rows.length) return
    const headers = Object.keys(rows[0])
    const csvContent =
      [headers.join(","), ...rows.map((r) => headers.map((h) => `"${r[h]}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", filename)
    link.click()
  }

  const onExport = useCallback(async () => {
    const p = new URLSearchParams()
    p.set("page", "1")
    p.set("pageSize", "100000")
    if (query.search) p.set("search", query.search)
    if (query.status && query.status !== "ALL") p.set("status", query.status)
    const res = await fetch(`/api/doctor/ad-requests?${p.toString()}`)
    const json = await res.json()
    const rows = json.data
    exportToCsv(
      `ad-requests.csv`,
      rows.map((r) => ({
        id: r.id,
        userEmail: r.userEmail || "",
        role: r.role || "",
        cityTargets: r.cityTargets,
        radiusKm: r.radiusKm ?? "",
        startDate: new Date(r.startDate).toISOString(),
        endDate: new Date(r.endDate).toISOString(),
        status: r.status,
        adminRemarks: r.adminRemarks ?? "",
        createdAt: new Date(r.createdAt).toISOString(),
        updatedAt: new Date(r.updatedAt).toISOString(),
      }))
    )
  }, [query.search, query.status])

  const onSubmitSuccess = useCallback(() => {
    mutate()
    resetAndClose()
  }, [mutate, resetAndClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white shadow-lg rounded-xl animate-in fade-in-50">
        <CardHeader>
          <div className="flex items-center justify-center text-center gap-4">
            <div>
              <CardTitle className="text-blue-500 text-2xl">Ad Requests</CardTitle>
              <CardDescription className="text-sm">Full Details</CardDescription>
            </div>
          </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={onExport}
                className="gap-2 bg-green-500 hover:bg-green-500 rounded-xl text-white"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={onCreate} className="gap-2 bg-blue-500 hover:bg-blue-500 text-white rounded-xl">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className={cn("grid gap-3", "sm:grid-cols-2", "lg:grid-cols-4")}>
            <div className="space-y-1">
              <Label htmlFor="search">Search</Label>
              <Input
                  placeholder="City, Email, Role"
                  value={query.search}
                  onChange={(e) => setQuery((q) => ({ ...q, page: 1, search: e.target.value }))}
                />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={query.status}
                onValueChange={(v) => setQuery((q) => ({ ...q, page: 1, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Page size</Label>
              <Select
                value={String(query.pageSize)}
                onValueChange={(v) => setQuery((q) => ({ ...q, page: 1, pageSize: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AdRequestsCards
            isLoading={isLoading}
            data={data?.data ?? []}
            page={query.page}
            pageSize={query.pageSize}
            totalPages={data?.totalPages ?? 1}
            onPageChange={(p) => setQuery((q) => ({ ...q, page: p }))}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </CardContent>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg bg-white data-[state=open]:animate-in data-[state=open]:fade-in-50">
            <DialogHeader>
              <DialogTitle className="text-blue-500 text-center mt-4">
                {editing ? "Edit Ad Request" : "Create Ad Request"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {editing
                  ? "Update details and save your changes."
                  : "Fill in the form to create a new ad request."}
              </DialogDescription>
            </DialogHeader>

            <AdRequestForm initialData={editing ?? undefined} onSuccess={onSubmitSuccess} user={user}/>
          </DialogContent>
        </Dialog>
      </Card>
    </motion.div>
  )
}


export function AdRequestForm({ initialData, onSuccess,user }) {
  const [cityTargets, setCityTargets] = useState(initialData?.cityTargets ?? "")
  const [radiusKm, setRadiusKm] = useState(initialData?.radiusKm != null ? String(initialData.radiusKm) : "")
  const [startDate, setStartDate] = useState(
    initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : ""
  )
  const [endDate, setEndDate] = useState(
    initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : ""
  )
  const [status, setStatus] = useState(initialData?.status ?? "PENDING")
  const [adminRemarks, setAdminRemarks] = useState(initialData?.adminRemarks ?? "")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!cityTargets.trim()) return alert("Target Cities is required")
    if (!startDate || !endDate) return alert("Start and End Date are required")
    if (new Date(endDate) < new Date(startDate)) return alert("End date must be after start date")

    setSubmitting(true)
    try {
      const payload = {
        userId: user.id,
        userEmail: user.email,
        role: user.role,
        cityTargets: cityTargets.trim(),
        radiusKm: radiusKm ? Number(radiusKm) : null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
        adminRemarks: adminRemarks || null,
      }

      const res = await fetch(
        initialData?.id ? `/api/doctor/ad-requests/${initialData.id}` : `/api/doctor/ad-requests`,
        {
          method: initialData?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Request failed")
      }
      onSuccess()
    } catch (err) {
      alert(err.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }, [cityTargets, radiusKm, startDate, endDate, status, adminRemarks, initialData, onSuccess])

  return (
    <motion.div
      className="grid gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="form"
      aria-label="Ad Request Form"
    >
        
        <div className="">
          <Label>Target Cities</Label>
          <Input
            placeholder="Delhi,Mumbai,Pune"
            value={cityTargets}
            onChange={(e) => setCityTargets(e.target.value)}
            className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>
        <div className="">
          <Label>Radius (km)</Label>
          <Input
            type="number"
            min={0}
            placeholder="50"
            value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
            className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
          />
        </div>
        <div className="grid gap-4 grid-cols-2">
          <div className="">
            <Label>Start Date & Time</Label>
            <Input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className=" border-blue-200 focus:border-blue-500 focus:ring-blue-200"
            />
          </div>
          <div className="">
            <Label>End Date & Time</Label>
            <Input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
            />
          </div>
      </div>
      

      <div className="w-full mt-2">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
        >
          {initialData?.id ? "Save Changes" : "Create"}
        </Button>
      </div>
    </motion.div>
  )
}
