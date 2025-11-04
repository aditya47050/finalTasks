import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CircleChevronRight } from "lucide-react";
const Aboutclient = () => {
  return (
    <>
      <div className="md:mx-auto md:px-0 px-2 md:container xs:mt-5  md:pb-5">
        <div className="w-full flex flex-wrap md:space-y-0  md:flex-nowrap items-center justify-center">
          <div className="lg:w-[62%] w-full">
            <Image
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1731740280/Aarogya_Aadhar_Story_1st_Image_qnq6yq.png"
              }
              width={1400}
              height={800}
              alt=""
              className="w-full xs:h-[160px] max-[1200px]:h-[200px] min-[1200px]:h-[260px] py-1 h-auto px-1 rounded-[15px]"
            />
          </div>
          <div className="md:w-[38%] hidden lg:block w-full relative">
            <Image
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1731740284/Aarogya_Aadhar_Story_2nd_Image_wgxnle.png"
              }
              width={1500}
              height={844}
              alt="Image"
              className="w-full max-[1200px]:h-[240px] min-[1200px]:h-[280px] border-2 border-[#243460] shadow-md h-auto rounded-[15px] md:ml-[-20px]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* <span className="text-black  text-lg">(Photo)</span> */}
            </div>
          </div>
        </div>
        {/* Intro Content */}
        <div className="sm:mx-5 lg:mx-5 lg:ml-0">
          {" "}
          <div className=" justify-center text-center mt-0 lg:mt-4 lg:mb-4">
            <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-poppins font-extrabold  ">
              <span className="shadow-inherit">Introduction</span>
            </h1>
          </div>
          <div>
            <div className=" text-start justify-center items-center  font-sans text-[10px] lg:text-[16px] space-y-2 font-semibold text-[#243460] border-2 border-[#243460] md:p-4 p-2 rounded-xl">
              <p>
                <span className="font-bold"> Dr. Shubham R Gadge</span> is
                certify that the thesis entitled{" "}
                <span className="font-bold">
                  “A Study of Effectiveness of Information and Technology as a
                  Tool for Healthcare Digitalization Access to Quality
                  Healthcare”
                </span>{" "}
                which is being submitted herewith for the award of the{" "}
                <span className="font-bold">
                  Degree of Doctor of Philosophy (Ph.D.)
                </span>{" "}
                on 2023. Thesis & Project Approved by Government of India under
                SISFS*.
              </p>{" "}
              <p>
                <span className="font-bold"> Aarogya Aadhar</span> is a{" "}
                <span className="font-bold">
                  Health Tech App & Digital Health Card
                </span>{" "}
                that integrates the entire healthcare services and their{" "}
                {"providers'"} ecosystem on a single platform. The Health Card &
                App provides patients with comprehensive information about
                <span className="font-bold">
                  Hospitals & Healthcare Providers
                </span>{" "}
                across <span className="font-bold text-[#ff5e00]">India</span>.
                <br />
                Aarogya Aadhar offers a comprehensive platform for patients to
                make informed decisions about their healthcare. The app provides
                real-time, user friendly information and is accessible in{" "}
                <span className="font-bold">Multiple Languages.</span>
              </p>
              <p>
                {" "}
                <span className="font-bold">
                  {" "}
                  Aarogya Aadhar Provides to Patients
                </span>{" "}
                - Financial Support in Healthcare, Bed Availability, Cost of
                Treatment, Waiting Time, Affordability, HSP Facilities, 24/7
                Emergency Ambulance, Information about Govt. Healthcare Schemes,
                Quality Treatment & Patient Safety, ABHA Card, Ayushman Bharat
                Health Card, All Health Insurance Card, 360 degree healthcare
                service under single ecosystem.
              </p>
            </div>
          </div>
        </div>
        {/* Knowledge Partners */}
        <div className="w-full mt-4 lg:mb-4">
          <div className=" justify-center text-center mb-2">
            <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-poppins font-extrabold ">
              <span className="shadow-inherit">Knowledge Partners</span>
            </h1>
          </div>
        </div>

        <div className="md:mx-auto lg:mr-5">
          <Image
            alt=""
            width={4000}
            height={2000}
            src={
              "https://res.cloudinary.com/dnckhli5u/image/upload/v1731738592/Knowledge_Partners_pqpngv.png"
            }
            className=" h-full w-full rounded-[15px]"
          />
        </div>

        <div className="w-full bg-[#e9e8e9] hidden h-auto rounded-[15px] p-4">
          <div className="sm:mx-10 md:mx-auto lg:mx-auto container   mt-4 px-10">
            {/* Carousel Section */}
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {[
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1726917762/aarogya%20aadhar/nrzbglnhmq85etw7egjf.webp",
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1726917809/aarogya%20aadhar/jnau4vgsl43ityd0nd8e.webp",
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1726917813/aarogya%20aadhar/knqcjm3g2swxujxi1eoi.webp",
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1726919809/Icons/ts7702aqs5kzim5dl700.png",
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1724816853/aarogya%20aadhar/SiteImages/b0c6cjlka8q5zzt2xfcw.webp",
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1724816853/aarogya%20aadhar/SiteImages/isc866vgxtq7aiddmobh.webp",
                  "https://res.cloudinary.com/dnckhli5u/image/upload/v1724816853/aarogya%20aadhar/SiteImages/ljifn57fmxxx6iteqnz1.webp",
                ].map((src, index) => (
                  <CarouselItem
                    key={index}
                    className="w-full basis-1/1 md:basis-1/3 lg:basis-1/6 flex justify-center"
                  >
                    <Image
                      src={src}
                      width={200}
                      height={200}
                      alt={`carousel-image-${index + 1}`}
                      className={`lg:w-36 h-32 md:h-28 md:w-28 ${
                        index === 6 ? "lg:w-auto md:w-auto" : ""
                      }`}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="mx-auto container">
            <hr className=" h-1 border-t-2 mb-2  mx-10 text-black" />
          </div>
          <div className="flex justify-center item-center text-center mb-2">
            {" "}
            <div className="flex justify-start items-start  z-20">
              <div className="space-y-4 text-center font-bold font-sans text-[10px] lg:text-[18px] text-[#243460]">
                {[
                  {
                    title: "MPBCDC",
                    description:
                      "Mahatma Phule Backward Class Development Corporation Limited",
                  },
                  {
                    title: "MahaPreit",
                    description:
                      "Mahatma Phule Renewable Energy & Infrastructure Technology Limited",
                  },
                  {
                    title: "MSInS",
                    description:
                      "Maharashtra State Innovation Society, Selected Innovative Startup in Healthcare",
                  },
                  {
                    title: "IIT Guwahati",
                    description:
                      "Udgam24 Top Winner Innovative Startup in India",
                  },
                  {
                    title: "JIIF",
                    description:
                      "JITO Incubation & Innovation Foundation is Supported & Incubation Partner",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-start items-start text-start"
                  >
                    <span className="mr-4 lg:mr-2 hidden lg:block">
                      <Image
                        src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724137358/Icons/gzdci0gv3ny4ey35pglx.png"
                        className="lg:h-6 lg:w-6 "
                        width={600}
                        height={600}
                        alt=""
                      />
                    </span>
                    <span className="mr-4 lg:mr-2 lg:hidden block">
                      <CircleChevronRight className="text-red-600 bg-white p-0 rounded-full h-4 w-4" />
                    </span>
                    <p className="space-x-2">
                      <span>{item.title}</span>
                      <span className="font-normal">({item.description})</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1723968402/aarogya%20aadhar/nb1t6tfkwzkuvvjjfdfy.webp"
            alt="Description of the image"
            layout="responsive"
            width={1200}
            height={375}
            className="w-full hidden md:block md:mt-[-100px] xl:mt-[-180px] h-28"
          />
        </div>
        {/* Story */}
        <div className="w-full mt-8 mb-2 md:h-64 md:mx-auto lg:ml-0 lg:pl-3 md:container grid md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-2">
          <div className=" text-[#243460] ">
            <Image
              alt=""
              width={4000}
              height={2000}
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1731738752/1_dgdvnz.png"
              }
              className=" rounded-[15px]"
            />
          </div>
          <div className=" text-[#243460] ">
            <Image
              alt=""
              width={4000}
              height={2000}
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1731738756/2_dn2scd.png"
              }
              className=" rounded-[15px]"
            />
          </div>
          <div className=" text-[#243460] ">
            <Image
              alt=""
              width={4000}
              height={2000}
              src={
                "https://res.cloudinary.com/dnckhli5u/image/upload/v1731738757/3_t7ig76.png"
              }
              className=" rounded-[15px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutclient;
