import NextTopLoader from "nextjs-toploader";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import DashboardNavBar from "./components/dashboardnavbar";
import DashboardSidebar from "./components/sidebar";
import { db } from "@/lib/db";
import Footer from "@/app/components/footer";
export const metadata = {
  title: "Patient Dash Board",
  description: "",
};

export default async function PDashboardAllLayout({ children }) {
  const patientUser = await getSession();
  if (!patientUser) {
    redirect("/patient/login");
  }

  const userdata = await db.Patient.findFirst({
    where: {
      email: patientUser.email,
    },
  });
  const mode = patientUser.mode || "main";

  // Ensure userdata exists before accessing its properties
  if (!userdata) {
    redirect("/patient/login");
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
        <div className="fixed left-0  z-10">
          {" "}
          {/* Dynamic positioning */}
          <DashboardSidebar userdata={userdata} />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-[240px] xs:mt-[50px] lg:mt-[64px]">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
