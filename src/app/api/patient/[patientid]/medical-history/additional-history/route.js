import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const formData = await request.json();
  const patientId = params.patientid;

  // Validate that form data exists
  if (!formData) {
    return NextResponse.json(
      { success: false, message: "No form data provided" },
      { status: 400 }
    );
  }

  // Extract relevant data from the form
  const {
    diabetes,
    hypoglycemia,
    emphysema,
    immunosuppressantCondition,
    hearingImpairment,
    heartAttack,
    kidneyProblems,
    multipleSclerosis,
    liverGallbladderProblems,
    osteoporosis,
    metalImplants,
    parkinsonsDisease,
    nauseaVomiting,
    peripheralVascularDisease,
    pacemaker,
    strokeOrTia,
    pregnancy,
    upperGastrointestinalDisease,
    ringingInYourEars,
    sexualDysfunction,
    visualImpairment,
    skinAbnormalities,
    smoking,
    specialDietGuidelines,
    tuberculosis,
    tuberculosisvalue,
  } = formData;

  try {
    // Check if a record already exists for the patientId
    const existingMedicalHistory = await db.MedicalHistory.findUnique({
      where: {
        patientId: patientId, // Searching based on patientId
      },
    });

    if (existingMedicalHistory) {
      // Extract the `id` of the existing record
      const medicalHistoryId = existingMedicalHistory.id;
  

      // Update the record using its `id`
      const updatedMedicalHistory = await db.MedicalHistory.update({
        where: {
          id: medicalHistoryId, // Updating the record based on its id
        },
        data: {
          diabetes,
          hypoglycemia,
          emphysema,
          immunosuppressantCondition,
          hearingImpairment,
          heartAttack,
          kidneyProblems,
          multipleSclerosis,
          liverGallbladderProblems,
          osteoporosis,
          metalImplants,
          parkinsonsDisease,
          nauseaVomiting,
          peripheralVascularDisease,
          pacemaker,
          strokeOrTia,
          pregnancy,
          upperGastrointestinalDisease,
          ringingInYourEars,
          sexualDysfunction,
          visualImpairment,
          skinAbnormalities,
          smoking,
          specialDietGuidelines,
          tuberculosis,
          tuberculosisvalue,
        },
      });

      return NextResponse.json(
        { success: true, message: "Step 2 data updated successfully" },
        { status: 200 }
      );
    } else {
      // If no record exists, create a new one
      const newMedicalHistoryStep2 = await db.MedicalHistory.create({
        data: {
          patientId, // Include the patientId in the new record
          diabetes,
          hypoglycemia,
          emphysema,
          immunosuppressantCondition,
          hearingImpairment,
          heartAttack,
          kidneyProblems,
          multipleSclerosis,
          liverGallbladderProblems,
          osteoporosis,
          metalImplants,
          parkinsonsDisease,
          nauseaVomiting,
          peripheralVascularDisease,
          pacemaker,
          strokeOrTia,
          pregnancy,
          upperGastrointestinalDisease,
          ringingInYourEars,
          sexualDysfunction,
          visualImpairment,
          skinAbnormalities,
          smoking,
          specialDietGuidelines,
          tuberculosis,
          tuberculosisvalue,
        },
      });

      return NextResponse.json(
        { success: true, message: "Step 2 data submitted successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error saving Step 2 data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit Step 2 data" },
      { status: 500 }
    );
  }
}
