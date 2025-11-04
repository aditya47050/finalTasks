import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust if your db client is elsewhere
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { campaignId, photographerId } = body;

    if (!campaignId || !photographerId) {
      return NextResponse.json(
        { message: "Missing campaignId or photographerId" },
        { status: 400 }
      );
    }

    // Optional: Validate existence
    const campaign = await db.fundraisingCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }

    const photographer = await db.photographer.findUnique({
      where: { id: photographerId },
    });

    if (!photographer) {
      return NextResponse.json(
        { message: "Photographer not found" },
        { status: 404 }
      );
    }

    // Update campaign with photographer assignment and status
    await db.fundraisingCampaign.update({
      where: { id: campaignId },
      data: {
        photographer: {
          connect: { id: photographerId },
        },
        assignmentStatus: "ASSIGNED",
        photographerDecision: "PENDING",
      },
    });

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to photographer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: photographer.email,
      subject: "New Campaign Assignment",
      text: `You have been assigned to a new campaign: ${campaign.fundraisertitle}. Please accept the assignment within 24 hours.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Photographer assigned successfully" });
  } catch (error) {
    console.error("Assign Photographer API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
