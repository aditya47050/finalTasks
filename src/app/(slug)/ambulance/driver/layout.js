import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardNavBar from "../dashboard/components/dashboardnavbar";
import DashboardSidebar from "../dashboard/components/sidebar";

export const metadata = {
  title: "Ambulance Driver Dash Board",
  description: " Ambulance Driver Dash Board",
};

export default async function PDashboardAllLayout({ children }) {
  const user = await getSession();

  if (!user) {
    redirect("/ambulance/login");
  }
  const userdata = await db.AmbulanceDriver.findFirst({
    where: {
      email: user.email,
      mobile: user.mobile,
    },
  });
  const passwordMatch = await bcrypt.compare(user.password, userdata.password);
  // Ensure userdata exists before accessing its properties
  if (!userdata && !passwordMatch) {
    redirect("/ambulance/login");
  } 
  
  return (
    <>
      <div className="relative z-20">
        <DashboardNavBar
          firstName={userdata.firstname}
          city={userdata.pincode + "-Area"}
          passportPhoto={userdata.photo}
        />
      </div>
      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0  z-10">
          {" "}
          {/* Dynamic positioning */}
          <DashboardSidebar
             firstName={userdata.firstname}
             city={userdata.pincode + "-Area"}
             passportPhoto={userdata.photo} role={"Ambulance-driver"}
          />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-[240px] mt-[64px]">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
