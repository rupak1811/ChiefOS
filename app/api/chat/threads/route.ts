import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/chat/threads - List chat threads
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const agentId = searchParams.get("agentId");

  const threads = await prisma.chatThread.findMany({
    where: {
      userId: session.user.id,
      ...(projectId && { projectId }),
      ...(agentId && { agentId }),
    },
    include: {
      agent: {
        select: {
          id: true,
          name: true,
          title: true,
          avatarColor: true,
          avatarShape: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(threads);
}

// POST /api/chat/threads - Create new chat thread
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, projectId, agentId, teamId } = body;

  const thread = await prisma.chatThread.create({
    data: {
      userId: session.user.id,
      title: title || null,
      projectId: projectId || null,
      agentId: agentId || null,
      teamId: teamId || null,
    },
    include: {
      agent: true,
      project: true,
      team: true,
    },
  });

  return NextResponse.json(thread, { status: 201 });
}
