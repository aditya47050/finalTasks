"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedStat({ to, duration = 800, suffix }) {
  const [val, setVal] = useState(0)
  const start = useRef(null)
  const from = 0

  useEffect(() => {
    let raf = 0
    const step = (ts) => {
      if (start.current === null) start.current = ts
      const progress = Math.min(1, (ts - start.current) / duration)
      const eased = easeOutCubic(progress)
      const next = Math.round(from + (to - from) * eased)
      setVal(next)
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])

  return (
    <span aria-live="polite">
      {val.toLocaleString()}
      {suffix ?? ""}
    </span>
  )
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}
