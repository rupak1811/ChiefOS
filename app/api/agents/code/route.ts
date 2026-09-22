import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Code Agent - Sandbox Operations
 * Handles file creation and sandbox execution
 * All operations require capability tokens and are gated by kill switch
 */

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, fileName, content, tokenId } = body;

    const codeAgent = await prisma.agent.findFirst({
      where: { name: "Code" },
    });

    if (!codeAgent) {
      return NextResponse.json(
        { error: "Code agent not initialized" },
        { status: 500 }
      );
    }

    // Check kill switch for ALL code operations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { killSwitch: true },
    });

    if (user?.killSwitch) {
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: codeAgent.id,
          action: `Code ${action} blocked by kill switch`,
          scope: "code:write",
          metadata: JSON.stringify({ fileName, action }),
          result: "blocked",
        },
      });

      return NextResponse.json(
        { error: "Kill switch is enabled. Code operations are blocked." },
        { status: 403 }
      );
    }

    // Verify or create capability token
    let token = null;
    if (tokenId) {
      token = await prisma.capabilityToken.findFirst({
        where: {
          id: tokenId,
          userId: session.user.id,
          agentId: codeAgent.id,
          expiresAt: { gt: new Date() },
          revokedAt: null,
        },
      });
    }

    if (!token) {
      // Auto-create token for demo purposes (in production, this should be explicit)
      token = await prisma.capabilityToken.create({
        data: {
          userId: session.user.id,
          agentId: codeAgent.id,
          scopes: "code:write,sandbox:execute",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });
    }

    // Check token scopes
    const requiredScope = action === "execute" ? "sandbox:execute" : "code:write";
    if (!token.scopes.includes(requiredScope)) {
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: codeAgent.id,
          action: `Code ${action} - insufficient scope`,
          scope: requiredScope,
          metadata: JSON.stringify({ fileName, tokenScopes: token.scopes }),
          result: "denied",
        },
      });

      return NextResponse.json(
        { error: `Token missing required scope: ${requiredScope}` },
        { status: 403 }
      );
    }

    // Create approval request (execution happens via approvals API)
    if (action === "create_file" || action === "write_file") {
      const approval = await prisma.approval.create({
        data: {
          userId: session.user.id,
          tokenId: token.id,
          action: `Create file: ${fileName}`,
          scope: "code:write",
          metadata: JSON.stringify({
            fileName,
            content: content || `Hello from ChiefOS!\nCreated at: ${new Date().toISOString()}`,
          }),
          status: "pending",
        },
      });

      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: codeAgent.id,
          action: "Code file creation requested",
          scope: "code:write",
          metadata: JSON.stringify({ fileName, approvalId: approval.id }),
          result: "approval_required",
        },
      });

      return NextResponse.json({
        success: true,
        approval: {
          id: approval.id,
          message: `Approval required to create file: ${fileName}`,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'create_file' or 'write_file'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Code agent error:", error);
    return NextResponse.json(
      { error: "Code agent processing failed" },
      { status: 500 }
    );
  }
}
