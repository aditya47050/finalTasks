import Image from "next/image";

import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation"; // Use redirect for navigation if user is not logged in
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

  // Simple mobile detection (you can refine as needed)
  const isMobile = /Android|iPad|iPod/i.test(ua);

  if (isMobile && !loggedemail) {
    // Redirect mobile users to /mobile
    redirect("/mobile");
  }
  // Fetch categories for hospitals and doctors
  const hspcategory = await db.HospitalsCategory.findMany({});
  const doctortype = await db.ExpertDoctorsCategory.findMany({});
  const hospital = await db.hospital.findMany({
    include: { hspInfo: true },
  });
  const diagnosticCategory = await db.DiagnosticCenterCategory.findMany({});
  // Fetch logged-in user's session (using getSession())
  
  
  // If no session exists, handle it by rendering a default view or redirecting
  if (!loggedemail) {
    return (
      <main>
         <RegistrationAlertWrapper /> 
        <NavBar
          hspcategory={hspcategory}
          doctorcategory={doctortype}
          diagnosticCategory={diagnosticCategory}
        />
        
        <Mobilenav data={null} /> {/* No logged-in user, so send null data */}
        <div className="hidden lg:block">
          <MainSidebar doctorcategory={doctortype} hospital={hospital} />
        </div>
        <div className="hidden lg:block md:container lg:mx-0 lg:w-full  xl:mx-auto lg:pr-[20px] xl:pr-[40px]">
          <Banner />
          <Treatment />
          <Diseasesclient />
          <CrowdFund1 data={null}/>
          <AppDownload />
          <Testimonials />
          <PartnersClient />
        </div>
        <div className="hidden lg:block  lg:ml-10 xl:ml-0">
          <Footer />
        </div>
        <div className="lg:hidden block pb-0">
          <HomeClient userData={null} />
        </div>
      </main>
    );
  }

  // If logged in, fetch the user-specific data from the relevant tables
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
    include: {
      hospital: true,
    },
  });

  const pharmacyData = await db.Pharmacy.findUnique({
    where: { email: loggedemail.email },
  });

  // Determine which data to send to Mobilenav
  const userData =  pharmacyData || hospitalData || patientData || doctorData || corporateData || receptionistData;



  return (
    <main>
      <NavBar
        hspcategory={hspcategory}
        doctorcategory={doctortype}
        diagnosticCategory={diagnosticCategory}
        userData={userData}
      />
      <Mobilenav data={userData} /> {/* Send the logged-in user data */}
      <div className="hidden lg:block">
        <MainSidebar doctorcategory={doctortype} />
      </div>
      <div className="hidden lg:block md:container lg:mx-0 lg:w-full  xl:mx-auto lg:pr-[20px] xl:pr-[40px]">
        <Banner />
        <Treatment />
        <Diseasesclient />
        <CrowdFund1 data={userData}/>
        <AppDownload />
        <Testimonials />
        <PartnersClient />
      </div>
      <div className="hidden lg:block  lg:ml-12 xl:ml-0">
        <Footer />
      </div>
      <div className="lg:hidden block pb-0">
        <HomeClient userData={userData} />
      </div>
    </main>
  );
}




// import Image from "next/image";

// import { db } from "@/lib/db";

// import { redirect } from "next/navigation"; // Use redirect for navigation if user is not logged in
// import { getSession } from "@/lib/getsession";
// import NavBar from "./components/nav";
// import Mobilenav from "./components/mobilenav";
// import Banner from "./components/banner";
// import Treatment from "./(routes)/treatment/components/treatment";
// import { Diseasesclient } from "./(routes)/diseases/components/diseasesclient";
// import CrowdFund1 from "./components/crowdfund1";
// import AppDownload from "./(routes)/downloadapp/components/download";
// import Testimonials from "./(diffrentslugs)/teleradiology/components/testimonials";
// import PartnersClient from "./(routes)/partners/components/partners";
// import AdditionalFeaturesClient from "./(routes)/core-features/additionalfetures";
// import MainSidebar from "./components/sidebar";
// import Footer from "./components/footer";

// export default async function Home() {
//   // Fetch categories for hospitals and doctors
//   const hspcategory = await db.HospitalsCategory.findMany({});
//   const doctortype = await db.ExpertDoctorsCategory.findMany({});
//   const hospital = await db.hospital.findMany({
//     include: { hspInfo: true },
//   });
//   const diagnosticCategory = await db.DiagnosticCenterCategory.findMany({});
//   // Fetch logged-in user's session (using getSession())
//   const loggedemail = await getSession();

//   // If no session exists, handle it by rendering a default view or redirecting
//   if (!loggedemail) {
//     return (
//       <main>
//         <NavBar
//           hspcategory={hspcategory}
//           doctorcategory={doctortype}
//           diagnosticCategory={diagnosticCategory}
//         />
//         <Mobilenav data={null} /> {/* No logged-in user, so send null data */}
//         <div className="hidden lg:block">
//           <MainSidebar doctorcategory={doctortype} hospital={hospital} />
//         </div>
//         <div className="hidden lg:block lg:mx-0 lg:w-full  xlg:pl-0">
//           <Banner />
//           <Treatment />
//           <Diseasesclient />
//           <CrowdFund1 />
//           <AppDownload />
//           <Testimonials />
//           <PartnersClient />
//         </div>
//         <div className="hidden lg:block  lg:ml-12 xl:ml-0">
//           <Footer />
//         </div>
//         <div className="lg:hidden block pb-0">
//           <Mobilenav data={null} /> {/* Send null data for mobile */}
//           <div className="pt-[340px] sm:pt-[370px] md:pt-[500px]">
//             <Treatment />
//             <Diseasesclient />
//             <CrowdFund1 />
//             <AdditionalFeaturesClient />
//             <Testimonials />
//             <PartnersClient />
//             <div className="pb-12 md:pb-9 lg:ml-12 xl:ml-0">
//               <Footer />
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // If logged in, fetch the user-specific data from the relevant tables
//   const patientData = await db.Patient.findUnique({
//     where: { email: loggedemail.email },
//   });

//   const doctorData = await db.Doctor.findUnique({
//     where: { email: loggedemail.email },
//   });

//   const hospitalData = await db.Hospital.findUnique({
//     where: { email: loggedemail.email },
//   });

//   const corporateData = await db.Corporate.findUnique({
//     where: { email: loggedemail.email },
//   });

//   // Determine which data to send to Mobilenav
//   const userData = patientData || doctorData || hospitalData || corporateData;

//   return (
//     <main>
//       <NavBar
//         hspcategory={hspcategory}
//         doctorcategory={doctortype}
//         diagnosticCategory={diagnosticCategory}
//       />
//       <Mobilenav data={userData} /> {/* Send the logged-in user data */}
//       <div className="hidden lg:block">
//         <MainSidebar doctorcategory={doctortype} />
//       </div>
//       <div className="hidden lg:block lg:ml-12 xl:ml-0">
//         <Banner />
//         <Treatment />
//         <Diseasesclient />
//         <CrowdFund1 />
//         <AppDownload />
//         <Testimonials />
//         <PartnersClient />
//         <Footer />
//       </div>
//       <div className="lg:hidden block pb-0">
//         <Mobilenav data={userData} /> {/* Send the user data here for mobile */}
//         <div className="pt-[340px]">
//           <Treatment />
//           <Diseasesclient />
//           <CrowdFund1 />
//           <AdditionalFeaturesClient />
//           <Testimonials />
//           <PartnersClient />
//           <div className="pb-12 md:pb-9 lg:ml-12 xl:ml-0">
//             <Footer />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
