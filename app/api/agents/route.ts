import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/agents - List user's agents
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const agents = await prisma.agent.findMany({
    where: {
      userId: session.user.id,
      ...(projectId && { projectId }),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          chatThreads: true,
          workItems: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(agents);
}

// POST /api/agents - Create new agent
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    title,
    description,
    instructions,
    avatarColor,
    avatarShape,
    capabilities,
    projectId,
  } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Check if agent name already exists for this user
  const existing = await prisma.agent.findFirst({
    where: {
      userId: session.user.id,
      name,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Agent name already exists" },
      { status: 409 }
    );
  }

  const agent = await prisma.agent.create({
    data: {
      userId: session.user.id,
      name,
      title: title || null,
      description: description || "",
      instructions: instructions || null,
      avatarColor: avatarColor || "#2DD4BF",
      avatarShape: avatarShape || "circle",
      capabilities: JSON.stringify(capabilities || ["chat"]),
      projectId: projectId || null,
      isActive: true,
      status: "active",
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
        action: "agent:create",
        scope: `agent:${agent.id}`,
        metadata: JSON.stringify({ agentName: name }),
        result: "success",
      },
    });
  }

  return NextResponse.json(agent, { status: 201 });
}
