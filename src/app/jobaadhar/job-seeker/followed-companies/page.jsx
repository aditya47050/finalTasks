import React from 'react';
import FollowedCompaniesPage from '../../components/FollowedCompaniesPage';
import { getSession } from "@/lib/getsession";

const page = async () => {
  try {
    const session = await getSession();

    if (!session) {
      return (
        <main className="container mx-auto px-4 py-10">
          <p className="text-center text-gray-500">Please login to view your profile.</p>
        </main>
      );
    }

    return <FollowedCompaniesPage userId={session.id} />;
  } catch (error) {
    console.error("Error fetching session in FollowedCompaniesPage:", error);
    return (
      <main className="container mx-auto px-4 py-10">
        <p className="text-center text-red-500">Something went wrong. Please try again later.</p>
      </main>
    );
  }
};

export default page;
