import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import HospitalDocumentsView from "../../components/DoctorDocumentsView";

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
      // Add doctor certificates - adjust the relation name based on your schema
      doctors: {
        include: {
          certificates: true // Assuming this is the relation name
        }
      },
    },
  });

  if (!hospital) {
    return <div className="p-6">Hospital not found</div>;
  }

  console.log("Hospital data:", {
    hspdetails: hospital.hspdetails,
    certificates: hospital.HospitalCertificate,
    doctors: hospital.doctors,
    role: hospital.role
  });

  // Extract all documents based on HSP role
  const getRoleSpecificDocuments = (hospital) => {
    const baseDocuments = [
      // Your existing base documents...
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

    // Role-specific additional documents
    const roleSpecificDocs = [];
    
    if (hospital.role === "Hospital") {
      roleSpecificDocs.push(
        {
          id: "hospital-license",
          title: "Hospital License",
          category: "License",
          url: hospital.hspdetails?.hspregcertificate,
          description: "Hospital operating license",
          icon: "🏥",
          type: "image",
          uploadDate: hospital.hspdetails?.createdAt,
          role: "Hospital"
        }
      );
    } else if (hospital.role === "Clinic") {
      roleSpecificDocs.push(
        {
          id: "clinic-license",
          title: "Clinic License",
          category: "License",
          url: hospital.hspdetails?.hspregcertificate,
          description: "Medical clinic operating license",
          icon: "🏥",
          type: "image",
          uploadDate: hospital.hspdetails?.createdAt,
          role: "Clinic"
        }
      );
    } else if (hospital.role === "DiagnosticCenter" || hospital.role === "Pathology") {
      roleSpecificDocs.push(
        {
          id: "lab-license",
          title: "Laboratory License",
          category: "License", 
          url: hospital.hspdetails?.hspregcertificate,
          description: "Diagnostic laboratory license",
          icon: "🔬",
          type: "image",
          uploadDate: hospital.hspdetails?.createdAt,
          role: hospital.role
        }
      );
    } else if (hospital.role === "homehealthcare") {
      roleSpecificDocs.push(
        {
          id: "home-care-license",
          title: "Home Care License",
          category: "License",
          url: hospital.hspdetails?.hspregcertificate,
          description: "Home healthcare service license",
          icon: "🏠",
          type: "image",
          uploadDate: hospital.hspdetails?.createdAt,
          role: "homehealthcare"
        }
      );
    }

    // Hospital Certificates
    const hospitalCertificates = hospital.HospitalCertificate.map((cert, index) => {
      return {
        id: `hospital-certificate-${cert.id}`,
        title: cert.cardNo ? `Hospital Certificate - ${cert.cardNo}` : `Hospital Certificate ${index + 1}`,
        category: "Hospital Certificates",
        url: cert.documentUrl || cert.certificateUrl || null, // Adjust based on your schema
        description: `Hospital certificate issued on ${new Date(cert.createdAt).toLocaleDateString()}`,
        icon: "🏥",
        type: "image",
        uploadDate: cert.createdAt,
        status: cert.approvalStatus,
        remarks: cert.remarks,
        role: "ALL",
        certificateNumber: cert.cardNo,
      };
    });

    // Doctor Certificates - Extract from doctors
    const doctorCertificates = [];
    
    if (hospital.doctors) {
      hospital.doctors.forEach((doctor, doctorIndex) => {
        if (doctor.certificates && doctor.certificates.length > 0) {
          doctor.certificates.forEach((cert, certIndex) => {
            doctorCertificates.push({
              id: `doctor-${doctor.id}-certificate-${cert.id}`,
              title: `Dr. ${doctor.name} - ${cert.title || 'Professional Certificate'}`,
              category: "Doctor Certificates",
              url: cert.documentUrl || cert.certificateUrl || cert.url || null,
              description: `Medical certificate for Dr. ${doctor.name} - ${cert.type || 'Professional Qualification'}`,
              icon: "👨‍⚕️",
              type: "image",
              uploadDate: cert.createdAt || cert.issueDate,
              status: cert.approvalStatus || "APPROVED",
              remarks: cert.remarks,
              role: "ALL",
              doctorName: doctor.name,
              doctorSpecialization: doctor.specialization,
              certificateType: cert.type,
              issueDate: cert.issueDate,
              expiryDate: cert.expiryDate,
            });
          });
        } else {
          // If no certificates but doctor exists, you might want to show basic doctor info
          doctorCertificates.push({
            id: `doctor-info-${doctor.id}`,
            title: `Dr. ${doctor.name} - Professional Info`,
            category: "Doctor Certificates",
            url: null,
            description: `Medical professional - ${doctor.specialization || 'General Practitioner'}`,
            icon: "👨‍⚕️",
            type: "info",
            uploadDate: doctor.createdAt,
            status: "APPROVED",
            role: "ALL",
            doctorName: doctor.name,
            doctorSpecialization: doctor.specialization,
          });
        }
      });
    }

    // Combine all documents
    const allDocuments = [
      ...baseDocuments,
      ...roleSpecificDocs,
      ...hospitalCertificates,
      ...doctorCertificates
    ];

    // Filter to show documents that have URLs OR are informational
    return allDocuments.filter(doc => 
      doc.url || // Has actual document URL
      doc.category === "Doctor Certificates" || // Show doctor certificates even without URLs
      doc.category === "Hospital Certificates" // Show hospital certificates
    );
  };

  const documents = getRoleSpecificDocuments(hospital);

  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  console.log("Processed documents:", {
    total: documents.length,
    byCategory: documentsByCategory,
    documents: documents
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