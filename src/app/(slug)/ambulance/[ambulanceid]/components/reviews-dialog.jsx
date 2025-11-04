"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function ReviewsDialog({ ambulanceid, patientId }) {
  const [open, setOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch reviews when dialog opens
  useEffect(() => {
    if (!open) return
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/ambulance/${ambulanceid}/review`)
        const data = await res.json()
        setReviews(data)
      } catch (err) {
        console.error("Failed to load reviews", err)
      }
    }
    fetchReviews()
  }, [open, ambulanceid])

  const submitReview = async () => {
    if (!rating) return alert("Please select a rating")
    try {
      setLoading(true)
      const res = await fetch(`/api/ambulance/${ambulanceid}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, rating, comment }),
      })
      if (!res.ok) throw new Error("Failed to submit review")
      const newReview = await res.json()
      setReviews((prev) => [newReview, ...prev])
      setRating(0)
      setComment("")
    } catch (err) {
      console.error(err)
      alert("❌ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Star className="text-blue-500 md:h-6 md:w-6 h-5 w-5 cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center">Reviews</DialogTitle>
        </DialogHeader>

        {/* 🧾 List Reviews (Optional - uncomment if needed)
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.id} className="border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < r.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">
                    by {r.patient?.name || "Anonymous"}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-700">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          )}
        </div>
        */}

        {/* ✏️ Show review form only if patientId exists */}
        {patientId ? (
          <div className="mt-4">
            <p className="font-medium mb-2">Write a review</p>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full h-24 p-2 border rounded-xl"
            />
            <Button
              onClick={submitReview}
              disabled={loading}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-600 text-white rounded-xl"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 mt-3">
            You must be logged in as a patient to write a review.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
