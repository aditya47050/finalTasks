import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // adjust path to your Prisma client

export async function GET() {
  try {
    // Fetch all job categories with companies count
    const categories = await db.jobCategory.findMany({
      include: {
        companies: true, // include companies array
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data for frontend
    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      companies: cat.companies || [],
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching job categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch job categories" },
      { status: 500 }
    );
  }
}
