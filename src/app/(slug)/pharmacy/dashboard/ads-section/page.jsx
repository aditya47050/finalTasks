import { getSession } from '@/lib/getsession';
import { db } from '@/lib/db';
import AdRequestsManager from './../component/ad-requests-manager';

export default async function Page() {
  try {
    const session = await getSession();

    if (!session?.email) {
      return (
        <main className="p-6 text-red-500">
          <p>No active session found. Please log in to continue.</p>
        </main>
      );
    }

    const user = await db.Pharmacy.findUnique({
      where: {
        email: session.email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return (
        <main className="p-6 text-red-500">
          <p>User not found in database.</p>
        </main>
      );
    }

    return (
      <main className="p-6">
        <AdRequestsManager user={user} />
      </main>
    );
  } catch (error) {
    console.error('Error loading AdRequests page:', error);

    return (
      <main className="p-6 text-red-500">
        <p>Something went wrong while loading the page.</p>
      </main>
    );
  }
}
