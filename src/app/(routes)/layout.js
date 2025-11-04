import { Inter } from "next/font/google";
import NavBar from "../components/nav";
import Mobilenav from "../components/mobilenav";
import Footer from "../components/footer";
import { db } from "@/lib/db";
import MainSidebar from "../components/sidebar";
import { getSession } from "@/lib/getsession";
import ChatbotIcon from "../components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aarogya-Aadhar",
  description: "",
};

export default async function MainLayout({ children }) {
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  const hospital = await db.hospital.findMany({
    include: { hspInfo: true },
  });
  // Check if the user is logged in
  const loggedemail = await getSession();

  // If the user is not logged in, `userData` should be null
  let userData = null;

  if (loggedemail?.email) {
    const patientData = await db.Patient.findUnique({
      where: { email: loggedemail.email },
    });

    const doctorData = await db.Doctor.findUnique({
      where: { email: loggedemail.email },
    });

    const hospitalData = await db.Hospital.findUnique({
      where: { email: loggedemail.email },
    });

    const corporateData = await db.Corporate.findUnique({
      where: { email: loggedemail.email },
    });

    // Determine which data to send to Mobilenav
    userData =
      patientData || doctorData || hospitalData || corporateData || null;
  }
  const diagnosticcentercategory = await db.DiagnosticCenterCategory.findMany(
    {}
  );
  return (
    <>
      {/* Ensure NavBar is fixed */}
      <NavBar
        hspcategory={hspcategory}
        doctorcategory={doctortype}
        diagnosticCategory={diagnosticcentercategory}
        userData={userData}

      />
      <Mobilenav data={userData} />
      <div className="hidden lg:block">
        <MainSidebar doctorcategory={doctortype} hospital={hospital} />
      </div>
      {/* Add padding or margin to offset the height of NavBar */}
      <div className="pt-[105px] lg:ml-12 xl:ml-12 xlg:pl-2">{children}</div>
      <div className="pb-12 md:pb-0 lg:ml-5 xl:ml-5">
        <Footer />
      </div>
      <div className="fixed bottom-5 right-5 z-50">
        <ChatbotIcon />
      </div>
    </>
  );
}
