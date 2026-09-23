import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects - List user's projects
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          agents: true,
          teams: true,
          chatThreads: true,
          workItems: true,
        },
      },
    },
  });

  return NextResponse.json(projects);
}

// POST /api/projects - Create new project
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, slug, description, color } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  // Check if slug already exists for this user
  const existing = await prisma.project.findUnique({
    where: {
      userId_slug: {
        userId: session.user.id,
        slug,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Project slug already exists" },
      { status: 409 }
    );
  }

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      name,
      slug,
      description: description || null,
      color: color || "#2DD4BF",
    },
  });

  // Log to ledger - if there's a guardian agent
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
        action: "project:create",
        scope: `project:${project.id}`,
        metadata: JSON.stringify({ projectName: name, slug }),
        result: "success",
      },
    });
  }

  return NextResponse.json(project, { status: 201 });
}
