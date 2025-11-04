"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomeSection({ type, row, column, backgroundImage, title, filterIds }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/aarogyamart/superadmin/home-section?type=${type}`);
      let data = res.data.data || [];

      // Filter items if filterIds are provided
      if (filterIds && filterIds.length > 0) {
        const stringIds = filterIds.map(String);
        data = data.filter((item) => stringIds.includes(String(item.id)));
      }

      setItems(data.slice(0, row * column));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type, filterIds]);

  const renderCard = (item) => {
    // --- PRODUCT / DISCOUNT ---
    if (type === "product" || type === "discount") {
      return (
        <Link href={`/aarogyamart/product/${item.id}`}>
          <div
            className="rounded-xl shadow hover:shadow-lg transition p-2 flex flex-col justify-between bg-white"
            style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {item.discount && (
              <Badge className="text-white bg-green-500 w-fit text-xs mb-2 font-semibold">
                {item.discount}% OFF
              </Badge>
            )}
            <div className="flex gap-2">
              <div className="relative w-1/2 h-28 rounded-xl">
                <Image
                  src={
                    Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : item.image || "/placeholder.png"
                  }
                  alt={item.name}
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <div className="w-1/2 flex flex-col justify-start">
                <h3 className={`font-semibold text-lg md:text-base ${
                        backgroundImage ? "text-white" : "text-blue-500"
                    } truncate`}>
                  {item.name}
                </h3>
                {item.price && (
                  <span
                    className={`text-sm font-semibold ${
                        backgroundImage ? "text-white" : "text-gray-500"
                    }`}
                    >
                    ₹{item.price}
                    </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      );
    }

    // --- BRAND ---
    if (type === "brand") {
      return (
        <Link href={`/aarogyamart/brand/${item.id}`}>
          <div className="flex items-center h-28 justify-center bg-white rounded-xl shadow p-4 hover:shadow-md transition">
            <Image
              src={item.logo || item.image || "/placeholder.png"}
              alt={item.name}
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </Link>
      );
    }

    // --- CATEGORY ---
    if (type === "category") {
      return (
        <Link href={`/aarogyamart/category/${item.id}`}>
          <div className="rounded-xl h-28 overflow-hidden bg-white shadow hover:shadow-lg transition flex flex-col items-center justify-center p-4">
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.name}
              width={80}
              height={80}
              className="object-contain mb-2"
            />
            <h3 className="font-semibold text-gray-700 text-sm text-center">{item.name}</h3>
          </div>
        </Link>
      );
    }

    return null;
  };

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl text-blue-500 font-semibold mb-4">{title}</h2>
        <div
          className={`grid gap-4 ${
            column === 1
              ? "grid-cols-1"
              : column === 2
              ? "grid-cols-2"
              : column === 3
              ? "grid-cols-3"
              : column === 4
              ? "grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {loading
            ? Array.from({ length: row * column }).map((_, idx) => (
                <Skeleton key={idx} className="h-40 rounded-md" />
              ))
            : items.map((item) => (
                <div key={item.id}>{renderCard(item)}</div>
              ))}
        </div>
      </div>
    </section>
  );
}
