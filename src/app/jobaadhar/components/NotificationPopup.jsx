"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FiX } from "react-icons/fi"
import { Bell, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

export function NotificationPopup({ isOpen, setIsOpen, seekerId }) {
  const [notifications, setNotifications] = useState([])
  const [removingIds, setRemovingIds] = useState()

  useEffect(() => {
    if (isOpen && seekerId) {
      fetch(`/api/jobaadhar/job-seeker/notification?seekerId=${seekerId}`)
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch((err) => console.error("Error fetching notifications", err))
    }
  }, [isOpen, seekerId])

  const handleRemoveNotification = async (notificationId) => {
    setRemovingIds((prev) => new Set(prev).add(notificationId))

    try {
      const response = await fetch(`/api/jobaadhar/job-seeker/notification?id=${notificationId}`, { method: "DELETE" })

      if (response.ok) {
        // Wait for animation to complete before removing from state
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
          setRemovingIds((prev) => {
            const newSet = new Set(prev)
            newSet.delete(notificationId)
            return newSet
          })
        }, 300)
      }
    } catch (error) {
      console.error("Error removing notification", error)
      setRemovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    }
  }

  const handleRemoveAll = async () => {
    if (notifications.length === 0) return

    const allIds = notifications.map((n) => n.id)
    setRemovingIds(new Set(allIds))

    try {
      const response = await fetch(`/api/jobaadhar/job-seeker/notification?seekerId=${seekerId}&all=true`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Wait for animation to complete before clearing state
        setTimeout(() => {
          setNotifications([])
          setRemovingIds(new Set())
        }, 300)
      }
    } catch (error) {
      console.error("Error removing all notifications", error)
      setRemovingIds(new Set())
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            {notifications.length > 0 && (
              <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveAll}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <FiX className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bell className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
              <p className="text-gray-500 mb-4">All caught up! 🎉</p>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-3"
                >
                  <div className="p-3 border rounded-lg flex items-start gap-3 hover:bg-gray-50 group relative">
                    <Link href={`/jobaadhar/jobs/${n.jobId}`} className="flex flex-col items-start gap-3 flex-1">
                      <Image
                        src={n.company?.logoUrl || "/placeholder.svg?height=40&width=40"}
                        alt={n.company?.name || "Company"}
                        width={40}
                        height={40}
                        className="w-auto h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground mb-1">{n.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {n.company?.name} • {n.job?.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveNotification(n.id)
                      }}
                    >
                      <FiX className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  )
}
