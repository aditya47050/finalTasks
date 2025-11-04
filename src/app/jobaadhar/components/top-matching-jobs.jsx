"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from '@/components/ui/button';
import { ChevronRight,TrendingUp } from "lucide-react"
import { BsGraphUpArrow } from "react-icons/bs";

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function TopMatchingJobs({ className ,seekerId }) {
  const { data, isLoading, error } = useSWR(
    seekerId ? `/api/jobaadhar/matching-jobs?limit=12&userId=${seekerId.id}` : null,
    fetcher
  )

  return (
    <>
      <section className={cn("hidden md:block bg-white container", className)}>
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="mb-6 md:mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-500">Top Matching Jobs</h2>
              <p className="text-gray-500">Based on your skills and interests</p>
            </div>
            <Link href={"/jobaadhar/jobs"}>
              <Button className="hidden sm:flex bg-blue-500 hover:bg-blue-500 text-white rounded-xl">
                View all jobs
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="border">
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-destructive">Failed to load matching jobs.</div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              role="list"
              aria-label="Top matching jobs"
            >
              {data?.jobs?.map((job) => (
                <Card key={job.id} role="listitem" className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="">
                      <CardTitle className="text-blue-500 truncate py-1">{job.title}</CardTitle>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{job.companyName}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col flex-wrap items-start gap-2 text-sm">
                      {job.location && <Badge className="bg-gray-100 truncate">{job.location}</Badge>}
                    </div>
                    {job.workMode && <Badge variant="outline">{job.workMode}</Badge>}
                    {typeof job.matchScore === "number" && (
                      <Badge className="bg-blue-500 text-white w-fit ml-2">Match {Math.round(job.matchScore * 100)}% <TrendingUp className="h-3 w-3 mx-1" /></Badge>
                    )}
                    <div className="flex flex-col flex-wrap gap-2" aria-label="Required skills">
                      <div>
                          { job.skills.length > 0 ?
                              (job.skills.slice(0, 3).map((s) => (
                              <Badge key={s} variant="secondary" className="text-blue-500">
                                  {s}
                              </Badge>
                              ))):<span className="text-xs text-gray-500">N/A</span>
                          }
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Posted {new Date(job.postedAt).toLocaleDateString()}</p>
                    <div className="mx-auto flex justify-center items-end">
                      <Link href={`/jobaadhar/jobs/${job.id}`} className="w-full text-center bg-blue-500 text-white rounded-xl px-4 py-2 mt-2">View Job Details</Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className={cn("md:hidden block bg-white ", className)}>
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="mb-6 md:mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-500">Top Matching Jobs</h2>
              <p className="text-gray-500 text-sm">Based on your skills and interests</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="border">
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-destructive">Failed to load matching jobs.</div>
          ) : (
            <div
              className="grid grid-cols-2 gap-4"
              role="list"
              aria-label="Top matching jobs"
            >
              {data?.jobs?.map((job) => (
                <Card key={job.id} role="listitem" className="relative hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 !p-4">
                    <div className="">
                      <CardTitle className="text-blue-500 truncate text-base py-0.5 pt-2">{job.title}</CardTitle>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{job.companyName}</p>
                  </CardHeader>
                  {typeof job.matchScore === "number" && (
                    <Badge className="absolute top-1 bg-blue-500 text-white text-[8px] w-fit ml-2">{Math.round(job.matchScore * 100)}% <TrendingUp className="h-3 w-3 mx-1" /></Badge>
                  )}
                  <CardContent className="!p-4 !py-0">
                    <div className="flex flex-col flex-wrap items-start gap-2 text-[10px]">
                      {job.location && <Badge className="bg-gray-100 truncate text-[10px]">{job.location}</Badge>}
                    </div>
                  </CardContent>
                  <div className="mx-auto flex justify-center items-end">
                    <Link href={`/jobaadhar/jobs/${job.id}`} className="w-full text-center text-sm bg-blue-500 text-white rounded-b-xl px-4 py-2 mt-2">View Job Details</Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
