"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  ChevronDown,
  Heart,
  TrendingUp,
  X,
  Clock,
  MapPin,
  Users,
  Target,
  Share2,
  Copy,
} from "lucide-react";
import DonateDialog from "./donatedialog";
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
  RedditShareButton,
  RedditIcon,
} from "react-share";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

const FundraisersClient = ({ data }) => {
  const pathname = usePathname();
  const ispatient = pathname.startsWith("/patient/dashboard");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [visibleCount, setVisibleCount] = useState(20);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [currentShareData, setCurrentShareData] = useState(null);
  const searchRef = useRef(null);

  // Popular searches and suggestions
  const popularSearches = [
    "Heart Surgery",
    "Cancer Treatment",
    "Kidney Transplant",
    "Emergency Surgery",
    "Child Treatment",
  ];
  const quickFilters = [
    { id: "urgent", label: "🚨 Urgent Cases", color: "bg-red-500", count: 0 },
    { id: "recent", label: "⭐ New This Week", color: "bg-blue-500", count: 0 },
    {
      id: "almost-complete",
      label: "🎯 Almost Complete",
      color: "bg-green-500",
      count: 0,
    },
    {
      id: "high-goal",
      label: "💰 High Goal",
      color: "bg-purple-500",
      count: 0,
    },
  ];

  // Calculate progress for each campaign
  const campaignsWithProgress = useMemo(() => {
    return data.map((campaign) => {
      const goalAmount = Number.parseFloat(campaign.goalamount || "0");
      const receivedAmount = Number.parseFloat(campaign.recievedamount || "0");
      const progress =
        goalAmount > 0 ? Math.round((receivedAmount / goalAmount) * 100) : 0;

      return {
        ...campaign,
        progress,
        goalAmount,
        receivedAmount,
      };
    });
  }, [data]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const suggestions = campaignsWithProgress
      .filter(
        (campaign) =>
          campaign.fundraisertitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          campaign.healthissue?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5)
      .map((campaign) => ({
        title: campaign.fundraisertitle || "Untitled Campaign",
        type: campaign.healthissue || "Medical Emergency",
        id: campaign.id,
      }));

    return suggestions;
  }, [searchTerm, campaignsWithProgress]);

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    const filtered = campaignsWithProgress.filter((campaign) => {
      const matchesSearch =
        campaign.fundraisertitle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        campaign.healthissue
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "urgent" && campaign.progress < 50) ||
        (filterBy === "almost-complete" && campaign.progress >= 80) ||
        (filterBy === "recent" &&
          new Date(campaign.createdAt) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filterBy === "high-goal" && campaign.goalAmount > 500000);

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "goal-high":
          return b.goalAmount - a.goalAmount;
        case "goal-low":
          return a.goalAmount - b.goalAmount;
        case "progress":
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    return filtered;
  }, [campaignsWithProgress, searchTerm, sortBy, filterBy]);

  // Update filter counts
  const filterCounts = useMemo(() => {
    return {
      urgent: campaignsWithProgress.filter((c) => c.progress < 50).length,
      recent: campaignsWithProgress.filter(
        (c) =>
          new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      "almost-complete": campaignsWithProgress.filter((c) => c.progress >= 80)
        .length,
      "high-goal": campaignsWithProgress.filter((c) => c.goalAmount > 500000)
        .length,
    };
  }, [campaignsWithProgress]);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const handleSearchSubmit = (term) => {
    if (term && !searchHistory.includes(term)) {
      setSearchHistory((prev) => [term, ...prev.slice(0, 4)]);
    }
    setSearchTerm(term);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleCampaigns = filteredCampaigns.slice(0, visibleCount);
  const hasMoreCampaigns = visibleCount < filteredCampaigns.length;

  // Stats for hero section
  const totalCampaigns = data.length;
  const totalRaised = data.reduce(
    (sum, campaign) => sum + Number.parseFloat(campaign.recievedamount || "0"),
    0
  );
  const urgentCampaigns = campaignsWithProgress.filter(
    (c) => c.progress < 50
  ).length;

  const openShareDialog = (campaign) => {
    const shareUrl = `${window.location.origin}/aarogyadhan/fundraisers/${campaign.id}`;
    const shareText = `Help ${campaign.fundraisertitle || "Save a Life"} - ${
      campaign.healthissue || "Medical Emergency"
    }`;
    setCurrentShareData({ shareUrl, shareText });
    setShareDialogOpen(true);
  };

  const closeShareDialog = () => {
    setShareDialogOpen(false);
    setCurrentShareData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Enhanced Search */}
      <div className="relative  overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
          {!ispatient && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                  Help Save Lives
                  <span className="block text-2xl sm:text-3xl lg:text-3xl font-normal mt-2 text-blue-100">
                    Every Donation Counts
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of compassionate people making a difference in
                  medical emergencies across the country
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center">
                    <Users className="w-8 h-8 mr-2" />
                    {totalCampaigns}
                  </div>
                  <div className="text-blue-100">Active Campaigns</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center">
                    <Target className="w-8 h-8 mr-2" />₹
                    {(totalRaised / 100000).toFixed(1)}L
                  </div>
                  <div className="text-blue-100">Funds Raised</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl font-bold mb-2 flex items-center justify-center">
                    <Clock className="w-8 h-8 mr-2" />
                    {urgentCampaigns}
                  </div>
                  <div className="text-blue-100">Urgent Cases</div>
                </div>
              </div>
            </>
          )}

          {/* Enhanced Search Section */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
              {/* Main Search Bar */}
              <div className="relative mb-6" ref={searchRef}>
                <div
                  className={`relative transition-all duration-300 ${
                    isSearchFocused ? "transform scale-105" : ""
                  }`}
                >
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search
                      className={`h-6 w-6 transition-colors duration-300 ${
                        isSearchFocused ? "text-[#5271FF]" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by patient name, medical condition, or location..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setShowSuggestions(true);
                    }}
                    className="pl-14 pr-12 py-6 text-lg border-0 bg-gray-100 rounded-2xl focus:ring-4 focus:ring-[#5271FF]/30 focus:bg-white text-[#243471] transition-all duration-300 shadow-inner"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (isSearchFocused || searchTerm) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    {/* Live Search Results */}
                    {searchSuggestions.length > 0 && (
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                          <Search className="w-4 h-4 mr-2" />
                          Search Results
                        </h4>
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSubmit(suggestion.title)}
                            className="w-full text-left p-3 hover:bg-gray-100 rounded-xl transition-colors group"
                          >
                            <div className="font-medium text-gray-800 group-hover:text-[#5271FF] transition-colors">
                              {suggestion.title}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {suggestion.type}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Popular Searches */}
                    {!searchTerm && (
                      <div className="p-4 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Popular Searches
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearchSubmit(search)}
                              className="px-3 py-2 bg-gray-100 text-[#243471] hover:bg-[#5271FF] hover:text-white rounded-full text-sm transition-colors"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search History */}
                    {searchHistory.length > 0 && !searchTerm && (
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Recent Searches
                        </h4>
                        {searchHistory.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSubmit(search)}
                            className="w-full text-left p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-700 hover:text-[#5271FF]"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-full lg:w-48 py-4 rounded-2xl text-[#243471] border-0 bg-gray-100 focus:ring-2 focus:ring-[#5271FF] hover:bg-gray-200 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="urgent">🚨 Urgent Cases</SelectItem>
                    <SelectItem value="almost-complete">
                      🎯 Almost Complete
                    </SelectItem>
                    <SelectItem value="recent">⭐ Recent</SelectItem>
                    <SelectItem value="high-goal">💰 High Goal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full text-[#243471] lg:w-48 py-4 rounded-2xl border-0 bg-gray-100 focus:ring-2 focus:ring-[#5271FF] hover:bg-gray-200 transition-colors">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Latest First</SelectItem>
                    <SelectItem value="goal-high">Highest Goal</SelectItem>
                    <SelectItem value="goal-low">Lowest Goal</SelectItem>
                    <SelectItem value="progress">Most Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex flex-wrap gap-3">
                {quickFilters.map((filter) => (
                  <Badge
                    key={filter.id}
                    variant={filterBy === filter.id ? "default" : "secondary"}
                    className={`cursor-pointer px-4 py-2 rounded-full hover:scale-105 transition-all duration-200 ${
                      filterBy === filter.id
                        ? `${filter.color} text-white shadow-lg`
                        : "bg-gray-100 text-gray-700 hover:bg-white border border-gray-200"
                    }`}
                    onClick={() =>
                      setFilterBy(filterBy === filter.id ? "all" : filter.id)
                    }
                  >
                    {filter.label}
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                      {filterCounts[filter.id] || 0}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <p className="text-gray-600">
              {searchTerm && `"${searchTerm}" - `}
              Showing {visibleCampaigns.length} of {filteredCampaigns.length}{" "}
              campaigns
            </p>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {visibleCampaigns.map((item, index) => (
            <div key={index} className="group">
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-white rounded-3xl">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <Link href={`/aarogyadhan/fundraisers/${item.id}`}>
                      {item.frontimage ? (
                        <Image
                          src={item.frontimage || "/placeholder.svg"}
                          width={400}
                          height={240}
                          alt={item.fundraisertitle || "Fundraiser"}
                          className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#5271FF] to-[#8b5cf6] flex items-center justify-center">
                          <Heart className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                    </Link>

                    {/* Urgent Badge */}
                    {item.progress < 50 && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full font-semibold animate-pulse">
                          🚨 Urgent
                        </Badge>
                      </div>
                    )}

                    {/* Progress Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-800 px-3 py-1 rounded-full font-semibold">
                        {item.progress}%
                      </Badge>
                    </div>

                    {/* Donate Button Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <DonateDialog campaignId={item.id} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Link href={`/aarogyadhan/fundraisers/${item.id}`}>
                      <div className="mb-4 cursor-pointer">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#5271FF] transition-colors">
                          {item.fundraisertitle || "Help Save a Life"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.healthissue || "Medical Emergency"}
                        </p>
                      </div>
                    </Link>

                    {/* Progress Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-[#5271FF]">
                            ₹{item.recievedamount || "0"}
                          </span>{" "}
                          raised
                        </div>
                        <div className="text-sm text-gray-500">
                          of ₹{item.goalamount || "0"}
                        </div>
                      </div>
                      <Progress
                        value={item.progress}
                        className="h-3 bg-gray-100 rounded-full overflow-hidden"
                      />
                    </div>

                    {/* Share Button */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openShareDialog(item)}
                        className="flex-1 rounded-full border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>{" "}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {hasMoreCampaigns && (
          <div className="text-center mt-12">
            <Button
              onClick={handleViewMore}
              size="lg"
              className="bg-gradient-to-r from-[#5271FF] to-[#6366f1] hover:from-[#4460e6] hover:to-[#5b21b6] text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <ChevronDown className="w-5 h-5 mr-2" />
              Load More Campaigns
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No campaigns found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We {"couldn't"} find any campaigns matching your search. Try
              adjusting your filters or search terms.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setFilterBy("all");
              }}
              variant="outline"
              className="rounded-full px-8 py-3"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      {shareDialogOpen && currentShareData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Share This Campaign
            </h3>
            <p className="text-center mb-4">{currentShareData.shareText}</p>
            <div className="grid grid-cols-4 gap-2 justify-around items-center mb-4">
              <WhatsappShareButton
                url={currentShareData.shareUrl}
                title={currentShareData.shareText}
              >
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>
              <FacebookShareButton
                url={currentShareData.shareUrl}
                quote={currentShareData.shareText}
              >
                <FacebookIcon size={48} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={currentShareData.shareUrl}
                title={currentShareData.shareText}
              >
                <TwitterIcon size={48} round />
              </TwitterShareButton>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentShareData.shareUrl);
                  toast.success("Link copied to clipboard!");
                }}
                className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                <Copy className="w-6 h-6 text-gray-700" />
              </button>
              <TelegramShareButton
                url={currentShareData.shareUrl}
                title={currentShareData.shareText}
              >
                <TelegramIcon size={48} round />
              </TelegramShareButton>
              <EmailShareButton
                url={currentShareData.shareUrl}
                subject={currentShareData.shareText}
                body={currentShareData.shareText}
              >
                <EmailIcon size={48} round />
              </EmailShareButton>
              <LinkedinShareButton
                url={currentShareData.shareUrl}
                title={currentShareData.shareText}
              >
                <LinkedinIcon size={48} round />
              </LinkedinShareButton>
              <PinterestShareButton
                url={currentShareData.shareUrl}
                media={currentShareData.shareUrl} // Assuming you have an image URL
                description={currentShareData.shareText}
              >
                <PinterestIcon size={48} round />
              </PinterestShareButton>
            </div>
            <button
              onClick={closeShareDialog}
              className="mt-2 w-full py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundraisersClient;
