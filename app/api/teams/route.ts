import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/teams - List teams (optionally filtered by projectId)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const teams = await prisma.team.findMany({
    where: projectId
      ? {
          projectId,
          project: {
            userId: session.user.id,
          },
        }
      : {
          OR: [
            { project: { userId: session.user.id } },
            { projectId: null },
          ],
        },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      members: {
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              title: true,
              avatarColor: true,
              avatarShape: true,
              status: true,
            },
          },
        },
      },
      _count: {
        select: {
          chatThreads: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(teams);
}

// POST /api/teams - Create new team
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, projectId, memberAgentIds } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // If projectId is provided, verify ownership
  if (projectId) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
  }

  const team = await prisma.team.create({
    data: {
      name,
      description: description || null,
      projectId: projectId || null,
      members: {
        create: (memberAgentIds || []).map((agentId: string) => ({
          agentId,
          role: "member",
        })),
      },
    },
    include: {
      members: {
        include: {
          agent: true,
        },
      },
    },
  });

  return NextResponse.json(team, { status: 201 });
}
