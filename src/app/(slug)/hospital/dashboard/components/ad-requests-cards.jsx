"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

function formatDate(s) {
  try {
    return new Date(s).toLocaleString()
  } catch {
    return s
  }
}

function StatusBadge({ status }) {
  const className =
    status === "APPROVED" ? "bg-blue-500 text-white" :
    status === "REJECTED" ? "bg-red-500 text-white" :
    "bg-yellow-400 text-black"
  return <Badge className={className}>{status}</Badge>
}

export function AdRequestsCards({ isLoading, data, page, totalPages, onPageChange, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse bg-white shadow rounded-xl">
              <div className="h-1.5 bg-blue-500" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-lg border p-6 text-center bg-blue-50 text-blue-700">
          <h3 className="text-lg font-semibold">No ad requests</h3>
          <p className="mt-1 text-blue-700/80">Try adjusting your filters or create a new request.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map(r => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(59,130,246,0.2)" }}
            >
              <Card className="overflow-hidden border border-blue-200 bg-white rounded-xl">
                <div className="h-1.5 bg-blue-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-blue-700 text-base">{r.cityTargets}</CardTitle>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-xs text-blue-900/50">
                    {r.userEmail || "anonymous"} • {r.role || "N/A"}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Info label="Radius (km)" value={r.radiusKm ?? "-"} />
                    <Info label="Start" value={formatDate(r.startDate)} />
                    <Info label="End" value={formatDate(r.endDate)} />
                    <Info label="Updated" value={formatDate(r.updatedAt)} />
                  </div>
                  {r.adminRemarks && (
                    <div className="rounded-md bg-blue-100 text-blue-700 p-2 text-xs">
                      Admin: {r.adminRemarks}
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(r)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(r)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 mt-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {Math.max(1, totalPages)}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}>
            Previous
          </Button>
          <Button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</Button>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="space-y-0.5">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}
