"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MailIcon, Facebook, Instagram, Linkedin, Twitter, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const socialLinks = [
    { href: "https://www.instagram.com/aarogyamart", icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
    { href: "https://www.facebook.com/aarogyamart", icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { href: "https://www.twitter.com/aarogyamart", icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
    { href: "https://www.linkedin.com/company/aarogyamart", icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact-us" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
  ];

  const resources = [
    { name: "Job Fraud Awareness", href: "/jobaadhar/job-fraud" },
    { name: "Interview Tips", href: "/jobaadhar/interview-tips" },
    { name: "Resume Guidelines", href: "/jobaadhar/resume-guidelines" },
    { name: "Career Advice", href: "/jobaadhar/career-advice" },
    { name: "Support & FAQs", href: "/jobaadhar/faqs" },
  ];

  return (
    <footer className="bg-slate-50 border-t">
      {/* Main Footer */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4 font-bold text-lg text-gray-900">
                AarogyaCareers
              </div>
              <p className="text-gray-500 text-base mb-4">
                At AarogyaCareers, we aim to empower every job seeker with access to genuine opportunities and make recruitment easier for employers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-gray-500 hover:text-blue-600 p-0 h-auto justify-start"
                    >
                      <a href={link.href}>{link.name}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources / Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {resources.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className="text-gray-500 hover:text-blue-600 transition-colors p-0 h-auto"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-start gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-gray-500">+91 79-7272-7498</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <span className="text-gray-500">info@aarogyaaadhar.com</span>
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
          © {new Date().getFullYear()} AarogyaCareers. All rights reserved. | Operated by Aarogya Aadhar.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Empowering your career journey with trust and innovation.
        </p>
      </div>
    </footer>
  );
}
