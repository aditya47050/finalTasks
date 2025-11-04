// app/(doctor)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function VideoCallDoctorDashboard({ doctorId }) {
  const [calls, setCalls] = useState([]);

  const fetchPendingCalls = async () => {
    const res = await fetch(`/api/video-consultation/pending?doctorId=${doctorId}`);
    const data = await res.json();
    setCalls(data);
  };

  const acceptCall = async (callId) => {
    const res = await fetch("/api/video-consultation/accept", {
      method: "POST",
      body: JSON.stringify({ callId }),
      headers: { "Content-Type": "application/json" },
    });
    const vc = await res.json();
    alert("Call accepted! Opening video consultation...");
    window.location.href = `/video-consultation/${vc.roomId}`;
  };

  useEffect(() => {
    fetchPendingCalls();
    const interval = setInterval(fetchPendingCalls, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Doctor Dashboard</h1>

      {calls.length === 0 ? (
        <p>No pending calls.</p>
      ) : (
        <ul>
          {calls.map((call) => (
            <li key={call.id} className="border p-2 mb-2 rounded flex justify-between">
              <span>
                Patient: {call.Patient.firstName || "N/A"} ({call.Patient.email})
              </span>
              <button
                onClick={() => acceptCall(call.id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
