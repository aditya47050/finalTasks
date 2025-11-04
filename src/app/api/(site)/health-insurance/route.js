import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Fetch all insurance records
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const whereClause = {}

    if (category && category !== "all") {
      whereClause.category = category
    }

    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { policyNumber: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { diseaseCategory: { contains: search, mode: "insensitive" } }, // include diseaseCategory in search
      ]
    }

    const insurances = await db.HealthInsurance.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(insurances)
  } catch (error) {
    console.error("Error fetching insurances:", error)
    return NextResponse.json({ error: "Failed to fetch insurance records" }, { status: 500 })
  }
}

// POST - Create new insurance record
export async function POST(request) {
  try {
    const body = await request.json()

    const insurance = await db.HealthInsurance.create({
      data: {
        policyNumber: body.policyNumber,
        document: body.document,
        coverage: body.coverage,
        coverAmount: body.coverAmount,
        copay: body.copay,
        startingAmount: body.startingAmount,
        discount: body.discount,
        category: body.category,
        diseaseCategory: body.diseaseCategory, // new field included
        companyName: body.companyName,
        insuranceType: body.insuranceType,
        insurancePackage: body.insurancePackage,
        budgetRange: body.budgetRange,
        headOffice: body.headOffice,
        contactNumber: body.contactNumber,
        networkHospitals: body.networkHospitals ? Number.parseInt(body.networkHospitals) : null,
        facilities: body.facilities,
        requiredDocs: body.requiredDocs,
        beneficiaryCount: body.beneficiaryCount ? Number.parseInt(body.beneficiaryCount) : null,
        complaints: body.complaints,
        description: body.description,
        logo: body.logo,
      },
    })

    return NextResponse.json(insurance, { status: 201 })
  } catch (error) {
    console.error("Error creating insurance:", error)
    return NextResponse.json({ error: "Failed to create insurance record" }, { status: 500 })
  }
}
