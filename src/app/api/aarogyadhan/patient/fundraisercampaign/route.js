import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your prisma client

import { getSession } from "@/lib/getsession";

// POST route to create a fundraising campaign
export async function POST(req) {
  try {
    const uniqueCardNumber = await generateUniqueCardNumber();
    const formData = await req.formData();

    const fundraisertitle = formData.get("fundraisertitle");
    const description = formData.get("description");
    const story = formData.get("story");
    const healthissue = formData.get("healthissue");
    const goalamount = formData.get("goalamount");
    const frontimage = formData.get("frontimage");
    const medicaldoc1 = formData.get("medicaldoc1");
    const medicaldoc2 = formData.get("medicaldoc2");
    const medicaldoc3 = formData.get("medicaldoc3");

    const session = await getSession();

    if (!session || !session.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const requiredFields = [fundraisertitle, description, goalamount];
    if (requiredFields.some((field) => !field)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const patient = await db.patient.findUnique({
      where: { email: session.email },
    });
    const patientId = patient.id;

    let fundraiser = await db.fundraiser.findFirst({
      where: { patientId },
    });

    if (!fundraiser) {
      fundraiser = await db.fundraiser.create({
        data: { patientId },
      });
    }

    const campaign = await db.fundraisingCampaign.create({
      data: {
        fundraisertitle,
        description,
        story,
        healthissue,
        goalamount,
        frontimage,
        medicaldoc1,
        medicaldoc2,
        medicaldoc3,
        fundraiserId: fundraiser.id,
        status: "PENDING",
        campaignid: uniqueCardNumber,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Fundraising campaign created successfully.",
        data: campaign,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Fundraising POST error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the campaign.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
async function generateUniqueCardNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear().toString().slice(-2)}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  let uniqueNumber;
  let isUnique = false;

  while (!isUnique) {
    uniqueNumber =
      "ADC" + datePart + Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    const existingCard = await db.HealthCard.findFirst({
      where: { cardNo: uniqueNumber },
    });

    if (!existingCard) {
      isUnique = true;
    }
  }

  return uniqueNumber;
}
