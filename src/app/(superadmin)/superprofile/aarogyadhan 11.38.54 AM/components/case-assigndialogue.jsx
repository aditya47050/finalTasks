"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { Check } from "lucide-react"; // ✅ For checkmark icon
const AssignPhotographerDialog = ({ campaignId, photographers, onAssign }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhotographerId, setSelectedPhotographerId] = useState("");

  // Filter photographers by name or city
  const filtered = useMemo(() => {
    return photographers.filter((p) => {
      const q = searchTerm.toLowerCase();
      return (
        p.fullname.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, photographers]);

  const handleAssign = async () => {
    if (!selectedPhotographerId) {
      toast.error("Please select a photographer");
      return;
    }
    try {
      await onAssign(campaignId, selectedPhotographerId);
      toast.success("📸 Photographer assigned!");
      setOpen(false);
      setSelectedPhotographerId("");
      setSearchTerm("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign. Try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="bg-white">
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
        >
          Assign Case
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Assign Photographer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute top-3 left-3 text-gray-400" />
            <Input
              placeholder="Search name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-60 overflow-y-auto border rounded-md">
            {filtered.length ? (
              filtered.map((p) => {
                const isSelected = p.id === selectedPhotographerId;
                return (
                  <Button
                    key={p.id}
                    variant="ghost"
                    className={`w-full justify-between items-center rounded-none px-4 py-2 text-left ${
                      isSelected
                        ? "bg-indigo-100 font-semibold text-indigo-700"
                        : ""
                    }`}
                    onClick={() => setSelectedPhotographerId(p.id)}
                  >
                    <span>
                      {p.fullname} — {p.city || "Unknown"}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-green-600" />}
                  </Button>
                );
              })
            ) : (
              <p className="p-4 text-gray-500">No photographers found.</p>
            )}
          </div>

          <Button
            onClick={handleAssign}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignPhotographerDialog;
