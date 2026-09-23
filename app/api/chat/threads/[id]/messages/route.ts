import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runAgent } from "@/lib/agent-runner";

// POST /api/chat/threads/:id/messages - Send message and get agent response
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  const thread = await prisma.chatThread.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      agent: true,
      messages: {
        orderBy: { createdAt: "asc" },
        take: 20,
      },
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const userMessage = await prisma.chatMessage.create({
    data: {
      threadId: id,
      userId: session.user.id,
      role: "user",
      content,
    },
  });

  let agentMessage = null;
  if (thread.agent) {
    const agentResponse = await runAgent({
      agent: thread.agent,
      thread,
      messages: thread.messages,
      userMessage: content,
    });

    agentMessage = await prisma.chatMessage.create({
      data: {
        threadId: id,
        userId: session.user.id,
        agentId: thread.agentId,
        role: "agent",
        content: agentResponse,
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
      },
    });

    await prisma.chatThread.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    await prisma.actionLedger.create({
      data: {
        userId: session.user.id,
        agentId: thread.agent.id,
        action: "chat:message",
        scope: `thread:${id}`,
        metadata: JSON.stringify({ messageLength: content.length }),
        result: "success",
      },
    });
  }

  return NextResponse.json({
    userMessage,
    agentMessage,
  });
}
