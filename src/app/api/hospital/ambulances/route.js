import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    console.log("🔍 Fetching hospital ambulances...");
    
    // Fetch all hospitals with their ambulances through HospitalAmbulance relation
    const hospitalsWithAmbulances = await db.hospital.findMany({
      where: {
        approvalStatus: {
          in: ["APPROVED", "SUBMITTED"],
        },
      },
      include: {
        hspInfo: true,
        hspdetails: true,
        hspcontact: true,
        HospitalReview: true,
        HospitalAmbulance: {
          include: {
            ambulance: {
              include: {
                AmbulanceVaichicle: true,
                AmbulanceDriver: true,
              },
            },
          },
        },
        _count: {
          select: {
            HospitalAmbulance: true,
            hspbranches: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("✅ Total hospitals found:", hospitalsWithAmbulances.length);

    // Filter hospitals that have ambulances
    const hospitalsWithActiveAmbulances = hospitalsWithAmbulances.filter(
      (hospital) => hospital.HospitalAmbulance && hospital.HospitalAmbulance.length > 0
    );
    
    console.log("✅ Hospitals with ambulances:", hospitalsWithActiveAmbulances.length);

    // Map ambulance data
    const ambulancesData = [];
    
    hospitalsWithActiveAmbulances.forEach((hospital) => {
      hospital.HospitalAmbulance.forEach((hospitalAmbulance) => {
        const ambulance = hospitalAmbulance.ambulance;
        
        if (!ambulance) return; // Skip if ambulance is null
        
        // Get ambulance vehicles for this ambulance
        const vehicles = ambulance.AmbulanceVaichicle || [];
        
        // If no vehicles, create a single entry with ambulance info
        if (vehicles.length === 0) {
          const driver = ambulance.AmbulanceDriver?.[0] || null;
          
          ambulancesData.push({
            id: ambulance.id,
            ambulanceType: "Ambulance Service",
            ambulanceCategory: "Emergency",
            ambulanceRCNo: "N/A",
            ambulanceModel: null,
            ambulanceCharges: null,
            finalCharge: null,
            discount: null,
            driverName: driver ? `${driver.firstname || ''} ${driver.lastname || ''}`.trim() : null,
            driverLicense: driver?.drivinglicence || null,
            driverContact: driver?.mobile || null,
            driverPhoto: driver?.photo || null,
            imageFront: null,
            imageBack: null,
            imageLeft: null,
            imageRight: null,
            imageInternal: null,
            rcBookImage: null,
            facilities: null,
            isOnline: false,
            available: true,
            createdAt: ambulance.createdAt,
            hospital: {
              id: hospital.id,
              name: hospital.hspInfo?.regname || "Hospital",
              logo: hospital.hspdetails?.hsplogo || null,
              mobile: hospital.mobile,
              email: hospital.email,
              experience: hospital.hspInfo?.experience || "0",
              address: hospital.hspcontact?.address || "Address",
              city: hospital.hspcontact?.city || "City",
              state: hospital.hspcontact?.state || "State",
              pincode: hospital.hspcontact?.pincode || "000000",
              district: hospital.hspcontact?.dist || "District",
              totalAmbulances: hospital._count.HospitalAmbulance,
              totalBranches: hospital._count.hspbranches,
              nabl: hospital.hspdetails?.nabhnablapproved === "Yes",
              avgRating: hospital.HospitalReview && hospital.HospitalReview.length > 0
                ? (hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / hospital.HospitalReview.length).toFixed(1)
                : "4.5",
              totalReviews: hospital.HospitalReview?.length || 0,
            },
          });
          return;
        }
        
        vehicles.forEach((vehicle) => {
          // Get driver info if available
          const driver = vehicle.driver || ambulance.AmbulanceDriver?.[0] || null;
          
          ambulancesData.push({
            id: vehicle.id,
            ambulanceType: vehicle.ambulancetype || "Ambulance",
            ambulanceCategory: vehicle.ambulancecategory || "Emergency",
            ambulanceRCNo: vehicle.ambulancercno || "N/A",
            ambulanceModel: vehicle.ambulancemodel || null,
            ambulanceCharges: vehicle.ambulancecharges || null,
            finalCharge: vehicle.ambulancefinalcharge || null,
            discount: vehicle.ambulancediscount || null,
            driverName: driver ? `${driver.firstname || ''} ${driver.lastname || ''}`.trim() : null,
            driverLicense: driver?.drivinglicence || null,
            driverContact: driver?.mobile || null,
            driverPhoto: driver?.photo || null,
            imageFront: vehicle.ambulanceimagefront || null,
            imageBack: vehicle.ambulanceimageback || null,
            imageLeft: vehicle.ambulanceimageleft || null,
            imageRight: vehicle.ambulanceimageright || null,
            imageInternal: vehicle.ambulanceimageinternal || null,
            rcBookImage: vehicle.ambulancercbook || null,
            facilities: vehicle.facilities || null,
            isOnline: vehicle.isOnline || false,
            available: vehicle.status === "AVAILABLE",
            createdAt: vehicle.createdAt,
            hospital: {
              id: hospital.id,
              name: hospital.hspInfo?.regname || "Hospital",
              logo: hospital.hspdetails?.hsplogo || null,
              mobile: hospital.mobile,
              email: hospital.email,
              experience: hospital.hspInfo?.experience || "0",
              address: hospital.hspcontact?.address || "Address",
              city: hospital.hspcontact?.city || "City",
              state: hospital.hspcontact?.state || "State",
              pincode: hospital.hspcontact?.pincode || "000000",
              district: hospital.hspcontact?.dist || "District",
              totalAmbulances: hospital._count.HospitalAmbulance,
              totalBranches: hospital._count.hspbranches,
              nabl: hospital.hspdetails?.nabhnablapproved === "Yes",
              avgRating: hospital.HospitalReview && hospital.HospitalReview.length > 0
                ? (hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / hospital.HospitalReview.length).toFixed(1)
                : "4.5",
              totalReviews: hospital.HospitalReview?.length || 0,
            },
          });
        });
      });
    });

    // Group by ambulance type
    const typeStats = {};
    let totalAmbulances = ambulancesData.length;

    ambulancesData.forEach((ambulance) => {
      const type = ambulance.ambulanceType;
      
      if (!typeStats[type]) {
        typeStats[type] = {
          ambulanceType: type,
          ambulances: [],
          hospitals: new Set(),
          cities: new Set(),
          states: new Set(),
          totalCount: 0,
        };
      }

      typeStats[type].ambulances.push(ambulance);
      typeStats[type].totalCount++;
      typeStats[type].hospitals.add(ambulance.hospital.id);
      typeStats[type].cities.add(ambulance.hospital.city);
      typeStats[type].states.add(ambulance.hospital.state);
    });

    // Convert to array
    const groupedByType = Object.values(typeStats).map((stat) => ({
      ambulanceType: stat.ambulanceType,
      totalCount: stat.totalCount,
      totalHospitals: stat.hospitals.size,
      ambulances: stat.ambulances,
      cities: Array.from(stat.cities),
      states: Array.from(stat.states),
    }));

    // Group by hospital
    const hospitalStats = {};
    
    ambulancesData.forEach((ambulance) => {
      const hospitalId = ambulance.hospital.id;
      
      if (!hospitalStats[hospitalId]) {
        hospitalStats[hospitalId] = {
          hospital: ambulance.hospital,
          ambulances: [],
        };
      }

      hospitalStats[hospitalId].ambulances.push(ambulance);
    });

    const groupedByHospital = Object.values(hospitalStats).map((stat) => ({
      hospital: stat.hospital,
      totalAmbulances: stat.ambulances.length,
      ambulances: stat.ambulances,
    }));

    console.log("✅ Total ambulances mapped:", ambulancesData.length);
    console.log("✅ Grouped by type:", groupedByType.length);
    console.log("✅ Grouped by hospital:", groupedByHospital.length);

    const response = {
      success: true,
      data: ambulancesData,
      groupedByType: groupedByType,
      groupedByHospital: groupedByHospital,
      total: ambulancesData.length,
      totalHospitals: hospitalsWithActiveAmbulances.length,
      statistics: {
        totalAmbulances: totalAmbulances,
        totalHospitals: hospitalsWithActiveAmbulances.length,
        ambulanceTypes: ambulancesData.length > 0 ? [...new Set(ambulancesData.map((a) => a.ambulanceType))] : [],
        cities: ambulancesData.length > 0 ? [...new Set(ambulancesData.map((a) => a.hospital.city))] : [],
        states: ambulancesData.length > 0 ? [...new Set(ambulancesData.map((a) => a.hospital.state))] : [],
        totalCities: ambulancesData.length > 0 ? [...new Set(ambulancesData.map((a) => a.hospital.city))].length : 0,
        totalStates: ambulancesData.length > 0 ? [...new Set(ambulancesData.map((a) => a.hospital.state))].length : 0,
      },
    };

    console.log("📤 Returning response with", ambulancesData.length, "ambulances");
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching hospital ambulances:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hospital ambulances",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

