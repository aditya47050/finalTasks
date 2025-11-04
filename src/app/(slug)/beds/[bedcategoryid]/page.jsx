import React from "react";
import Bedsingleview from "../components/singlebedinfo";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

const page = async ({ params }) => {
  const bedcategoryid = params.bedcategoryid;

  // Attempt to get session, but it's optional
  const session = await getSession();
  let loggeduserId = null;

  if (session?.email) {
    const user = await db.patient.findFirst({
      where: { email: session.email },
    });
    if (user) {
      loggeduserId = user.id;
    }
  }

  const bedcategorydata = await db.BedCategory.findFirst({
    where: { id: bedcategoryid },
    select: {
      minPrice: true,
      maxPrice: true,
      finalPrice: true,
      discount: true,
      chargeType: true,
      name: true,
      image: true,
      image1: true,
      image2: true,
      image3: true,
      beds: true,
      hospital: {
        select: {
          mobile: true,
          id: true,
          hspInfo: true,
          hspdetails: true,
          hspcontact: true,
        },
      },
    },
  });

  if (!bedcategorydata) {
    return <div>Bed category not found.</div>;
  }
  const patientdata = await db.Patient.findMany({})
  return (
    <div>
      <Bedsingleview
        data={bedcategorydata}
        bedsdata={bedcategorydata?.beds || []}
        loggeduserId={loggeduserId} // could be null for guest users
        patientdata={patientdata}
      />
    </div>
  );
};

export default page;
