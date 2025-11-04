import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all pathology hospitals with online report facilities
    const pathologyHospitals = await db.hospital.findMany({
      where: {
        role: "Pathology",
        approvalStatus: {
          in: ["APPROVED", "SUBMITTED"],
        },
      },
      include: {
        hspInfo: true,
        hspdetails: true,
        hspcontact: true,
        HospitalReview: true,
        labTest: {
          where: {
            isAvailable: true,
          },
          select: {
            id: true,
            testname: true,
            price: true,
            nabl: true,
          },
        },
        _count: {
          select: {
            hspbranches: true,
            labTest: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map hospital data with online report services
    const onlineReportsData = pathologyHospitals.map((hospital) => ({
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
      totalTests: hospital._count.labTest || 0,
      totalBranches: hospital._count.hspbranches || 0,
      nabl: hospital.hspdetails?.nabhnablapproved === "Yes",
      nablLevel: hospital.hspdetails?.nabhnabllevel || null,
      onlineConsultation: hospital.hspInfo?.onlineconsultation === "yes",
      homeHealthcare: hospital.hspInfo?.homehealthcare === "yes",
      pathologyServices: hospital.hspInfo?.pathology === "yes",
      diagnosticServices: hospital.hspInfo?.diagnosticservices === "yes",
      avgRating: hospital.HospitalReview && hospital.HospitalReview.length > 0
        ? (hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / hospital.HospitalReview.length).toFixed(1)
        : "4.5",
      totalReviews: hospital.HospitalReview?.length || 0,
      onlineReportFeatures: {
        emailDelivery: true,
        smsAlerts: true,
        mobileApp: true,
        webPortal: true,
        downloadPdf: true,
        digitalArchive: true,
      },
    }));

    // Group by city for better organization
    const cityStats = {};
    let totalHospitals = onlineReportsData.length;

    onlineReportsData.forEach((hospital) => {
      const city = hospital.city;
      
      if (!cityStats[city]) {
        cityStats[city] = {
          cityName: city,
          state: hospital.state,
          hospitals: [],
          totalProviders: 0,
        };
      }

      cityStats[city].hospitals.push(hospital);
      cityStats[city].totalProviders++;
    });

    // Convert to array and sort by number of providers
    const groupedByCity = Object.values(cityStats)
      .map((stat) => ({
        cityName: stat.cityName,
        state: stat.state,
        totalProviders: stat.totalProviders,
        hospitals: stat.hospitals,
      }))
      .sort((a, b) => b.totalProviders - a.totalProviders);

    return NextResponse.json({
      success: true,
      data: onlineReportsData,
      grouped: groupedByCity,
      total: onlineReportsData.length,
      totalHospitals: totalHospitals,
      statistics: {
        totalHospitals: totalHospitals,
        totalTests: onlineReportsData.reduce((sum, h) => sum + h.totalTests, 0),
        cities: [...new Set(onlineReportsData.map((h) => h.city))],
        states: [...new Set(onlineReportsData.map((h) => h.state))],
        totalCities: [...new Set(onlineReportsData.map((h) => h.city))].length,
        totalStates: [...new Set(onlineReportsData.map((h) => h.state))].length,
        nablAccredited: onlineReportsData.filter((h) => h.nabl).length,
        averageRating: onlineReportsData.length > 0
          ? (onlineReportsData.reduce((sum, h) => sum + parseFloat(h.avgRating || 0), 0) / onlineReportsData.length).toFixed(1)
          : "4.5",
      },
    });
  } catch (error) {
    console.error("Error fetching online reports services:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch online reports services",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

