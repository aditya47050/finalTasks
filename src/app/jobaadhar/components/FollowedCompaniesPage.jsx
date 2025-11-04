"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Briefcase, Calendar, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function FollowedCompaniesPage({userId}) {
  const [followedCompanies, setFollowedCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFollowedCompanies = async () => {
      try {
        const response = await fetch(`/api/jobaadhar/job-seeker/follow/list?seekerId=${userId}`)
        const data = await response.json()
        setFollowedCompanies(data.followedCompanies || [])
      } catch (error) {
        console.error("[v0] Error fetching followed companies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowedCompanies()
  }, [userId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-blue-600 font-medium">Loading your followed companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-10">
        {/* Header Section */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Following</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Companies you`re following • {followedCompanies.length}{" "}
            {followedCompanies.length === 1 ? "company" : "companies"}
          </p>
        </div>

        {/* Empty State */}
        {followedCompanies.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">No companies yet</h2>
              <p className="text-gray-600">
                Start following companies to stay updated with their latest job openings and news.
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white mt-4">
                <Link href="/jobaadhar/companies/">Explore Companies</Link>
              </Button>
            </div>
          </Card>
        ) : (
          /* Companies Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedCompanies.map((follow, index) => (
              <Card
                key={follow.id}
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header with Gradient */}
                <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 relative">
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 bg-white rounded-xl shadow-lg p-2 border-4 border-white group-hover:scale-110 transition-transform duration-300">
                      <Image
                        width={80}
                        height={80}
                        src={follow.company.logoUrl || "/placeholder.svg"}
                        alt={follow.company.name}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Heart className="w-4 h-4 text-white fill-white inline mr-1" />
                      <span className="text-white text-xs font-medium">Following</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-14 p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {follow.company.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Founded {follow.company.founded}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">{follow.company.about}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                  {follow.company.tags && follow.company.tags.length > 0 ? (
                    <>
                      {follow.company.tags.slice(0, 2).map((tag, idx) => (
                        <Badge
                          key={idx}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {follow.company.tags.length > 2 && (
                        <Badge className="bg-gray-100 text-gray-600">
                          +{follow.company.tags.length - 2}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge>C++</Badge>
                  )}
                </div>
                  {/* Job Count */}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {follow.company.jobs.length} {follow.company.jobs.length === 1 ? "opening" : "openings"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:shadow-lg rounded-xl"
                      asChild
                    >
                      <Link href={`/jobaadhar/companies/${follow.company.id}`}>View Company</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {followedCompanies.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Companies</p>
                  <p className="text-4xl font-bold mt-1">{followedCompanies.length}</p>
                </div>
                <Heart className="w-12 h-12 text-blue-200 fill-blue-200" />
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Openings</p>
                  <p className="text-4xl font-bold text-blue-600 mt-1">
                    {followedCompanies.reduce((sum, f) => sum + f.company.jobs.length, 0)}
                  </p>
                </div>
                <Briefcase className="w-12 h-12 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Latest Follow</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {new Date(followedCompanies[0]?.followedAt).toLocaleDateString()}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-500" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
