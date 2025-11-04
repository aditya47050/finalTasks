import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import IndividualCampaign from "../components/fundraisersingleview";


const CampaignPage = async ({ params }) => {
  const campaign = await db.fundraisingCampaign.findUnique({
    where: {
      id: params.fundraiserid,
    },
    include: {
      fundraiser: true,
      Donation: {
        where: {
          paymentStatus: "SUCCESS"
        }
      }
    }
  });

  if (!campaign) {
    notFound();
  }

  return <IndividualCampaign campaign={campaign} />;
};

export default CampaignPage;
