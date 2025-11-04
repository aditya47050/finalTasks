import React from 'react'
import PathologyMain from './component/PathologyMain'
import { db } from '@/lib/db';

const Pathologypage = async () => {
  try {
    // ✅ Fetch all three models
    const labTests = await db.labTest.findMany({
      include: {
        Hospital: true,
      },
    });
    const wellnessPackages = await db.wellnesspackage.findMany();
    const bloodBanks = await db.bloodbank.findMany();

    // ✅ Combine into one object (or separate props if you prefer)
    const specilitytype = {
      labTests,
      wellnessPackages,
      bloodBanks,
    };
    const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
    
  ]);


    return (
      <div>
        <PathologyMain specilitytype={specilitytype} 
        stateList={state}
      districtList={district}
      subdistrictList={subdistrict}/>
      </div>
    )
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data</div>;
  }
}

export default Pathologypage
