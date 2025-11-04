"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import AddPharmacistDialog from "./pharmacists-add";

export default function PharmacistsList({ pharmacyId, pharmacists = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  const filtered = useMemo(() => {
    if (!searchTerm) return pharmacists;
    const q = searchTerm.toLowerCase();
    return pharmacists.filter((p) =>
      (p.fullname || "").toLowerCase().includes(q) ||
      (p.regno || "").toLowerCase().includes(q) ||
      (p.panno || "").toLowerCase().includes(q)
    );
  }, [searchTerm, pharmacists]);

  return (
    <div className="mx-auto space-y-6 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search pharmacists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full h-10 border rounded-md px-3"
          />
        </div>

        <div className="flex gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}>Grid</Button>
          <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>List</Button>
        </div>

        <AddPharmacistDialog pharmacyId={pharmacyId} />
      </div>

      {filtered.length ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  {p.profilepic ? (
                    <Image src={p.profilepic} width={48} height={48} alt={p.fullname || "Pharmacist"} className="rounded-full object-cover border" />
                  ) : (
                    <User className="w-12 h-12 rounded-full border p-2" />
                  )}
                  <div>
                    <div className="text-base font-semibold">{p.fullname || "Unnamed"}</div>
                    <div className="text-xs text-gray-500">Reg No: {p.regno || "N/A"}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> PAN: {p.panno || "N/A"}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> Aadhar: {p.aadharno || "N/A"}</div>
                  <div>Gender: {p.gender || "N/A"}</div>
                  <div>Reg Date: {p.regdate ? new Date(p.regdate).toLocaleDateString() : "N/A"}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {p.profilepic ? (
                    <Image src={p.profilepic} width={40} height={40} alt={p.fullname || "Pharmacist"} className="rounded-full object-cover border" />
                  ) : (
                    <User className="w-10 h-10 rounded-full border p-2" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{p.fullname || "Unnamed"}</div>
                    <div className="text-xs text-gray-500">Reg No: {p.regno || "N/A"}</div>
                    <div className="text-xs">PAN: {p.panno || "N/A"} • Aadhar: {p.aadharno || "N/A"}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Reg Date: {p.regdate ? new Date(p.regdate).toLocaleDateString() : "N/A"}</div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No pharmacists added</h3>
          <p className="text-muted-foreground text-center mb-4">Use the Add Pharmacist button to create one.</p>
        </div>
      )}
    </div>
  );
}


