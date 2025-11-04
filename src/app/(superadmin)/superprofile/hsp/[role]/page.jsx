import React from "react";
import { db } from "@/lib/db";
import AllHospitalsList from "./components/allhospitalslist";

const HospitalPage = async ({ params }) => {
  const { role } = params;
  try {
    const hospitalData = await db.Hospital.findMany({
      where: { role },
      include: {
        hspInfo: {
          include: {
            hspcategory: { include: { hspcategory: true } },
          },
        },
        hspdetails: true,
        hspcontact: true,
        hspbranches: true,
        Bed: {
          include: {
            category: true,
          },
        },
        staff: true,
        HospitalDepartment: true,
        HospitalSpeciality: {
          include: {
            speciality: true,
          },
        },
        HospitalDoctor: { include: { doctor: true } },
        HospitalAmbulance: {
          include: {
            ambulance: { include: { AmbulanceVaichicle: true } },
          },
        },
        BedCategory: true,
        BedBooking: true,
      },
    });

    const states = await db.State.findMany();
    const districts = await db.District.findMany();
    const talukas = await db.SubDistrict.findMany();
    const specialities = await db.HospitalSpeciality.findMany({
      include: { speciality: true },
    });
    const bedCategories = await db.BedCategory.findMany();

    return (
      <div className="">
        <AllHospitalsList
          hospitalData={hospitalData}
          states={states || []}
          dist={districts || []}
          taluka={talukas || []}
          specialities={specialities.map((s) => s.speciality) || []}
          bedCategories={bedCategories || []}
          currentRole={role}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data. Please try again later.</div>;
  }
};

export default HospitalPage;
