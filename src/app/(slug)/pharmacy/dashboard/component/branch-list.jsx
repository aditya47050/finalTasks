"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Building2 } from "lucide-react";
import AddBranchDialog from "../component/branch-add";

export default function BranchList({ pharmacyId, branches, states, districts, subDistricts }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  const filtered = useMemo(() => {
    if (!searchTerm) return branches;
    const q = searchTerm.toLowerCase();
    return branches.filter(
      (b) =>
        (b.regname || "").toLowerCase().includes(q) ||
        (b.regno || "").toLowerCase().includes(q) ||
        (b.city || "").toLowerCase().includes(q)
    );
  }, [searchTerm, branches]);

  return (
    <div className="mx-auto space-y-6 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full h-10 border rounded-md px-3"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
          >
            Grid
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            List
          </Button>
        </div>

        <AddBranchDialog 
  pharmacyId={pharmacyId} 
  states={states}
  districts={districts}
  subDistricts={subDistricts}
/>
      </div>

      {filtered.length ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-xl hover:shadow-md space-y-2"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-10 h-10 text-blue-600" />
                  <div>
                    <div className="text-base font-semibold">
                      {b.regname || "Branch"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Reg No: {b.regno || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📍 {b.address || "No address"}</div>
                  <div>
                    {b.city}, {b.state} {b.pincode}
                  </div>
                  <div>Manager: {b.branchmanagername || "N/A"}</div>
                  <div>☎ {b.receptionno1 || "N/A"}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-xl flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{b.regname || "Branch"}</div>
                  <div className="text-xs text-gray-500">
                    {b.city}, {b.state}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Manager: {b.branchmanagername || "N/A"}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No branches added</h3>
          <p className="text-muted-foreground text-center mb-4">
            Use the Add Branch button to create one.
          </p>
        </div>
      )}
    </div>
  );
}
