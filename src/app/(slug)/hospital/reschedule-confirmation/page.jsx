"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Calendar, Clock } from "lucide-react";

export default function RescheduleConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RescheduleConfirmationContent />
    </Suspense>
  );
}

function RescheduleConfirmationContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [bookingDetails, setBookingDetails] = useState({});

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    const patientId = searchParams.get("patientId");
    const serviceId = searchParams.get("serviceId");
    const preferredDate = searchParams.get("preferredDate");
    const preferredTimeSlot = searchParams.get("preferredTimeSlot");
    const hospitalid = searchParams.get("hospitalid");

    setBookingDetails({
      bookingId,
      patientId,
      serviceId,
      preferredDate,
      preferredTimeSlot,
      hospitalid,
    });

    if (!bookingId || !preferredDate || !preferredTimeSlot) {
      setStatus("error");
      setMessage("Missing required parameters for rescheduling.");
      return;
    }

    const updateBooking = async () => {
      try {
        const res = await fetch(
          `/api/hospital/${hospitalid}/surgery-treatment/book-services/reschedule`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId,
              patientId,
              serviceId,
              preferredDate,
              preferredTimeSlot,
            }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Your appointment has been successfully rescheduled.");
        } else {
          setStatus("error");
          setMessage(
            data?.message || "Something went wrong during rescheduling."
          );
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message ||
            "A network error occurred while trying to reschedule."
        );
      }
    };
    updateBooking();
  }, [searchParams]);

  const DetailItem = ({ Icon, label, value }) => {
    if (!value) return null;
    return (
      <p className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-500" />
        <strong>{label}:</strong> {value}
      </p>
    );
  };

  const cardClasses = "rounded-xl shadow-md border border-blue-100";
  const headerClasses = "bg-blue-500 text-white py-6";
  const buttonClasses = "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card
        className={`w-full max-w-md mx-auto overflow-hidden ${cardClasses}`}
      >
        <CardHeader className={`text-center ${headerClasses}`}>
          <CardTitle className="text-3xl font-bold">
            Reschedule Confirmation
          </CardTitle>
          <CardDescription className="text-white/80 mt-2">
            {status === "loading" && "Processing your request..."}
            {status === "success" &&
              "Your appointment details have been updated."}
            {status === "error" && "There was an issue with your request."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="text-lg text-gray-700">
                Processing your reschedule request...
              </p>
            </div>
          )}

          {status === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-700 font-semibold">
                Success!
              </AlertTitle>
              <AlertDescription className="text-green-800">
                {message}
                <div className="mt-4 space-y-2 text-left text-gray-700">
                  <DetailItem
                    Icon={Calendar}
                    label="New Date"
                    value={bookingDetails.preferredDate}
                  />
                  <DetailItem
                    Icon={Clock}
                    label="New Time"
                    value={bookingDetails.preferredTimeSlot}
                  />
                </div>
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="bg-red-50 border-red-200 text-red-800">
              <XCircle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-700 font-semibold">
                Error!
              </AlertTitle>
              <AlertDescription className="text-red-800">
                {message}
                <p className="mt-2 text-sm">
                  Please try again or contact support if the issue persists.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <div className="p-6 pt-0 flex justify-center">
          <Button asChild className={`w-full ${buttonClasses}`}>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
