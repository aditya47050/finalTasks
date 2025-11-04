import React from "react";
import Dashboardclient from "./components/dashboardclient";
import DoctorDashboard from "./components/doctordashboard";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    redirect('/doctor/login');
  }

  const userData = await db.doctor.findFirst({
    where: {
      email: session.email,
    },
    include: {
      doctorinfo: true,
      specialities: {
        include: {
          speciality: true,
        },
      },
      doctorvisitinghospitals: true,
      DoctorCertificate: true,
      HospitalDoctor: {
        include: {
          hospital: {
            include: {
              hspInfo: true,
            },
          },
        },
      },
      Bed: {
        include: {
          category: true,
          hospital: {
            include: {
              hspInfo: true,
            },
          },
        },
      },
      BookFreeAppointment: {
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              mobile: true,
              email: true,
            },
          },
          category: true,
        },
      },
      DoctorReview: {
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      prescriptionTemplates: true,
      prescriptions: {
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      // This is the corrected/clarified section for 'bookings'
      bookings: {
        include: {
          booking: { // This relates to the BookSurgeryTreatment model
            include: {
              service: { // This relates to the Surgerytreatment model
                include: {
                  hospital: true, // Include the hospital related to the surgery service
                },
              },
              patient: { // Include patient directly from BookSurgeryTreatment for better data structure
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          // The 'patient' include at this level is redundant if you include it in 'booking'
          // You can remove this if you include patient in 'booking' as shown above.
          // patient: {
          //   select: {
          //     id: true,
          //     firstName: true,
          //     lastName: true,
          //   },
          // },
        },
      },
      DoctorPayment: true,
    },
  });

  if (!userData) {
    redirect('/doctor/login');
  }

  return (
    <>
      <DoctorDashboard userdata={userData} />
    </>
  );
};

export default DashboardPage;