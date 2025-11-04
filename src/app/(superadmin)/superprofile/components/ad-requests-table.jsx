"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx"
import { toast } from 'react-toastify';
import HeadingClientMain from "@/app/components/heading"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const fetcher = (url) => fetch(url).then((r) => r.json())

function buildQuery(base, params) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) sp.set(k, String(v))
  })
  return `${base}?${sp.toString()}`
}

// --- Filters type & component integrated ---
function FiltersBar({ value, onChange, onReset }) {
  const [local, setLocal] = useState(value)

  useMemo(() => setLocal(value), [value])

  const update = (patch) => {
    const next = { ...local, ...patch }
    setLocal(next)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-end md:justify-between bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4 flex-1">
        <Input
          value={local.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Search email or cities"
          className="focus:ring-2 focus:ring-blue-500"
        />
        <Input
          value={local.city}
          onChange={(e) => update({ city: e.target.value })}
          placeholder="Filter by city"
          className="focus:ring-2 focus:ring-blue-500"
        />
        <Select value={local.role} onValueChange={(v) => update({ role: v })}>
          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Pharmacy">Pharmacy</SelectItem>
            <SelectItem value="Doctor">Doctor</SelectItem>
            <SelectItem value="Hospital">Hospital</SelectItem>
            <SelectItem value="Ambulance">Ambulance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={local.status} onValueChange={(v) => update({ status: v })}>
          <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={local.start}
          onChange={(e) => update({ start: e.target.value })}
          className="focus:ring-2 focus:ring-blue-500"
          aria-label="Start date"
        />
        <Input
          type="date"
          value={local.end}
          onChange={(e) => update({ end: e.target.value })}
          className="focus:ring-2 focus:ring-blue-500"
          aria-label="End date"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onReset}
          className="border-blue-500 text-blue-500 hover:bg-blue-50 bg-transparent"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

// --- Main AdRequestsTable component ---
export default function AdRequestsTable() {

  // Role logic self-contained
  const roleFromUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("role")
      : null
  const role = roleFromUrl || "Admin"
  const canModerate = (role) => ["Admin", "Doctor", "Hospital"].includes(role)
  const [page, setPage] = useState(1)
  const [showfilter, setShowfilter] = useState(false)
  const [pageSize] = useState(10)
  const [filters, setFilters] = useState({
    q: "",
    role: "all",
    status: "all",
    city: "",
    start: "",
    end: "",
  })
  const initialFilters = { ...filters }

  const url = useMemo(
    () =>
      buildQuery("/api/ad-request", {
        page,
        pageSize,
        q: filters.q,
        role: filters.role,
        status: filters.status,
        city: filters.city,
        start: filters.start,
        end: filters.end,
      }),
    [page, pageSize, filters],
  )

  const { data, isLoading, mutate } = useSWR(url, fetcher, {
    keepPreviousData: true,
  })

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const onReset = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const exportExcel = () => {
    const rows = data?.data ?? []
    if (!rows.length) return
    const safe = rows.map((r) => ({
      ID: r.id,
      Email: r.userEmail,
      Role: r.role,
      Cities: r.cityTargets,
      RadiusKm: r.radiusKm ?? "",
      StartDate: r.startDate,
      EndDate: r.endDate,
      Status: r.status,
      AdminRemarks: r.adminRemarks ?? "",
      CreatedAt: r.createdAt,
      UpdatedAt: r.updatedAt,
    }))
    const ws = XLSXUtils.json_to_sheet(safe)
    const wb = XLSXUtils.book_new()
    XLSXUtils.book_append_sheet(wb, ws, "AdRequests")
    XLSXWriteFile(wb, `ad-requests-page-${page}.xlsx`)

    
  }
    const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [adminRemarks, setAdminRemarks] = useState("")

  const openStatusModal = (request) => {
  setSelectedRequest(request)
  setNewStatus(request.status)
  setAdminRemarks(request.adminRemarks || "")
  setShowModal(true)
  }

  const submitStatusUpdate = async () => {
  if (!selectedRequest) return

  const res = await fetch(`/api/ad-request/${selectedRequest.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: newStatus.toLowerCase(), // "approve" or "reject"
      adminRemarks,
    }),
  })

  if (res.ok) {
    toast.success(`Status updated to ${newStatus}`)
    mutate()
    setShowModal(false)
  } else {
    toast.error("Failed to update status")
  }
  }
  
  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main="Ad Requests" sub="Full Details" />
        <div className="flex items-center justify-end mb-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={exportExcel}
              className="bg-green-500 text-white hover:bg-green-500 transition-transform rounded-xl duration-200 hover:scale-[1.02]"
            >
              Export Excel
            </Button>
            <Button
            onClick={() => setShowfilter(!showfilter)}
              className="bg-blue-500 text-white hover:bg-blue-500 transition-transform rounded-xl duration-200 hover:scale-[1.02]"
            >
              {showfilter ? "Hide Filter" : "Show Filter"}
            </Button>
          </div>
        </div>

        {showfilter && <FiltersBar value={filters} onChange={setFilters} onReset={onReset} />}

        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <div >
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100">
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Email</TableHead>
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Role</TableHead>
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Cities</TableHead>
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Radius</TableHead>
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Start</TableHead>
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">End</TableHead>
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Status</TableHead>
                  <TableHead className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="whitespace-nowrap max-w-max py-6 text-center text-sm text-blue-600">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && (data?.data ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="whitespace-nowrap max-w-max py-6 text-center text-sm text-blue-600">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
                {(data?.data ?? []).map((r) => (
                  <TableRow key={r.id} className="transition-colors ">
                    <TableCell className="max-w-max whitespace-nowrap">{r.userEmail}</TableCell>
                    <TableCell className="max-w-max whitespace-nowrap">{r.role}</TableCell>
                    <TableCell className="max-w-max whitespace-nowrap" title={r.cityTargets}>
                      {r.cityTargets}
                    </TableCell>
                    <TableCell className="max-w-max whitespace-nowrap">{r.radiusKm ?? "-"}</TableCell>
                    <TableCell className="max-w-max whitespace-nowrap">{new Date(r.startDate).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-max whitespace-nowrap">{new Date(r.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          r.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : r.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2 whitespace-nowrap">
                      <Link
                        href={`/superprofile/ads-section/${r.id}`}
                        className="inline-flex items-center rounded-md border border-blue-500 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition"
                      >
                        View
                      </Link>
                      {canModerate(role) && (
                        <Button
                          variant="outline"
                          onClick={() => openStatusModal(r)}
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          Update Status
                        </Button>
                      )}

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t bg-white px-3 py-2">
            <SimplePagination page={page} totalPages={totalPages} onPageChange={setPage} />

          </div>
        </div>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-500 text-center">Update Ad Request Status</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Select Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Admin Remarks</label>
              <Textarea
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Enter remarks..."
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={submitStatusUpdate} className="w-full rounded-xl bg-blue-500 text-white hover:bg-blue-500">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
function SimplePagination({ page, totalPages, onPageChange }) {
  const pagesToShow = 5
  const start = Math.max(1, page - Math.floor(pagesToShow / 2))
  const end = Math.min(totalPages, start + pagesToShow - 1)
  const pageNumbers = []
  for (let i = start; i <= end; i++) pageNumbers.push(i)

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded border bg-white hover:bg-blue-50 disabled:opacity-50"
      >
        Prev
      </button>
      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded border ${
            p === page ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 rounded border bg-white hover:bg-blue-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
