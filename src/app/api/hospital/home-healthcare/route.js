import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    console.log("🔍 Fetching hospital home healthcare services...");
    
    // First, test database connection
    const testCount = await db.homeHealthcare.count();
    console.log("✅ Total HomeHealthcare records in database:", testCount);
    
    // Fetch all home healthcare services with hospital details
    const allHomeHealthcareServices = await db.homeHealthcare.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        hospital: {
          include: {
            hspInfo: true,
            hspdetails: true,
            hspcontact: true,
            HospitalReview: true,
          },
        },
        _count: {
          select: {
            BookHomeHealthcare: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("✅ Total home healthcare services found:", allHomeHealthcareServices.length);

    // Map home healthcare data
    const homeHealthcareData = allHomeHealthcareServices.map((service) => ({
      id: service.id,
      serviceName: service.serviceName || "Home Healthcare Service",
      startingPrice: service.startingPrice || "999",
      minPrice: service.minPrice || service.startingPrice || "999",
      maxPrice: service.maxPrice || null,
      finalPrice: service.finalprice || service.startingPrice || "999",
      discount: service.discount || null,
      isAvailable: service.isAvailable !== false,
      totalBookings: service._count.BookHomeHealthcare || 0,
      hospital: {
        id: service.hospital.id,
        name: service.hospital.hspInfo?.regname || "Hospital",
        logo: service.hospital.hspdetails?.hsplogo || null,
        mobile: service.hospital.mobile,
        email: service.hospital.email,
        experience: service.hospital.hspInfo?.experience || "0",
        address: service.hospital.hspcontact?.address || "Address",
        city: service.hospital.hspcontact?.city || "City",
        state: service.hospital.hspcontact?.state || "State",
        pincode: service.hospital.hspcontact?.pincode || "000000",
        district: service.hospital.hspcontact?.dist || "District",
        nabl: service.hospital.hspdetails?.nabhnablapproved === "Yes",
        nablLevel: service.hospital.hspdetails?.nabhnabllevel || null,
        avgRating: service.hospital.HospitalReview && service.hospital.HospitalReview.length > 0
          ? (service.hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / service.hospital.HospitalReview.length).toFixed(1)
          : "4.5",
        totalReviews: service.hospital.HospitalReview?.length || 0,
      },
      serviceFeatures: {
        homeVisit: true,
        trained: true,
        available24x7: true,
        emergency: true,
      },
    }));

    console.log("✅ Home healthcare services mapped:", homeHealthcareData.length);

    // Group by service name
    const serviceStats = {};
    let totalServices = homeHealthcareData.length;
    let totalBookings = 0;

    homeHealthcareData.forEach((service) => {
      const name = service.serviceName;
      totalBookings += service.totalBookings;
      
      if (!serviceStats[name]) {
        serviceStats[name] = {
          serviceName: name,
          totalProviders: 0,
          totalBookings: 0,
          providers: [],
          cities: new Set(),
          states: new Set(),
          minPrice: service.minPrice,
          maxPrice: service.maxPrice,
        };
      }

      serviceStats[name].totalProviders++;
      serviceStats[name].totalBookings += service.totalBookings;
      serviceStats[name].providers.push(service);
      serviceStats[name].cities.add(service.hospital.city);
      serviceStats[name].states.add(service.hospital.state);

      // Update min price if lower
      const currentMin = parseInt(serviceStats[name].minPrice) || 999;
      const servicePrice = parseInt(service.minPrice) || 999;
      if (servicePrice < currentMin) {
        serviceStats[name].minPrice = servicePrice.toString();
      }

      // Update max price if higher
      if (service.maxPrice) {
        const currentMax = parseInt(serviceStats[name].maxPrice) || 0;
        const serviceMaxPrice = parseInt(service.maxPrice) || 0;
        if (serviceMaxPrice > currentMax) {
          serviceStats[name].maxPrice = serviceMaxPrice.toString();
        }
      }
    });

    // Convert to array
    const groupedByService = Object.values(serviceStats).map((stat) => ({
      serviceName: stat.serviceName,
      totalProviders: stat.totalProviders,
      totalBookings: stat.totalBookings,
      availableIn: Array.from(stat.cities),
      states: Array.from(stat.states),
      minPrice: stat.minPrice,
      maxPrice: stat.maxPrice,
      providers: stat.providers,
    }));

    console.log("✅ Grouped by service:", groupedByService.length);

    const response = {
      success: true,
      data: homeHealthcareData,
      grouped: groupedByService,
      total: homeHealthcareData.length,
      totalHospitals: [...new Set(homeHealthcareData.map(s => s.hospital.id))].length,
      statistics: {
        totalServices: totalServices,
        totalHospitals: [...new Set(homeHealthcareData.map(s => s.hospital.id))].length,
        totalBookings: totalBookings,
        averageBookings: groupedByService.length > 0 ? Math.round(totalBookings / groupedByService.length) : 0,
        cities: homeHealthcareData.length > 0 ? [...new Set(homeHealthcareData.map((s) => s.hospital.city))] : [],
        states: homeHealthcareData.length > 0 ? [...new Set(homeHealthcareData.map((s) => s.hospital.state))] : [],
        totalCities: homeHealthcareData.length > 0 ? [...new Set(homeHealthcareData.map((s) => s.hospital.city))].length : 0,
        totalStates: homeHealthcareData.length > 0 ? [...new Set(homeHealthcareData.map((s) => s.hospital.state))].length : 0,
      },
    };

    console.log("📤 Returning response with", homeHealthcareData.length, "home healthcare services");
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error fetching hospital home healthcare:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch home healthcare services",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

