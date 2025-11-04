
import { Footer } from "./../components/footer";
import { SearchResults } from "./../components/search-results";

export default async function SearchPage({ searchParams }) {
  const query = await searchParams?.q || "";

  return (
    <div className="min-h-screen bg-background">
      <main>
        <SearchResults query={query} />
      </main>
      <Footer />
    </div>
  );
}
