// src/app/patient/dashboard/components/AccountSwitchModal.jsx
"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Circle, Plus, X } from "lucide-react";

export default function AccountSwitchModal({ onClose, currentUserEmail, connections = [], onSwitch, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full sm:w-[480px] bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Switch Account</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {connections.map((acc) => {
            const isCurrent = acc.email === currentUserEmail;
            return (
              <button
                key={acc.email}
                onClick={() => !isCurrent && !isLoading && onSwitch(acc.mode, acc.email)}
                disabled={isLoading || isCurrent}
                className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border transition ${
                  isCurrent ? "bg-blue-50 border-blue-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${acc.firstName}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="text-left">
                    <div className="font-medium">{acc.firstName}</div>
                    <div className="text-xs text-gray-500">{acc.relation || (acc.mode === "main" ? "Main Account" : "Linked")}</div>
                    <div className="text-xs text-gray-400 truncate">{acc.email}</div>
                  </div>
                </div>

                <div>
                  {isCurrent ? <CheckCircle className="w-5 h-5 text-blue-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 border-t pt-4 flex items-center justify-between">
          <Link href="/patient/dashboard/family-details" onClick={onClose} className="inline-flex items-center gap-2 text-blue-600 font-semibold">
            <Plus className="w-4 h-4" /> Add New Connection
          </Link>
          <div className="text-xs text-gray-500">Tap an account to switch</div>
        </div>
      </div>
    </div>
  );
}
