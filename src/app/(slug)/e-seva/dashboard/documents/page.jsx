import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import EsevaDocumentsView from "../../components/EsevaDocumentsView";

const EsevaDocumentsPage = async () => {
  const session = await getSession();
  
  if (!session?.email) redirect("/e-seva/login");

  // Fetch E-Seva center data with all sub-admins and their certificates
  const eseva = await db.eseva.findFirst({
    where: { email: session.email },
    include: {
      ESevaCertificate: {
        orderBy: { createdAt: "desc" }
      },
      subAdmins: {
        include: {
          ESevaSubAdminCertificate: {
            orderBy: { createdAt: "desc" }
          }
        }
      },
    },
  });

  if (!eseva) {
    return <div className="p-6">E-Seva center not found</div>;
  }

  console.log("E-Seva data for documents:", {
    id: eseva.id,
    name: eseva.name,
    certificateCount: eseva.ESevaCertificate?.length,
    subAdminCount: eseva.subAdmins?.length,
    totalSubAdminCertificates: eseva.subAdmins?.reduce((total, subAdmin) => 
      total + (subAdmin.ESevaSubAdminCertificate?.length || 0), 0
    )
  });

  const getEsevaDocuments = (eseva) => {
    // E-Seva center's own documents
    const esevaDocuments = [
      {
        id: "registration-certificate",
        title: "Registration Certificate",
        category: "Registration",
        url: eseva.regcertificate,
        description: "E-Seva center registration certificate",
        icon: "🏛️",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
      {
        id: "shop-act-document",
        title: "Shop Act Document",
        category: "Registration",
        url: eseva.shopactdoc,
        description: "Shop Act registration document",
        icon: "📋",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
      {
        id: "address-proof",
        title: "Address Proof Document",
        category: "Registration",
        url: eseva.addressproofdoc,
        description: "Address proof document",
        icon: "🏠",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
      {
        id: "incharge-aadhar",
        title: "Incharge Aadhar Card",
        category: "Incharge",
        url: eseva.inchargeaadhardoc,
        description: "Center incharge Aadhar card",
        icon: "🆔",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
      {
        id: "incharge-pan",
        title: "Incharge PAN Card",
        category: "Incharge",
        url: eseva.inchargepandoc,
        description: "Center incharge PAN card",
        icon: "💳",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
      {
        id: "incharge-profile",
        title: "Incharge Profile Photo",
        category: "Incharge",
        url: eseva.inchargeprofilepic,
        description: "Center incharge profile photo",
        icon: "📷",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
      {
        id: "cancelled-cheque",
        title: "Cancelled Cheque",
        category: "Bank",
        url: eseva.cancelledCheque,
        description: "Bank account verification cheque",
        icon: "🏦",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
      {
        id: "center-logo",
        title: "Center Logo",
        category: "Branding",
        url: eseva.logo,
        description: "E-Seva center logo",
        icon: "🏪",
        type: "image",
        uploadDate: eseva.createdAt,
        owner: "E-Seva Center",
        ownerType: "center"
      },
    ];

    // E-Seva center's certificates
    const esevaCertificates = eseva.ESevaCertificate.map(cert => ({
      id: `eseva-certificate-${cert.id}`,
      title: "Digital Health Certificate",
      category: "Certificates",
      url: null,
      description: `Certificate ${cert.cardNo ? `- ${cert.cardNo}` : ''} | Status: ${cert.approvalStatus}`,
      icon: "📄",
      type: "certificate",
      uploadDate: cert.createdAt,
      status: cert.approvalStatus,
      remarks: cert.remarks,
      owner: "E-Seva Center",
      ownerType: "center",
      // Store complete eseva data for certificate component
      certificateData: {
        ...eseva,
        role: "Eseva",
        ESevaCertificate: [cert]
      }
    }));

    // Sub-admin documents
    const subAdminDocs = eseva.subAdmins.map(subAdmin => [
      // Sub-admin personal documents
      {
        id: `subadmin-${subAdmin.id}-aadhar`,
        title: `${subAdmin.name} - Aadhar Card`,
        category: "Sub-Admins",
        url: subAdmin.aadhardoc,
        description: `Sub-admin Aadhar card - ${subAdmin.name}`,
        icon: "🆔",
        type: "image",
        uploadDate: subAdmin.createdAt,
        owner: subAdmin.name || "Sub-Admin",
        ownerType: "subadmin",
        subAdminId: subAdmin.id
      },
      {
        id: `subadmin-${subAdmin.id}-pan`,
        title: `${subAdmin.name} - PAN Card`,
        category: "Sub-Admins",
        url: subAdmin.pandoc,
        description: `Sub-admin PAN card - ${subAdmin.name}`,
        icon: "💳",
        type: "image",
        uploadDate: subAdmin.createdAt,
        owner: subAdmin.name || "Sub-Admin",
        ownerType: "subadmin",
        subAdminId: subAdmin.id
      },
      {
        id: `subadmin-${subAdmin.id}-profile`,
        title: `${subAdmin.name} - Profile Photo`,
        category: "Sub-Admins",
        url: subAdmin.profilepic,
        description: `Sub-admin profile photo - ${subAdmin.name}`,
        icon: "📷",
        type: "image",
        uploadDate: subAdmin.createdAt,
        owner: subAdmin.name || "Sub-Admin",
        ownerType: "subadmin",
        subAdminId: subAdmin.id
      },
      // Sub-admin certificates
      ...(subAdmin.ESevaSubAdminCertificate?.map(cert => ({
        id: `subadmin-certificate-${cert.id}`,
        title: `${subAdmin.name} - Digital Certificate`,
        category: "Sub-Admin Certificates",
        url: null,
        description: `Certificate ${cert.cardNo ? `- ${cert.cardNo}` : ''} | Status: ${cert.approvalStatus}`,
        icon: "📄",
        type: "certificate",
        uploadDate: cert.createdAt,
        status: cert.approvalStatus,
        remarks: cert.remarks,
        owner: subAdmin.name || "Sub-Admin",
        ownerType: "subadmin",
        subAdminId: subAdmin.id,
        // Store sub-admin data for certificate component
        certificateData: {
          ...subAdmin,
          role: "SubAdmin",
          parentEseva: eseva,
          ESevaSubAdminCertificate: [cert]
        }
      })) || [])
    ]).flat();

    const allDocuments = [
      ...esevaDocuments,
      ...esevaCertificates,
      ...subAdminDocs
    ];

    return allDocuments.filter(doc => doc.url || doc.type === "certificate");
  };

  const documents = getEsevaDocuments(eseva);

  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  console.log("Processed E-Seva documents:", {
    totalDocuments: documents.length,
    centerCertificates: documents.filter(d => d.category === "Certificates").length,
    subAdminCertificates: documents.filter(d => d.category === "Sub-Admin Certificates").length,
    categories: Object.keys(documentsByCategory),
    subAdmins: eseva.subAdmins?.map(sa => ({ name: sa.name, id: sa.id }))
  });

  return (
    <EsevaDocumentsView 
      eseva={eseva} 
      documents={documents}
      documentsByCategory={documentsByCategory}
    />
  );
};

export default EsevaDocumentsPage;