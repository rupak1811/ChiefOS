import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/agents/:id - Get agent by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agent = await prisma.agent.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      project: true,
      chatThreads: {
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
      workItems: {
        orderBy: { updatedAt: "desc" },
        take: 20,
      },
      teamMembers: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json(agent);
}

// PATCH /api/agents/:id - Update agent
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
  const {
    name,
    title,
    description,
    instructions,
    avatarColor,
    avatarShape,
    status,
    capabilities,
  } = body;

  const agent = await prisma.agent.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const updated = await prisma.agent.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(instructions !== undefined && { instructions }),
      ...(avatarColor && { avatarColor }),
      ...(avatarShape && { avatarShape }),
      ...(status && { status }),
      ...(capabilities && { capabilities: JSON.stringify(capabilities) }),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/agents/:id - Delete agent
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agent = await prisma.agent.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  await prisma.agent.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
