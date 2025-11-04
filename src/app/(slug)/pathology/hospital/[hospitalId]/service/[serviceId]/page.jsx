// src/app/(slug)/pathology/hospital/[hospitalId]/service/[serviceId]/page.jsx

import { db } from "@/lib/db";
import SinglePathlogyClient from "../../../../component/singlepathlogyclient";
import { getSession } from "@/lib/getsession";
import AccessErrorDisplay from "@/app/components/accesserror";

const Page = async ({ params }) => {
  const { hospitalId, serviceId } = params;
  const session = await getSession();

  if (!session || !session.email) {
    return <AccessErrorDisplay />;
  }

  // Fetch hospital details
  const hospital = await db.hospital.findUnique({
    where: { id: hospitalId },
    include: {
      hspdetails: true,
      hspcontact: true,
      hspInfo: true,
      hspbranches: true,
    },
  });

  // Fetch service details based on service type
  let service = null;
  let serviceType = null;

  // Check which service type this ID belongs to
  const labTest = await db.labTest.findUnique({
    where: { id: serviceId },
  });
  
  const wellnessPackage = await db.wellnesspackage.findUnique({
    where: { id: serviceId },
  });
  
  const bloodBank = await db.bloodbank.findUnique({
    where: { id: serviceId },
  });

  if (labTest) {
    service = labTest;
    serviceType = 'labtest';
  } else if (wellnessPackage) {
    service = wellnessPackage;
    serviceType = 'wellnesspackage';
  } else if (bloodBank) {
    service = bloodBank;
    serviceType = 'bloodbank';
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  const patient = session?.email ? await db.patient.findFirst({
    where: { email: session.email },
    select: { id: true },
  }) : null;


  return (
    <SinglePathlogyClient
      hospital={hospital}
      service={service}
      serviceType={serviceType}
      patientId={patient?.id || null}
    />
  );
};

export default Page;