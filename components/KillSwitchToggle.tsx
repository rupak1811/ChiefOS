"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface KillSwitchToggleProps {
  isEnabled: boolean;
}

export default function KillSwitchToggle({ isEnabled }: KillSwitchToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/kill-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !isEnabled }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle kill switch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 ${
        isEnabled
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
      }`}
    >
      {loading ? "Processing..." : isEnabled ? "Enable Agents" : "Disable All Agents"}
    </button>
  );
}
