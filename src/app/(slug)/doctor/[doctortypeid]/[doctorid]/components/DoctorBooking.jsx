"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, FileText, Loader2, Star } from "lucide-react"

export default function DoctorBooking({ doctorId, patient, onClose,doctordata,selectedSpecialityTitles }) {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)  
  const generateCalendarDates = () => {
    const today = new Date()
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const dates = []
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      dates.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dayName = dayNames[date.getDay()]
      dates.push({
        date: i,
        dayName: dayName,
        fullDate: date,
        isToday: i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(),
        isPast: date < today,
      })
    }
    return dates
  }
  const calendarDates = generateCalendarDates()
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time")
      return
    }

    if (!patient || !patient.id) {
      toast.error("Patient information is incomplete")
      return
    }

    try {
      setLoading(true)

      // Format selected date and time
      const formattedDate = selectedDate.toISOString().split('T')[0]
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })

      const appointmentData = {
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        mobileNumber: patient.mobile || '',
        email: patient.email || '',
        city: patient.city || '',
        pinCode: patient.pincode || '',
        gender: patient.gender || '',
        dateOfBirth: patient.dateOfBirth || null,
        patientId: patient.id,
        doctorId,
        preferredDate: formattedDate,
        preferredTime: formattedTime,
        notes: notes || '',
        status: "PENDING"
      }

      const res = await fetch(`/api/doctor/${doctorId}/doctorappointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Booking failed")
      if (data.success) {
        toast.success("Appointment booked successfully!")
        onClose()
      } else {
        throw new Error(data.message || "Booking failed")
      }
    } catch (err) {
      console.error("Booking error:", err)
      toast.error(err.message || "Server error during booking")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <div className="min-h-[30vh] bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between text-white max-w-md mx-auto">
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all duration-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white min-h-[30vh]">
        {/* Doctor Info */}
        <div className="px-6 py-6 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={doctordata?.doctorinfo?.passportphoto || "/placeholder.svg?height=80&width=80"}
                alt="Doctor"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
              />
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">4.5</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Dr. {doctordata?.firstName || "Name Here"}</h2>
              <p className="text-sm text-gray-600">{selectedSpecialityTitles?.join(", ")}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Date Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>

            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDates.map((dateObj, index) => (
                <div key={index} className="aspect-square">
                  {dateObj ? (
                    <button
                      onClick={() => !dateObj.isPast && setSelectedDate(dateObj.fullDate)}
                      disabled={dateObj.isPast}
                      className={`
                        w-full h-full rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105
                        ${
                          dateObj.isPast
                            ? "text-gray-300 cursor-not-allowed"
                            : selectedDate?.getDate() === dateObj.date &&
                                selectedDate?.getMonth() === currentMonth &&
                                selectedDate?.getFullYear() === currentYear
                              ? "bg-blue-500 text-white shadow-lg scale-105"
                              : dateObj.isToday
                                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      {dateObj.date}
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Time</h3>
            </div>

            <div className="w-full">
              <DatePicker
                selected={selectedTime}
                onChange={(time) => setSelectedTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                placeholderText="Select time"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base font-medium transition-all duration-200 bg-white hover:border-blue-300"
                wrapperClassName="w-full"
                minTime={new Date().setHours(8, 0)}
                maxTime={new Date().setHours(18, 0)}
                timeFormat="HH:mm"
                popperClassName="custom-datepicker-popper"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <Textarea
              placeholder="Add any notes or symptoms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              rows={3}
            />
          </div>

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            disabled={loading || !selectedDate || !selectedTime}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-xl animate-spin"></div>
                Booking...
              </div>
            ) : (
              "Book an Appointment"
            )}
          </Button>
        </div>
      </div>

      {/* Custom styles for DatePicker */}
      <style jsx global>{`
        .react-datepicker__time-container {
          border-left: 1px solid #e5e7eb;
        }
        .react-datepicker__time-list-item {
          padding: 8px 12px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .react-datepicker__time-list-item:hover {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        .react-datepicker__time-list-item--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        .react-datepicker {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .react-datepicker__header {
          background-color: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 12px 12px 0 0;
        }
      `}</style>
    </div>
    </>
  )
}