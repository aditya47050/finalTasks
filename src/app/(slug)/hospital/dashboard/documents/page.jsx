import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import HospitalDocumentsView from "../components/HospitalDocumentsView";

const HospitalDocumentsPage = async () => {
  const session = await getSession();
  
  if (!session?.email) redirect("/hospital/login");

  const hospital = await db.hospital.findFirst({
    where: { email: session.email },
    include: {
      hspdetails: true,
      hspcontact: true,
      hspInfo: true,
      HospitalCertificate: {
        orderBy: { createdAt: "desc" }
      },
      HospitalSpeciality: {
        include: {
          speciality: true
        }
      },
      HospitalDepartment: true,
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

  if (!hospital) {
    return <div className="p-6">Hospital not found</div>;
  }

  console.log("Hospital data for documents:", {
    id: hospital.id,
    role: hospital.role,
    email: hospital.email,
    certificateCount: hospital.HospitalCertificate?.length,
    hasHspInfo: !!hospital.hspInfo,
    hasHspdetails: !!hospital.hspdetails,
    reviewsCount: hospital.reviews?.length
  });

  const getRoleSpecificDocuments = (hospital) => {
    const baseDocuments = [
      {
        id: "registration-certificate",
        title: "Registration Certificate",
        category: "Registration",
        url: hospital.hspdetails?.hspregcertificate,
        description: "Hospital/Clinic registration certificate",
        icon: "🏛️",
        type: "image",
        uploadDate: hospital.createdAt,
        role: "ALL"
      },
      {
        id: "hsp-reg-certificate",
        title: "Hospital Registration Certificate",
        category: "Registration",
        url: hospital.hspdetails?.hspregcertificate,
        description: "Healthcare facility registration document",
        icon: "📄",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "ALL"
      },
      {
        id: "pan-card",
        title: "PAN Card",
        category: "Registration",
        url: hospital.hspdetails?.pancardimg,
        description: "PAN card document",
        icon: "💳",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "ALL"
      },
      {
        id: "cancelled-cheque",
        title: "Cancelled Cheque",
        category: "Bank",
        url: hospital.hspdetails?.cancelledcheque,
        description: "Bank account verification cheque",
        icon: "🏦",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "ALL"
      },
      {
        id: "nabh-nabl-certificate",
        title: "NABH/NABL Certificate",
        category: "Accreditation",
        url: hospital.hspdetails?.nabhnablcertificate,
        description: "Quality accreditation certificate",
        icon: "⭐",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "ALL"
      },
      {
        id: "iso-certificate",
        title: "ISO Certificate",
        category: "Accreditation",
        url: hospital.hspdetails?.isoapproved,
        description: "ISO quality certification",
        icon: "📋",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "ALL"
      },
    ];

    const roleSpecificDocs = [];

    if (hospital.role === "Hospital") {
      roleSpecificDocs.push({
        id: "hospital-license",
        title: "Hospital License",
        category: "License",
        url: hospital.hspdetails?.hspregcertificate,
        description: "Hospital operating license",
        icon: "🏥",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "Hospital"
      });
    } else if (hospital.role === "Clinic") {
      roleSpecificDocs.push({
        id: "clinic-license",
        title: "Clinic License",
        category: "License",
        url: hospital.hspdetails?.hspregcertificate,
        description: "Medical clinic operating license",
        icon: "🏥",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "Clinic"
      });
    } else if (hospital.role === "DiagnosticCenter" || hospital.role === "Pathology") {
      roleSpecificDocs.push({
        id: "lab-license",
        title: "Laboratory License",
        category: "License",
        url: hospital.hspdetails?.hspregcertificate,
        description: "Diagnostic laboratory license",
        icon: "🔬",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: hospital.role
      });
    } else if (hospital.role === "homehealthcare") {
      roleSpecificDocs.push({
        id: "home-care-license",
        title: "Home Care License",
        category: "License",
        url: hospital.hspdetails?.hspregcertificate,
        description: "Home healthcare service license",
        icon: "🏠",
        type: "image",
        uploadDate: hospital.hspdetails?.createdAt,
        role: "homehealthcare"
      });
    }

    // 🔹 FIX: Create certificate documents with the SAME data structure as DigitalHealthCardPage
    const hospitalCertificates = hospital.HospitalCertificate.map(cert => ({
      id: `hospital-certificate-${cert.id}`,
      title: "Digital Health Certificate",
      category: "Certificates",
      url: null,
      description: `Certificate ${cert.cardNo ? `- ${cert.cardNo}` : ''} | Status: ${cert.approvalStatus}`,
      icon: "📄",
      type: "certificate",
      uploadDate: cert.createdAt,
      status: cert.approvalStatus,
      remarks: cert.remarks,
      role: "ALL",
      // 🔹 KEY FIX: Store the hospital data in the SAME structure as DigitalHealthCardPage
      certificateData: hospital // Direct hospital object, not nested
    }));

    const allDocuments = [
      ...baseDocuments,
      ...roleSpecificDocs,
      ...hospitalCertificates
    ];

    return allDocuments.filter(doc => doc.url || doc.type === "certificate");
  };

  const documents = getRoleSpecificDocuments(hospital);
  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  console.log("Processed documents:", {
    totalDocuments: documents.length,
    certificates: documents.filter(d => d.category === "Certificates").length,
    categories: Object.keys(documentsByCategory)
  });

  return (
    <HospitalDocumentsView 
      hospital={hospital} 
      documents={documents}
      documentsByCategory={documentsByCategory}
    />
  );
};

export default HospitalDocumentsPage;