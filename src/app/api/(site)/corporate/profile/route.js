import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const db = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    const email = body.userEmail;
    if (!email) {
      return NextResponse.json({ error: "userEmail is required" }, { status: 400 });
    }

    // Ensure a Corporate row exists; create a minimal one if missing
    let corp = await db.corporate.findUnique({ where: { email }, select: { id: true } });
    if (!corp) {
      // Minimal required fields from your schema
      if (!body.companyName) {
        return NextResponse.json({ error: "companyName is required for first-time profile save" }, { status: 400 });
      }
      // If mobile missing, initialize to empty; you can enforce it if you want
      const created = await db.corporate.create({
        data: {
          email,
          mobile: body.mobile || "",
          companyName: body.companyName,
          password: randomUUID(), // generated placeholder
        },
        select: { id: true },
      });
      corp = created;
    }

    const update = await db.corporate.update({
      where: { email },
      data: {
        mobile: body.mobile ?? undefined,
        companyName: body.companyName ?? undefined,
        additionalEmail: body.additionalEmail ?? undefined,
        emergencyContact: body.emergencyContact ?? undefined,
        dateOfIncorporation: body.dateOfIncorporation ? new Date(body.dateOfIncorporation) : undefined,
        cinNumber: body.cinNumber ?? undefined,
        companyType: body.companyType ?? undefined,
        companyServiceTypes: Array.isArray(body.companyServiceTypes) ? body.companyServiceTypes : undefined,
        companyPan: body.companyPan ?? undefined,
        gstNumber: body.gstNumber ?? undefined,
        presentAddress: body.presentAddress ?? undefined,
        city: body.city ?? undefined,
        state: body.state ?? undefined,
        district: body.district ?? undefined,
        taluka: body.taluka ?? undefined,
        pincode: body.pincode ?? undefined,
        companyLogo: body.companyLogo ?? undefined,
        bankName: body.bankName ?? undefined,
        bankAccountNumber: body.bankAccountNumber ?? undefined,
        ifscCode: body.ifscCode ?? undefined,
        accountType: body.accountType ?? undefined,
        cancelledCheque: body.cancelledCheque ?? undefined,
        employeeCount: body.employeeCount ? parseInt(body.employeeCount, 10) : undefined,
        corporateHealthInsurance: typeof body.corporateHealthInsurance === "boolean" ? body.corporateHealthInsurance : undefined,
        healthInsurancePartners: Array.isArray(body.healthInsurancePartners) ? body.healthInsurancePartners : undefined,
        factoryInspector: typeof body.factoryInspector === "boolean" ? body.factoryInspector : undefined,
        contactPersonName: body.contactPersonName ?? undefined,
        contactPersonRelation: body.contactPersonRelation ?? undefined,
        employeeIdCard: body.employeeIdCard ?? undefined,
        aadharCardNumber: body.aadharCardNumber ?? undefined,
        aadharCardFront: body.aadharCardFront ?? undefined,
        aadharCardBack: body.aadharCardBack ?? undefined,
        panCard: body.panCard ?? undefined,
        mobileVerified: typeof body.mobileVerified === "boolean" ? body.mobileVerified : undefined,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, corporate: update }, { status: 200 });
  } catch (err) {
    console.error("Corporate profile save error:", err);
    return NextResponse.json({ error: err?.message || "Failed to save" }, { status: 500 });
  }
}