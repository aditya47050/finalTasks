import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import BookAmbulanceClient from "../../components/bookambulance";

const DriverBookingsPage = async () => {
  const session = await getSession();
  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  // Fetch the driver's ambulances
  const ambulanceDriver = await db.AmbulanceDriver.findUnique({
    where: { email: session.email },
    select: {
      AmbulanceVaichicle: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!ambulanceDriver || ambulanceDriver.AmbulanceVaichicle.length === 0) {
    return <div>No ambulance vehicles found for this driver.</div>;
  }

  // Extract all ambulance vehicle IDs
  const ambulanceVehicleIds = ambulanceDriver.AmbulanceVaichicle.map((v) => v.id);

  // Fetch all BookAmbulance entries where ambulanceVaichicleId matches any vehicle ID
  const driverBookings = await db.BookAmbulance.findMany({
    where: {
      ambulanceVaichicleId: { in: ambulanceVehicleIds },
    },
    select: {
      id: true,
      status: true,
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
      <BookAmbulanceClient userdata={driverBookings} />
    </div>
  );
};

export default DriverBookingsPage;