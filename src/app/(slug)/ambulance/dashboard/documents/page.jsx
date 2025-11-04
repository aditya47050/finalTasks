import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AmbulanceDocumentsView from "../components/AmbulanceDocumentsView";

const AmbulanceDocumentsPage = async () => {
  const session = await getSession();
  
  if (!session?.email) redirect("/ambulance/login");

  const ambulance = await db.ambulance.findFirst({
    where: { email: session.email },
    include: {
      AmbulanceHsp: true,
      AmbulanceVaichicle: true,
      AmbulanceDriver: true,
      AmbulanceCertificate: {
        orderBy: { createdAt: "desc" }
      },
      reviews: {
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      },
    },
  });

  if (!ambulance) {
    return <div className="p-6">Ambulance not found</div>;
  }

  console.log("Ambulance data for documents:", {
    id: ambulance.id,
    certificateCount: ambulance.AmbulanceCertificate?.length,
    hasAmbulanceHsp: !!ambulance.AmbulanceHsp,
    hasAmbulanceVaichicle: ambulance.AmbulanceVaichicle?.length > 0,
    reviewsCount: ambulance.reviews?.length
  });

  const getAmbulanceDocuments = (ambulance) => {
    const baseDocuments = [
      {
        id: "owner-aadhar-front",
        title: "Owner Aadhar Card (Front)",
        category: "Personal",
        url: ambulance.owneraadharcardfront,
        description: "Owner Aadhar card front side",
        icon: "🆔",
        type: "image",
        uploadDate: ambulance.createdAt,
      },
      {
        id: "owner-aadhar-back",
        title: "Owner Aadhar Card (Back)",
        category: "Personal",
        url: ambulance.owneraadharcardback,
        description: "Owner Aadhar card back side",
        icon: "🆔",
        type: "image",
        uploadDate: ambulance.createdAt,
      },
      {
        id: "owner-pan-front",
        title: "Owner PAN Card",
        category: "Personal",
        url: ambulance.ownerpanfront,
        description: "Owner PAN card document",
        icon: "💳",
        type: "image",
        uploadDate: ambulance.createdAt,
      },
      {
        id: "passport-photo",
        title: "Passport Photo",
        category: "Personal",
        url: ambulance.passportphoto,
        description: "Professional passport size photograph",
        icon: "📷",
        type: "image",
        uploadDate: ambulance.createdAt,
      },
    ];

    // AmbulanceHsp documents
    const ambulanceHspDocs = ambulance.AmbulanceHsp ? [
      {
        id: "hsp-reg-certificate",
        title: "HSP Registration Certificate",
        category: "Registration",
        url: ambulance.AmbulanceHsp.hspregcertificate,
        description: "Healthcare service provider registration",
        icon: "🏛️",
        type: "image",
        uploadDate: ambulance.AmbulanceHsp.createdAt,
      },
      {
        id: "cancelled-cheque",
        title: "Cancelled Cheque",
        category: "Bank",
        url: ambulance.AmbulanceHsp.cancelledcheque,
        description: "Bank account verification cheque",
        icon: "🏦",
        type: "image",
        uploadDate: ambulance.AmbulanceHsp.createdAt,
      }
    ] : [];

    // AmbulanceVaichicle documents
    const ambulanceVehicleDocs = ambulance.AmbulanceVaichicle.map((vehicle, index) => ({
      id: `vehicle-${vehicle.id}-rcbook`,
      title: `Vehicle ${index + 1} - RC Book`,
      category: "Vehicle",
      url: vehicle.ambulancercbook,
      description: `Vehicle registration certificate - ${vehicle.ambulancercno || 'RC Book'}`,
      icon: "🚑",
      type: "image",
      uploadDate: vehicle.createdAt,
    }));

    // AmbulanceDriver documents
    const ambulanceDriverDocs = ambulance.AmbulanceDriver.map((driver, index) => [
      {
        id: `driver-${driver.id}-aadhar-front`,
        title: `Driver ${index + 1} - Aadhar Front`,
        category: "Driver",
        url: driver.aadharcardfront,
        description: `Driver Aadhar card front - ${driver.firstname || 'Driver'}`,
        icon: "👨‍💼",
        type: "image",
        uploadDate: driver.createdAt,
      },
      {
        id: `driver-${driver.id}-aadhar-back`,
        title: `Driver ${index + 1} - Aadhar Back`,
        category: "Driver",
        url: driver.aadharcardback,
        description: `Driver Aadhar card back - ${driver.firstname || 'Driver'}`,
        icon: "👨‍💼",
        type: "image",
        uploadDate: driver.createdAt,
      },
      {
        id: `driver-${driver.id}-dl-front`,
        title: `Driver ${index + 1} - Driving License`,
        category: "Driver",
        url: driver.drivinglicencefront,
        description: `Driver driving license - ${driver.firstname || 'Driver'}`,
        icon: "🚗",
        type: "image",
        uploadDate: driver.createdAt,
      },
      {
        id: `driver-${driver.id}-pan-front`,
        title: `Driver ${index + 1} - PAN Card`,
        category: "Driver",
        url: driver.panfront,
        description: `Driver PAN card - ${driver.firstname || 'Driver'}`,
        icon: "💳",
        type: "image",
        uploadDate: driver.createdAt,
      }
    ]).flat();

    // Ambulance Certificates
    const ambulanceCertificates = ambulance.AmbulanceCertificate.map(cert => ({
      id: `ambulance-certificate-${cert.id}`,
      title: "Digital Health Certificate",
      category: "Certificates",
      url: null,
      description: `Certificate ${cert.cardNo ? `- ${cert.cardNo}` : ''} | Status: ${cert.approvalStatus}`,
      icon: "📄",
      type: "certificate",
      uploadDate: cert.createdAt,
      status: cert.approvalStatus,
      remarks: cert.remarks,
      // Store complete ambulance data for certificate component
      certificateData: ambulance
    }));

    const allDocuments = [
      ...baseDocuments,
      ...ambulanceHspDocs,
      ...ambulanceVehicleDocs,
      ...ambulanceDriverDocs,
      ...ambulanceCertificates
    ];

    return allDocuments.filter(doc => doc.url || doc.type === "certificate");
  };

  const documents = getAmbulanceDocuments(ambulance);

  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  console.log("Processed ambulance documents:", {
    totalDocuments: documents.length,
    certificates: documents.filter(d => d.category === "Certificates").length,
    categories: Object.keys(documentsByCategory)
  });

  return (
    <AmbulanceDocumentsView 
      ambulance={ambulance} 
      documents={documents}
      documentsByCategory={documentsByCategory}
    />
  );
};

export default AmbulanceDocumentsPage;