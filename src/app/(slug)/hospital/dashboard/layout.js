import NextTopLoader from "nextjs-toploader";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardNavBar from "../components/dashboardnavbar";
import DashboardSidebar from "../components/sidebar";

export const metadata = {
  title: " Dash Board",
  description: "",
};

export default async function HospitalDashboardAllLayout({ children }) {
  const user = await getSession();
  if (!user) {
    redirect("/hospital/login");
  }

  let hospitalData;

  // Check if user is a receptionist
  if (user.role === "receptionist" || user.hospitalId) {
    // For receptionist, get the linked hospital data
    const receptionistData = await db.receptionist.findUnique({
      where: { email: user.email },
      include: {
        hospital: {
          include: { hspInfo: true, hspdetails: true },
        },
      },
    });

    if (!receptionistData || !receptionistData.hospital) {
      redirect("/hospital/login");
    }

    // Use only hospital data for navbar and sidebar
    hospitalData = receptionistData.hospital;
  } else {
    // For hospital users, get hospital data directly
    hospitalData = await db.hospital.findFirst({
      where: {
        email: user.email,
        mobile: user.mobile,
      },
      include: { hspInfo: true, hspdetails: true },
    });

    if (!hospitalData) {
      redirect("/hospital/login");
    }

    // Verify password for hospital users
    const passwordMatch = await bcrypt.compare(
      user.password,
      hospitalData.password
    );

    if (!passwordMatch) {
      redirect("/hospital/login");
    }
  }

  return (
    <>
      <NextTopLoader />

      <div className="relative z-20">
        <DashboardNavBar userdata={hospitalData} />
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0 z-10">
          <DashboardSidebar data={hospitalData} />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-[240px] xs:mt-[50px] lg:mt-[64px]">
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
