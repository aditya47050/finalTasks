import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const id = params.doctorid;

  try {
    const data = await request.formData();

    // Extract form data
    const firstName = data.get("firstName");
    const middleName = data.get("middleName");
    const lastName = data.get("lastName");
    const dateOfBirthRaw = data.get("dateOfBirth");
    const gender = data.get("gender");
    const alternatemobileno = data.get("alternatemobileno");
    const education = data.get("education");
    const totalexperience = data.get("totalexperience");
    const degreecertificate = data.get("degreecertificate");
    const registrationcertificate = data.get("registrationcertificate");
    const specialitydegreecertificate = data.get("specialitydegreecertificate");
    const registrationdateRaw = data.get("registrationdate");
    const regrenewaldateRaw = data.get("regrenewaldate");
    const regno = data.get("regno");

    // Validate required fields
    if (!firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // **Handling Multiple Specialty Types**
    const specialitytypeTitles = data.getAll("specialitytype[]"); // Get all selected specialties

    // Find matching specialties in the database
    const specialityCategories = await db.expertDoctorsCategory.findMany({
      where: { title: { in: specialitytypeTitles } },
      select: { id: true }, // Get only the IDs
    });

    const specialitytypeIds = specialityCategories.map((cat) => cat.id); // Extract IDs

    if (!specialitytypeIds.length) {
      return NextResponse.json(
        { error: "Specialty categories not found." },
        { status: 400 }
      );
    }

    console.log("Selected Speciality IDs:", specialitytypeIds);

    // **Format Date Fields**
    const formatDate = (dateRaw) => {
      if (typeof dateRaw === "string" && dateRaw.trim() !== "") {
        const parsedDate = new Date(dateRaw);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        } else {
          throw new Error(`Invalid date format: ${dateRaw}`);
        }
      }
      return null;
    };

    const dateOfBirth = formatDate(dateOfBirthRaw);
    const registrationdate = formatDate(registrationdateRaw);
    const regrenewaldate = formatDate(regrenewaldateRaw);

    // **Fetch Existing Doctor**
    const doctor = await db.doctor.findUnique({ where: { id } });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
    }

    // **Update Doctor Record with Specialties**
    const updatedDoctor = await db.doctor.update({
      where: { id },
      data: {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        alternatemobileno,
        education,
        totalexperience,
        degreecertificate,
        registrationcertificate,
        specialitydegreecertificate,
        registrationdate,
        regrenewaldate,
        regno,

        specialities: {
          deleteMany: {}, // Remove existing relations to avoid duplicates
          create: specialitytypeIds.map((specialityId) => ({
            speciality: { connect: { id: specialityId } }, // Connect existing speciality
          })),
        },
      },
    });

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error("Error updating Doctor info:", error);
    return NextResponse.json(
      { error: "An error occurred: " + error.message },
      { status: 500 }
    );
  }
}
