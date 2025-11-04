"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AnalyticsCards() {
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    recentOrdersGrowth: 0,
  })
  const [orderTrends, setOrderTrends] = useState([])
  const [loading, setLoading] = useState(true)

  const [range, setRange] = useState("7d")

useEffect(() => {
  async function fetchAnalytics() {
    try {
      const res = await fetch(`/api/aarogyamart/martseller/analytics?range=${range}`)
      const data = await res.json()
      if (data.success) {
        setAnalytics(data.data)
        setOrderTrends(data.data.orderTrends)
      }
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }
  fetchAnalytics()
}, [range])


  const cards = [
    { title: "Total Products", value: analytics.totalProducts, icon: Package, gradient: "from-blue-500 to-blue-600", bgGradient: "from-blue-50 to-blue-100", delay: 0 },
    { title: "Total Orders", value: analytics.totalOrders, icon: ShoppingCart, gradient: "from-green-500 to-green-600", bgGradient: "from-green-50 to-green-100", delay: 0.1 },
    { title: "Total Revenue", value: `₹${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, gradient: "from-purple-500 to-purple-600", bgGradient: "from-purple-50 to-purple-100", delay: 0.2 },
    { title: "Pending Orders", value: analytics.pendingOrders, icon: Clock, gradient: "from-orange-500 to-orange-600", bgGradient: "from-orange-50 to-orange-100", delay: 0.3 },
    { title: "Delivered Orders", value: analytics.deliveredOrders, icon: CheckCircle, gradient: "from-teal-500 to-teal-600", bgGradient: "from-teal-50 to-teal-100", delay: 0.4 },
    { title: "Growth Rate", value: `${analytics.recentOrdersGrowth > 0 ? "+" : ""}${analytics.recentOrdersGrowth}%`, icon: TrendingUp, gradient: "from-pink-500 to-pink-600", bgGradient: "from-pink-50 to-pink-100", delay: 0.5 },
  ]

  if (loading) {
    return (
      <div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {[...Array(6)].map((_, i) => <Card key={i} className="animate-pulse bg-gray-200 h-32 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: card.delay }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${card.gradient}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: card.delay + 0.2, type: "spring" }}
                  className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                >
                  {card.value}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
        <CardHeader>
          <CardTitle>
            <h2 className="text-blue-500 py-4">Analyise The Order Details</h2>
            <div className="flex gap-2 mb-4">
              <button className={`px-4 py-2 text-lg rounded-xl ${range==="7d"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setRange("7d")}>Last 7 Days</button>
              <button className={`px-4 py-2 text-lg rounded-xl ${range==="6m"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setRange("6m")}>Last 6 Months</button>
              <button className={`px-4 py-2 text-lg rounded-xl ${range==="1y"?"bg-blue-500 text-white":"bg-gray-200"}`} onClick={()=>setRange("1y")}>Yearly</button>
            </div>
</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {orderTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No order trend data
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
