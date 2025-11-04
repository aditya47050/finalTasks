import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const db = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    const email = body.email;
    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    let pharmacy = await db.pharmacy.findUnique({ where: { email }, select: { id: true } });
    if (!pharmacy) {
      if (!body.mobile || !body.pincode) {
        return NextResponse.json({ error: "mobile and pincode are required for first-time save" }, { status: 400 });
      }
      const created = await db.pharmacy.create({
        data: {
          email,
          mobile: body.mobile,
          pincode: body.pincode,
          password: randomUUID(),
        },
        select: { id: true },
      });
      pharmacy = created;
    }

    const parseYesNo = (v) => (v === "Yes" ? true : v === "No" ? false : undefined);

    const update = await db.pharmacy.update({
      where: { email },
      data: {
        mobile: body.mobile ?? undefined,
        pincode: body.pincode ?? undefined,
        regname: body.regname ?? undefined,
        regno: body.regno ?? undefined,
        regdate: body.regdate ?? undefined,
        regcertificate: body.regcertificate ?? undefined,
        pharmacypancardno: body.pharmacypancardno ?? undefined,
        pharmacypancarddoc: body.pharmacypancarddoc ?? undefined,
        servicetimeinday: body.servicetimeinday ?? undefined,
        servicetimeinweek: Array.isArray(body.servicetimeinweek) ? body.servicetimeinweek.join(",") : undefined,
        onlineplotformservice: parseYesNo(body.onlineplotformservice),
        homedelivery: parseYesNo(body.homedelivery),
        pharmacytype: body.pharmacytype ?? undefined,
        TotalregPharmacist: body.TotalregPharmacist ?? undefined,

        fulladdress: body.fulladdress ?? undefined,
        city: body.city ?? undefined,
        state: body.state ?? undefined,
        district: body.district ?? undefined,
        taluka: body.taluka ?? undefined,
        primarycontactno: body.primarycontactno ?? undefined,
        alternatemobile: body.alternatemobile ?? undefined,
        secondaryemail: body.secondaryemail ?? undefined,
        bankName: body.bankName ?? undefined,
        accountNumber: body.accountNumber ?? undefined,
        ifscCode: body.ifscCode ?? undefined,
        accountType: body.accountType ?? undefined,
        cancelledCheque: body.cancelledCheque ?? undefined,
        micrCode: body.micrCode ?? undefined,
        aboutus: body.aboutus ?? undefined,
        pharmacylogo: body.pharmacylogo ?? undefined,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, pharmacy: update }, { status: 200 });
  } catch (err) {
    console.error("Pharmacy profile save error:", err);
    return NextResponse.json({ error: err?.message || "Failed to save" }, { status: 500 });
  }
}


