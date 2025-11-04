import { db } from "@/lib/db";
import React from "react";
import PhotographerSingleView from "../components/photographersingleview";
import { getSession } from "@/lib/getsession";
import { redirect } from "next/navigation";

const PhotographerPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    redirect("/aarogyadhan/photographer/login");
  }

  const data = await db.photographer.findFirst({
    where: { email: session.email },
  });

  return (
    <div>
      <PhotographerSingleView photographerData={data} />
    </div>
  );
};

export default PhotographerPage;
