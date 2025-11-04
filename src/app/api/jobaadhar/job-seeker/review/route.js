import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"

export async function POST(req) {
  try {
    const session = await getSession()
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const body = await req.json()
    const { companyId, rating, content } = body

    if (!companyId || !rating) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })
    }

    // Fetch the JobSeeker profile
    const jobSeeker = await db.jobSeeker.findUnique({
      where: { userId: session.id },
    })

    if (!jobSeeker) {
      return new Response(JSON.stringify({ error: "Only job seekers can add reviews" }), { status: 403 })
    }

    const review = await db.jObReview.create({
      data: {
        companyId,
        jobSeekerId: jobSeeker.id,
        rating,
        content,
      },
    })

    return new Response(JSON.stringify({ review }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
