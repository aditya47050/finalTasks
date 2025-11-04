import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import Jobviewsingle from './../../components/jobviewsingle'
import { getSession } from '@/lib/getsession'

export default async function SingleJobDetail({ params }) {
  try {
    const { jobId } = params
    const session = await getSession()

    if (!session) {
      // Redirect to login if not logged in
      return redirect("/jobaadhar/job-seeker/login")
    }

    const seeker = await db.JobSeeker.findUnique({
      where: {
        userId: session.id,
      },
      select: {
        id: true,
      },
    })

    const job = await db.job.findUnique({
  where: { id: jobId },
  include: {
    company: {
      include: {
        tags: true,
        ratings: true,
        category : true,
      },
    },
    skills: {
      include: {
        skill: true, // 👈 bring full Skill instead of just skillId
      },
    },
    applications: true,
  },
})


    if (!job) return notFound()

    return <Jobviewsingle job={job} seekerId={seeker?.id} />
  } catch (error) {
    return redirect("/jobaadhar/job-seeker/login")
  }
}
