import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects/:id - Get project by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      agents: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
      teams: {
        include: {
          members: {
            include: {
              agent: true,
            },
          },
        },
      },
      chatThreads: {
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
      workItems: {
        orderBy: { updatedAt: "desc" },
        take: 20,
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PATCH /api/projects/:id - Update project
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
  const { name, description, color } = body;

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(color && { color }),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/projects/:id - Delete project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
