import { db } from "@/lib/db";

export async function getHospitalAnalyticsData(role) {
  try {
    // Fetch all hospitals with related data
    const hospitals = await db.hospital.findMany({
      where: { role: role },
      include: {
        Bed: true, // Ensure Bed model is included
        hspInfo: true,
        hspcontact: true,
        hspdetails: true,
        staff: true,
        HospitalDepartment: true,
        HospitalSpeciality: {
          include: {
            speciality: true,
          },
        },
        HospitalDoctor: {
          include: {
            doctor: {
              include: {
                specialities: {
                  include: {
                    speciality: true,
                  },
                },
                doctorinfo: true,
              },
            },
          },
        },
        HospitalAmbulance: {
          include: {
            ambulance: {
              include: {
                AmbulanceVaichicle: true,
              },
            },
          },
        },
        BedCategory: true,
        BedBooking: true,
      },
    });

    // Calculate total beds
    const totalBeds = hospitals.reduce((sum, hospital) => {
      return sum + (hospital.Bed ? hospital.Bed.length : 0);
    }, 0);

    // Fetch additional data for comprehensive analytics
    const [
      totalPatients,
      totalDoctors,
      totalAmbulances,
      bedBookings,
      appointments,
      specialties,
      states,
      districts,
    ] = await Promise.all([
      db.patient.count(),
      db.doctor.count(),
      db.ambulance.count(),
      db.bedBooking.findMany({
        include: {
          bed: {
            include: {
              category: true,
            },
          },
          hospital: {
            include: {
              hspcontact: true,
            },
          },
        },
      }),
      db.bookFreeAppointment.findMany({
        include: {
          category: true,
        },
      }),
      db.expertDoctorsCategory.findMany({
        include: {
          doctors: {
            include: {
              doctor: true,
            },
          },
        },
      }),
      db.state.findMany({
        include: {
          districts: {
            include: {
              subDistricts: true,
            },
          },
        },
      }),
      db.district.findMany(),
    ]);

    // Get bed status distribution
    const bedStatusCounts = await db.bed.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    // Get hospital role distribution
    const hospitalRoleCounts = await db.hospital.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    // Get monthly registration trends
    const monthlyRegistrations = await db.hospital.findMany({
      select: {
        createdAt: true,
        role: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get doctor registrations by month
    const doctorRegistrations = await db.doctor.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get patient registrations by month
    const patientRegistrations = await db.patient.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get ambulance data with vehicle details
    const ambulanceData = await db.ambulance.findMany({
      include: {
        AmbulanceVaichicle: true,
        AmbulanceHsp: true,
      },
    });

    // Get fundraising campaigns data
    const fundraisingData = await db.fundraisingCampaign.findMany({
      include: {
        Donation: true,
        fundraiser: {
          include: {
            patient: true,
          },
        },
      },
    });

    return {
      hospitals,
      totalBeds, // Include total beds in the returned data
      totalPatients,
      totalDoctors,
      totalAmbulances,
      bedBookings,
      appointments,
      specialties,
      states,
      districts,
      bedStatusCounts,
      hospitalRoleCounts,
      monthlyRegistrations,
      doctorRegistrations,
      patientRegistrations,
      ambulanceData,
      fundraisingData,
    };
  } catch (error) {
    console.error("Error fetching hospital analytics data:", error);
    throw new Error("Failed to fetch hospital analytics data");
  }
}

// Helper function to process registration trends
export function processRegistrationTrends(
  hospitalRegs,
  doctorRegs,
  patientRegs
) {
  const trends = {};

  // Process hospital registrations
  hospitalRegs.forEach((hospital) => {
    const monthYear = new Date(hospital.createdAt).toISOString().slice(0, 7); // YYYY-MM format
    if (!trends[monthYear]) {
      trends[monthYear] = { hospitals: 0, doctors: 0, patients: 0 };
    }
    trends[monthYear].hospitals++;
  });

  // Process doctor registrations
  doctorRegs.forEach((doctor) => {
    const monthYear = new Date(doctor.createdAt).toISOString().slice(0, 7);
    if (!trends[monthYear]) {
      trends[monthYear] = { hospitals: 0, doctors: 0, patients: 0 };
    }
    trends[monthYear].doctors++;
  });

  // Process patient registrations
  patientRegs.forEach((patient) => {
    const monthYear = new Date(patient.createdAt).toISOString().slice(0, 7);
    if (!trends[monthYear]) {
      trends[monthYear] = { hospitals: 0, doctors: 0, patients: 0 };
    }
    trends[monthYear].patients++;
  });

  // Convert to array and sort by date
  return Object.entries(trends)
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
      ...data,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month))
    .slice(-12); // Last 12 months
}

// Helper function to process geographic distribution
export function processGeographicData(hospitals) {
  const stateDistribution = {};
  const cityDistribution = {};

  hospitals.forEach((hospital) => {
    const state = hospital.hspcontact?.state || "Unknown";
    const city = hospital.hspcontact?.city || "Unknown";

    // State distribution
    stateDistribution[state] = (stateDistribution[state] || 0) + 1;

    // City distribution
    const cityKey = `${city}, ${state}`;
    cityDistribution[cityKey] = (cityDistribution[cityKey] || 0) + 1;
  });

  const stateChartData = Object.entries(stateDistribution)
    .map(([state, count]) => ({
      state,
      count,
      percentage: ((count / hospitals.length) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);

  const cityChartData = Object.entries(cityDistribution)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 cities

  return { stateChartData, cityChartData };
}

// Helper function to process service adoption data
export function processServiceAdoption(hospitals) {
  const services = [
    { key: "onlineconsultation", label: "Online Consultation" },
    { key: "homehealthcare", label: "Home Healthcare" },
    { key: "pharmacy", label: "Pharmacy" },
    { key: "pathology", label: "Pathology" },
    { key: "diagnosticservices", label: "Diagnostic Services" },
    { key: "cashlessservices", label: "Cashless Services" },
    { key: "governmentschemes", label: "Government Schemes" },
    { key: "inhousecanteen", label: "In-house Canteen" },
  ];

  return services
    .map((service) => {
      const count = hospitals.filter(
        (hospital) =>
          hospital.hspInfo?.[service.key] === "true" ||
          hospital.hspInfo?.[service.key] === true
      ).length;

      return {
        service: service.label,
        count,
        adoption: ((count / hospitals.length) * 100).toFixed(1),
        hospitals: count,
      };
    })
    .filter((item) => item.count > 0);
}

// Helper function to process bed data
export function processBedData(hospitals) {
  const bedStatusData = {};
  const bedCategoryData = {};
  let totalBeds = 0;

  hospitals.forEach((hospital) => {
    // Count beds by status
    hospital.Bed?.forEach((bed) => {
      bedStatusData[bed.status] = (bedStatusData[bed.status] || 0) + 1;
      totalBeds++;
    });

    // Count beds by category
    hospital.BedCategory?.forEach((category) => {
      bedCategoryData[category.name] =
        (bedCategoryData[category.name] || 0) + category.bedCount;
    });
  });

  const bedStatusChartData = Object.entries(bedStatusData).map(
    ([status, count]) => ({
      status,
      count,
      percentage: ((count / totalBeds) * 100).toFixed(1),
    })
  );

  const bedCategoryChartData = Object.entries(bedCategoryData).map(
    ([category, count]) => ({
      category,
      count,
    })
  );

  return { bedStatusChartData, bedCategoryChartData, totalBeds };
}

// Helper function to process doctor specialty data
export function processDoctorSpecialtyData(hospitals) {
  const specialtyCount = {};

  hospitals.forEach((hospital) => {
    hospital.HospitalSpeciality?.forEach((hospitalSpecialty) => {
      const specialtyName = hospitalSpecialty.speciality?.title || "Unknown";
      specialtyCount[specialtyName] = (specialtyCount[specialtyName] || 0) + 1;
    });
  });

  return Object.entries(specialtyCount)
    .map(([specialty, count]) => ({ specialty, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 specialties
}

// Helper function to process ambulance data
export function processAmbulanceData(ambulanceData) {
  const typeCount = {};
  const categoryCount = {};

  ambulanceData.forEach((ambulance) => {
    ambulance.AmbulanceVaichicle?.forEach((vehicle) => {
      const type = vehicle.ambulancetype || "Unknown";
      const category = vehicle.ambulancecategory || "Unknown";

      typeCount[type] = (typeCount[type] || 0) + 1;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  const ambulanceTypeData = Object.entries(typeCount).map(([type, count]) => ({
    type,
    count,
    avgCharges: Math.floor(Math.random() * 3000) + 1500, // Placeholder for charges
  }));

  const ambulanceCategoryData = Object.entries(categoryCount).map(
    ([category, count]) => ({
      category,
      count,
    })
  );

  return { ambulanceTypeData, ambulanceCategoryData };
}
