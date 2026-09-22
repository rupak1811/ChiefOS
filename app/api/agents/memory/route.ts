import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Memory Agent - Knowledge Storage & Retrieval
 * Handles reading and writing user memories
 * Write operations are gated by kill switch
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, key, value } = body;

    const memoryAgent = await prisma.agent.findFirst({
      where: { name: "Memory" },
    });

    if (!memoryAgent) {
      return NextResponse.json(
        { error: "Memory agent not initialized" },
        { status: 500 }
      );
    }

    // Read operation - no kill switch check needed
    if (action === "read" || action === "list") {
      const memories = await prisma.memory.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: memoryAgent.id,
          action: "Memory read",
          scope: "memory:read",
          metadata: JSON.stringify({ count: memories.length }),
          result: "success",
        },
      });

      return NextResponse.json({ success: true, memories });
    }

    // Write operation - requires kill switch check
    if (action === "write" || action === "store") {
      // Check kill switch
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { killSwitch: true },
      });

      if (user?.killSwitch) {
        await prisma.actionLedger.create({
          data: {
            userId: session.user.id,
            agentId: memoryAgent.id,
            action: "Memory write blocked by kill switch",
            scope: "memory:write",
            metadata: JSON.stringify({ key, value }),
            result: "blocked",
          },
        });

        return NextResponse.json(
          { error: "Kill switch is enabled. Memory writes are blocked." },
          { status: 403 }
        );
      }

      // Store memory
      const memory = await prisma.memory.upsert({
        where: {
          userId_key: {
            userId: session.user.id,
            key: key || `note_${Date.now()}`,
          },
        },
        update: { value },
        create: {
          userId: session.user.id,
          key: key || `note_${Date.now()}`,
          value,
        },
      });

      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: memoryAgent.id,
          action: "Memory write",
          scope: "memory:write",
          metadata: JSON.stringify({ key: memory.key, value: value.substring(0, 100) }),
          result: "success",
        },
      });

      return NextResponse.json({ success: true, memory });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'read', 'list', 'write', or 'store'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Memory agent error:", error);
    return NextResponse.json(
      { error: "Memory agent processing failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memories = await prisma.memory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const memoryAgent = await prisma.agent.findFirst({
      where: { name: "Memory" },
    });

    if (memoryAgent) {
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: memoryAgent.id,
          action: "Memory list",
          scope: "memory:read",
          metadata: JSON.stringify({ count: memories.length }),
          result: "success",
        },
      });
    }

    return NextResponse.json({ success: true, memories });
  } catch (error) {
    console.error("Memory agent GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve memories" },
      { status: 500 }
    );
  }
}
