import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all pathology hospitals with government schemes
    const pathologyHospitals = await db.hospital.findMany({
      where: {
        role: "Pathology",
        approvalStatus: {
          in: ["APPROVED", "SUBMITTED"],
        },
        hspInfo: {
          governmentschemes: {
            not: null,
          },
        },
      },
      include: {
        hspInfo: true,
        hspdetails: true,
        hspcontact: true,
        HospitalReview: true,
        _count: {
          select: {
            hspbranches: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map hospital data with government schemes
    const govtSchemesData = pathologyHospitals
      .filter((hospital) => hospital.hspInfo?.governmentschemes)
      .map((hospital) => {
        // Parse government schemes (comma-separated or string)
        const schemesString = hospital.hspInfo.governmentschemes;
        const schemes = schemesString
          ? schemesString.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        return {
          id: hospital.id,
          hospitalName: hospital.hspInfo?.regname || "Pathology Lab",
          logo: hospital.hspdetails?.hsplogo || null,
          mobile: hospital.mobile,
          email: hospital.email,
          experience: hospital.hspInfo?.experience || "0",
          address: hospital.hspcontact?.address || "Address",
          city: hospital.hspcontact?.city || "City",
          state: hospital.hspcontact?.state || "State",
          pincode: hospital.hspcontact?.pincode || "000000",
          district: hospital.hspcontact?.dist || "District",
          governmentSchemes: schemes,
          totalSchemes: schemes.length,
          nabl: hospital.hspdetails?.nabhnablapproved === "Yes",
          nablLevel: hospital.hspdetails?.nabhnabllevel || null,
          totalBranches: hospital._count.hspbranches,
          cashlessServices: hospital.hspInfo?.cashlessservices || null,
          pathologyServices: hospital.hspInfo?.pathology === "yes",
          diagnosticServices: hospital.hspInfo?.diagnosticservices === "yes",
          avgRating: hospital.HospitalReview && hospital.HospitalReview.length > 0
            ? (hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / hospital.HospitalReview.length).toFixed(1)
            : "4.5",
          totalReviews: hospital.HospitalReview?.length || 0,
        };
      });

    // Group by scheme type
    const schemeStats = {};
    let totalHospitals = govtSchemesData.length;
    let uniqueSchemes = new Set();

    govtSchemesData.forEach((hospital) => {
      hospital.governmentSchemes.forEach((scheme) => {
        uniqueSchemes.add(scheme);
        
        if (!schemeStats[scheme]) {
          schemeStats[scheme] = {
            schemeName: scheme,
            hospitals: [],
            cities: new Set(),
            states: new Set(),
            totalProviders: 0,
          };
        }

        schemeStats[scheme].hospitals.push(hospital);
        schemeStats[scheme].totalProviders++;
        schemeStats[scheme].cities.add(hospital.city);
        schemeStats[scheme].states.add(hospital.state);
      });
    });

    // Convert to array
    const groupedByScheme = Object.values(schemeStats).map((stat) => ({
      schemeName: stat.schemeName,
      totalProviders: stat.totalProviders,
      hospitals: stat.hospitals,
      cities: Array.from(stat.cities),
      states: Array.from(stat.states),
      availableIn: Array.from(stat.cities).join(", "),
    }));

    return NextResponse.json({
      success: true,
      data: govtSchemesData,
      grouped: groupedByScheme,
      total: govtSchemesData.length,
      uniqueSchemes: Array.from(uniqueSchemes),
      totalHospitals: totalHospitals,
      statistics: {
        totalHospitals: totalHospitals,
        totalUniqueSchemes: uniqueSchemes.size,
        schemes: Array.from(uniqueSchemes),
        cities: [...new Set(govtSchemesData.map((h) => h.city))],
        states: [...new Set(govtSchemesData.map((h) => h.state))],
        totalCities: [...new Set(govtSchemesData.map((h) => h.city))].length,
        totalStates: [...new Set(govtSchemesData.map((h) => h.state))].length,
        nablAccredited: govtSchemesData.filter((h) => h.nabl).length,
      },
    });
  } catch (error) {
    console.error("Error fetching government schemes:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch government schemes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

