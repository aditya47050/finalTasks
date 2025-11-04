"use client";

import Image from "next/image";

export default function SuggestedSection({ title, products, columns = 4 }) {
  if (!products || products.length === 0) return null;

  // Shuffle products randomly
  const shuffled = [...products].sort(() => Math.random() - 0.5);

  return (
    <section className=" mx-auto px-4 py-6 bg-white">
      <h2 className="container text-3xl text-gray-500 font-semibold mb-4">{title}</h2>
      <div className={`container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-6`}>
        {shuffled.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-3 flex flex-col items-center hover:shadow-lg transition-shadow"
          >
            {product.images && product.images[0] && (
              <Image
                src={product.images[0]}
                width={200}
                height={200}
                alt={product.name}
                className="object-contain mb-2"
              />
            )}
            <h3 className="text-lg font-medium text-center">{product.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
