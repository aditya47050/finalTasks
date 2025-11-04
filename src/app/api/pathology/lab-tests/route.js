import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all lab tests with hospital details
    const allLabTests = await db.labTest.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        Hospital: {
          include: {
            hspInfo: true,
            hspdetails: true,
            hspcontact: true,
          },
        },
        _count: {
          select: {
            BookLabTest: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map lab tests with detailed information
    const labTestsData = allLabTests.map((test) => ({
      id: test.id,
      testName: test.testname || "Lab Test",
      testCode: test.testCode || null,
      testCategory: test.testCategory || "General Test",
      minPrice: test.minPrice || test.price || "299",
      maxPrice: test.maxPrice || null,
      finalPrice: test.finalPrice || test.price || "299",
      discount: test.discount || null,
      price: test.price || "299",
      isAvailable: test.isAvailable !== false,
      homeCollection: test.homeCollection === true,
      nabl: test.nabl === true || test.nabl === "yes" || test.nabl === "Yes",
      reportTime: test.reportTime || "24-48 hours",
      fasting: test.fasting === true,
      sampleType: test.sampleType || "Blood",
      totalBookings: test._count?.BookLabTest || 0,
      hospital: {
        id: test.Hospital.id,
        name: test.Hospital.hspInfo?.regname || "Diagnostic Center",
        logo: test.Hospital.hspdetails?.hsplogo,
        mobile: test.Hospital.mobile,
        email: test.Hospital.email,
        experience: test.Hospital.hspInfo?.experience,
        address: test.Hospital.hspcontact?.address,
        city: test.Hospital.hspcontact?.city,
        state: test.Hospital.hspcontact?.state,
        pincode: test.Hospital.hspcontact?.pincode,
        district: test.Hospital.hspcontact?.dist,
      },
      testFeatures: {
        homeCollection: test.homeCollection || false,
        nabl: test.nabl || false,
        fasting: test.fasting || false,
        certified: true,
      },
    }));

    // Group by test name for statistics
    const testStats = {};
    let totalLabTests = labTestsData.length;
    let totalBookings = 0;

    labTestsData.forEach((test) => {
      const name = test.testName;
      totalBookings += test.totalBookings;

      if (!testStats[name]) {
        testStats[name] = {
          testName: name,
          totalProviders: 0,
          totalBookings: 0,
          providers: [],
          cities: new Set(),
          states: new Set(),
          minPrice: test.minPrice,
          maxPrice: test.maxPrice,
          categories: new Set(),
          nablAccredited: 0,
          homeCollectionAvailable: 0,
        };
      }

      testStats[name].totalProviders++;
      testStats[name].totalBookings += test.totalBookings;
      testStats[name].providers.push(test);
      
      if (test.testCategory) {
        testStats[name].categories.add(test.testCategory);
      }
      
      if (test.nabl) {
        testStats[name].nablAccredited++;
      }
      
      if (test.homeCollection) {
        testStats[name].homeCollectionAvailable++;
      }

      if (test.hospital.city) {
        testStats[name].cities.add(test.hospital.city);
      }
      if (test.hospital.state) {
        testStats[name].states.add(test.hospital.state);
      }

      // Update min price if lower
      const currentMin = parseInt(testStats[name].minPrice) || 299;
      const testPrice = parseInt(test.minPrice) || 299;
      if (testPrice < currentMin) {
        testStats[name].minPrice = testPrice.toString();
      }

      // Update max price if higher
      if (test.maxPrice) {
        const currentMax = parseInt(testStats[name].maxPrice) || 0;
        const testMaxPrice = parseInt(test.maxPrice) || 0;
        if (testMaxPrice > currentMax) {
          testStats[name].maxPrice = testMaxPrice.toString();
        }
      }
    });

    // Convert to array and sort by total bookings (popularity)
    const groupedTests = Object.values(testStats)
      .map((stat) => ({
        testName: stat.testName,
        totalProviders: stat.totalProviders,
        totalBookings: stat.totalBookings,
        availableIn: Array.from(stat.cities),
        states: Array.from(stat.states),
        categories: Array.from(stat.categories),
        minPrice: stat.minPrice,
        maxPrice: stat.maxPrice,
        providers: stat.providers,
        nablAccredited: stat.nablAccredited,
        homeCollectionAvailable: stat.homeCollectionAvailable,
      }))
      .sort((a, b) => b.totalBookings - a.totalBookings);

    return NextResponse.json({
      success: true,
      data: labTestsData,
      grouped: groupedTests,
      total: labTestsData.length,
      uniqueTests: groupedTests.length,
      totalLabTests: totalLabTests,
      statistics: {
        totalTests: totalLabTests,
        totalBookings: totalBookings,
        averageBookings: Math.round(totalBookings / groupedTests.length) || 0,
        nablAccreditedTests: labTestsData.filter((t) => t.nabl).length,
        homeCollectionTests: labTestsData.filter((t) => t.homeCollection).length,
        categories: [...new Set(labTestsData.map((t) => t.testCategory).filter(Boolean))],
        averageRating: totalBookings > 0 ? (totalBookings / groupedTests.length > 50 ? "4.8" : "4.6") : "0",
      },
    });
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch lab tests",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

