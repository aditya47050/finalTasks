import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all home healthcare services
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

    // Map services with pricing details
    const pricingServices = allServices.map((service) => {
      const minPrice = parseInt(service.minPrice || service.startingPrice || "999");
      const maxPrice = parseInt(service.maxPrice || "0");
      const finalPrice = parseInt(service.finalprice || "0");
      const discount = parseInt(service.discount || "0");

      return {
        id: service.id,
        serviceName: service.serviceName,
        minPrice: service.minPrice || service.startingPrice || "999",
        maxPrice: service.maxPrice,
        finalprice: service.finalprice,
        discount: service.discount,
        startingPrice: service.startingPrice,
        isAvailable: service.isAvailable,
        totalBookings: service._count.BookHomeHealthcare,
        priceValue: minPrice,
        priceRange: getPriceRange(minPrice),
        affordability: getAffordability(minPrice),
        hasDiscount: discount > 0,
        discountPercentage: discount,
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
      };
    });

    // Sort by price (lowest to highest)
    const sortedByPrice = [...pricingServices].sort((a, b) => a.priceValue - b.priceValue);

    // Group by price range
    const priceRangeStats = {};
    const servicesByPriceRange = {
      budget: [],
      moderate: [],
      premium: [],
    };

    pricingServices.forEach((service) => {
      // Add to price range category
      servicesByPriceRange[service.affordability].push(service);

      // Stats by service name
      const name = service.serviceName;
      if (!priceRangeStats[name]) {
        priceRangeStats[name] = {
          serviceName: name,
          totalProviders: 0,
          minPrice: service.minPrice,
          maxPrice: service.maxPrice,
          averagePrice: 0,
          totalBookings: 0,
          providers: [],
          cities: new Set(),
          states: new Set(),
          pricesSum: 0,
        };
      }

      priceRangeStats[name].totalProviders++;
      priceRangeStats[name].totalBookings += service.totalBookings;
      priceRangeStats[name].providers.push(service);
      priceRangeStats[name].pricesSum += service.priceValue;

      if (service.hospital.city) {
        priceRangeStats[name].cities.add(service.hospital.city);
      }
      if (service.hospital.state) {
        priceRangeStats[name].states.add(service.hospital.state);
      }

      // Update min price if lower
      const currentMin = parseInt(priceRangeStats[name].minPrice) || 999;
      if (service.priceValue < currentMin) {
        priceRangeStats[name].minPrice = service.minPrice;
      }

      // Update max price if higher
      if (service.maxPrice) {
        const currentMax = parseInt(priceRangeStats[name].maxPrice) || 0;
        const serviceMaxPrice = parseInt(service.maxPrice) || 0;
        if (serviceMaxPrice > currentMax) {
          priceRangeStats[name].maxPrice = service.maxPrice;
        }
      }
    });

    // Convert to array and calculate averages
    const groupedServices = Object.values(priceRangeStats)
      .map((stat) => ({
        serviceName: stat.serviceName,
        totalProviders: stat.totalProviders,
        minPrice: stat.minPrice,
        maxPrice: stat.maxPrice,
        averagePrice: Math.round(stat.pricesSum / stat.totalProviders).toString(),
        totalBookings: stat.totalBookings,
        availableIn: Array.from(stat.cities),
        states: Array.from(stat.states),
        providers: stat.providers,
      }))
      .sort((a, b) => parseInt(a.minPrice) - parseInt(b.minPrice));

    // Calculate statistics
    const totalServices = pricingServices.length;
    const prices = pricingServices.map((s) => s.priceValue);
    const avgPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const servicesWithDiscount = pricingServices.filter((s) => s.hasDiscount).length;

    return NextResponse.json({
      success: true,
      data: sortedByPrice,
      grouped: groupedServices,
      byPriceRange: {
        budget: servicesByPriceRange.budget,
        moderate: servicesByPriceRange.moderate,
        premium: servicesByPriceRange.premium,
      },
      total: totalServices,
      uniqueServices: groupedServices.length,
      statistics: {
        totalServices: totalServices,
        averagePrice: avgPrice,
        lowestPrice: lowestPrice,
        highestPrice: highestPrice,
        servicesWithDiscount: servicesWithDiscount,
        budgetServices: servicesByPriceRange.budget.length,
        moderateServices: servicesByPriceRange.moderate.length,
        premiumServices: servicesByPriceRange.premium.length,
      },
    });
  } catch (error) {
    console.error("Error fetching pricing home healthcare services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pricing home healthcare services",
      },
      { status: 500 }
    );
  }
}

// Helper function to determine price range
function getPriceRange(price) {
  if (price < 500) return "Under ₹500";
  if (price < 1000) return "₹500 - ₹1000";
  if (price < 1500) return "₹1000 - ₹1500";
  if (price < 2000) return "₹1500 - ₹2000";
  return "Above ₹2000";
}

// Helper function to determine affordability level
function getAffordability(price) {
  if (price < 1000) return "budget";
  if (price < 2000) return "moderate";
  return "premium";
}

