import React from "react";
import { getSession } from "@/lib/getsession"; // your session helper
import { db } from "@/lib/db";
import SubAdminListClient from "../../components/SubAdminListClient";

const EsevaSubAdminPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    return <div>Please log in to view sub-admins</div>;
  }

  // Fetch the E-Seva center associated with logged-in email
  const eseva = await db.eseva.findUnique({
    where: { email: session.email },
      include: { 
    subAdmins: {
      include: { payments: true },  // ✅ include payment info
    }
  },
  });

  if (!eseva) {
    return <div>No E-Seva center found for your account</div>;
  }

  console.log(eseva.subAdmins);

  return (
      <SubAdminListClient subAdmins={eseva.subAdmins} esevaId={eseva.id} />
  );
};

export default EsevaSubAdminPage;
