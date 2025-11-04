import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET items by type (category, brand, product, discount)
export async function GET(req) {
  const { type } = Object.fromEntries(req.nextUrl.searchParams);
  try {
    if (!type) return NextResponse.json({ success: false, error: "Type required" }, { status: 400 });

    let items = [];

    if (type === "category") {
      items = await db.category.findMany({ orderBy: { createdAt: "desc" } });
    } else if (type === "brand") {
      items = await db.brand.findMany({ orderBy: { createdAt: "desc" } });
    } else if (type === "product") {
      items = await db.productMart.findMany({ orderBy: { createdAt: "desc" }, include: { category: true, brand: true } });
    } else if (type === "discount") {
      items = await db.productMart.findMany({
        where: { discount: { gt: 0 } },
        orderBy: { discount: "desc" },
        include: { category: true, brand: true },
      });
    }

    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST create new section
export async function POST(req) {
  try {
    const data = await req.formData(); // ✅ get FormData
    const title = data.get("title");
    const type = data.get("type");
    const row = Number(data.get("row"));
    const column = Number(data.get("column"));
    const position = Number(data.get("position"));
    const backgroundImage = data.get("backgroundImage");
    const filterIds = data.getAll("filterIds[]"); // array

    if (!title || !type || !row || !column || position === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const section = await db.homeSection.create({
      data: {
        title,
        type,
        row,
        column,
        position,
        filterIds: filterIds || [],
        backgroundImage: backgroundImage || null,
      },
    });

    return NextResponse.json({ success: true, section });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

