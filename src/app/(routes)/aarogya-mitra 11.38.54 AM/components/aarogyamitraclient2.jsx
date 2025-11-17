// import Image from "next/image";
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// import Markdown from "markdown-to-jsx";
// import { Input } from "@/components/ui/input";
// import { Phone } from "lucide-react";

// const Aarogyamitraclient2 = () => {
//   return (
//     <>
//       {" "}
//       <div className="font-poppins mt-4 relative md:px-0 px-2">
//         <div className="relative w-full h-[300px] hidden md:block md:h-[270px] rounded-[15px] bg-gradient-to-r from-[#ffde59] to-[#ff914d] border-2 border-[#243460]">
//           <p className="font-extrabold text-center mt-4 text-xl md:text-2xl text-[#243460]">
//             Join <span className="text-[#ff5e00]">AarogyaMitra</span> with 4
//             Easy Step’s
//           </p>
//           <div className="mx-auto w-[90%] xl:w-[75%] lg:w-[94%] mt-4 justify-center text-center container">
//             <Carousel
//               opts={{}}
//               className="w-full flex items-center text-center justify-center"
//             >
//               <CarouselContent>
//                 {healthpackages.map((item, index) => (
//                   <CarouselItem
//                     key={index}
//                     className="md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
//                   >
//                     <div className="p-1 relative">
//                       <Card className="relative h-auto mb-2 border-none">
//                         <CardContent className="flex flex-col items-center p-2 relative bg-[#D9D9D9] h-[260px] md:h-[260px] rounded-[15px]">
//                           {/* Image */}
//                           <div className="relative w-full mx-auto bg-white rounded-[15px]">
//                             {item.src ? (
//                               <Image
//                                 src={item.src}
//                                 width={600}
//                                 height={400}
//                                 alt={item.alt}
//                                 className="object-cover bg-[#5271FF] h-[120px] rounded-[15px] md:h-[150px]"
//                               />
//                             ) : (
//                               <div className="relative w-full bg-white border-[#ffce38] h-[120px] rounded-[15px] md:h-[150px]"></div>
//                             )}{" "}
//                             {/* Button Half on Image and Half Outside */}
//                             <button className="absolute bottom-[-10px]  left-1/2 transform -translate-x-1/2 text-[12px]  xl:text-[13px] bg-blue-500 text-white px-3 py-1 font-extrabold rounded-full shadow-md">
//                               Step No {item.no}
//                             </button>
//                           </div>

//                           {/* Name */}
//                           <Markdown className="lg:text-[14px] text-[11px] lg:px-6 font-semibold text-[#243460] lg:h-12 font-sans lg:mt-4 mt-6 justify-center text-center">
//                             {item.text}
//                           </Markdown>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
//             </Carousel>
//           </div>
//         </div>

//         <div className="relative w-full h-[580px] md:hidden block   rounded-[15px] bg-gradient-to-r from-[#ffde59] to-[#ff914d] border-2 border-[#243460]">
//           <p className="font-extrabold text-center mt-4 text-[16px] md:text-2xl text-[#243460]">
//             Join <span className="text-[#ff5e00]">AarogyaMitra</span> with 4
//             Easy Step’s
//           </p>
//           <div className="mx-auto  mt-4 justify-center text-center ">
//             <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
//               {healthpackages.map((item, index) => (
//                 <div className="p-1 relative" key={index}>
//                   <Card className="relative h-auto  border-none">
//                     <CardContent className="flex flex-col items-center p-2 relative bg-[#D9D9D9] h-[220px] md:h-[260px] rounded-[15px]">
//                       {/* Image */}
//                       <div className="relative w-full mx-auto bg-white rounded-[15px]">
//                         {item.src ? (
//                           <Image
//                             src={item.src}
//                             width={600}
//                             height={400}
//                             alt={item.alt}
//                             className="object-cover bg-[#5271FF] h-[120px] rounded-[15px] md:h-[150px]"
//                           />
//                         ) : (
//                           <div className="relative w-full bg-white border-[#ffce38] h-[120px] rounded-[15px] md:h-[150px]"></div>
//                         )}{" "}
//                         {/* Button Half on Image and Half Outside */}
//                         <button className="absolute bottom-[-10px]  left-1/2 transform -translate-x-1/2  text-[7px] bg-blue-500 text-white p-1 font-extrabold rounded-full shadow-md">
//                           Step No {item.no}
//                         </button>
//                       </div>

//                       {/* Name */}
//                       <Markdown className="lg:text-[14px]xl:px-4 text-[11px] font-semibold text-[#243460] lg:h-12 font-sans lg:mt-3 mt-6 justify-center text-center">
//                         {item.text}
//                       </Markdown>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mb-1 md:mt-16 md:w-[24rem] xl:w-[25rem] container mx-auto ">
//         <div className="relative pt-2">
//           {/* phone icon */}
//           <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-2">
//             <Image
//               src="https://res.cloudinary.com/dnckhli5u/image/upload/v1726897752/Icons/vdqj2nm0h9aekbupaxcp.png"
//               width={1200}
//               height={400}
//               alt="Aarogya Aadhar"
//               className="h-8 w-8 rounded-full"
//             />
//           </span>

//           {/* input for mobile/email */}
//           <Input
//             placeholder="Enter Number/Email ID" // Use the passed placeholder prop here
//             className="rounded-full h-[45px] px-3 py-2 text-[13px] bg-[#243451] font-poppins placeholder:text-[13px] text-white  pl-12"
//           />

