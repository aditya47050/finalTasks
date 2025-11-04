"use client";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react"

import { useState } from "react";
import Link from "next/link"
import HelpCenterDialog from './help-center-dialog';
import Image from 'next/image';

const DhanFooter = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const aboutLinks = [
    { text: "About AarogyaDhan", href: "/about" },
    { text: "How It Works", href: "/aarogyadhan#how-it-works" },
    { text: "Success Stories", href: "/#" },
    { text: "Contact Us", href: "/contact-us" },
  ]

  const fundraiserLinks = [
    { text: "Start a Fundraiser", href: "/aarogyadhan/login" },
    { text: "Fundraiser Tips", href: "/#" },
    // { text: "Pricing", href: "/pricing" },
    { text: "Withdraw Funds", href: "/#" },
    { text: "Get Financial Support", href: "/aarogyadhan/schemes/get-financial-support" },
    { text: "NGOs Support", href: "/aarogyadhan/schemes/seek-ngos-support" },
  ]

  const supportLinks = [
    { text: "Help Center", href: "/help" },
    { text: "Safety & Trust", href: "/#" },
    { text: "Medical Verification", href: "/#" },
    { text: "Tax Benefits", href: "/#" },
  ]

  const legalLinks = [
    { text: "Terms of Service", href: "/terms-and-conditions" },
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Refund Policy", href: "/return-policy" },
    { text: "Cookie Policy", href: "/#" },
  ]

  const socialLinks = [
    {
      href: "https://www.instagram.com/aarogyadhan",
      icon: <Instagram className="h-5 w-5" />,
      label: "Instagram",
    },
    {
      href: "https://www.facebook.com/aarogyadhan",
      icon: <Facebook className="h-5 w-5" />,
      label: "Facebook",
    },
    {
      href: "https://www.twitter.com/aarogyadhan",
      icon: <Twitter className="h-5 w-5" />,
      label: "Twitter",
    },
    {
      href: "https://www.linkedin.com/company/aarogyadhan",
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn",
    },
  ]

  return (
    <>
      <footer className="hidden md:block bg-slate-50 border-t">
        {/* Trust indicators */}
        <div className="bg-blue-600 text-white py-3">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">🏥 Trusted by 50,000+ families | 💰 ₹100+ Crores raised | 🛡️ 100% Secure & Verified</p>
          </div>
        </div>

        <div className=" md:container mx-auto px-4 py-4 md:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xs:gap-2 lg:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1 my-4 xs:col-span-2">
              <h3 className="font-bold text-lg text-gray-900 mb-4">AarogyaDhan</h3>
              <p className="text-gray-600 text-sm mb-4">
                {"  India's"} trusted medical crowdfunding platform. Raise funds for medical emergencies with transparency and
                ease.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 79-7272-7498</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>help@aarogyadhan.com</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">About</h4>
              <ul className="lg:space-y-2 md:space-y-0 list-none">
                {aboutLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px] transition-colors">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fundraisers */}
            <div>
              <h4 className=" text-gray-900 font-bold text-[18px] lg:text-[25px]">Fundraisers</h4>
              <ul className="lg:space-y-2 md:space-y-0 list-none">
                {fundraiserLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">Support</h4>
              <ul className="lg:space-y-2 md:space-y-0 list-none">
                {supportLinks.map((link, index) =>
                  link.text === "Help Center" ? (
                    <HelpCenterDialog
                      key={index}
                      trigger={
                        <li className="cursor-pointer text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]">
                          {link.text}
                        </li>
                      }
                    />
                  ) : (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]"
                      >
                        {link.text}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>


            {/* Legal */}
            <div >
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">Legal</h4>
              <ul className="lg:space-y-2 md:space-y-0 list-none">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media & Parent Company */}
          <div className="border-t pt-4 mt-4 md:pt-8 md:mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center  lg:gap-4">
              <div className=" md:max-w-sm lg:max-w-full text-sm text-gray-600">
                <p>
                  A product of{" "}
                  <Link href="https://aarogyaaadhar.com" className="text-blue-600 hover:underline font-medium">
                    Aarogya Aadhar
                  </Link>{" "}
                  - Your Complete Healthcare Solutions Partner
                </p>
              </div>
              <div className="">
                <Image
                  src="https://res.cloudinary.com/dorreici1/image/upload/v1756207164/HelpoHub_Visiting_Card_20250707_201432_0000_page-0001-removebg-preview_wkphct.png"
                  width={180}
                  height={200}
                  alt="Livo Foundation"
                  className="xl:h-[60px] h-[40px] w-full"
                />
              </div>

              <div className="flex md:flex-col lg:flex-row items-center gap-4">
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

          {/* Copyright */}
          <div className="border-t pt-3 mt-3 md:pt-6 md:mt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2023 AarogyaDhan. All rights reserved. | Operated by Livo Foundation.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Medical crowdfunding platform registered and compliant with Indian regulations
            </p>
          </div>
        </div>
      </footer>
      <footer className="block md:hidden bg-slate-50 border-t">
        {/* Trust indicators */}
        <div className="bg-blue-600 text-white py-3">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">🏥 Trusted by 50,000+ families | 💰 ₹100+ Crores raised | 🛡️ 100% Secure & Verified</p>
          </div>
        </div>

        <div className=" md:container mx-auto px-4 py-4 md:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xs:gap-2 md:gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1 my-4 xs:col-span-2">
              <h3 className="font-bold text-lg text-gray-900 mb-4">AarogyaDhan</h3>
              <p className="text-gray-600 text-sm mb-4">
                {"  India's"} trusted medical crowdfunding platform. Raise funds for medical emergencies with transparency and
                ease.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 79-7272-7498</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>help@aarogyadhan.com</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">About</h4>
              <ul className="space-y-2 list-none">
                {aboutLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px] transition-colors">
                  <li >
                      {link.text}
                  </li>
                    </Link>
                ))}
              </ul>

            </div>

            {/* Fundraisers */}
            <div>
              <h4 className="text-gray-900 font-bold text-[18px] lg:text-[25px]">Fundraisers</h4>
              <ul className="space-y-2 list-none">
                {fundraiserLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]">
                  <li >
                      {link.text}
                  </li>
                    </Link>
                ))}
              </ul>
            </div>

            {/* Support */}
          <div>
        <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900 ">Support</h4>
        <ul className="space-y-2 list-none">
    {supportLinks.map((link, index) =>
      link.text === "Help Center" ? (
        <HelpCenterDialog
          key={index}
          trigger={
            <li className="cursor-pointer text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]">
              {link.text}
            </li>
          }
        />
      ) : (
          <Link
            href={link.href}
            key={index}
            className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]"
          >
        <li >
            {link.text}
        </li>
          </Link>
      )
    )}
  </ul>
      </div>


            {/* Legal */}
            <div>
              <h4 className="font-bold text-[18px] lg:text-[25px] text-gray-900">Legal</h4>
              <ul className="space-y-2 list-none">
                {legalLinks.map((link, index) => (
                    <Link key={index} href={link.href} className="text-gray-600 hover:text-blue-600 lg:text-[14px] text-[12px]">
                  <li >
                      {link.text}
                  </li>
                    </Link>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media & Parent Company */}
          <div className="border-t pt-4 mt-4 md:pt-8 md:mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                <p>
                  A product of{" "}
                  <Link href="https://aarogyaaadhar.com" className="text-blue-600 hover:underline font-medium">
                    Aarogya Aadhar
                  </Link>{" "}
                  - Your Complete Healthcare Solutions Partner
                </p>
              </div>

              <div className="flex items-center gap-4">
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

          {/* Copyright */}
          <div className="border-t pt-3 mt-3 md:pt-6 md:mt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2023 AarogyaDhan. All rights reserved. | Operated by Livo Foundation.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Medical crowdfunding platform registered and compliant with Indian regulations
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default DhanFooter
