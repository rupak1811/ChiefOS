import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/teams/:id - Get team by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const team = await prisma.team.findFirst({
    where: {
      id,
      OR: [
        { project: { userId: session.user.id } },
        { projectId: null },
      ],
    },
    include: {
      project: true,
      members: {
        include: {
          agent: true,
        },
      },
      chatThreads: {
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(team);
}

// PATCH /api/teams/:id - Update team
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
  const { name, description, memberAgentIds } = body;

  const team = await prisma.team.findFirst({
    where: {
      id,
      OR: [
        { project: { userId: session.user.id } },
        { projectId: null },
      ],
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const updated = await prisma.team.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      updatedAt: new Date(),
      ...(memberAgentIds && {
        members: {
          deleteMany: {},
          create: memberAgentIds.map((agentId: string) => ({
            agentId,
            role: "member",
          })),
        },
      }),
    },
    include: {
      members: {
        include: {
          agent: true,
        },
      },
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/teams/:id - Delete team
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const team = await prisma.team.findFirst({
    where: {
      id,
      OR: [
        { project: { userId: session.user.id } },
        { projectId: null },
      ],
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  await prisma.team.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
