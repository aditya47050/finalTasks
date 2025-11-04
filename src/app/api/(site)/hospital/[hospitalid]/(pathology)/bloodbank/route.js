import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

export async function POST(req, { params }) {
  const session = await getSession();
  const hospitalId = params.hospitalid;

  if (!session?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const hospital = await db.hospital.findUnique({
      where: { email: session.email },
    });

    if (!hospital || hospital.id.toString() !== hospitalId.toString()) {
      return NextResponse.json({ error: "Unauthorized hospital" }, { status: 403 });
    }

    const body = await req.json();

    const bloodData = {
      bloodname: body.bloodname ?? null,
      price: body.price ?? null,
      discount: body.discount ?? null,
      finalprice: body.finalprice ?? null,
      available: body.available ?? false,
      hospitalId: hospital.id,
    };

    const bloodbank = await db.bloodbank.create({
      data: bloodData,
    });

    return NextResponse.json({ success: true, bloodbank });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}