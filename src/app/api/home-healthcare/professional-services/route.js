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
            HospitalDoctor: {
              include: {
                doctor: {
                  select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    email: true,
                    mobile: true,
                    education: true,
                    totalexperience: true,
                    role: true,
                    regno: true,
                  },
                },
              },
              where: {
                status: "APPROVED",
              },
            },
            staff: {
              select: {
                id: true,
                fullName: true,
                mobileNumber: true,
                email: true,
                role: true,
                level: true,
              },
            },
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

    // Map services with professional details
    const professionalServices = allServices.map((service) => {
      const doctors = service.hospital.HospitalDoctor || [];
      const staff = service.hospital.staff || [];
      
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
        professionals: {
          doctors: doctors.map((hd) => ({
            id: hd.doctor.id,
            name: `${hd.doctor.firstName || ""} ${hd.doctor.middleName || ""} ${hd.doctor.lastName || ""}`.trim(),
            email: hd.doctor.email,
            mobile: hd.doctor.mobile,
            education: hd.doctor.education,
            experience: hd.doctor.totalexperience,
            role: hd.doctor.role || "Doctor",
            regno: hd.doctor.regno,
            speciality: hd.hospitalSpeciality?.title || "General",
          })),
          staff: staff.map((s) => ({
            id: s.id,
            name: s.fullName,
            mobile: s.mobileNumber,
            email: s.email,
            role: s.role,
            level: s.level,
          })),
          totalCount: doctors.length + staff.length,
          doctorCount: doctors.length,
          staffCount: staff.length,
        },
        qualifiedProfessionals: true,
      };
    });

    // Group by service name for statistics
    const serviceStats = {};
    let totalProfessionals = 0;
    let totalDoctors = 0;
    let totalStaff = 0;

    professionalServices.forEach((service) => {
      const name = service.serviceName;
      totalProfessionals += service.professionals.totalCount;
      totalDoctors += service.professionals.doctorCount;
      totalStaff += service.professionals.staffCount;

      if (!serviceStats[name]) {
        serviceStats[name] = {
          serviceName: name,
          totalProviders: 0,
          totalProfessionals: 0,
          totalDoctors: 0,
          totalStaff: 0,
          totalBookings: 0,
          providers: [],
          cities: new Set(),
          states: new Set(),
          minPrice: service.minPrice,
          maxPrice: service.maxPrice,
        };
      }

      serviceStats[name].totalProviders++;
      serviceStats[name].totalProfessionals += service.professionals.totalCount;
      serviceStats[name].totalDoctors += service.professionals.doctorCount;
      serviceStats[name].totalStaff += service.professionals.staffCount;
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

    // Convert to array and sort by total professionals
    const groupedServices = Object.values(serviceStats)
      .map((stat) => ({
        serviceName: stat.serviceName,
        totalProviders: stat.totalProviders,
        totalProfessionals: stat.totalProfessionals,
        totalDoctors: stat.totalDoctors,
        totalStaff: stat.totalStaff,
        totalBookings: stat.totalBookings,
        availableIn: Array.from(stat.cities),
        states: Array.from(stat.states),
        minPrice: stat.minPrice,
        maxPrice: stat.maxPrice,
        providers: stat.providers,
      }))
      .sort((a, b) => b.totalProfessionals - a.totalProfessionals);

    return NextResponse.json({
      success: true,
      data: professionalServices,
      grouped: groupedServices,
      total: professionalServices.length,
      uniqueServices: groupedServices.length,
      statistics: {
        totalProfessionals,
        totalDoctors,
        totalStaff,
        averageProfessionalsPerService: Math.round(totalProfessionals / groupedServices.length) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching professional home healthcare services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch professional home healthcare services",
      },
      { status: 500 }
    );
  }
}

