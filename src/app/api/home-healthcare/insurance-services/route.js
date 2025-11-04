import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all home healthcare services with insurance/cashless services
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

    // Filter services that accept insurance/cashless services
    const insuranceServices = allServices
      .filter((service) => {
        const cashlessServices = service.hospital.hspInfo?.cashlessservices?.toLowerCase();
        return cashlessServices === "yes" || cashlessServices === "available";
      })
      .map((service) => ({
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
          nabhnablCertificate: service.hospital.hspdetails?.nabhnablcertificate,
          regCertificate: service.hospital.hspdetails?.hspregcertificate,
        },
        insuranceAccepted: true,
        cashlessAvailable: true,
      }));

    // Group by service name for statistics
    const serviceStats = {};
    let totalProvidersWithInsurance = 0;

    insuranceServices.forEach((service) => {
      const name = service.serviceName;
      totalProvidersWithInsurance++;

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

    // Convert to array and sort by total providers
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
        insuranceAccepted: true,
      }))
      .sort((a, b) => b.totalProviders - a.totalProviders);

    return NextResponse.json({
      success: true,
      data: insuranceServices,
      grouped: groupedServices,
      total: insuranceServices.length,
      uniqueServices: groupedServices.length,
      totalProvidersWithInsurance: totalProvidersWithInsurance,
      statistics: {
        cashlessProviders: totalProvidersWithInsurance,
        servicesAvailable: groupedServices.length,
      },
    });
  } catch (error) {
    console.error("Error fetching insurance home healthcare services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch insurance home healthcare services",
      },
      { status: 500 }
    );
  }
}

