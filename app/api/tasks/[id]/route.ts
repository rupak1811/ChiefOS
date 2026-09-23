import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tasks/:id - Get task by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.workItem.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      project: true,
      agent: true,
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PATCH /api/tasks/:id - Update task
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, status, agentId } = body;

  const task = await prisma.workItem.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const updated = await prisma.workItem.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(agentId !== undefined && { agentId }),
      updatedAt: new Date(),
    },
    include: {
      project: true,
      agent: true,
    },
  });

  if (status && status !== task.status) {
    const guardianAgent = await prisma.agent.findFirst({
      where: { 
        userId: session.user.id,
        name: "Guardian"
      },
    });

    if (guardianAgent) {
      await prisma.actionLedger.create({
        data: {
          userId: session.user.id,
          agentId: guardianAgent.id,
          action: "task:update",
          scope: `task:${id}`,
          metadata: JSON.stringify({ oldStatus: task.status, newStatus: status }),
          result: "success",
        },
      });
    }
  }

  return NextResponse.json(updated);
}

// DELETE /api/tasks/:id - Delete task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.workItem.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await prisma.workItem.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
