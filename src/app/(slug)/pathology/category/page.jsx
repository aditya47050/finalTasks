// app/pathology/page.jsx
import { db } from "@/lib/db";
import Testclient from "../component/testclient";
import { getSession } from "@/lib/getsession";

const Page = async ({ searchParams }) => {
  const session = await getSession();
  const letter = searchParams?.letter || null;

  // Fetch lab tests with optional letter filter
  const tests = await db.labTest.findMany({
    where: letter
      ? {
          testname: {
            startsWith: letter,
            mode: "insensitive",
          },
        }
      : {},
    include: {
      Hospital: {
        include: {
          hspdetails: true,
          hspcontact: true,
          hspInfo: {
            include: {
              hspcategory: {
                include: {
                  hspcategory: true,
                },
              },
            },
          },
          hspbranches: true,
          _count: {
            select: {
              BookLabTest: true, // total bookings in this hospital (all tests)
              reviews: true,
            },
          },
        },
      },
      _count: {
        select: {
          BookLabTest: true, // total bookings for this particular test
        },
      },
    },
  });

  // Fetch current patient info if logged in
  let patient = null;
  if (session?.email) {
    patient = await db.patient.findFirst({
      where: { email: session.email },
      select: { id: true, city: true },
    });
  }

  // Fetch state/district/subdistrict lists in parallel
  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

  // Process tests to include booking counts and hospital experience
  const processedTests = tests.map((test) => ({
    ...test,
    bookingCount: test._count.BookLabTest, // total bookings of this test
    reviewsCount: test.Hospital?._count?.reviews || 0,
    experience: test.Hospital?.hspInfo?.experience || 0,
  }));

  // Fetch hospital categories
  const hospitalCategories = await db.hospitalsCategory.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <div className="">
      <h1 className="md:text-[25px] text-[20px] text-center text-[#047857] font-extrabold">
        Pathology
      </h1>

      {letter ? (
        <p className="md:text-[20px] text-lg text-center text-[#047857] font-extrabold">
          Lab Test starts with &quot;{letter}&quot; Names
        </p>
      ) : (
        <p className="text-center text-gray-500">Browse all pathology tests</p>
      )}

      <Testclient
        tests={processedTests}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        hospitalCategories={hospitalCategories}
        patientId={patient?.id ?? null}
        patientCity={patient?.city ?? null}
        letter={letter}
      />
    </div>
  );
};

export default Page;
