"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Clock, Heart, MapPin } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import RatingStars from './rating-stars';
function timeAgo(date) {
  const now = new Date()
  const postedDate = new Date(date)
  const diff = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24)) // difference in days
  if (diff === 0) return "Today"
  if (diff === 1) return "1 day ago"
  return `${diff} days ago`
}
const CategorySingleView = ({ company, userId }) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [companyReviews, setCompanyReviews] = useState(company.reviews)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [newContent, setNewContent] = useState("")
  const [isReviewLoading, setIsReviewLoading] = useState(false)

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return

    setIsReviewLoading(true)
    try {
      const res = await fetch("/api/jobaadhar/job-seeker/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: company.id,
          rating: newReview.rating,
          content: newReview.comment,
        }),
      })

      if (!res.ok) throw new Error("Failed to add review")
      const data = await res.json()

      setCompanyReviews([data.review, ...companyReviews])
      setNewReview({ rating: 5, comment: "" })
      toast({ title: "Success", description: "Review added!" })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsReviewLoading(false)
    }
  }

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`/api/jobaadhar/job-seeker/follow/check?companyId=${company.id}&seekerId=${userId}`)
        const data = await res.json()
        setIsFollowing(data.isFollowing)
      } catch (err) {
        console.error(err)
      }
    }
    if (userId && company.id) checkFollowStatus()
  }, [company.id, userId])

  const handleFollowToggle = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/jobaadhar/job-seeker/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seekerId: userId, companyId: company.id }),
      })
      if (!res.ok) throw new Error("Failed to update follow status")
      setIsFollowing(!isFollowing)
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? `You unfollowed ${company.name}` : `You are now following ${company.name}`,
      })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }
  console.log(company)

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-10 space-y-6">
        {/* Company Header */}
        <Card className="p-6 flex items-center gap-4 border shadow-sm rounded-2xl">
          <div className="h-16 w-auto rounded-xl bg-blue-100 flex items-center justify-center">
            <Image
              width={100}
              height={100}
              src={company.logoUrl || "/placeholder.svg"}
              alt="profile"
              className="h-12 w-auto rounded-xl object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{company.name}</h1>
            <p className="text-gray-600 text-sm">Founded: {company.founded || 2025}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {company.tags.map((t) => (
                <Badge key={t.id} className="bg-gray-200 text-xs">
                  {t.tag?.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleFollowToggle}
              disabled={isLoading}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 
              flex items-center gap-2 transform hover:scale-105 active:scale-95
              ${
                isFollowing
                  ? "bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-50"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl"
              }
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              <Heart className={`w-4 h-4 transition-all duration-300 ${isFollowing ? "fill-blue-500" : "fill-none"}`} />
              {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* About */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">About Company</h2>
              <p className="text-gray-700">{company.about || "No description available."}</p>
            </Card>

            {/* Insights */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Company Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-gray-600">Mission</h3>
                  <p className="text-gray-800">{company.mission || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">Values</h3>
                  <p className="text-gray-800">{company.values || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-600">Culture</h3>
                  <p className="text-gray-800">{company.culture || "Not specified"}</p>
                </div>
              </div>
            </Card>

            {/* Tags & Benefits */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Tags & Benefits</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {company.tags.map((t) => (
                  <Badge key={t.id} className="bg-gray-200 text-xs">
                    {t.tag?.name}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {company.benefits.map((b) => (
                  <Badge key={b.id} className="bg-green-100 text-xs">
                    {b.benefit?.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Ratings */}
            {company.ratings && (
              <Card className="p-6 rounded-2xl">
                <h2 className="text-lg font-semibold mb-4">Employee Ratings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(company.ratings).map(([key, value]) => {
                    if (["id", "companyId", "createdAt", "updatedAt"].includes(key)) return null

                    return (
                      <div
                        key={key}
                        className="p-3 border rounded-xl flex flex-col gap-2 hover:shadow-sm transition-shadow"
                      >
                        <p className="text-gray-600 font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                        <div className="flex items-center gap-2">
                          <RatingStars
                            rating={Number(value)}
                            size="md"
                            animated
                            aria-label={`${key} rating ${Number(value).toFixed(1)} out of 5`}
                          />
                          <span className="text-gray-800 font-semibold">{Number(value).toFixed(1)}/5</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-6">
                  {/* Left: Average Rating */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">
                      {companyReviews.length > 0
                        ? (companyReviews.reduce((acc, r) => acc + r.rating, 0) / companyReviews.length).toFixed(1)
                        : "0.0"}
                    </div>
                    <div className="flex items-center justify-center mb-1">
                      {(() => {
                        const avg =
                          companyReviews.length > 0
                            ? companyReviews.reduce((acc, r) => acc + r.rating, 0) / companyReviews.length
                            : 0
                        return (
                          <RatingStars
                            rating={avg}
                            size="lg"
                            animated
                            aria-label={`Average rating ${avg.toFixed(1)} out of 5`}
                          />
                        )
                      })()}
                    </div>
                    <div className="text-sm text-gray-500">{companyReviews.length} reviews</div>
                  </div>

                  {/* Middle: Rating Distribution */}
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = companyReviews.filter((r) => Math.floor(r.rating) === stars).length
                      const percentage = companyReviews.length > 0 ? (count / companyReviews.length) * 100 : 0
                      return (
                        <div key={stars} className="flex items-center gap-2 mb-2">
                          <span className="text-base w-10">{stars}★</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-3">
                            <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-base text-gray-500 w-8">{count}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Right: Add Review Form */}
                  <div className="flex-1">
                    {userId && (
                      <>
                        <h4 className="font-semibold mb-2">Write a Review</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rating</label>
                            <select
                              className="w-32 p-2 border rounded"
                              value={newReview.rating}
                              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                            >
                              {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>
                                  {rating} Star{rating > 1 ? "s" : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Your Review</label>
                            <textarea
                              rows={4}
                              placeholder="Share your experience..."
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              className="p-2 border rounded w-full"
                            />
                          </div>
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                            onClick={handleSubmitReview}
                            disabled={!newReview.comment.trim() || isReviewLoading}
                          >
                            {isReviewLoading ? "Submitting..." : "Submit Review"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* List of Reviews */}
              <div className="space-y-4 mt-6">
                {companyReviews.length > 0 ? (
                  companyReviews.map((review) => (
                    <Card key={review.id} className="rounded-xl hover:shadow-sm transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium">{review.jobSeeker?.user?.fullName || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <RatingStars
                                rating={review.rating}
                                size="sm"
                                animated
                                aria-label={`Review rating ${review.rating.toFixed ? review.rating.toFixed(1) : review.rating} out of 5`}
                              />
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-500 leading-relaxed">{review.content}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 p-4">No reviews available.</p>
                )}
              </div>
            </Card>

            {/* Address */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Company Address</h2>
              <p className="text-gray-700 leading-relaxed">
                {company.addressLine1 && `${company.addressLine1}, `}
                {company.addressLine2 && `${company.addressLine2}, `}
                {company.city && `${company.city}, `}
                {company.district && `${company.district}, `}
                {company.state && `${company.state}, `}
                {company.pincode && `Pincode: ${company.pincode}, `}
                {company.country && company.country}
              </p>
            </Card>
          </TabsContent>

          {/* Jobs */}
          <TabsContent value="jobs" className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {company.jobs.map((job) => (
              <Card
                key={job.id}
                className="p-5 hover:shadow-xl transition-all rounded-xl bg-white border border-gray-100"
              >
                <div className="space-y-3 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500">{job.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || "N/A"}</span>
                      {job.remote && (
                        <Badge className="text-xs bg-cyan-500 text-white">Remote</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{job.employmentType || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{timeAgo(job.postedAt) || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {job.description || "No description available"}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-800">
                      {(() => {
                        if (!job.salary) return "Not specified";
                        const parts = job.salary.split(/\s*(?:-|–|—|to)\s*/i).filter(Boolean);
                        const formatted = parts.map((p) => {
                          const num = Number(String(p).replace(/[^\d.]/g, ""));
                          if (!isFinite(num)) return p;
                          return `₹${num.toLocaleString("en-IN")}`;
                        });
                        return formatted.join(" - ");
                      })()}
                    </span>
                    <Link href={`/jobaadhar/jobs/${job.id}`}>
                      <Button
                        variant="outline"
                        className="rounded-xl border-gray-200 hover:bg-blue-500 hover:text-white text-cyan-600"
                      >
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CategorySingleView
