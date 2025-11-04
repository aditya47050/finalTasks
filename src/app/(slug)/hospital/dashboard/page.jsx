import React from "react";
import Dashboardclient from "./components/dashboardclient";
import HospitalDashboard from "./components/hospitaldashboard";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const HospitalDashboardPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    redirect("/hospital/login");
  }

  let hospitalData;

  if (session.role === "receptionist") {
    // Receptionist → fetch linked hospital with full data
    const receptionistData = await db.receptionist.findUnique({
      where: { email: session.email },
      include: {
        hospital: {
          include: {
            hspInfo: {
              include: {
                hspcategory: {
                  include: { hspcategory: true },
                },
              },
            },
            hspdetails: true,
            hspcontact: true,
            hspbranches: true,
            HospitalCertificate: true,
            HospitalSpeciality: { include: { speciality: true } },
            HospitalDoctor: {
              include: {
                doctor: {
                  include: {
                    doctorinfo: true,
                    specialities: { include: { speciality: true } },
                  },
                },
              },
            },
            HospitalAmbulance: {
              include: {
                ambulance: {
                  include: {
                    AmbulanceVaichicle: true,
                    AmbulanceDriver: true,
                  },
                },
              },
            },
            BedCategory: {
              include: {
                beds: {
                  include: {
                    BedBooking: {
                      include: {
                        patient: {
                          select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            mobile: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            Bed: {
              include: {
                category: true,
                BedBooking: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            BedBooking: {
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
                bed: { include: { category: true } },
              },
            },
            staff: true,
            Receptionist: true,
            HospitalDepartment: true,
            diagnosticServices: {
              include: {
                BookDiagnosticService: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            Surgeytreatment: {
              include: {
                BookSurgeryTreatment: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                    doctors: {
                      include: {
                        doctor: {
                          select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            HomeHealthcare: {
              include: {
                BookHomeHealthcare: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            LabTest: {
              include: {
                BookLabTest: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            Wellnesspackage: {
              include: {
                BookWellnesspackage: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            Bloodbank: {
              include: {
                BookBloodbank: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            reviews: {
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
            linkedDiagnosticCenters: {
              include: { diagnosticCenter: { include: { hspInfo: true } } },
            },
            diagnosticCenterPartnerships: {
              include: { hospital: { include: { hspInfo: true } } },
            },
            linkedHomeHealthcare: {
              include: { homeHealthcare: { include: { hspInfo: true } } },
            },
            homeHealthcarePartnerships: {
              include: { hospital: { include: { hspInfo: true } } },
            },
            HospitalPayment: true,
          },
        },
      },
    });

    hospitalData = receptionistData?.hospital;
  } else {
    // Hospital User → fetch directly with full data
    hospitalData = await db.hospital.findFirst({
      where: { email: session.email },
      include: {
        hspInfo: {
          include: {
            hspcategory: {
              include: { hspcategory: true },
            },
          },
        },
        hspdetails: true,
        hspcontact: true,
        hspbranches: true,
        HospitalCertificate: true,
        HospitalSpeciality: { include: { speciality: true } },
        HospitalDoctor: {
          include: {
            doctor: {
              include: {
                doctorinfo: true,
                specialities: { include: { speciality: true } },
              },
            },
          },
        },
        HospitalAmbulance: {
          include: {
            ambulance: {
              include: {
                AmbulanceVaichicle: true,
                AmbulanceDriver: true,
              },
            },
          },
        },
        BedCategory: {
          include: {
            beds: {
              include: {
                BedBooking: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        Bed: {
          include: {
            category: true,
            BedBooking: {
              include: {
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    mobile: true,
                  },
                },
              },
            },
          },
        },
        BedBooking: {
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
            bed: { include: { category: true } },
          },
        },
        staff: true,
        Receptionist: true,
        HospitalDepartment: true,
        diagnosticServices: {
          include: {
            BookDiagnosticService: {
              include: {
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    mobile: true,
                  },
                },
              },
            },
          },
        },
        Surgeytreatment: {
          include: {
            BookSurgeryTreatment: {
              include: {
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    mobile: true,
                  },
                },
                doctors: {
                  include: {
                    doctor: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        HomeHealthcare: {
          include: {
            BookHomeHealthcare: {
              include: {
                patient: {
                  select: {
                    id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            LabTest: {
              include: {
                BookLabTest: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            Wellnesspackage: {
              include: {
                BookWellnesspackage: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            Bloodbank: {
              include: {
                BookBloodbank: {
                  include: {
                    patient: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                      },
                    },
                  },
                },
              },
            },
            reviews: {
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
            linkedDiagnosticCenters: {
              include: { diagnosticCenter: { include: { hspInfo: true } } },
            },
            diagnosticCenterPartnerships: {
              include: { hospital: { include: { hspInfo: true } } },
            },
            linkedHomeHealthcare: {
              include: { homeHealthcare: { include: { hspInfo: true } } },
            },
            homeHealthcarePartnerships: {
              include: { hospital: { include: { hspInfo: true } } },
            },
            HospitalPayment: true,
          },
        });
      }

      if (!hospitalData) {
        redirect("/hospital/login");
      }

      return (
        <>
          <HospitalDashboard 
            hospitaldata={hospitalData} 
          />
          <Dashboardclient session={session.role}/>
        </>
      );
    };

    export default HospitalDashboardPage;