import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all home healthcare services that are available 24/7
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map services with full details for 24/7 availability
    const services24x7 = allServices.map((service) => ({
      id: service.id,
      serviceName: service.serviceName,
      minPrice: service.minPrice || service.startingPrice || "999",
      maxPrice: service.maxPrice,
      finalprice: service.finalprice,
      discount: service.discount,
      startingPrice: service.startingPrice,
      isAvailable: service.isAvailable,
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
      availability: "24/7",
      emergencySupport: true,
      urgentCare: true,
    }));

    // Group by service name for statistics
    const serviceStats = {};
    services24x7.forEach((service) => {
      const name = service.serviceName;
      if (!serviceStats[name]) {
        serviceStats[name] = {
          serviceName: name,
          totalProviders: 0,
          providers: [],
          cities: new Set(),
          states: new Set(),
          minPrice: service.minPrice,
        };
      }
      serviceStats[name].totalProviders++;
      serviceStats[name].providers.push(service);
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
    });

    // Convert to array
    const groupedServices = Object.values(serviceStats).map((stat) => ({
      serviceName: stat.serviceName,
      totalProviders: stat.totalProviders,
      availableIn: Array.from(stat.cities),
      states: Array.from(stat.states),
      minPrice: stat.minPrice,
      providers: stat.providers,
    }));

    return NextResponse.json({
      success: true,
      data: services24x7,
      grouped: groupedServices,
      total: services24x7.length,
      uniqueServices: groupedServices.length,
    });
  } catch (error) {
    console.error("Error fetching 24/7 home healthcare services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch 24/7 home healthcare services",
      },
      { status: 500 }
    );
  }
}

