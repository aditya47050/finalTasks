import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/notifications?seekerId=123
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const seekerId = searchParams.get("seekerId")

    if (!seekerId) {
      return NextResponse.json({ error: "seekerId is required" }, { status: 400 })
    }

    const notifications = await db.notification.findMany({
      where: { receiverId: seekerId },
      include: { company: true, job: true, employer: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const notificationId = searchParams.get("id")
    const seekerId = searchParams.get("seekerId")
    const removeAll = searchParams.get("all")

    // Remove all notifications for a seeker
    if (removeAll === "true" && seekerId) {
      await db.notification.deleteMany({
        where: { receiverId: seekerId },
      })
      return NextResponse.json({ success: true, message: "All notifications removed" })
    }

    // Remove a specific notification
    if (notificationId) {
      await db.notification.delete({
        where: { id: notificationId },
      })
      return NextResponse.json({ success: true, message: "Notification removed" })
    }

    return NextResponse.json({ error: "Either id or seekerId with all=true is required" }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}
