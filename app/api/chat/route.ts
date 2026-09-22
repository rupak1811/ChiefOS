import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Chat API - User interface to agent system
 * Orchestrates via Lead agent API for planning and execution
 * Routes actions to Memory, Code, and Guardian agents as needed
 */

interface Message {
  role: "user" | "assistant";
  content: string;
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

    const lowerMessage = message.toLowerCase();

    // Route to Memory agent for memory operations
    if (lowerMessage.includes("remember") || lowerMessage.includes("save")) {
      const keyMatch = message.match(/remember\s+(?:that\s+)?(.+)/i);
      if (keyMatch) {
        const content = keyMatch[1].trim();
        
        const memoryResponse = await fetch(
          new URL("/api/agents/memory", request.url).toString(),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "write",
              value: content,
            }),
          }
        );

        if (!memoryResponse.ok) {
          const error = await memoryResponse.json();
          return NextResponse.json({ response: error.error || "Failed to save memory" });
        }

        const result = await memoryResponse.json();
        return NextResponse.json({
          response: `I've remembered: "${content}". Stored in Memory agent.`,
        });
      }
    }

    // Route to Memory agent for recall
    if (lowerMessage.includes("memory") || lowerMessage.includes("what do you remember")) {
      const memoryResponse = await fetch(
        new URL("/api/agents/memory", request.url).toString(),
        {
          method: "GET",
        }
      );

      if (!memoryResponse.ok) {
        return NextResponse.json({ response: "Failed to retrieve memories" });
      }

      const result = await memoryResponse.json();
      
      if (result.memories.length === 0) {
        return NextResponse.json({
          response: "I don't have any memories stored yet. Ask me to remember something!",
        });
      }

      const memoryList = result.memories
        .slice(0, 5)
        .map((m: any, i: number) => `${i + 1}. ${m.value}`)
        .join("\n");
      
      return NextResponse.json({
        response: `Here's what I remember:\n\n${memoryList}`,
      });
    }

    // Route to Code agent for file operations
    if (lowerMessage.includes("create") && (lowerMessage.includes("file") || lowerMessage.includes("sandbox"))) {
      const fileNameMatch = message.match(/create\s+(?:a\s+)?(\S+\.?\w*)\s+file/i) || 
                           message.match(/file\s+(?:called\s+)?(\S+\.?\w*)/i);
      const fileName = fileNameMatch ? fileNameMatch[1] : "output.txt";

      const codeResponse = await fetch(
        new URL("/api/agents/code", request.url).toString(),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_file",
            fileName,
            content: `Hello from ChiefOS!\nCreated at: ${new Date().toISOString()}`,
          }),
        }
      );

      if (!codeResponse.ok) {
        const error = await codeResponse.json();
        return NextResponse.json({ response: error.error || "Failed to create file" });
      }

      const result = await codeResponse.json();
      
      if (result.approval) {
        return NextResponse.json({
          response: `I need your approval to create the file "${fileName}" in the sandbox. Please check the Approvals page. Approval ID: ${result.approval.id}`,
        });
      }

      return NextResponse.json({ response: "File creation initiated" });
    }

    // Route to Guardian agent for security status
    if (lowerMessage.includes("kill switch") || lowerMessage.includes("security") || lowerMessage.includes("status")) {
      const guardianResponse = await fetch(
        new URL("/api/agents/guardian", request.url).toString(),
        {
          method: "GET",
        }
      );

      if (!guardianResponse.ok) {
        return NextResponse.json({ response: "Failed to check security status" });
      }

      const result = await guardianResponse.json();
      
      return NextResponse.json({
        response: `Security Status:
- Kill Switch: ${result.killSwitch ? "ENABLED 🔴" : "DISABLED 🟢"}
- Pending Approvals: ${result.pendingApprovals}

${result.killSwitch ? "All agent mutations are currently blocked." : "System is operational."}`,
      });
    }

    // Help / default response via Lead agent
    if (lowerMessage.includes("what can you") || lowerMessage.includes("help")) {
      return NextResponse.json({
        response: `I'm Lead, your orchestrator agent. I can help you with:

1. **Remember things**: Ask me to remember information (Memory agent)
2. **Create files**: Request file creation in the sandbox (Code agent, requires approval)
3. **Check security**: View kill switch and approval status (Guardian agent)

Try asking:
- "Remember that my favorite color is blue"
- "Create a hello.txt file"
- "What's in my memory?"
- "What's my security status?"

All sensitive operations require your approval and respect the kill switch.`,
      });
    }

    // Default: acknowledge and guide
    const leadAgent = await prisma.agent.findFirst({ where: { name: "Lead" } });
    if (leadAgent) {
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: leadAgent.id,
          action: "Chat message processed",
          scope: "chat:orchestrate",
          metadata: JSON.stringify({ message: message.substring(0, 100) }),
          result: "info",
        },
      });
    }

    return NextResponse.json({
      response: `I received your message: "${message}". 

I can help you:
- Remember information
- Create files (with approval)
- Check your security status

What would you like to do?`,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
