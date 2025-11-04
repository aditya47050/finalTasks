// src/app/(superadmin)/superprofile/aarogyadhan/donors/[donorid]/page.jsx

import DonorSingleView from "@/app/(superadmin)/superprofile/aarogyadhan/components/donorsingleview";
import { db } from "@/lib/db"; // Adjust the import path as necessary
import { getSession } from "@/lib/getsession";
import React from "react";

const DonorSingleViewPage = async () => {
  const session = await getSession();
  if (!session || !session.email) {
    return <div>Unauthorized or session expired</div>;
  }

  const donorData = await db.donor.findFirst({
    where: { email: session.email },
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
