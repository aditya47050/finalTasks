import { db } from "@/lib/db";
import React from "react";
import BedCategoryDetail from "../components/singlebedcategory";
import { getSession } from "@/lib/getsession";

const BedCategoryPage = async ({ params }) => {
  const bedcategoryid = params.bedcategory;
  const session = await getSession();
  const hospital = await db.Hospital.findMany({
    where: { email: session.email },
    select: {
      id: true,
    },
  });

  const data = await db.BedCategory.findFirst({
    where: { id: bedcategoryid },
    select: {
      id: true,
      name: true,
      chargeType: true,
      minPrice: true,
      maxPrice: true,
      bedCount: true,
      hospitalId: true,
      hospital: true,
      schemabedcounts   :true,
      hasgovernmentschema :true ,
      schema :true , 
      beds: {
        select: {
          id: true,
          bedNumber: true,
          status: true,
          scheme : true,
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          hospitalId: true,
          categoryId: true,
          BedBooking: true,
        },
      },
      image: true,
      image1: true,
      image2: true,
      image3: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Fetch doctors associated with the hospital
  const doctors = await db.Doctor.findMany({
    where: {
      HospitalDoctor: {
        some: {
          hospitalId: hospital.id, // Assuming the bed category has a hospitalId field
        },
      },
    },
  });

  const allBookings = data?.beds?.flatMap((bed) => bed.BedBooking) || [];

  return (
    <BedCategoryDetail
      categorydata={data}
      bedsdata={data?.beds || []}
      bookingdata={allBookings}
      doctorsdata={doctors}
    />
  );
};

export default BedCategoryPage;
