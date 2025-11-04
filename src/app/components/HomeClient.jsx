"use client";

import { useEffect, useState } from "react";
import Mobilenav from "./mobilenav";
import Treatment from "../(routes)/treatment/components/treatment";
import { Diseasesclient } from "../(routes)/diseases/components/diseasesclient"; 
import CrowdFund1 from "./crowdfund1";
import AdditionalFeaturesClient from "../(routes)/core-features/additionalfetures";
import Testimonials from "../(diffrentslugs)/teleradiology/components/testimonials";
import Footer from "./footer";
import PartnersClient from "../(routes)/partners/components/partners";

const HomeClient = ({ userData }) => {
  const [isIos, setIsIos] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isiOSDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isTablet =
      /iPad/.test(ua) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

    if (isiOSDevice || isTablet) {
      setIsIos(true);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, []);
  let paddingClass = "";
  if (isScrolled) {
    paddingClass = isIos ? "pt-[220px]" : "pt-[220px]";
  } else {
    paddingClass = isIos ? "pt-[220px] md:pt-[220px] min-[900px]:pt-[220px]" : "pt-[340px] xs:pt-[370px] md:pt-[500px] min-[900px]:pt-[550px]";
  }
  return (
    <>
      <Mobilenav data={userData} />
      <div className={`${paddingClass} transition-all duration-300 ease-in-out`}>
        <Treatment />
        <Diseasesclient />
        <CrowdFund1 data={userData}/>
        <AdditionalFeaturesClient data={userData}/>
        <Testimonials />
        <PartnersClient />
        <div className="pb-12 md:pb-9 lg:ml-12 xl:ml-0">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomeClient;
