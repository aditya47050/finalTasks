import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // ✅ this is the id from the URL path

    const formData = await req.formData();
    const title = formData.get("title");
    const type = formData.get("type");
    const row = parseInt(formData.get("row"));
    const column = parseInt(formData.get("column"));
    const position = parseInt(formData.get("position"));
    const backgroundImage = formData.get("backgroundImage");
    const filterIds = formData.getAll("filterIds[]");

    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    const section = await db.homeSection.update({
      where: { id },
      data: { title, type, row, column, position, backgroundImage, filterIds },
    });

    return NextResponse.json({ success: true, section });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    await db.homeSection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

