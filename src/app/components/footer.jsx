import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  // Define link data as arrays of objects
  const knowUsLinks = [
    { text: "About Us", href: "/about" },
    { text: "Contact Us", href: "/contact-us" },
    { text: "Press Coverage", href: "/press-coverage" },
    { text: "Careers", href: "/careers" },
    { text: "Business Partnership", href: "/business-partnership" },
    { text: "Become a Health Partner", href: "/become-health-partner" },
    { text: "Corporate Governance", href: "/corporate-governance" },
    
  ];

  const ourPoliciesLinks = [
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Terms and Conditions", href: "/terms-and-conditions" },
    { text: "Editorial Policy", href: "/privacy/editorial-policy" },
    { text: "User Manual", href: "/user-manual" },
    // { text: "IP Policy", href: "/ip-policy" },
    { text: "Important Document", href: "/doc-importance" },
    { text: "Required Documents",href: "/doc-required"},
    { text: "Patient Form",href: "/patient-reg-form"},
  ];

  const ourServicesLinks = [
    { text: "Features for Doctor", href: "/features-for-doctor" },
    { text: "Features for Hospital", href: "/features-for-hospital" },
    { text: "Features for Lab", href: "/features-for-lab" },

    { text: "Features for HSP", href: "/featuresforhsp" },
    { text: "Features for Patient", href: "/features-for-patients" },

    { text: "Features for Chemist", href: "/features-for-chemist" },
    { text: "Features for Health Worker", href: "/features-for-healthworkers" },
    {
      text: "Features Pharma Manufacturers",
      href: "/features-for-pharma-manufacturers",
    },
  ];

  const socialLinks = [
    {
      href: "https://www.instagram.com/bharat_aarogya_aadhar",
      icon: <Instagram className=" xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "https://www.facebook.com/profile.php?id=61554162329099",
      icon: <Facebook className=" xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "#",
      icon: <Twitter className=" xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "https://www.linkedin.com/company/aarogya-aadhar",
      icon: <Linkedin className=" xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "https://www.youtube.com/@AarogyaAadhar-po2gi",
      icon: <Youtube className=" xl:h-6 xl:w-6 h-5 w-5" />,
    },
  ];
  const socialLinkslg = [
    {
      href: "https://www.instagram.com/bharat_aarogya_aadhar",
      icon: <Instagram className="text-white xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "https://www.facebook.com/profile.php?id=61554162329099",
      icon: <Facebook className="text-white xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "#",
      icon: <Twitter className="text-white xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "https://www.linkedin.com/company/aarogya-aadhar",
      icon: <Linkedin className="text-white xl:h-6 xl:w-6 h-5 w-5" />,
    },
    {
      href: "https://www.youtube.com/@AarogyaAadhar-po2gi",
      icon: <Youtube className="text-white xl:h-6 xl:w-6 h-5 w-5" />,
    },
  ];
  const features = [
    {
      image:
        "https://res.cloudinary.com/dnckhli5u/image/upload/v1725257022/aarogya%20aadhar/SiteImages/mplysxvipakb4yznmgc5.png",
      title: "Reliable",
      description:
        "All information displayed on Aarogya Aadhar is procured from verified sources and approved by the government. All HSP listed on the platform are accredited.",
    },
    {
      image:
        "https://res.cloudinary.com/dnckhli5u/image/upload/v1729238008/lock_icon_new_v3gccd.png",
      title: "Secure",
      description:
        "All information displayed on Aarogya Aadhar is procured from verified sources and approved by the government. All HSP listed on the platform are accredited.",
    },
    {
      image:
        "https://res.cloudinary.com/dnckhli5u/image/upload/v1725257022/aarogya%20aadhar/SiteImages/wlvx9w3k5losp57aswjv.png",
      title: "Affordable",
      description:
        "All information displayed on Aarogya Aadhar is procured from verified sources and approved by the government. All HSP listed on the platform are accredited.",
    },
  ];

  return (
    <>
      <div className="hidden lg:block w-full  max-w-full font-poppins ">
        <div className="flex justify-center bg-[#243561] text-white  text-center p-1 text-[10px]  z-10 md:text-[16px]">
          <marquee>
            <span>
              {" "}
              Aarogya Aadhar Approved & Funded by Government of India | Aarogya
              Aadhar Certified by ISO:27001 Online Healthcare Platform | Your
              Health, Your Choice | Connect with us +91 79-7272-7498 | Mail ID:
              info@aarogyaaadhar.com
            </span>
          </marquee>
        </div>
        <div className="md:mx-auto md:container ">
          <div className="md:mx-auto max-[1200px]:pl-[2rem] max-[1200px]:pr-0 min-[1200px]:px-16 px-4 xlg:px-0 md:px-0 xlg:pl-12  md:container grid grid-cols-2 lg:grid-cols-4 gap-2 xl:gap-24">
            {/* First Column */}
            <div>
              <h2 className="text-[#243460] font-bold text-[18px] lg:text-[25px]">
                Know Us
              </h2>
              <ul className="space-y-2 list-none">
                {knowUsLinks.map((item, index) => (
                  <Link key={index} href={item.href}>
                    <li className="text-[#2B73EC] hover:text-blue-900 lg:text-[14px] text-[12px]">
                      {item.text}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Second Column */}
            <div>
              <h2 className="text-[#243460] font-bold text-[18px] lg:text-[25px]">
                Our Policies
              </h2>
              <ul className="space-y-2 list-none">
                {ourPoliciesLinks.map((item, index) => (
                  <Link key={index} href={item.href}>
                    <li className="text-[#2B73EC] hover:text-blue-900 lg:text-[14px] text-[12px]">
                      {item.text}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Third Column */}
            <div>
              <h2 className="text-[#243460] font-bold text-[18px] lg:text-[25px]">
                Our Services
              </h2>
              <ul className="space-y-2 list-none">
                {ourServicesLinks.map((item, index) => (
                  <Link key={index} href={item.href}>
                    <li className="text-[#2B73EC] hover:text-blue-900 lg:text-[14px] text-[12px]">
                      {item.text}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Fourth Column */}
            <div>
              <h2 className="text-[#243460] font-bold text-[18px] lg:text-[25px]">
                Connect
              </h2>
              <ul>
                <li className="text-[#2B73EC] hover:text-blue-900 lg:text-[14px] text-[12px]">
                  Follow Aarogya Aadhar
                </li>
                <li className="flex flex-wrap space-x-1 pt-4">
                  {socialLinkslg.map((social, index) => (
                    <Link key={index} href={social.href}>
                      <span className="bg-[#2B73EC]  p-1 md:p-2 inline-block rounded-full">
                        {social.icon}
                      </span>
                    </Link>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="md:container min-[900px]:pl-[2rem] min-[900px]:pr-5 min-[1200px]:px-16 xl:pl-24 px-4 xlg:pl-12  md:px-0 xlg:px-0 flex flex-wrap justify-around py-2 md:space-y-0 md:flex-nowrap lg:space-x-2 text-blue-700">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center  space-x-2 w-full md:w-1/3"
            >
              <div className="w-1/4 md:mb-4 mb-1 ">
                <Image
                  src={item.image}
                  width={1200}
                  height={400}
                  alt={item.title}
                  className="h-auto w-auto mt-8 md:mt-16 max-w-full rounded-full"
                />
              </div>
              <div className="w-3/4 px-4">
                <h2 className="text-[#243460] font-bold text-[20px] lg:text-[25px]">
                  {item.title}
                </h2>
                <p className="text-[12px] text-justify lg:text-[14px]  text-[#2B73EC] font-poppins">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:bg-[#243561] bg-transparent pb-0  md:pb-8 lg:pb-0 w-full text-[#ff5e00] lg:text-white text-center">
          <p className="lg:px-24 xl:px-12 lg:pr-36 xl:pr-36 py-1 hidden lg:block tracking-wider text-[12px] lg:text-[14px]">
            &copy; 2023 Livo AarogyaAadhar Pvt.Ltd. All rights reserved. All
            information are dispensed in compliance with the Information and
            Design Concept Act, 1940.
          </p>
          <p className="lg:px-24 xl:px-12 md:pb-0 pb-2 font-semibold py-1 lg:hidden md:block tracking-wider text-[10px] lg:text-[14px]">
            {" "}
            &copy;COPYRIGHT 2023 AAROGYA AADHAR, ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
      <div className="block lg:hidden w-full bg-slate-50 border-t max-w-full font-poppins ">
        <div className="bg-blue-600 text-white py-1 text-base">
          <marquee>
            <span>
              {" "}
              Aarogya Aadhar Approved & Funded by Government of India | Aarogya
              Aadhar Certified by ISO:27001 Online Healthcare Platform | Your
              Health, Your Choice | Connect with us +91 79-7272-7498 | Mail ID:
              info@aarogyaaadhar.com
            </span>
          </marquee>
        </div>
        <div className=" md:container mx-auto px-4 py-4 md:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xs:gap-2 md:gap-8">
            {/* First Column */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">
                Know Us
              </h4>
              <ul className="space-y-2 list-none">
                {knowUsLinks.map((item, index) => (
                  <Link key={index} href={item.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px] transition-colors">
                    <li >
                      {item.text}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Second Column */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">
                Our Policies
              </h4>
              <ul className="space-y-2 list-none">
                {ourPoliciesLinks.map((item, index) => (
                  <Link key={index} href={item.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px] transition-colors">
                    <li >
                      {item.text}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Third Column */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">
                Our Services
              </h4>
              <ul className="space-y-2 list-none">
                {ourServicesLinks.map((item, index) => (
                  <Link key={index} href={item.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px] transition-colors">
                    <li>
                      {item.text}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Fourth Column */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">
                Connect
              </h4>
              <ul>
                <li className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px] transition-colors">
                  Follow Aarogya Aadhar
                </li>
                <li className="flex flex-wrap space-x-3 pt-4">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="md:container min-[900px]:pl-[2rem] min-[900px]:pr-5 min-[1200px]:px-16 xl:pl-24 px-4 xlg:pl-12  md:px-0 xlg:px-0 flex flex-wrap justify-around py-2 md:space-y-0 md:flex-nowrap lg:space-x-2 text-blue-700">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center  space-x-2 w-full md:w-1/3"
            >
              <div className="w-1/4 md:mb-4 mb-1 ">
                <Image
                  src={item.image}
                  width={1200}
                  height={400}
                  alt={item.title}
                  className="h-auto w-auto mt-8 md:mt-16 max-w-full rounded-full"
                />
              </div>
              <div className="w-3/4 px-4">
                <h2 className="text-[#243460] font-bold text-[20px] lg:text-[25px]">
                  {item.title}
                </h2>
                <p className="text-[12px] text-justify lg:text-[14px]  text-[#2B73EC] font-poppins">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div> */}

        <div className="border-t pb-4 pt-2  text-center">
          <p className="lg:px-24 xl:px-12 lg:pr-36 xl:pr-36 py-1 hidden lg:block tracking-wider text-[12px] lg:text-[14px]">
            &copy; 2023 Livo AarogyaAadhar Pvt.Ltd. All rights reserved. All
            information are dispensed in compliance with the Information and
            Design Concept Act, 1940.
          </p>
          <p className="text-xs text-gray-500">
            {" "}
            &copy;COPYRIGHT 2023 AAROGYA AADHAR, ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </>

  );
};

export default Footer;
