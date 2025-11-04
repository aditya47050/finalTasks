"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"



const sizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

export default function RatingStars({ rating, size = "md", animated = false, className, ...rest }) {
  const filled = Math.max(0, Math.min(5, Math.floor(rating ?? 0)))
  const half = useMemo(() => {
    const dec = rating - Math.floor(rating)
    return dec >= 0.25 && dec < 0.75
  }, [rating])

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} {...rest}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < filled
        const isHalf = i === filled && half
        return (
          <Star
            key={i}
            filled={isFilled}
            half={isHalf}
            className={cn(
              sizes[size],
              "text-yellow-400",
              animated && "transition-transform duration-300 motion-safe:hover:scale-110",
            )}
          />
        )
      })}
    </div>
  )
}

function Star({
  filled,
  half,
  className,
}) {
  // Using currentColor to respect theme tokens
  if (half) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.91 1.18 6.82L12 17.77 5.82 21l1.18-6.82-5-4.91 6.91-1.01L12 2z"
          fill="url(#half)"
          stroke="currentColor"
          className="text-primary"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.91 1.18 6.82L12 17.77 5.82 21l1.18-6.82-5-4.91 6.91-1.01L12 2z"
        fill={filled ? "currentColor" : "transparent"}
        stroke="currentColor"
        className={filled ? "text-primary" : "text-muted-foreground/50"}
      />
    </svg>
  )
}
