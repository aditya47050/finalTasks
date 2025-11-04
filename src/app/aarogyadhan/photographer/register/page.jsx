import React from "react";
import { db } from "@/lib/db";
import PhotographerRegistrationLogic from "../components/registersubmission";

const PhotoGrapherregistrationpage = async () => {
  const [state, dist, subdist] = await Promise.all([
    db.state.findMany({}),
    db.district.findMany({}),
    db.SubDistrict.findMany({}),
  ]);
  return (
    <div>
      <PhotographerRegistrationLogic
        state={state}
        dist={dist}
        subdist={subdist}
      />
    </div>
  );
};

export default PhotoGrapherregistrationpage;
