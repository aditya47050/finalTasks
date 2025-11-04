import React from "react";
import { db } from "@/lib/db";
import Doctorslistmainclient from "../components/alldoctorslistclient";
import { getSession } from "@/lib/getsession";

const DoctorSpecilitytypedatashowpage = async ({ params }) => {
  const id = params.doctortypeid; 

  const session = await getSession();

  let patient = null; // ✅ properly declare patient

  if (session?.email) {
    patient = await db.patient.findFirst({
      where: { email: session.email },
      select: { city: true },
    });
  } else {
    console.log("⚠️ No session found, skipping patient lookup.");
  }

  const doctorcategoryname = await db.expertDoctorsCategory.findFirst({
    where: { id },
  });

  if (!doctorcategoryname) {
    return <p>Speciality not found</p>;
  }

  const doctordetails = await db.doctor.findMany({
    where: {
      specialities: {
        some: {
          specialityId: id, 
        },
      },
    },
    include: {
      doctorinfo: true, 
      HospitalDoctor: {
        include: {
          hospital: {
            include: {
              hspInfo: {
                include: {
                  hspcategory: {
                    include: {
                      hspcategory: true 
                    }
                  }
                }
              }
            }
          }
        }
      },
      BookFreeAppointment: true,
    },
  });

  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);
  
  return (
    <>
      <Doctorslistmainclient
        doctordetails={doctordetails}
        specilitytype={doctorcategoryname}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        patientCity={patient?.city} // Pass the patient's city (could be undefined)
      />
    </>
  );
};

export default DoctorSpecilitytypedatashowpage;
