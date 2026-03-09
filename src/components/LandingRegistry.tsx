"use client";

import React, { useEffect, useState, forwardRef, useRef } from "react";
import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ─────────────────────────────────────────────
   Registry — Compact LEGO Block Assembly
   ───────────────────────────────────────────── */

type PieceType = "agent" | "model" | "skill" | "tool" | "trigger" | "ui" | "logic";
type RegistryPiece = { id: string; label: string };
type BlockRow = { type: PieceType; pieces: RegistryPiece[] };

const blockRows: BlockRow[] = [
  { type: "agent", pieces: [{ id: "whatsapp_agent", label: "WhatsApp Sales Agent" }]},
  { type: "model", pieces: [{ id: "claude", label: "Claude Sonnet" }, { id: "gpt4", label: "GPT-4o" }]},
  { type: "skill", pieces: [{ id: "lead_qualify", label: "Lead Qualify" }, { id: "order_followup", label: "Follow-up" }, { id: "faq_responder", label: "FAQ" }]},
  { type: "tool", pieces: [{ id: "doctype_crud", label: "CRUD" }, { id: "email_sender", label: "Email" }, { id: "whatsapp_sender", label: "WhatsApp" }, { id: "web_search", label: "Search" }, { id: "file_manager", label: "Files" }, { id: "pdf_generator", label: "PDF" }]},
  { type: "trigger", pieces: [{ id: "whatsapp_msg", label: "WhatsApp Msg" }, { id: "new_lead", label: "New Lead" }, { id: "schedule", label: "Cron" }]},
  { type: "ui", pieces: [{ id: "chat_widget", label: "Chat" }, { id: "dashboard", label: "Dashboard" }, { id: "approval_form", label: "Approvals" }]},
  { type: "logic", pieces: [{ id: "pricing_logic", label: "Pricing" }, { id: "escalation_logic", label: "Escalation" }, { id: "routing_logic", label: "Routing" }]},
];

const whatsappAgentDeps = new Set([
  "escalation_logic", "routing_logic", "chat_widget", "whatsapp_msg", "new_lead",
  "doctype_crud", "email_sender", "whatsapp_sender", "web_search", "lead_qualify",
  "order_followup", "faq_responder", "claude", "whatsapp_agent",
]);

