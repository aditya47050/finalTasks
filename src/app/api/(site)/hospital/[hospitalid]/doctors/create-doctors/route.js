import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateSecurePassword } from "@/lib/utils/passwordGenerator";
import { sendPasswordEmail } from "@/lib/utils/sendrandompasswordmail";
// Helper function to fetch hospital details directly from the database using hospitalId
async function getHospitalDetails(hospitalId) {
  return await db.hospital.findUnique({
    where: { id: hospitalId },
    select: {
      mobile: true,

      pincode: true,

      hspInfo: { select: { regname: true } },
      hspcontact: {
        select: { city: true, state: true, dist: true, taluka: true },
      },
    },
  });
}

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      email,
      contactNumber,
      pincode,
      firstName,
      middleName,
      lastName,
      mmc,
      specialtyId,
      consultationFee,
      hospitalId,
      aadharcardno,
      hospitalConsultationDays,
      hospitalInOutTime,
    } = data;
    const mobileno = data.contactNumber;
    // Fetch hospital details for use in doctor creation
    const hospitalDetails = await getHospitalDetails(hospitalId);
    const {
      mobile: hospitalContactNo,
      pincode: hospitalPincode,
      hspInfo,
      hspcontact,
    } = hospitalDetails || {};

    const hospitalName = hspInfo?.regname || "";
    const hospitalCity = hspcontact?.city || "";
    const hospitalState = hspcontact?.state || "";
    const hospitalDistrict = hspcontact?.dist || "";
    const hospitalTaluka = hspcontact?.taluka || "";

    // Generate and hash password
    const password = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Doctor
    const doctor = await db.doctor.create({
      data: {
        email,
        mobile: mobileno,
        password: hashedPassword,
        pincode,
        firstName,
        middleName,
        lastName,
        regno: mmc,
        specialities: {
          create: {
            speciality: {
              connect: { id: specialtyId },
            },
          },
        },
        doctorinfo: {
          create: {
            consultationfee: consultationFee,
            aadharcardno,
          },
        },
        doctorvisitinghospitals: {
          create: {
            hospitalname: hospitalName,
            hospitalconsultationfee: consultationFee,
            hospitalcontactno: hospitalContactNo,

            city: hospitalCity,
            state: hospitalState,
            pincode: hospitalPincode,
            district: hospitalDistrict,
            taluka: hospitalTaluka,
          },
        },
        HospitalDoctor: {
          create: {
            hospitalId,
            status: "PENDING",
          }
        }
      },
    });

    // Send password via email
    await sendPasswordEmail(email, password || "", "Doctor");

    return NextResponse.json({ success: true, doctorId: doctor.id });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
