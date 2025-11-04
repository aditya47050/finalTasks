import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.hospitalid;

  try {
    // Await params properly if needed (per Next.js doc)
    // If params is a Promise, do: const { hospitalid } = await params;

    const data = await request.formData();

    const regname = data.get("regname");
    const hspregno = data.get("hspregno");
    const totalambulance = data.get("totalambulance");
    const onlineconsultation = data.get("onlineconsultation");
    const homehealthcare = data.get("homehealthcare");
    const pharmacy = data.get("pharmacy");
    const pathology = data.get("pathology");
    const diagnosticservices = data.get("diagnosticservices");
    const cashlessservices = data.get("cashlessservices");
    const governmentschemes = data.get("governmentschemes");
    const inhousecanteen = data.get("inhousecanteen");

    // Get category titles from formData (assuming hspcategory[] for both)
    const hspcategoryTitles = data.getAll("hspcategory[]");
    const diagnosticcategoryTitles = data.getAll("hspcategory[]");

    const hospital = await db.Hospital.findUnique({
      where: { id },
      include: { hspInfo: true, hspdetails: true },
    });

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found." }, { status: 404 });
    }

    const role = hospital.role;
    const categoryTitles =
      role === "DiagnosticCenter" ? diagnosticcategoryTitles : hspcategoryTitles;

    const categories = await (role === "DiagnosticCenter"
      ? db.DiagnosticCenterCategory.findMany({
          where: { title: { in: categoryTitles } },
          select: { id: true },
        })
      : db.HospitalsCategory.findMany({
          where: { title: { in: categoryTitles } },
          select: { id: true },
        }));

    const categoryIds = categories.map((cat) => cat.id);

    if (categoryTitles.length > 0 && categoryIds.length === 0) {
      return NextResponse.json({ error: "No matching category found." }, { status: 400 });
    }

    // Shared HspInfo update data
    const updateData = {
      regname,
      totalambulance,
      onlineconsultation,
      homehealthcare,
      pharmacy,
      pathology,
      diagnosticservices,
      cashlessservices,
      governmentschemes,
      inhousecanteen,
    };

    let updatedHspInfo;

    if (hospital.hspInfo) {
      // Delete old HspCategory links
      const deletedCount = await db.HspCategory.deleteMany({
        where: { hspInfoId: hospital.hspInfo.id },
      });
     

      // Add new HspCategory relations if any
      if (categoryIds.length > 0) {
        updateData.hspcategory = {
          create: categoryIds.map((categoryId) =>
            role === "DiagnosticCenter"
              ? { diagnosticcategory: { connect: { id: categoryId } } }
              : { hspcategory: { connect: { id: categoryId } } }
          ),
        };
      }

      updatedHspInfo = await db.HspInfo.update({
        where: { id: hospital.hspInfo.id },
        data: updateData,
      });

      await db.Hspdetails.update({
        where: { id: hospital.hspdetails.id },
        data: { hspregno },
      });
    } else {
      // Create new HspInfo if missing
      updatedHspInfo = await db.HspInfo.create({
        data: {
          ...updateData,
          hospital: { connect: { id } },
          hspcategory:
            categoryIds.length > 0
              ? {
                  create: categoryIds.map((categoryId) =>
                    role === "DiagnosticCenter"
                      ? { diagnosticcategory: { connect: { id: categoryId } } }
                      : { hspcategory: { connect: { id: categoryId } } }
                  ),
                }
              : undefined,
        },
      });

      await db.Hspdetails.update({
        where: { id: hospital.hspdetails.id },
        data: { hspregno },
      });

      await db.Hospital.update({
        where: { id },
        data: { hspInfoId: updatedHspInfo.id },
      });
    }

    return NextResponse.json(updatedHspInfo);
  } catch (error) {
    console.error("Error updating hospital:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
