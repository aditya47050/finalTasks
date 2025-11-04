import AdRequestsManager from './../../components/ad-requests-manager';
import { getSession } from '@/lib/getsession';

export default async function Page() {
  try {
    const session = await getSession();

    // ✅ Successfully loaded
    return (
      <main className="p-6">
        <AdRequestsManager user={session} />
      </main>
    );
  } catch (error) {
    console.error('Error loading Ad Requests page:', error);

    // ✅ Graceful fallback for unexpected errors
    return (
      <main className="p-6 text-red-500">
        <p>Something went wrong while loading the page.</p>
      </main>
    );
  }
}
