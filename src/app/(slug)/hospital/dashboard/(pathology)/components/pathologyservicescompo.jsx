"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Plus, TestTube, Package, Droplets, Stethoscope, Heart, Activity } from "lucide-react"

import AddLabTests from "./addlabtests"
import AddPackages from "./addpackages"
import AddBlood from "./addblood"


const PathologyServicesComponent = ({
  hospitalId,
  initialLabTests = [],
  initialWellnessPackages = [],
  initialBloodBank = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")

  const filteredLabTests = useMemo(() => {
    return initialLabTests.filter((test) => {
      const matchesSearch = test.testname?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && test.available) ||
        (availabilityFilter === "unavailable" && !test.available)
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "low" && test.finalprice <= 500) ||
        (priceFilter === "medium" && test.finalprice > 500 && test.finalprice <= 2000) ||
        (priceFilter === "high" && test.finalprice > 2000)

      return matchesSearch && matchesAvailability && matchesPrice
    })
  }, [initialLabTests, searchTerm, availabilityFilter, priceFilter])

  const filteredWellnessPackages = useMemo(() => {
    return initialWellnessPackages.filter((pkg) => {
      const matchesSearch =
        pkg.labpackagename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.aapackagename?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && pkg.available) ||
        (availabilityFilter === "unavailable" && !pkg.available)
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "low" && pkg.finalpackageprice <= 1000) ||
        (priceFilter === "medium" && pkg.finalpackageprice > 1000 && pkg.finalpackageprice <= 5000) ||
        (priceFilter === "high" && pkg.finalpackageprice > 5000)

      return matchesSearch && matchesAvailability && matchesPrice
    })
  }, [initialWellnessPackages, searchTerm, availabilityFilter, priceFilter])

  const filteredBloodBank = useMemo(() => {
    return initialBloodBank.filter((blood) => {
      const matchesSearch = blood.bloodname?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && blood.available) ||
        (availabilityFilter === "unavailable" && !blood.available)
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "low" && blood.finalprice <= 1000) ||
        (priceFilter === "medium" && blood.finalprice > 1000 && blood.finalprice <= 3000) ||
        (priceFilter === "high" && blood.finalprice > 3000)

      return matchesSearch && matchesAvailability && matchesPrice
    })
  }, [initialBloodBank, searchTerm, availabilityFilter, priceFilter])

  const formatPrice = (price) => {
    if (!price) return "N/A"
    return `₹${(price / 100).toFixed(2)}`
  }

  const ServiceCard = ({ item, type }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            {type === "labtest" && <TestTube className="w-5 h-5 text-emerald-600" />}
            {type === "wellness" && <Heart className="w-5 h-5 text-rose-600" />}
            {type === "bloodbank" && <Droplets className="w-5 h-5 text-red-600" />}
            {type === "labtest" && item.testname}
            {type === "wellness" && (item.labpackagename || item.aapackagename)}
            {type === "bloodbank" && item.bloodname}
          </CardTitle>
          <Badge
            variant={item.available ? "default" : "secondary"}
            className={item.available ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : ""}
          >
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
        {type === "wellness" && item.includestest && (
          <CardDescription className="text-sm text-slate-600 bg-blue-50 p-2 rounded-md">
            <Package className="w-4 h-4 inline mr-1" />
            Includes: {item.includestest}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
            <span className="text-sm text-slate-600">Original Price:</span>
            <span className="text-sm line-through text-slate-500">{formatPrice(item.aaprice || item.price)}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-md">
            <span className="text-sm font-medium text-emerald-800">Final Price:</span>
            <span className="text-xl font-bold text-emerald-700">
              {formatPrice(item.finalprice || item.finalpackageprice)}
            </span>
          </div>
          {item.discount && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Discount:</span>
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                {item.discount}
              </Badge>
            </div>
          )}
          {type === "wellness" && item.homevisit && (
            <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
              <Stethoscope className="w-3 h-3 mr-1" />
              Home Visit Available
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-slate-50 to-emerald-50/20 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-600" />
            Pathology Services
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Comprehensive healthcare services management dashboard</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <AddLabTests hospitalId={hospitalId} />
          <AddPackages hospitalId={hospitalId} />
          <AddBlood hospitalId={hospitalId} />
        </div>
      </div>

      <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Filter className="w-5 h-5 text-emerald-600" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-emerald-500" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              />
            </div>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="unavailable">Unavailable Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400">
                <SelectValue placeholder="Filter by price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Low (Under ₹500)</SelectItem>
                <SelectItem value="medium">Medium (₹500 - ₹2000)</SelectItem>
                <SelectItem value="high">High (Above ₹2000)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="labtests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-emerald-200">
          <TabsTrigger
            value="labtests"
            className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
          >
            <TestTube className="w-4 h-4" />
            Lab Tests ({filteredLabTests.length})
          </TabsTrigger>
          <TabsTrigger
            value="wellness"
            className="flex items-center gap-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
          >
            <Heart className="w-4 h-4" />
            Wellness Packages ({filteredWellnessPackages.length})
          </TabsTrigger>
          <TabsTrigger
            value="bloodbank"
            className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
          >
            <Droplets className="w-4 h-4" />
            Blood Bank ({filteredBloodBank.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="labtests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabTests.length > 0 ? (
              filteredLabTests.map((test) => <ServiceCard key={test.id} item={test} type="labtest" />)
            ) : (
              <div className="col-span-full text-center py-12">
                <TestTube className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No lab tests found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or add new lab tests.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWellnessPackages.length > 0 ? (
              filteredWellnessPackages.map((pkg) => <ServiceCard key={pkg.id} item={pkg} type="wellness" />)
            ) : (
              <div className="col-span-full text-center py-12">
                <Heart className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No wellness packages found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or add new wellness packages.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bloodbank" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBloodBank.length > 0 ? (
              filteredBloodBank.map((blood) => <ServiceCard key={blood.id} item={blood} type="bloodbank" />)
            ) : (
              <div className="col-span-full text-center py-12">
                <Droplets className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No blood bank services found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or add new blood bank services.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PathologyServicesComponent