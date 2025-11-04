import Header from "./components/header";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SuperDashboardSidebar from "./components/supsidebar";

export const metadata = {
  title: "Super Admin",
  description: "",
};

export default async function SuperAdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userData = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  return (
    <>
      {/* Header */}
      <div className="relative z-20">
        <Header userdata={userData} />
      </div>
      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0  z-10"> {/* Dynamic positioning */}
          <SuperDashboardSidebar userdata={userData} />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:ml-[240px] xs:mt-[50px] lg:mt-[64px]">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}

