import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import {
  ArrowDown,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

import Link from "next/link";

const Mobilefooter = () => {
      const [text, setText] = useState();
      const handleSearch = () => {
        const url = new URL(window.location.href);
    
        if (!text) {
          url.searchParams.delete("query");
        } else {
          url.searchParams.set("query", text);
        }
    
        router.push(`${url}`);
      };
  return (
    <>
       <div className=" mt-4 block lg:hidden pb-12">
                 <div className="mb-1 w-full flex mx-auto container items-center justify-center">
                        {/* <div className="relative w-full max-w-md flex items-center">
                         
                          
                          <Input
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                            placeholder="Enter Number/Email ID"
                            className="rounded-full  bg-white border-blue-900 font-poppins placeholder:text-[12px] text-[#2b73ec] placeholder-blue-500 placeholder:font-semibold pl-4 md:pl-12 w-full"
                          />
                
                        
                          <button
                            type="button"
                            onClick={handleSearch}
                            className="absolute right-0 mr-[6px] -mt-1"
                          >
                            <span className="text-white p-2 text-[10px]  font-bold bg-[#2b73ec] px-4 rounded-full">
                              Send Link
                            </span>
                          </button>
                        </div> */}
                      </div>
                
                      {/* <div className="flex text-center font-poppins  text-[#002e6e] text-[12px] font-bold justify-center items-center">
                        Get the Link to Download App
                      </div> */}
              <div className="mx-auto flex justify-center items-center container mt-4">
                <ul className="list-none flex gap-1">
                  <li>
                    <Link href="https://www.instagram.com/bharat_aarogya_aadhar?fbclid=IwAR01L-bScstf5s0OHppAV4ztfW9hTVdYy9rMAykGAvHGxAjeSzVRaqa1jQ">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Instagram color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.facebook.com/profile.php?id=61554162329099">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Facebook color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Twitter color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.linkedin.com/company/aarogya-aadhar/?viewAsMember=true">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Linkedin color="#fff" />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://youtu.be/T5BCaTuZUpY">
                      <span className="bg-[#2b73ec] p-2 inline-block rounded-full">
                        <Youtube color="#fff" />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-[] w-full h-auto pt-0 items-center justify-center text-center">
        <marquee className="font-bold text-[16px]  font-sans text-[#243561] text-center" scrollamount="12">
        Aarogya Aadhar Approved & Funded by Government of India | Aarogya
            Aadhar Certified by ISO:27001 Online Healthcare Platform | Your
            Health, Your Choice | Connect with us +91 79-7272-7498 | Mail ID:
            info@aarogyaaadhar.com
        </marquee>
      </div>

      </div>
    </>
  )
}

export default Mobilefooter
