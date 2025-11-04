import React from "react";
import { db } from "@/lib/db";
import Healthcard from "../components/healthcard";
import { getSession } from "@/lib/getsession";
import ChangePasswordClient from "../components/changepassword";

// If APPROVED is a constant, ensure it's defined or imported
// import { APPROVED } from '@/constants/status';

const ChangePasswordPage = async () => {
  const patientUser = await getSession();

  // Check if patientUser is defined
  if (!patientUser || !patientUser.email) {
    return <div>No session found. Please log in</div>;
  }

  const data = await db.Patient.findFirst({
    where: { email: patientUser.email },
  });

  // Check if data is found
  if (!data) {
    return <div>No User found</div>;
  }

  return (
    <div>
     <ChangePasswordClient/>
    </div>
  );
};

export default ChangePasswordPage;
