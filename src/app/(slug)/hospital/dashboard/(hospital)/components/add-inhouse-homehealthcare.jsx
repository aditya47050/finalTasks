"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "react-toastify";

export default function InhouseHomeHealthcareForm({
  hospitalId,
  allHomeHealthcareCenters,
}) {
  const [search, setSearch] = useState("");
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Filter home healthcare centers by name, email, or mobile
  const filteredCenters = allHomeHealthcareCenters.filter(
    (center) =>
      center.hspInfo?.regname?.toLowerCase().includes(search.toLowerCase()) ||
      center.email?.toLowerCase().includes(search.toLowerCase()) ||
      center.mobile?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckboxChange = (checked, id) => {
    setSelectedCenters((prev) =>
      checked ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCenters.length === 0) {
      toast.error("Please select at least one home healthcare center.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/hospital/${hospitalId}/inhouse-homehealthcare`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hospitalId, homeHealthcareCenters: selectedCenters }),
        }
      );

      if (!res.ok) throw new Error("Failed to link home healthcare centers");

      toast.success("Home healthcare centers linked successfully!");
      setSelectedCenters([]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-green-600 text-white rounded-[10px] hover:bg-green-700">
          Link Home Healthcare
        </Button>
      </DialogTrigger>

      <DialogContent className="xs:max-w-[90%] md:max-w-lg max-h-[75vh] bg-gradient-to-br from-white to-green-50 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#243460]">
            Link In-House Home Healthcare
          </DialogTitle>
          <DialogDescription className="text-center">
            Select home healthcare centers from the list below to link them with this hospital.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search */}
          <div>
            <Label className="text-[#243460] font-semibold">Search Home Healthcare Center</Label>
            <Input
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Centers List */}
          <div className="rounded p-2 max-h-60 overflow-y-auto border bg-white">
            {filteredCenters.length > 0 ? (
              filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className="flex items-center gap-4 p-2 border-b last:border-none"
                >
                  <Image
                    src={"/homehealthcare-icon.png"}
                    width={40}
                    height={40}
                    alt={center.hspInfo?.regname}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">
                      {center.hspInfo?.regname}
                    </span>
                    <span className="text-xs text-gray-500">
                      {center.email} | {center.mobile}
                    </span>
                  </div>

                  <Checkbox
                    id={center.id}
                    checked={selectedCenters.includes(center.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked, center.id)
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center p-4">
                No home healthcare centers found
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="!mt-6 text-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
            >
              {loading ? "Linking..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
