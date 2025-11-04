import React from 'react';
import { db } from '@/lib/db';
import DoctorAnalyticsgraph from './client';

const DoctorPage = async () => {
  const data = await db.Doctor.findMany({
    include: {
      doctorinfo: true,
      specialities: {
        include: { speciality: true }, // Ensuring speciality title is included
      },
      DoctorCertificate: true, // Ensure approvalStatus is available
    },
  });

  // Transform data to match frontend expectations
  const transformedData = data.map((doctor) => ({
    ...doctor,
    specialities: doctor.specialities.map((spec) => ({
      id: spec.speciality.id,
      title: spec.speciality.title, // Ensure the title is correctly accessible
    })),
    approvalStatus:
      doctor.DoctorCertificate.length > 0
        ? doctor.DoctorCertificate[0].approvalStatus
        : "PENDING", // Default to PENDING if no certificate
  }));

  const expertDoctorCategories = await db.ExpertDoctorsCategory.findMany({});

  return (
    <div >
        <DoctorAnalyticsgraph         userdata={transformedData}
        expertDoctorCategories={expertDoctorCategories}/>
    </div>
  );
};

export default DoctorPage;
