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

      return `I've remembered that: "${content}". This has been stored in your Memory agent.`;
    }
  }

  if (lowerMessage.includes("create") && (lowerMessage.includes("file") || lowerMessage.includes("sandbox"))) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.killSwitch) {
      return "I cannot create files right now because the kill switch is enabled. Please disable it in the Kill Switch page.";
    }

    const codeAgent = await prisma.agent.findFirst({ where: { name: "Code" } });
    if (!codeAgent) {
      return "Code agent is not available. Please initialize agents first.";
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

    return `I need your approval to create the file "${fileName}" in the sandbox. Please check the Approvals page to approve this action. Approval ID: ${approval.id}`;
  }

  if (lowerMessage.includes("what can you") || lowerMessage.includes("help me")) {
    return `I'm Lead, your orchestrator agent. I can help you with:

1. **Remember things**: Ask me to remember information and I'll store it in the Memory agent
2. **Create files**: Request file creation in the sandbox (requires approval)
3. **Coordinate agents**: I work with Memory, Code, and Guardian agents
4. **Plan tasks**: I break down complex requests into actionable steps

Try asking me to:
- "Remember that my favorite color is blue"
- "Create a hello.txt file in the sandbox"
- "What's in my memory?"

All sensitive operations require your approval through the Approvals page.`;
  }

  if (lowerMessage.includes("memory") || lowerMessage.includes("what do you remember")) {
    const memories = await prisma.memory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    if (memories.length === 0) {
      return "I don't have any memories stored yet. Ask me to remember something!";
    }

    const memoryList = memories.map((m, i) => `${i + 1}. ${m.value}`).join("\n");
    return `Here's what I remember:\n\n${memoryList}`;
  }

  return `I understand you said: "${message}". I'm using rule-based planning right now. I can help you remember things, create files (with approval), or coordinate agent tasks. What would you like me to do?`;
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
