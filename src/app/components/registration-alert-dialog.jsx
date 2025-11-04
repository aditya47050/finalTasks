"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, X, CheckCircle2, Clock } from 'lucide-react'



function useCountdown(target) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  const diff = target.getTime() - now.getTime()
  const clamped = Math.max(diff, 0)
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24))
  const hours = Math.floor((clamped % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((clamped % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((clamped % (1000 * 60)) / 1000)

  return {
    totalMs: diff,
    isOpen: diff <= 0,
    parts: { days, hours, minutes, seconds },
  }
}

function formatGoogleDateUTC(d) {
  const iso = d.toISOString()
  const clean = iso.replace(/[-:]/g, "").replace(".000", "")
  return clean
}

export default function RegistrationAlertDialog({
  targetDateISO = "2025-08-15T00:00:00",
  autoOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (autoOpen) setIsOpen(true)
  }, [autoOpen])

  // Auto-close dialog after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 9000) // 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const targetDate = useMemo(() => new Date(targetDateISO), [targetDateISO])
  const { isOpen: isRegistrationOpen, parts } = useCountdown(targetDate)

  const headerGradient = isRegistrationOpen ? "from-emerald-400 to-emerald-700" : "from-[#97faff] to-[#004aad]"
  const titleText = isRegistrationOpen
    ? "Registration Now Open – Aarogya Aadhar Services"
    : "Registration Opening Soon – Aarogya Aadhar Services"
  const descriptionText = isRegistrationOpen
    ? "You can now register to begin your Aarogya Aadhar healthcare onboarding process."
    : "Mark your calendar — registration for Aarogya Aadhar Services begins on the date below."

  const gStart = useMemo(() => formatGoogleDateUTC(targetDate), [targetDate])
  const gEnd = useMemo(
    () => formatGoogleDateUTC(new Date(targetDate.getTime() + 60 * 60 * 1000)),
    [targetDate]
  )

  const calendarHref = useMemo(() => {
    const text = encodeURIComponent("Aarogya Aadhar Registration Opens")
    const details = encodeURIComponent(
      "Registration for Aarogya Aadhar Services opens. Create your account to begin your healthcare journey. Benefits available after account approval."
    )
    const location = encodeURIComponent("Online")
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${gStart}/${gEnd}&details=${details}&location=${location}`
  }, [gStart, gEnd])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Mobile-first responsive design with proper tablet and desktop breakpoints */}
        <DialogContent
          aria-describedby="registration-description"
          className="p-0 border-0 bg-transparent shadow-none w-[95vw] max-w-[480px] sm:max-w-[580px] md:max-w-[680px] lg:max-w-4xl xl:max-w-6xl h-auto max-h-[90vh] overflow-y-auto"
        >
          <div className="relative mx-auto overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-black/10">
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 grid size-8 sm:size-10 place-items-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">{"Close"}</span>
              </button>
            </DialogClose>

            {/* Header */}
            <div className={`relative isolate overflow-hidden bg-gradient-to-br ${headerGradient} px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 text-white text-center`}>
              {/* Decorative elements */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "url(/placeholder.svg?height=420&width=840&query=abstract%20geometric%20healthcare%20pattern)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 30%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "sheen 6s ease-in-out infinite",
                }}
              />
              <span className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 size-20 sm:size-28 md:size-36 rounded-full bg-white/15 blur-2xl animate-float-slow" aria-hidden="true" />
              <span className="absolute -bottom-6 -right-8 sm:-bottom-10 sm:-right-12 size-24 sm:size-32 md:size-40 rounded-full bg-cyan-200/25 blur-3xl animate-float" aria-hidden="true" />

              <div className="relative z-10">
                {isRegistrationOpen ? (
                  <CheckCircle2 className="mx-auto mb-2 sm:mb-3 md:mb-4 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 drop-shadow" />
                ) : (
                  <CalendarDays className="mx-auto mb-2 sm:mb-3 md:mb-4 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 drop-shadow" />
                )}

                <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight px-2">
                  {titleText}
                </DialogTitle>
            

                {/* Date pill */}
                <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/20 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs md:text-sm font-medium backdrop-blur">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">
                    {targetDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {!isRegistrationOpen && (
                    <span className="ml-1 sm:ml-2 rounded-full bg-white/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs">
                      {"Upcoming"}
                    </span>
                  )}
                  {isRegistrationOpen && (
                    <span className="ml-1 sm:ml-2 rounded-full bg-white/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs">
                      {"Open"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="bg-gradient-to-br from-[#dff6ff] to-[#eef6ff] px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 text-center">
              {!isRegistrationOpen ? (
                <>
                  <p className="mx-auto max-w-prose text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed px-2">
                    We are preparing to open registration for Aarogya Aadhar healthcare services. Register promptly once it opens to
                    enjoy faster access to your benefits after approval.
                  </p>

                  <div
                    className="mx-auto grid w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 md:gap-4"
                    role="timer"
                    aria-live="polite"
                  >
                    <TimeBlock value={parts.days} label="Days" />
                    <TimeBlock value={parts.hours} label="Hours" />
                    <TimeBlock value={parts.minutes} label="Minutes" />
                    <TimeBlock value={parts.seconds} label="Seconds" />
                  </div>

                  <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 md:gap-3 w-full max-w-md mx-auto">
                    <Button
                      asChild
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 rounded-full text-sm sm:text-base md:text-lg transition-all shadow-lg hover:shadow-xl min-h-[44px]"
                    >
                      <a href={calendarHref} target="_blank" rel="noreferrer noopener">
                        Add to Calendar
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 min-h-[44px]"
                      onClick={() => setIsOpen(false)}
                    >
                      Remind me later
                    </Button>
                  </div>
                  <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 px-2">
                    We will notify you once registration begins. Your health is our priority.
                  </p>
                </>
              ) : (
                <>
                  <p className="mx-auto max-w-prose text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed px-2">
                    Registration is now live. Create your Aarogya Aadhar account to access healthcare services and benefits after
                    verification and approval.
                  </p>
                  <DialogFooter className="flex w-full mx-auto !justify-center">
                    <Button
                      asChild
                      className="w-full max-w-xs sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 md:px-10 rounded-full text-sm sm:text-base md:text-lg transition-all shadow-lg hover:shadow-xl min-h-[44px]"
                    >
                      <Link href="/patient/register">Register Now</Link>
                    </Button>
                  </DialogFooter>
                  <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 px-2">
                    Benefits will be available after your account has been approved.
                  </p>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scoped animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes float-slow {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(10px) translateX(6px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
        @keyframes sheen {
          0% {
            background-position: 200% 0%;
          }
          50% {
            background-position: 100% 0%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}

function TimeBlock({ value, label }) {
  const v = Math.max(0, value)
  return (
    <div className="relative rounded-lg sm:rounded-xl bg-white/70 ring-1 ring-black/5 shadow-sm backdrop-blur">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
        }}
      />
      <div className="relative px-2 py-2.5 sm:px-3.5 sm:py-3.5 md:px-5 md:py-5">
        <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold tabular-nums tracking-tight text-gray-900">
          {String(v).padStart(2, "0")}
        </div>
        <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium uppercase tracking-wide text-gray-600">{label}</div>
      </div>
    </div>
  )
}
