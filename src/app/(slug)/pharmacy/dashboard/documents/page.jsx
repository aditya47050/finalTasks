import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PharmacyDocumentsView from "../../components/PharmacyDocumentsView";

const PharmacyDocumentsPage = async () => {
  const session = await getSession();
  
  if (!session?.email) redirect("/pharmacy/login");

  const pharmacy = await db.pharmacy.findFirst({
    where: { email: session.email },
    include: {
      Pharmacist: true,
      pharmacybranch: true,
      PharmacyCertificate: {
        orderBy: { createdAt: "desc" }
      },
      // Remove reviews since it doesn't exist in Pharmacy model
    },
  });

  if (!pharmacy) {
    return <div className="p-6">Pharmacy not found</div>;
  }

  console.log("Pharmacy data for documents:", {
    id: pharmacy.id,
    certificateCount: pharmacy.PharmacyCertificate?.length,
    hasPharmacists: pharmacy.Pharmacist?.length > 0,
    hasBranches: pharmacy.pharmacybranch?.length > 0,
  });

  const getPharmacyDocuments = (pharmacy) => {
    const baseDocuments = [
      {
        id: "registration-certificate",
        title: "Registration Certificate",
        category: "Registration",
        url: pharmacy.regcertificate,
        description: "Pharmacy registration certificate",
        icon: "🏛️",
        type: "image",
        uploadDate: pharmacy.createdAt,
      },
      {
        id: "pan-card",
        title: "PAN Card",
        category: "Registration",
        url: pharmacy.pharmacypancarddoc,
        description: "Pharmacy PAN card document",
        icon: "💳",
        type: "image",
        uploadDate: pharmacy.createdAt,
      },
      {
        id: "cancelled-cheque",
        title: "Cancelled Cheque",
        category: "Bank",
        url: pharmacy.cancelledCheque,
        description: "Bank account verification cheque",
        icon: "🏦",
        type: "image",
        uploadDate: pharmacy.createdAt,
      },
      {
        id: "pharmacy-logo",
        title: "Pharmacy Logo",
        category: "Branding",
        url: pharmacy.pharmacylogo,
        description: "Pharmacy logo and branding",
        icon: "🏪",
        type: "image",
        uploadDate: pharmacy.createdAt,
      },
    ];

    // Pharmacist documents
    const pharmacistDocs = pharmacy.Pharmacist.map((pharmacist, index) => [
      {
        id: `pharmacist-${pharmacist.id}-aadhar-front`,
        title: `Pharmacist ${index + 1} - Aadhar Front`,
        category: "Pharmacist",
        url: pharmacist.aadharfront,
        description: `Pharmacist Aadhar card front - ${pharmacist.fullname || 'Pharmacist'}`,
        icon: "👨‍⚕️",
        type: "image",
        uploadDate: pharmacist.createdAt,
      },
      {
        id: `pharmacist-${pharmacist.id}-aadhar-back`,
        title: `Pharmacist ${index + 1} - Aadhar Back`,
        category: "Pharmacist",
        url: pharmacist.aadharback,
        description: `Pharmacist Aadhar card back - ${pharmacist.fullname || 'Pharmacist'}`,
        icon: "👨‍⚕️",
        type: "image",
        uploadDate: pharmacist.createdAt,
      },
      {
        id: `pharmacist-${pharmacist.id}-pan-card`,
        title: `Pharmacist ${index + 1} - PAN Card`,
        category: "Pharmacist",
        url: pharmacist.pandoc,
        description: `Pharmacist PAN card - ${pharmacist.fullname || 'Pharmacist'}`,
        icon: "💳",
        type: "image",
        uploadDate: pharmacist.createdAt,
      },
      {
        id: `pharmacist-${pharmacist.id}-profile`,
        title: `Pharmacist ${index + 1} - Profile Photo`,
        category: "Pharmacist",
        url: pharmacist.profilepic,
        description: `Pharmacist profile photo - ${pharmacist.fullname || 'Pharmacist'}`,
        icon: "📷",
        type: "image",
        uploadDate: pharmacist.createdAt,
      }
    ]).flat();

    // Branch documents
    const branchDocs = pharmacy.pharmacybranch.map((branch, index) => ({
      id: `branch-${branch.id}`,
      title: `Branch ${index + 1} - Details`,
      category: "Branches",
      url: null,
      description: `Branch location: ${branch.city || 'Location'} - ${branch.regname || 'Branch'}`,
      icon: "🏢",
      type: "info",
      uploadDate: branch.createdAt,
    }));

    // Pharmacy Certificates
    const pharmacyCertificates = pharmacy.PharmacyCertificate.map(cert => ({
      id: `pharmacy-certificate-${cert.id}`,
      title: "Digital Health Certificate",
      category: "Certificates",
      url: null,
      description: `Certificate ${cert.cardNo ? `- ${cert.cardNo}` : ''} | Status: ${cert.approvalStatus}`,
      icon: "📄",
      type: "certificate",
      uploadDate: cert.createdAt,
      status: cert.approvalStatus,
      remarks: cert.remarks,
      // Store complete pharmacy data for certificate component
      certificateData: pharmacy
    }));

    const allDocuments = [
      ...baseDocuments,
      ...pharmacistDocs,
      ...branchDocs,
      ...pharmacyCertificates
    ];

    return allDocuments.filter(doc => doc.url || doc.type === "certificate");
  };

  const documents = getPharmacyDocuments(pharmacy);

  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  console.log("Processed pharmacy documents:", {
    totalDocuments: documents.length,
    certificates: documents.filter(d => d.category === "Certificates").length,
    categories: Object.keys(documentsByCategory)
  });

  return (
    <PharmacyDocumentsView 
      pharmacy={pharmacy} 
      documents={documents}
      documentsByCategory={documentsByCategory}
    />
  );
};

export default PharmacyDocumentsPage;