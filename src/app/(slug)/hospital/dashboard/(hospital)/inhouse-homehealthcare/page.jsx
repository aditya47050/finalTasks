import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import InhouseHomeHealthcareComponent from "../components/inhousehomehealthcare";

const InhouseHomeHealthcarePage = async () => {
  const session = await getSession();
  if (!session || !session.email) {
    return <div>Unauthorized</div>;
  }

  // Find hospital by session email
  const hospital = await db.hospital.findFirst({
    where: { email: session.email },
    select: { id: true },
  });

  if (!hospital) {
    return <div>Hospital not found</div>;
  }

  // Fetch hospital data including linked home healthcare centers
  const hospitalData = await db.hospital.findUnique({
    where: { id: hospital.id },
    include: {
      linkedHomeHealthcare: {
        select: {
          id: true,
          homeHealthcare: {
            select: {
              id: true,
              email: true,
              mobile: true,
              hspInfo: {
                select: {
                  regname: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Fetch all home healthcare centers
  const allHomeHealthcareCenters = await db.hospital.findMany({
    where: { role: "homehealthcare" },
    select: {
      id: true,
      email: true,
      mobile: true,
      hspInfo: {
        select: {
          regname: true,
        },
      },
    },
  });

  return (
    <InhouseHomeHealthcareComponent
      hospitalId={hospital.id}
      homeHealthcareCenters={hospitalData.linkedHomeHealthcare}
      allHomeHealthcareCenters={allHomeHealthcareCenters}
    />
  );
};

export default InhouseHomeHealthcarePage;