const typeConfig: Record<PieceType, { bg: string; border: string; text: string; label: string; icon: string }> = {
  agent:   { bg: "#2C1810",   border: "#3D2B1F", text: "#F5F1E8", label: "Agent",   icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  model:   { bg: "#C49A62",   border: "#D9B47E", text: "#fff",    label: "Model",   icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  skill:   { bg: "#7E95BF",   border: "#99ACD4", text: "#fff",    label: "Skill",   icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  tool:    { bg: "#5FA088",   border: "#7BB8A0", text: "#fff",    label: "Tool",    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  trigger: { bg: "#D4A84B",   border: "#E4BF6E", text: "#fff",    label: "Trigger", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  ui:      { bg: "#C98A6E",   border: "#DBA38A", text: "#fff",    label: "UI",      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  logic:   { bg: "#8B7BAF",   border: "#A08EC5", text: "#fff",    label: "Logic",   icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
};

// Scattered start positions for the LEGO blocks
const scatterOffsets = [
  { x: 0, y: 30 },
  { x: -90, y: -60 },
  { x: 120, y: -40 },
  { x: -140, y: -20 },
  { x: 100, y: -70 },
  { x: -80, y: -90 },
  { x: 130, y: -35 },
];

// LEGO stud component
const LegoStuds = ({ count, color }: { count: number; color: string }) => (
  <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 flex gap-[3px]">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-full"
        style={{
          width: "8px",
          height: "5px",
          backgroundColor: color,
          boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}
      />
    ))}
  </div>
);

const LandingRegistry = forwardRef<HTMLElement>(function LandingRegistry(_props, ref) {
  const isMobile = useIsMobile(900);
  const [assembled, setAssembled] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState<Set<number>>(new Set());
  const [allDone, setAllDone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const runAnimation = async () => {
    setAssembled(false);
    setVisibleBlocks(new Set());
    setAllDone(false);

    // Phase 1: blocks appear scattered (fast stagger)
    for (let i = 0; i < blockRows.length; i++) {
      await new Promise(r => setTimeout(r, 80));
      setVisibleBlocks(prev => new Set([...prev, i]));
    }

    await new Promise(r => setTimeout(r, 300));

    // Phase 2: snap into stacked position
    setAssembled(true);

    await new Promise(r => setTimeout(r, 700));
    setAllDone(true);
  };

  useEffect(() => {
    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          triggered = true;
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Block widths for stacking effect — agent (base) widest, narrowing upward
  const blockWidths = isMobile
    ? ["100%", "88%", "82%", "94%", "80%", "76%", "72%"]
    : ["100%", "64%", "74%", "96%", "80%", "70%", "68%"];

  const blockHeight = isMobile ? 30 : 34;
  const studCounts = [4, 3, 3, 4, 3, 3, 3];

  return (
    <section
      ref={(el: HTMLElement | null) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      id="registry"
      className="scroll-mt-24"
      style={{ paddingTop: isMobile ? "12px" : "0", paddingBottom: isMobile ? "24px" : "32px" }}
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-4 md:px-8 z-10">
        <div className="mt-4 mb-5 text-center relative">
          {!isMobile && (
            <button
              onClick={runAnimation}
              aria-label="Replay animation"
              className="absolute right-0 top-0 text-[10px] uppercase tracking-widest font-black text-gray-400 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 shadow-sm"
            >
              Replay
            </button>
          )}
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C1810]">Registry</h2>
          <p className="font-futura text-gray-700 mt-2 mx-auto max-w-xl text-sm leading-relaxed opacity-80">
            Small, reusable building blocks. Pick what you need, snap them together, and an agent comes to life.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 md:px-8 relative z-10">
        <div className="bg-white rounded-[2rem] overflow-hidden border-[1.5px] border-[#9CA3AF44] shadow-2xl">
          {/* Compact header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-50 bg-[#FBFBFA]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#2C1810] flex items-center justify-center text-white shadow-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none mb-0.5">Component Registry</span>
                <span className="text-xs font-bold text-gray-900 leading-none">WhatsApp Sales Agent</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{whatsappAgentDeps.size} blocks</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          <div className={`${isMobile ? "flex flex-col" : "grid grid-cols-[1fr_260px]"}`}>
            {/* Left: LEGO Assembly Area */}
            <div
              className="relative overflow-hidden bg-[#FDFDFB] flex items-center justify-center"
              style={{ minHeight: isMobile ? "260px" : "310px" }}
            >
              {/* Subtle dot grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2C1810 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

              {/* Block stack */}
              <div className="relative z-10 w-full max-w-[340px] mx-auto px-4" style={{ paddingTop: isMobile ? "16px" : "24px", paddingBottom: isMobile ? "16px" : "20px" }}>
                <div className="flex flex-col-reverse" style={{ gap: isMobile ? "3px" : "4px" }}>
                  {blockRows.map((row, rowIdx) => {
                    const config = typeConfig[row.type];
                    const isVisible = visibleBlocks.has(rowIdx);
                    const offset = scatterOffsets[rowIdx];
                    const pieces = row.pieces.filter(p => whatsappAgentDeps.has(p.id)).slice(0, isMobile ? 2 : 4);

                    return (
                      <motion.div
                        key={row.type}
                        initial={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.8, rotate: (rowIdx % 2 === 0 ? 1 : -1) * 8 }}
                        animate={
                          !isVisible
                            ? { opacity: 0, x: offset.x, y: offset.y, scale: 0.8, rotate: (rowIdx % 2 === 0 ? 1 : -1) * 8 }
                            : assembled
                              ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
                              : { opacity: 0.6, x: offset.x * 0.5, y: offset.y * 0.5, scale: 0.88, rotate: (rowIdx % 2 === 0 ? 1 : -1) * 4 }
                        }
                        transition={{
                          type: "spring",
                          damping: 18,
                          stiffness: 120,
                          mass: 0.6,
                          delay: assembled ? rowIdx * 0.04 : 0,
                        }}
                        className="mx-auto relative"
                        style={{ width: blockWidths[rowIdx], zIndex: 10 + rowIdx }}
                      >
                        {/* LEGO studs on top */}
                        {assembled && rowIdx !== 0 && (
                          <LegoStuds count={studCounts[rowIdx]} color={config.bg} />
                        )}

                        <div
                          className="flex items-center gap-2 px-3 relative"
                          style={{
                            height: `${blockHeight}px`,
                            backgroundColor: config.bg,
                            borderRadius: "4px",
                            border: `1.5px solid ${config.border}`,
                            boxShadow: assembled
                              ? `0 2px 0 ${config.border}, 0 4px 8px rgba(0,0,0,0.1)`
                              : `0 2px 8px rgba(0,0,0,0.15)`,
                          }}
                        >
                          {/* Type icon */}
                          <div className="flex-shrink-0 opacity-60">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: config.text }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={config.icon} />
                            </svg>
                          </div>

                          {/* Type label */}
                          <span className="text-[8px] font-black uppercase tracking-[0.12em] flex-shrink-0 opacity-50" style={{ color: config.text }}>
                            {config.label}
                          </span>

                          {/* Divider */}
                          <div className="w-px flex-shrink-0" style={{ height: "14px", backgroundColor: "rgba(255,255,255,0.12)" }} />

                          {/* Piece tags */}
                          <div className="flex gap-1 overflow-hidden flex-1 min-w-0">
                            {pieces.map(p => (
                              <span
                                key={p.id}
                                className="text-[8px] px-1.5 py-px rounded whitespace-nowrap font-medium truncate"
                                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
                              >
                                {p.label}
                              </span>
                            ))}
                            {row.pieces.filter(p => whatsappAgentDeps.has(p.id)).length > pieces.length && (
                              <span className="text-[8px] font-bold flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>
                                +{row.pieces.filter(p => whatsappAgentDeps.has(p.id)).length - pieces.length}
                              </span>
                            )}
                          </div>

                          {/* Agent ready badge */}
                          {row.type === 'agent' && allDone && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-1 ml-auto flex-shrink-0"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                              <span className="text-[7px] font-black uppercase tracking-wider" style={{ color: "#86efac" }}>Ready</span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Platform base */}
                <motion.div
                  className="mx-auto mt-1"
                  style={{ width: "104%" }}
                  initial={{ opacity: 0 }}
                  animate={assembled ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div className="h-2.5 rounded-b-md bg-[#EBE7DE] border border-t-0 border-[#9CA3AF22] flex items-center justify-center">
                    <span className="text-[6px] font-mono font-bold text-gray-300 tracking-[0.4em] uppercase">SENA REGISTRY</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Compact Info Panel */}
            <div className="p-4 flex flex-col bg-[#FCFCFA] border-l border-gray-100">
              <div className="mb-3">
                <h3 className="text-base font-normal text-gray-900 mb-1 font-serif italic">How it works</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-futura">Small blocks. Each does one thing. Combine them freely.</p>
              </div>
              <div className="space-y-2.5 flex-1">
                {[
                  { num: "01", title: "Granular pieces", desc: "Every tool, skill, model, and trigger is independent." },
                  { num: "02", title: "Compose freely", desc: "Swap Claude for GPT-4o. Add WhatsApp. Remove email." },
                  { num: "03", title: "Agent assembles", desc: "An agent is just a stack of registry blocks." },
                  { num: "04", title: "Community grows it", desc: "Publish pieces. Use what others built." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-3">
                    <span className="text-xs font-bold text-[#8FB7C5] font-serif flex-shrink-0">{step.num}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800 leading-tight">{step.title}</p>
                      <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg bg-[#F5F1E8] border border-[#9CA3AF22]">
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-2">Recipe</p>
                <div className="flex flex-wrap gap-1">
                  {["CRUD", "Email", "WhatsApp", "Search", "Lead Qualify", "Follow-up", "FAQ", "Claude", "Chat", "Escalation", "Routing", "WA Trigger", "New Lead"].map((name) => (
                    <span key={name} className="text-[8px] px-1.5 py-0.5 rounded bg-white text-[#5A8A9A] border border-[#8FB7C533] font-bold shadow-sm">{name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default LandingRegistry;
