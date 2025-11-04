"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from './../components/CategoryForm';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/aarogyamart/categories");
    const j = await res.json();
    setCategories(j);
  }

  function handleAdd() {
    setEditingId(null);
    setOpen(true);
  }

  function handleEdit(id) {
    setEditingId(id);
    setOpen(true);
  }

  return (
    <div className="container my-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-500">Categories</h2>
        <Button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl"
        >
          Add Category
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white animate-fadeIn">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 hover:bg-gray-100">
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                Name
              </th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                Description
              </th>
              <th className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr
                key={cat.id}
                className={`transition-colors duration-150 ease-in-out
                  hover:bg-gray-50/50 
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                  border-[1px] border-gray-100`}
              >
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">
                  {cat.name}
                </td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">
                  {cat.description || "—"}
                </td>
                <td className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(cat.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-xl"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Dialog for Add/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-500">
              {editingId ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            id={editingId}
            onSuccess={() => {
              setOpen(false);
              fetchCategories(); // refresh after add/edit
            }}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
