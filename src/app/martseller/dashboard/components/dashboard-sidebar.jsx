"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, Users, X ,Lock } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", href: "/martseller/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/martseller/dashboard/profile", icon: Users },
  { name: "Products", href: "/martseller/dashboard/products", icon: Package },
  { name: "Orders", href: "/martseller/dashboard/orders", icon: ShoppingCart },
  { name: "Change Password", href: "/martseller/dashboard/changepassword", icon: Lock  },
]

export function DashboardSidebar({ open, onClose }) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 shadow-sm"
      >
        <SidebarContent pathname={pathname} onClose={onClose} />
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-xl lg:hidden"
      >
        <SidebarContent pathname={pathname} onClose={onClose} showClose />
      </motion.aside>
    </>
  )
}

function SidebarContent({ pathname, onClose, showClose = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?")
    if (!confirmed) return

    setLoading(true)
    try {
      const response = await fetch("/api/kickback", { method: "POST" })
      if (response.ok) {
        router.push("/martseller/login") // redirect after logout
      } else {
        const errData = await response.json()
        console.error("Logout failed:", errData)
        alert("Logout failed. Please try again.")
      }
    } catch (err) {
      console.error("Logout failed:", err)
      alert("Logout failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex lg:hidden items-center justify-between p-6 border-b border-gray-200">
        {showClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={item.href} onClick={onClose}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 rounded-xl transition-all duration-300 h-11",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Button>
              </Link>
            </motion.div>
          )
        })}

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 mt-auto">
          <div className=" rounded-xl mt-2">
            <Button
              onClick={handleLogout}
              size="sm"
              className="w-full h-10 bg-red-500 hover:bg-red-600 text-white  rounded-xl"
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
