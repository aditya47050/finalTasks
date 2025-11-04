"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Tag, PackageOpen, AlertCircle } from "lucide-react";
import Image from "next/image";
import AddProductDialog from "./products-add";

export default function ProductsList({ pharmacyId, products = [], approval, approved }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");

  const filtered = useMemo(() => {
    if (!searchTerm) return products;
    const q = searchTerm.toLowerCase();
    return products.filter((p) =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.manufacturer || "").toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [searchTerm, products]);

  const ApprovalNotice = !approved ? (
    <div className="border rounded-xl p-4 bg-yellow-50 text-yellow-900 flex gap-3 items-start">
      <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="space-y-1">
        <div className="font-semibold">Product addition is currently disabled</div>
        <div className="text-sm">
          Approval status: <span className="font-medium">{approval?.approvalStatus || "PENDING"}</span>
          {approval?.remarks ? <> • Reason: {approval.remarks}</> : null}
        </div>
        <div className="text-sm">Please get your pharmacy approved to add products. Sorry for the inconvenience.</div>
      </div>
    </div>
  ) : null;

  return (
    <div className="mx-auto space-y-6 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full h-10 border rounded-md px-3"
          />
        </div>

        <div className="flex gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}>Grid</Button>
          <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>List</Button>
        </div>

        <AddProductDialog pharmacyId={pharmacyId} disabled={!approved} />
      </div>

      {ApprovalNotice}

      {filtered.length ? (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  {p.productImage ? (
                    <Image src={p.productImage} width={56} height={56} alt={p.name} className="rounded-lg object-cover border" />
                  ) : (
                    <PackageOpen className="w-12 h-12 rounded-lg border p-2" />
                  )}
                  <div>
                    <div className="text-base font-semibold">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.brand || "—"} • {p.category || "—"}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground space-y-1">
                  <div>Manufacturer: {p.manufacturer || "—"}</div>
                  <div>Price: ₹{p.price?.toFixed?.(2) ?? p.price}</div>
                  {p.discountPercent ? <div>Discount: {p.discountPercent}%</div> : null}
                  <div>Stock: {p.stock}</div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="h-4 w-4" />
                    <span className="truncate">{(p.tags || []).join(", ") || "No tags"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {p.productImage ? (
                    <Image src={p.productImage} width={40} height={40} alt={p.name} className="rounded-lg object-cover border" />
                  ) : (
                    <PackageOpen className="w-10 h-10 rounded-lg border p-2" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.brand || "—"} • {p.category || "—"}</div>
                    <div className="text-xs">Price: ₹{p.price?.toFixed?.(2) ?? p.price} • Stock: {p.stock}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{p.prescriptionRequired ? "Rx Required" : "OTC"}</div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No products added</h3>
          <p className="text-muted-foreground text-center mb-4">Use the Add Product button to create one.</p>
        </div>
      )}
    </div>
  );
}