import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import DashboardNavBar from "./components/dashboardnavbar";
import DashboardSidebar from "./components/sidebar";
import { db } from "@/lib/db";

export const metadata = {
  title: "Ambulanace Dash Board",
  description: " Ambulance Dash Board",
};

export default async function PDashboardAllLayout({ children }) {
  const user = await getSession();

  if (!user) {
    redirect("/ambulance/login");
  }
  const userdata = await db.Ambulance.findFirst({
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
          firstName={userdata.ownerfirstname}
          city={userdata.pincode + "-Area"}
          passportPhoto={userdata.passportphoto}
        />
      </div>
      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0  z-10">
          {" "}
          {/* Dynamic positioning */}
          <DashboardSidebar
            firstName={userdata.ownerfirstname}
            city={userdata.pincode + "-Area"}
            passportPhoto={userdata.passportphoto} role={"Ambulance"}
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
