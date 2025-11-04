import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import ChangePasswordClient from "../../components/changepassword";

// If APPROVED is a constant, ensure it's defined or imported
// import { APPROVED } from '@/constants/status';
import { redirect } from 'next/navigation';

const ChangePasswordPage = async () => {
  const session = await getSession();

  // Check if patientUser is defined
  if (!session || !session.email) {
     redirect("/e-seva/login");
  }

  const eseva = await db.Eseva.findFirst({
    where: { email: session.email },
    include: { patients: true },
  });

  // Check if data is found
  if (!eseva) {
    redirect("/e-seva/login");
  }

  return (
    <div>
     <ChangePasswordClient/>
    </div>
  );
};

export default ChangePasswordPage;
