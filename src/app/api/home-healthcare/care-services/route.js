import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all home healthcare services with focus on personalized care
    const allServices = await db.homeHealthcare.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        hospital: {
          include: {
            hspInfo: true,
            hspdetails: true,
            hspcontact: true,
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

    // Map services with care-focused details
    const careServices = allServices.map((service) => ({
      id: service.id,
      serviceName: service.serviceName,
      minPrice: service.minPrice || service.startingPrice || "999",
      maxPrice: service.maxPrice,
      finalprice: service.finalprice,
      discount: service.discount,
      startingPrice: service.startingPrice,
      isAvailable: service.isAvailable,
      totalBookings: service._count.BookHomeHealthcare,
      hospital: {
        id: service.hospital.id,
        name: service.hospital.hspInfo?.regname || "Healthcare Provider",
        logo: service.hospital.hspdetails?.hsplogo,
        mobile: service.hospital.mobile,
        email: service.hospital.email,
        experience: service.hospital.hspInfo?.experience,
        address: service.hospital.hspcontact?.address,
        city: service.hospital.hspcontact?.city,
        state: service.hospital.hspcontact?.state,
        pincode: service.hospital.hspcontact?.pincode,
        district: service.hospital.hspcontact?.dist,
      },
      careFeatures: {
        personalized: true,
        compassionate: true,
        homeVisit: true,
        followUp: true,
      },
      careType: getCareType(service.serviceName),
    }));

    // Group by service name for statistics
    const serviceStats = {};
    let totalCareServices = careServices.length;
    let totalBookings = 0;

    careServices.forEach((service) => {
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
          careTypes: new Set(),
        };
      }

      serviceStats[name].totalProviders++;
      serviceStats[name].totalBookings += service.totalBookings;
      serviceStats[name].providers.push(service);
      serviceStats[name].careTypes.add(service.careType);

      if (service.hospital.city) {
        serviceStats[name].cities.add(service.hospital.city);
      }
      if (service.hospital.state) {
        serviceStats[name].states.add(service.hospital.state);
      }

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

    // Convert to array and sort by total bookings (popularity)
    const groupedServices = Object.values(serviceStats)
      .map((stat) => ({
        serviceName: stat.serviceName,
        totalProviders: stat.totalProviders,
        totalBookings: stat.totalBookings,
        availableIn: Array.from(stat.cities),
        states: Array.from(stat.states),
        careTypes: Array.from(stat.careTypes),
        minPrice: stat.minPrice,
        maxPrice: stat.maxPrice,
        providers: stat.providers,
      }))
      .sort((a, b) => b.totalBookings - a.totalBookings);

    return NextResponse.json({
      success: true,
      data: careServices,
      grouped: groupedServices,
      total: careServices.length,
      uniqueServices: groupedServices.length,
      totalCareServices: totalCareServices,
      statistics: {
        totalServices: totalCareServices,
        totalBookings: totalBookings,
        averageBookings: Math.round(totalBookings / groupedServices.length) || 0,
        careTypes: [...new Set(careServices.map((s) => s.careType))],
        averageRating: totalBookings > 0 ? (totalBookings / groupedServices.length > 50 ? "4.9" : "4.7") : "0",
      },
    });
  } catch (error) {
    console.error("Error fetching care home healthcare services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch care home healthcare services",
      },
      { status: 500 }
    );
  }
}

// Helper function to determine care type based on service name
function getCareType(serviceName) {
  if (!serviceName) return "General Care";
  const name = serviceName.toLowerCase();
  
  if (name.includes("elder") || name.includes("elderly") || name.includes("senior")) {
    return "Elder Care";
  }
  if (name.includes("post") || name.includes("operative") || name.includes("surgery")) {
    return "Post-Operative Care";
  }
  if (name.includes("nursing") || name.includes("nurse")) {
    return "Nursing Care";
  }
  if (name.includes("physio") || name.includes("therapy")) {
    return "Therapy Care";
  }
  if (name.includes("doctor") || name.includes("physician")) {
    return "Medical Care";
  }
  if (name.includes("child") || name.includes("pediatric")) {
    return "Pediatric Care";
  }
  if (name.includes("palliative") || name.includes("hospice")) {
    return "Palliative Care";
  }
  return "General Care";
}

