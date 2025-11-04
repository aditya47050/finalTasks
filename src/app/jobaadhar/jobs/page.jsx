import { db } from "@/lib/db"
import JobsPageClient from './../components/JobsPageClient';

// Server component
export default async function JobsPage() {
  // Fetch all jobs with company info and skills
  const jobs = await db.job.findMany({
    where: { status: "active" },
    include: {
      company: {
        include : {tags: { 
          include: { tag: true } // include actual tag info
        }, 
      },
      },
      skills: {
        include:{
          skill:true,
        }
      },      // SkillOnJob relation
      applications: true, // Optional, if you need
    },
    orderBy: { postedAt: "desc" }, // latest jobs first
  })

  // Fetch trending companies (for example: top rated or most reviewed)
  const trendingCompanies = await db.company.findMany({
    include: { 
      tags: { 
        include: { 
          tag: true 
        }, // include actual tag info
      }, 
      reviews: true },
    take: 5,
  })

  // Pass data to client component for interactivity (like selecting jobs)
  return <JobsPageClient jobs={jobs} trendingCompanies={trendingCompanies} />
}
