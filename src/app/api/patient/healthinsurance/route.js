import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { provider, policyNumber, document, coverage, copay, patientId } = await req.json();
    if (!provider || !policyNumber || !patientId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const insurance = await db.userHealthInsurance.create({
      data: {
        provider,
        policyNumber,
        document,
        coverage,
        copay,
        patient: { connect: { id: patientId } },
      },
    });
    return new Response(JSON.stringify(insurance), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}