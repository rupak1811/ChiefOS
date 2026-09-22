import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeSandboxFile } from "@/lib/sandbox";

/**
 * Approvals API - Execute approved actions
 * When approved: execute the pending action, write to sandbox, log to ledger
 * When rejected: log to ledger only
 * Respects kill switch
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { approvalId, action } = body;

    if (!approvalId || !action) {
      return NextResponse.json(
        { error: "Missing approvalId or action" },
        { status: 400 }
      );
    }

    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
      include: { token: { include: { agent: true } } },
    });

    if (!approval || approval.userId !== session.user.id) {
      return NextResponse.json({ error: "Approval not found" }, { status: 404 });
    }

    if (approval.status !== "pending") {
      return NextResponse.json(
        { error: "Approval already resolved" },
        { status: 400 }
      );
    }

    // Check kill switch before executing
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { killSwitch: true },
    });

    if (action === "approve" && user?.killSwitch) {
      // Log kill switch block
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: approval.token.agentId,
          action: `Approval execution blocked by kill switch: ${approval.action}`,
          scope: approval.scope,
          metadata: approval.metadata || "{}",
          result: "blocked",
        },
      });

      return NextResponse.json(
        { error: "Kill switch is enabled. Cannot execute approval." },
        { status: 403 }
      );
    }

    let executionResult = "rejected";
    let executionMetadata: any = {};

    // Execute if approved
    if (action === "approve") {
      try {
        const metadata = approval.metadata ? JSON.parse(approval.metadata) : {};
        
        // Execute based on scope
        if (approval.scope === "code:write" && metadata.fileName) {
          const writeResult = await writeSandboxFile(
            metadata.fileName, 
            metadata.content || "",
            session.user.id
          );
          
          executionResult = writeResult.success ? "success" : "failed";
          executionMetadata = {
            fileName: metadata.fileName,
            writeResult,
          };
        } else {
          executionResult = "success";
          executionMetadata = { action: "executed" };
        }
      } catch (error) {
        console.error("Approval execution error:", error);
        executionResult = "failed";
        executionMetadata = { error: String(error) };
      }
    }

    // Update approval status
    const updated = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: action === "approve" ? "approved" : "rejected",
        resolvedAt: new Date(),
      },
    });

    // Write to ActionLedger
    await prisma.actionLedger.create({
      data: {
        userId: session.user.id,
        agentId: approval.token.agentId,
        action: `Approval ${action}: ${approval.action}`,
        scope: approval.scope,
        metadata: JSON.stringify({
          approvalId: approval.id,
          execution: executionMetadata,
        }),
        result: executionResult,
      },
    });

    return NextResponse.json({
      success: true,
      approval: updated,
      execution: {
        result: executionResult,
        metadata: executionMetadata,
      },
    });
  } catch (error) {
    console.error("Approval processing error:", error);
    return NextResponse.json(
      { error: "Failed to process approval" },
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = { userId: session.user.id };
    if (status) {
      where.status = status;
    }

    const approvals = await prisma.approval.findMany({
      where,
      include: {
        token: {
          include: { agent: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, approvals });
  } catch (error) {
    console.error("Approvals list error:", error);
    return NextResponse.json(
      { error: "Failed to list approvals" },
      { status: 500 }
    );
  }
}
