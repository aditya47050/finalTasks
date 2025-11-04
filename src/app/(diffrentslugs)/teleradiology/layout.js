import NextTopLoader from "nextjs-toploader";

import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import TeleradiologySidebar from "./components/teleradiologybottombar";
import TeleRadiologyPageNav from "./components/nav";
import Footer from "@/app/components/footer";
import MainSidebar from "@/app/components/sidebar";
import Mobilenav from "@/app/components/mobilenav";
export const metadata = {
  title: "Tele Radiology",
  description: "",
};

export default async function HospitalDashboardAllLayout({ children }) {
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  const hospital = await db.hospital.findMany({
    include: { hspInfo: true },
  });
const session = await getSession();

  let userData = null;
  if (session?.email) {
    const [patientData, doctorData, hospitalData, corporateData] = await Promise.all([
       db.Patient.findUnique({
        where: { email: session.email },
        select: { passportPhoto: true }, 
      }),
       db.Doctor.findUnique({
        where: { email: session.email },
        select: {
          doctorinfo: {
            select: { passportphoto: true },
          },
        },
      }),
       db.Hospital.findUnique({
        where: { email: session.email },
        select: {
          hspdetails: {
            select: { hsplogo: true },
          },
        },
      }),
      db.Corporate.findUnique({
        where: { email: session.email },
        select: { passportPhoto: true }, 
      }),
    ]);

    const passportPhoto =
      patientData?.passportPhoto ||
      doctorData?.doctorinfo?.passportphoto ||
      hospitalData?.hspdetails?.hsplogo ||
      corporateData?.passportPhoto ||
      null;

       userData = {
      passportPhoto
    };
  }
  return (
    <>
      <NextTopLoader />
     <Mobilenav data={userData}/>
      <div className="hidden lg:block">
        <MainSidebar doctorcategory={doctortype} hospital={hospital}/> 
        <div className=" ml-12 ">
         <TeleRadiologyPageNav />
         </div>
      </div>
      <div className="md:pt-[95px] pt-[85px] lg:ml-12 xl:ml-12 pb-20 flex flex-col">
        <div className="lg:container lg:mx-auto">{children}</div>{" "}
        <div className="fixed  h-full">
          <TeleradiologySidebar />
        </div>
    
      </div>

    </>
  );
}
