import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    console.log("🔍 Fetching hospital wellness packages...");
    
    // Fetch all wellness packages with hospital details
    const allWellnessPackages = await db.wellnesspackage.findMany({
      include: {
        Hospital: {
          include: {
            hspInfo: true,
            hspdetails: true,
            hspcontact: true,
            HospitalReview: true,
          },
        },
        _count: {
          select: {
            BookWellnesspackage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("✅ Total wellness packages found:", allWellnessPackages.length);
    console.log("✅ Packages with hospitals:", allWellnessPackages.filter(p => p.Hospital).length);

    // Map wellness package data
    const wellnessPackagesData = allWellnessPackages
      .filter((pkg) => pkg.Hospital) // Only include packages with hospital
      .map((pkg) => ({
        id: pkg.id,
        packageName: pkg.aapackagename || pkg.labpackagename || "Wellness Package",
        includesTest: pkg.includestest || null,
        originalPrice: pkg.aaprice || pkg.price || 0,
        price: pkg.price || 0,
        finalPrice: pkg.finalpackageprice || pkg.price || 0,
        discount: pkg.discount || null,
        homeVisit: pkg.homevisit === true,
        available: pkg.available !== false,
        totalBookings: pkg._count.BookWellnesspackage || 0,
        hospital: {
          id: pkg.Hospital.id,
          name: pkg.Hospital.hspInfo?.regname || "Hospital",
          logo: pkg.Hospital.hspdetails?.hsplogo || null,
          mobile: pkg.Hospital.mobile,
          email: pkg.Hospital.email,
          experience: pkg.Hospital.hspInfo?.experience || "0",
          address: pkg.Hospital.hspcontact?.address || "Address",
          city: pkg.Hospital.hspcontact?.city || "City",
          state: pkg.Hospital.hspcontact?.state || "State",
          pincode: pkg.Hospital.hspcontact?.pincode || "000000",
          district: pkg.Hospital.hspcontact?.dist || "District",
          nabl: pkg.Hospital.hspdetails?.nabhnablapproved === "Yes",
          nablLevel: pkg.Hospital.hspdetails?.nabhnabllevel || null,
          avgRating: pkg.Hospital.HospitalReview && pkg.Hospital.HospitalReview.length > 0
            ? (pkg.Hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / pkg.Hospital.HospitalReview.length).toFixed(1)
            : "4.5",
          totalReviews: pkg.Hospital.HospitalReview?.length || 0,
        },
        packageFeatures: {
          homeVisit: pkg.homevisit === true,
          comprehensive: pkg.includestest ? pkg.includestest.split(',').length > 3 : false,
          discounted: pkg.discount ? parseInt(pkg.discount) > 0 : false,
        },
      }));

    console.log("✅ Wellness packages mapped:", wellnessPackagesData.length);

    // Group by hospital
    const hospitalStats = {};
    let totalPackages = wellnessPackagesData.length;
    let totalBookings = 0;

    wellnessPackagesData.forEach((pkg) => {
      const hospitalId = pkg.hospital.id;
      totalBookings += pkg.totalBookings;
      
      if (!hospitalStats[hospitalId]) {
        hospitalStats[hospitalId] = {
          hospital: pkg.hospital,
          packages: [],
          totalPackages: 0,
        };
      }

      hospitalStats[hospitalId].packages.push(pkg);
      hospitalStats[hospitalId].totalPackages++;
    });

    // Convert to array
    const groupedByHospital = Object.values(hospitalStats).map((stat) => ({
      hospital: stat.hospital,
      totalPackages: stat.totalPackages,
      packages: stat.packages,
    }));

    console.log("✅ Grouped by hospital:", groupedByHospital.length);

    const response = {
      success: true,
      data: wellnessPackagesData,
      grouped: groupedByHospital,
      total: wellnessPackagesData.length,
      totalHospitals: groupedByHospital.length,
      statistics: {
        totalPackages: totalPackages,
        totalHospitals: groupedByHospital.length,
        totalBookings: totalBookings,
        averageBookings: groupedByHospital.length > 0 ? Math.round(totalBookings / groupedByHospital.length) : 0,
        homeVisitPackages: wellnessPackagesData.filter((p) => p.homeVisit).length,
        discountedPackages: wellnessPackagesData.filter((p) => p.packageFeatures.discounted).length,
        cities: wellnessPackagesData.length > 0 ? [...new Set(wellnessPackagesData.map((p) => p.hospital.city))] : [],
        states: wellnessPackagesData.length > 0 ? [...new Set(wellnessPackagesData.map((p) => p.hospital.state))] : [],
        totalCities: wellnessPackagesData.length > 0 ? [...new Set(wellnessPackagesData.map((p) => p.hospital.city))].length : 0,
        totalStates: wellnessPackagesData.length > 0 ? [...new Set(wellnessPackagesData.map((p) => p.hospital.state))].length : 0,
      },
    };

    console.log("📤 Returning response with", wellnessPackagesData.length, "wellness packages");
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error fetching hospital wellness packages:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wellness packages",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

