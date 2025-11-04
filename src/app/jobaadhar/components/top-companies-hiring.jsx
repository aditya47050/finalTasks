"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function TopCompaniesHiring({ className }) {
  const { data, isLoading, error } = useSWR("/api/jobaadhar/top-companies?limit=8", fetcher)
  return (
    <section className={cn(" mt-4", className)}>
      <div className="container mx-auto px-4 xl:px-8 md:py-6">
        <div className="mb-6 md:mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-500">Top Companies Hiring</h2>
            <p className="text-muted-foreground">Sorted by active openings and recent posts</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive">Failed to load companies.</div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            role="list"
            aria-label="Top companies hiring"
          >
            {data?.companies?.map((c) => (
              <Card key={c.id} role="listitem" className="hover:shadow-md transition-shadow bg-white">
                <CardHeader className="">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-auto relative bg-white rounded-xl ring-1 ring-blue-100 overflow-hidden">
                      <img
                        alt={`${c.name} logo`}
                        src={c.logoUrl || "/placeholder.svg?height=40&width=40&query=company-logo"}
                        className="object-contain h-16 w-full"
                      />
                    </div>
                    <CardTitle className="text-blue-500">{c.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap justify-center gap-4">
                    <Badge variant="secondary" className="text-blue-500">
                      Jobs Posted {c.jobCount}
                    </Badge>
                    {c.category && <Badge className="bg-blue-500 text-white">{c.category.name}</Badge>}
                    <Link href={`/jobaadhar/companies/${c.id}`} className="bg-blue-500 rounded-xl text-white px-4 py-2">View Details</Link>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
