import NextTopLoader from "nextjs-toploader";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardNavBar from "../components/e-sevanavbar";
import DashboardSidebar from "../components/e-sevasidebar";
export const metadata = {
  title: "Eseva Dash Board",
  description: "",
};

export default async function Esevalayout({ children }) {
  const esevauser = await getSession();

  if (!esevauser) {
    redirect("/e-seva/login");
  }
  let userdata;

  if (esevauser.role === "Eseva" || esevauser.role === "Asha") {
    userdata = await db.Eseva.findFirst({
      where: {
        email: esevauser.email,
        mobile: esevauser.mobile,
      },
    });
  } else if (esevauser.role === "SubAdmin") {
    userdata = await db.EsevaSubAdmin.findFirst({
      where: {
        email: esevauser.email,
        mobile: esevauser.mobile,
      },
    });
  } else {
    throw new Error("User not found");
  }

  // Check if userdata is undefined and handle it
  if (!userdata) {
    console.error("User data not found for the given session.");
    redirect("/e-seva/login"); // or handle the error appropriately
  }

  return (
    <>
      <NextTopLoader />

      <div className="relative z-20">
        <DashboardNavBar userdata={userdata} role={esevauser.role} />
      </div>
      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0  z-10">
          {" "}
          {/* Dynamic positioning */}
          <DashboardSidebar data={userdata} role={esevauser.role} />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-[240px] mt-[64px]">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}

