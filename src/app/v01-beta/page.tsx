"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { PageTransition } from "@/components/PageTransition";

const buildingBlocks = [
  { name: "Model", desc: "The LLM that powers the agent's thinking." },
  { name: "Tools", desc: "Actions the agent can take — create records, send emails, call APIs." },
  { name: "Skills", desc: "Knowledge and instructions injected into context." },
  { name: "Triggers", desc: "Events that wake the agent — document changes, schedules, messages." },
  { name: "UI", desc: "Custom interfaces the agent presents to users." },
  { name: "Logic", desc: "Rules and workflows that govern agent behavior." },
];

export default function V01BetaPage() {
  const router = useRouter();

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[200] flex justify-center">
        <div className="w-full max-w-4xl px-6 sm:px-8 lg:px-12">
          <NavBar
            showBackButton={true}
            onBackClick={() => router.push("/")}
            blogPageTitle="v0.1 Beta"
          />
        </div>
      </div>

      <PageTransition>
      <div style={{ backgroundColor: "#EDE7DC" }} className="min-h-screen pt-20 pb-20">
        <div className="mx-auto" style={{ maxWidth: "720px", padding: "0 24px" }}>

          {/* Header */}
          <div className="mb-12">
            <h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
                fontSize: "36px",
                marginBottom: "8px",
              }}
            >
              Sena v0.1 Beta — Launch Notes
            </h1>
            <p className="font-futura text-gray-400" style={{ fontSize: "14px" }}>
              March 2026
            </p>
          </div>

          {/* What is Sena */}
          <Section title="What is Sena?">
            <p>
              A place to build, share, and use AI agents inside Frappe and ERPNext. Build agents
              that operate directly on your ERP data — creating records, processing documents,
              talking to customers. Publish what you build to the registry, others install it, you
              earn from it.
            </p>
          </Section>

          {/* What's in v0.1 */}
          <Section title="What's in v0.1?">
            <p className="mb-4">Four pillars ship with this release:</p>

            <Subsection title="Builder">
              Create agents three ways. Discovery mode: have a conversation with our Discovery Agent
              and it builds everything for you. Agent Config: hands-on form-based setup with a
              visual graph editor. Registry: browse pre-built agents and install them in one click.
            </Subsection>

            <Subsection title="Agents">
              Use your agents once they&apos;re built. Chat with them, assign tasks, review approvals,
              track activity. Agent Apps give you domain-specific experiences — Comms, Productivity,
              and more.
            </Subsection>

            <Subsection title="Sena Agent">
              One conversation surface that routes to all your agents. You don&apos;t need to know which
              agent handles what — just talk, and Sena figures out who should respond.
            </Subsection>

            <Subsection title="Registry">
              Browse, install, and publish agent components. Tools, skills, agents, logic modules —
              all shareable. Creators earn from installations.
            </Subsection>
          </Section>

          {/* 6 Building Blocks */}
          <Section title="The 6 Building Blocks">
            <p className="mb-4">Every agent is composed of six pieces:</p>
            <div className="flex flex-col gap-2">
              {buildingBlocks.map((block) => (
                <div key={block.name} className="flex gap-2">
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontWeight: 600,
                      color: "#2C1810",
                      fontSize: "15px",
                      minWidth: "70px",
                    }}
                  >
                    {block.name}
                  </span>
                  <span className="text-gray-500" style={{ fontSize: "15px" }}>
                    — {block.desc}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Contracts */}
          <Section title="Contracts">
            <p>
              Talk to the Discovery Agent. It asks questions, captures notes, and turns them into a
              Business Requirements Document. The BRD becomes a contract — a list of exactly what
              gets built: which agents, tools, skills, UIs, and logic modules. Review it, approve
              it, and the Builder Agent executes. You watch each deliverable go from &quot;not started&quot;
              to &quot;completed&quot; in real time.
            </p>
          </Section>

          {/* Models */}
          <Section title="Models">
            <p>
              All models available through OpenRouter. Claude, GPT, Gemini, Grok, Llama, DeepSeek,
              Mistral — pick what works for your use case. Set up failover chains so if one model
              goes down, another picks up automatically. Configure temperature, thinking mode, and
              token budgets per agent.
            </p>
          </Section>

          {/* What's Next */}
          <Section title="What's Next" last>
            <p>
              v0.2 is already in progress. Scheduler triggers, advanced registry monetization,
              mobile apps, and voice-first agents. We&apos;ll share more as we get closer.
            </p>
          </Section>

          {/* Back link */}
          <div className="mt-12 pt-8" style={{ borderTop: "1px solid #D1C7B7" }}>
            <Link
              href="/"
              className="font-futura text-gray-500 hover:text-gray-700 transition-colors"
              style={{ fontSize: "14px" }}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
      </PageTransition>
    </>
  );
}

function Section({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        paddingBottom: last ? "0" : "32px",
        marginBottom: last ? "0" : "32px",
        borderBottom: last ? "none" : "1px solid #D1C7B7",
      }}
    >
      <h2
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 400,
          letterSpacing: "-0.01em",
          color: "#2C1810",
          fontSize: "24px",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>
      <div
        className="font-futura text-gray-600 leading-relaxed"
        style={{ fontSize: "15px" }}
      >
        {children}
      </div>
    </div>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3
        style={{
          fontFamily: "Georgia, serif",
          fontWeight: 600,
          color: "#2C1810",
          fontSize: "17px",
          marginBottom: "4px",
        }}
      >
        {title}
      </h3>
      <p>{children}</p>
    </div>
  );
}
