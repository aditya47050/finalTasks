import { db } from "@/lib/db";
import SurgeryPackageMain from "./component/SurgeryPackageMain";
import { getSession } from "@/lib/getsession";

const SurgeryPackagesPage = async () => {
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
  const data = await db.surgerytreatment.findMany({
    include: {
      hospital: {
        select: {
          id: true,
          email: true,
          hspInfo: {
            select: {
              regname: true,
              hspcategory: {
                select: {
                  hspcategory: {
                    select: { id: true, title: true }
                  }
                }
              }
            }
          },
          hspcontact: { select: { city: true, state: true, dist: true, taluka: true, pincode: true, address: true } },
          _count: {
            select: {
              reviews: true,
              Surgeytreatment: true, // this is fine
            }
          }
        }
      },
      _count: {
        select: {
          BookSurgeryTreatment: true, // count bookings per surgery/treatment
        }
      }
    }
  });

  const specilitytype = {
    title: "Surgery & Treatment Packages",
  };
  
  const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

  return (
    <div>
      <SurgeryPackageMain
        surgeryTreatmentData={data}
        specilitytype={specilitytype}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
        patientCity={patient?.city}
      />
    </div>
  );
};

export default SurgeryPackagesPage;