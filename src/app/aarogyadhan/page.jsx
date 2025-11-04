import React from "react";

import Crowdfund2 from "../(routes)/crowdfunding/components/crowdfund2";
import Crowdfund3 from "../(routes)/crowdfunding/components/crowdfund3";
import { db } from "@/lib/db";
import Fundraiserclient from "./components/fundraiserslist";
import DhanFooter from "./components/dhan-footer";
import TrustIndicators from "./components/trust-indicator";
import HowItWorks from "./components/how-it-works";
import FAQSection from "./components/dhan-faq";
import Link from "next/link";
import CrowdFund1 from './../components/crowdfund1 copy';

const AarogyaDhanMainPage = async () => {
  const data = await db.fundraisingCampaign.findMany({});

  return (
    <div>
      <div className="pb-4">
        <CrowdFund1 />
        <Crowdfund2 />

        <Crowdfund3 />
      </div>
      

      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Medical Crowdfunding Made Simple</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Raise funds for medical emergencies with {"India's"} most trusted healthcare crowdfunding platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/aarogyadhan/login">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto">
                Start Fundraiser
              </button>
            </Link>

            <Link href="/aarogyadhan/fundraisers">
              <button className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors w-full sm:w-auto">
                Browse Campaigns
              </button>
            </Link>
          </div>

        </div>
  
        </section>
      <TrustIndicators />
      <HowItWorks />
      <FAQSection />
     


      <DhanFooter/>
    </div>

    </div>
   
  );
};

export default AarogyaDhanMainPage;
