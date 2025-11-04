"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

const popularSearches = [
  "stethoscope",
  "blood pressure monitor",
  "thermometer",
  "pulse oximeter",
  "wheelchair",
  "nebulizer",
  "surgical scissors",
  "digital scale",
]

export function SearchSuggestions({ className, placeholder = "Search for medical equipment..." }) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Fetch from API when query changes
useEffect(() => {
  const fetchSuggestions = async () => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/aarogyamart/products/search?query=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data?.products || [])
        setShowSuggestions((data?.products || []).length > 0)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setLoading(false)
    }
  }

  const debounce = setTimeout(fetchSuggestions, 300)
  return () => clearTimeout(debounce)
}, [query])


  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      router.push(`/aarogyamart/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
      setQuery("")
    }
  }

  const handleSuggestionClick = (name) => {
    handleSearch(name)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(query)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className="w-full rounded-xl pl-4 py-2.5 pr-16 border-0 transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-300 placeholder:text-white text-white"
        />
        <Button type="submit" size="sm" className="absolute right-1 top-0.5 rounded-xl px-0">
          <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center">
            <SearchIcon className="h-5 w-5 text-blue-600" />
          </div>
        </Button>
      </form>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-50 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="py-4 text-center text-gray-500 text-sm">Loading...</div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Products
              </div>
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item.name)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-200/50 flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.category.name}</div>
                  </div>
                  <SearchIcon className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="py-8 text-center text-gray-500">
              <SearchIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suggestions found</p>
              <p className="text-xs">Press Enter to search for `{query}`</p>
            </div>
          ) : null}

          {query.length === 0 && (
            <div className="py-2 border-t border-gray-50">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Popular Searches
              </div>
              {popularSearches.slice(0, 4).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full px-4 py-2 text-left hover:bg-muted/50 flex items-center justify-between group"
                >
                  <span className="text-sm">{search}</span>
                  <SearchIcon className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
