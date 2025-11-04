import React from "react";
import { db } from "@/lib/db";
import AllBedsClient from "./components/allbeds";

const Page = async () => {
  try {
    const bedCategories = await db.bedCategory.findMany({
      select: {
        id: true,
        name: true,
        chargeType: true,
        minPrice: true,
        maxPrice: true,
        bedCount: true,
        image: true,
        image1:true,
        beds: true,
        hospital: {
          select: {
            id: true,
            pincode: true,
            hspcontact: {
              select: {
                city: true,
                state: true,
              },
            },
            hspInfo: {
              select: {
                regname: true,
                governmentschemes: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "desc",
      },
   
    });


    const hospitalCategories = await db.hospitalsCategory.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    const [state, district, subdistrict] = await Promise.all([
    db.state.findMany(),
    db.district.findMany(),
    db.SubDistrict.findMany(),
  ]);

    return (
      <div >
        <AllBedsClient
          bedCategories={bedCategories}
          hospitalCategories={hospitalCategories}
          stateList={state}
      districtList={district}
      subdistrictList={subdistrict}
        />
      </div>
    );
  } catch (error) {
    console.error("❌ Error loading /beds page:", error);
    return (
      <div className="text-red-600 font-semibold p-4">
        Failed to load data for beds. Please try again later.
      </div>
    );
  }
};

export default Page;
