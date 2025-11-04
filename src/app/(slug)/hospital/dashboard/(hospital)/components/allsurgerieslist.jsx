"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, List, LayoutGrid, DollarSign, IndianRupeeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";



export default function AllSurgeriesList({ surgeries = [], hospitalId }) {
  const [filteredSurgeries, setFilteredSurgeries] = useState(surgeries)
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState("grid")

  // Search and filter surgeries
  useEffect(() => {
    let filtered = surgeries
    if (searchTerm) {
      filtered = filtered.filter(
        (surgery) =>
          surgery.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          surgery.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          surgery.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    setFilteredSurgeries(filtered)
  }, [searchTerm, surgeries])

  const formatPriceRange = (minPrice, maxPrice) => {
    return `${minPrice} - ${maxPrice}`
  }

  return (
    <div className="mx-auto p-4 md:p-8 space-y-6">


      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search surgeries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <Tabs defaultValue="grid" className="w-full sm:w-[180px]" onValueChange={setView}>
            <TabsList className="w-full flex flex-wrap">
              <TabsTrigger value="grid" className="flex-1">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="flex-1">
                <List className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Surgeries List */}
      {filteredSurgeries.length > 0 ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSurgeries.map((surgery) => (
                <Card
                  key={surgery.id}
                  className="p-4 border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold leading-tight">{surgery.serviceName}</CardTitle>
                      <Badge variant={surgery.isAvailable ? "default" : "secondary"} className="ml-2 shrink-0">
                        {surgery.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{surgery.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{surgery.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price Range:</span>
                        <div className="flex items-center gap-1">
                          <IndianRupeeIcon className="h-3 w-3" />
                          <span className="font-medium">{formatPriceRange(surgery.minPrice, surgery.maxPrice)}</span>
                        </div>
                      </div>
                      <Link href={`/hospital/dashboard/surgery/${surgery.id}`}>
                        <Button
                          variant="default"
                          className="mt-3 w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-colors"
                        >
                          View Bookings
                          <ArrowRight size={16} />
                        </Button></Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSurgeries.map((surgery) => (
                <Card key={surgery.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{surgery.serviceName}</h3>
                        <Badge variant={surgery.isAvailable ? "default" : "secondary"}>
                          {surgery.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                        <span>
                          Category: <span className="font-medium text-foreground">{surgery.category}</span>
                        </span>
                        <span>
                          Type: <span className="font-medium text-foreground">{surgery.type}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-semibold">
                      <IndianRupeeIcon className="h-4 w-4" />
                      {formatPriceRange(surgery.minPrice, surgery.maxPrice)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No surgeries found.</p>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search terms or clear the search to see all surgeries.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
