"use client"

import { cn } from "@/lib/utils"

export function SectionCard({title,description,children,className,}) {
  return (
    <section
      className={cn(
        "rounded-lg border bg-card text-card-foreground p-5 md:p-6",
        "animate-in fade-in slide-in-from-bottom-2 duration-300",
        className,
      )}
      aria-labelledby={title.toLowerCase().replace(/\s+/g, "-")}
    >
      <header className="mb-4">
        <h2 id={title.toLowerCase().replace(/\s+/g, "-")} className="text-lg md:text-xl font-semibold text-balance">
          {title}
        </h2>
        {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
      </header>
      {children}
    </section>
  )
}
