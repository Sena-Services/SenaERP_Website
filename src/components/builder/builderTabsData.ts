export type WorkflowStep = {
  id: string;
  label: string;
  status?: "active" | "loading" | "complete";
};

export type ChatMessage = {
  id: string;
  type: "agent" | "user";
  text: string;
  status?: string;
};

export type Tab = {
  id: string;
  label: string;
  subtitle: string;
  agentTitle: string;
  agentDescription: string;
  workflowSteps: WorkflowStep[];
  chatMessages: ChatMessage[];
};

export const tabs: Tab[] = [
  {
    id: "models",
    label: "Models",
    subtitle: "The brain behind every agent.",
    agentTitle: "Models",
    agentDescription: "Choose which LLM powers your agent. All models available through OpenRouter. Set up failover chains so if one model is down, another picks up. Configure temperature, thinking mode, and token budgets per agent.",
    workflowSteps: [
      { id: "select", label: "Select model", status: "complete" },
      { id: "configure", label: "Configure parameters", status: "complete" },
      { id: "failover", label: "Set up failover chain", status: "loading" },
      { id: "test", label: "Test responses" },
      { id: "deploy", label: "Deploy" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "Which model should power this agent?" },
      { id: "2", type: "user", text: "Use Claude for reasoning, Gemini as fallback" },
      { id: "3", type: "agent", text: "Model chain configured with automatic failover..." },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    subtitle: "What actions the agent can take.",
    agentTitle: "Tools",
    agentDescription: "Tools are the actions your agent can perform. Create documents, send messages, search the web, call APIs. Each tool has approval controls so you decide what runs automatically and what needs your sign-off.",
    workflowSteps: [
      { id: "browse", label: "Browse available tools", status: "complete" },
      { id: "assign", label: "Assign to agent", status: "complete" },
      { id: "configure", label: "Set approval levels", status: "loading" },
      { id: "test", label: "Test tool execution" },
      { id: "activate", label: "Activate" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "What should this agent be able to do?" },
      { id: "2", type: "user", text: "Send emails, create invoices, search contacts" },
      { id: "3", type: "agent", text: "3 tools assigned. Setting approval gates..." },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    subtitle: "Knowledge injected into context.",
    agentTitle: "Skills",
    agentDescription: "Skills are knowledge and instructions injected into your agent's context. Core skills load automatically at every wakeup. On-demand skills are listed but only loaded when the agent needs them. Define identity, workflows, domain knowledge, and tool guides.",
    workflowSteps: [
      { id: "define", label: "Define core skills", status: "complete" },
      { id: "ondemand", label: "Add on-demand skills", status: "complete" },
      { id: "identity", label: "Set agent identity", status: "loading" },
      { id: "test", label: "Test skill injection" },
      { id: "refine", label: "Refine instructions" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "What should this agent know?" },
      { id: "2", type: "user", text: "It needs to know our company policies and HR processes" },
      { id: "3", type: "agent", text: "Injecting domain knowledge and workflow instructions..." },
    ],
  },
  {
    id: "triggers",
    label: "Triggers",
    subtitle: "What wakes the agent up.",
    agentTitle: "Triggers",
    agentDescription: "Triggers define when your agent activates. User messages, task assignments, inbound channel messages like WhatsApp, document events in your ERP, or scheduled cron jobs. Mix and match to create agents that respond to exactly the right events.",
    workflowSteps: [
      { id: "select", label: "Choose trigger types", status: "complete" },
      { id: "configure", label: "Configure conditions", status: "complete" },
      { id: "schedule", label: "Set schedules", status: "loading" },
      { id: "test", label: "Test trigger" },
      { id: "activate", label: "Go live" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "When should this agent wake up?" },
      { id: "2", type: "user", text: "Every morning at 9am and when a new order comes in" },
      { id: "3", type: "agent", text: "Scheduled trigger + document event configured..." },
    ],
  },
  {
    id: "ui",
    label: "UI",
    subtitle: "How the agent is presented.",
    agentTitle: "UI",
    agentDescription: "Control how users interact with your agent. Chat mode for conversational agents, split view for agents that need a workspace alongside chat, full iframe for custom dashboards, or no UI for background workers. Link custom interfaces built in any framework.",
    workflowSteps: [
      { id: "mode", label: "Select UI mode", status: "complete" },
      { id: "layout", label: "Configure layout", status: "complete" },
      { id: "custom", label: "Link custom UI", status: "loading" },
      { id: "preview", label: "Preview" },
      { id: "publish", label: "Publish" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "How should users see this agent?" },
      { id: "2", type: "user", text: "Split view with a dashboard on the right" },
      { id: "3", type: "agent", text: "Split layout configured with custom dashboard iframe..." },
    ],
  },
  {
    id: "logic",
    label: "Logic",
    subtitle: "Deterministic business code.",
    agentTitle: "Logic",
    agentDescription: "For code that must run the same way every time. Deterministic Python modules for business rules, calculations, API endpoints, and background jobs. Logic lives in your own Frappe app with full version control. When you need guarantees, not probabilities.",
    workflowSteps: [
      { id: "define", label: "Define business rules", status: "complete" },
      { id: "code", label: "Write logic modules", status: "complete" },
      { id: "test", label: "Test deterministic output", status: "loading" },
      { id: "integrate", label: "Connect to agent" },
      { id: "deploy", label: "Deploy to production" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "What business logic needs to be deterministic?" },
      { id: "2", type: "user", text: "Tax calculations and invoice numbering" },
      { id: "3", type: "agent", text: "Creating deterministic modules for tax and invoicing..." },
    ],
  },
];
