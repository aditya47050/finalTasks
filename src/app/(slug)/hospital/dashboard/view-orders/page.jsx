import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import Viewallorders from './../components/viewallorders';

const OrdersPage = async () => {
  const session = await getSession();
  if (!session?.email) return <p className="text-center mt-8">No orders found.</p>;

  const user = await db.Hospital.findUnique({ where: { email: session.email } });
  if (!user) return <p className="text-center mt-8">No orders found.</p>;

  const orders = await db.Order.findMany({
    where: { userId: user.id },
    orderBy: { orderDate: "desc" },
    include: { address: true, items: {
        include: {
            product : true,
        },
    }, timeline: true },
  });

  if (!orders.length) return <p className="text-center mt-8">No orders found.</p>;

  return <Viewallorders orders={orders} />;
};

export default OrdersPage;
