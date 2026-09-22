import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import * as fs from "fs/promises";
import * as path from "path";

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function rulePlanner(message: string, userId: string): Promise<string> {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("remember") || lowerMessage.includes("save")) {
    const keyMatch = message.match(/remember\s+(?:that\s+)?(.+)/i);
    if (keyMatch) {
      const content = keyMatch[1].trim();
      const key = `note_${Date.now()}`;
      
      await prisma.memory.create({
        data: {
          userId,
          key,
          value: content,
        },
      });

      const memoryAgent = await prisma.agent.findFirst({ where: { name: "Memory" } });
      if (memoryAgent) {
        await prisma.actionLedger.create({
          data: {
            userId,
            agentId: memoryAgent.id,
            action: "Stored memory",
            scope: "memory:write",
            metadata: JSON.stringify({ key, value: content }),
            result: "success",
          },
        });
      }

      return `On it—saved to Memory. You can recall this anytime by asking what I remember.`;
    }
  }

  if (lowerMessage.includes("create") && (lowerMessage.includes("file") || lowerMessage.includes("sandbox"))) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.killSwitch) {
      return "Paused—kill switch is on. Approvals will not run until you resume. Turn off kill switch to proceed.";
    }

    const codeAgent = await prisma.agent.findFirst({ where: { name: "Code" } });
    if (!codeAgent) {
      return "Blocked—Code agent not found. Initialize agents to proceed.";
    }

    const existingToken = await prisma.capabilityToken.findFirst({
      where: {
        userId,
        agentId: codeAgent.id,
        scopes: { contains: "code:write" },
        expiresAt: { gt: new Date() },
        revokedAt: null,
      },
    });

    const tokenId = existingToken?.id || (await prisma.capabilityToken.create({
      data: {
        userId,
        agentId: codeAgent.id,
        scopes: "code:write,sandbox:execute",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })).id;

    const fileNameMatch = message.match(/create\s+(?:a\s+)?(\S+\.?\w*)\s+file/i) || 
                         message.match(/file\s+(?:called\s+)?(\S+\.?\w*)/i);
    const fileName = fileNameMatch ? fileNameMatch[1] : "output.txt";

    const approval = await prisma.approval.create({
      data: {
        userId,
        tokenId,
        action: `Create file: ${fileName}`,
        scope: "code:write",
        metadata: JSON.stringify({
          fileName,
          content: `Hello from ChiefOS!\nCreated at: ${new Date().toISOString()}`,
        }),
        status: "pending",
      },
    });

    return `Waiting on you—Code wants to create "${fileName}". Review draft in Approvals.`;
  }

  if (lowerMessage.includes("what can you") || lowerMessage.includes("help me") || lowerMessage.includes("status")) {
    return `Working—checking with the team now. I co-ordinate Memory, Code, and Guardian. Ask for status, assign work, or set permissions. Sensitive actions wait for your approval.`;
  }

  if (lowerMessage.includes("memory") || lowerMessage.includes("what do you remember") || lowerMessage.includes("recall")) {
    const memories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    if (memories.length === 0) {
      return "Nothing stored yet. Ask me to remember something and I'll save it to Memory.";
    }

    const memoryList = memories.map((m, i) => `${i + 1}. ${m.value}`).join("\n");
    return `Done—here's what Memory has:\n\n${memoryList}`;
  }

  return `Got it: "${message}". Ask me to check status, assign work, or change permissions. Need more detail to proceed.`;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const leadAgent = await prisma.agent.findFirst({ where: { name: "Lead" } });
    if (leadAgent) {
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: leadAgent.id,
          action: "Received chat message",
          scope: "plan:create",
          metadata: JSON.stringify({ message: message.substring(0, 100) }),
          result: "processing",
        },
      });
    }

    const response = await rulePlanner(message, session.user.id);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
