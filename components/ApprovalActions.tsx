"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRipple } from "@/lib/useRipple";
import { fluidTransition } from "@/lib/motion";

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
        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 disabled:opacity-50 relative overflow-hidden"
        style={fluidTransition}
      >
        <span className="relative z-10">Approve</span>
      </button>
      <button
        onClick={() => handleAction("reject")}
        onPointerDown={spawnRipple}
        disabled={loading}
        className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 disabled:opacity-50 relative overflow-hidden"
        style={fluidTransition}
      >
        <span className="relative z-10">Deny</span>
      </button>
    </div>
  );
}
