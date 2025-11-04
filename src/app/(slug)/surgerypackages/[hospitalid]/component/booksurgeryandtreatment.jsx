"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import HeadingClientMain from "@/app/components/heading";

const BookSurgeryTreatmentclient = ({
  open,
  onOpenChange,
  patientId,
  hospitalid,
  serviceId,
  hspRole
}) => {
  const [preferredDate, setPreferredDate] = useState(null);
  const [preferredTime, setPreferredTime] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!preferredDate || !preferredTime) {
      toast.error("Please select date and time.");
      return;
    }

    try {
      setLoading(true);

      const formattedDate =
        preferredDate.getFullYear() +
        "-" +
        String(preferredDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(preferredDate.getDate()).padStart(2, "0");

      const formattedTime = preferredTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const res = await fetch(
        `/api/hospital/${hospitalid}/surgery-treatment/book-services`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId,
            serviceId,
            preferredDate: formattedDate,
            preferredTimeSlot: formattedTime,
            notes,
            hspRole
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Booking submitted successfully!");
        onOpenChange(false);
        setPreferredDate(null);
        setPreferredTime(null);
        setNotes("");
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error during booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white p-6 rounded-xl shadow-xl">
        <DialogHeader className="text-center pb-4">
          <HeadingClientMain main={"  Book Service"} />
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Picker */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Select Date *
            </Label>
            <DatePicker
              selected={preferredDate}
              onChange={(date) => setPreferredDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="!w-full px-4 py-2 border-[1px] border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholderText="Choose date"
            />
          </div>

          {/* Time Picker */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Select Time *
            </Label>
            <DatePicker
              selected={preferredTime}
              onChange={(time) => setPreferredTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="hh:mm aa"
              placeholderText="Select preferred time"
              className="w-full px-4 py-2 border-[1px] border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Notes Field */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              Notes / Instructions
            </Label>
            <Textarea
              rows={3}
              placeholder="Add any special instructions (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none placeholder:text-gray-400 font-poppins pl-4 !text-[16px] font-normal"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
          >
            {loading ? "Booking..." : "Submit Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default BookSurgeryTreatmentclient;
