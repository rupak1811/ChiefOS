/**
 * Local Agent Runner
 * Provides deterministic agent responses with optional OpenAI integration
 */

interface AgentContext {
  agent: {
    id: string;
    name: string;
    title?: string | null;
    instructions?: string | null;
    capabilities: string;
  };
  thread: {
    id: string;
    title?: string | null;
  };
  messages: Array<{
    role: string;
    content: string;
    createdAt: Date;
  }>;
  userMessage: string;
}

/**
 * Deterministic agent responses based on agent name and message content
 */
function generateDeterministicResponse(ctx: AgentContext): string {
  const { agent, userMessage } = ctx;
  const lowerMsg = userMessage.toLowerCase();

  // Agent-specific responses
  switch (agent.name) {
    case "Lead":
      if (lowerMsg.includes("task") || lowerMsg.includes("work")) {
        return `I'll help coordinate this task. Let me break it down:\n\n1. Understanding the requirements\n2. Creating a plan\n3. Assigning to the right team members\n4. Tracking progress\n\nI'll work with Memory to track context and Code for implementation. Should I create a work item for this?`;
      }
      if (lowerMsg.includes("project")) {
        return `Great! Let's set up this project properly. I recommend:\n\n- Clear objectives and milestones\n- Team roles and responsibilities\n- Communication channels\n- Regular check-ins\n\nWhat's the primary goal for this project?`;
      }
      return `As the Lead agent, I'm here to help coordinate work, manage projects, and ensure smooth collaboration. What would you like to work on?`;

    case "Memory":
      if (lowerMsg.includes("remember") || lowerMsg.includes("save")) {
        return `I've noted that information. I'll maintain context across our conversations and can recall it when needed. Is there anything specific you'd like me to associate with this memory?`;
      }
      if (lowerMsg.includes("recall") || lowerMsg.includes("what")) {
        return `Let me check our conversation history... Based on what we've discussed, I can help you recall previous decisions, context, and important details. What specific information are you looking for?`;
      }
      return `I maintain context and memory for our collaboration. I can remember important details, decisions, and help maintain continuity across projects. What would you like me to remember?`;

    case "Code":
      if (lowerMsg.includes("bug") || lowerMsg.includes("fix") || lowerMsg.includes("error")) {
        return `I'll investigate this issue. Let me check:\n\n1. Error logs and stack traces\n2. Recent code changes\n3. Related components\n4. Test coverage\n\nCan you provide more details about when this occurs?`;
      }
      if (lowerMsg.includes("implement") || lowerMsg.includes("build") || lowerMsg.includes("create")) {
        return `I can help implement this feature. I'll:\n\n1. Review the requirements\n2. Design the solution\n3. Write clean, tested code\n4. Document the implementation\n\nShall I create a work item and start on this?`;
      }
      return `I'm Code, specializing in implementation and technical problem-solving. I can help build features, fix bugs, and write clean, maintainable code. What can I build for you?`;

    case "Guardian":
      if (lowerMsg.includes("approve") || lowerMsg.includes("permission")) {
        return `I'll review this capability request. Security and permissions are critical. I need to verify:\n\n- Scope of access required\n- Justification for capabilities\n- Potential security implications\n- Audit trail requirements\n\nPlease provide the details of what needs approval.`;
      }
      if (lowerMsg.includes("security") || lowerMsg.includes("safe")) {
        return `Security is my primary concern. I monitor all operations, maintain the ledger, and ensure capabilities are used appropriately. All sensitive actions require my approval. What security aspect would you like to discuss?`;
      }
      return `I'm Guardian, responsible for security, approvals, and maintaining the action ledger. I ensure all operations are authorized and tracked. How can I help secure your work?`;

    default:
      // Generic helpful response
      if (lowerMsg.includes("help")) {
        return `I'm ${agent.name}, and I'm here to assist you. ${agent.instructions || "I can help with various tasks based on my capabilities."}\n\nWhat would you like to work on?`;
      }
      if (lowerMsg.includes("task") || lowerMsg.includes("work")) {
        return `I can help with that. Let me know the details and I'll do my best to assist. Should I create a work item to track this?`;
      }
      return `Hello! I'm ${agent.name}${agent.title ? ` - ${agent.title}` : ""}. ${agent.instructions || "I'm ready to help."}\n\nWhat can I do for you today?`;
  }
}

/**
 * Generate agent response using OpenAI if available, fallback to deterministic
 */
async function generateOpenAIResponse(ctx: AgentContext): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return generateDeterministicResponse(ctx);
  }

  try {
    // Simple OpenAI completion (no SDK, just fetch)
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
            content: `You are ${ctx.agent.name}${ctx.agent.title ? `, ${ctx.agent.title}` : ""}. ${ctx.agent.instructions || ""}\n\nYou are an AI teammate in ChiefOS, a multi-agent workspace. Be helpful, concise, and professional.`,
          },
          ...ctx.messages.slice(-5).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
          {
            role: "user",
            content: ctx.userMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.warn("OpenAI API error, falling back to deterministic");
      return generateDeterministicResponse(ctx);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || generateDeterministicResponse(ctx);
  } catch (error) {
    console.error("OpenAI error:", error);
    return generateDeterministicResponse(ctx);
  }
}

/**
 * Main agent runner - generates response for a user message
 */
export async function runAgent(ctx: AgentContext): Promise<string> {
  // Try OpenAI first if configured, otherwise use deterministic
  if (process.env.OPENAI_API_KEY) {
    return await generateOpenAIResponse(ctx);
  }
  return generateDeterministicResponse(ctx);
}
