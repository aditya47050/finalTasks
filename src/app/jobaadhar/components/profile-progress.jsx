"use client"

import { Progress } from "@/components/ui/progress"

export function ProfileProgress({ value }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Profile Strength</p>
        <p className="text-sm font-semibold">{clamped}%</p>
      </div>
      <Progress value={clamped} className="h-3" />
      <p className="text-xs text-muted-foreground">Complete your profile to increase visibility to recruiters.</p>
    </div>
  )
}
