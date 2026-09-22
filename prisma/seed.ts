import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding agents...");

  const agents = [
    {
      name: "Lead",
      description: "Orchestrator agent for planning and coordination",
      capabilities: "plan:create,task:delegate,agent:coordinate",
      isActive: true,
    },
    {
      name: "Memory",
      description: "Persistent knowledge store for your organization",
      capabilities: "memory:read,memory:write",
      isActive: true,
    },
    {
      name: "Code",
      description: "Sandboxed code execution and file operations",
      capabilities: "code:read,code:write,sandbox:execute",
      isActive: true,
    },
    {
      name: "Guardian",
      description: "Security monitor and policy enforcement",
      capabilities: "security:validate,ledger:write,policy:enforce",
      isActive: true,
    },
  ];

  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { name: agent.name },
      update: {},
      create: agent,
    });
  }

  console.log("✓ Agents seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
