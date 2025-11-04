"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background flex items-center justify-center p-6">
      <motion.section
        className="w-full max-w-md text-center space-y-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <img
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
            alt="App logo"
            className="mx-auto w-full p-2 max-w-[200px] rounded-xl"
          />
        </motion.div>

        {/* Patient illustration */}
        <motion.div
          className="relative mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <motion.img
            src="https://res.cloudinary.com/dorreici1/image/upload/v1756901686/Gemini_Generated_Image_8xe2y48xe2y48xe2_ovlsfr.png"
            alt="Patient-centered care illustration"
            className="mx-auto w-full max-w-xs rounded-2xl shadow-sm"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 right-4 h-6 w-6 rounded-full bg-blue-600/80 animate-ping"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1 left-6 h-4 w-4 rounded-full bg-teal-500/80 animate-ping [animation-duration:2.5s]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-6 left-2 h-4 w-4 rounded-full bg-blue-600/70 animate-ping [animation-duration:3s]"
          />
        </motion.div>

        {/* CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-[24px] space-y-3">
          <Button asChild className="w-full bg-blue-600 text-white rounded-xl hover:bg-blue-600/90">
            <Link href="/mobile/patient/login">Continue to Patient login</Link>
          </Button>

          {/* Registration link */}
          <p className="text-sm text-gray-600">
            New user?{" "}
            <Link href="/patient/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </motion.div>
      </motion.section>
    </main>
  )
}
