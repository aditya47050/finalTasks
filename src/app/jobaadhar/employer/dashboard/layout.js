"use client"

import { DashboardHeader } from './components/header'
import { DashboardSidebarContent } from './components/sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader />
      </div>

      {/* Sidebar + Main layout */}
      <div className="flex pt-14"> {/* push content below header height (≈56px) */}
        {/* Sidebar */}
        <aside className="w-64 h-[calc(100vh-56px)] mt-0 border-r bg-white overflow-y-auto">
          <DashboardSidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 h-[calc(100vh-56px)] overflow-y-auto bg-muted/40 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
