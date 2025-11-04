// e:/system/aarogya-aadhar/src/app/(slug)/hospital/dashboard/(pathology)/bookings/page.jsx
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import BookingsClient from "../components/BookingsClient";

const BookingsPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    return <div>Unauthorized</div>;
  }

  // Find the logged-in pathology user
  const pathologyUser = await db.Hospital.findFirst({
    where: { email: session.email, role: "Pathology" },
    select: { id: true },
  });

  if (!pathologyUser) {
    return <div>Access Denied</div>;
  }

  // Fetch bookings for this pathology user
  const labTests = await db.BookLabTest.findMany({
    where: { hospitalId: pathologyUser.id },
    include: { service: true, Hospital: true, patient: true },
  });

  const bloodTests = await db.BookBloodbank.findMany({
    where: { hospitalId: pathologyUser.id },
    include: { service: true, Hospital: true, patient: true },
  });

  const wellnessPackages = await db.BookWellnesspackage.findMany({
    where: { hospitalId: pathologyUser.id },
    include: { service: true, Hospital: true, patient: true },
  });

  const bookings = [
    ...labTests.map(b => ({
      ...b,
      serviceName: b.service?.testname || "",
      serviceType: "LabTest",
    })),
    ...bloodTests.map(b => ({
      ...b,
      serviceName: b.service?.bloodname || "",
      serviceType: "BloodBank",
    })),
    ...wellnessPackages.map(b => ({
      ...b,
      serviceName: b.service?.labpackagename || "",
      serviceType: "WellnessPackage",
    })),
  ];
  

  

  return <BookingsClient bookings={bookings} />;
};

export default BookingsPage;