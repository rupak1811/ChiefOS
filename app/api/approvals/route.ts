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
    const { approvalId, action } = body;

    if (!approvalId || !action) {
      return NextResponse.json(
        { error: "Missing approvalId or action" },
        { status: 400 }
      );
    }

    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
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

    const updated = await prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: action === "approve" ? "approved" : "rejected",
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, approval: updated });
  } catch (error) {
    console.error("Approval processing error:", error);
    return NextResponse.json(
      { error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
