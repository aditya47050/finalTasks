import PharmacyMainClient from "./components/pharmacymainclient";
import { db } from "@/lib/db";

const PharmacyPage = async () => {
  try {
    const pharmacies = await db.pharmacy.findMany({
      include: {
        Product: true,
        Pharmacist: true,
        pharmacybranch: true,
        PharmacyCertificate: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const [state, district, subdistrict] = await Promise.all([
      db.state.findMany(),
      db.district.findMany(),
      db.SubDistrict.findMany(),
    ]);

    return (
      <PharmacyMainClient
        pharmacyList={pharmacies}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
      />
    );
  } catch (error) {
    console.error("Error loading pharmacy page:", error);
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Pharmacy Page - Failed to load
      </div>
    );
  }
};

export default PharmacyPage;
