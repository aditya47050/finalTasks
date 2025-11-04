"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/app/components/nav";
import MainSidebar from "@/app/components/sidebar";
import Mobilenav from "@/app/components/mobilenav";

const ConditionalLayoutWrapper = ({
  userData, 
  hspcategory,
  doctorcategory,
  children,
}) => {
  const pathname = usePathname();

  // Skip layout for ambulance dashboard and driver dashboard routes
  const isAmbulanceDashboard = pathname.startsWith("/ambulance/dashboard");
  const isAmbulanceDriver = pathname.startsWith("/ambulance/driver");

  if (isAmbulanceDashboard || isAmbulanceDriver) {
    return <>{children}</>;
  }

  return (
    <>
      <NavBar hspcategory={hspcategory} doctorcategory={doctorcategory} userData={userData} />
      <Mobilenav data={userData} />
      <div className="hidden lg:block">
        <MainSidebar />
      </div>
      <div className="pt-[95px] xlg:pl-12 lg:ml-12 xl:ml-12 xlg:ml-auto">
        {children}
      </div>
    </>
  );
};

export default ConditionalLayoutWrapper;
