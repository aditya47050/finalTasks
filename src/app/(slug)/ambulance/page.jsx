// app/ambulance/page.js
import { db } from "@/lib/db";
import AmbulanceMainClient from "./components/allAmbulancesClient";

const AmbulancePage = async () => {
  try {
    const ambulanceVehicles = await db.AmbulanceVaichicle.findMany({
      select: {
        id: true,
        ambulancemodel: true,
        ambulancecharges: true,
        ambulancetype: true,
        ambulanceareapincode: true,
        ambulanceimagefront: true,
        ambulanceimageback: true,
        ambulanceimageleft: true,
        ambulanceimageright: true,
        ambulanceimageinternal: true,
        ambulancefinalcharge:true,
        ambulancediscount:true,
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
    });

    const hospitalCategories = await db.HospitalsCategory.findMany({});

    // Ensure data is not undefined
    const validAmbulances = ambulanceVehicles || [];
    const validHospitalCategories = hospitalCategories || [];
    const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);
    return (
      <AmbulanceMainClient
        ambulances={validAmbulances}
        hospitalCategories={validHospitalCategories}
        stateList={state}
      districtList={district}
      subdistrictList={subdistrict}
      />
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error appropriately, e.g., return an error component or message
    return <div>Error loading data</div>;
  }
};

export default AmbulancePage;