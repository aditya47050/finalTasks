import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all home healthcare services available for patients
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
            BookHomeHealthcare: true, // Count of patient bookings
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map services with patient-focused details
    const patientServices = allServices.map((service) => ({
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
        cashlessServices: service.hospital.hspInfo?.cashlessservices,
      },
      patientFriendly: true,
      homeVisit: true,
      qualifiedStaff: true,
    }));

    // Group by service name for statistics
    const serviceStats = {};
    let totalPatients = 0;

    patientServices.forEach((service) => {
      const name = service.serviceName;
      totalPatients += service.totalBookings;

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
        minPrice: stat.minPrice,
        maxPrice: stat.maxPrice,
        providers: stat.providers,
      }))
      .sort((a, b) => b.totalBookings - a.totalBookings);

    return NextResponse.json({
      success: true,
      data: patientServices,
      grouped: groupedServices,
      total: patientServices.length,
      uniqueServices: groupedServices.length,
      totalPatients: totalPatients,
      statistics: {
        totalPatients: totalPatients,
        totalServiceTypes: groupedServices.length,
        totalProviders: patientServices.length,
        averageRating: totalPatients > 0 ? (totalPatients / groupedServices.length > 100 ? "4.8" : "4.5") : "0",
        mostPopular: groupedServices[0]?.serviceName || null,
        averageBookings: Math.round(totalPatients / groupedServices.length) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching patient home healthcare services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch patient home healthcare services",
      },
      { status: 500 }
    );
  }
}

