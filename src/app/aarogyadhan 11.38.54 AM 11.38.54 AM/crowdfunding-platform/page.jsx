"use client";


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DhanFooter from "../components/dhan-footer";
import Image from "next/image";

const crowdfundingPlatforms = [
  {
    name: "ImpactGuru",
    description:
      "No payback. No loans. No insurance. Start a fundraiser for your medical emergency, surgery or related treatment and share it with your friends and family to maximize your impact.",
    link: "https://www.impactguru.com/",
  },
  {
    name: "Ketto",
    description:
      "Stop worrying about rising medical bills, or debts and start a medical fundraising campaign with Ketto. Crowdfunding is the easiest way to avail support from friends, family and numerous individuals who are waiting to donate funds.",
    link: "https://www.ketto.org/",
  },
  {
    name: "Milaap",
    description:
      "Effortlessly set up and manage your fundraiser, engage with donors and use various social media options to promote the fundraiser with the all-in-one mobile app.",
    link: "https://milaap.org/",
  },
  {
    name: "GiveIndia",
    description:
      "Established in 2000, GiveIndia is a trusted giving platform in India. It enables individuals and organizations to raise and donate funds conveniently to any cause they care about, with offerings including crowdfunding, corporate giving, cause marketing, and philanthropy consulting.",
    link: "https://www.giveindia.org/",
  },
  {
    name: "BeDonor",
    description:
      "A platform that enables anyone to join and start raising the funds to extend their support to a medical condition, education, sport, disaster relief; BeDonor is a global platform projecting a scope of a better tomorrow.",
    link: "https://bedonor.org/",
  },
];

export default function CrowdfundingPlatformPage() {
 

  const platformsToShow =  crowdfundingPlatforms;

  return (
    <>
    <div className="w-full font-poppins mx-auto px-4 py-10 max-w-screen-2xl">
      {/* Header Section */}
      <div className="flex flex-row xl:flex-row items-center justify-between gap-10 xl:gap-16 px-2 sm:px-6 min-[800px]:px-10 min-[1100px]:px-20">
        {/* Left Text */}
        <div className="w-full min-[720px]:w-1/2">
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold mb-6 text-[#243460]">
            Crowdfunding
          </h1>
          <p className="text-sm sm:text-base xl:text-lg text-gray-700 font-medium leading-relaxed">
            Crowdfunding is when businesses, organizations or individuals raise funds
            with the help of small donations from a large number of people. Most of
            these campaigns happen via internet platforms, have set time frames for
            when money can be raised and disclose specific monetary goals. In
            healthcare, crowdfunding offers a chance of equal opportunities to
            everyone by giving a solution to financial challenges.
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full xs:hidden min-[720px]:flex min-[720px]:w-1/2  justify-center">
          <Image
            src="https://res.cloudinary.com/dorreici1/image/upload/v1752228808/download_gaokva.png"
            alt="Crowdfunding"
            width={300}
            height={300}
            className="object-contain rounded-xl shadow-lg"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-left mt-16 mb-8 px-2 sm:px-6 min-[800px]:px-10 min-[1100px]:px-20 text-[#243460]">
        Platforms to Explore
      </h2>

      {/* Cards Grid */}
      {platformsToShow.length > 0 ? (
        <div className="grid gap-6 sm:gap-8 px-2 sm:px-6 min-[800px]:px-10 min-[1100px]:px-20 grid-cols-1">
          {platformsToShow.map((platform) => (
            <Card
              key={platform.name}
              className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl xl:text-2xl font-semibold text-[#243460]">
                  {platform.name}
                </h3>
                <p className="text-sm xl:text-base text-gray-700 leading-relaxed">
                  {platform.description}
                </p>
                <Button
                  className="bg-[#5271FF] hover:bg-[#243460] text-white font-semibold rounded-xl px-6 py-2 transition"
                  onClick={() => window.open(platform.link, "_blank")}
                >
                  Know More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-600 font-semibold mt-8">
          Platform not found. Please select a valid option.
        </p>
      )}
    </div>

    <DhanFooter/>
    </>
  );
}
