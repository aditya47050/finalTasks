import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import HomeHealthcareSingleView from "../../component/SingleHomeHealthcareDetails";
import { getSession } from "@/lib/getsession";
import AnimatedAccessDenied from "@/app/components/accesserror";

const SingleHomeHealthcareDetailsPage = async ({ params }) => {
  const { serviceName, hospitalId } = params;
  const decodedServiceName = decodeURIComponent(serviceName);
  const session = await getSession();

  // If no session, user is not logged in
  if (!session || !session.email) {
    return <AnimatedAccessDenied />;
  }

  const patient = await db.patient.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  // If not a patient, deny access
  if (!patient) {
    return <AnimatedAccessDenied />;
  }

  try {
    // Get the specific home healthcare service
    const homeHealthcareService = await db.homeHealthcare.findFirst({
      where: { 
        hospitalId,
        serviceName: decodedServiceName,
        isAvailable: true 
      },
      include: {
        hospital: {
          include: {
            hspInfo: true,
            hspdetails: true,
            hspcontact: true,
            hspbranches: true,
            reviews: true,
          },
        },
        _count: {
          select: {
            BookHomeHealthcare: true,
          },
        },
      },
    });

    if (!homeHealthcareService) {
      notFound();
    }

    return (
      <div className="">
        <HomeHealthcareSingleView
          homeHealthcareService={homeHealthcareService}
          serviceName={decodedServiceName}
          patientId={patient.id}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching home healthcare service data:", error);
    notFound();
  }
};

export default SingleHomeHealthcareDetailsPage;