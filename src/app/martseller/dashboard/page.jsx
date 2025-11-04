"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { AnalyticsCards } from './components/analytics-cards';

export default function DashboardPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <AnalyticsCards />
      <h2 className="text-2xl font-bold mb-4 text-gray-800 mt-8">Quick Actions</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: "Manage Products",
            desc: "Add new products or edit existing ones.",
            href: "/martseller/dashboard/products",
            icon: Package,
            gradient: "from-blue-500 to-blue-600",
          },
          {
            title: "View Orders",
            desc: "Track and manage customer orders.",
            href: "/martseller/dashboard/orders",
            icon: ShoppingCart,
            gradient: "from-green-500 to-green-600",
          },
        ].map((item, i) => (
          <Card key={i} className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient}`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
              <Link href={item.href}>
                <Button className={`bg-gradient-to-r ${item.gradient} text-white rounded-xl w-full`}>
                  Go to {item.title.split(" ")[1]}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
