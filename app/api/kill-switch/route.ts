import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "Invalid enabled value" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { killSwitch: enabled },
    });

    const guardianAgent = await prisma.agent.findFirst({
      where: { name: "Guardian" },
    });

    if (guardianAgent) {
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: guardianAgent.id,
          action: `Kill switch ${enabled ? "enabled" : "disabled"}`,
          scope: "security:control",
          metadata: JSON.stringify({ timestamp: new Date().toISOString() }),
          result: "success",
        },
      });
    }

    return NextResponse.json({ success: true, killSwitch: user.killSwitch });
  } catch (error) {
    console.error("Kill switch error:", error);
    return NextResponse.json(
      { error: "Failed to toggle kill switch" },
      { status: 500 }
    );
  }
}
