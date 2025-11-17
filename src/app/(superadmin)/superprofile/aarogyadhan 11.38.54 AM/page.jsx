// src/app/(superadmin)/superprofile/aarogyadhan/page.jsx

import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BarChart3, Users, IndianRupee } from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import Link from "next/link";
import { MdNoPhotography } from "react-icons/md";
import { db } from "@/lib/db";

// Lazy load components
const AarogyadhanDataDisplay = React.lazy(() =>
  import("./components/aarogyadhan-data-display")
);
const AarogyadhanGraph = React.lazy(() =>
  import("./components/aarogyadhan-graph")
);

async function fetchAarogyadhanData() {
  try {
    const [fundraisers, campaigns, donations, donors, patients] =
      await Promise.all([
        db.fundraiser.findMany({
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                mobile: true,
              },
            },
            fundraisingCampaign: {
              include: {
                Donation: {
                  include: {
                    donor: {
                      select: {
                        id: true,
                        fullname: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          // Remove take and skip to fetch all records
        }),
        db.fundraisingCampaign.findMany({
          include: {
            fundraiser: {
              include: {
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    mobile: true,
                    city: true,
                    state: true,
                  },
                },
              },
            },
            Donation: {
              include: {
                donor: {
                  select: {
                    id: true,
                    fullname: true,
                    email: true,
                    mobile: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          // Remove take and skip to fetch all records
        }),
        db.donation.findMany({
          include: {
            donor: {
              select: {
                id: true,
                fullname: true,
                email: true,
                mobile: true,
                city: true,
                pincode: true,
              },
            },
            campaign: {
              select: {
                id: true,
                fundraisertitle: true,
                description: true,
                healthissue: true,
                goalamount: true,
                recievedamount: true,
                status: true,
                assignmentStatus: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          // Remove take and skip to fetch all records
        }),
        db.donor.findMany({
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            Donation: {
              include: {
                campaign: {
                  select: {
                    id: true,
                    fundraisertitle: true,
                    healthissue: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          // Remove take and skip to fetch all records
        }),
        db.patient.findMany({
          include: {
            fundraiser: {
              include: {
                fundraisingCampaign: {
                  select: {
                    id: true,
                    fundraisertitle: true,
                    goalamount: true,
                    recievedamount: true,
                    status: true,
                  },
                },
              },
            },
            donar: {
              select: {
                id: true,
                fullname: true,
                email: true,
              },
            },
            familymembers: true,
            medicalhistory: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          // Remove take and skip to fetch all records
        }),
      ]);

    return {
      fundraisers: fundraisers || [],
      campaigns: campaigns || [],
      donations: donations || [],
      donors: donors || [],
      patients: patients || [],
    };
  } catch (error) {
    console.error("Error fetching Aarogyadhan data:", error);
    return {
      fundraisers: [],
      campaigns: [],
      donations: [],
      donors: [],
      patients: [],
    };
  }
}

export default async function SuperAdminDashboard() {
  const data = await fetchAarogyadhanData();
  const photographers = await db.photographer.findMany({
    select: { id: true, fullname: true, mobile: true, city: true },
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
      <HeadingClientMain main={"Aarogyadhan"} sub={"Campaigns"} />
      <div className="md:container mx-auto md:p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardTabs data={data} photographers={photographers} />
        </Suspense>
      </div>
      </div>
    </div>
  );
}

const DashboardTabs = React.memo(({ data, photographers }) => {
  return (
    <Tabs defaultValue="overview" className="space-y-2">
      <TabsList className="flex justify-center items-center gap-5 flex-wrap">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Data Overview
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <AarogyadhanDataDisplay data={data} photographers={photographers} />
      </TabsContent>

      <TabsContent value="analytics">
        <AarogyadhanGraph data={data} />
      </TabsContent>
    </Tabs>
  );
});

DashboardTabs.displayName = "DashboardTabs";
