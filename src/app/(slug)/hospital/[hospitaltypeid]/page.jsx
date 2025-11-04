import React from "react";
import Hospitalmainclient from "../components/hospitalmainclient";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";

const Hsptypedatashowpage = async ({ params }) => {
  const { hospitaltypeid } = params;

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

  // Fetch linked hospital categories
  const linkedHspCategories = await db.hspCategory.findMany({
    where: { hspcategoryId: hospitaltypeid },
    select: { hspInfoId: true },
  });

  const hspInfoIds = linkedHspCategories.map((cat) => cat.hspInfoId);

  // Fetch hospital details with all necessary fields
  const hospitaldetailsRaw = await db.Hospital.findMany({
    where: {
      hspInfoId: { in: hspInfoIds },
    },
    select: {
      id: true,
      email: true,
      mobile: true,
      pincode: true,
      role: true,
      hspInfo: {
        select: {
          regname: true,
          totalnoofbed: true,
          totalspeciality: true,
          totaldoctor: true,
          totalambulance: true,
        },
      },
      hspdetails: {
        select: {
          hsplogo: true,
          hspregno: true,
          nabhnablapproved: true,
        },
      },
      hspcontact: {
        select: {
          city: true,
          state: true,
          dist: true,
          taluka: true,
          pincode: true,
        },
      },
      // Fetch Surgerytreatment with category and count of BookSurgeryTreatment
      Surgeytreatment: {
        select: {
          category: true,
          serviceName: true,
          _count: {
            select: {
              BookSurgeryTreatment: true,
            },
          },
        },
      },
      BedCategory: { select: { name: true } },
      diagnosticServices: { select: { facility: true } },
      HomeHealthcare: { select: { serviceName: true } },
      HospitalAmbulance: {
        select: {
          ambulance: {
            select: {
              AmbulanceVaichicle: {
                select: {
                  _count: {
                    select: {
                      BookAmbulance: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      HospitalSpeciality: {
        select: { speciality: { select: { title: true } } },
      },
      HospitalDepartment: { select: { department: true } },
      HospitalDoctor: {
        select: {
          doctor: { select: { firstName: true, lastName: true } },
        },
      },
      hspbranches: { select: { branchname: true, branchcity: true } },
      LabTest: { select: { testname: true } },
      Wellnesspackage: { select: { aapackagename: true } },
      Bloodbank: { select: { bloodname: true, available: true } },
      Receptionist: { select: { name: true } },
      HospitalCertificate: { select: { cardNo: true } },
      _count: {
        select: {
          BedBooking: true,
          reviews: true,
        },
      },
    },
  });

  // Process and normalize hospital details
  const hospitaldetails = hospitaldetailsRaw.map((hospital) => {
    const contact = {
      ...hospital.hspcontact,
      district: hospital.hspcontact?.dist || "",
    };

    // Separate surgeries and treatments based on category
    const surgeryCategories = hospital.Surgeytreatment?.filter(st => st.category === 'Surgery').map(st => ({
      serviceName: st.serviceName,
      bookingCount: st._count.BookSurgeryTreatment,
    })) || [];

    const treatmentCategories = hospital.Surgeytreatment?.filter(st => st.category === 'Treatment').map(st => ({
      serviceName: st.serviceName,
      bookingCount: st._count.BookSurgeryTreatment,
    })) || [];

    const bedCategories = hospital.BedCategory?.map((b) => b.name).filter(Boolean) || [];

    const facilitiesSet = new Set();
    hospital.diagnosticServices?.forEach((d) => d.facility && facilitiesSet.add(d.facility));
    hospital.HomeHealthcare?.forEach((h) => h.serviceName && facilitiesSet.add(h.serviceName));
    hospital.HospitalAmbulance?.forEach((a) => a.ambulance?.category && facilitiesSet.add(a.ambulance.category));
    hospital.HospitalSpeciality?.forEach((s) => s.speciality && facilitiesSet.add(s.speciality));
    hospital.HospitalDepartment?.forEach((d) => d.department && facilitiesSet.add(d.department));
    hospital.HospitalDoctor?.forEach((d) => {
      if (d.doctor?.firstName && d.doctor?.lastName) facilitiesSet.add("Doctors");
    });
    hospital.hspbranches?.forEach((b) => b.branchname && facilitiesSet.add("Other Branches"));
    hospital.LabTest?.forEach((l) => l.testname && facilitiesSet.add("Lab Tests"));
    hospital.Wellnesspackage?.forEach((w) => w.aapackagename && facilitiesSet.add("Wellness"));
    hospital.Bloodbank?.forEach((b) => b.bloodname && facilitiesSet.add("Blood Bank"));
    hospital.homeHealthcarePartnerships?.forEach((h) => h.serviceName && facilitiesSet.add(h.serviceName));
    hospital.linkedHomeHealthcare?.forEach((h) => h.serviceName && facilitiesSet.add(h.serviceName));
    hospital.diagnosticCenterPartnerships?.forEach((d) => d.name && facilitiesSet.add("Diagnostic Centers"));
    hospital.linkedDiagnosticCenters?.forEach((d) =>
      d.diagnosticCenterId && facilitiesSet.add("Diagnostic Centers")
    );

    return {
      ...hospital,
      surgeryCategories,
      treatmentCategories,
      bedCategories,
      hospitalFacilities: Array.from(facilitiesSet),
      hspcontact: contact,
    };
  });

  // Fetch hospital category name
  const hspcategoryname = await db.HospitalsCategory.findFirst({ where: { id: hospitaltypeid } });

  // Fetch state, district, and subdistrict lists
  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

  return (
    <>
      <Hospitalmainclient
        hospitaldetails={hospitaldetails}
        hspcategoryname={hspcategoryname}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        patientCity={patient?.city}
      />
    </>
  );
};

export default Hsptypedatashowpage;