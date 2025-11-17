// src/app/api/hospital/[hospitalid]/inhouse-homehealthcare/route.js

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ---------------------- GET LINKED HOME HEALTHCARE CENTERS ----------------------
export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID missing" },
        { status: 400 }
      );
    }

    const linkedCenters = await db.hospitalHomeHealthcare.findMany({
      where: {
        hospitalId: hospitalid,
      },
      include: {
        homeHealthcare: {
          include: {
            hspInfo: {
              select: {
                id: true,
                regname: true,
                totalnoofbed: true,
                totalspeciality: true,
                totaldoctor: true,
                totalambulance: true,
                onlineconsultation: true,
                homehealthcare: true,
                pharmacy: true,
                pathology: true,
                diagnosticservices: true,
                cashlessservices: true,
                governmentschemes: true,
                inhousecanteen: true,
                experience: true,
              },
            },
            hspcontact: {
              select: {
                id: true,
                address: true,
                city: true,
                state: true,
                dist: true,
                taluka: true,
                pincode: true,
                receptioncontact1: true,
                receptioncontact2: true,
                receptionemail: true,
                managername: true,
                managercontact: true,
                manageremail: true,
                adminname: true,
                admincontact: true,
                adminemail: true,
              },
            },
            // YEH CORRECT HAI: HomeHealthcare services Hospital model pe hain
            HomeHealthcare: {
              select: {
                id: true,
                serviceName: true,
                startingPrice: true,
                minPrice: true,
                maxPrice: true,
                finalprice: true,
                discount: true,
                isAvailable: true,
              },
              where: { isAvailable: true },
              orderBy: { serviceName: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: linkedCenters.length,
      linkedCenters,
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ---------------------- POST: LINK NEW HOME HEALTHCARE CENTERS ----------------------
export async function POST(req, { params }) {
  try {
    const { hospitalid } = params;
    const body = await req.json();
    const { homeHealthcareCenters } = body; // array of center IDs

    if (!hospitalid) {
      return NextResponse.json(
        { success: false, message: "Hospital ID missing" },
        { status: 400 }
      );
    }

    if (!Array.isArray(homeHealthcareCenters) || homeHealthcareCenters.length === 0) {
      return NextResponse.json(
        { success: false, message: "No home healthcare centers selected" },
        { status: 400 }
      );
    }

    // Remove old links
    await db.hospitalHomeHealthcare.deleteMany({
      where: { hospitalId: hospitalid },
    });

    // Create new links
    const createdLinks = await Promise.all(
      homeHealthcareCenters.map((centerId) =>
        db.hospitalHomeHealthcare.create({
          data: {
            hospitalId: hospitalid,
            homeHealthcareId: centerId,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Home healthcare centers linked successfully",
      createdLinks,
    });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}