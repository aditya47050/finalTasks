
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import  ShortlistCandidateList  from './../components/shortlist-candidate-list';
import { getSession } from "@/lib/getsession";
import { notFound } from "next/navigation";
import { db } from '@/lib/db';
export default async function ShortlistPage() {
  try {
      // Fetch session
      const session = await getSession();
  
      if (!session) {
        // If no session, redirect to login or show 404
        return notFound();
      }
      // Optional: you can fetch user/employer data here if needed
      const employer = await db.Employer.findUnique({ where: { userId: session.id } });
      const employerId = employer.id;
  
      return (
        <div className="flex flex-col items-center justify-center">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-blue-500 text-center">Shortlisted Candidates</CardTitle>
          <CardDescription className="text-blue-500 text-center">Manage candidates who have been shortlisted for various positions.</CardDescription>
        </CardHeader>
        <CardContent>
          <ShortlistCandidateList employerId={employerId}/>
        </CardContent>
      </Card>
    </div>
      );
    } catch (error) {
      console.error("Error fetching session or data:", error);
      return (
        <div className="text-center py-8 text-red-500">
          Failed to load applications. Please try again later.
        </div>
      );
    }
}
