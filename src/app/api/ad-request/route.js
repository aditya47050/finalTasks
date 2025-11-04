import { NextResponse } from "next/server"
// Replace this with your real DB client import
import { db } from "@/lib/db"

function toLowerSafe(v) {
  return (v ?? "").toLowerCase()
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get("page") || "1"))
  const pageSize = Math.min(50, Math.max(5, Number(searchParams.get("pageSize") || "10")))

  const q = toLowerSafe(searchParams.get("q")) // search email or city
  const role = searchParams.get("role") || ""
  const status = searchParams.get("status") || ""
  const city = toLowerSafe(searchParams.get("city"))
  const start = searchParams.get("start") // ISO date
  const end = searchParams.get("end") // ISO date

  // Fetch all AdRequests from DB
  // Adjust your ORM / DB query accordingly
  let all = await db.adRequest.findMany() // or your DB fetch method
  console.log(all)

  // Filter in memory (or you can translate filters into DB query for better performance)
  const filtered = all.filter((r) => {
  if (q) {
    const hay = `${toLowerSafe(r.userEmail)} ${toLowerSafe(r.cityTargets)}`.trim()
    if (!hay.includes(q)) return false
  }
  if (role && role !== "all" && r.role !== role) return false
  if (status && status !== "all" && r.status !== status) return false
  if (city && !toLowerSafe(r.cityTargets).includes(city)) return false

  if (start && new Date(r.startDate) < new Date(start)) return false
  if (end && new Date(r.endDate) > new Date(end)) return false

  return true
})


  const total = filtered.length
  const startIdx = (page - 1) * pageSize
  const data = filtered.slice(startIdx, startIdx + pageSize)

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
  })
}
