// app/pharmacy/dashboard/layout.js
import NextTopLoader from "nextjs-toploader";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import PharmacyNavBar from "../components/dashboardnavbar";
import PharmacySidebar from "../components/sidebar";

export const metadata = {
  title: "Pharmacy Dashboard",
  description: "Pharmacy portal for managing medicines and services",
};

export default async function PharmacyDashboardLayout({ children }) {
  // ✅ Get logged in user session
  const user = await getSession();
  if (!user) {
    redirect("/pharmacy/login");
  }

  // ✅ Fetch pharmacy record from DB
  const pharmacyData = await db.pharmacy.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!pharmacyData) {
    redirect("/pharmacy/login");
  }


  return (
    <>
      <NextTopLoader />

      {/* Navbar */}
      <div className="relative z-20">
        <PharmacyNavBar userdata={pharmacyData} />
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0 z-10">
          <PharmacySidebar data={pharmacyData} />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-[240px] mt-[64px]">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
