"use client"
import { useEffect } from "react";

export default function useScreenshotProtection() {
  useEffect(() => {
    const disableShortcuts = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("Screenshots are disabled.");
        alert("Screenshots are disabled.");
        e.preventDefault();
      }
      if (e.ctrlKey && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
      }
    };

    const disableContextMenu = (e) => {
      e.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.classList.add("blurred");
      } else {
        document.body.classList.remove("blurred");
      }
    };

    document.addEventListener("keydown", disableShortcuts);
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", disableShortcuts);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
