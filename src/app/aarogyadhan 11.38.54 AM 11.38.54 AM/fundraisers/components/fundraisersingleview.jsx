"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Target,
  Users,
  FileText,
  Copy,
  Clock,
  ImageIcon,
  Play,
  Download,
  Maximize2,
  X,
  Eye,
} from "lucide-react"
import DonateDialog from "../../components/donatedialog"
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
} from "react-share"
import { toast } from "react-toastify"

const IndividualCampaign = ({ campaign }) => {
  const [selectedMedia, setSelectedMedia] = useState(null)

  const goalAmount = Number.parseFloat(campaign.goalamount || "0")
  const receivedAmount = Number.parseFloat(campaign.recievedamount || "0")
  const progress = goalAmount > 0 ? Math.round((receivedAmount / goalAmount) * 100) : 0
  const remainingAmount = goalAmount - receivedAmount
  const donationCount = campaign.Donation?.length || 0
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/aarogyadhan/fundraisers/${campaign.id}`
  const shareText = `Help ${campaign.fundraisertitle || "Save a Life"} - ${campaign.healthissue || "Medical Emergency"}`

  // Media Gallery Component
  const MediaGallery = () => {
    const images = [
      { url: campaign.image1, label: "Campaign Image 1" },
      { url: campaign.image2, label: "Campaign Image 2" },
      { url: campaign.image3, label: "Campaign Image 3" },
    ].filter((img) => img.url)

    const videos = [
      { url: campaign.video1, label: "Campaign Video 1" },
      { url: campaign.video2, label: "Campaign Video 2" },
    ].filter((video) => video.url)

    if (images.length === 0 && videos.length === 0) {
      return null
    }

    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardTitle className="flex items-center text-xl">
            <ImageIcon className="w-5 h-5 mr-2" />
            Campaign Media ({images.length + videos.length} files)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Images Section */}
            {images.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-indigo-600" />
                  Campaign Images ({images.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border shadow-md hover:shadow-lg transition-all duration-300">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.label}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                          onClick={() => setSelectedMedia({ type: "image", url: image.url, label: image.label })}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-10 w-10 p-0 bg-white/90 hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedMedia({ type: "image", url: image.url, label: image.label })
                              }}
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-10 w-10 p-0 bg-white/90 hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(image.url, "_blank")
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 text-center font-medium">{image.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {videos.length > 0 && (
              <div>
                {images.length > 0 && <Separator className="my-6" />}
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5 text-indigo-600" />
                  Campaign Videos ({videos.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border shadow-md hover:shadow-lg transition-all duration-300">
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-cover"
                          preload="metadata"
                          poster="/placeholder.svg"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-600 font-medium">{video.label}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs bg-transparent"
                            onClick={() => setSelectedMedia({ type: "video", url: video.url, label: video.label })}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Full Screen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs bg-transparent"
                            onClick={() => window.open(video.url, "_blank")}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
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
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedMedia(null)}
      >
        <div className="relative max-w-6xl max-h-full w-full">
          <Button
            className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-transparent hover:bg-white/10"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedMedia(null)}
          >
            <X className="h-6 w-6" />
            Close
          </Button>
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            {selectedMedia.type === "image" ? (
              <div className="relative">
                <Image
                  src={selectedMedia.url || "/placeholder.svg"}
                  alt={selectedMedia.label}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[80vh] object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="relative">
                <video src={selectedMedia.url} controls className="max-w-full max-h-[80vh] mx-auto" autoPlay>
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="p-4 bg-gray-50">
              <p className="text-center font-medium text-gray-800">{selectedMedia.label}</p>
              <div className="flex justify-center gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => window.open(selectedMedia.url, "_blank")}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  console.log(shareUrl, shareText)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/aarogyadhan/fundraisers">
          <Button variant="outline" className="mb-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fundraisers
          </Button>
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-white to-blue-50">
              <div className="relative h-64 md:h-96">
                {campaign.frontimage ? (
                  <Image
                    src={campaign.frontimage || "/placeholder.svg"}
                    alt={campaign.fundraisertitle || "Campaign"}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() =>
                      setSelectedMedia({
                        type: "image",
                        url: campaign.frontimage,
                        label: "Campaign Front Image",
                      })
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[#5271FF] to-[#4460e6] flex items-center justify-center">
                    <Heart className="w-24 h-24 text-white opacity-50" />
                  </div>
                )}
                {progress < 50 && (
                  <Badge className="absolute top-4 left-4 bg-[#FF3131] hover:bg-[#e02828] text-white shadow-lg">
                    <Clock className="w-3 h-3 mr-1" />
                    Urgent Help Needed
                  </Badge>
                )}
                {campaign.frontimage && (
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white"
                      onClick={() =>
                        setSelectedMedia({
                          type: "image",
                          url: campaign.frontimage,
                          label: "Campaign Front Image",
                        })
                      }
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-2xl md:text-4xl font-bold mb-2">
                    {campaign.fundraisertitle || "Help Save a Life"}
                  </h1>
                  {campaign.healthissue && (
                    <p className="text-lg md:text-xl font-medium opacity-90">{campaign.healthissue}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Campaign Story */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-[#5271FF] to-[#4460e6] text-white">
                <CardTitle className="text-xl flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Campaign Story
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {campaign.description && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">About this Campaign</h3>
                    <p className="text-gray-600 leading-relaxed text-base">{campaign.description}</p>
                  </div>
                )}
                {campaign.story && (
                  <div>
                    <Separator className="my-4" />
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">The Full Story</h3>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base text-justify">{campaign.story}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Media Gallery */}
            <MediaGallery />

            {/* Medical Documents */}
            {(campaign.medicaldoc1 || campaign.medicaldoc2 || campaign.medicaldoc3) && (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Medical Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[campaign.medicaldoc1, campaign.medicaldoc2, campaign.medicaldoc3]
                      .filter(Boolean)
                      .map((doc, index) => (
                        <div
                          key={index}
                          className="relative h-48 bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
                        >
                          <Image
                            src={doc || "/placeholder.svg"}
                            alt={`Medical Document ${index + 1}`}
                            fill
                            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() =>
                              setSelectedMedia({
                                type: "image",
                                url: doc,
                                label: `Medical Document ${index + 1}`,
                              })
                            }
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-10 w-10 p-0 bg-white/90 hover:bg-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedMedia({
                                    type: "image",
                                    url: doc,
                                    label: `Medical Document ${index + 1}`,
                                  })
                                }}
                              >
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-10 w-10 p-0 bg-white/90 hover:bg-white"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(doc, "_blank")
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">Click on any document to view in full size</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Progress */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-[#5271FF] to-[#4460e6] text-white">
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2" />
                  Fundraising Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#5271FF] mb-1">₹{receivedAmount.toLocaleString()}</div>
                  <div className="text-gray-600 text-lg">raised of ₹{goalAmount.toLocaleString()} goal</div>
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-4 bg-gray-200" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-semibold">{progress}% funded</span>
                    <span className="flex items-center font-semibold">
                      <Users className="w-4 h-4 mr-1" />
                      {donationCount} donors
                    </span>
                  </div>
                </div>
                {remainingAmount > 0 && (
                  <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-orange-800 font-semibold">
                      ₹{remainingAmount.toLocaleString()} still needed
                    </div>
                    <div className="text-orange-600 text-sm">to reach the goal</div>
                  </div>
                )}
                <div className="pt-4">
                  <DonateDialog campaignId={campaign.id} />
                </div>
              </CardContent>
            </Card>

            {/* Campaign Info */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                <CardTitle className="text-lg">Campaign Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-3 text-[#5271FF]" />
                  <div>
                    <div className="font-semibold">Created</div>
                    <div>
                      {new Date(campaign.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Heart className="w-4 h-4 mr-3 text-[#FF3131]" />
                  <div>
                    <div className="font-semibold">Category</div>
                    <div>Medical Fundraiser</div>
                  </div>
                </div>
                {campaign.fundraiser && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-3 text-[#5271FF]" />
                    <div>
                      <div className="font-semibold">Organizer</div>
                      <div>{campaign.fundraiser.name || "Anonymous"}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Campaign */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle className="flex items-center text-lg">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share this Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4">Help spread the word and save a life</p>
                <div className="grid grid-cols-4 gap-2 justify-around items-center mb-4">
                <div className="flex justify-center items-center">
                  <WhatsappShareButton url={shareUrl} title={shareText}>
                    <WhatsappIcon size={48} round />
                  </WhatsappShareButton>
                </div>

                <div className="flex justify-center items-center">
                  <FacebookShareButton url={shareUrl} quote={shareText}>
                    <FacebookIcon size={48} round />
                  </FacebookShareButton>
                </div>

                <div className="flex justify-center items-center">
                  <TwitterShareButton url={shareUrl} title={shareText}>
                    <TwitterIcon size={48} round />
                  </TwitterShareButton>
                </div>

                <div className="flex justify-center items-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl)
                      toast.success("Link copied to clipboard!")
                    }}
                    className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  >
                    <Copy className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                <div className="flex justify-center items-center">
                  <TelegramShareButton url={shareUrl} title={shareText}>
                    <TelegramIcon size={48} round />
                  </TelegramShareButton>
                </div>

                <div className="flex justify-center items-center">
                  <EmailShareButton url={shareUrl} subject={shareText} body={shareText}>
                    <EmailIcon size={48} round />
                  </EmailShareButton>
                </div>

                <div className="flex justify-center items-center">
                  <LinkedinShareButton url={shareUrl} title={shareText}>
                    <LinkedinIcon size={48} round />
                  </LinkedinShareButton>
                </div>

                <div className="flex justify-center items-center">
                  <PinterestShareButton
                    url={shareUrl}
                    media={shareUrl}
                    description={shareText}
                  >
                    <PinterestIcon size={48} round />
                  </PinterestShareButton>
                </div>
              </div>

              </CardContent>
            </Card>
          </div>
        </div>

        {/* Media Modal */}
        <MediaModal />
      </div>
    </div>
  )
}

export default IndividualCampaign
