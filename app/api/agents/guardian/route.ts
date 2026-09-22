import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Guardian Agent - Security & Policy Enforcement
 * Handles kill switch, ledger queries, and security events
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const guardianAgent = await prisma.agent.findFirst({
      where: { name: "Guardian" },
    });

    if (!guardianAgent) {
      return NextResponse.json(
        { error: "Guardian agent not initialized" },
        { status: 500 }
      );
    }

    // Status check
    if (action === "status" || action === "check") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { killSwitch: true },
      });

      const recentEvents = await prisma.actionLedger.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: "desc" },
        take: 10,
      });

      const pendingApprovals = await prisma.approval.findMany({
        where: {
          userId: session.user.id,
          status: "pending",
        },
        orderBy: { createdAt: "desc" },
      });

      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: guardianAgent.id,
          action: "Security status check",
          scope: "security:read",
          metadata: JSON.stringify({ 
            killSwitch: user?.killSwitch,
            pendingApprovals: pendingApprovals.length 
          }),
          result: "success",
        },
      });

      return NextResponse.json({
        success: true,
        status: {
          killSwitch: user?.killSwitch || false,
          pendingApprovals: pendingApprovals.length,
          recentEvents: recentEvents.length,
        },
      });
    }

    // Ledger query
    if (action === "ledger" || action === "audit") {
      const entries = await prisma.actionLedger.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: "desc" },
        take: 50,
        include: {
          agent: {
            select: { name: true },
          },
        },
      });

      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: guardianAgent.id,
          action: "Ledger query",
          scope: "security:read",
          metadata: JSON.stringify({ entriesReturned: entries.length }),
          result: "success",
        },
      });

      return NextResponse.json({ success: true, entries });
    }

    // Security event logging
    if (action === "log_event") {
      const { eventType, metadata } = body;

      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: guardianAgent.id,
          action: `Security event: ${eventType}`,
          scope: "security:log",
          metadata: JSON.stringify(metadata || {}),
          result: "logged",
        },
      });

      return NextResponse.json({ success: true, logged: true });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'status', 'ledger', or 'log_event'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Guardian agent error:", error);
    return NextResponse.json(
      { error: "Guardian agent processing failed" },
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

    // Quick status endpoint
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { killSwitch: true },
    });

    const pendingApprovals = await prisma.approval.count({
      where: {
        userId: session.user.id,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      killSwitch: user?.killSwitch || false,
      pendingApprovals,
    });
  } catch (error) {
    console.error("Guardian agent GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve status" },
      { status: 500 }
    );
  }
}
