import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import SavedPost from "./../../components/SavedPost";

const SavedJobsPage = async () => {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("No active session found");
    }

    const seeker = await db.jobSeeker.findUnique({
      where: {
        userId: session.id,
      },
      select: {
        id: true,
      },
    });

    if (!seeker) {
      throw new Error("Job seeker not found");
    }

    return <SavedPost seekerId={seeker.id} />;
  } catch (error) {
    console.error("Error loading saved jobs:", error);
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
        <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p>{error.message || "Unable to load saved jobs right now."}</p>
      </div>
    );
  }
};

export default SavedJobsPage;
