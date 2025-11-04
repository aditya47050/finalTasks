"use client";
import { Users, Loader2 } from "lucide-react";
import { useState } from "react";

export function UserSwitcher({ activeUser, hasKidsProfile, onSwitch }) {
  const [isLinking, setIsLinking] = useState(false);

  const handleClick = async () => {
    if (isLinking) return; // remove hasKidsProfile check
    setIsLinking(true);
    await onSwitch();
    setIsLinking(false);
  };

  // Always show the button if user has at least one kid
  // Always show button if there is at least one kid OR activeUser is "kids"
if (!hasKidsProfile && activeUser === "main") return null;


  return (
    <button
      onClick={handleClick}
      disabled={isLinking}
      className="rounded-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold"
    >
      {isLinking ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
          Switching...
        </>
      ) : (
        <>
          <Users className="w-4 h-4 inline-block mr-2" />
          {activeUser === "main" ? "Switch to Kids Mode" : "Switch to Main User"}
        </>
      )}
    </button>
  );
}
