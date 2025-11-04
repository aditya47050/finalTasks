"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    title: "Patients",
    items: [
      {
        title: "Life-Changing Experience!",
        description:
          "The service was exceptional, and the team was compassionate and attentive. I felt valued and cared for every step of the way.",
        author: "Sophia R.",
      },
      {
        title: "Beyond Expectations",
        description:
          "Efficient and effective treatment with a personal touch. Highly recommend to anyone in need of quality healthcare.",
        author: "James P.",
      },
      {
        title: "Amazing Care",
        description:
          "The staff went above and beyond to make me comfortable. They were patient and explained everything in detail.",
        author: "Lily A.",
      },
    ],
  },
  {
    title: "Healthcare Service Providers",
    items: [
      {
        title: "Partnering for Excellence",
        description:
          "An exceptional platform to connect and collaborate with patients. The resources and support provided are invaluable.",
        author: "Dr. Emily H.",
      },
      {
        title: "Reliable and Professional",
        description:
          "Their approach to healthcare solutions has streamlined our services and improved patient outcomes significantly.",
        author: "Dr. Marcus T.",
      },
      {
        title: "A True Game-Changer",
        description:
          "This service has transformed the way we deliver care, ensuring efficiency and improved satisfaction.",
        author: "Dr. Clara N.",
      },
    ],
  },
  {
    title: "Corporates",
    items: [
      {
        title: "Unparalleled Service",
        description:
          "The perfect solution for our corporate wellness needs. Employees are healthier and happier than ever.",
        author: "HR Manager, TechCorp",
      },
      {
        title: "Highly Effective",
        description:
          "The programs and workshops offered have boosted morale and productivity. Excellent value for our investment.",
        author: "Operations Lead, Innovate Inc.",
      },
      {
        title: "A Vital Resource",
        description:
          "An easy and effective way to ensure our team’s health is always prioritized.",
        author: "CEO, Growth Ventures",
      },
    ],
  },
  {
    title: "Users",
    items: [
      {
        title: "So User-Friendly!",
        description:
          "Navigating the app was a breeze. Booking appointments and accessing information has never been easier.",
        author: "Derek W.",
      },
      {
        title: "Impressive Features",
        description:
          "I love the personalized notifications and reminders. It’s like having a health assistant in my pocket!",
        author: "Olivia M.",
      },
      {
        title: "Highly Recommended",
        description:
          "The interface is smooth, and the resources are extremely helpful. It’s become an essential part of my routine.",
        author: "Ryan C.",
      },
    ],
  },
];

const Testimonials = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [progress, setProgress] = useState();

  const bgColors = [
    "bg-gradient-to-r from-[#ffde59] to-[#ff914d]",
    "bg-gradient-to-r from-[#5de0e6] via-[#004aad] to-[#004aad]",
    "bg-gradient-to-br from-[#b6ff83] via-[#53e418] to-[#79b50c]",
  ];

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <div className="mb-4 mt-4 lg:mt-0 md:mx-auto w-full font-poppins px-4 md:px-0 md:container ">
        <div className="justify-center font-poppins text-center">
          <h1 className="lg:text-[25px] text-[20px] text-xl text-[#5271FF] font-extrabold">
            Testimonials
          </h1>
          <p className="text-[#5271FF] text-[11px] lg:text-[15px] ">
            <div className="flex justify-center text-center items-center flex-wrap space-x-2 ">
              {testimonials.map((category, index) => (
                <span
                  key={index}
                  className={` text-[#5271FF] rounded ${
                    selectedCategory === index ? "font-bold" : ""
                  } cursor-pointer`}
                  onClick={() => setSelectedCategory(index)}
                >
                  {category.title}
                  {index === testimonials.length - 1 ? <></> : <> |</>}
                </span>
              ))}
            </div>
          </p>
        </div>
        <div className="mx-auto container w-full lg:w-[85%] mt-4">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials[selectedCategory].items.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2  basis-1/2  xl:basis-1/3"
                >
                  <div className=" relative">
                    <Card className="relative h-auto mb-4 border-none">
                      <div
                        className={`flex flex-col items-start p-2 md:p-6 font-poppins relative rounded-[15px] ${
                          bgColors[index % bgColors.length]
                        }`}
                      >
                        {/* Rating Container */}
                        <div className="hidden lg:block">
                          {" "}
                          <div className="rating-container flex items-center mb-2 relative ">
                            <div className="rating-score bg-white text-[#507bf2]  font-bold px-1 py-2 border border-blue-600 rounded-l-lg z-10">
                              5.0
                            </div>
                            <div className="rating-stars flex items-center bg-white px-2 py-[7px] border-t border-b border-blue-600 z-10">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 fill-current text-[#243460] mx-0.5"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                              </svg>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 fill-current text-[#243460] mx-0.5"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                              </svg>{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 fill-current text-[#243460] mx-0.5"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                              </svg>{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 fill-current text-[#243460] mx-0.5"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                              </svg>{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 fill-current text-[#243460] mx-0.5"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.144c.969 0 1.371 1.24.588 1.81l-3.358 2.443a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.539 1.118l-3.358-2.443a1 1 0 00-1.175 0l-3.358 2.443c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.482 9.375c-.783-.57-.38-1.81.588-1.81h4.144a1 1 0 00.95-.69l1.286-3.948z" />
                              </svg>
                            </div>
                            <div className="absolute  right-[-4px] top-1/2 transform -translate-y-1/2 h-6 w-6 bg-white border border-blue-600 border-l-transparent rotate-45"></div>
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className=" text-[10px] truncate  lg:text-[16px] md:pl-4 font-bold mt-2 text-white">
                          {item.title}
                        </h2>
                        {/* Description */}
                        <p className="mt-2 text-black md:pl-4  text-[8px] h-[60px]  lg:text-[14px]">
                          {item.description.slice(0, 200)}
                        </p>
                        {/* Author */}
                        <p className="mt-2 text-white font-bold  text-end  text-[8px] lg:text-[14px] self-end">
                          {item.author}
                        </p>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>{" "}
        <div className="justify-center text-center">
          <h1 className="lg:text-[30px] text-[14px]  font-cursive text-[#324260] font-extrabold">
            Your Health.. Your Choice..
          </h1>
          <p className="text-[#5271FF] font-poppins text-[8px] lg:text-[15px] ">
            Access to Good Quality Healthcare on Single Click{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
