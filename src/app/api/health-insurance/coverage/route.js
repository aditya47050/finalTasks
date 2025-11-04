import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Fetch all health insurance plans with coverage details
    const allInsurancePlans = await db.healthInsurance.findMany({
      where: {
        isAvailable: {
          not: false,
        },
      },
      include: {
        reviews: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map insurance data with coverage information
    const coverageData = allInsurancePlans.map((insurance) => ({
      id: insurance.id,
      companyName: insurance.companyName || "Insurance Provider",
      logo: insurance.logo || null,
      category: insurance.category || "general",
      coverage: insurance.coverage || "Comprehensive Coverage",
      facilities: insurance.facilities || null,
      coverAmount: insurance.coverAmount || null,
      startingAmount: insurance.startingAmount || "5000",
      copay: insurance.copay || null,
      discount: insurance.discount || null,
      budgetRange: insurance.budgetRange || null,
      contactNumber: insurance.contactNumber || null,
      email: insurance.email || null,
      website: insurance.website || null,
      totalReviews: insurance._count.reviews || 0,
      avgRating: insurance.reviews && insurance.reviews.length > 0
        ? (insurance.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / insurance.reviews.length).toFixed(1)
        : "4.5",
      coverageFeatures: {
        hospitalization: true,
        preExisting: insurance.coverage?.toLowerCase().includes('pre-existing') || insurance.coverage?.toLowerCase().includes('pre existing'),
        daycare: insurance.coverage?.toLowerCase().includes('daycare') || insurance.coverage?.toLowerCase().includes('day care'),
        ambulance: insurance.coverage?.toLowerCase().includes('ambulance'),
        maternity: insurance.coverage?.toLowerCase().includes('maternity') || insurance.coverage?.toLowerCase().includes('pregnancy'),
        critical: insurance.coverage?.toLowerCase().includes('critical'),
        cashless: true,
        familyFloater: insurance.coverage?.toLowerCase().includes('family'),
      },
    }));

    // Group by category
    const categoryStats = {};
    let totalPlans = coverageData.length;

    coverageData.forEach((plan) => {
      const category = plan.category;
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          category: category,
          plans: [],
          totalPlans: 0,
          avgRating: 0,
        };
      }

      categoryStats[category].plans.push(plan);
      categoryStats[category].totalPlans++;
    });

    // Convert to array
    const groupedByCategory = Object.values(categoryStats).map((stat) => {
      const avgRating = stat.plans.reduce((sum, p) => sum + parseFloat(p.avgRating || 0), 0) / stat.plans.length;
      return {
        category: stat.category,
        categoryLabel: stat.category === 'government' ? 'Government Insurance' :
                      stat.category === 'private' ? 'Private Insurance' :
                      stat.category === 'tpa' ? 'TPA Insurance' : 'Health Insurance',
        totalPlans: stat.totalPlans,
        plans: stat.plans,
        avgRating: avgRating.toFixed(1),
      };
    });

    // Coverage type statistics
    const coverageTypes = {
      hospitalization: coverageData.filter(p => p.coverageFeatures.hospitalization).length,
      preExisting: coverageData.filter(p => p.coverageFeatures.preExisting).length,
      daycare: coverageData.filter(p => p.coverageFeatures.daycare).length,
      ambulance: coverageData.filter(p => p.coverageFeatures.ambulance).length,
      maternity: coverageData.filter(p => p.coverageFeatures.maternity).length,
      critical: coverageData.filter(p => p.coverageFeatures.critical).length,
      cashless: coverageData.filter(p => p.coverageFeatures.cashless).length,
      familyFloater: coverageData.filter(p => p.coverageFeatures.familyFloater).length,
    };

    return NextResponse.json({
      success: true,
      data: coverageData,
      grouped: groupedByCategory,
      total: coverageData.length,
      totalPlans: totalPlans,
      statistics: {
        totalPlans: totalPlans,
        governmentPlans: coverageData.filter(p => p.category === 'government').length,
        privatePlans: coverageData.filter(p => p.category === 'private').length,
        tpaPlans: coverageData.filter(p => p.category === 'tpa').length,
        averageRating: coverageData.length > 0
          ? (coverageData.reduce((sum, p) => sum + parseFloat(p.avgRating || 0), 0) / coverageData.length).toFixed(1)
          : "4.5",
        coverageTypes: coverageTypes,
      },
    });
  } catch (error) {
    console.error("Error fetching insurance coverage:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch insurance coverage",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

