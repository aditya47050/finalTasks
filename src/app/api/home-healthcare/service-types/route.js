import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all home healthcare services grouped by service name
    const allServices = await db.homeHealthcare.findMany({
      where: {
        isAvailable: true,
      },
      select: {
        serviceName: true,
        minPrice: true,
        startingPrice: true,
        maxPrice: true,
        finalprice: true,
        discount: true,
        hospital: {
          select: {
            id: true,
            hspInfo: {
              select: {
                regname: true,
              },
            },
            hspcontact: {
              select: {
                city: true,
                state: true,
              },
            },
          },
        },
      },
    });

    // Group services by serviceName and calculate stats
    const serviceTypesMap = {};

    allServices.forEach((service) => {
      const serviceName = service.serviceName;

      if (!serviceTypesMap[serviceName]) {
        serviceTypesMap[serviceName] = {
          serviceName,
          providers: [],
          minPrice: service.minPrice || service.startingPrice || "999",
          maxPrice: service.maxPrice,
          totalProviders: 0,
          cities: new Set(),
          states: new Set(),
        };
      }

      // Add provider info
      serviceTypesMap[serviceName].providers.push({
        hospitalId: service.hospital.id,
        name: service.hospital.hspInfo?.regname,
        city: service.hospital.hspcontact?.city,
        state: service.hospital.hspcontact?.state,
      });

      // Track unique cities and states
      if (service.hospital.hspcontact?.city) {
        serviceTypesMap[serviceName].cities.add(
          service.hospital.hspcontact.city
        );
      }
      if (service.hospital.hspcontact?.state) {
        serviceTypesMap[serviceName].states.add(
          service.hospital.hspcontact.state
        );
      }

      // Update min price if lower
      const currentMin = parseInt(serviceTypesMap[serviceName].minPrice) || 999;
      const servicePrice =
        parseInt(service.minPrice || service.startingPrice) || 999;
      if (servicePrice < currentMin) {
        serviceTypesMap[serviceName].minPrice = servicePrice.toString();
      }

      serviceTypesMap[serviceName].totalProviders++;
    });

    // Convert to array and format
    const serviceTypes = Object.values(serviceTypesMap).map((service) => ({
      serviceName: service.serviceName,
      minPrice: service.minPrice,
      maxPrice: service.maxPrice,
      totalProviders: service.totalProviders,
      availableIn: Array.from(service.cities),
      states: Array.from(service.states),
      providers: service.providers,
    }));

    return NextResponse.json({
      success: true,
      data: serviceTypes,
      total: serviceTypes.length,
    });
  } catch (error) {
    console.error("Error fetching home healthcare service types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch home healthcare service types",
      },
      { status: 500 }
    );
  }
}

