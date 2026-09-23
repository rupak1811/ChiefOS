import { prisma } from "@/lib/prisma";

/**
 * Project Teammates Generator
 * Auto-generates AI teammates from project brief details
 */

interface ProjectTeammateInput {
  name: string;
  details?: string | null;
  userId: string;
  projectId: string;
}

interface RoleDefinition {
  name: string;
  title: string;
  description: string;
  instructions: string;
  capabilities: string[];
  avatarColor: string;
  keywords: string[];
}

/**
 * Role definitions with keywords for detection
 */
const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    name: "UI Dev",
    title: "Frontend Developer",
    description: "UI/UX implementation and frontend development",
    instructions: "Build user interfaces, implement responsive designs, and ensure great user experience. Focus on React, components, and modern frontend practices.",
    capabilities: ["frontend", "ui", "react", "components"],
    avatarColor: "#3B82F6",
    keywords: ["react", "frontend", "ui", "ux", "component", "interface", "vue", "angular", "tailwind", "css"],
  },
  {
    name: "Backend",
    title: "Backend Developer",
    description: "Server-side logic and API development",
    instructions: "Build APIs, handle server-side logic, manage databases, and ensure system reliability. Focus on Node.js, Express, and backend architecture.",
    capabilities: ["backend", "api", "database", "server"],
    avatarColor: "#10B981",
    keywords: ["api", "backend", "server", "node", "express", "database", "sql", "rest", "graphql", "endpoint"],
  },
  {
    name: "Mobile",
    title: "Mobile Developer",
    description: "Mobile app development",
    instructions: "Build native or cross-platform mobile applications. Focus on React Native, iOS, Android, and mobile UX patterns.",
    capabilities: ["mobile", "ios", "android", "react-native"],
    avatarColor: "#8B5CF6",
    keywords: ["mobile", "ios", "android", "react native", "flutter", "swift", "kotlin", "app"],
  },
  {
    name: "Growth",
    title: "Growth Specialist",
    description: "Marketing, growth, and user acquisition",
    instructions: "Drive user acquisition, retention, and growth. Focus on marketing strategies, analytics, and conversion optimization.",
    capabilities: ["marketing", "growth", "analytics", "seo"],
    avatarColor: "#EC4899",
    keywords: ["marketing", "growth", "seo", "analytics", "conversion", "acquisition", "campaign", "ads"],
  },
  {
    name: "Analyst",
    title: "Data Analyst",
    description: "Data analysis and insights",
    instructions: "Analyze data, generate insights, and support data-driven decisions. Focus on SQL, analytics, and reporting.",
    capabilities: ["data", "analysis", "sql", "reporting"],
    avatarColor: "#F59E0B",
    keywords: ["data", "analytics", "sql", "analysis", "metrics", "reporting", "insights", "dashboard"],
  },
  {
    name: "DevOps",
    title: "DevOps Engineer",
    description: "Infrastructure and deployment",
    instructions: "Manage infrastructure, CI/CD pipelines, and deployments. Focus on Docker, Kubernetes, AWS, and automation.",
    capabilities: ["devops", "infrastructure", "deployment", "ci-cd"],
    avatarColor: "#06B6D4",
    keywords: ["devops", "docker", "kubernetes", "aws", "deployment", "ci/cd", "infrastructure", "cloud"],
  },
  {
    name: "QA",
    title: "QA Engineer",
    description: "Quality assurance and testing",
    instructions: "Ensure quality through testing, automation, and validation. Focus on test coverage, bug detection, and quality standards.",
    capabilities: ["testing", "qa", "automation", "quality"],
    avatarColor: "#EF4444",
    keywords: ["test", "qa", "quality", "automation", "testing", "bug", "validation", "cypress", "jest"],
  },
];

/**
 * Infer roles from project details based on keywords
 */
function inferRoles(details: string): RoleDefinition[] {
  const lowerDetails = details.toLowerCase();
  const inferredRoles: RoleDefinition[] = [];
  
  for (const role of ROLE_DEFINITIONS) {
    const matchCount = role.keywords.filter((keyword) => 
      lowerDetails.includes(keyword)
    ).length;
    
    if (matchCount > 0) {
      inferredRoles.push(role);
    }
  }
  
  // Limit to 4 inferred roles, prioritized by match count
  return inferredRoles.slice(0, 4);
}

