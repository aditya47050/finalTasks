import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import ConditionalLayoutWrapper from "../ambulance/components/conditionallayout";

const AmbulanceLayout = async ({ children }) => {
  const session = await getSession();

  const [hospitalCategories, doctorCategories] = await Promise.all([
    db.HospitalsCategory.findMany({ select: { id: true, title: true } }),
    db.ExpertDoctorsCategory.findMany({ select: { id: true, title: true } }),
  ]);

  let userData = null;

  if (session) {
    userData = await db.$transaction(async (prisma) => {
      for (const model of ["Ambulance", "Doctor", "Patient", "Corporate"]) {
        const user = await prisma[model].findUnique({
          where: { email: session.email },
          select: {
            id: true,
            email: true,
            role: true,
            mobile: true,
          },
        });
        if (user) return { ...user, type: model };
      }
      return null;
    });
  }

  return (
    <ConditionalLayoutWrapper
      userData={userData}
      hspcategory={hospitalCategories}
      doctorcategory={doctorCategories}
    >
      {children}
    </ConditionalLayoutWrapper>
  );
};

export default AmbulanceLayout;
