import { db } from "@/lib/db";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { consultationDays, consultationTime } = await req.json();
    const updated = await db.hospitalDoctor.update({
      where: { id },
      data: {
        consultationDays,
        consultationTime,
      },
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}