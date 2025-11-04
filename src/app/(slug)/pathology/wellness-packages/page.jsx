import { db } from "@/lib/db";
import WellnessPackageClient from "../wellness-packages/components/wellnesspackageclient";
import { getSession } from "@/lib/getsession";

const Page = async () => {
  const session = await getSession();
  
  // Get patient city if session exists
  let patientCity = null;
  if (session?.email) {
    const patient = await db.patient.findFirst({
      where: { email: session.email },
      select: { city: true },
    });
    patientCity = patient?.city;
  }

  // Fetch all wellness packages with their hospital information and counts
  const wellnessPackages = await db.wellnesspackage.findMany({
    include: {
      Hospital: {
        include: {
          hspdetails: true,
          hspcontact: true,
          hspInfo: true,
          _count: {
            select: {
              BookWellnesspackage: true,
              reviews: true, 
            },
          },
        },
      },
      _count: {
        select: {
          BookWellnesspackage: true,
        },
      },
    },
  });
  

  // Fetch state, district, and subdistrict information
  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

  // Process packages with additional data
  const processedPackages = wellnessPackages.map(pkg => ({
    ...pkg,
    bookingCount: pkg._count.BookWellnesspackage,
    hospitalBookingCount: pkg.Hospital?._count?.BookWellnesspackage || 0,
    reviewsCount: pkg.Hospital?._count?.reviews || 0,
    experience: pkg.Hospital?.hspInfo?.experience || 0,
  }));

const hospitalCategories = await db.hospitalsCategory.findMany({
  select: {
    id: true,
    title: true,
  },
});

  return (
    <div className="">
      <h1 className="md:text-[25px] text-[20px] text-center font-extrabold bg-gradient-to-r from-[#1e40af] to-[#10b981] bg-clip-text text-transparent">
        Wellness Packages
      </h1>


      <WellnessPackageClient
        packages={processedPackages}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        patientCity={patientCity}
        hospitalCategories={hospitalCategories} 
      />
    </div>
  );
};

export default Page;