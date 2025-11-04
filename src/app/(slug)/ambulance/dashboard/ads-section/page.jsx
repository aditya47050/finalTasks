import { getSession } from '@/lib/getsession';
import AdRequestsManager from '../components/ad-requests-manager';
import { db } from '@/lib/db';

export default async function Page() {
  try {
    const session = await getSession();

    // Handle missing or invalid session
    if (!session?.email || !session?.role) {
      return (
        <main className="p-6 text-red-500">
          <p>No active session found. Please log in to continue.</p>
        </main>
      );
    }

    // Fetch ambulance user details
    const user = await db.Ambulance.findUnique({
      where: {
        email: session.email,
        role: session.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Handle user not found
    if (!user) {
      return (
        <main className="p-6 text-red-500">
          <p>User not found or unauthorized.</p>
        </main>
      );
    }

    // Success: render page
    return (
      <main className="p-6">
        <AdRequestsManager user={user} />
      </main>
    );
  } catch (error) {
    console.error('Error loading Ambulance AdRequests page:', error);
    return (
      <main className="p-6 text-red-500">
        <p>Something went wrong while loading this page.</p>
      </main>
    );
  }
}
