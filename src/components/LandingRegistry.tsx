"use client";

import { useEffect, useState, forwardRef, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────
   Registry — 3D Building Blocks (Industrial Assembly)
   ───────────────────────────────────────────── */

type PieceType = "agent" | "model" | "skill" | "tool" | "trigger" | "ui" | "logic";
type RegistryPiece = { id: string; label: string };
type BlockRow = { type: PieceType; pieces: RegistryPiece[] };

const blockRows: BlockRow[] = [
  { type: "agent", pieces: [{ id: "whatsapp_agent", label: "WhatsApp Sales Agent" }]},
  { type: "model", pieces: [{ id: "claude", label: "Claude Sonnet" }, { id: "gpt4", label: "GPT-4o" }]},
  { type: "skill", pieces: [{ id: "lead_qualify", label: "Lead Qualification" }, { id: "order_followup", label: "Order Follow-up" }, { id: "faq_responder", label: "FAQ Responder" }]},
  { type: "tool", pieces: [{ id: "doctype_crud", label: "DocType CRUD" }, { id: "email_sender", label: "Email Sender" }, { id: "whatsapp_sender", label: "WhatsApp Sender" }, { id: "web_search", label: "Web Search" }, { id: "file_manager", label: "File Manager" }, { id: "pdf_generator", label: "PDF Generator" }]},
  { type: "trigger", pieces: [{ id: "whatsapp_msg", label: "WhatsApp Message" }, { id: "new_lead", label: "New Lead Created" }, { id: "schedule", label: "Schedule (Cron)" }]},
  { type: "ui", pieces: [{ id: "chat_widget", label: "Chat Widget" }, { id: "dashboard", label: "Sales Dashboard" }, { id: "approval_form", label: "Approval Form" }]},
  { type: "logic", pieces: [{ id: "pricing_logic", label: "Dynamic Pricing" }, { id: "escalation_logic", label: "Escalation Rules" }, { id: "routing_logic", label: "Message Routing" }]},
];

const whatsappAgentDeps = new Set([
  "escalation_logic", "routing_logic", "chat_widget", "whatsapp_msg", "new_lead",
  "doctype_crud", "email_sender", "whatsapp_sender", "web_search", "lead_qualify",
  "order_followup", "faq_responder", "claude", "whatsapp_agent",
]);

const typeConfig: Record<PieceType, { face: string; side: string; top: string; text: string; label: string; width: string }> = {
  agent:   { face: "#2C1810", side: "#1F120B", top: "#3D2B1F", text: "#F5F1E8", label: "BASE", width: "100%" },
  model:   { face: "#C49A62", side: "#A47E4A", top: "#D9B47E", text: "#FFFFFF", label: "MODEL", width: "55%" },
  skill:   { face: "#7E95BF", side: "#6378A0", top: "#99ACD4", text: "#FFFFFF", label: "SKILL", width: "70%" },
  tool:    { face: "#5FA088", side: "#4A826D", top: "#7BB8A0", text: "#FFFFFF", label: "TOOL", width: "95%" },
  trigger: { face: "#D4A84B", side: "#B58C38", top: "#E4BF6E", text: "#FFFFFF", label: "TRIG", width: "75%" },
  ui:      { face: "#C98A6E", side: "#A86F55", top: "#DBA38A", text: "#FFFFFF", label: "UI", width: "85%" },
  logic:   { face: "#8B7BAF", side: "#6F6290", top: "#A08EC5", text: "#FFFFFF", label: "LOGIC", width: "80%" },
};

const LandingRegistry = forwardRef<HTMLElement>(function LandingRegistry(_props, ref) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [craneX, setCraneX] = useState(120); 
  const [hookY, setHookY] = useState(75);   
  const [isHoldingBlock, setIsHoldingBlock] = useState(false);
  const [placedStages, setPlacedStages] = useState<Set<number>>(new Set());
  
  const sectionRef = useRef<HTMLElement>(null);
  const BH = isMobile ? 42 : 50;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const animateSequence = async () => {
    setCurrentStage(-1);
    setPlacedStages(new Set());
    setIsHoldingBlock(false);
    setCraneX(120);
    setHookY(75);
    
    await new Promise(r => setTimeout(r, 800));

    for (let i = 0; i < blockRows.length; i++) {
      setCurrentStage(i);
      setCraneX(65);
      await new Promise(r => setTimeout(r, 600));
      setHookY(480); 
      await new Promise(r => setTimeout(r, 500));
      setIsHoldingBlock(true);
      await new Promise(r => setTimeout(r, 200));
      setHookY(120);
      await new Promise(r => setTimeout(r, 500));
      setCraneX(280);
      await new Promise(r => setTimeout(r, 800));
      const stackY = 580 - (i * (BH + 4)); 
      setHookY(stackY - 80); 
      await new Promise(r => setTimeout(r, 600));
      setPlacedStages(prev => new Set([...prev, i]));
      setIsHoldingBlock(false);
      await new Promise(r => setTimeout(r, 200));
      setHookY(75);
      await new Promise(r => setTimeout(r, 400));
    }
  };

  useEffect(() => {
    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          triggered = true;
          animateSequence();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [BH]);

  return (
    <section
      ref={sectionRef}
      id="registry"
      className="scroll-mt-24"
      style={{ paddingTop: isMobile ? "16px" : "0", paddingBottom: isMobile ? "32px" : "40px" }}
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-4 md:px-8 z-10">
        <div className="mt-4 mb-6 text-center relative">
          {!isMobile && (
            <button 
              onClick={animateSequence}
              className="absolute right-0 top-0 text-[10px] uppercase tracking-widest font-black text-gray-400 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 shadow-sm"
            >
              Restart Build
            </button>
          )}
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C1810]">Registry</h2>
          <p className="font-futura text-gray-700 mt-3 mx-auto max-w-2xl text-sm md:text-base leading-relaxed opacity-80">
            Everything in Sena is a small, reusable piece. Tools, skills, models, triggers, UIs, logic
            — pick what you need, combine them, and an agent comes to life.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 md:px-8 relative z-10">
        <div className="bg-white rounded-[2.5rem] overflow-hidden border-[1.5px] border-[#9CA3AF44] shadow-2xl">
          <div className="flex items-center justify-between px-8 py-4 border-b border-gray-50 bg-[#FBFBFA]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#2C1810] flex items-center justify-center text-white shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none mb-1">Assembly Line</span>
                <span className="text-sm font-bold text-gray-900 leading-none">WhatsApp Sales Agent</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{whatsappAgentDeps.size} COMPONENTS</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          <div className={`${isMobile ? "flex flex-col" : "grid grid-cols-[1fr_320px]"}`}>
            <div className="flex flex-col justify-end p-0 relative overflow-hidden bg-[#FDFDFB] min-h-[760px]">
              
              {!isMobile && (
                <div className="absolute inset-0 pointer-events-none z-30">
                  <svg width="100%" height="100%" viewBox="0 0 600 760" fill="none">
                    <rect x="0" y="30" width="600" height="18" fill="#F1F1F1" />
                    <line x1="0" y1="48" x2="600" y2="48" stroke="#E5E7EB" strokeWidth="1" />
                    <motion.g animate={{ y: 0 }} transition={{ type: "spring", stiffness: 50 }}>
                      <rect x="10" y="40" width="580" height="22" fill="#2C1810" rx="2" />
                      <rect x="10" y="58" width="580" height="4" fill="#1F120B" />
                      
                      <motion.g animate={{ x: craneX }} transition={{ type: "spring", damping: 25, stiffness: 60 }}>
                        <rect x="-30" y="45" width="60" height="28" fill="#3D2B1F" rx="4" />
                        <rect x="-22" y="68" width="44" height="12" fill="#1F120B" rx="1" />
                        
                        <motion.line 
                          x1="0" y1="80" x2="0" 
                          initial={{ y2: 80 }} 
                          animate={{ y2: hookY }} 
                          transition={{ type: "spring", damping: 30, stiffness: 70 }} 
                          stroke="#2C1810" strokeWidth="2" 
                        />
                        <motion.g 
                          initial={{ y: 80 }} 
                          animate={{ y: hookY }} 
                          transition={{ type: "spring", damping: 30, stiffness: 70 }}
                        >
                           <path d="M-10 0 L10 0 L6 12 L-6 12 Z" fill="#2C1810" />
                           <path d="M-6 12 Q0 24 6 12" stroke="#2C1810" strokeWidth="3" fill="none" />
                           
                           <AnimatePresence>
                             {isHoldingBlock && currentStage !== -1 && (
                               <motion.g 
                                 initial={{ opacity: 0, scale: 0.8 }} 
                                 animate={{ opacity: 1, scale: 1 }} 
                                 exit={{ opacity: 0, scale: 0.9 }}
                                 transform="translate(-50, 24) scale(0.5)"
                               >
                                 <rect width="200" height="100" fill={typeConfig[blockRows[currentStage].type].face} rx="2" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                               </motion.g>
                             )}
                           </AnimatePresence>
                        </motion.g>
                      </motion.g>
                    </motion.g>
                  </svg>
                </div>
              )}

              {!isMobile && (
                <div className="absolute left-8 bottom-32 w-24 h-48 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-end pb-6 z-10 shadow-xl">
                   <div className="absolute top-4 w-full text-center text-[9px] font-black text-gray-300 uppercase tracking-widest">Input_Bin</div>
                   <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded-lg relative overflow-hidden flex items-end justify-center pb-2">
                      {currentStage !== -1 && !isHoldingBlock && !placedStages.has(currentStage) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-12 h-12 rounded shadow-2xl" 
                          style={{ background: typeConfig[blockRows[currentStage].type].face }}
                        />
                      )}
                   </div>
                </div>
              )}

              <div className="relative z-20 w-full max-w-lg mx-auto h-full flex flex-col justify-end px-12 pb-0">
                <div className="flex flex-col-reverse">
                  
                  <div className="relative h-24 w-full mb-0">
                     <div className="absolute top-0 left-0 w-full h-16 bg-[#F3F1EA] border-t border-l border-r border-[#9CA3AF44]" style={{ transform: `skewX(-22deg) translateY(-16px) translateX(8px)`, borderBottom: 'none' }}>
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2C1810 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
                     </div>
                     <div className="absolute top-0 left-0 w-full h-16 bg-[#EBE7DE] border border-[#9CA3AF44] flex items-center px-12 justify-between shadow-inner">
                        <div className="flex gap-10">
                           <div className="w-3 h-3 rounded-full bg-[#2C1810] opacity-10 shadow-inner" />
                           <div className="w-3 h-3 rounded-full bg-[#2C1810] opacity-10 shadow-inner" />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-mono font-black text-gray-400 tracking-[0.6em] uppercase">SENA // ASSEMBLY_CORE_V1</span>
                          <span className="text-[8px] font-mono text-gray-300 font-bold mt-1">INDUSTRIAL PRECISION UNIT // 001</span>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-16 h-1.5 bg-[#D4A84B] opacity-20 rounded-full" />
                        </div>
                     </div>
                     <div className="absolute top-0 right-0 w-6 h-16 bg-[#DED9CF] border-t border-r border-b border-[#9CA3AF44]" style={{ transform: `skewY(-22deg) translateX(16px) translateY(-8px)` }} />
                  </div>

                  {blockRows.map((row, rowIdx) => {
                    const config = typeConfig[row.type];
                    const isPlaced = placedStages.has(rowIdx);
                    
                    const skew = 22;
                    const topH = 18;
                    const sideW = 14;
                    
                    return (
                      <motion.div
                        key={row.type}
                        initial={false}
                        animate={isPlaced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -60, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 100 }}
                        className="relative"
                        style={{ zIndex: 10 + rowIdx, marginBottom: "4px" }}
                      >
                        <div className="relative preserve-3d mx-auto" style={{ width: config.width, height: BH }}>
                          <div className="absolute top-0 left-0 w-full transition-all duration-500"
                            style={{
                              height: `${topH}px`,
                              background: config.top,
                              border: `1.5px solid ${config.side}`,
                              borderBottom: 'none',
                              transform: `skewX(-${skew}deg) translateY(-${topH}px) translateX(${topH/2}px)`,
                            }}
                          >
                             <div className="flex justify-around items-center h-full px-16 opacity-20">
                                {[1,2,3,4,5,6].map(i => <div key={i} className="w-2 h-2 rounded-full bg-black/40 shadow-inner" />)}
                             </div>
                          </div>

                          <div className="absolute top-0 left-0 w-full h-full flex items-center px-10 transition-all duration-500"
                            style={{
                              background: config.face,
                              border: `1.5px solid ${config.side}`,
                              borderRadius: "1px",
                              boxShadow: "0 15px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)"
                            }}
                          >
                            <div className="flex flex-col mr-12 opacity-40">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white leading-none">{config.label}</span>
                              <span className="text-[7px] font-mono font-bold text-white mt-1 opacity-60 uppercase">Unit_{row.type}_0{rowIdx}</span>
                            </div>
                            
                            <div className="flex gap-4 overflow-hidden">
                              {row.pieces.filter(p => whatsappAgentDeps.has(p.id)).slice(0, 3).map(p => (
                                <span key={p.id} className="text-[11px] px-4 py-2 rounded bg-white/10 text-white border border-white/5 whitespace-nowrap font-bold shadow-2xl backdrop-blur-xl">
                                  {p.label}
                                </span>
                              ))}
                            </div>

                            {row.type === 'agent' && (
                              <div className="ml-auto flex items-center gap-3 bg-green-500/20 px-4 py-2 rounded border border-green-500/30">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_15px_#4ade80]" />
                                <span className="text-[10px] font-black text-green-100 uppercase tracking-widest">FOUNDATION_READY</span>
                              </div>
                            )}
                          </div>

                          <div className="absolute top-0 right-0 h-full transition-all duration-500"
                            style={{
                              width: `${sideW}px`,
                              background: config.side,
                              border: `1.5px solid ${config.side}`,
                              borderLeft: "none",
                              transform: `skewY(-${skew}deg) translateX(${sideW}px) translateY(-${sideW/2}px)`,
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col bg-[#FCFCFA] border-l border-gray-100">
              <div className="mb-6">
                <h3 className="text-xl font-normal text-gray-900 mb-2 font-serif italic">How it works</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-futura">Small, tested building blocks. Each does one thing well. Combine them to create what you need.</p>
              </div>
              <div className="space-y-4 flex-1">
                {[
                  { num: "01", title: "Granular pieces", desc: "Every tool, skill, model, and trigger is independent. Pick only what you need." },
                  { num: "02", title: "Compose freely", desc: "Give an agent WhatsApp + CRUD + Claude. Or swap Claude for GPT-4o." },
                  { num: "03", title: "Agent assembles", desc: "An agent is just a recipe of registry pieces. Change any ingredient anytime." },
                  { num: "04", title: "Community grows it", desc: "Developers publish new pieces. Use what others built, or publish your own." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <span className="text-sm font-bold text-[#8FB7C5] font-serif">{step.num}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{step.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-[#F5F1E8] border border-[#9CA3AF22]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">This agent&apos;s recipe</p>
                <div className="flex flex-wrap gap-2">
                  {["DocType CRUD", "Email Sender", "WhatsApp Sender", "Web Search", "Lead Qualification", "Order Follow-up", "FAQ Responder", "Claude Sonnet", "Chat Widget", "Escalation Rules", "Message Routing", "WhatsApp Message", "New Lead Created"].map((name) => (
                    <span key={name} className="text-[10px] px-2 py-1 rounded bg-white text-[#5A8A9A] border border-[#8FB7C533] font-bold shadow-sm">{name}</span>
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