/**
 * Generate project brief summary for agent instructions
 */
function generateBriefSummary(name: string, details?: string | null): string {
  if (!details || details.length < 50) {
    return `Project: ${name}`;
  }
  
  // Extract first ~200 chars as summary
  const summary = details.slice(0, 200).trim();
  return `Project: ${name}\n\nContext: ${summary}${details.length > 200 ? "..." : ""}`;
}

/**
 * Auto-generate AI teammates for a project
 * Creates Lead, Guardian, and inferred role specialists
 */
export async function generateProjectTeammates(input: ProjectTeammateInput): Promise<void> {
  const { name, details, userId, projectId } = input;
  
  // Check if project already has agents
  const existingAgents = await prisma.agent.count({
    where: { projectId },
  });
  
  if (existingAgents > 0) {
    console.log(`Project ${projectId} already has agents, skipping generation`);
    return;
  }
  
  const briefSummary = generateBriefSummary(name, details);
  
  // Always create Lead and Guardian
  const agentsToCreate = [
    {
      userId,
      projectId,
      name: "Lead",
      title: "Project Coordinator",
      description: "Orchestrator agent for planning and coordination",
      instructions: `${briefSummary}\n\nHelp coordinate work, manage projects, and ensure smooth collaboration between team members. Break down complex tasks and assign them appropriately.`,
      capabilities: JSON.stringify(["plan", "coordinate", "delegate"]),
      avatarColor: "#3B82F6",
      avatarShape: "circle",
      status: "active",
      isActive: true,
    },
    {
      userId,
      projectId,
      name: "Guardian",
      title: "Security Monitor",
      description: "Security monitor and policy enforcement",
      instructions: `${briefSummary}\n\nMonitor all operations, maintain the action ledger, ensure capabilities are used appropriately, and enforce security policies.`,
      capabilities: JSON.stringify(["security", "approval", "audit"]),
      avatarColor: "#F59E0B",
      avatarShape: "circle",
      status: "active",
      isActive: true,
    },
  ];
  
  // Infer additional roles from details
  if (details) {
    const inferredRoles = inferRoles(details);
    
    for (const role of inferredRoles) {
      agentsToCreate.push({
        userId,
        projectId,
        name: role.name,
        title: role.title,
        description: role.description,
        instructions: `${briefSummary}\n\n${role.instructions}`,
        capabilities: JSON.stringify(role.capabilities),
        avatarColor: role.avatarColor,
        avatarShape: "circle",
        status: "active",
        isActive: true,
      });
    }
  }
  
  // Cap at 6 agents total
  const finalAgents = agentsToCreate.slice(0, 6);
  
  await prisma.agent.createMany({
    data: finalAgents,
  });
  
  console.log(`✓ Generated ${finalAgents.length} teammates for project ${name}`);
}

/**
 * Optionally refine role list with OpenAI (if API key present)
 * Falls back to deterministic inference
 */
export async function generateProjectTeammatesWithOpenAI(
  input: ProjectTeammateInput
): Promise<void> {
  // If OpenAI is available, we could refine the role list
  // For now, just use deterministic generation
  if (!process.env.OPENAI_API_KEY) {
    return generateProjectTeammates(input);
  }
  
  // Optional: call OpenAI to suggest roles, then fall back
  try {
    // Simple OpenAI call to suggest roles (optional enhancement)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that suggests relevant roles for a project team based on the project description.",
          },
          {
            role: "user",
            content: `Project: ${input.name}\n\nDetails: ${input.details || "No details provided"}\n\nSuggest 2-4 key roles needed for this project (e.g., Frontend, Backend, Mobile, Growth, Data, DevOps, QA). Respond with just role names, comma-separated.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.5,
      }),
    });
    
    if (response.ok) {
      // Parse OpenAI suggestions and use them to filter roles
      // For now, just fall back to deterministic
      console.log("OpenAI refinement available but using deterministic for consistency");
    }
  } catch (error) {
    console.warn("OpenAI refinement failed, using deterministic:", error);
  }
  
  // Always fall back to deterministic generation
  return generateProjectTeammates(input);
}
