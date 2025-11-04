import { db } from "@/lib/db";
import PathlogyCenter from "../../components/pathologycenter";
import { getSession } from "@/lib/getsession";

export const dynamic = "force-dynamic";

const PatientPathologyServicePage = async ({ params }) => {
  try {
    const patientId = params?.patientid;
    if (!patientId) {
      return <div className="text-center p-6">Patient ID not provided</div>;
    }

    // ✅ Get logged-in pathology session
    const session = await getSession();
    let pathologyHospital = null;
    if (session?.email) {
      pathologyHospital = await db.Hospital.findFirst({
        where: { email: session.email, role: "Pathology" },
        select: { id: true },
      });
    }

    // Ensure patient exists
    const patient = await db.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return <div className="text-center p-6">Patient not found</div>;
    }

    // Fetch all three booking types
    const [labBookingsRaw, wellnessBookingsRaw, bloodBookingsRaw] = await Promise.all([
      db.BookLabTest.findMany({
        where: { patientId },
        include: { service: { include: { Hospital: { include: { hspInfo: true } } } }, Hospital: { include: { hspInfo: true } } },
      }),
      db.BookWellnesspackage.findMany({
        where: { patientId },
        include: { service: { include: { Hospital: { include: { hspInfo: true } } } }, Hospital: { include: { hspInfo: true } } },
      }).catch(() => []),
      db.BookBloodbank.findMany({
        where: { patientId },
        include: { service: { include: { Hospital: { include: { hspInfo: true } } } }, Hospital: { include: { hspInfo: true } } },
      }),
    ]);

    // Filter out bookings with missing service
    const labBookings = labBookingsRaw.filter(b => b.service);
    const wellnessBookings = wellnessBookingsRaw.filter(b => b.service);
    const bloodBookings = bloodBookingsRaw.filter(b => b.service);

    // Normalize all bookings and add `canUpload`
    const normalizeBookings = (bookings, type) =>
      bookings.map((b) => ({
        id: b.id,
        type,
        status: b.status || "PENDING",
        bookingDate: b.bookingDate || new Date(),
        preferredDate: b.preferredDate || null,
        preferredTimeSlot: b.preferredTimeSlot || null,
        notes: b.notes || "",
        service: b.service
          ? {
              id: b.service.id,
              name:
                b.service.testname ||
                b.service.labpackagename ||
                b.service.bloodname ||
                "Service",
              price: b.service.price ?? 0,
              finalprice: b.service.finalprice ?? 0,
              discount: b.service.discount || null,
              available: b.service.available ?? true,
              nabl: b.service.nabl ?? false,
              hospitalId: b.service.Hospital?.id || b.Hospital?.id || null,
              hospitalName:
                b.service.Hospital?.hspInfo?.regname ||
                b.Hospital?.hspInfo?.regname ||
                "Not specified",
            }
          : null,
        report: b.report || null,
        receipt: b.receipt || null,
        // ✅ Only allow upload if booking belongs to logged-in pathology hospital
        canUpload: pathologyHospital
          ? (b.hospitalId === pathologyHospital.id || b.service?.Hospital?.id === pathologyHospital.id)
          : false,
      }));

    const allBookings = [
      ...normalizeBookings(labBookings, "LabTest"),
      ...normalizeBookings(wellnessBookings, "Wellness"),
      ...normalizeBookings(bloodBookings, "Bloodbank"),
    ];

    // Sort descending by bookingDate
    allBookings.sort(
      (a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    );

    return <PathlogyCenter bookings={allBookings} />;
  } catch (error) {
    console.error("Error in PatientPathologyServicePage:", error);
    return (
      <div className="text-center p-6">
        Something went wrong. Check console for details.
      </div>
    );
  }
};

export default PatientPathologyServicePage;