//           {/* subscribe button */}
//           <button
//             type="button"
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2 lg:mr-[7px] mt-[3.5px] lg:mt-[3.5px]"
//           >
//             <span className="text-[#243451]  font-bold font-sans text-[12px]  bg-white px-4 py-1 lg:py-2 rounded-full">
//               Subscribe
//             </span>
//           </button>
//         </div>
//       </div>
//       <div className="flex space-x-1 text-center font-poppins text-[#002e6e] text-[14px] md:text-[20px] font-bold justify-center items-center">
//         <span>Join The </span>{" "}
//         <span className="text-[#FF5E00]">Aarogya Mitra </span>
//         <span> Community</span>
//       </div>
//     </>
//   );
// };

// export default Aarogyamitraclient2;

// const healthpackages = [
//   {
//     src: "",
//     no: "1",
//     text: "Download **AarogyaMitra** App in your Mobile",
//     rcount: "258",
//   },
//   {
//     no: "2",
//     src: "",
//     text: "Create your Account & wait for Verified by **Aarogya Aadhar**",
//     rcount: "258",
//   },
//   {
//     no: "3",
//     src: "",
//     text: "Apply for Training & Get Online Training from **Aarogya Aadhar**",
//     rcount: "580",
//   },
//   {
//     no: "4",
//     src: "",
//     text: "**After** Certified Start Service & Start for Earning",
//     rcount: "351",
//   },
// ];
"use client"

import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Markdown from "markdown-to-jsx";
import { Input } from "@/components/ui/input";
import { IoCall } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Aarogyamitraclient2 = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return toast.error("Please enter your email!");

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.error || "Subscription failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-poppins mt-4 w-auto md:px-0 ">
      {/* Main Section */}
      <div className="relative w-auto max-w-7xl my-6 lg:my-6 px-4 sm:px-6 md:px-10 xl:px-10 
  rounded-xl bg-gradient-to-r from-[#ffde59] to-[#ff914d] border-2 border-[#243460] py-6 lg:h-[350px]  xl:mx-24 pb-9 lg:pb-0">
  
  <p className="font-extrabold text-center text-xl md:text-2xl text-[#243460]">
    Join <span className="text-[#ff5e00]">AarogyaMitra</span> with 4 Easy Steps
  </p>

  {/* Cards Grid */}
  <div className="w-full max-w-7xl mx-auto mt-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-14 lg:gap-10 xl:gap-12">
      {healthpackages.map((item, index) => (
        <Card key={index} className="border-none h-full relative">
          <CardContent className="flex flex-col items-center p-1 bg-white rounded-xl h-full">
            
            {/* Image Section */}
            <div className="relative w-full bg-white rounded-xl overflow-hidden">
              {item.src ? (
                <Image
                  src={item.src}
                  width={600}
                  height={400}
                  alt={item.alt}
                  className="object-cover h-[140px] w-full"
                />
              ) : (
                <div className="max-[1200px]:h-[120px] min-[1200px]:h-[140px] bg-white border border-[#ffce38] rounded-xl"></div>
              )}
            </div>

            {/* Step Button - Half Inside & Half Outside */}
            <button className="absolute top-[128px] left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 xl:px-3 py-2 font-bold rounded-full shadow-md">
              Step No {item.no}
            </button>

            {/* Text */}
            <Markdown className="max-[1200px]:text-[10px] min-[1200px]:text-[12px] text-[#243460] font-semibold text-center mt-6 mb-4 px-[5px]">
              {item.text}
            </Markdown>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  <div className=" flex justify-center items-center lg:hidden">
    <button className=" absolute bottom-0 mb-[-20px] bg-blue-500 px-3 py-[7px] font-semibold rounded-[8px] text-white">Register Now</button>
  </div>
</div>


      {/* Subscribe Section */}
      <div className="mb-1 md:w-[24rem] xl:w-[25rem] container mx-auto">
        <div className="relative w-full max-w-md flex items-center">
                  {/* Icon */}
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    <IoCall
                      className="h-6 w-6 bg-white rounded-full p-1 md:h-7 md:w-7"
                      color="#243451"
                    />
                  </span>
        
                  {/* Input Field */}
                  <Input
                    type="email"
                    placeholder="Enter Number/Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full  bg-[#243451] font-poppins placeholder:text-[12px] text-white placeholder-blue-950 placeholder:font-semibold pl-10 md:pl-12 w-full"
                  />
        
                  {/* Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubscribe}
                    className="absolute right-0 mr-[6px] -mt-1"
                  >
                    <span className="text-[#243451] p-2 text-[10px]  font-bold bg-white px-4 rounded-full">
                      Send Link
                    </span>
                  </button>
                </div>
      </div>

      {/* Community Section */}
      <div className="text-center text-[#002e6e] text-sm sm:text-lg md:text-xl font-bold flex justify-center items-center space-x-1 lg:mb-4">
        <span>Join the</span>
        <span className="text-[#FF5E00]">Aarogya Mitra</span>
        <span>Community</span>
      </div>
    </div>
  );
};

export default Aarogyamitraclient2;

const healthpackages = [
  { src: "https://res.cloudinary.com/dorreici1/image/upload/v1754111847/Download_App_eptwgp.png", no: "1", text: "Download **AarogyaMitra** App in your Mobile" },
  { no: "2", src: "https://res.cloudinary.com/dorreici1/image/upload/v1754111846/Create_Account_jgtwso.png", text: "Create your Account & wait for Verification" },
  { no: "3", src: "https://res.cloudinary.com/dorreici1/image/upload/v1754111846/Applied_for_Training_sn9dxi.png", text: "Apply for Training & Get Online Training" },
  { no: "4", src: "https://res.cloudinary.com/dorreici1/image/upload/v1754111846/Certified_ewaoea.png", text: "**After** Certified Start Service & Earn" },
];
