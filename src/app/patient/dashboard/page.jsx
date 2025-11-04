import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import PatientDashboard from './components/PatientDashboardOverview';

const DashboardPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    redirect('/patient/login'); // Safe redirect on server side
  }

  // Fetch main patient data with family members
  const userDataRaw = await db.patient.findFirst({
    where: { email: session.email },
    include: {
      familymembers: {
        where: { age: { not: null } },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          age: true,
          relation: true,
          gender: true,
          mobile: true,
          bloodgroup: true,
          presentAddress: true,
          city: true,
          pincode: true,
          state: true,
          district: true,
          taluka: true,
          aadharCardNumber: true,
        },
      },
      medicalhistory: true,
      bookFreeAppointment: { include: { doctor: { include: { specialities: { include: { speciality: true } }, doctorinfo: true, doctorvisitinghospitals: true } }, category: true } },
      bedbooking: { include: { hospital: { include: { hspInfo: true, hspdetails: true, hspcontact: true, hspbranches: true } }, bed: { include: { category: true, doctor: true } } } },
      healthcard: true,
      bookambulance: { include: { ambulanceVaichicle: { include: { ambulance: true, driver: true } } } },
      emergencyambulance: true,
      patientMedicalHistory: true,
      donar: { include: { Donation: { include: { campaign: true } } } },
      fundraiser: { include: { fundraisingCampaign: { include: { photographer: true, Donation: { include: { donor: true } } } } } },
      BookDiagnosticService: { include: { service: { include: { Hospital: true } } } },
      Payment: true,
      healthInsuranceReviews: true,
      BookSurgeryTreatment: { include: { service: { include: { hospital: true } } } },
      reviews: { include: { hospital: { include: { hspInfo: true } } } },
      BookHomeHealthcare: { include: { HomeHealthcare: { include: { hospital: true } } } },
      Eseva: { include: { payment: true } },
    },
  });

  if (!userDataRaw) {
    redirect('/patient/login');
  }

  const connections = [];

  // 1️⃣ Base connection: current session user
  connections.push({
    email: userDataRaw.email,
    firstName: userDataRaw.firstName || userDataRaw.email,
    mode: session.mode || "main",
    id: userDataRaw.id,
    avatar: userDataRaw.passportPhoto || null,
    relation: session.mode === "kids" ? "Child Account" : "You",
  });

  // 2️⃣ If in kids mode, include main account
  if (session.mode === "kids" && session.parentEmail) {
    const mainUser = await db.patient.findFirst({
      where: { email: session.parentEmail },
      select: { id: true, email: true, firstName: true, passportPhoto: true },
    });

    if (mainUser) {
      connections.unshift({
        email: mainUser.email,
        firstName: mainUser.firstName || mainUser.email,
        mode: "main",
        id: mainUser.id,
        avatar: mainUser.passportPhoto || null,
        relation: "Main Account",
      });
    }
  }

  // 3️⃣ If in main mode, fetch all kids (child accounts)
  if (session.mode === "main") {
  const approvedRequests = await db.connectionRequest.findMany({
    where: {
      senderEmail: session.email,
      status: "APPROVED",
    },
    select: {
      receiverEmail: true,
    },
  });

  if (approvedRequests.length > 0) {
    const childEmails = approvedRequests.map(r => r.receiverEmail);

    const children = await db.patient.findMany({
      where: { email: { in: childEmails } },
      select: { id: true, email: true, firstName: true, passportPhoto: true },
    });

    children.forEach((child) => {
      connections.push({
        email: child.email,
        firstName: child.firstName || child.email,
        mode: "kids",
        id: child.id,
        avatar: child.passportPhoto || null,
        relation: "Child Account",
      });
    });
  }
}

  // 4️⃣ Optional: include other linked accounts from session.connections if needed
  // const rawConnections = Array.isArray(session.connections) ? session.connections : [];
  // Add logic here if you use other linked connections

  const userData = {
    ...userDataRaw,
    familymembers: userDataRaw.familymembers.map(fm => ({ ...fm, age: fm.age !== null ? String(fm.age) : null })),
    sessionMode: session.mode || "main",
    connections,
  };

  console.log("SESSION:", session);
  console.log("CONNECTIONS:", connections);

  return <PatientDashboard userdata={userData} />;
};

export default DashboardPage;
