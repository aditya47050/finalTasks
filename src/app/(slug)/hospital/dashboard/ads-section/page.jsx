import { getSession } from '@/lib/getsession';
import AdRequestsManager from './../components/ad-requests-manager';
import { db } from '@/lib/db';

export default async function Page() {
  try {
    const session = await getSession();

    // ✅ Check if session exists
    if (!session?.email || !session?.role) {
      return (
        <main className="p-6 text-red-500">
          <p>No active session found. Please log in to continue.</p>
        </main>
      );
    }

    // ✅ Query hospital user
    const user = await db.Hospital.findUnique({
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

    // ✅ Handle missing user
    if (!user) {
      return (
        <main className="p-6 text-red-500">
          <p>User not found or unauthorized.</p>
        </main>
      );
    }

    // ✅ Render page successfully
    return (
      <main className="p-6">
        <AdRequestsManager user={user} />
      </main>
    );
  } catch (error) {
    console.error('Error loading Hospital Ad Requests page:', error);

    // ✅ Graceful error message for unknown issues
    return (
      <main className="p-6 text-red-500">
        <p>Something went wrong while loading the page.</p>
      </main>
    );
  }
}
