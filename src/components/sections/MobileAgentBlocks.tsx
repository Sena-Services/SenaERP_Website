"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "motion/react";

const ACCENT = "#8FB7C5";

/* ── tiny static previews ── */

function ModelsPreview() {
  const models = [
    { name: "Claude Sonnet", tag: "Primary", selected: true },
    { name: "GPT-4o", tag: "Failover 1", selected: false },
    { name: "Gemini 1.5", tag: "Failover 2", selected: false },
    { name: "Llama 3.3", tag: "Failover 3", selected: false },
  ];
  return (
    <div className="space-y-1.5">
      <p className="uppercase font-bold text-[#B0ADA6] mb-1" style={{ fontSize: "7px", letterSpacing: "0.06em" }}>Model chain</p>
      {models.map((m) => (
        <div
          key={m.name}
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5"
          style={{
            background: m.selected ? "rgba(143,183,197,0.15)" : "rgba(0,0,0,0.03)",
            border: m.selected ? "1px solid rgba(143,183,197,0.4)" : "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <span className="font-semibold text-[#2C1810]" style={{ fontSize: "11px" }}>{m.name}</span>
          <span
            className="rounded px-1.5 py-0.5 font-medium"
            style={{
              fontSize: "9px",
              background: m.selected ? ACCENT : "rgba(0,0,0,0.06)",
              color: m.selected ? "#fff" : "#6B7280",
            }}
          >
            {m.tag}
          </span>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        {["Temp: 0.7", "Tokens: 8K", "Thinking: ON"].map((b) => (
          <span
            key={b}
            className="rounded px-1.5 py-0.5 font-medium"
            style={{ fontSize: "9px", background: "rgba(0,0,0,0.05)", color: "#6B7280", border: "1px solid rgba(0,0,0,0.07)" }}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function ToolsPreview() {
  const tools = [
    { name: "Gmail", enabled: true, approval: false },
    { name: "Slack", enabled: true, approval: false },
    { name: "Google Sheets", enabled: true, approval: true },
    { name: "create_document", enabled: true, approval: false },
    { name: "web_search", enabled: true, approval: false },
    { name: "GitHub", enabled: false, approval: false },
  ];
  return (
    <div>
      <p className="uppercase font-bold text-[#B0ADA6] mb-1.5" style={{ fontSize: "7px", letterSpacing: "0.06em" }}>Assigned tools</p>
      <div className="space-y-1">
        {tools.map((t) => (
          <div key={t.name} className="flex items-center gap-2" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "3px" }}>
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: t.enabled ? "#10B981" : "#D1D5DB" }}
            />
            <span className="flex-1 font-semibold text-[#2C1810]" style={{ fontSize: "10px" }}>{t.name}</span>
            {t.approval && (
              <span className="rounded px-1 py-px font-medium" style={{ fontSize: "8px", background: "rgba(245,158,11,0.12)", color: "#B45309", border: "1px solid rgba(245,158,11,0.2)" }}>
                Approval
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-2 flex-wrap">
        {["350+ tools", "Per-tool control", "Audit trail"].map((b) => (
          <span key={b} className="rounded px-1.5 py-0.5 font-medium" style={{ fontSize: "8px", background: "rgba(0,0,0,0.05)", color: "#6B7280", border: "1px solid rgba(0,0,0,0.07)" }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillsPreview() {
  const core = ["Identity", "Company Policy", "Product Knowledge", "Communication"];
  const ondemand = ["Tax Calculations", "Legal Templates", "Sales Playbook", "Troubleshooting"];
  return (
    <div className="space-y-2">
      <div>
        <p className="uppercase font-bold text-[#10B981] mb-1" style={{ fontSize: "7px", letterSpacing: "0.06em" }}>Core — always loaded</p>
        <div className="flex flex-wrap gap-1">
          {core.map((s) => (
            <span key={s} className="rounded-md px-2 py-0.5 font-medium" style={{ fontSize: "9px", background: "rgba(16,185,129,0.1)", color: "#065F46", border: "1px solid rgba(16,185,129,0.2)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="uppercase font-bold text-[#B0ADA6] mb-1" style={{ fontSize: "7px", letterSpacing: "0.06em" }}>On-demand — loaded when needed</p>
        <div className="flex flex-wrap gap-1">
          {ondemand.map((s) => (
            <span key={s} className="rounded-md px-2 py-0.5 font-medium" style={{ fontSize: "9px", background: "rgba(0,0,0,0.04)", color: "#6B7280", border: "1px solid rgba(0,0,0,0.07)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-1 flex-wrap mt-1">
        {["Markdown", "Tool Guides", "Workflows", "Few-shot"].map((b) => (
          <span key={b} className="rounded px-1.5 py-0.5 font-medium" style={{ fontSize: "8px", background: "rgba(0,0,0,0.04)", color: "#9CA3AF", border: "1px solid rgba(0,0,0,0.06)" }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function TriggersPreview() {
  const triggers = [
    { name: "User Message", on: true },
    { name: "Task Assignment", on: true },
    { name: "Doc Event", on: true },
    { name: "Cron Schedule", on: false },
    { name: "WhatsApp", on: false },
  ];
  return (
    <div>
      <p className="uppercase font-bold text-[#B0ADA6] mb-1.5" style={{ fontSize: "7px", letterSpacing: "0.06em" }}>Trigger types</p>
      <div className="space-y-1.5">
        {triggers.map((t) => (
          <div key={t.name} className="flex items-center justify-between">
            <span className="font-semibold text-[#2C1810]" style={{ fontSize: "10px" }}>{t.name}</span>
            <div
              className="flex items-center justify-end rounded-full"
              style={{
                width: "32px",
                height: "16px",
                background: t.on ? ACCENT : "#D1D5DB",
                padding: "2px",
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "12px",
                  height: "12px",
                  background: "#fff",
                  marginLeft: t.on ? "auto" : undefined,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap mt-2">
        {["Cron", "Doc Events", "WhatsApp", "Webhooks", "A2A"].map((b) => (
          <span key={b} className="rounded px-1.5 py-0.5 font-medium" style={{ fontSize: "8px", background: "rgba(0,0,0,0.04)", color: "#9CA3AF", border: "1px solid rgba(0,0,0,0.06)" }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function UIPreview() {
  const modes = [
    { label: "Chat", active: true, desc: "Conversational" },
    { label: "Split", active: false, desc: "Chat + workspace" },
    { label: "Iframe", active: false, desc: "Custom app" },
    { label: "No UI", active: false, desc: "Background worker" },
  ];
  return (
    <div>
      <p className="uppercase font-bold text-[#B0ADA6] mb-1.5" style={{ fontSize: "7px", letterSpacing: "0.06em" }}>Interface mode</p>
      <div className="grid grid-cols-2 gap-1.5">
        {modes.map((m) => (
          <div
            key={m.label}
            className="rounded-xl px-2.5 py-2"
            style={{
              background: m.active ? "rgba(143,183,197,0.15)" : "rgba(0,0,0,0.03)",
              border: m.active ? "1.5px solid rgba(143,183,197,0.45)" : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div className="font-bold text-[#2C1810]" style={{ fontSize: "10px" }}>{m.label}</div>
            <div className="text-[#9CA3AF]" style={{ fontSize: "8.5px" }}>{m.desc}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap mt-2">
        {["Responsive", "RBAC", "Embeddable", "Themeable"].map((b) => (
          <span key={b} className="rounded px-1.5 py-0.5 font-medium" style={{ fontSize: "8px", background: "rgba(0,0,0,0.04)", color: "#9CA3AF", border: "1px solid rgba(0,0,0,0.06)" }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function LogicPreview() {
  const items = [
    { label: "Python modules", detail: "Business rules & calculations" },
    { label: "API endpoints", detail: "REST APIs via Frappe" },
    { label: "Background jobs", detail: "Scheduled & async tasks" },
    { label: "Business rules", detail: "Deterministic, version-controlled" },
  ];
  return (
    <div>
      <p className="uppercase font-bold text-[#B0ADA6] mb-1.5" style={{ fontSize: "7px", letterSpacing: "0.06em" }}>Logic components</p>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
            style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: ACCENT }}
            />
            <span className="font-semibold text-[#2C1810] flex-shrink-0" style={{ fontSize: "10px" }}>{item.label}</span>
            <span className="text-[#9CA3AF] truncate" style={{ fontSize: "8.5px" }}>{item.detail}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap mt-2">
        {["Python", "Deterministic", "Versioned", "Hot Reload"].map((b) => (
          <span key={b} className="rounded px-1.5 py-0.5 font-medium" style={{ fontSize: "8px", background: "rgba(0,0,0,0.04)", color: "#9CA3AF", border: "1px solid rgba(0,0,0,0.06)" }}>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── card data ── */

const blocks = [
  {
    id: "models",
    label: "Models",
    subtitle: "The brain behind every agent.",
    description: "Choose which LLM powers your agent. All models available through OpenRouter. Set up failover chains so if one model is down, another picks up. Configure temperature, thinking mode, and token budgets per agent.",
    features: ["Any LLM provider", "Failover chains", "Temperature control", "Token budgets"],
    Preview: ModelsPreview,
  },
  {
    id: "tools",
    label: "Tools",
    subtitle: "What actions the agent can take.",
    description: "Tools are the actions your agent can perform. Create documents, send messages, search the web, call APIs. Each tool has approval controls so you decide what runs automatically and what needs your sign-off.",
    features: ["350+ tools", "Approval gates", "API actions", "Per-tool control"],
    Preview: ToolsPreview,
  },
  {
    id: "skills",
    label: "Skills",
    subtitle: "Knowledge injected into context.",
    description: "Skills are knowledge and instructions injected into your agent's context. Core skills load automatically. On-demand skills are listed but only loaded when the agent needs them.",
    features: ["Core skills", "On-demand", "Identity", "Domain knowledge"],
    Preview: SkillsPreview,
  },
  {
    id: "triggers",
    label: "Triggers",
    subtitle: "What wakes the agent up.",
    description: "Triggers define when your agent activates. User messages, task assignments, inbound channel messages, document events in your ERP, or scheduled cron jobs. Mix and match for exactly the right events.",
    features: ["Cron schedules", "Doc events", "Inbound messages", "Task assignments"],
    Preview: TriggersPreview,
  },
  {
    id: "ui",
    label: "UI",
    subtitle: "How the agent is presented.",
    description: "Control how users interact with your agent. Chat mode, split view, full iframe for custom dashboards, or no UI for background workers. Link custom interfaces built in any framework.",
    features: ["Chat mode", "Split view", "Custom iframe", "No UI mode"],
    Preview: UIPreview,
  },
  {
    id: "logic",
    label: "Logic",
    subtitle: "Deterministic business code.",
    description: "For code that must run the same way every time. Deterministic Python modules for business rules, calculations, and background jobs. Full version control—when you need guarantees, not probabilities.",
    features: ["Python modules", "Deterministic", "Version controlled", "Business rules"],
    Preview: LogicPreview,
  },
];

export default function MobileAgentBlocks() {
  const [currentCard, setCurrentCard] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const cardGap = 16;
  const cardWidth = containerWidth > 0 ? containerWidth - 48 : 320;

  useEffect(() => {
    const update = () => setContainerWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const targetX = -currentCard * (cardWidth + cardGap);
    animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
  }, [currentCard, cardWidth, cardGap, x]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold || info.velocity.x < -500) {
      if (currentCard < blocks.length - 1) setCurrentCard(currentCard + 1);
    } else if (info.offset.x > threshold || info.velocity.x > 500) {
      if (currentCard > 0) setCurrentCard(currentCard - 1);
    }
  };

  return (
    <div className="w-full relative pt-2 pb-8 overflow-hidden">
      {/* "Swipe to explore" hint just above the cards */}
      <p
        className="text-center mb-3"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, fontSize: "13px", color: "#6B7280" }}
      >
        Swipe to explore
      </p>

      {/* Carousel */}
      <div ref={containerRef} className="relative" style={{ touchAction: "pan-y" }}>
        <motion.div
          className="flex"
          style={{ x, paddingLeft: "24px", gap: `${cardGap}px`, touchAction: "pan-y" }}
          drag="x"
          dragDirectionLock
          dragConstraints={{
            left: -((blocks.length - 1) * (cardWidth + cardGap)),
            right: 0,
          }}
          dragElastic={0.1}
          onDirectionLock={(axis) => {
            if (axis === "x") document.body.style.overflow = "hidden";
          }}
          onDragEnd={(...args) => {
            document.body.style.overflow = "";
            handleDragEnd(...args);
          }}
        >
          {blocks.map((block) => {
            const { Preview } = block;
            return (
              <div
                key={block.id}
                className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col"
                style={{
                  width: cardWidth,
                  background: "#FAF8F5",
                  border: "2px solid #9CA3AF",
                  boxShadow: "0 8px 24px -8px rgba(80, 60, 40, 0.12)",
                }}
              >
                {/* Card top content */}
                <div className="px-4 pt-4 pb-3">
                  {/* Accent badge */}
                  <span
                    className="inline-block rounded-md px-2.5 py-1 font-futura font-bold mb-2"
                    style={{
                      fontSize: "11px",
                      background: ACCENT,
                      color: "#fff",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {block.label}
                  </span>

                  {/* Subtitle */}
                  <h3
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "17px",
                      fontWeight: 400,
                      color: "#2C1810",
                      lineHeight: 1.3,
                      marginBottom: "6px",
                    }}
                  >
                    {block.subtitle}
                  </h3>

                  {/* Description */}
                  <p
                    className="font-futura leading-relaxed"
                    style={{ fontSize: "12px", color: "#6B7280", marginBottom: "10px" }}
                  >
                    {block.description}
                  </p>

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {block.features.map((f) => (
                      <span
                        key={f}
                        className="font-futura font-medium"
                        style={{
                          fontSize: "9px",
                          color: "#6B7280",
                          background: "rgba(0,0,0,0.04)",
                          border: "1px solid #D1D5DB",
                          borderRadius: "6px",
                          padding: "2px 7px",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "0 16px" }} />

                {/* Static preview area */}
                <div
                  className="px-4 py-3"
                  style={{ background: "rgba(245,241,232,0.4)" }}
                >
                  <Preview />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {blocks.map((block, index) => (
          <button
            key={index}
            onClick={() => setCurrentCard(index)}
            aria-label={`Go to ${block.label}`}
            className="transition-all duration-300 relative flex items-center justify-center"
            style={{ width: "44px", height: "44px", background: "transparent", border: "none", padding: 0 }}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: currentCard === index ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: currentCard === index ? ACCENT : "#D1D5DB",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
