// src/app/(superadmin)/superprofile/aarogyadhan/donors/[donorid]/page.jsx

import { db } from "@/lib/db"; // Adjust the import path as necessary
import React from "react";
import DonorSingleView from "../../components/donorsingleview"; // Ensure this path is correct

const DonorSingleViewPage = async ({ params }) => {
  const id = params.donorid;
  const donorData = await db.donor.findFirst({
    where: { id },
    select: {
      id: true,
      email: true,
      fullname: true,
      mobile: true,
      pincode: true,
      city: true,
      pancardno: true,
      pancardimage: true,
      aadharcardno: true,
      aadharcardimage: true,
      createdAt: true,
      updatedAt: true,
      patientId: true,
      // Add any other fields you want to include, except password
    },
  });

  if (!donorData) {
    return <div>Donor not found</div>;
  }

  // Fetch donations using the donor's mobile number
  const donations = await db.donation.findMany({
    where: { donorMobile: donorData.mobile },
    select: {
      id: true,
      amount: true,
      paymentStatus: true,
      createdAt: true,
      campaign: {
        select: {
          id: true,
          fundraisertitle: true,
          recievedamount: true,
          goalamount: true,
        },
      },
    },
  });

  // Combine donor data with donations
  const donorWithDonations = { ...donorData, Donation: donations };

  return <DonorSingleView donorData={donorWithDonations} />;
};

export default DonorSingleViewPage;
