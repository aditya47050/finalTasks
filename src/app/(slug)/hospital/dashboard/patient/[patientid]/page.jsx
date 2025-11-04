import Patientsingleviewpage from "../components/patientsingleviewpage";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { getScanSession } from "@/lib/getscansession";

// Helper function to extract name from email
const getDoctorNameFromEmail = (email) => {
  if (!email) return "Doctor";

  try {
    const emailParts = email.split("@")[0].split(".");
    if (emailParts.length >= 2) {
      const firstName =
        emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
      const lastName =
        emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1);
      return `${firstName} ${lastName}`;
    }
    return email
      .split("@")[0]
      .replace(/\./g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  } catch {
    return "Doctor";
  }
};

const PatientSingleViewPage = async ({ params }) => {
  // Await the params object
  const { patientid: patientId } = await params;

  if (!patientId) return <div>Patient ID not provided</div>;

  // Get current session
  const session = await getSession();

  if (!session || !session.email) {
    return <div>Unauthorized</div>;
  }

  let hospitalId = null;
  let hospital = null;

  // Check if user is a receptionist first
  const receptionist = await db.Receptionist.findUnique({
    where: { email: session.email },
    include: {
      hospital: {
        select: { id: true },
      },
    },
  });

  if (receptionist) {
    // User is a receptionist, get hospital ID from receptionist record
    hospitalId = receptionist.hospitalId;
    hospital = { id: hospitalId };
    console.log("Receptionist logged in, hospital ID:", hospitalId);
  } else {
    // Check if user is a hospital
    hospital = await db.Hospital.findFirst({
      where: { email: session.email },
      select: { id: true },
    });

    if (hospital) {
      hospitalId = hospital.id;
      console.log("Hospital logged in, hospital ID:", hospitalId);
    }
  }

  if (!hospital || !hospitalId) {
    return <div>Hospital not found. Please contact administrator.</div>;
  }
  const scanSession = await getScanSession();
  if (!scanSession || !scanSession.email) {
    return <div>No active scan session. Please scan patient again.</div>;
  }
  console.log(scanSession);
  // Fetch patient data
  const patient = await db.Patient.findUnique({
    where: { id: patientId },
    include: { healthcard: true },
  });
  if (!patient) return <div>Patient not found</div>;
  if (patient.email !== scanSession.email) {
    return <div>No active scan session. Please scan patient again.</div>;
  }

  // Fetch doctors assigned to this hospital
  const hospitalDoctors = await db.HospitalDoctor.findMany({
    where: { hospitalId: hospitalId },
    include: {
      doctor: {
        include: {
          specialities: {
            include: {
              speciality: true,
            },
          },
          doctorinfo: true,
        },
      },
    },
  });

  // Format doctors for dropdown
  const doctors = hospitalDoctors.map((hd) => {
    const doctor = hd.doctor;
    const doctorInfo = doctor.doctorinfo;
    const specialities = doctor.specialities || [];

    return {
      id: doctor.id,
      name:
        doctor.firstName && doctor.lastName
          ? `${doctor.firstName} ${doctor.lastName}`.trim()
          : getDoctorNameFromEmail(doctor.email),
      specialization:
        specialities.length > 0
          ? specialities
              .map((s) => s.speciality?.title)
              .filter(Boolean)
              .join(", ")
          : "",
      email: doctor.email,
      mobile: doctor.mobile || doctorInfo?.mobile || "",
      specialities: specialities,
      doctorinfo: doctorInfo,
    };
  });

  // Fetch ambulance vehicles for this hospital that are available for booking
  const ambulanceVehicles = await db.AmbulanceVaichicle.findMany({
    where: {
      status: "AVAILABLE", // Only available vehicles
      approvalStatus: "APPROVED", // Only admin-approved vehicles
      ambulance: {
        HospitalAmbulance: {
          some: {
            hospitalId: hospitalId, // Belongs to this hospital
          },
        },
      },
    },
    include: {
      ambulance: {
        include: {
          AmbulanceHsp: true, // Include ambulance hospital details
          HospitalAmbulance: {
            where: {
              hospitalId: hospitalId,
            },
          },
        },
      },
    },
  });

  // Format ambulance vehicles for the component
  const ambulances = ambulanceVehicles.map((vehicle) => ({
    id: vehicle.id,
    model: vehicle.ambulancemodel || "Not specified",
    category: vehicle.ambulancecategory || "Not specified",
    charges: vehicle.ambulancecharges || "0",
    type: vehicle.ambulancetype || "Not specified",
    status: vehicle.status,
    image: vehicle.ambulanceimagefront,
    // Include additional useful information
    registrationNumber: vehicle.ambulancercno,
    pincode: vehicle.ambulanceareapincode,
    facilities: vehicle.facilities,
    puc: vehicle.puc,
    insurance: vehicle.insurance,
    ambulanceProvider:
      vehicle.ambulance?.AmbulanceHsp?.hspregname || "Ambulance Service",
  }));

  // Fetch available beds for booking
  const availableBeds = await db.Bed.findMany({
    where: { hospitalId, status: "AVAILABLE" },
    include: {
      category: true,
      hospital: {
        select: {
          id: true,
          pincode: true,
          hspInfo: { select: { regname: true } },
          hspcontact: { select: { city: true } },
        },
      },
    },
  });

  // Shape the response
  const bedsForBooking = availableBeds.map((bed) => ({
    id: bed.id,
    bedNumber: bed.bedNumber,
    category: bed.category?.name || "",
    status: bed.status,
    hospitalId: bed.hospital?.id,
    hospitalName: bed.hospital?.hspInfo?.regname,
    pinCode: bed.hospital?.pincode,
    city: bed.hospital?.hspcontact?.city,
  }));

  // Fetch hospital services
  const availableServices = await db.Surgerytreatment.findMany({
    where: { hospitalId, isAvailable: true },
    select: {
      id: true,
      category: true,
      serviceName: true,
      type: true,
      minPrice: true,
      maxPrice: true,
    },
  });

  // Separate surgery and treatment
  const surgeryServices = availableServices.filter(
    (s) => s.type.toLowerCase() === "surgery"
  );
  const treatmentServices = availableServices.filter(
    (s) => s.type.toLowerCase() === "treatment"
  );

  return (
    <Patientsingleviewpage
      userdata={patient}
      doctors={doctors}
      hospitalId={hospitalId}
      ambulances={ambulances}
      bedsForBooking={bedsForBooking}
      surgeryServices={surgeryServices}
      treatmentServices={treatmentServices}
    />
  );
};

export default PatientSingleViewPage;
