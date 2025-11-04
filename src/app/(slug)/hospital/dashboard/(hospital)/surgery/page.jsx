import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import AllSurgeriesList from "../components/allsurgerieslist";
import { redirect } from "next/navigation";
import AddSurgeryClient from "../components/surgery-treatmentform";
import HeadingClientMain from "@/app/components/heading";
const SurgeryPage = async () => {
  const session = await getSession();

  if (!session || !session.email) {
    redirect("/hospital/login");
  }

  const data = await db.hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!data) {
    redirect("/hospital/login");
  }

  const surgerydata = await db.Surgerytreatment.findMany({
    where: { hospitalId: data.id, type: "Surgery" },
  });

  return (
    <div className="md:container">
      <HeadingClientMain main="Surgery Services" sub="Manage surgeries" />
      <AddSurgeryClient hospitalid={data.id} />
      <AllSurgeriesList surgeries={surgerydata} />
    </div>
  );
};

export default SurgeryPage;
