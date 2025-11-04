import { Inter } from "next/font/google";
import Footer from "../../../components/footer";
import { db } from "@/lib/db";
import NavBar from "@/app/components/nav";
import Mobilenav from "@/app/components/mobilenav";
import MainSidebar from "@/app/components/sidebar";
import { getSession } from "@/lib/getsession";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aarogya-Aadhar",
  description: "",
};

export default async function MainLayout({ children }) {
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
const diagnosticcentercategory = await db.DiagnosticCenterCategory.findMany({});
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
      passportPhoto,
    };
  }
  return (
    <>
      {/* Ensure NavBar is fixed */}
      <MainSidebar/>
      <NavBar hspcategory={hspcategory} doctorcategory={doctortype} diagnosticCategory={diagnosticcentercategory} userData={userData} />
      <Mobilenav data={userData} />

      {/* Add padding or margin to offset the height of NavBar */}
      <div className="pt-[95px] lg:pt-[110px] lg:ml-12">{children}</div>
      <div className="pb-16 md:pb-9 lg:pb-0">
        {" "}
        <Footer />
      </div>
    </>
  );
}
