"use client"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export function AppsTrendChart({ data }) {
  return (
    <div className="h-64 w-full rounded-xl p-2 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm animate-in fade-in zoom-in-95 duration-500">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#bfe8ff" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: "#ffffff" }}
            tick={{ fill: "#ffffff" }}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: "#ffffff" }}
            tick={{ fill: "#ffffff" }}
            tickMargin={8}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ stroke: "#ffffff", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "#ffffff",
              color: "#1F2937",
              border: "1px solid #A5B4FC",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#ffffff"
            strokeWidth={2}
            dot={{ r: 2, fill: "#ffffff" }}
            activeDot={{ r: 3, fill: "#ffffff" }}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
