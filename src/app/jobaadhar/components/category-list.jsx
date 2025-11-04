"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CompaniesCategoryPage({ companies, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [page, setPage] = useState(1)
  const perPage = 6

  // --- Generate dynamic filters from company data ---
  const dynamicFilters = useMemo(() => {
    const filters = {}

    // Tags
    const allTags = companies.flatMap(c => c.tags?.map(t => t.tag?.name) || [])
    if (allTags.length) filters["Tags"] = Array.from(new Set(allTags))

    // Cities
    const allCities = companies.map(c => c.city).filter(Boolean)
    if (allCities.length) filters["City"] = Array.from(new Set(allCities))

    // States
    const allStates = companies.map(c => c.state).filter(Boolean)
    if (allStates.length) filters["State"] = Array.from(new Set(allStates))

    // Countries
    const allCountries = companies.map(c => c.country).filter(Boolean)
    if (allCountries.length) filters["Country"] = Array.from(new Set(allCountries))

    // Districts
    const allDistricts = companies.map(c => c.district).filter(Boolean)
    if (allDistricts.length) filters["District"] = Array.from(new Set(allDistricts))

    // Founded years
    const allFounded = companies.map(c => c.founded).filter(Boolean)
    if (allFounded.length) filters["Founded"] = Array.from(new Set(allFounded)).sort((a, b) => b - a)

    return filters
  }, [companies])

  // --- Handle filter selection ---
  const handleFilterChange = (title, item) => {
    setSelectedFilters(prev => {
      const current = prev[title] || []
      const next = current.includes(item) ? current.filter(i => i !== item) : [...current, item]
      return { ...prev, [title]: next }
    })
    setPage(1)
  }

  // --- Filter companies based on selected category & filters ---
  const filteredCompanies = useMemo(() => {
    let temp = selectedCategory
      ? companies.filter(c => c.category?.name === selectedCategory)
      : companies

    Object.entries(selectedFilters).forEach(([title, selectedItems]) => {
      if (!selectedItems.length) return
      temp = temp.filter(c => {
        if (title === "Tags") return c.tags?.some(t => selectedItems.includes(t.tag?.name))
        if (title === "City") return selectedItems.includes(c.city)
        if (title === "State") return selectedItems.includes(c.state)
        if (title === "Country") return selectedItems.includes(c.country)
        if (title === "District") return selectedItems.includes(c.district)
        if (title === "Founded") return selectedItems.includes(c.founded)
        return true
      })
    })

    return temp
  }, [companies, selectedCategory, selectedFilters])

  const totalPages = Math.ceil(filteredCompanies.length / perPage)
  const paginatedCompanies = filteredCompanies.slice((page - 1) * perPage, page * perPage)

  // --- Clear all filters ---
  const clearAll = () => {
    setSelectedFilters({})
    setSelectedCategory(null)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT SIDEBAR */}
        <aside className="space-y-10 col-span-1">
          <h2 className="font-semibold text-lg text-gray-700 mb-4">Filters</h2>
          {Object.entries(dynamicFilters).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-medium text-sm text-gray-600 mb-2">{title}</h3>
              <ul className="space-y-1 text-sm text-gray-500">
                {items.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters[title]?.includes(item) || false}
                      onChange={() => handleFilterChange(title, item)}
                      className="h-4 w-4 rounded border-gray-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-4" onClick={clearAll}>
            Clear All Filters
          </Button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCategory ? `${selectedCategory} Companies` : "All Companies"}
            </h2>
            <p className="text-gray-500 text-sm">
              Showing {paginatedCompanies.length} / {filteredCompanies.length} companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCompanies.map(company => (
              <Card key={company.id} className="p-6 flex flex-col justify-between border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-auto bg-blue-100 flex items-center justify-center rounded-xl overflow-hidden">
                    <Image
                      src={company.logoUrl || "/placeholder.svg"}
                      alt={company.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Founded: {company.founded} | {company.reviews?.length ?? 0} Reviews
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {company.tags?.slice(0,1).map(t => (
                        <Badge key={t.id} className="text-[10px] whitespace-nowrap bg-gray-200 hover:bg-gray-300">{t.tag?.name}</Badge>
                      ))}
                      {company.tags.length > 2 && (
                        <Badge className="bg-gray-100 text-gray-600">
                          +{company.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                <Button asChild className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                  <Link href={`/jobaadhar/companies/${company.id}`}>View Details</Link>
                </Button>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button disabled={page === 1} variant="outline" onClick={() => setPage(page - 1)}>Prev</Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button disabled={page === totalPages} variant="outline" onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}

          {filteredCompanies.length === 0 && (
            <p className="text-center text-gray-500 mt-6">No companies found.</p>
          )}
        </main>

        {/* CATEGORY SIDEBAR */}
        <aside className="col-span-1 space-y-6">
          <h2 className="font-semibold text-lg text-gray-700 mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name)
                  setSelectedFilters({})
                  setPage(1)
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs transition ${
                  selectedCategory === cat.name
                    ? "border-blue-500 bg-blue-50 text-blue-600 font-medium"
                    : "border-gray-200 hover:bg-gray-100 text-gray-600"
                }`}
              >
                <span>{cat.name} <span className="text-gray-400">({cat._count?.companies || 0})</span></span>
              </button>
            ))}
            {selectedCategory && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Category
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
