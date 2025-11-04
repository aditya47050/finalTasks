import PharmacyMainClient from "./components/allPharmacyClient";
import { db } from "@/lib/db";
const pharmacyList = [
  {
    id: "1",
    name: "TATA 1mg",
    reviews: 258,
    rating: 3,

  },
  {
    id: "2",
    name: "Apollo 24/7",
    reviews: 580,
    rating: 3,

  },
  {
    id: "3",
    name: "PharmEasy",
    reviews: 351,
    rating: 3,
  },
  {
    id: "4",
    name: "Netmeds",
    reviews: 183,
    rating: 3,
  },
  {
    id: "5",
    name: "Flipkart Health",
    reviews: 183,
    rating: 3,
  },
  {
    id: "6",
    name: "Indian Chemist",
    reviews: 258,
    rating: 3,
  },
  {
    id: "7",
    name: "HEALTHKART",
    reviews: 258,
    rating: 3,
  },
  {
    id: "8",
    name: "MeDLIFe",
    reviews: 580,
    rating: 4,
  },
  {
    id: "9",
    name: "Indiapharm",
    reviews: 351,
  },
  {
    id: "10",
    name: "MedPlusMart",
    reviews: 183,
    rating: 3,
  },
];

const productList = [
  {
    name: "Dolo 650mg",
    category: "Tablet",
    details: "Pain Reliever",
    providers: [
      {
        name: "TATA 1mg",
        price: 28,
        discount: "10%",
      },
      {
        name: "Apollo 24/7",
        price: 30,
        discount: "8%",
      },
      {
        name: "PharmEasy",
        price: 27,
        discount: "12%",
      },
    ],
  },
  {
    name: "Crocin Advance",
    category: "Tablet",
    details: "Fever & Headache",
    providers: [
      {
        name: "Netmeds",
        price: 22,
        discount: "5%",
      },
      {
        name: "Flipkart Health",
        price: 21,
        discount: "6%",
      },
    ],
  },
  // add more products here...
];

const PharmacyPage = async () => {
  try {
    const [state, district, subdistrict] = await Promise.all([
      db.state.findMany(),
      db.district.findMany(),
      db.SubDistrict.findMany(),
    ]);
    return (
      <PharmacyMainClient
        pharmacyList={pharmacyList}
        productList={productList}
        stateList={state}
        districtList={district}
        subdistrictList={subdistrict}
      />
    );
  }
  catch (error) {
    console.error("Error loading pharmacy page:", error);
    return <div className="w-full h-screen flex justify-center items-center">Pharmacy Page - Failed to load</div>;
  }
};
export default PharmacyPage;