"use client";
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const ClientsTeleradiology = () => {
  const desktopScrollRef = useRef(null);
  const mobileScrollRef = useRef(null);

  useEffect(() => {
    const autoScroll = (scrollContainer) => {
  if (!scrollContainer) return;

  const scrollAmount = 1; // pixels per tick
  let scrollInterval = setInterval(() => {
    if (scrollContainer) {
      scrollContainer.scrollLeft += scrollAmount;

      // If we scrolled past half (original content),
      // jump back by half instead of to 0 → seamless
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft -= scrollContainer.scrollWidth / 2;
      }
    }
  }, 10);

  return () => clearInterval(scrollInterval);
};



    const desktopCleanup = autoScroll(desktopScrollRef.current);
    const mobileCleanup = autoScroll(mobileScrollRef.current);

    return () => {
      desktopCleanup && desktopCleanup();
      mobileCleanup && mobileCleanup();
    };
  }, []);

  return (
    <>
      {/* Desktop View */}
      <div className="md:mx-auto pr-[25px] w-full font-poppins lg:block hidden">
        <div className="mt-0">
          <div className="text-center">
            <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
              Our Clients
            </h1>
          </div>
          <div className="mx-5 w-full mt-4">
            <div ref={desktopScrollRef}  className="flex overflow-x-auto  space-x-4 pb-4 scrollbar-hide">
              {[...partners, ...partners].map((item, index) => (
                <div key={index} className="flex-shrink-0 w-40 lg:w-48">
                  <div className="p-2 relative  lg:h-40 flex rounded-[15px] items-center justify-center">
                    <Card className="relative h-full !border-none  overflow-hidden flex items-center justify-center">
                      <CardContent className="flex items-center justify-center p-0 h-full">
                        <Image
                          src={item.src}
                          width={300}
                          height={300}
                          alt={item.alt}
                          className="object-contain  w-full md:h-full rounded-[10px]  md:rounded-xl"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:mx-auto w-full font-poppins lg:hidden block md:container">
        <div className="mt-6">
          <div className="text-center">
            <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
              Our Clients
            </h1>
          </div>
          <div className="px-4 w-full max-w-[380px] md:max-w-xl lg:max-w-4xl md:mx-auto  mt-4">
            <div ref={mobileScrollRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {[...partners, ...partners].map((item, index) => (
                <div key={index} className="flex-shrink-0 w-40 lg:w-48">
                  <div className="p-2 relative  lg:h-40 flex rounded-[15px] items-center justify-center">
                    <Card className="relative h-full border-none mb-4 rounded-3xl overflow-hidden">
                      <CardContent className="flex items-center justify-center mt-1 lg:p-4 p-0 h-full">
                        <Image
                          src={item.src}
                          width={200}
                          height={200}
                          alt={item.alt}
                          className="object-cover h-28 w-full md:h-full rounded-xl"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientsTeleradiology;

const partners = [
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234655/1_lyvvlu.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234674/4_vdzocj.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234679/5_wq3vdd.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234689/7_cmzogd.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234695/8_fz7q8h.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234706/10_ezqmgx.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234713/11_kiz5fz.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234782/15_oft9oc.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234774/14_zontfq.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234771/13_mq4fqb.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234717/12_acedzz.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234700/9_f7xadf.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234684/6_objyxy.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234662/3_lfqoqh.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729234657/2_stx4jw.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729237072/17_s50fpi.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729237077/18_nenhks.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729237081/19_o2be0j.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729237090/20_zlomfe.png" },
  { src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729237094/21_jabrlb.png" },
];
