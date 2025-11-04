"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCamera, FaIndianRupeeSign } from "react-icons/fa6";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation"; // Ensure correct import
import { toast } from "react-toastify";
import Link from "next/link";

const PhotographerSingleView = ({ photographerData }) => {
  const [newStatus, setNewStatus] = useState(photographerData.status);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pathnametrue = pathname.startsWith("/superprofile");

  const handleStatusChange = async () => {
    setloading(true);
    try {
      const response = await fetch(
        "/api/aarogyadhan/photographer/approval-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photographerid: photographerData.id,
            newStatus,
            
          }),
        }
      );

      if (response.ok) {
        toast("Status updated successfully");
        setIsEditing(false); // Close the editing mode
        setloading(false);
        router.refresh();
      } else {
        toast("Failed to update status");
        setloading(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast("An error occurred while updating status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return CheckCircle;
      case "PENDING":
        return Clock;
      case "REJECTED":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  if (!photographerData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">
            No data available
          </h3>
          <p className="text-sm text-muted-foreground">
            Photographer information could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Avatar className="h-16 w-16">
                    {photographerData.passportphoto ? (
                      <AvatarImage
                        src={photographerData.passportphoto}
                        alt="Photographer Passport Photo"
                      />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {photographerData.fullname?.charAt(0) || "P"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {photographerData.fullname}
                  </h1>
                  <Badge className="text-gray-600 bg-gray-50 hover:bg-gray-50 border-white/30">
                    {photographerData.status}
                  </Badge>
                  {pathnametrue && (
                    <Pencil
                      className="h-4 w-4 cursor-pointer"
                      onClick={() => setIsEditing(!isEditing)}
                    />
                  )}
                  {isEditing && (
                    <div className="flex items-center gap-4 mt-4">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border text-black rounded-xl gap-2 px-3  py-1"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                      <Button
                        onClick={handleStatusChange}
                        className="bg-blue-500 text-white px-3 py-1 rounded-xl"
                      >
                        {loading ? "Updating" : "Update Status"}
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-blue-100 mb-4">
                  {photographerData.email || "No email available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photographer Details */}
      <Card className="rounded-xl shadow-lg">
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile</p>
              <p className="text-sm">{photographerData.mobile}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">City</p>
              <p className="text-sm">{photographerData.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pincode</p>
              <p className="text-sm">{photographerData.pincode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Taluka</p>
              <p className="text-sm">{photographerData.taluka}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">District</p>
              <p className="text-sm">{photographerData.district}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">State</p>
              <p className="text-sm">{photographerData.state}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Company Name</p>
              <p className="text-sm">{photographerData.companyname}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">PAN Card No</p>
              <p className="text-sm font-mono">
                {photographerData.pancardno || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Aadhar Card No
              </p>
              <p className="text-sm font-mono">
                {photographerData.aadharcardno || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Bank Name</p>
              <p className="text-sm">{photographerData.bankName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Account Number
              </p>
              <p className="text-sm font-mono">
                {photographerData.accountNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">IFSC Code</p>
              <p className="text-sm font-mono">
                {photographerData.ifscCode || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Account Type</p>
              <p className="text-sm">{photographerData.accountType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-sm">{photographerData.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaCamera className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">PAN Card Image</span>
                {photographerData.pancardimage && (
                  <a
                    href={photographerData.pancardimage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-blue-500 rounded-xl text-white hover:bg-blue-700 hover:text-white"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </a>
                )}
              </div>
              {photographerData.pancardimage ? (
                <div className="bg-green-50 p-2 rounded-xl text-xs text-green-700">
                  Document available
                </div>
              ) : (
                <div className="bg-gray-50 p-2 rounded-xl text-xs text-gray-500">
                  No document uploaded
                </div>
              )}
            </div>
            <div className="border rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Aadhar Card Image</span>
                {photographerData.aadharcardimage && (
                  <a
                    href={photographerData.aadharcardimage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-blue-500 rounded-xl text-white hover:bg-blue-700 hover:text-white"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </a>
                )}
              </div>
              {photographerData.aadharcardimage ? (
                <div className="bg-green-50 p-2 rounded-xl text-xs text-green-700">
                  Document available
                </div>
              ) : (
                <div className="bg-gray-50 p-2 rounded-xl text-xs text-gray-500">
                  No document uploaded
                </div>
              )}
            </div>
            <div className="border rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Cancelled Cheque</span>
                {photographerData.cancelledCheque && (
                  <a
                    href={photographerData.cancelledCheque}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-blue-500 rounded-xl text-white hover:bg-blue-700 hover:text-white"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </a>
                )}
              </div>
              {photographerData.cancelledCheque ? (
                <div className="bg-green-50 p-2 rounded-xl text-xs text-green-700">
                  Document available
                </div>
              ) : (
                <div className="bg-gray-50 p-2 rounded-xl text-xs text-gray-500">
                  No document uploaded
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Section */}
      {pathnametrue && (
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaCamera className="h-5 w-5" />
              Assigned Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {photographerData.fundraisingCampaign &&
            photographerData.fundraisingCampaign.length > 0 ? (
              <div className="space-y-4">
                {photographerData.fundraisingCampaign.map((campaign) => (
                  <div key={campaign.id} className="border rounded-xl p-4">
                    <Link href={`/superprofile/aarogyadhan/${campaign.id}`}>
                      {" "}
                      <h3 className="text-lg font-semibold">
                        {campaign.fundraisertitle}
                      </h3>
                    </Link>
                    <p className="text-sm">
                      Goal Amount: ₹{campaign.goalamount}
                    </p>
                    <p className="text-sm">
                      Received Amount: ₹{campaign.recievedamount}
                    </p>
                    <p className="text-sm">Status: {campaign.status}</p>
                    <p className="text-sm">
                      Created At:{" "}
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Updated At:{" "}
                      {new Date(campaign.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No campaigns assigned.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotographerSingleView;
