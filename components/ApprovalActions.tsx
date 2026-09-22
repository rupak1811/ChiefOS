"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRipple } from "@/components/motion/Ripple";
import { MOTION } from "@/lib/motion";

interface ApprovalActionsProps {
  approvalId: string;
}

export default function ApprovalActions({ approvalId }: ApprovalActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const spawnRipple = useRipple();

  const handleAction = async (action: "approve" | "reject") => {
    setLoading(true);
    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalId, action }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to process approval:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("approve")}
        onPointerDown={spawnRipple}
        disabled={loading}
        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 relative overflow-hidden transition-all"
        style={{
          transitionDuration: `${MOTION.duration.hover}ms`,
          transitionTimingFunction: MOTION.easing.fluidCubic,
        }}
      >
        <span className="relative z-10">Approve</span>
      </button>
      <button
        onClick={() => handleAction("reject")}
        onPointerDown={spawnRipple}
        disabled={loading}
        className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 relative overflow-hidden transition-all"
        style={{
          transitionDuration: `${MOTION.duration.hover}ms`,
          transitionTimingFunction: MOTION.easing.fluidCubic,
        }}
      >
        <span className="relative z-10">Deny</span>
      </button>
    </div>
  );
}
