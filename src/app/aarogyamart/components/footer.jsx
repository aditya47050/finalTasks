"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MailIcon, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const [categories, setCategories] = useState([]);

  const socialLinks = [
    { href: "https://www.instagram.com/aarogyamart", icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
    { href: "https://www.facebook.com/aarogyamart", icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { href: "https://www.twitter.com/aarogyamart", icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
    { href: "https://www.linkedin.com/company/aarogyamart", icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
  ];

  const links = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact-us" },
    { name: "Shipping Info", href: "/aarogyamart/shipping-info" },
    { name: "Returns", href: "/aarogyamart/return" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/aarogyamart/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
      <footer className="bg-slate-50 border-t">
      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">AarogyaMart</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for quality medical equipment and hospital supplies. Serving healthcare
                professionals since 2025.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.name}>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-gray-400 hover:text-blue-500 p-0 h-auto justify-start"
                    >
                      <a href={link.href}>{link.name}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            {/* Categories */}
<div>
  <h4 className="text-lg font-semibold mb-4">Categories</h4>
  <ul className="space-y-2">
    {categories.length > 0 ? (
      categories.slice(0, 5).map((category) => (
        <li key={category.id}>
          <Link href={`/aarogyamart/category/${category.id}`}>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-blue-600 transition-colors p-0 h-auto"
            >
              {category.name}
            </Button>
          </Link>
        </li>
      ))
    ) : (
      <li className="text-gray-400">Loading...</li>
    )}
  </ul>
</div>


            {/* Contact Info */}
            <div className="flex flex-col items-start gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-gray-400">+91 79-7272-7498</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <span className="text-gray-400">info@aarogyaaadhar.com</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <span className="text-sm text-gray-600">Follow us:</span>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t pt-3 my-3 md:pt-6 md:my-6 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} AarogyaMart. All rights Reserved. | Operated by Aarogya Aadhar.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Medical Crowd Funding platform registered and compliant with Indian regulations
        </p>
      </div>
    </footer>
  );
}
