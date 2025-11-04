"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, Tag, PackageOpen, Building, Plus } from "lucide-react";
import Image from "next/image";
import PharmacyProducts from "./pharmacy-products";
import AddDoctorProductDialog from "./add-doctor-product-dialog";
import { toast } from "react-toastify";

export default function DoctorProductsView({ doctor, pharmacies, initialDoctorProducts }) {
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [activeTab, setActiveTab] = useState("browse");
  const [doctorProducts, setDoctorProducts] = useState(initialDoctorProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [linkingProducts, setLinkingProducts] = useState({});

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return doctorProducts;
    const q = searchTerm.toLowerCase();
    return doctorProducts.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.manufacturer || "").toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [searchTerm, doctorProducts]);

  const handleProductLink = async (product) => {
    try {
      setLinkingProducts(prev => ({ ...prev, [product.id]: true }));
      
      const res = await fetch("/api/doctor/products/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          doctorId: doctor.id,
          pharmacyId: selectedPharmacy.id 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to link product");
      }

      // Add the linked product to doctor's list
      setDoctorProducts(prev => {
        if (prev.some(p => p.id === data.product.id)) {
          return prev;
        }
        return [data.product, ...prev];
      });

      toast.success("Product linked successfully!");
    } catch (error) {
      console.error("Failed to link product:", error);
      toast.error(error.message);
    } finally {
      setLinkingProducts(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleProductRemove = async productId => {
    try {
      const res = await fetch(`/api/doctor/products/${productId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setDoctorProducts(prev => prev.filter(p => p.id !== productId));
        toast.success("Product removed successfully!");
      } else {
        throw new Error("Failed to remove product");
      }
    } catch (error) {
      console.error("Failed to remove product:", error);
      toast.error("Failed to remove product");
    }
  };

  const handleProductAdd = newProduct => {
    setDoctorProducts(prev => [newProduct, ...prev]);
    toast.success("Custom product added successfully!");
  };

  // Check if product is already linked to doctor
  const isProductLinked = (productId) => {
    return doctorProducts.some(p => 
      p.pharmacyLinkedProductId === productId || p.id === productId
    );
  };


  return (
    <div className="mx-auto space-y-6 p-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Prescription Products</h1>
          <p className="text-gray-600 mt-2">
            Select products from pharmacies or add your own custom products for prescriptions
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("browse")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "browse"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Browse Pharmacy Products
            </button>
            <button
              onClick={() => setActiveTab("my-products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "my-products"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Selected Products ({doctorProducts.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "browse" ? (
        <div className="space-y-6">
          {/* Pharmacy Selection */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Select a Pharmacy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pharmacies.map(pharmacy => (
                <div
                  key={pharmacy.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedPharmacy?.id === pharmacy.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedPharmacy(pharmacy)}}
                >
                  <div className="font-medium">{pharmacy.regname}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {[pharmacy.fulladdress, pharmacy.city, pharmacy.state].filter(Boolean).join(", ")}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {pharmacy.products?.length || 0} products available
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{pharmacy.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Product */}
          {!selectedPharmacy && (
            <div className="bg-white rounded-lg border p-6 text-center">
              <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Add Custom Product</h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Add a custom product that will be linked to a pharmacy.
              </p>
              <AddDoctorProductDialog
                doctor={doctor}
                pharmacies={pharmacies}
                onProductAdd={handleProductAdd}
              />
            </div>
          )}

          {/* Pharmacy Products */}
          {selectedPharmacy && (
            <PharmacyProducts
              pharmacy={selectedPharmacy}
              onProductLink={handleProductLink} // Changed from onProductSelect to onProductLink
              linkingProducts={linkingProducts}
              isProductLinked={isProductLinked}
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search your products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 w-full h-10 border rounded-md px-3"
              />
            </div>
            <AddDoctorProductDialog
              doctor={doctor}
              pharmacies={pharmacies}
              onProductAdd={handleProductAdd}
            />
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      {product.productImage ? (
                        <Image 
                          src={product.productImage} 
                          width={48} 
                          height={48} 
                          alt={product.name} 
                          className="rounded-lg object-cover border"
                        />
                      ) : (
                        <PackageOpen className="w-12 h-12 rounded-lg border p-2 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-sm line-clamp-2">{product.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.pharmacy?.regname || "Custom Product"}
                        </div>
                        {product.pharmacyLinkedProductId && (
                          <div className="text-xs text-blue-600 mt-1">Linked from Pharmacy</div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleProductRemove(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Brand:</span>
                      <span>{product.brand || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span>₹{product.price?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{product.category || "—"}</span>
                    </div>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span className="text-xs">{product.tags.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products selected</h3>
              <p className="text-gray-600 mb-4">
                Browse pharmacy products or add custom products to build your prescription list.
              </p>
              <AddDoctorProductDialog
                doctor={doctor}
                pharmacies={pharmacies}
                onProductAdd={handleProductAdd}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}