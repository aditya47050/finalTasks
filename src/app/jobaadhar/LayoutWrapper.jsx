"use client";
import { usePathname } from "next/navigation";
import { HeaderWithNotifications } from "./components/Header";
import { Footer } from "./components/footer";

export default function LayoutWrapper({ children, user ,seekerId}) {
  const pathname = usePathname();

  // Hide header/footer for employer dashboard
  const hideHeaderFooter = pathname.startsWith("/jobaadhar/employer/dashboard");

  return (
    <>
      {!hideHeaderFooter && <HeaderWithNotifications user={user} seekerId={seekerId}/>}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
