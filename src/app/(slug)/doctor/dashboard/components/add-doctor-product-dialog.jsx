"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function AddDoctorProductDialog({ doctor, pharmacies, onProductAdd }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState({});
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    composition: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: null,
    manufacturingDate: null,
    price: "",
    discountPercent: "",
    stock: "",
    unit: "",
    prescriptionRequired: false,
    productImage: "",
    tags: "",
    pharmacyId: "",
  });

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const setUploadBusy = (key, v) => setUploadLoading((prev) => ({ ...prev, [key]: v }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name) return toast.error("Enter product name");
    if (!form.price || isNaN(Number(form.price))) return toast.error("Enter valid price");
    if (!form.stock || isNaN(Number(form.stock))) return toast.error("Enter valid stock");
    if (!form.pharmacyId) return toast.error("Select a pharmacy");

    try {
      setLoading(true);
      const payload = {
        ...form,
        price: Number(form.price),
        discountPercent: form.discountPercent === "" ? null : Number(form.discountPercent),
        stock: Number(form.stock),
        expiryDate: form.expiryDate ? form.expiryDate.toISOString() : null,
        manufacturingDate: form.manufacturingDate ? form.manufacturingDate.toISOString() : null,
        tags: (form.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
        doctorId: doctor.id,
      };

      const res = await fetch("/api/doctor/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          msg = j?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const newProduct = await res.json();
      toast.success("Product added successfully");
      onProductAdd(newProduct);
      setOpen(false);
      setForm({
        name: "",
        brand: "",
        category: "",
        description: "",
        composition: "",
        manufacturer: "",
        batchNumber: "",
        expiryDate: null,
        manufacturingDate: null,
        price: "",
        discountPercent: "",
        stock: "",
        unit: "",
        prescriptionRequired: false,
        productImage: "",
        tags: "",
        pharmacyId: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Custom Product</DialogTitle>
          <DialogDescription>
            Add a product that will be linked to a pharmacy for your prescriptions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-6">
          {/* Pharmacy Selection */}
          <div>
            <label className="text-gray-900 font-semibold">Select Pharmacy*</label>
            <select
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1"
              value={form.pharmacyId}
              onChange={(e) => setField("pharmacyId", e.target.value)}
              required
            >
              <option value="">Choose a pharmacy</option>
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.regname} ({pharmacy.products.length} products)
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-900 font-semibold">Name*</label>
              <input
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Product name"
                required
              />
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Brand</label>
              <input
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1"
                value={form.brand}
                onChange={(e) => setField("brand", e.target.value)}
                placeholder="Brand"
              />
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Category</label>
              <select
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Tablets">Tablets</option>
                <option value="Syrups">Syrups</option>
                <option value="OTC">OTC</option>
                <option value="Personal Care">Personal Care</option>
              </select>
            </div>
          </div>

          {/* Rest of the form remains unchanged */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-900 font-semibold">Manufacturer</label>
              <input 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.manufacturer} 
                onChange={(e) => setField("manufacturer", e.target.value)} 
                placeholder="Manufacturer" 
              />
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Batch Number</label>
              <input 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.batchNumber} 
                onChange={(e) => setField("batchNumber", e.target.value)} 
                placeholder="Batch No" 
              />
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Unit</label>
              <input 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.unit} 
                onChange={(e) => setField("unit", e.target.value)} 
                placeholder='e.g. "Strip of 10"' 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-900 font-semibold">Price*</label>
              <input 
                type="number" 
                step="0.01" 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.price} 
                onChange={(e) => setField("price", e.target.value)} 
                placeholder="Price" 
                required
              />
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Discount %</label>
              <input 
                type="number" 
                step="0.01" 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.discountPercent} 
                onChange={(e) => setField("discountPercent", e.target.value)} 
                placeholder="Discount percent" 
              />
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Stock*</label>
              <input 
                type="number" 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.stock} 
                onChange={(e) => setField("stock", e.target.value)} 
                placeholder="Stock quantity" 
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-900 font-semibold">Manufacturing Date</label>
              <DatePicker 
                selected={form.manufacturingDate} 
                onChange={(d) => setField("manufacturingDate", d)} 
                dateFormat="dd/MM/yyyy" 
                maxDate={new Date()} 
                showYearDropdown 
                showMonthDropdown 
                placeholderText="DD/MM/YYYY" 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
              />
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Expiry Date</label>
              <DatePicker 
                selected={form.expiryDate} 
                onChange={(d) => setField("expiryDate", d)} 
                dateFormat="dd/MM/yyyy" 
                showYearDropdown 
                showMonthDropdown 
                placeholderText="DD/MM/YYYY" 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-900 font-semibold">Prescription Required</label>
              <select 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.prescriptionRequired ? "yes" : "no"} 
                onChange={(e) => setField("prescriptionRequired", e.target.value === "yes")}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="text-gray-900 font-semibold">Tags</label>
              <input 
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl mt-1" 
                value={form.tags} 
                onChange={(e) => setField("tags", e.target.value)} 
                placeholder="Comma separated e.g. painkiller, paracetamol" 
              />
            </div>
          </div>

          <div>
            <label className="text-gray-900 font-semibold">Description</label>
            <textarea 
              className="w-full min-h-24 px-4 py-3 border-2 border-gray-200 rounded-xl mt-1" 
              value={form.description} 
              onChange={(e) => setField("description", e.target.value)} 
              placeholder="Product description" 
            />
          </div>

          <div>
            <label className="text-gray-900 font-semibold">Composition</label>
            <textarea 
              className="w-full min-h-24 px-4 py-3 border-2 border-gray-200 rounded-xl mt-1" 
              value={form.composition} 
              onChange={(e) => setField("composition", e.target.value)} 
              placeholder="Active ingredients" 
            />
          </div>

          <div>
            <label className="text-gray-900 font-semibold">Product Image</label>
            <div className="flex items-center gap-3 mt-2">
              <UploadButton
                endpoint="fileUploader"
                content={{
                  button({ ready }) {
                    return <div>{uploadLoading.productImage ? <Loader2 className="animate-spin w-4 h-4" /> : (ready && <div>Upload Image</div>)}</div>;
                  },
                  allowedContent: () => "",
                }}
                appearance={{ button: "w-auto bg-blue-600 text-white text-xs font-bold rounded-xl px-3 py-2", container: "rounded-xl" }}
                onUploadBegin={() => setUploadBusy("productImage", true)}
                onClientUploadComplete={(res) => { setUploadBusy("productImage", false); if (res?.length) { setField("productImage", res[0].url); toast.success("Image uploaded"); } }}
                onUploadError={(err) => { setUploadBusy("productImage", false); toast.error(err.message); }}
              />
              <div className="w-20 h-20 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                {form.productImage ? <img src={form.productImage} alt="product" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Image</span>}
              </div>
            </div>
          </div>

          <div className="!mt-6 text-center">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              {loading ? "Adding Product..." : "Add Custom Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}