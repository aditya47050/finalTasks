import { db } from "@/lib/db";
import CompaniesCategoryPage from "./../components/category-list";

// This is a **server component** in Next.js 13+ App Router
export default async function CompaniesCategoryPageWrapper() {
  try {
    // Fetch all companies with their category and tags
    const companies = await db.company.findMany({
      include: {
        category: true,          // JobCategory relation
        tags: { 
          include: { tag: true } // include actual tag info
        },             // TagOnCompany relation
        reviews : true,
      },
    });

    // Fetch categories with the count of companies
    const categories = await db.jobCategory.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { companies: true } },
      },
    });

    // Pass the fetched data to the client component
    return <CompaniesCategoryPage companies={companies} categories={categories} />;
  } catch (error) {
    console.error("Failed to fetch companies or categories:", error);
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load companies or categories. Please try again later.
      </div>
    );
  }
}
