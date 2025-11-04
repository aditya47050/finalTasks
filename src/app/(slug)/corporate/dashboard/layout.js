import NextTopLoader from "nextjs-toploader";

import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import DashboardNavBar from "./component/dashboardnavbar";
import DashboardSidebar from "./component/sidebar";
import { db } from "@/lib/db";
import Footer from "@/app/components/footer";
export const metadata = {
  title: "Corporate Dash Board",
  description: "",
};

export default async function PDashboardAllLayout({ children }) {
  const patientUser = await getSession();

  if (!patientUser) {
    redirect("/corporate/login");
  }
  const userdata = await db.Patient.findFirst({
    where: {
      email: patientUser.email,
    },
  });

  // Ensure userdata exists before accessing its properties
  if (!userdata) {
    redirect("/corporate/login");
  }
  return (
    <>
      <NextTopLoader />



      <div className="relative z-20">
      <DashboardNavBar userdata={userdata} />
      </div>
      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0  z-10"> {/* Dynamic positioning */}
        <DashboardSidebar data={userdata} />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-[240px] mt-[64px]">
          <div>{children}</div>
        </div>
      </div>

    </>
  );
}
