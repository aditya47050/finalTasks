// src/app/aarogyadhan/components/dhan-register.jsx

"use client";

import { Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PatientRegistrationForm from "./PatientRegistrationForm";
import DonorRegistrationForm from "./DonorRegistrationForm";

const AarogyaDhanRegister = ({ userData = [] }) => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/bharat_aarogya_aadhar?fbclid=IwAR01L-bScstf5s0OHppAV4ztfW9hTVdYy9rMAykGAvHGxAjeSzVRaqa1jQ",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/profile.php?id=61554162329099",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "#",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/company/aarogya-aadhar/?viewAsMember=true",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtu.be/T5BCaTuZUpY",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <div className="w-full max-w-7xl">
        <Card className="border-none">
          <div className="justify-center font-poppins text-center mb-2">
            <h1 className="md:text-[25px] text-xl text-[#5271FF] font-extrabold">
              <span className="shadow-inherit">AarogyaDhan</span>
            </h1>
          </div>

          <CardContent className="px-6 md:px-8 ">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="lg:col-span-2 mb-8">
                <Tabs defaultValue="patient" className="w-full">
                  <TabsList className="grid w-full md:px-64 min-[1100px]:px-[25rem] grid-cols-2 mb-8 p-1 rounded-full xs:gap-4 lg:gap-4">
                    <TabsTrigger
                      value="patient"
                      className="rounded-full max-[399px]:text-[0.6rem] p-2 font-medium data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-900 data-[state=active]:bg-[#5271FF] data-[state=active]:text-white transition-all duration-200"
                    >
                      Patient Registration
                    </TabsTrigger>
                    <TabsTrigger
                      value="donor"
                      className="rounded-full max-[399px]:text-[0.6rem] p-2 font-medium data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-900 data-[state=active]:bg-[#5271FF] data-[state=active]:text-white transition-all duration-200"
                    >
                      Donor Registration
                    </TabsTrigger>
                  </TabsList>

                  <div className="lg:grid lg:grid-cols-2 lg:gap-8 xs:gap-4">
                    <div className="lg:col-span-1">
                      <TabsContent value="patient" className="mt-0">
                        <PatientRegistrationForm userData={userData} />
                      </TabsContent>

                      <TabsContent value="donor" className="mt-0">
                        <DonorRegistrationForm userData={userData} />
                      </TabsContent>
                    </div>

                    <div className="lg:col-span-1 lg:flex lg:items-center lg:justify-center">
                      <div className="hidden lg:block text-center p-8">
                        <div className="bg-gradient-to-br from-[#5271FF] to-[#ff5e00] p-8 rounded-2xl text-white">
                          <h3 className="text-2xl font-bold mb-4">
                            Welcome to AarogyaDhan
                          </h3>
                          <p className="text-lg mb-4">
                            Your health, our priority
                          </p>
                          <div className="space-y-3 text-left">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span>Secure registration process</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span>Easy access to healthcare</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span>Connect with donors</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span>24/7 support available</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AarogyaDhanRegister;