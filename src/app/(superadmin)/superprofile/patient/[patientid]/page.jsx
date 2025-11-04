import { db } from "@/lib/db"
import PatientSingleView from "../components/patientsingleview"

const PatientSingleViewPage = async ({ params }) => {
  const userData = await db.patient.findFirst({
    where: {
      id: params.patientid,
    },
    include: {
      familymembers: true,
      medicalhistory: true,
      bookFreeAppointment: {
        include: {
          doctor: {
            include: {
              specialities: {
                include: {
                  speciality: true,
                },
              },
              doctorinfo: true,
              doctorvisitinghospitals: true,
            },
          },
          category: true,
        },
      },
      bedbooking: {
        include: {
          hospital: {
            include: {
              hspInfo: true,
              hspdetails: true,
              hspcontact: true,
              hspbranches: true,
            },
          },
          bed: {
            include: {
              category: true,
              doctor: true,
            },
          },
        },
      },
      healthcard: true,
      bookambulance: {
        include: {
          ambulanceVaichicle: {
            include: {
              ambulance: true,
              driver: true,
            },
          },
        },
      },
      emergencyambulance: true,
      patientMedicalHistory: true,
      donar: {
        include: {
          Donation: {
            include: {
              campaign: true,
            },
          },
        },
      },
      fundraiser: {
        include: {
          fundraisingCampaign: {
            include: {
              photographer: true,
              Donation: {
                include: {
                  donor: true,
                },
              },
            },
          },
        },
      },
      BookDiagnosticService: {
        include: {
          service: {
            include: {
              Hospital: true,
            },
          },
        },
      },
      Payment: true,
      healthInsurances: true,
      BookSurgeryTreatment: {
        include: {
          service: {
            include: {
              hospital: true,
            },
          },
        },
      },
      reviews: {
        include: {
          hospital: {
            include: {
              hspInfo: true,
            },
          },
        },
      },
      BookHomeHealthcare: {
        include: {
          HomeHealthcare: {
            include: {
              hospital: true,
            },
          },
        },
      },
      Eseva: {
        include: {
          payment: true,
        },
      },
    },
  })

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Patient Not Found</h1>
          <p className="text-gray-600 mt-2">The requested patient could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <PatientSingleView userdata={userData} />
    </div>
  )
}

export default PatientSingleViewPage
