import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const hospitalId = params.hospitalId;

  try {
    const services = await prisma.homeHealthcare.findMany({
      where: { hospitalId },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
