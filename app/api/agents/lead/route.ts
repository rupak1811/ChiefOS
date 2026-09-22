import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Lead Agent - Orchestration & Planning
 * Coordinates with Memory, Code, and Guardian agents
 * Uses rule-based planning (no paid LLM required)
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, action } = body;

    const leadAgent = await prisma.agent.findFirst({
      where: { name: "Lead" },
    });

    if (!leadAgent) {
      return NextResponse.json(
        { error: "Lead agent not initialized" },
        { status: 500 }
      );
    }

    // Log the request
    await prisma.actionLedger.create({
      data: {
        userId: session.user.id,
        agentId: leadAgent.id,
        action: `Lead: ${action || "plan"}`,
        scope: "plan:create",
        metadata: JSON.stringify({ message: message?.substring(0, 100) }),
        result: "processing",
      },
    });

    // Rule-based planning
    const plan = await planAction(message, session.user.id, leadAgent.id);

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Lead agent error:", error);
    return NextResponse.json(
      { error: "Lead agent processing failed" },
      { status: 500 }
    );
  }
}

async function planAction(message: string, userId: string, agentId: string) {
  const lowerMessage = message.toLowerCase();

  // Memory operations
  if (lowerMessage.includes("remember") || lowerMessage.includes("save")) {
    return {
      type: "memory_write",
      agent: "Memory",
      action: "store",
      requiresApproval: false,
      requiresKillSwitchCheck: true,
      message: "I'll store this in your Memory agent.",
    };
  }

  if (lowerMessage.includes("what do you remember") || lowerMessage.includes("recall")) {
    return {
      type: "memory_read",
      agent: "Memory",
      action: "retrieve",
      requiresApproval: false,
      requiresKillSwitchCheck: false,
      message: "I'll retrieve your memories.",
    };
  }

  // Code operations
  if (lowerMessage.includes("create") && (lowerMessage.includes("file") || lowerMessage.includes("sandbox"))) {
    return {
      type: "code_write",
      agent: "Code",
      action: "create_file",
      requiresApproval: true,
      requiresKillSwitchCheck: true,
      message: "I'll request approval to create a file in the sandbox.",
    };
  }

  // Guardian operations
  if (lowerMessage.includes("kill switch") || lowerMessage.includes("security")) {
    return {
      type: "security_check",
      agent: "Guardian",
      action: "status",
      requiresApproval: false,
      requiresKillSwitchCheck: false,
      message: "I'll check your security status.",
    };
  }

  // Default: informational
  return {
    type: "info",
    agent: "Lead",
    action: "help",
    requiresApproval: false,
    requiresKillSwitchCheck: false,
    message: `I can help you with:
- Remembering information (Memory agent)
- Creating files in the sandbox (Code agent, requires approval)
- Checking security status (Guardian agent)

What would you like to do?`,
  };
}
