import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    const links = await db.hospitalDiagnosticCenter.findMany({
      where: { hospitalId: hospitalid },
      include: {
        diagnosticCenter: {
          include: {
            hspInfo: true,
            hspcontact: true,
          },
        },
      },
    });

    return Response.json({
      success: true,
      links,
    });

  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
