import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Capability Tokens API
 * Mint, list, and revoke capability tokens for agent operations
 * Tokens have scopes, expiry, and can be revoked
 */

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeRevoked = searchParams.get("includeRevoked") === "true";

    const where: any = {
      userId: session.user.id,
    };

    if (!includeRevoked) {
      where.revokedAt = null;
    }

    const tokens = await prisma.capabilityToken.findMany({
      where,
      include: {
        agent: {
          select: { name: true, description: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Check which tokens are expired or revoked
    const now = new Date();
    const tokensWithStatus = tokens.map(token => ({
      ...token,
      isValid: !token.revokedAt && token.expiresAt > now,
      isExpired: token.expiresAt <= now,
      isRevoked: !!token.revokedAt,
    }));

    return NextResponse.json({ success: true, tokens: tokensWithStatus });
  } catch (error) {
    console.error("Token list error:", error);
    return NextResponse.json(
      { error: "Failed to list tokens" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, tokenId, agentId, agentName, scopes, expiresInHours } = body;

    // Mint new token
    if (action === "mint" || action === "create") {
      if (!scopes) {
        return NextResponse.json(
          { error: "Scopes are required" },
          { status: 400 }
        );
      }

      // Find agent by ID or name
      let agent = null;
      if (agentId) {
        agent = await prisma.agent.findUnique({ where: { id: agentId } });
      } else if (agentName) {
        agent = await prisma.agent.findFirst({ where: { name: agentName } });
      } else {
        return NextResponse.json(
          { error: "agentId or agentName is required" },
          { status: 400 }
        );
      }

      if (!agent) {
        return NextResponse.json(
          { error: "Agent not found" },
          { status: 404 }
        );
      }

      const expiresAt = new Date(
        Date.now() + (expiresInHours || 24) * 60 * 60 * 1000
      );

      const token = await prisma.capabilityToken.create({
        data: {
          userId: session.user.id,
          agentId: agent.id,
          scopes: Array.isArray(scopes) ? scopes.join(",") : scopes,
          expiresAt,
        },
        include: {
          agent: {
            select: { name: true, description: true },
          },
        },
      });

      // Log to ledger
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: agent.id,
          action: "Token minted",
          scope: "token:mint",
          metadata: JSON.stringify({
            tokenId: token.id,
            scopes: token.scopes,
            expiresAt: token.expiresAt,
          }),
          result: "success",
        },
      });

      return NextResponse.json({ success: true, token });
    }

    // Revoke token
    if (action === "revoke") {
      if (!tokenId) {
        return NextResponse.json(
          { error: "tokenId is required" },
          { status: 400 }
        );
      }

      const token = await prisma.capabilityToken.findFirst({
        where: {
          id: tokenId,
          userId: session.user.id,
        },
      });

      if (!token) {
        return NextResponse.json(
          { error: "Token not found" },
          { status: 404 }
        );
      }

      if (token.revokedAt) {
        return NextResponse.json(
          { error: "Token already revoked" },
          { status: 400 }
        );
      }

      const updated = await prisma.capabilityToken.update({
        where: { id: tokenId },
        data: { revokedAt: new Date() },
        include: {
          agent: {
            select: { name: true },
          },
        },
      });

      // Log to ledger
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: updated.agentId,
          action: "Token revoked",
          scope: "token:revoke",
          metadata: JSON.stringify({ tokenId: updated.id }),
          result: "success",
        },
      });

      return NextResponse.json({ success: true, token: updated });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'mint' or 'revoke'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Token action error:", error);
    return NextResponse.json(
      { error: "Token action failed" },
      { status: 500 }
    );
  }
}
