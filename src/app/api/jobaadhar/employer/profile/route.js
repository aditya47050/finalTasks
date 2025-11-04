import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/getsession"

// helper: upsert tags, benefits, ratings
async function upsertRelations(companyId, data) {
  // ---- TAGS ----
  if (Array.isArray(data.tags) && data.tags.length > 0) {
    const tagRecords = await Promise.all(
      data.tags.map((name) =>
        db.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    )

    // Remove old tags and link new ones
    await db.tagOnCompany.deleteMany({ where: { companyId } })
    await db.tagOnCompany.createMany({
      data: tagRecords.map((t) => ({ companyId, tagId: t.id })),
    })
  }

  // ---- BENEFITS ----
  if (Array.isArray(data.benefits) && data.benefits.length > 0) {
    const benefitRecords = await Promise.all(
      data.benefits.map((name) =>
        db.benefit.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    )

    await db.benefitOnCompany.deleteMany({ where: { companyId } })
    await db.benefitOnCompany.createMany({
      data: benefitRecords.map((b) => ({ companyId, benefitId: b.id })),
    })
  }

  // ---- RATING ----
  if (data.rating) {
    const safe = {
      culture: Number(data.rating.culture ?? 0),
      skillDevelopment: Number(data.rating.skillDevelopment ?? 0),
      workSatisfaction: Number(data.rating.workSatisfaction ?? 0),
      workLife: Number(data.rating.workLife ?? 0),
      careerGrowth: Number(data.rating.careerGrowth ?? 0),
      jobSecurity: Number(data.rating.jobSecurity ?? 0),
    }

    // Upsert rating by companyId
    const existingRating = await db.employeeRating.findUnique({
      where: { companyId },
    })

    if (existingRating) {
      await db.employeeRating.update({
        where: { companyId },
        data: safe,
      })
    } else {
      await db.employeeRating.create({
        data: { ...safe, companyId },
      })
    }
  }
}


// helper: upsert employer documents
async function upsertDocuments(employerId, docs) {
  if (!Array.isArray(docs) || docs.length === 0) return;

  for (const doc of docs) {
    const { type, fileUrl, verified = false } = doc;

    // delete any existing doc of this type for this employer
    await db.document.deleteMany({ where: { employerId, type } });

    // create new doc
    await db.document.create({ data: { employerId, type, fileUrl, verified } });
  }
}



export async function PATCH(req) {
  try {
    const body = await req.json()
    const session = await getSession()
    const userId = session?.id
    if (!userId) {
      return NextResponse.json({ error: "No userId in session/body" }, { status: 401 })
    }

    const { companyId, data, documents } = body

    // find or create employer
    let employer = await db.employer.findUnique({ where: { userId } })
    if (!employer) {
      employer = await db.employer.create({ data: { userId } })
    }

    const companyData = {
      name: data.name,
      logoUrl: data.logoUrl,
      founded: data.founded,
      about: data.about,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      district: data.district,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      mission: data.mission,
      values: data.values,
      culture: data.culture,
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
    }

    let company
    if (companyId) {
      const existing = await db.company.findUnique({ where: { id: companyId } })
      if (!existing) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 })
      }
      company = await db.company.update({
        where: { id: companyId },
        data: companyData,
      })
    } else {
      company = await db.company.create({ data: companyData })
      await db.employer.update({
        where: { id: employer.id },
        data: { companyId: company.id },
      })
    }

    // Step 3: update tags, benefits, ratings, and documents
    await upsertRelations(company.id, data)
    await upsertDocuments(employer.id, documents)

    return NextResponse.json({ ok: true, company })
  } catch (err) {
    console.error("PATCH /api/jobaadhar/employer/profile error:", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const session = await getSession()
    const userId = session?.id
    if (!userId) {
      return NextResponse.json({ error: "No userId in session/body" }, { status: 401 })
    }

    const { companyId, data, documents } = body

    // find or create employer
    let employer = await db.employer.findUnique({ where: { userId } })
    if (!employer) {
      employer = await db.employer.create({ data: { userId } })
    }

    const companyData = {
      name: data.name,
      logoUrl: data.logoUrl,
      founded: data.founded,
      about: data.about,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      district: data.district,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      mission: data.mission,
      values: data.values,
      culture: data.culture,
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
    }

    let company
    if (companyId) {
      const existing = await db.company.findUnique({ where: { id: companyId } })
      if (!existing) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 })
      }
      company = await db.company.update({
        where: { id: companyId },
        data: companyData,
      })
    } else {
      company = await db.company.create({ data: companyData })
    }

    // link employer to company if not linked already
    if (employer.companyId !== company.id) {
      await db.employer.update({
        where: { id: employer.id },
        data: { companyId: company.id },
      })
    }

    // Step 3: update tags, benefits, ratings, and documents
    await upsertRelations(company.id, data)
    await upsertDocuments(employer.id, documents)

    return NextResponse.json({ ok: true, company })
  } catch (err) {
    console.error("POST /api/jobaadhar/employer/profile error:", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}