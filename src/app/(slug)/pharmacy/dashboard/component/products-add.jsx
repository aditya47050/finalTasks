"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AddProductDialog({ pharmacyId, disabled }) {
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
    });

    const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
    const setUploadBusy = (key, v) => setUploadLoading((prev) => ({ ...prev, [key]: v }));

    const submit = async (e) => {
        e?.preventDefault?.();
        if (!form.name) return toast.error("Enter product name");
        if (!form.price || isNaN(Number(form.price))) return toast.error("Enter valid price");
        if (!form.stock || isNaN(Number(form.stock))) return toast.error("Enter valid stock");

        try {
            setLoading(true);
            const payload = {
                ...form,
                price: Number(form.price),
                discountPercent: form.discountPercent === "" ? null : Number(form.discountPercent),
                stock: Number(form.stock),
                expiryDate: form.expiryDate ? form.expiryDate.toISOString() : null,
                manufacturingDate: form.manufacturingDate ? form.manufacturingDate.toISOString() : null,
                tags: (form.tags || "")
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };
            const res = await fetch(`/api/pharmacy/${pharmacyId}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                let msg = `HTTP ${res.status}`;
                try { const j = await res.json(); msg = j?.error || msg; } catch { }
                throw new Error(msg);
            }
            toast.success("Product added");
            setOpen(false);
            window.location.reload();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled} className="bg-blue-500 text-white rounded-[10px] hover:bg-blue-600 disabled:opacity-60">
                    Add Product
                </Button>
            </DialogTrigger>

            <DialogContent className="xs:max-w-[90%] md:max-w-3xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-[#243460]">Add Product</DialogTitle>
                    <DialogDescription className="text-center">Provide product details and upload an image.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[#243460] font-semibold">Name*</label>
                            <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Product name" />
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Brand</label>
                            <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.brand} onChange={(e) => setField("brand", e.target.value)} placeholder="Brand" />
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Category</label>
                            <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.category} onChange={(e) => setField("category", e.target.value)}>
                                <option value="">Select Category</option>
                                <option value="Tablets">Tablets</option>
                                <option value="Syrups">Syrups</option>
                                <option value="OTC">OTC</option>
                                <option value="Personal Care">Personal Care</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[#243460] font-semibold">Manufacturer</label>
                            <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.manufacturer} onChange={(e) => setField("manufacturer", e.target.value)} placeholder="Manufacturer" />
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Batch Number</label>
                            <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.batchNumber} onChange={(e) => setField("batchNumber", e.target.value)} placeholder="Batch No" />
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Unit</label>
                            <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.unit} onChange={(e) => setField("unit", e.target.value)} placeholder='e.g. "Strip of 10"' />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[#243460] font-semibold">Price*</label>
                            <input type="number" step="0.01" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="Price" />
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Discount %</label>
                            <input type="number" step="0.01" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.discountPercent} onChange={(e) => setField("discountPercent", e.target.value)} placeholder="Discount percent" />
                        </div>
                        {useMemo(() => {
                            const priceNum = Number(form.price);
                            const discNum = form.discountPercent === "" ? null : Number(form.discountPercent);
                            const valid = !isNaN(priceNum) && priceNum > 0 && discNum !== null && !isNaN(discNum) && discNum >= 0;
                            const value = valid ? (priceNum * (1 - discNum / 100)).toFixed(2) : "";
                            return (
                                <div>
                                    <label className="text-[#243460] font-semibold">Discounted Price</label>
                                    <input
                                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-700"
                                        value={value}
                                        placeholder="Calculated from Price and Discount %"
                                        readOnly
                                        disabled
                                    />
                                </div>
                            );
                        }, [form.price, form.discountPercent])}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[#243460] font-semibold">Stock*</label>
                            <input type="number" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.stock} onChange={(e) => setField("stock", e.target.value)} placeholder="Stock quantity" />
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Manufacturing Date</label>
                            <DatePicker selected={form.manufacturingDate} onChange={(d) => setField("manufacturingDate", d)} dateFormat="dd/MM/yyyy" maxDate={new Date()} showYearDropdown showMonthDropdown placeholderText="DD/MM/YYYY" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" />
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Expiry Date</label>
                            <DatePicker selected={form.expiryDate} onChange={(d) => setField("expiryDate", d)} dateFormat="dd/MM/yyyy" showYearDropdown showMonthDropdown placeholderText="DD/MM/YYYY" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[#243460] font-semibold">Prescription Required</label>
                            <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.prescriptionRequired ? "yes" : "no"} onChange={(e) => setField("prescriptionRequired", e.target.value === "yes")}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[#243460] font-semibold">Tags</label>
                            <input className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl" value={form.tags} onChange={(e) => setField("tags", e.target.value)} placeholder="Comma separated e.g. painkiller, paracetamol" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[#243460] font-semibold">Description</label>
                        <textarea className="w-full min-h-24 px-4 py-3 border-2 border-gray-200 rounded-xl" value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Product description" />
                    </div>

                    <div>
                        <label className="text-[#243460] font-semibold">Composition</label>
                        <textarea className="w-full min-h-24 px-4 py-3 border-2 border-gray-200 rounded-xl" value={form.composition} onChange={(e) => setField("composition", e.target.value)} placeholder="Active ingredients" />
                    </div>

                    <div>
                        <label className="text-[#243460] font-semibold">Product Image</label>
                        <div className="flex items-center gap-3 mt-2">
                            <UploadButton
                                endpoint="fileUploader"
                                content={{
                                    button({ ready }) {
                                        return <div>{uploadLoading.productImage ? <Loader2 className="animate-spin w-4 h-4" /> : (ready && <div>Upload Image</div>)}</div>;
                                    },
                                    allowedContent: () => "",
                                }}
                                appearance={{ button: "w-auto bg-[#243460] text-white text-xs font-bold rounded-xl px-3 py-2", container: "rounded-xl" }}
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
                        <Button type="submit" disabled={loading || disabled} className="w-full bg-[#5271FF] hover:bg-[#405dff] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition">
                            {loading ? "Saving..." : "Create Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}