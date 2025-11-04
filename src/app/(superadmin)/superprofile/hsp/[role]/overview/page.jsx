import ComprehensiveHospitalDashboard from "../components/maingraphhospital";
import {
  processRegistrationTrends,
  processGeographicData,
  processServiceAdoption,
  processBedData,
  processDoctorSpecialtyData,
  processAmbulanceData,
  getHospitalAnalyticsData,
} from "../lib/hospitaldata";

export default async function Page({ params }) {
  const role = params.role;
  try {
    // Fetch all hospital analytics data from Prisma
    const rawData = await getHospitalAnalyticsData(role);

    // Process the raw data into chart-ready formats
    const processedData = {
      // Basic counts with default values
      totalHospitals: rawData.hospitals.length || 0,
      totalPatients: rawData.totalPatients || 0,
      totalDoctors: rawData.totalDoctors || 0,
      totalAmbulances: rawData.totalAmbulances || 0,

      // Hospital data
      hospitals: rawData.hospitals || [],

      // Geographic data
      ...processGeographicData(rawData.hospitals || []),

      // Service adoption data
      serviceAdoptionData: processServiceAdoption(rawData.hospitals || []),

      // Bed data
      ...processBedData(rawData.hospitals || []),

      // Doctor specialty data
      specialtyData: processDoctorSpecialtyData(rawData.hospitals || []),

      // Ambulance data
      ...processAmbulanceData(rawData.ambulanceData || []),

      // Registration trends
      registrationTrends: processRegistrationTrends(
        rawData.monthlyRegistrations || [],
        rawData.doctorRegistrations || [],
        rawData.patientRegistrations || []
      ),
      totalBeds: rawData.hospitals.reduce(
        (sum, hospital) => sum + (hospital.Bed?.length || 0),
        0
      ),
      // Hospital role distribution
      hospitalRoleData: (rawData.hospitalRoleCounts || []).map((item) => ({
        role: item.role || "Unknown",
        count: item._count.role || 0,
        percentage: (
          (item._count.role / (rawData.hospitals.length || 1)) *
          100
        ).toFixed(1),
      })),

      // Bed status distribution
      bedStatusData: (rawData.bedStatusCounts || []).map((item) => ({
        status: item.status || "Unknown",
        count: item._count.status || 0,
      })),

      // Quality certifications
      certificationData: {
        nabhnablApproved: (rawData.hospitals || []).filter(
          (h) =>
            h.hspdetails?.nabhnablapproved === "true" ||
            h.hspdetails?.nabhnablapproved === true
        ).length,
        isoApproved: (rawData.hospitals || []).filter(
          (h) =>
            h.hspdetails?.isoapproved === "true" ||
            h.hspdetails?.isoapproved === true
        ).length,
      },

      // Additional analytics data
      bedBookings: rawData.bedBookings || [],
      appointments: rawData.appointments || [],
      specialties: rawData.specialties || [],
      states: rawData.states || [],
      districts: rawData.districts || [],
      fundraisingData: rawData.fundraisingData || [],
    };

    // Log the processed data to check for NaN values
    console.log("Processed Data:", processedData.totalBeds);

    return (
      <div>
        <ComprehensiveHospitalDashboard
          data={processedData}
          states={rawData.states || []}
          districts={rawData.districts || []}
          talukas={(rawData.districts || []).flatMap(
            (d) => d.subDistricts || []
          )}
          specialities={rawData.specialties || []}
          bedCategories={(rawData.hospitals || []).flatMap(
            (h) => h.BedCategory || []
          )}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading hospital data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h1>
          <p className="text-gray-600 mb-4">
            Failed to load hospital analytics data. Please check your database
            connection.
          </p>
          <p className="text-sm text-gray-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }
}
