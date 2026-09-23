import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/tasks - List work items/tasks
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const agentId = searchParams.get("agentId");
  const status = searchParams.get("status");

  const tasks = await prisma.workItem.findMany({
    where: {
      userId: session.user.id,
      ...(projectId && { projectId }),
      ...(agentId && { agentId }),
      ...(status && { status }),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      agent: {
        select: {
          id: true,
          name: true,
          title: true,
          avatarColor: true,
          avatarShape: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks - Create new task
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, projectId, agentId, threadId, status } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const task = await prisma.workItem.create({
    data: {
      userId: session.user.id,
      title,
      description: description || null,
      projectId: projectId || null,
      agentId: agentId || null,
      threadId: threadId || null,
      status: status || "pending",
    },
    include: {
      project: true,
      agent: true,
    },
  });

  // Log to ledger
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
        action: "task:create",
        scope: `task:${task.id}`,
        metadata: JSON.stringify({ title }),
        result: "success",
      },
    });
  }

  return NextResponse.json(task, { status: 201 });
}
