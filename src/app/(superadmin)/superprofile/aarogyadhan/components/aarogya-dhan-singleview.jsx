"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Calendar,
  User,
  FileText,
  ImageIcon,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Target,
  TrendingUp,
  Pencil,
  Play,
  Download,
  Maximize2,
} from "lucide-react"
import { FaIndianRupeeSign } from "react-icons/fa6"
import Image from "next/image"
import { toast } from "react-toastify"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

const AarogyadhanSingleView = ({ data, type }) => {
  const [newStatus, setNewStatus] = useState(data.status)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setloading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const router = useRouter()
  const pathname = usePathname()
  const ispath = pathname.includes("superprofile")

  const handleStatusChange = async () => {
    setloading(true)
    try {
      const response = await fetch("/api/aarogyadhan/campaign-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId: data.id, newStatus }),
      })
      if (response.ok) {
        toast("Status updated successfully")
        setIsEditing(false)
        setloading(false)
        router.refresh()
      } else {
        toast("Failed to update status")
        setloading(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast("An error occurred while updating status")
    }
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No data available</h3>
          <p className="text-sm text-muted-foreground">The requested information could not be loaded.</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-50"
      case "PENDING":
        return "text-yellow-600 bg-yellow-50"
      case "REJECTED":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return CheckCircle
      case "PENDING":
        return Clock
      case "REJECTED":
        return XCircle
      default:
        return AlertCircle
    }
  }

  // Media Gallery Component
  const MediaGallery = () => {
    const images = [
      { url: data.frontimage, label: "Front Image" },
      { url: data.image1, label: "Image 1" },
      { url: data.image2, label: "Image 2" },
      { url: data.image3, label: "Image 3" },
    ].filter((img) => img.url)

    const videos = [
      { url: data.video1, label: "Video 1" },
      { url: data.video2, label: "Video 2" },
    ].filter((video) => video.url)

    if (images.length === 0 && videos.length === 0) {
      return (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Media Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No media files uploaded</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Media Gallery ({images.length + videos.length} files)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Images Section */}
            {images.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Images ({images.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.label}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedMedia({ type: "image", url: image.url, label: image.label })}
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(image.url, "_blank")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">{image.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {videos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Videos ({videos.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border">
                        <video src={video.url} controls className="w-full h-full object-cover" preload="metadata">
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600">{video.label}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs bg-transparent"
                          onClick={() => window.open(video.url, "_blank")}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Media Modal Component
  const MediaModal = () => {
    if (!selectedMedia) return null

    return (
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedMedia(null)}
      >
        <div className="relative max-w-4xl max-h-full">
          <Button
            className="absolute -top-12 right-0 text-white hover:text-gray-300"
            variant="ghost"
            onClick={() => setSelectedMedia(null)}
          >
            <XCircle className="h-6 w-6" />
          </Button>
          {selectedMedia.type === "image" ? (
            <Image
              src={selectedMedia.url || "/placeholder.svg"}
              alt={selectedMedia.label}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <video src={selectedMedia.url} controls className="max-w-full max-h-full rounded-lg" autoPlay>
              Your browser does not support the video tag.
            </video>
          )}
          <p className="text-white text-center mt-2">{selectedMedia.label}</p>
        </div>
      </div>
    )
  }

  const renderCampaignView = () => {
    const goalAmount = Number.parseFloat(data.goalamount || 0)
    const receivedAmount = Number.parseFloat(data.recievedamount || 0)
    const progressPercentage = goalAmount > 0 ? (receivedAmount / goalAmount) * 100 : 0
    const StatusIcon = getStatusIcon(data.status)

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <Card className="overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    {data.frontimage ? (
                      <Image
                        src={data.frontimage || "/placeholder.svg"}
                        alt="Campaign"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Heart className="h-12 w-12" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{data.fundraisertitle || "Campaign Title"}</h1>
                    <Badge className={`${getStatusColor(data.status)} border-white/30`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {data.status}
                    </Badge>
                    {ispath && <Pencil className="h-4 w-4 cursor-pointer" onClick={() => setIsEditing(!isEditing)} />}
                  </div>
                  {isEditing && (
                    <div className="flex items-center gap-4 mt-4">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border text-black rounded-xl gap-2 px-3 py-1"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      <Button onClick={handleStatusChange} className="bg-blue-500 text-white px-3 py-1 rounded-xl">
                        {loading ? "Updating" : "Update Status"}
                      </Button>
                    </div>
                  )}
                  <p className="text-blue-100 mb-4 line-clamp-2">{data.description || "No description available"}</p>
                  {/* Progress Section */}
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Fundraising Progress</span>
                      <span className="text-sm">
                        ₹{receivedAmount.toLocaleString()} / ₹{goalAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3 bg-white/20" />
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span>{progressPercentage.toFixed(1)}% Complete</span>
                      <span>₹{(goalAmount - receivedAmount).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Goal Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{goalAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Received Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{receivedAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaIndianRupeeSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{progressPercentage.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Details */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Issue</p>
                <p className="text-sm">{data.healthissue || "Not specified"}</p>
              </div>
              {data.photographer && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Photographer</p>
                  <Link href={`/superprofile/aarogyadhan/photographers/${data.photographer.id}`}>
                    <p className="text-sm">
                      {data.photographer.fullname}-{data.photographer.city}
                    </p>
                  </Link>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Story</p>
                <p className="text-sm text-gray-700 leading-relaxed">{data.story || "No story provided"}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {new Date(data.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Updated: {new Date(data.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Documents */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medical Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3].map((num) => {
                  const docField = `medicaldoc${num}`
                  const docUrl = data[docField]
                  return (
                    <div key={num} className="border rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Document {num}</span>
                        {docUrl && (
                          <Button size="sm" variant="outline" onClick={() => window.open(docUrl, "_blank")}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                      {docUrl ? (
                        <div className="bg-green-50 p-2 rounded-xl text-xs text-green-700">Document available</div>
                      ) : (
                        <div className="bg-gray-50 p-2 rounded-xl text-xs text-gray-500">No document uploaded</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Gallery Section */}
        <MediaGallery />

        {/* Donations List */}
        {data.Donation && data.Donation.length > 0 && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaIndianRupeeSign className="h-5 w-5" />
                Recent Donations ({data.Donation.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {data.Donation.map((donation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{donation.donorName?.charAt(0) || "D"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{donation.donorName}</p>
                        <p className="text-xs text-gray-500">{new Date(donation.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        ₹{Number.parseFloat(donation.amount).toLocaleString()}
                      </p>
                      <Badge variant={donation.paymentStatus === "SUCCESS" ? "default" : "secondary"}>
                        {donation.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media Modal */}
        <MediaModal />
      </div>
    )
  }

  const renderDonationView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaIndianRupeeSign className="h-5 w-5" />
            Donation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Donor Name</p>
              <p className="text-lg font-semibold">{data.donorName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{Number.parseFloat(data.amount).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Status</p>
              <Badge variant={data.paymentStatus === "SUCCESS" ? "default" : "secondary"}>{data.paymentStatus}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Transaction ID</p>
              <p className="text-sm font-mono">{data.transactionId || "N/A"}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-sm">{data.donorEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile</p>
              <p className="text-sm">{data.donorMobile}</p>
            </div>
          </div>
          {data.wantsTaxBenefit && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Tax Benefit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">PAN Number</p>
                    <p className="text-sm font-mono">{data.panNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aadhar Number</p>
                    <p className="text-sm font-mono">{data.aadharNumber}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderDonorView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Donor Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{data.fullname?.charAt(0) || "D"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{data.fullname}</h2>
              <p className="text-gray-600">{data.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile</p>
              <p className="text-sm">{data.mobile}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">City</p>
              <p className="text-sm">{data.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pincode</p>
              <p className="text-sm">{data.pincode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">PAN Card</p>
              <p className="text-sm font-mono">{data.pancardno || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPatientView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={data.passportPhoto || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">{data.firstName?.charAt(0) || "P"}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {data.firstName} {data.middleName} {data.lastName}
              </h2>
              <p className="text-gray-600">{data.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile</p>
              <p className="text-sm">{data.mobile}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gender</p>
              <p className="text-sm">{data.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Blood Group</p>
              <p className="text-sm">{data.bloodgroup || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Date of Birth</p>
              <p className="text-sm">
                {data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">City</p>
              <p className="text-sm">{data.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pincode</p>
              <p className="text-sm">{data.pincode}</p>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">Address</h3>
            <p className="text-sm text-gray-700">{data.presentAddress}</p>
            <p className="text-sm text-gray-600">
              {data.city}, {data.state} - {data.pincode}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  switch (type) {
    case "campaign":
      return renderCampaignView()
    case "donation":
      return renderDonationView()
    case "donor":
      return renderDonorView()
    case "patient":
      return renderPatientView()
    default:
      return <div>Invalid view type</div>
  }
}

export default AarogyadhanSingleView
