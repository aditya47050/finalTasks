import { Suspense } from "react";
import { HeaderWithNotifications } from "./components/Header";
import { Footer } from "./components/footer";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import LayoutWrapper from "./LayoutWrapper";

export const metadata = {
  title: "Aarogya Aadhar | Job Portal",
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  let user = null;
  let seekerId = null;

  if (session?.email) {
    user = await db.JObUser.findFirst({ where: { email: session.email } });
  }
  if(user){
    seekerId = await db.JobSeeker.findFirst({
      where : {
        userId : user.id
      },
      select : {
        id : true,
      }
    })
  }
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Suspense fallback={null}>
          <LayoutWrapper user={user} seekerId={seekerId?.id}>{children}</LayoutWrapper>
        </Suspense>
      </body>
    </html>
  );
}