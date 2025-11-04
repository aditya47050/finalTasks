import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Fetch single insurance record
export async function GET(request, { params }) {
  try {
    const { healthinsuranceid } = params // fixed typo
    const id = healthinsuranceid

    const insurance = await db.HealthInsurance.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    })

    if (!insurance) {
      return NextResponse.json({ error: "Insurance record not found" }, { status: 404 })
    }

    return NextResponse.json(insurance)
  } catch (error) {
    console.error("Error fetching insurance:", error)
    return NextResponse.json({ error: "Failed to fetch insurance record" }, { status: 500 })
  }
}

// PUT - Update insurance record
export async function PUT(request, { params }) {
  try {
    const { healthinsuranceid } = params
    const id = healthinsuranceid
    const body = await request.json()

    const insurance = await db.HealthInsurance.update({
      where: { id },
      data: {
        policyNumber: body.policyNumber,
        document: body.document,
        coverage: body.coverage,
        coverAmount: body.coverAmount,
        copay: body.copay,
        startingAmount: body.startingAmount,
        discount: body.discount,
        category: body.category,
        diseaseCategory: body.diseaseCategory, // new field added
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

    return NextResponse.json(insurance)
  } catch (error) {
    console.error("Error updating insurance:", error)
    return NextResponse.json({ error: "Failed to update insurance record" }, { status: 500 })
  }
}

// DELETE - Delete insurance record
export async function DELETE(request, { params }) {
  try {
    const { healthinsuranceid } = params // fixed typo
    const id = healthinsuranceid

    await db.HealthInsurance.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Insurance record deleted successfully" })
  } catch (error) {
    console.error("Error deleting insurance:", error)
    return NextResponse.json({ error: "Failed to delete insurance record" }, { status: 500 })
  }
}
