import React from "react";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PharmacyOrdersClient from "../component/PharmacyOrdersClient";

const PharmacyOrdersPage = async () => {
  const session = await getSession();
  if (!session?.email) redirect("/pharmacy/login");

  // Get the logged-in pharmacy
  const pharmacy = await db.pharmacy.findFirst({
    where: { email: session.email },
    select: { id: true, regname: true },
  });
  
  if (!pharmacy) {
    return <div className="p-6">Pharmacy not found</div>;
  }

  // Fetch all orders for this pharmacy with patient details
  const orders = await db.pharmacyOrder.findMany({
    where: { pharmacyId: pharmacy.id },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          mobile: true,
          email: true,
          city: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              brand: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform the data for easier use in the client component
  const transformedOrders = orders.map(order => ({
    id: order.id,
    patientName: `${order.patient.firstName} ${order.patient.middleName || ''} ${order.patient.lastName}`.trim(),
    patientMobile: order.patient.mobile,
    patientEmail: order.patient.email,
    patientCity: order.patient.city,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentMethod: order.paymentMethod,
    items: order.items.map(item => ({
      productName: item.product.name,
      brand: item.product.brand,
      category: item.product.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
    note: order.note,
    receipt: order.receipt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  return (
    <PharmacyOrdersClient 
      orders={transformedOrders} 
      pharmacyName={pharmacy.regname}
      pharmacyId={pharmacy.id} 
    />
  );
};

export default PharmacyOrdersPage;