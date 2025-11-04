"use client";
import React, { useState } from "react";
import { Input } from "postcss";
import { ArrowDown, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { diseaseData } from './diseaseIndexData';
import { usePathname } from "next/navigation";
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
export const Diseasesclient = () => {
  const pathname = usePathname();
  const [text, setText] = useState();
  const [buttonStates, setButtonStates] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const handleClick = (buttonId) => {
    setButtonStates(buttonId);
  };
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const navlinks = [
  { title: "Index A", link: "/diseases/a" },
  { title: "Index B", link: "/diseases/b" },
  { title: "Index C", link: "/diseases/c" },
  { title: "Index D", link: "/diseases/d" },
  { title: "Index E", link: "/diseases/e" },
  { title: "Index F", link: "/diseases/f" },
  { title: "Index G", link: "/diseases/g" },
  { title: "Index H", link: "/diseases/h" },
  { title: "Index I", link: "/diseases/i" },
  { title: "Index J", link: "/diseases/j" },
  { title: "Index K", link: "/diseases/k" },
  { title: "Index L", link: "/diseases/l" },
  { title: "Index M", link: "/diseases/m" },
  { title: "Index N", link: "/diseases/n" },
  { title: "Index O", link: "/diseases/o" },
  { title: "Index P", link: "/diseases/p" },
  { title: "Index Q", link: "/diseases/q" },
  { title: "Index R", link: "/diseases/r" },
  { title: "Index S", link: "/diseases/s" },
  { title: "Index T", link: "/diseases/t" },
  { title: "Index U", link: "/diseases/u" },
  { title: "Index V", link: "/diseases/v" },
  { title: "Index W", link: "/diseases/w" },
  { title: "Index X", link: "/diseases/x" },
  { title: "Index Y", link: "/diseases/y" },
  { title: "Index Z", link: "/diseases/z" },
];



  const handleButtonClick = (buttonId) => {
    setActiveButton((prevActiveButton) =>
      prevActiveButton === buttonId ? null : buttonId
    );
  };
  const handleSearch = (e) => {
  const input = e.target.value;
  setText(input);

  if (input.length >= 2) {
    const matches = Object.values(diseaseData)
      .flat()
      .filter((item) =>
        item.title.toLowerCase().includes(input.toLowerCase())
      )
      .slice(0, 5); // Only top 5

    setSuggestions(matches);
  } else {
    setSuggestions([]);
  }
};
  return (
    <>
      <div className=" mx-auto font-poppins container w-full mb-6 hidden lg:block min-[1000px]:pl-[60px] min-[1000px]:pr-5 min-[1100px]:pl-[60px] min-[1100px]:pr-5 xl:pl-[80px] xl:pr-[40px] xlg:container">
        {" "}
        <div
          className="w-full rounded-[15px] py-4 "
          // style={{
          //   backgroundImage:
          //     "url('https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png')",
          //   backgroundSize: "cover",
          //   backgroundPosition: "right",
          //   height: "400px",
          // }}
        >
          {pathname === "/" && (
          <div className=" justify-center text-center ">
            <h1 className="text-[25px] text-[#5271FF] font-extrabold ">
              <span className="shadow-inherit">All Health Diseases</span>
            </h1>
            <p className="text-[#5271FF] stroke-[#5271FF]">
              A to Z Diseases Information
            </p>
          </div>)}
          <div className="flex  md:flex-nowrap justify-center  text-center items-center">
            <span>
              <div className="mb-5 mt-4 container mx-auto p-2 ">
                <div className="relative group pt-2">
                  <span className="absolute inset-y-0 left-0 top-1/2 transform -translate-y-1/2 pl-1 z-10">
                    {" "}
                    {/* Standardized padding */}
                    <div
                      className={
                        "h-9 w-9 rounded-full text-white p-2 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900"
                      }
                    >
                      <SearchIcon className="h-2 w-2  md:h-9 md:w-9" /> {/* Standardized icon size */}
                    </div>
                  </span>

                  <input
                    placeholder="Search Disease Index" // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 h-12  xl:w-[30rem] bg-gradient-to-r from-blue-100 to-indigo-100 placeholder-blue-800 placeholder:font-semibold pl-12"
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="submit"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-[6px] mt-1"
                      >
                        <span className=" p-2 font-bold px-4 rounded-full">
                          {" "}
                          <ArrowDown className="h-9 w-9 bg-gradient-to-r from-blue-800 to-blue-900 p-1 rounded-full text-white" />
                        </span>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="md:absolute right-0  mt-0 w-full  bg-white  overflow-auto grid grid-cols-3 gap-8 p-4"
                      style={{ minWidth: "400px", top: "100%" }}
                    >
                      {/* First Column */}
                      <div className="col-start-1">
                        {navlinks.slice(0, 9).map((nav) => (
                          <DropdownMenuItem key={nav.link}>
                            <Link href={nav.link}>
                              <span className="text-blue-950  font-extrabold  hover:text-[#FF5E00]">
                                {nav.title}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>

                      {/* Second Column */}
                      {navlinks.length > 9 && (
                        <div className="col-start-2">
                          {navlinks.slice(9, 18).map((nav) => (
                            <DropdownMenuItem key={nav.link}>
                              <Link href={nav.link}>
                                <span className="text-blue-950 font-extrabold hover:text-[#FF5E00]">
                                  {nav.title}
                                </span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      )}

                      {/* Third Column */}
                      {navlinks.length > 18 && (
                        <div className="col-start-3">
                          {navlinks.slice(18).map((nav) => (
                            <DropdownMenuItem key={nav.link}>
                              <Link href={nav.link}>
                                <span className="text-blue-950 font-extrabold hover:text-[#FF5E00]">
                                  {nav.title}
                                </span>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </span>

            <span>
              <div className=" mb-5 mt-4 container mx-auto p-2">
                <div className="relative pt-2">
                  <span className="absolute inset-y-0 left-0 top-1/2 transform -translate-y-1/2 pl-1 z-10">
                    {" "}
                    {/* Standardized padding */}
                    <div
                      className={
                        "h-9 w-9 rounded-full text-white p-2 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900"
                      }
                    >
                      <SearchIcon className="h-2 w-2  md:h-9 md:w-9" /> {/* Standardized icon size */}
                    </div>
                  </span>

                  <input
                    value={text}
                    onChange={handleSearch}
                    placeholder="Search Disease" // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 xl:w-[30rem] h-12 bg-gradient-to-r from-blue-100 to-indigo-100 placeholder-blue-800 placeholder:font-semibold pl-12"
                  />
                  {suggestions.length > 0 && (
        <div className="absolute bg-white text-left shadow-xl rounded-xl w-full max-w-xl mt-3 z-30 border border-gray-100 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-50">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Suggestions</span>
            </div>
            <ul className="max-h-64 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <Link key={idx} href={`/disease/${slugify(item.title)}`}>
                  <li
                    className="group flex items-center gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
                    onClick={() => {
                      setText(item.title)
                      setSuggestions([])
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-200">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-800 group-hover:text-blue-900 transition-colors duration-200 block truncate">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200 block truncate mt-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
            {suggestions.length > 5 && (
              <div className="px-4 py-2 border-t border-gray-50 bg-gray-25">
                <span className="text-xs text-gray-500">
                  Showing {Math.min(5, suggestions.length)} of {suggestions.length} results
                </span>
              </div>
            )}
          </div>
        </div>
      )}

                  <button
                    type="button"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-[6px] mt-1"
                  >
                    <span className="bg-gradient-to-r from-white to-blue-50 text-blue-700 px-3 py-[10px] font-bold rounded-full">
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </span>
          </div>
          {pathname === "/" && (
            <div className="w-full container mt-4  flex space-x-5 lg:px-0">
              <div className="w-9/12 rounded-[15px] h-auto relative" style={{  }}>
                <Link href="/aarogya-mitra">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731825232/3_onadcq.png"
                    alt="First image"
                    width={1400} height={400}

                    className="xl:h-[280px] w-[1100px] rounded-[15px]" 
                  />
                </Link>
              </div>
              <div className="w-3/12 rounded-[15px] relative" style={{ }}>
                <Image
                  src="https://res.cloudinary.com/dnckhli5u/image/upload/v1731652567/3_q4dibu.png"
                  alt="Second image"
              width={1360} height={280}
                  objectPosition="right"
                  className="rounded-[15px] xl:h-[280px] w-[360px]"
                />
              </div>
            </div>)}


        </div>
      </div>

      {/* Mobile Screen */}
      <div className=" font-poppins block lg:hidden">
        {" "}
        {pathname === "/" && (
        <div className="justify-center text-center mt-4 ">
          <h1 className="text-[20px] text-[#5271FF] font-extrabold ">
            <span className="shadow-inherit">All Health Diseases</span>
          </h1>
          <p className="text-[#5271FF] text-[11px] stroke-[#5271FF]">
            A to Z Diseases Information
          </p>
        </div>
        )}
        <div>
          <div className="  container mx-auto p-2 sm:px-[2rem]">
            <div className="flex flex-row items-center justify-between gap-4">
              {/* First Element */}
              <div className="relative pt-2 flex-1">
                <input
                  placeholder="Search Disease Index"
                  className="rounded-full pl-2 text-[12px] h-8 placeholder:text-[10px] border-2 border-[#243460] placeholder-blue-950 placeholder:font-semibold w-full"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="submit"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-1 mt-1"
                    >
                      <span className="rounded-full">
                        <ArrowDown className="h-6 w-6 bg-blue-950 p-1 rounded-full text-white" />
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="md:absolute right-0 mt-1 w-full bg-white overflow-auto grid grid-cols-3 gap-1 pl-8 "
                    style={{ minWidth: "400px", top: "100%" }}
                  >
                    {/* First Column */}
                    <div className="col-start-1">
                      {navlinks.slice(0, 9).map((nav) => (
                        <DropdownMenuItem key={nav.link}>
                          <Link href={nav.link}>
                            <span className="text-blue-950 font-bold hover:text-[#FF5E00]">
                              {nav.title}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>

                    {/* Second Column */}
                    {navlinks.length > 9 && (
                      <div className="col-start-2">
                        {navlinks.slice(9, 18).map((nav) => (
                          <DropdownMenuItem key={nav.link}>
                            <Link href={nav.link}>
                              <span className="text-blue-950 font-bold hover:text-[#FF5E00]">
                                {nav.title}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}

                    {/* Third Column */}
                    {navlinks.length > 18 && (
                      <div className="col-start-3">
                        {navlinks.slice(18).map((nav) => (
                          <DropdownMenuItem key={nav.link}>
                            <Link href={nav.link}>
                              <span className="text-blue-950 font-bold hover:text-[#FF5E00]">
                                {nav.title}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Second Element */}
              <div className="relative pt-2  border-[#243460] flex-1 ">
                <input
                  value={text}
                  onChange={handleSearch}
                  placeholder="Search Disease" // Use the passed placeholder prop here
                  className="rounded-full text-[12px] pl-2  h-8 border-2 border-[#243460]  placeholder:text-[10px] placeholder-blue-950 placeholder:font-semibold w-full"
                />
                {suggestions.length > 0 && (
                  <div className="absolute text-left bg-white shadow-xl rounded-xl w-full max-w-md mt-3 z-10 border border-gray-100 overflow-hidden">
                    <div className="py-2">
                      <div className="px-4 py-1 border-b border-gray-50">
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Suggestions</span>
                      </div>
                      <ul className="max-h-64 overflow-y-auto">
                        {suggestions.map((item, idx) => (
                          <Link key={idx} href={`/disease/${slugify(item.title)}`}>
                            <li
                              className="group flex items-center gap-4 px-2 py-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
                              onClick={() => {
                                setText(item.title)
                                setSuggestions([])
                              }}
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors duration-200">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-[12px] text-gray-800 group-hover:text-blue-900 transition-colors duration-200 block truncate">
                                  {item.title}
                                </span>
                                {item.description && (
                                  <span className="text-[10px] text-gray-500 group-hover:text-gray-600 transition-colors duration-200 block truncate mt-1">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </li>
                          </Link>
                        ))}
                      </ul>
                      {suggestions.length > 5 && (
                        <div className="px-4 py-2 border-t border-gray-50 bg-gray-25">
                          <span className="text-xs text-gray-500">
                            Showing {Math.min(5, suggestions.length)} of {suggestions.length} results
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="absolute text-[9px] right-1 top-1/2 mr-0 transform -translate-y-1/2 mt-1 justify-center"
                >
                  <span className="bg-[#243460] py-[7px] text-[10px] font-bold text-white px-[8px] rounded-full">
                    Search
                  </span>
                </button>
              </div>
            </div>
          </div>
          {pathname === "/" && (
          <div className=" pt-0 xs:mx-2 xs:mt-2 sm:mt-2 md:mt-4 text-center mb-4 sm:px-[2rem] sm:mx-0">
                    <Image
                      src={"https://res.cloudinary.com/dwsc0vedb/image/upload/v1743845164/Index_Disease_Down_Image_1_m62uiy.png"}
                      width={1000}
                      height={600}
                      className="w-full  h-full rounded-[0px] "
                      alt={``}
                    />
                    {/* <div className="justify-center text-center mb-5 mt-[-60px]">
                      <h1 className="text-[10px] font-cursive text-[#324260] font-extrabold">
                        Your Health.. Your Choice..
                      </h1>
                      <p className="text-[#324260] text-[8px]">
                        Access to Good Quality Healthcare on Single Click{" "}
                      </p>
                    </div> */}
      
          </div>
          )}
        </div>
      </div>
    </>
  );
};
const images = [
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png",
  },
  {
    src: "https://res.cloudinary.com/dnckhli5u/image/upload/v1723620961/mtfbf3czjsix5cnpyzv6.png",
  },
];
