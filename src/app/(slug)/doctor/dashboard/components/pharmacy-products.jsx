"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Tag, PackageOpen, Check, LinkIcon } from "lucide-react";
import Image from "next/image";

export default function PharmacyProducts({ 
  pharmacy, 
  onProductLink, 
  linkingProducts, 
  isProductLinked 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return pharmacy.products || [];
    const q = searchTerm.toLowerCase();
    return (pharmacy.products || []).filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.manufacturer || "").toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [searchTerm, pharmacy.products]);


  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Products from {pharmacy.regname}</h2>
        <p className="text-gray-600 mt-1">Link products to add them to your prescription list</p>
        
        {/* Search Bar */}
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 w-full h-10 border rounded-md px-3"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const isLinked = isProductLinked(product.id);
              const isLoading = linkingProducts[product.id];
              
              return (
                <div
                  key={product.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isLinked
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
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
                      <div className="text-xs text-gray-500">
                        {product.brand || "—"} • {product.category || "—"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Manufacturer:</span>
                      <span>{product.manufacturer || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">₹{product.price?.toFixed(2) || "0.00"}</span>
                    </div>
                    {product.discountPercent && (
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="text-green-600">{product.discountPercent}%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span>{product.stock}</span>
                    </div>
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span className="text-xs">{product.tags.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => onProductLink(product)}
                    disabled={isLinked || isLoading}
                    variant={isLinked ? "outline" : "default"}
                    className="w-full"
                    size="sm"
                  >
                    {isLoading ? (
                      "Linking..."
                    ) : isLinked ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Linked
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-1" />
                        Link to My Products
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <PackageOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "This pharmacy has no products yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}