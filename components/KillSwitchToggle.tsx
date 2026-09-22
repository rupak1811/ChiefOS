"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRipple } from "@/components/motion/Ripple";
import { MOTION } from "@/lib/motion";

interface KillSwitchToggleProps {
  isEnabled: boolean;
}

export default function KillSwitchToggle({ isEnabled }: KillSwitchToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const spawnRipple = useRipple();

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
      onPointerDown={spawnRipple}
      disabled={loading}
      className={`px-8 py-4 rounded-xl font-bold text-lg hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 relative overflow-hidden transition-all ${
        isEnabled
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
      }`}
      style={{
        transitionDuration: `${MOTION.duration.hover}ms`,
        transitionTimingFunction: MOTION.easing.fluidCubic,
      }}
    >
      <span className="relative z-10">
        {loading ? "Processing..." : isEnabled ? "Enable Agents" : "Disable All Agents"}
      </span>
    </button>
  );
}
