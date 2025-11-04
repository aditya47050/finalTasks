import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProductsList from "../component/products-list";

const ProductsPage = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/pharmacy/login");

  const pharmacy = await db.pharmacy.findFirst({
    where: { email: session.email },
    select: {
      id: true,
      PharmacyCertificate: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { approvalStatus: true, remarks: true, updatedAt: true },
      },
    },
  });
  if (!pharmacy) {
    return <div className="p-6">Pharmacy not found</div>;
  }

  const approval = pharmacy.PharmacyCertificate?.[0] || null;
  const approved = approval?.approvalStatus === "APPROVED";

  const products = await db.product.findMany({
    where: { pharmacyId: pharmacy.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      brand: true,
      category: true,
      description: true,
      composition: true,
      manufacturer: true,
      batchNumber: true,
      expiryDate: true,
      manufacturingDate: true,
      price: true,
      discountPercent: true,
      discountedPrice: true,
      stock: true,
      unit: true,
      prescriptionRequired: true,
      productImage: true,
      tags: true,
      createdAt: true,
    },
  });

  return (
    <ProductsList
      pharmacyId={pharmacy.id}
      products={products}
      approval={approval}
      approved={approved}
    />
  );
};

export default ProductsPage