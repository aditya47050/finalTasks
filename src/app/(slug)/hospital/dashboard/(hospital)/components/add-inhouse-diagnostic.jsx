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

export default function InhouseDiagnosticForm({ hospitalId, allDiagnosticCenters }) {
  const [search, setSearch] = useState("");
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Filter diagnostic centers by name, email, or mobile
  const filteredCenters = allDiagnosticCenters.filter(
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
      toast.error("Please select at least one diagnostic center.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/hospital/${hospitalId}/inhouse-diagnostic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId, diagnosticCenters: selectedCenters }),
      });

      if (!res.ok) throw new Error("Failed to link diagnostic centers");

      toast.success("Diagnostic centers linked successfully!");
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
        <Button className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-600">
          Link Diagnostic Centers
        </Button>
      </DialogTrigger>

      <DialogContent className="xs:max-w-[90%] md:max-w-lg max-h-[75vh] bg-gradient-to-br from-white to-blue-50 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#243460]">
            Link In-House Diagnostic Centers
          </DialogTitle>
          <DialogDescription className="text-center">
            Select diagnostic centers from the list below to link them with this hospital.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search */}
          <div>
            <Label className="text-[#243460] font-semibold">Search Diagnostic Center</Label>
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
                    src={"/lab-icon.png"}
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
                No diagnostic centers found
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="!mt-6 text-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5271FF] hover:bg-[#405dff] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
            >
              {loading ? "Linking..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
