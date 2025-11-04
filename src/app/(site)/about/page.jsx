import React from "react";
import Aboutclient from "./components/aboutclient";
import About2 from "./components/about2";
import About3 from "./components/about3";
import About4 from "./components/about4";
import Teamclient1 from "./components/teamclient1";
import Certificates from "./components/certificates";

const AboutUsPage = () => {
  return (
    <div className="xs:px-4  xl:mt-5 min-[1000px]:pl-[60px] min-[1000px]:pr-[2rem] min-[1100px]:pl-[60px] min-[1100px]:pr-[2rem] xl:px-[60px] md:container">
      <div>
        {" "}
        <Aboutclient />
      </div>
      <div className="mt-5 md:mt-[65rem] lg:mt-0">
        <About2 />
      </div>{" "}
      <div className="">
        <About3 />
      </div>{" "}
      <div>
        <About4 />
      </div>
      <div><Teamclient1/></div>
      {/* <div><Certificates/></div> */}
    </div>
  );
};

export default AboutUsPage;
