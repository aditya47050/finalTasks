"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Briefcase, TrendingUp, Users, Building } from "lucide-react"

export function HeroSection() {
  const router = useRouter()
  const [jobKeyword, setJobKeyword] = useState("")
  const [selectedLocations, setSelectedLocations] = useState([])
  const [heroJobs, setHeroJobs] = useState([])        // ✅ for /api/jobaadhar/hero
  const [uniqueJobs, setUniqueJobs] = useState([])    // ✅ for /api/jobaadhar/unique-jobs
  const [allLocations, setAllLocations] = useState([])
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const [rotationIndex, setRotationIndex] = useState(0)

  // ✅ Fetch jobs for hero section
  const fetchJobs = async (keyword = "", locations = []) => {
    try {
      const params = new URLSearchParams()
      if (keyword) params.append("keyword", keyword)
      if (locations.length > 0) params.append("locations", locations.join(","))

      const res = await fetch(`/api/jobaadhar/hero?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      if (data?.jobs) {
  setHeroJobs(data.jobs)

  const uniqueLocs = [...new Set(data.jobs.map((j) => j.location).filter(Boolean))]

  setAllLocations((prev) => {
    if (JSON.stringify(prev) !== JSON.stringify(uniqueLocs)) return uniqueLocs
    return prev
  })
}

    } catch (err) {
      console.error("Failed to fetch hero jobs:", err)
    }
  }

  // ✅ Fetch unique jobs for right-side cards
  const fetchUniqueJobs = async () => {
    try {
      const res = await fetch("/api/jobaadhar/unique-jobs")
      if (!res.ok) throw new Error("Failed to fetch unique jobs")
      const data = await res.json()
      if (data?.jobs) setUniqueJobs(data.jobs)
    } catch (err) {
      console.error("Unique job fetch error:", err)
    }
  }

useEffect(() => {
  fetchJobs(jobKeyword, selectedLocations)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [jobKeyword, JSON.stringify(selectedLocations)])

useEffect(() => { 
  fetchUniqueJobs() 
}, [])

  // ✅ Rotation animation
  useEffect(() => {
    const interval = setInterval(() => setRotationIndex((prev) => (prev + 1) % 4), 3000)
    return () => clearInterval(interval)
  }, [])

  const clockwisePositions = [0, 1, 3, 2]
  const getCardPosition = (index) => {
    const currentPositionIndex = (index + rotationIndex) % 4
    return clockwisePositions[currentPositionIndex]
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (jobKeyword) params.append("keyword", jobKeyword)
    if (selectedLocations.length > 0) params.append("locations", selectedLocations.join(","))
    router.push(`/jobaadhar/search?${params.toString()}`)
  }

  const filteredSuggestions = heroJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(jobKeyword.toLowerCase()) ||
      job.company.toLowerCase().includes(jobKeyword.toLowerCase())
  )
  const toggleLocation = (loc) => {
  setSelectedLocations((prev) =>
    prev.includes(loc)
      ? prev.filter((l) => l !== loc)
      : [...prev, loc]
  )
}

  return (
    <>
      <section className="hidden md:block z-10 relative bg-[url(https://cdn.pixabay.com/photo/2015/10/01/21/57/wallpaper-967836_960_720.png)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content column (same as before) */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit text-white bg-blue-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Over 10,000 active jobs
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Build your future with
                  <span className="text-blue-500 block">AarogyaCareers</span>
                </h1>
                <p className="text-lg text-gray-300 text-pretty max-w-2xl">
                  Explore thousands of opportunities, connect with top employers, and take the next step in your professional journey. 
                  At AarogyaCareers, your dream career begins here.
                </p>
              </div>

              {/* Search Form */}
              <Card className="p-6 bg-white backdrop-blur">
                <div className="grid md:grid-cols-3 gap-4 bg-white p-6 rounded-xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Job title or company"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={jobKeyword}
                      onChange={(e) => setJobKeyword(e.target.value)}
                    />

                    {jobKeyword && (
                      <div className="absolute top-[100%] left-0 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto mt-1">
                        {filteredSuggestions.map((job) => (
                          <div
                            key={job.id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                            onClick={() => {
                              setJobKeyword(job.title);  // update input
                              handleSearch();   
                              setLocationDropdownOpen(false);         // navigate to search page
                            }}
                          >
                            <span className="font-medium">{job.title}</span> @ {job.company}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Input */}
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                      onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    />
                    <input
                      type="text"
                      readOnly
                      placeholder="Select location"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 cursor-pointer"
                      value={selectedLocations.join(", ")}
                      onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    />
                    {locationDropdownOpen && (
                      <div className="absolute mt-1 w-full bg-white shadow-lg rounded-xl max-h-48 overflow-y-auto z-50">
                        {allLocations.map((loc) => (
                          <div
                            key={loc}
                            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm flex justify-between items-center ${
                              selectedLocations.includes(loc) ? "bg-blue-200 font-medium" : ""
                            }`}
                            onClick={() => toggleLocation(loc)}
                          >
                            {loc}
                            {selectedLocations.includes(loc) && <span>✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>12,000+ Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>800+ Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>50,000+ Candidates</span>
                </div>
              </div>
            </div>

            {/* Dynamic rotating job cards */}
            <div className="relative py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
              {uniqueJobs.slice(0, 4).map((job, index) => {
                const position = getCardPosition(index)
                const badgeColor =
                  job.workMode === "Remote"
                    ? "bg-blue-500"
                    : job.workMode === "Hybrid"
                    ? "bg-pink-500"
                    : "bg-green-500"

                return (
                  <Card
                    key={job.id}
                    className="absolute p-6 space-y-3 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-lg transition-all duration-700 ease-in-out w-[calc(50%-12px)]"
                    style={{
                      top: position === 0 || position === 1 ? "0%" : "calc(50% + 12px)",
                      left: position === 0 || position === 2 ? "0%" : "calc(50% + 12px)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-400" />
                      </div>
                    <div className="w-full max-w-[180px] sm:max-w-[220px] overflow-hidden">
                      <h3 className="font-semibold text-white truncate">{job.company}</h3>
                      <p className="text-sm text-gray-400 truncate">{job.title}</p>
                    </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${badgeColor} text-white shadow`}>
                        {job.workMode}
                      </Badge>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
          </div>
        </div>
      </section>
      <section className="block md:hidden mt-28 z-10 relative bg-[url(https://cdn.pixabay.com/photo/2015/10/01/21/57/wallpaper-967836_960_720.png)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content column (same as before) */}
            <div className="space-y-8 my-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-[10px] w-fit text-white bg-blue-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Over 10,000 active jobs
                </Badge>
                <h1 className="text-3xl font-bold text-white leading-tight">
                  Build your future with
                  <span className="text-blue-500 block">AarogyaCareers</span>
                </h1>
                <p className="text-sm text-gray-300 text-pretty max-w-2xl">
                  Explore thousands of opportunities, connect with top employers, and take the next step in your professional journey. 
                  At AarogyaCareers, your dream career begins here.
                </p>
              </div>

              {/* Search Form */}
              <Card className=" bg-white backdrop-blur">
                <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Job title or company"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={jobKeyword}
                      onChange={(e) => setJobKeyword(e.target.value)}
                    />

                    {jobKeyword && (
                      <div className="absolute top-[100%] left-0 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto mt-1">
                        {filteredSuggestions.map((job) => (
                          <div
                            key={job.id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                            onClick={() => {
                              setJobKeyword(job.title);  // update input
                              handleSearch();   
                              setLocationDropdownOpen(false);         // navigate to search page
                            }}
                          >
                            <span className="font-medium">{job.title}</span> @ {job.company}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Input */}
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                      onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    />
                    <input
                      type="text"
                      readOnly
                      placeholder="Select location"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 cursor-pointer"
                      value={selectedLocations.join(", ")}
                      onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    />
                    {locationDropdownOpen && (
                      <div className="absolute mt-1 w-full bg-white shadow-lg rounded-xl max-h-48 overflow-y-auto z-50">
                        {allLocations.map((loc) => (
                          <div
                            key={loc}
                            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm flex justify-between items-center ${
                              selectedLocations.includes(loc) ? "bg-blue-200 font-medium" : ""
                            }`}
                            onClick={() => toggleLocation(loc)}
                          >
                            {loc}
                            {selectedLocations.includes(loc) && <span>✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mx-6 mb-4">
                  <Button
                    size="lg"
                    className="w-full bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="flex flex-nowrap gap-3 text-[10px] text-gray-300">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>12,000+ Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>800+ Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>50,000+ Candidates</span>
                </div>
              </div>
            </div>

            {/* Dynamic rotating job cards */}
            <div className="hidden relative py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
              {uniqueJobs.slice(0, 4).map((job, index) => {
                const position = getCardPosition(index)
                const badgeColor =
                  job.workMode === "Remote"
                    ? "bg-blue-500"
                    : job.workMode === "Hybrid"
                    ? "bg-pink-500"
                    : "bg-green-500"

                return (
                  <Card
                    key={job.id}
                    className="absolute p-6 space-y-3 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-lg transition-all duration-700 ease-in-out w-[calc(50%-12px)]"
                    style={{
                      top: position === 0 || position === 1 ? "0%" : "calc(50% + 12px)",
                      left: position === 0 || position === 2 ? "0%" : "calc(50% + 12px)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-400" />
                      </div>
                    <div className="w-full max-w-[180px] sm:max-w-[220px] overflow-hidden">
                      <h3 className="font-semibold text-white truncate">{job.company}</h3>
                      <p className="text-sm text-gray-400 truncate">{job.title}</p>
                    </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`text-xs ${badgeColor} text-white shadow`}>
                        {job.workMode}
                      </Badge>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
          </div>
        </div>
      </section>
    </>
  )
}
