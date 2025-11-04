import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { hospitalid } = params;

    if (!hospitalid) {
      return NextResponse.json(
        { error: "Hospital ID is required" },
        { status: 400 }
      );
    }

    // Fetch branches for this hospital
    const hospitalBranches = await db.Hspbranch.findMany({
      where: { 
        hospitalId: hospitalid,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the branch data
    const branches = hospitalBranches.map((branch) => ({
      id: branch.id,
      branchname: branch.branchname,
      address: branch.branchaddress,
      city: branch.branchcity,
      state: branch.state,
      pincode: branch.branchpincode,
      contact: branch.branchreceptionno1,
      email: branch.branchreceptionemail,
      timings: "24/7", // Default as there's no timings field in schema
      hospitalId: branch.hospitalId,
    }));

    return NextResponse.json({
      success: true,
      branches,
      count: branches.length,
    });
  } catch (error) {
    console.error("Error fetching hospital branches:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches", details: error.message },
      { status: 500 }
    );
  }
}

