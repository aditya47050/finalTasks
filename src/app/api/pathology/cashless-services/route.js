import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all pathology hospitals with cashless services
    const pathologyHospitals = await db.hospital.findMany({
      where: {
        role: "Pathology",
        approvalStatus: {
          in: ["APPROVED", "SUBMITTED"],
        },
        hspInfo: {
          cashlessservices: {
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

    // Map hospital data with cashless insurance services
    const cashlessData = pathologyHospitals
      .filter((hospital) => hospital.hspInfo?.cashlessservices)
      .map((hospital) => {
        // Parse cashless services (comma-separated insurance providers)
        const insuranceString = hospital.hspInfo.cashlessservices;
        const insuranceProviders = insuranceString
          ? insuranceString.split(',').map(s => s.trim()).filter(Boolean)
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
          insuranceProviders: insuranceProviders,
          totalInsuranceProviders: insuranceProviders.length,
          nabl: hospital.hspdetails?.nabhnablapproved === "Yes",
          nablLevel: hospital.hspdetails?.nabhnabllevel || null,
          totalBranches: hospital._count.hspbranches,
          governmentSchemes: hospital.hspInfo?.governmentschemes || null,
          pathologyServices: hospital.hspInfo?.pathology === "yes",
          diagnosticServices: hospital.hspInfo?.diagnosticservices === "yes",
          avgRating: hospital.HospitalReview && hospital.HospitalReview.length > 0
            ? (hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / hospital.HospitalReview.length).toFixed(1)
            : "4.5",
          totalReviews: hospital.HospitalReview?.length || 0,
        };
      });

    // Group by insurance provider
    const insuranceStats = {};
    let totalHospitals = cashlessData.length;
    let uniqueInsuranceProviders = new Set();

    cashlessData.forEach((hospital) => {
      hospital.insuranceProviders.forEach((provider) => {
        uniqueInsuranceProviders.add(provider);
        
        if (!insuranceStats[provider]) {
          insuranceStats[provider] = {
            insuranceName: provider,
            hospitals: [],
            cities: new Set(),
            states: new Set(),
            totalProviders: 0,
          };
        }

        insuranceStats[provider].hospitals.push(hospital);
        insuranceStats[provider].totalProviders++;
        insuranceStats[provider].cities.add(hospital.city);
        insuranceStats[provider].states.add(hospital.state);
      });
    });

    // Convert to array
    const groupedByInsurance = Object.values(insuranceStats).map((stat) => ({
      insuranceName: stat.insuranceName,
      totalProviders: stat.totalProviders,
      hospitals: stat.hospitals,
      cities: Array.from(stat.cities),
      states: Array.from(stat.states),
      availableIn: Array.from(stat.cities).join(", "),
    }));

    return NextResponse.json({
      success: true,
      data: cashlessData,
      grouped: groupedByInsurance,
      total: cashlessData.length,
      uniqueInsuranceProviders: Array.from(uniqueInsuranceProviders),
      totalHospitals: totalHospitals,
      statistics: {
        totalHospitals: totalHospitals,
        totalInsuranceProviders: uniqueInsuranceProviders.size,
        insuranceProviders: Array.from(uniqueInsuranceProviders),
        cities: [...new Set(cashlessData.map((h) => h.city))],
        states: [...new Set(cashlessData.map((h) => h.state))],
        totalCities: [...new Set(cashlessData.map((h) => h.city))].length,
        totalStates: [...new Set(cashlessData.map((h) => h.state))].length,
        nablAccredited: cashlessData.filter((h) => h.nabl).length,
      },
    });
  } catch (error) {
    console.error("Error fetching cashless services:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cashless services",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

