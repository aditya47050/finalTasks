"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaDochub, FaIndianRupeeSign } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { HiDocument } from "react-icons/hi2";

const DonorSingleView = ({ donorData }) => {
  if (!donorData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">
            No data available
          </h3>
          <p className="text-sm text-muted-foreground">
            The requested information could not be loaded.
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
                    <AvatarFallback className="text-lg">
                      {donorData.fullname?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {donorData.fullname}
                  </h1>
                  <Badge className="text-gray-600 bg-gray-50 border-white/30">
                    Donor
                  </Badge>
                </div>
                <p className="text-blue-100 mb-4">
                  {donorData.email || "No email available"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donor Details */}
      <Card className="rounded-xl shadow-lg">
        <CardContent className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile</p>
              <p className="text-sm">{donorData.mobile}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">City</p>
              <p className="text-sm">{donorData.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pincode</p>
              <p className="text-sm">{donorData.pincode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">PAN Card No :</p>
              <p className="text-sm font-mono">
                {donorData.pancardno || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Aadhar Card No:</p>
              <p className="text-sm font-mono">
                {donorData.aadharcardno || "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      {donorData.Donation && donorData.Donation.length > 0 && (
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaIndianRupeeSign className="h-5 w-5" />
              Recent Donations ({donorData.Donation.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {donorData.Donation.map((donation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border"
                >
                  <div>
                    <Link
                      href={`/superprofile/aarogyadhan/${donation.campaign?.id}`}
                    >
                      <p className="text-sm font-medium">
                        {donation.campaign?.fundraisertitle ||
                          "No Campaign Title"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </Link>
                    <p className="text-xs text-gray-500">
                      Goal Amount: ₹{donation.campaign?.goalamount || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Received Amount: ₹
                      {donation.campaign?.recievedamount || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      ₹{Number.parseFloat(donation.amount).toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        donation.paymentStatus === "SUCCESS"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {donation.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Section */}
      <Card className="rounded-xl shadow-lg">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <HiDocument className="h-5 w-5"/>
      Documents
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">PAN Card Image</span>
          {donorData.pancardimage && (
            <a href={donorData.pancardimage} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-blue-500 rounded-xl text-white hover:bg-blue-700 hover:text-white">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </a>
          )}
        </div>
        {donorData.pancardimage ? (
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
          {donorData.aadharcardimage && (
            <a href={donorData.aadharcardimage} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-blue-500 rounded-xl text-white hover:bg-blue-700 hover:text-white">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </a>
          )}
        </div>
        {donorData.aadharcardimage ? (
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
    </div>
  );
};

export default DonorSingleView;