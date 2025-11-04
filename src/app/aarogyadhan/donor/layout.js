import NextTopLoader from "nextjs-toploader";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
export const metadata = {
  title: "Donor Dash Board",
  description: "",
};

export default async function PDashboardAllLayout({ children }) {
  const donorUser = await getSession();
  if (!donorUser) {
    redirect("/donor/login");
  }

  const userdata = await db.donor.findFirst({
    where: {
      email: donorUser.email,
    },
  });
  const passwordMatch = await bcrypt.compare(
    donorUser.password,
    userdata.password
  );
  // Ensure userdata exists before accessing its properties
  if (!userdata && !passwordMatch) {
    redirect("/donor/login");
  }
  return (
    <>
      <div>{children}</div>
    </>
  );
}
