export const dynamic = "force-dynamic"; // ✅ forces server-side rendering
import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import HomeHealthcareServicesList from "../components/allhomehealthcareservices";

const HomeHealthcareServicesPage = async () => {
  const session = await getSession();
  const user = await db.Hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });
  const data = await db.HomeHealthcare.findMany({
    where: { hospitalId: user.id },
  });
  if (!session || !session.email) {
    // redirect or throw an error
    return <div>Unauthorized</div>;
  }

  if (!user) {
    // No matching diagnostic center found
    return <div>Access Denied</div>;
  }
  return (
    <div>
      <HomeHealthcareServicesList homeHealthcareServices={data} hospitalId={user.id} />
    </div>
  );
};

export default HomeHealthcareServicesPage;
