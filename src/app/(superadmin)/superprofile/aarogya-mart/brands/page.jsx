"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BrandForm from './../components/BrandForm';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  async function fetchBrands() {
    const res = await fetch("/api/aarogyamart/brands");
    const j = await res.json();
    if (j.success) setBrands(j.data);
  }

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="animate-fadeIn container my-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-500">Brands</h2>
        {/* <Button
          onClick={() => {
            setEditId(null);
            setOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl"
        >
          Add Brand
        </Button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 hover:bg-gray-100">
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Name</th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Image</th>
              {/* <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {brands.map((b,index) => (
              <tr key={b.id} className={`transition-colors duration-150 ease-in-out
                  hover:bg-gray-50/50 
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                  border-[1px] border-gray-100`}>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">{b.name}</td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">
                  {b.image ? (
                    <Image
                      width={300}
                      height={300}
                      src={b.image}
                      alt={b.name}
                      className="h-12 w-12 object-contain rounded-xl shadow-sm"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                {/* <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditId(b.id);
                      setOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl"
                  >
                    Edit
                  </Button>
                </td> */}
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-blue-500">
              {editId ? "Edit Brand" : "Add Brand"}
            </DialogTitle>
          </DialogHeader>
          <BrandForm
            id={editId}
            onSuccess={() => {
              fetchBrands();
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
