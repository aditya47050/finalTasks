// src/app/(superadmin)/superprofile/aarogyadhan/donations/page.jsx

import { db } from "@/lib/db";
import React from "react";
import AllDonationsList from "../components/donationslist";

const AllDonationsPage = async () => {
  const donationData = await db.Donation.findMany({
    select: {
      id: true,
      amount: true,
      paymentStatus: true,
      createdAt: true,
      donorName: true,
      donorEmail: true,
      donorMobile: true,
      campaignId: true,
      donorId: true,
      campaign: {
        select: {
          id: true,
          fundraisertitle: true,
          fundraiser: {
            select: {
              patientId: true, // Include patientId from the fundraiser
            },
          },
        },
      },
      donor: {
        select: {
          id: true,
          fullname: true,
        },
      },
    },
  });

  return <AllDonationsList donationData={donationData} />;
};

export default AllDonationsPage;