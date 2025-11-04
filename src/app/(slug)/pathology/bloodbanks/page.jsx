// src/app/(slug)/pathology/bloodbanks/page.jsx
import { db } from "@/lib/db";
import BloodBankMainClient from "./bloodbankclient";
import { getSession } from "@/lib/getsession";

const Page = async () => {
  const session = await getSession();
  
  let patient = null;
  if (session?.email) {
    patient = await db.patient.findFirst({
      where: { email: session.email },
      select: { id: true, city: true },
    });
  }

  // Fetch all blood banks with their hospital information
// Fetch all blood banks with their hospital information
const bloodBanks = await db.bloodbank.findMany({
  include: {
    Hospital: {
      include: {
        hspdetails: true,
        hspcontact: true,
        hspInfo: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    },
    _count: {
      select: {
        BookBloodbank: true, // ✅ match the exact Prisma schema
      },
    },
  },
});

// Process blood banks to add counts and experience
const processedBloodBanks = (bloodBanks || []).map(bank => ({
  ...bank,
  bookingCount: bank._count?.BookBloodbank || 0, // ✅ match exact field
  reviewsCount: bank.Hospital?._count?.reviews || 0,
  experience: bank.Hospital?.hspInfo?.experience || 0,
}));


  // Fetch state, district, and subdistrict information
  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

  const hospitalCategories = await db.hospitalsCategory.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <>
      <BloodBankMainClient
        bloodBanks={processedBloodBanks}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        patientId={patient?.id ?? null}
        patientCity={patient?.city ?? null}
        hospitalCategories={hospitalCategories} 
      />
    </>
  );
};

export default Page;