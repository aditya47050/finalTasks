"use client"

import { DashboardHeader } from './components/dashboard-header';
import { DashboardSidebar } from './components/dashboard-sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header at the top */}
      <DashboardHeader />

      {/* Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children} {/* page.jsx content will render here */}
        </main>
      </div>
    </div>
  );
}
