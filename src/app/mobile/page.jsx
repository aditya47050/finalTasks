"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'

function CurvedHeader({ showSkip, onSkip }) {
  return (
    <div className="relative bg-blue-600 text-white">
      <div className="h-44 z-20 relative">
        <div className="absolute -top-24 right-1/2 translate-x-1/2 h-[360px] w-[360px] bg-blue-500/70 rounded-full" />
        <div className="absolute -top-12 right-1/2 translate-x-1/2 h-[280px] w-[280px] bg-blue-500/50 rounded-full" />
        <div className="absolute inset-0 flex items-start justify-between p-4">
          <img
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732897093/logo_with_tm_1_dovble.png"
            alt="Logo"
            className="object-contain mx-auto p-1 w-full max-w-[200px] rounded-xl"
          />
        </div>
      </div>
    </div>
  )
}

function Slide({ title, description, imgSrc, onPrimary, primaryText = "Try it now", dots }) {
  return (
    <div className="snap-start shrink-0 w-full h-dvh overflow-hidden flex flex-col">
      <CurvedHeader />
      <div className="relative rounded-t-3xl bg-background px-6 pb-24 pt-6 flex-1">
        <div className="flex flex-col items-center text-center gap-4">
          <img src={imgSrc || "/placeholder.svg"} alt="" className="z-0 h-60 w-60 object-contain mt-4" />
          <h1 className="text-2xl font-semibold text-balance">{title}</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xs">{description}</p>
          {dots}
        </div>
        <div className="absolute px-4 left-0 w-full bottom-2 z-10 mt-6">
          <Button
            onClick={onPrimary}
            className="w-full rounded-xl bg-blue-600 text-white py-4 text-base font-medium shadow-lg"
          >
            {primaryText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const scrollerRef = useRef(null)
  const [index, setIndex] = useState(0)

  const slides = [
    {
      title: "Patient Login",
      description: "Access your personal dashboard to manage appointments and services.",
      imgSrc: "https://res.cloudinary.com/dorreici1/image/upload/v1756901686/Gemini_Generated_Image_8xe2y48xe2y48xe2_ovlsfr.png",
      link: "/mobile/patient/", // ✅ route for patient
    },
    {
      title: "Doctor Login",
      description: "Sign in to manage patients, appointments, and provide consultations.",
      imgSrc: "https://res.cloudinary.com/dorreici1/image/upload/v1756897549/d90f4c19-f51b-4cbf-a9eb-ad91af730f52.png",
      link: "/mobile/doctor/", // ✅ route for doctor
    },
  ]

  const handlePrimary = () => {
    router.replace(slides[index].link) // ✅ redirect based on current slide
  }

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft
    const width = e.target.clientWidth
    const newIndex = Math.round(scrollLeft / width)
    setIndex(newIndex)
  }

  return (
    <main className="h-dvh w-full bg-background">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-x-auto snap-x snap-mandatory flex scroll-smooth"
      >
        {slides.map((s, i) => (
          <Slide
            key={i}
            title={s.title}
            description={s.description}
            imgSrc={s.imgSrc}
            onPrimary={handlePrimary}
            primaryText="Continue"
            dots={<PageDots total={slides.length} index={index} />}
          />
        ))}
      </div>
    </main>
  )
}

function PageDots({ total, index }) {
  return (
    <div className="mt-2 flex items-center justify-center gap-2" role="group" aria-label="Onboarding progress">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-blue-600" : "w-2 bg-slate-300"}`}
          aria-current={i === index ? "true" : "false"}
        />
      ))}
    </div>
  )
}
