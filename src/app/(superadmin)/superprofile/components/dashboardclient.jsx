import Image from "next/image";
import React from "react";
import Link from "next/link"; // Import Link from Next.js

const DashboardServicesPage = ({}) => {
  return (
    <>
      <div className="md:mt-2   md:pb-0  container space-y-2 h-auto  rounded-xl">
        <div className="justify-center text-center font-poppins">
          <h1 className="text-[20px] text-[#2b73ec] font-extrabold">
            Healthcare Services
          </h1>
          <p className="text-[#243460] text-[11px]">Dashboard</p>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-10 bg-white p-4 rounded-xl shadow-sm border  md:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-0 justify-center ">
          {dashboardicons.map((item, index) => (
            <Link href={item.link} key={index}>
              {" "}
              {/* Wrap each item with Link */}
              <div className="flex flex-col text-center items-center justify-center mb-4">
                <span className="xl:h-20 xl:w-20 h-20 w-20 bg-[#243460] p-2 rounded-2xl hover:border-2">
                  <Image
                    src={item.img}
                    width={200}
                    height={200}
                    alt={item.title}
                  />
                </span>
                <p className=" text-[10px] font-poppins font-bold">
                  <span className="text-[#2b73ec]">
                    {item.title.split(" ")[0]}
                  </span>{" "}
                  <br />
                  <span className="text-[#243460]">
                    {item.title.split(" ").slice(1).join(" ")}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div></div>
    </>
  );
};

export default DashboardServicesPage;

const dashboardicons = [
  {
    link: "/superprofile/patient",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167086/Register_Patient_s_osamux.png",
    title: "Register Patient’s",
  },
  {
    link: "/superprofile/hsp/Clinic",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167078/Register_Clinic_s_xodl2f.png",
    title: "Register Clinic’s",
  },
  {
    link: "/superprofile/hsp/Hospital",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167083/Register_Hospital_s_foxpkb.png",
    title: "Register Hospital’s",
  },
  {
    link: "/superprofile/doctor",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167082/Register_Doctor_s_jgurog.png",
    title: "Register Doctor’s",
  },
  {
    link: "/superprofile/hsp/Pathology",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167084/Register_Pathology_s_myvuvp.png",
    title: "Register Pathology’s",
  },
  {
    link: "/superprofile/pharmacy",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167086/Register_Pharmacy_m2r8vi.png",
    title: "Register Pharmacy",
  },
    {
    link: "/superprofile/dashboard/surgerytreatment-schedules",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1735119010/Surgery_Schedules_pcvzmr.png",
    title: "View Surgery/Treatment Schedules",
  },
  {
    link: "/superprofile/hsp/DiagnosticCenter",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167081/Register_Diagnostic_Center_fdgho6.png",
    title: "Register Diagnostic Center",
  },
  {
    link: "/superprofile/aarogya-mitra",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167082/Register_AarogyaMitra_f6qcao.png",
    title: "Register AarogyaMitra",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167085/Register_Nurses_vn5fvu.png",
    title: "Register Nurses",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167083/Register_Employer_s_o5db0x.png",
    title: "Register Employer’s",
  },
  {
    link: "/superprofile/ambulance",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167082/Register_Ambulance_p9knl8.png",
    title: "Register Ambulance",
  },
  {
    link: "/superprofile/corporate",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167078/Register_Corporate_s_lpnwub.png",
    title: "Register Corporate’s",
  },
  {
    link: "/superprofile/e-seva",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167085/Register_Third_Party_inm7mr.png",
    title: "Register Third Party/E-Seva",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167079/Register_Corporation_s_tzx7oj.png",
    title: "Register Corporation’s",
  },
  {
    link: "/superprofile/healthinsurance",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167084/Register_Insurance_Com_nqp41s.png",
    title: "Register Insurance Com",
  },
  {
    link: "/superprofile/hsp/homehealthcare",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167083/Register_Home_Healthcare_hp0aim.png",
    title: "Register Home Healthcare",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167083/Documents_HSP_Leads_se9hdy.png",
    title: "Documents HSP Leads",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167081/First_Aid_Training_Leads_lewsls.png",
    title: "First Aid Training Leads",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167081/Health_TPA_Work_Leads_wagh5m.png",
    title: "Health TPA Work Leads",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167087/Teleradiology_Leads_yvmkdq.png",
    title: "Teleradiology Leads",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167082/HSP_Work_Leads_d7hwuc.png",
    title: "HSP Work Leads",
  },
  {
    link: "/superprofile/aarogyadhan",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167078/AarogyaDhan_Panel_bsylhp.png",
    title: "AarogyaDhan Panel",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167080/Analytics_Report_wmyowg.png",
    title: "Analytics Report",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167079/AA_Portal_Social_Media_zg434f.png",
    title: "AA Portal Social Media",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167086/Services_Reminder_ojmjfx.png",
    title: "Services Reminder",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167080/Dashboard_Settings_cd1jvv.png",
    title: "Dashboard Settings",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167081/Employee_s_Dashboard_zhwq5f.png",
    title: "Employee’s Dashboard",
  },
      {
    link: "/superprofile/dashboard/paymenthistory",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725343058/aarogya%20aadhar/SiteImages/Dashboard/xumuxjuj8kqu9nqcuhkx.png",
    title: "Patient Payments",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167080/Admin_Panel_Dashboard_hgxsnr.png",
    title: "Admin Panel Dashboard",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167078/Admin_Complaint_zkop8g.png",
    title: "Admin Complaint",
  },
  {
    link: "",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167078/AA_Documents_a2vnjk.png",
    title: "AA Documents",
  },
  {
    link: "/superprofile/aarogya-mart",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167084/Register_Pathology_s_myvuvp.png",
    title: "Aarogya Mart",
  },
  {
    link: "/superprofile/jobaadhar",
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1732167083/Register_Employer_s_o5db0x.png",
    title: "Job Aadhar",
  },
  {
    link:"/superprofile/ads-section",
    img: "https://res.cloudinary.com/dorreici1/image/upload/v1760424458/46a89694-3064-49e1-8778-b68c62d24fcb.png",
    title: "Ads Manager",
  },
];
