// src/app/(superadmin)/superprofile/aarogyadhan/photographers/[photographerid]/page.jsx

import { db } from "@/lib/db"; // Adjust the import path as necessary
import React from "react";
import PhotographerSingleView from "@/app/aarogyadhan/photographer/components/photographersingleview";

const Photographersingleview = async ({ params }) => {
  const { photographerid } = await params;
  const id = photographerid;
  const photographerData = await db.photographer.findFirst({
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
      status: true,
      cancelledCheque: true,
      createdAt: true,
      updatedAt: true,
      PhotographerCertificate: true,
      fundraisingCampaign: { // Include assigned campaigns
        select: {
          id: true,
          fundraisertitle: true,
          goalamount: true,
          recievedamount: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  if (!photographerData) {
    return <div>Photographer not found</div>;
  }

  return <PhotographerSingleView photographerData={photographerData} />;
};

export default Photographersingleview;
