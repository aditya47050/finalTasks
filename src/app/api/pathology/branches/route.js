import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all pathology hospitals with their branches
    const pathologyHospitals = await db.hospital.findMany({
      where: {
        role: "Pathology",
        approvalStatus: {
          in: ["APPROVED", "SUBMITTED"],
        },
      },
      include: {
        hspInfo: true,
        hspdetails: true,
        hspcontact: true,
        hspbranches: true,
        HospitalReview: true,
        _count: {
          select: {
            hspbranches: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter hospitals that have branches and map the data
    const hospitalsWithBranches = pathologyHospitals.filter(
      (hospital) => hospital.hspbranches && hospital.hspbranches.length > 0
    );

    // Map hospital and branch data
    const branchesData = [];
    
    hospitalsWithBranches.forEach((hospital) => {
      hospital.hspbranches.forEach((branch) => {
        branchesData.push({
          id: branch.id,
          branchName: branch.branchname || "Branch",
          branchRegNo: branch.branchregno || "N/A",
          branchCity: branch.branchcity || branch.city || "City",
          branchState: branch.state || "State",
          branchDistrict: branch.district || "District",
          branchTaluka: branch.taluka || "Taluka",
          branchPincode: branch.branchpincode || "000000",
          branchAddress: branch.branchaddress || "Address",
          branchReceptionNo1: branch.branchreceptionno1 || null,
          branchReceptionNo2: branch.branchreceptionno2 || null,
          branchReceptionEmail: branch.branchreceptionemail || null,
          branchManagerName: branch.branchmanagername || null,
          branchManagerNo: branch.branchmanagerno || null,
          branchManagerEmail: branch.branchmanageremail || null,
          branchAdminName: branch.branchadminname || null,
          branchAdminNo: branch.branchadminno || null,
          branchAdminEmail: branch.branchadminemail || null,
          createdAt: branch.createdAt,
          hospital: {
            id: hospital.id,
            name: hospital.hspInfo?.regname || "Pathology Lab",
            logo: hospital.hspdetails?.hsplogo || null,
            mobile: hospital.mobile,
            email: hospital.email,
            experience: hospital.hspInfo?.experience || "0",
            mainAddress: hospital.hspcontact?.address || "Main Branch",
            mainCity: hospital.hspcontact?.city || "City",
            mainState: hospital.hspcontact?.state || "State",
            mainPincode: hospital.hspcontact?.pincode || "000000",
            totalBranches: hospital._count.hspbranches,
            nabl: hospital.hspdetails?.nabhnablapproved === "Yes",
            nablLevel: hospital.hspdetails?.nabhnabllevel || null,
            avgRating: hospital.HospitalReview && hospital.HospitalReview.length > 0
              ? (hospital.HospitalReview.reduce((sum, review) => sum + (review.rating || 0), 0) / hospital.HospitalReview.length).toFixed(1)
              : "4.5",
            totalReviews: hospital.HospitalReview?.length || 0,
          },
        });
      });
    });

    // Group by hospital
    const hospitalStats = {};
    let totalBranches = branchesData.length;

    branchesData.forEach((branch) => {
      const hospitalId = branch.hospital.id;
      
      if (!hospitalStats[hospitalId]) {
        hospitalStats[hospitalId] = {
          hospital: branch.hospital,
          branches: [],
          cities: new Set(),
          states: new Set(),
        };
      }

      hospitalStats[hospitalId].branches.push(branch);
      hospitalStats[hospitalId].cities.add(branch.branchCity);
      hospitalStats[hospitalId].states.add(branch.branchState);
    });

    // Convert to array
    const groupedByHospital = Object.values(hospitalStats).map((stat) => ({
      hospital: stat.hospital,
      totalBranches: stat.branches.length,
      branches: stat.branches,
      cities: Array.from(stat.cities),
      states: Array.from(stat.states),
    }));

    return NextResponse.json({
      success: true,
      data: branchesData,
      grouped: groupedByHospital,
      total: branchesData.length,
      uniqueHospitals: groupedByHospital.length,
      totalBranches: totalBranches,
      statistics: {
        totalBranches: totalBranches,
        totalHospitals: groupedByHospital.length,
        averageBranchesPerHospital: Math.round(totalBranches / groupedByHospital.length) || 0,
        cities: [...new Set(branchesData.map((b) => b.branchCity))],
        states: [...new Set(branchesData.map((b) => b.branchState))],
        totalCities: [...new Set(branchesData.map((b) => b.branchCity))].length,
        totalStates: [...new Set(branchesData.map((b) => b.branchState))].length,
      },
    });
  } catch (error) {
    console.error("Error fetching pathology branches:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pathology branches",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

