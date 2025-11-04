import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DoctorDocumentsView from "../../components/DoctorDocumentsView";

const DoctorDocumentsPage = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/doctor/login");

  const doctor = await db.doctor.findFirst({
    where: { email: session.email },
    include: {
      doctorinfo: true,
      DoctorCertificate: {
        orderBy: { createdAt: "desc" }
      },
      specialities: {
        include: {
          speciality: true
        }
      }
    },
  });

  if (!doctor) {
    return <div className="p-6">Doctor not found</div>;
  }

  // Extract all documents from doctor profile
  const documents = [
    // Degree Certificates
    {
      id: "degree-certificate",
      title: "Degree Certificate",
      category: "Education",
      url: doctor.degreecertificate,
      description: "Medical degree and qualification certificates",
      icon: "🎓",
      type: "image",
      uploadDate: doctor.createdAt
    },
    {
      id: "speciality-degree-certificate",
      title: "Speciality Degree Certificate",
      category: "Education",
      url: doctor.specialitydegreecertificate,
      description: "Specialization degree certificates",
      icon: "📜",
      type: "image",
      uploadDate: doctor.createdAt
    },

    // Registration Documents
    {
      id: "registration-certificate",
      title: "Registration Certificate",
      category: "Registration",
      url: doctor.registrationcertificate,
      description: "Medical council registration certificate",
      icon: "🏛️",
      type: "image",
      uploadDate: doctor.registrationdate
    },

    // Personal Documents
    {
      id: "passport-photo",
      title: "Passport Photo",
      category: "Personal",
      url: doctor.doctorinfo?.passportphoto,
      description: "Professional passport size photograph",
      icon: "📷",
      type: "image",
      uploadDate: doctor.doctorinfo?.createdAt
    },
    {
      id: "pancard",
      title: "PAN Card",
      category: "Personal",
      url: doctor.doctorinfo?.pancardfront,
      description: "PAN card document",
      icon: "💳",
      type: "image",
      uploadDate: doctor.doctorinfo?.createdAt
    },
    {
      id: "aadhar-front",
      title: "Aadhar Card (Front)",
      category: "Personal",
      url: doctor.doctorinfo?.aadharcardfront,
      description: "Aadhar card front side",
      icon: "🆔",
      type: "image",
      uploadDate: doctor.doctorinfo?.createdAt
    },
    {
      id: "aadhar-back",
      title: "Aadhar Card (Back)",
      category: "Personal",
      url: doctor.doctorinfo?.aadharcardback,
      description: "Aadhar card back side",
      icon: "🆔",
      type: "image",
      uploadDate: doctor.doctorinfo?.createdAt
    },

    // Bank Documents
    {
      id: "cancelled-cheque",
      title: "Cancelled Cheque",
      category: "Bank",
      url: doctor.doctorinfo?.cancelledCheque,
      description: "Bank account verification cheque",
      icon: "🏦",
      type: "image",
      uploadDate: doctor.doctorinfo?.createdAt
    },

    // Certificates
    ...doctor.DoctorCertificate.map((cert, index) => ({
      id: `certificate-${cert.id}`,
      title: `Professional Certificate ${index + 1}`,
      category: "Certificates",
      url: cert.cardNo,
      description: `Certificate ${cert.cardNo ? `- ${cert.cardNo}` : ''}`,
      icon: "📄",
      type: "image",
      uploadDate: cert.createdAt,
      status: cert.approvalStatus,
      remarks: cert.remarks,
      registrationDate: doctor.registrationdate,
      renewalDate: doctor.regrenewaldate,
    }))
    
  ].filter(doc => doc.url); // Only include documents that have URLs

  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  return (
    <DoctorDocumentsView 
      doctor={doctor} 
      documents={documents}
      documentsByCategory={documentsByCategory}
    />
  );
};

export default DoctorDocumentsPage;