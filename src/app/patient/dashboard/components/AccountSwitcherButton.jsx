// src/app/patient/dashboard/components/AccountSwitcherButton.jsx
"use client";

import React from "react";
import { Users, ChevronDown } from "lucide-react";

export default function AccountSwitcherButton({ currentUser, connections, onOpen }) {
  const otherCount = (connections?.length || 0) - 1; // excluding current
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm hover:opacity-95 transition"
      type="button"
    >
      <img
        src={currentUser.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${currentUser.firstName}`}
        alt="avatar"
        className="w-7 h-7 rounded-full border-2 border-white object-cover"
      />
      <span className="font-semibold text-sm">{currentUser.firstName || "Account"}</span>
      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{otherCount}</span>
      <ChevronDown className="w-4 h-4" />
    </button>
  );
}
