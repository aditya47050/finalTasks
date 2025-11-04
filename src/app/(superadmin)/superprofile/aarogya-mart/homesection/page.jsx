"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Radix Dialog
import { toast } from "react-hot-toast";
import { UploadButton } from "@uploadthing/react";
import HomeSection from './../components/HomeSection';
const positionOptions = [
  { value: 0, label: "Before CategoryGrid" },
  { value: 1, label: "After CategoryGrid" },
  { value: 2, label: "After ProductGrid" },
];

export default function HomeSectionAdmin() {
  const [sections, setSections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null); // <-- State for preview modal

  const [title, setTitle] = useState("");
  const [type, setType] = useState("category");
  const [row, setRow] = useState(1);
  const [column, setColumn] = useState(4);
  const [position, setPosition] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState("");

  const [availableItems, setAvailableItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchSections = async () => {
    try {
      const res = await axios.get("/api/aarogyamart/superadmin/home-section/get");
      setSections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = async (type) => {
    try {
      const res = await axios.get(`/api/aarogyamart/superadmin/home-section?type=${type}`);
      setAvailableItems(res.data.data);
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchItems(type);
  }, [type]);

  const openModal = (section = null) => {
    setEditing(section);
    if (section) {
      setTitle(section.title);
      setType(section.type);
      setRow(section.row);
      setColumn(section.column);
      setPosition(section.position);
      setSelectedItems(section.filterIds || []);
      setBackgroundImage(section.backgroundImage || "");
    } else {
      setTitle("");
      setType("category");
      setRow(1);
      setColumn(4);
      setPosition(0);
      setSelectedItems([]);
      setBackgroundImage("");
    }
    setShowModal(true);
  };

  const handleItemToggle = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((i) => i !== id));
    } else {
      if (selectedItems.length < row * column) {
        setSelectedItems((prev) => [...prev, id]);
      } else {
        toast.error(`Maximum ${row * column} items allowed`);
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("row", row.toString());
    formData.append("column", column.toString());
    formData.append("position", position.toString());
    formData.append("backgroundImage", backgroundImage);

    // Append selectedItems array
    selectedItems.forEach((id) => formData.append("filterIds[]", id));

    if (editing) {
      await axios.put(
        `/api/aarogyamart/superadmin/home-section/${editing.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Section updated successfully");
    } else {
      await axios.post(
        "/api/aarogyamart/superadmin/home-section/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Section added successfully");
    }

    fetchSections();
    setShowModal(false);
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  }
};


  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await axios.delete(`/api/aarogyamart/superadmin/home-section/${id}`);
      toast.success("Section deleted");
      fetchSections();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-500 text-center mb-6">
        Homepage Sections
      </h1>

      <div className="flex justify-end mb-4">
        <Button
          className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl"
          onClick={() => openModal()}
        >
          Add Section
        </Button>
      </div>

      {/* Table */}
      <table className="table-auto w-full mt-4 bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th>Type</th>
            <th>Rows x Columns</th>
            <th>Position</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((sec) => (
            <tr key={sec.id} className="border-b">
              <td className="px-4 py-2">{sec.title}</td>
              <td>{sec.type}</td>
              <td>{sec.row} x {sec.column}</td>
              <td>{positionOptions.find(p => p.value === sec.position)?.label || sec.position}</td>
              <td>{sec.filterIds?.length || 0}</td>
              <td className="flex gap-2">
                <Button size="sm" onClick={() => openModal(sec)}>Edit</Button>
                <Button size="sm" className="bg-red-500" onClick={() => handleDelete(sec.id)}>Delete</Button>
                <Button size="sm" className="bg-green-500" onClick={() => setViewing(sec)}>View</Button> {/* <-- View button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl h-[80vh] w-full">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit" : "Add"} Section</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <Select onValueChange={(val) => setType(val)} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="discount">Discount Product</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Rows"
                  value={row}
                  onChange={(e) => setRow(parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max items to select: {row * column}
                </p>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Columns"
                  value={column}
                  onChange={(e) => setColumn(parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max items to select: {row * column}
                </p>
              </div>
              <div className="flex-1">
                <Select value={position} onValueChange={(val) => setPosition(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl cursor-pointer flex items-center justify-between">
                    <span className="text-gray-600">
                    {backgroundImage ? "Uploaded" : "Upload Background"}
                    </span>

                    <UploadButton
                    endpoint="fileUploader"
                    content={{
                        button({ ready }) {
                        return <div>{ready && <div>Upload</div>}</div>;
                        },
                        allowedContent: () => "",
                    }}
                    appearance={{
                        button: "w-auto bg-transparent text-xs text-white font-bold rounded-xl",
                        container: "rounded-xl h-8 px-4 border w-auto py-1 bg-[#243460]",
                        allowedContent: "hidden",
                    }}
                    onClientUploadComplete={(res) => {
                        if (res.length > 0) {
                        setBackgroundImage(res[0].url); // ✅ update backgroundImage state
                        toast.success("Upload Completed");
                        }
                    }}
                    onUploadError={(error) => {
                        toast.error(`ERROR! ${error.message}`);
                    }}
                    />
                </label>

                {/* Preview */}
                {backgroundImage && (
                    <img
                    src={backgroundImage}
                    alt="Preview"
                    className="w-32 h-32 rounded-md object-cover border mt-2"
                    />
                )}
            </div>


            {/* Dynamic Item Selection */}
            <div className="max-h-64 overflow-y-auto border p-2 rounded bg-gray-50 grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-1 cursor-pointer border rounded flex items-center gap-2 ${
                    selectedItems.includes(item.id) ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleItemToggle(item.id)}
                >
                  <input type="checkbox" checked={selectedItems.includes(item.id)} readOnly />
                  <span>
                    {type === "category" || type === "brand"
                      ? item.name
                      : `${item.name} (${item.discount ? item.discount + "% OFF" : ""})`}
                  </span>
                </div>
              ))}
            </div>

            <Button type="submit" className="bg-blue-500 text-white mt-2">
              {editing ? "Update" : "Add"} Section
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* View Modal */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-4xl h-[80vh] w-full overflow-y-auto">
          {viewing && (
            <HomeSection
              title={viewing.title}
              type={viewing.type}
              row={viewing.row}
              column={viewing.column}
              backgroundImage={viewing.backgroundImage}
              filterIds={viewing.filterIds}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
