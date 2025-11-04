import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth"; // <-- your next-auth config file
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  // Use getServerSession for server-side
  const session = await getServerSession(authOptions);

  // Optional: Fallback if session is unavailable
  const user = session
    ? await db.user.findUnique({ where: { id: session.user.id } })
    : await db.user.findFirst({ where: { role: "ADMIN" } }); // Default email target

  try {
    const campaigns = await db.fundraisingCampaign.findMany({
      where: {
        assignmentStatus: "ASSIGNED",
        photographerDecision: "PENDING" /*  */,
        updatedAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!campaigns.length) {
      return NextResponse.json({ message: "No campaigns to unassign." });
    }

    // Unassign campaigns
    for (const campaign of campaigns) {
      await db.fundraisingCampaign.update({
        where: { id: campaign.id },
        data: {
          photographerId: null,
          assignmentStatus: "UNASSIGNED",
        },
      });
    }

    // Compose email body
    const campaignSummary = campaigns
      .map(
        (c, i) =>
          `${i + 1}. Title: ${c.fundraisertitle}\n   Updated At: ${c.updatedAt}`
      )
      .join("\n\n");

    const emailText = `
Hello,

The following campaigns have been automatically unassigned due to no response from the photographer within 24 hours:

${campaignSummary}

Total unassigned: ${campaigns.length}

Regards,
Your System
`;

    // Send email
    if (user?.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Unassigned Photographer Campaign Summary",
        text: emailText,
      });
    }

    return NextResponse.json({
      message: "Unassigned campaigns processed and summary email sent",
      totalUnassigned: campaigns.length,
      campaigns,
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
