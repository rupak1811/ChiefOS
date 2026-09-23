import { prisma } from "@/lib/prisma";

/**
 * Seed default agents for a user on first login
 */
export async function seedDefaultAgentsForUser(userId: string) {
  // Check if user already has agents
  const existingAgents = await prisma.agent.count({
    where: { userId },
  });

  if (existingAgents > 0) {
    return; // User already has agents
  }

  const agents = [
    {
      userId,
      name: "Lead",
      title: "Project Coordinator",
      description: "Orchestrator agent for planning and coordination",
      instructions: "Help coordinate work, manage projects, and ensure smooth collaboration between team members. Break down complex tasks and assign them appropriately.",
      capabilities: JSON.stringify(["plan", "coordinate", "delegate"]),
      avatarColor: "#3B82F6",
      avatarShape: "circle",
      status: "active",
      isActive: true,
    },
    {
      userId,
      name: "Memory",
      title: "Knowledge Keeper",
      description: "Persistent knowledge store and context manager",
      instructions: "Maintain context across conversations, remember important details, and help recall previous decisions and information.",
      capabilities: JSON.stringify(["memory", "context", "recall"]),
      avatarColor: "#8B5CF6",
      avatarShape: "circle",
      status: "active",
      isActive: true,
    },
    {
      userId,
      name: "Code",
      title: "Implementation Specialist",
      description: "Technical implementation and problem-solving",
      instructions: "Build features, fix bugs, write clean code, and solve technical challenges. Focus on quality, testing, and documentation.",
      capabilities: JSON.stringify(["code", "build", "debug"]),
      avatarColor: "#10B981",
      avatarShape: "circle",
      status: "active",
      isActive: true,
    },
    {
      userId,
      name: "Guardian",
      title: "Security Monitor",
      description: "Security monitor and policy enforcement",
      instructions: "Monitor all operations, maintain the action ledger, ensure capabilities are used appropriately, and enforce security policies.",
      capabilities: JSON.stringify(["security", "approval", "audit"]),
      avatarColor: "#F59E0B",
      avatarShape: "circle",
      status: "active",
      isActive: true,
    },
  ];

  await prisma.agent.createMany({
    data: agents,
  });

  console.log(`✓ Seeded default agents for user ${userId}`);
}
