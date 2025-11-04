// src/app/(slug)/pathology/nabl-labs/page.jsx
import { db } from "@/lib/db";
import NablLabsMainClient from "./component/nabllabsmainclient";
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

  // Fetch all NABL accredited labs with their hospital information
  const nablLabs = await db.labTest.findMany({
    where: { nabl: true },
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
          BookLabTest: true,
        },
      },
    },
  });

  // Process NABL labs to add counts and experience
  const processedNablLabs = nablLabs.map((lab) => ({
    ...lab,
    bookingCount: lab._count.BookLabTest,
    reviewsCount: lab.Hospital?._count?.reviews || 0,
    experience: lab.Hospital?.hspInfo?.experience || 0,
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
    <div className="font-poppins my-4 md:container">
      <h1 className="md:text-[25px] text-[20px] text-center text-[#5271FF] font-extrabold">
        NABL Accredited Labs
      </h1>
      <NablLabsMainClient
        nablLabs={processedNablLabs}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        patientId={patient?.id ?? null}
        patientCity={patient?.city ?? null}
        hospitalCategories={hospitalCategories}
      />
    </div>
  );
};

export default Page;
