import React from "react";
import ProductsPage from "./../components/ProductPage";
import { getSession } from "@/lib/getsession";

const Page = async () => {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      throw new Error("No active session found");
    }

    const sellerId = session.id;

    return (
      <div>
        <ProductsPage sellerId={sellerId} />
      </div>
    );
  } catch (error) {
    console.error("Error loading products page:", error);
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
        <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p>{error.message || "Unable to load products right now."}</p>
      </div>
    );
  }
};

export default Page;
