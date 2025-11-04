import Patientsingleviewpage from "../components/patientsingleviewpage";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

// Helper function to extract name from email
const getDoctorNameFromEmail = (email) => {
  if (!email) return 'Doctor';
  try {
    const emailParts = email.split('@')[0].split('.');
    if (emailParts.length >= 2) {
      const firstName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
      const lastName = emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1);
      return `${firstName} ${lastName}`;
    }
    return email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  } catch {
    return 'Doctor';
  }
};

const PatientSingleViewPage = async ({ params }) => {
  const { patientid: patientId, role } = params;

  if (!patientId) return <div>Patient ID not provided</div>;

  const session = await getSession();

  if (!session || !session.email) return <div>Unauthorized</div>;

  // Determine user role
  const userRole = role || session.role;

  if (!userRole) return <div>Role not recognized. Please contact administrator.</div>;

  // Fetch patient data
  const patient = await db.Patient.findUnique({
    where: { id: patientId },
    include: { healthcard: true },
  });
  if (!patient) return <div>Patient not found</div>;

  let hospitalId, doctors, ambulances, bedsForBooking, surgeryServices, treatmentServices;

  // Fetch hospital-related data only if the role is "Hospital" or "Receptionist"
  if (userRole === "Hospital" || userRole === "receptionist") {
    // ✅ First try session.hospitalId, else fallback to query by email
    if (session.hospitalId) {
      hospitalId = session.hospitalId;
    } else {
      const hospital = await db.Hospital.findUnique({
        where: { email: session.email },
      });
      if (!hospital) return <div>Hospital not found. Please contact administrator.</div>;
      hospitalId = hospital.id;
    }

    // Fetch doctors assigned to this hospital
    const hospitalDoctors = await db.HospitalDoctor.findMany({
      where: { hospitalId },
      include: {
        doctor: {
          include: {
            specialities: { include: { speciality: true } },
            doctorinfo: true,
          },
        },
      },
    });

    doctors = hospitalDoctors.map(hd => {
      const doctor = hd.doctor;
      const doctorInfo = doctor.doctorinfo;
      const specialities = doctor.specialities || [];

      return {
        id: doctor.id,
        name: doctor.firstName && doctor.lastName
          ? `${doctor.firstName} ${doctor.lastName}`.trim()
          : getDoctorNameFromEmail(doctor.email),
        specialization: specialities.length > 0
          ? specialities.map(s => s.speciality?.title).filter(Boolean).join(', ')
          : '',
        email: doctor.email,
        mobile: doctor.mobile || doctorInfo?.mobile || '',
        specialities,
        doctorinfo: doctorInfo
      };
    });

    // Fetch ambulances for this hospital
    const ambulanceVehicles = await db.AmbulanceVaichicle.findMany({
      where: {
        status: "AVAILABLE",
        approvalStatus: "APPROVED",
        ambulance: { HospitalAmbulance: { some: { hospitalId } } }
      },
      include: {
        ambulance: {
          include: {
            AmbulanceHsp: true,
            HospitalAmbulance: { where: { hospitalId } }
          }
        }
      }
    });

    ambulances = ambulanceVehicles.map(vehicle => ({
      id: vehicle.id,
      model: vehicle.ambulancemodel || 'Not specified',
      category: vehicle.ambulancecategory || 'Not specified',
      charges: vehicle.ambulancecharges || '0',
      type: vehicle.ambulancetype || 'Not specified',
      status: vehicle.status,
      image: vehicle.ambulanceimagefront,
      registrationNumber: vehicle.ambulancercno,
      pincode: vehicle.ambulanceareapincode,
      facilities: vehicle.facilities,
      puc: vehicle.puc,
      insurance: vehicle.insurance,
      ambulanceProvider: vehicle.ambulance?.AmbulanceHsp?.hspregname || 'Ambulance Service'
    }));

    // Fetch available beds
    const availableBeds = await db.Bed.findMany({
      where: { hospitalId, status: "AVAILABLE" },
      include: {
        category: true,
        hospital: { select: { id: true, pincode: true, hspInfo: { select: { regname: true } }, hspcontact: { select: { city: true } } } }
      }
    });

    bedsForBooking = availableBeds.map(bed => ({
      id: bed.id,
      bedNumber: bed.bedNumber,
      category: bed.category?.name || '',
      status: bed.status,
      hospitalId: bed.hospital?.id,
      hospitalName: bed.hospital?.hspInfo?.regname,
      pinCode: bed.hospital?.pincode,
      city: bed.hospital?.hspcontact?.city,
    }));

    // Fetch hospital services
    const availableServices = await db.Surgerytreatment.findMany({
      where: { hospitalId, isAvailable: true },
      select: { id: true, category: true, serviceName: true, type: true, minPrice: true, maxPrice: true }
    });

    surgeryServices = availableServices.filter(s => s.type.toLowerCase() === "surgery");
    treatmentServices = availableServices.filter(s => s.type.toLowerCase() === "treatment");
  }

  return (
    <Patientsingleviewpage
      userdata={patient}
      doctors={doctors || []}
      hospitalId={hospitalId}
      ambulances={ambulances || []}
      bedsForBooking={bedsForBooking || []}
      surgeryServices={surgeryServices || []}
      treatmentServices={treatmentServices || []}
      role={userRole}
    />
  );
};

export default PatientSingleViewPage;