"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DhanFooter from "../components/dhan-footer";
import CustomAccordion from './components/CustomAccordion';
import { motion } from "framer-motion";
import { CheckCircle, Search } from "lucide-react";
import {
  Megaphone,
  Home,
  Utensils,
  HandCoins,
  MessageCircle,
  BrainCog,
} from "lucide-react";



const faqData = [
  {
    question: "What services/benefits can be availed with the PSP/PAP?",
    answer:
      "Though patient support and access programs (PSPs/PAPs) aim at solving access barriers for people with cancer and their families, they may differ in terms of benefits depending on the type of cancer they deal with or the overall program structure. The benefits may range from medicine support, and diagnostic support to many other much-needed value additions like nutrition counseling, financial schemes, etc. For specific details, speak with your treating doctor.",
  },
  {
    question: "Where can I get the enrollment form for a PSP/PAP?",
    answer:
      "PSPs and PAPs in India are introduced to patients by their treating oncologists. Ask your oncologist about the available PSPs/PAPs applicable to your treatment line. You may also write your queries to us at (help@aarogyadhan.com). We will get back to you within 24-48 hours.",
  },
  {
    question: "What to expect once you get enrolled?",
    answer:
      "Once your treating doctor prescribes you the above or any other oncology drug, your doctor shall introduce the appropriate program to you if the doctor believes that program shall be helpful to you and is applicable to you. The doctor shall also provide you with the contact details for enrolling in the program. Once you enroll in the program, the health coaches shall guide you on the components of the program and the next steps. You may also write your queries to us at (help@aarogyadhan.com) and expect a response within 24-48 hours.",
  },
  {
    question: "Who can help me explain more about PSPs?",
    answer:
      "You can call   Cancer Support Tollfree Helpline @+91 79-7272-7498. We shall guide you on how to avail benefits from a patient support program. You may also write your queries to us at (help@aarogyadhan.com) and expect a response within 24-48 hours.",
  },
];

const steps = [
  {
    step: "STEP 1",
    description:
      "Consult with your treating oncologist or call our helpline to know the basics",
  },
  {
    step: "STEP 2",
    description:
      "Discuss with your oncologist if your prescribed medicine’s PSPs/PAPs is applicable to you",
  },
  {
    step: "STEP 3",
    description:
      "Apply into the program using the PSP/PAP cell supported by the medicine manufacturer",
  },
  {
    step: "STEP 4",
    description:
      "Once enrolled, unlock all benefits subject to the Program's TnCs including free medicines, counselling, etc.",
  },
];

const benefits = [
  {
    icon: Megaphone,
    text: "Disease and program education",
  },
  {
    icon: Home,
    text: "At-home services for medicine administration, nurse visits, testing, etc.",
  },
  {
    icon: Utensils,
    text: "Nutrition guidance",
  },
  {
    icon: HandCoins,
    text: "Financial assistance through exclusive schemes",
  },
  {
    icon: MessageCircle,
    text: "Real-time assistance around medicine and other value-add services",
  },
  {
    icon: BrainCog,
    text: "Mental wellness counseling",
  },
];
export default function PatientSupportProgramsPage() {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#243460] via-[#2d4a87] to-[#5271FF] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              PATIENT SUPPORT AND ACCESS PROGRAMS (PSPs & PAPs)
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
              To further improve treatment outcomes and personalize support, some medicine manufacturers provide
              integrated, holistic assistance through experts at NO EXTRA COST to people fitting certain program
              criteria. These are called patient support or access programs (PSPs & PAPs).
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16 lg:space-y-24">
        {/* Care Beyond Pills Section */}
        <section className="space-y-8 lg:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243460] mb-6">Care Beyond the Pills</h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed">
              Based on what they are designed to offer, PSPs/PAPs can be of several types. A few ways in which such
              programs support and equip cancer warriors and their caregivers may include
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-green-50 group-hover:scale-105">
                    <CardContent className="flex items-start gap-4 p-0">
                      <div className="w-14 h-14 min-w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#5271FF] to-[#243460] shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Icon className="text-white" size={24} />
                      </div>
                      <p className="text-gray-800 font-medium text-base lg:text-lg leading-relaxed">{item.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg sm:text-xl max-w-4xl mx-auto text-center leading-relaxed"
          >
            Just getting started with your treatment? Your medicine may be associated with an ongoing support or access
            program in India.
          </motion.p>
        </section>

        {/* 4 Steps Section */}
        <section className="space-y-8 lg:space-y-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243460] mb-4">4 Steps to Access PSPs</h2>
            <p className="text-gray-600 text-lg sm:text-xl">Save on your treatment costs & more services</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 justify-items-center">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Card className="bg-white shadow-xl rounded-full w-64 h-64 sm:w-72 sm:h-72 flex flex-col items-center justify-center text-center border-4 border-[#FF5C5C] hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FF5C5C] to-[#ff7a7a] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {item.step}
                    </div>
                    <div className="mt-8 text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>



        {/* FAQ Section */}
        <section className="space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#5271FF] text-center"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CustomAccordion items={faqData} />
          </motion.div>
        </section>
      </div>

      <DhanFooter />
    </div>
  )
}
