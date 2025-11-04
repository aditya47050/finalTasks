import React from "react";

import Healthclient from "./components/healthclient";
import CorporateClient from "./components/corporateclient";
import HealthPackageClient from "../health-packages/components/healthpackageclient";

const CorporatePage = () => {
  return (
    <>     <div>
    <div className="relative min-[1200px]:container max-[1200px]:px-[15px]">
      <CorporateClient />
    </div>
    <div className="-mt-10 sticky  ">
      <Healthclient />
    </div>
  </div>

 
    </>
  );
};

export default CorporatePage;
