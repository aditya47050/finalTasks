import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const Certificates = () => {
  return (
    <>
      <div className="mx-auto container  mb-4">
        <div className="justify-center text-center">
          <h1 className="lg:text-[30px] text-[20px] text-[#5271FF] font-extrabold">
            Aarogya Aadhar
          </h1>
          <p className="text-[#5271FF] text-[15px] lg:text-xl">
            Certifications
          </p>
        </div>
        <div className=" border rounded-[15px] lg:p-4  border-[#243460]">
          {" "}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {certifications.map((item, index) => (
              <div key={index} className="p-1 relative">
                <Card className="relative border-2 border-gray-200 h-60 md:h-72 rounded-[15px] shadow-sm">
                  <CardContent className="flex flex-col items-center p-4 bg-white rounded-xl h-full">
                    {/* Image */}
                    <div className="relative w-full h-60 md:h-72 mx-auto rounded-xl overflow-hidden">
                      {item.img ? (
                        <Image
                          src={item.img}
                          width={600}
                          height={400}
                          alt={`Certificate ${index + 1}`}
                          className="object-cover object-top w-full h-auto"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full w-full rounded-xl" />
                      )}
                    </div>
                    {/* View Button */}
                    <div className="mt-4 bottom-4 absolute">
                      <Link href={item.img} passHref>
                        <span
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#5271FF] text-white text-sm rounded-xl shadow hover:bg-[#3555cc] transition"
                        >
                          View
                        </span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 mt-6 lg:grid-cols-3 gap-10 pb-16">
            {lcertifications.map((item, index) => (
              <div key={index} className="p-1 relative">
                <Card className="relative border-2 border-gray-200 h-40 md:h-72 rounded-[15px] shadow-sm">
                  <CardContent className="flex flex-col items-center p-4 bg-white rounded-xl h-full">
                    {/* Image */}
                    <div className="relative w-full h-full mx-auto rounded-xl overflow-hidden">
                      {item.img ? (
                        <Image
                          src={item.img}
                          width={600}
                          height={400}
                          alt={`Certificate ${index + 1}`}
                          className="object-cover object-top w-full h-auto rounded-xl"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full w-full rounded-xl" />
                      )}
                    </div>
                    {/* View Button */}
                    <div className="mt-4 bottom-4 absolute">
                      <Link href={item.img} passHref>
                        <span
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#5271FF] text-white text-sm rounded-xl shadow hover:bg-[#3555cc] transition"
                        >
                          View
                        </span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificates;
const certifications = [
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/p9ffpsvvllwg4kmc31mu.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/bd8ieen1gnozrpvxqmbm.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1729249303/certipicate_2_b636ph.png",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/aq9nkpg5rtb4nkoaivrz.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/l8tz7cus5lo0gac6lri2.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/bayljlemvkgjxc31m1or.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/cytrejnk5xdfqtmxpr7f.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/rus7ozizds8bk3lsavss.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/lcouhyk25jimcm616e20.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/aj3uvtr25kcq73rrgfog.webp",
  },
];
const lcertifications = [
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/jobzdtta2dcdctuoxndy.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/dc3po0zhgtgqlwqgkmiq.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/qqiv425ya2j8iuj3dscm.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/vmnxciofp53frfkp4ibe.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/pmpvmqvpfstz97v0wuj0.webp",
  },
  {
    img: "https://res.cloudinary.com/dnckhli5u/image/upload/v1725190697/aarogya%20aadhar/certficates/fldn8dnhginfasegng5h.webp",
  },
];
