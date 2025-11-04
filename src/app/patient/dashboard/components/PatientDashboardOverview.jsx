// src/app/patient/dashboard/components/PatientDashboard.jsx (client)
"use client";

import { useState, useEffect } from "react";
import AccountSwitcherButton from "./AccountSwitcherButton"; // new component
import AccountSwitchModal from "./AccountSwitchModal"; // new component
import PatientDashboardOverview from './patientdashboard';

export default function PatientDashboard({ userdata }) {
  const [activeUser, setActiveUser] = useState(userdata.sessionMode || "main");
  const [isLinking, setIsLinking] = useState(false);
  const [hasKidsProfile, setHasKidsProfile] = useState(false);
  const [kidsProfile, setKidsProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeUserEmail, setActiveUserEmail] = useState(
  userdata.sessionMode === "kids" && userdata.connections.find(c => c.mode === "kids")?.email
    ? userdata.connections.find(c => c.mode === "kids").email
    : userdata.email
);


  useEffect(() => {
    const kids = userdata.familymembers?.filter((fm) => getAge(fm) <= 16);
    if (kids?.length) {
      setKidsProfile(kids[0]);
      setHasKidsProfile(true);
      localStorage.setItem("childEmail", kids[0].email || "");
    } else {
      setKidsProfile(null);
      setHasKidsProfile(false);
      localStorage.removeItem("childEmail");
    }
  }, [userdata]);

  // handler for switching from modal or user switcher
  const handleSwitch = async (mode, email) => {
  if (isLinking) return;
  setIsLinking(true);

  try {
    const res = await fetch("/api/patient/switch-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, childEmail: email }),
    });
    const result = await res.json();

    if (!res.ok) {
      alert(result.msg || "Switch failed");
      setIsLinking(false);
      return;
    }

    // Update local state
    setActiveUser(mode === "kids" ? "kids" : "main");
    setActiveUserEmail(email); // <--- important

    setModalOpen(false);
    window.location.href = "/patient/dashboard"; // reload server-side session
  } catch (err) {
    console.error("Switch error:", err);
    alert("Error switching mode");
  } finally {
    setIsLinking(false);
  }
};


  return (
    <>
      {/* top-right header area: account switcher button */}
      <div className="absolute top-28 right-10 z-50">
        <AccountSwitcherButton
  currentUser={userdata.connections.find(c => c.email === activeUserEmail)}
  connections={userdata.connections || []}
  onOpen={() => setModalOpen(true)}
/>

      </div>

      {/* main dashboard */}
      <PatientDashboardOverview
        userdata={{ ...userdata, isKidsMode: activeUser === "kids" }}
        activeUser={activeUser}
        onSwitchUser={() => {
          // fallback: toggle to primary child (first connection that's not current user)
          const other = userdata.connections?.find((c) => c.email !== userdata.email);
          if (other) handleSwitch(other.mode, other.email);
        }}
        isLinking={isLinking}
        hasKidsProfile={hasKidsProfile}
      />

      {/* modal */}
      {modalOpen && (
        <AccountSwitchModal
  onClose={() => setModalOpen(false)}
  currentUserEmail={activeUserEmail} // important
  connections={userdata.connections || []}
  onSwitch={handleSwitch}
  isLoading={isLinking}
/>

      )}
    </>
  );
}

function getAge(person) {
  if (!person?.dateOfBirth) return null;
  const birth = new Date(person.dateOfBirth);
  const diff = new Date() - birth;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
