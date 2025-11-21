import Image from "next/image";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NavBar from "./components/nav";
import Mobilenav from "./components/mobilenav";
import Banner from "./components/banner";
import { Diseasesclient } from "./(routes)/diseases/components/diseasesclient";
import CrowdFund1 from "./components/crowdfund1";
import AppDownload from "./(routes)/downloadapp/components/download";
import Testimonials from "./(diffrentslugs)/teleradiology/components/testimonials";
import PartnersClient from "./(routes)/partners/components/partners";
import AdditionalFeaturesClient from "./(routes)/core-features/additionalfetures";
import MainSidebar from "./components/sidebar";
import Footer from "./components/footer";
import { getSession } from "@/lib/getsession";
import RegistrationAlertWrapper from "./components/alertwrapper";
import HomeClient from "./components/HomeClient";
import Treatment from "./(routes)/treatment/components/treatment";

export default async function Home() {
  const loggedemail = await getSession();
  const ua = headers().get("user-agent") || "";
  const isMobile = /Android|iPad|iPod/i.test(ua);

  if (isMobile && !loggedemail) redirect("/mobile");

  // =============================
  // FETCH ALL CATEGORIES + PHARMACY TYPES
  // =============================
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  const diagnosticCategory = await db.DiagnosticCenterCategory.findMany({});
  const hospital = await db.hospital.findMany({ include: { hspInfo: true } });

  // ⭐ Pharmacy types for nav
  const pharmacies = await db.Pharmacy.findMany({
    select: { id: true, pharmacytype: true },
  });

  // =============================
  // IF USER NOT LOGGED IN
  // =============================
  if (!loggedemail) {
    return (
      <main>
        <RegistrationAlertWrapper />
        <NavBar
          hspcategory={hspcategory}
          doctorcategory={doctortype}
          diagnosticCategory={diagnosticCategory}
          pharmacies={pharmacies}  // ⭐ IMPORTANT ⭐
        />

        <Mobilenav data={null} />

        <div className="hidden lg:block">
          <MainSidebar doctorcategory={doctortype} hospital={hospital} />
        </div>

        <div className="hidden lg:block md:container lg:mx-0 lg:w-full xl:mx-auto lg:pr-[20px] xl:pr-[40px]">
          <Banner />
          <Treatment />
          <Diseasesclient />
          <CrowdFund1 data={null} />
          <AppDownload />
          <Testimonials />
          <PartnersClient />
        </div>

        <div className="hidden lg:block lg:ml-10 xl:ml-0">
          <Footer />
        </div>

        <div className="lg:hidden block pb-0">
          <HomeClient userData={null} />
        </div>
      </main>
    );
  }

  // =============================
  // USER LOGGED IN — FETCH DETAILS
  // =============================
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

  const receptionistData = await db.Receptionist.findUnique({
    where: { email: loggedemail.email },
    include: { hospital: true },
  });

  const pharmacyData = await db.Pharmacy.findUnique({
    where: { email: loggedemail.email },
  });

  // PRIORITY ORDER
  const userData =
    pharmacyData ||
    hospitalData ||
    patientData ||
    doctorData ||
    corporateData ||
    receptionistData;

  // =============================
  // PAGE RETURN (LOGGED IN)
  // =============================
  return (
    <main>
      <NavBar
        hspcategory={hspcategory}
        doctorcategory={doctortype}
        diagnosticCategory={diagnosticCategory}
        pharmacies={pharmacies}   // ⭐ IMPORTANT ⭐
        userData={userData}
      />

      <Mobilenav data={userData} />

      <div className="hidden lg:block">
        <MainSidebar doctorcategory={doctortype} />
      </div>

      <div className="hidden lg:block md:container lg:mx-0 lg:w-full xl:mx-auto lg:pr-[20px] xl:pr-[40px]">
        <Banner />
        <Treatment />
        <Diseasesclient />
        <CrowdFund1 data={userData} />
        <AppDownload />
        <Testimonials />
        <PartnersClient />
      </div>

      <div className="hidden lg:block lg:ml-12 xl:ml-0">
        <Footer />
      </div>

      <div className="lg:hidden block pb-0">
        <HomeClient userData={userData} />
      </div>
    </main>
  );
}
