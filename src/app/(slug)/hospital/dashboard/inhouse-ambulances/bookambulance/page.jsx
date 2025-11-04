import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import BookAmbulanceClient from "./overview/client";

const BookAmbulancePage = async () => {
  const session = await getSession();

  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  // 1. Get the hospital based on the logged-in user's email
  const hospital = await db.hospital.findUnique({
    where: { email: session.email },
  });

  if (!hospital) {
    return <div>Hospital not found.</div>;
  }

  // 2. Get all ambulances linked to the hospital via HospitalAmbulance
  const hospitalAmbulances = await db.hospitalAmbulance.findMany({
    where: {
      hospitalId: hospital.id,
    },
    select: {
      ambulance: {
        select: {
          id: true,
          AmbulanceVaichicle: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  // 3. Extract all ambulance vehicle IDs
  const ambulanceVehicleIds = hospitalAmbulances.flatMap((entry) =>
    entry.ambulance.AmbulanceVaichicle.map((v) => v.id)
  );

  if (ambulanceVehicleIds.length === 0) {
    return <div>No ambulance vehicles found for this hospital.</div>;
  }

  // 4. Fetch BookAmbulance entries for the vehicle IDs
  const bookAmbulances = await db.BookAmbulance.findMany({
      where: {
        ambulanceVaichicleId: { in: ambulanceVehicleIds },
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        aadharCardNumber: true,
        mobileNumber: true,
        email: true,
        ambulancetype: true,
        ambulancecategory: true,
        hospitaltype: true,
        aadharCardImage: true,
        healthcard: true,
        medicaldoc1: true,
        medicaldoc2: true,
        medicaldoc3: true,
        healthInsurance: true,
        healthInsuranceNumber: true,
        healthInsuranceDocument: true,
        ayushmancard: true,
        ayushmanCardNumber: true,
        ayushmanCardFront: true,
        diseaseDetails: true,
        bloodgroup: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            // Exclude password and other sensitive fields
          },
        },
        ambulanceVaichicle: {
          select: {
            id: true,
            ambulancemodel: true,
            ambulancecharges: true,
            ambulancetype: true,
            ambulancecategory: true,
            ambulanceareapincode: true,
            ambulanceimagefront: true,
            ambulanceimageback: true,
            ambulanceimageleft: true,
            ambulanceimageright: true,
            ambulanceimageinternal: true,
            isOnline: true,
            status: true,
            facilities: true,
            latitude: true,
            longitude: true,
            driver: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                mobile: true,
                firstaidtraining: true,
                bloodgroup: true,
                dateofbirth: true,
                gender: true,
                email: true,
              },
            },
            ambulance: {
              select: {
                id: true,
                mobile: true,
                category: true,
                pincode: true,
                AmbulanceHsp: {
                  select: {
                    hspregname: true,
                    city: true,
                    state: true,
                    district: true,
                    pincode: true,
                    hspdescription: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  return (
    <div>
      <BookAmbulanceClient userdata={bookAmbulances} />
    </div>
  );
};

export default BookAmbulancePage;
