import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


export const metadata = {
  title: "Diagnostic Center Dash Board",
  description: "",
};

export default async function HospitalDashboardAllLayout({ children }) {
  const hospitaluser = await getSession();
  if (!hospitaluser) {
    console.log("No session found, redirecting to login.");
    redirect("/hospital/login?role=DiagnosticCenter");
  }

  const userdata = await db.Hospital.findFirst({
    where: {
      email: hospitaluser.email,
      mobile: hospitaluser.mobile,
    },
  });

  const passwordMatch = await bcrypt.compare(hospitaluser.password, userdata.password);

  if (!userdata || !passwordMatch || userdata.role !== "DiagnosticCenter") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">
          You are not supposed to be here.
        </h1>
        <a href="/hospital/login" className="mt-4 text-blue-500 underline">
          Go back to login
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
