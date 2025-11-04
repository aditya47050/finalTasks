import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import ConditionalLayoutWrapper from "./components/conditionallayout";

const AmbulanceLayout = async ({ children }) => {
  const session = await getSession();

  const [hospitalCategories, doctorCategories] = await Promise.all([
    db.HospitalsCategory.findMany({ select: { id: true, title: true } }),
    db.ExpertDoctorsCategory.findMany({ select: { id: true, title: true } }),
  ]);

  let userData = null;

  if (session) {
    // Run queries in parallel for each model
    const userPromises = [
      db.Ambulance.findUnique({ where: { email: session.email }, select: { id: true, email: true, mobile: true } }),
      db.Doctor.findUnique({ where: { email: session.email }, select: { id: true, email: true, mobile: true } }),
      db.Patient.findUnique({ where: { email: session.email }, select: { id: true, email: true, mobile: true } }),
      db.Corporate.findUnique({ where: { email: session.email }, select: { id: true, email: true, mobile: true } }),
      db.AmbulanceDriver.findUnique({ where: { email: session.email }, select: { id: true, email: true, mobile: true } }),
    ];

    const users = await Promise.all(userPromises);

    // Find the first non-null user and determine the type
    for (const [index, user] of users.entries()) {
      if (user) {
        const types = ["Ambulance", "Doctor", "Patient", "Corporate", "AmbulanceDriver"];
        userData = { ...user, type: types[index] };
        break;
      }
    }
  }

  return (
    <ConditionalLayoutWrapper
      userData={userData}
      hspcategory={hospitalCategories}
      doctorcategory={doctorCategories}
    >
      {children}
    </ConditionalLayoutWrapper>
  );
};

export default AmbulanceLayout;