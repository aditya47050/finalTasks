import React from 'react'
import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const page = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 transition-all duration-300">
      <main className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-5">
          {[
            { title: "Manage Categories", desc: "Add, edit, or remove product categories.", href: "/superprofile/aarogya-mart/categories" },
            { title: "Manage Home Section", desc: "Add, edit, or remove section in Homepage.", href: "/superprofile/aarogya-mart/homesection" },
            { title: "Manage Brands", desc: "Create, delete and manage product brands.", href: "/superprofile/aarogya-mart/brands" },
            { title: "Manage Banners", desc: "Add, edit, or delete homepage banners.", href: "/superprofile/aarogya-mart/banners" },
            { title: "Manage Mart Seller", desc: "Check and change status for Mart Seller.", href: "/superprofile/aarogya-mart/mart-seller" },
            { title: "Manage Product Tag", desc: "Check and change tag for Product.", href: "/superprofile/aarogya-mart/product" },
          ].map((item, i) => (
            <Card
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-blue-500">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                <Link href={item.href}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300">
                    Go to {item.title.split(" ")[1]}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default page
