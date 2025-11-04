"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Camera,
  Calendar,
  Target,
  ImageIcon,
  Upload,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import UploadDialog from "./uploadimages-videos";

const Casesphotographer = ({ fundraisingCampaign }) => {
  const [campaigns, setCampaigns] = useState(fundraisingCampaign || []);
  const [loadingStates, setLoadingStates] = useState({});

  const handleDecision = async (id, decision) => {
    setLoadingStates((prev) => ({ ...prev, [id]: decision }));

    try {
      const res = await fetch("/api/aarogyadhan/photographer/self-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, decision }),
      });

      if (res.ok) {
        toast.success(`Campaign ${decision.toLowerCase()} successfully`);
        setCampaigns((prev) =>
          decision === "REJECTED"
            ? prev.filter((c) => c.id !== id)
            : prev.map((c) =>
                c.id === id ? { ...c, photographerDecision: "ACCEPTED" } : c
              )
        );
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update campaign.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: null }));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAssignmentStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-orange-100 text-orange-800 border-orange-200";
    }
  };

  const calculateProgress = (received, goal) => {
    return Math.min((received / goal) * 100, 100);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="w-full">
      <Card className="rounded-2xl border-0 bg-gradient-to-br from-white to-slate-50 ">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            Assigned Campaigns
            {campaigns.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {campaigns.length} Campaign
                {campaigns.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.map((campaign) => {
                const progress = calculateProgress(
                  campaign.recievedamount,
                  campaign.goalamount
                );
                const isLoading = loadingStates[campaign.id];

                return (
                  <Card
                    key={campaign.id}
                    className="group hover:shadow-xl shadow-md transition-all duration-300 border-0 bg-white rounded-xl overflow-hidden hover:-translate-y-1"
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/aarogyadhan/photographer/campaigns/${campaign.id}`}
                          className="flex-1"
                        >
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                            {campaign.fundraisertitle}
                          </h3>
                        </Link>
                        <div className="flex flex-col gap-2 ml-3">
                          <Badge
                            className={`${getStatusColor(
                              campaign.status
                            )} font-medium`}
                            variant="outline"
                          >
                            {campaign.status}
                          </Badge>
                          {campaign.assignmentStatus && (
                            <Badge
                              className={`${getAssignmentStatusBadge(
                                campaign.assignmentStatus
                              )} font-medium text-xs`}
                              variant="outline"
                            >
                              {campaign.assignmentStatus}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Progress & Goal */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Goal: {formatCurrency(campaign.goalamount)}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            Raised:{" "}
                            {formatCurrency(campaign.recievedamount || 0)}
                          </span>
                        </div>

                        {campaign.goalamount && campaign.recievedamount && (
                          <Progress
                            value={progress}
                            className="h-2 bg-gray-100"
                          />
                        )}
                      </div>

                      {/* Dates */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created:{" "}
                          {new Date(campaign.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div>
                          Updated:{" "}
                          {new Date(campaign.updatedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4"> 
                        {campaign.photographerDecision === "ACCEPTED" ? (
                          <UploadDialog campaignId={campaign.id} />
                        ) : campaign.photographerDecision === "REJECTED" ? (
                          <div className="text-center py-2">
                            <Badge variant="destructive" className="px-4 py-2">
                              <X className="h-4 w-4 mr-1" />
                              Campaign Rejected
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              disabled={isLoading}
                              className="flex-1 border-2 border-green-500 text-green-700 hover:bg-green-50 hover:border-green-600 font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 bg-transparent"
                              onClick={() =>
                                handleDecision(campaign.id, "ACCEPTED")
                              }
                            >
                              {isLoading === "ACCEPTED" ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4 mr-2" />
                              )}
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              disabled={isLoading}
                              className="flex-1 border-2 border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 bg-transparent"
                              onClick={() =>
                                handleDecision(campaign.id, "REJECTED")
                              }
                            >
                              {isLoading === "REJECTED" ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <X className="h-4 w-4 mr-2" />
                              )}
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No campaigns assigned yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You {"haven't"} been assigned to any fundraising campaigns.
                Check back later or contact your administrator.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Casesphotographer;