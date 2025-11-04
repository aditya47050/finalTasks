export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobList } from './../components/job-list';
import { getSession } from '@/lib/getsession';
import { db } from "@/lib/db";
export default async function JobViewsPage() {
  try {
    const session = await getSession();
    if (!session?.id) {
      throw new Error("User not logged in");
    }

    // Fetch employer with related company + documents
    const employer = await db.employer.findUnique({
      where: { userId: session.id },
      include: {
        company: {
          include: {
            jobs: true,
            category: true,
            reviews: true,
            employers: true,
          },
        },
        documents: true,
      },
    });
    if (!employer) {
      throw new Error("Employer not found");
    }
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-blue-500 text-center">Job Listings</CardTitle>
          <CardDescription className="text-blue-500 text-center">Manage all your posted job opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <JobList employer={employer}/>
        </CardContent>
      </Card>
    </div>
  )
  } catch (error) {
    console.error("ProfilePage error:", error);
    return (
      <div className="flex items-center justify-center h-40 text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );
  }
}
