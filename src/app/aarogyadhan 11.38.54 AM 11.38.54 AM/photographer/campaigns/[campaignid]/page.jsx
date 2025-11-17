import AarogyadhanSingleView from "@/app/(superadmin)/superprofile/aarogyadhan/components/aarogya-dhan-singleview";
import { db } from "@/lib/db";

const CampaignSingleViewPage = async ({ params }) => {
  const { campaignid } = params;

  // Fetch the campaign data from the database
  const data = await db.fundraisingCampaign.findUnique({
    where: { id: campaignid },
    select: {
      id: true,
      fundraisertitle: true,
      description: true,
      story: true,
      healthissue: true,
      goalamount: true,
      frontimage: true,
      recievedamount: true,
      medicaldoc1: true,
      medicaldoc2: true,
      medicaldoc3: true,
      campaignid: true,
      photographerDecision: true,
      assignmentStatus: true,
      status: true,
      fundraiserId: true,
      image1: true,
      image2: true,
      image3: true,
      video1: true,
      video2: true,
      createdAt: true,
      updatedAt: true,
      photographerId: true,
      Donation: true,
      photographer: {
        select: { id: true, fullname: true, city: true },
      },
    },
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AarogyadhanSingleView data={data} type="campaign" />
    </div>
  );
};

export default CampaignSingleViewPage;
