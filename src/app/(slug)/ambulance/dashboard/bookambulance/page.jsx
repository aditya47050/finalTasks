import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import BookAmbulanceClient from "../../components/bookambulance";

const BookAmbulancePage = async () => {
  const session = await getSession();
  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  // Fetch ambulance with all its vehicles linked to the logged-in user's email
  const ambulance = await db.ambulance.findUnique({
    where: { email: session.email },
    select: {
      AmbulanceVaichicle: {
        select: {
          id: true,
          
          driver: {
            select: {
              id: true,
              
            },
          },
          ambulance: {
            select: {
              id: true,
             
              AmbulanceHsp: {
                select: {
                  hspregname: true,
                 
                },
              },
            },
          },
        },
      },
    },
  });

  if (!ambulance || ambulance.AmbulanceVaichicle.length === 0) {
    return <div>No ambulance vehicles found for this user.</div>;
  }

  // Extract all ambulance vehicle IDs
  const ambulanceVehicleIds = ambulance.AmbulanceVaichicle.map((v) => v.id);

  // Fetch all BookAmbulance entries where ambulanceVaichicleId matches any vehicle ID
  const bookAmbulances = await db.BookAmbulance.findMany({
    where: {
      ambulanceVaichicleId: { in: ambulanceVehicleIds },
    },
    include: {
      patient: true, // include patient details
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