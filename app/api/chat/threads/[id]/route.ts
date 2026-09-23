import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/chat/threads/:id - Get thread with messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thread = await prisma.chatThread.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      agent: true,
      project: true,
      team: true,
      messages: {
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
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json(thread);
}

// DELETE /api/chat/threads/:id - Delete thread
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thread = await prisma.chatThread.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  await prisma.chatThread.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
