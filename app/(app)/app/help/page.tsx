import GlassCard from "@/components/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { HelpCircle, Shield, Power, CheckSquare, Users, Settings } from "lucide-react";

const faqs = [
  {
    icon: HelpCircle,
    question: "What is ChiefOS?",
    answer: "ChiefOS is a multi-agent operating system with permissioned control. Lead co-ordinates specialist agents for mail, chat, code, design, and ops. Every sensitive action requires your approval.",
  },
  {
    icon: Users,
    question: "Who is Lead?",
    answer: "Lead is your orchestrator agent. Lead co-ordinates hand-offs between specialist agents, flags blockers, and keeps delivery moving. Lead creates plans but waits for your approval before sensitive actions.",
  },
  {
    icon: Shield,
    question: "What are permissions?",
    answer: "Permissions define what each agent can do. Agents work within capability tokens with specific scopes (like code:write or send:*). Sensitive scopes require approval before execution.",
  },
  {
    icon: CheckSquare,
    question: "How approvals work",
    answer: "When an agent wants to perform a sensitive action, Lead creates an approval request. You review the draft, then Approve or Deny. Approved actions execute immediately unless kill switch is on.",
  },
  {
    icon: Power,
    question: "What is kill switch?",
    answer: "Kill switch pauses all agent operations instantly. When enabled, approvals will not run until you resume. Only the owner can turn kill switch off. Use this for emergency stops or when you need full control.",
  },
  {
    icon: Settings,
    question: "Where to find controls",
    answer: "Dashboard shows active agents and pending approvals. Approvals page lists all waiting actions. Chat with Lead to assign work or check status. Kill switch is always available in the sidebar.",
  },
  {
    icon: CheckSquare,
    question: "Permanent allow vs once",
    answer: "Approve once runs the action one time. Permanent allow (if available) grants permission for similar future actions. Start with 'once' until you trust the pattern.",
  },
  {
    icon: Shield,
    question: "Deny behaviour",
    answer: "Deny blocks the action and notifies Lead. The agent cannot retry without creating a new approval request. Lead will ask for more detail or suggest alternatives.",
  },
  {
    icon: Users,
    question: "Offline queue",
    answer: "If you're offline, approval requests queue up. When you return, review them in order. Agents wait patiently—nothing executes without your explicit approval.",
  },
  {
    icon: Power,
    question: "Only owner turns kill switch off",
    answer: "Kill switch can be enabled by anyone on the team, but only the workspace owner can resume operations. This ensures ultimate control remains with the account owner.",
  },
];

export default function HelpPage() {
  return (
    <div>
      <Reveal immediate>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help</h1>
          <p className="text-foreground/70">
            Frequently asked questions about ChiefOS permissions and controls
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => {
          const Icon = faq.icon;
          return (
            <Reveal immediate key={index} delay={0.1} index={index} stagger={70}>
              <GlassCard className="p-6" immediate>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-teal to-accent-blue flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-foreground/70 text-sm">{faq.answer}</p>
                </div>
              </div>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>

      <Reveal immediate delay={0.8}>
        <GlassCard className="mt-8 p-8 text-center" immediate>
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-foreground/70 mb-6">
          Chat with Lead or reach out to our support team.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/app/chat"
            className="px-6 py-3 bg-gradient-to-r from-accent-teal to-accent-blue text-white rounded-xl hover:shadow-lg hover:shadow-accent-teal/50 transition-all"
          >
            Talk to Lead
          </a>
          <a
            href="/contact"
            className="px-6 py-3 glass-morphism-light rounded-xl hover:bg-white/20 transition-colors"
          >
            Contact support
          </a>
        </div>
        </GlassCard>
      </Reveal>
    </div>
  );
}
