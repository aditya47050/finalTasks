import { getScanSession } from "@/lib/getscansession";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import DashboardNavBar from "../components/dashboardnavbar";
import DashboardSidebar from "../components/sidebar";
import NextTopLoader from "nextjs-toploader";

export const dynamic = "force-dynamic"; // layout runs server-side dynamically

export default async function PatientLayout({ params, children }) {
  const { patientid: patientId } = params;

  // 1️⃣ Check scan session
  const scanSession = await getScanSession();
  if (!scanSession || !scanSession.email) {
    redirect("/hospital/login");
  }

  // 2️⃣ Check user session
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/hospital/login");
  }

  // 3️⃣ Use session directly as userdata
  const userdata = {
    email: session.email,
    role: session.role,
    mobile: session.mobile ?? null, // optional
  };

  // 4️⃣ Render layout
  return (
    <>
      <NextTopLoader />

      {/* Navbar */}
      <div className="relative z-20">
        <DashboardNavBar userdata={userdata} />
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar patientId={patientId} role={userdata.role} data={userdata} />

        {/* Main Content */}
        <div className="flex-1 pt-[60px] lg:ml-[240px] xs:mt-[50px] lg:mt-[64px]">
          {children}
        </div>
      </div>
    </>
  );
}