"use client";

import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Calendar } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraphAppointmentsGraph = ({ appointments }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Filter appointments based on selected date range
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.createdAt);
      if (startDate && aptDate < startDate) return false;
      if (endDate && aptDate > endDate) return false;
      return true;
    });
  }, [appointments, startDate, endDate]);

  // Aggregate appointments per doctor by month
  const chartData = useMemo(() => {
    const counts = {};

    filteredAppointments.forEach((apt) => {
      if (!apt.doctor) return;
      const doctorName = `${apt.doctor.firstName || "Doctor"} ${
        apt.doctor.lastName || ""
      }`.trim();

      const month = new Date(apt.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const key = `${doctorName} - ${month}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Appointments",
          data: Object.values(counts),
          backgroundColor: "rgba(34, 197, 94, 0.7)",
        },
      ],
    };
  }, [filteredAppointments]);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (Number.isInteger(value)) return value;
            return null;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
      <h3 className="text-lg font-bold mb-4">Appointments by Doctor (Month-wise)</h3>

      {/* Date range filter with calendar pickers */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            maxDate={endDate || null}
            isClearable
            placeholderText="Select start date"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={startDate || null}
            isClearable
            placeholderText="Select end date"
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-xs"
          />
        </div>
      </div>

      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GraphAppointmentsGraph;
