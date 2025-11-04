import NextTopLoader from "nextjs-toploader";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardNavBar from "../components/dashboardnavbar";
import DashboardSidebar from "../components/doctorsidebar";
export const metadata = {
  title: "Doctor Dash Board",
  description: "",
};

export default async function HospitalDashboardAllLayout({ children }) {
  const doctoruser = await getSession();

  if (!doctoruser) {
    redirect("/doctor/login");
  }
  const userdata = await db.Doctor.findFirst({
    where: {
      email: doctoruser.email,
      mobile: doctoruser.mobile,
    },
    include : {doctorinfo:true}
  });
 
  // Ensure userdata exists before accessing its properties
  if (!userdata && !passwordMatch) {
    redirect("/doctor/login");
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
  <div className="flex-1 lg:ml-[240px] xs:mt-[50px] lg:mt-[64px]">
    <div>{children}</div>
  </div>
</div>
    </>
  );
}
