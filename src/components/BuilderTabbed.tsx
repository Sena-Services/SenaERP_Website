"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import AgentsBuilderDemo from "./AgentsBuilderDemo";
import MobileBuilderCard from "./MobileBuilderCard";
import MobileWorkflowsBuilderDemo from "./MobileWorkflowsBuilderDemo";
import MobileDataBuilderDemo from "./MobileDataBuilderDemo";
import MobileAgentsBuilderDemo from "./MobileAgentsBuilderDemo";

type Tab = {
  id: string;
  label: string;
  subtitle: string;
  agentTitle: string;
  agentDescription: string;
  workflowSteps: WorkflowStep[];
  chatMessages: ChatMessage[];
};

type WorkflowStep = {
  id: string;
  label: string;
  status?: "active" | "loading" | "complete";
};

type ChatMessage = {
  id: string;
  type: "agent" | "user";
  text: string;
  status?: string;
};

const tabs: Tab[] = [
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const workflowItemVariants = {
  hidden: {
    opacity: 0,
    x: -40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    }
  },
};

const chatMessageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: custom * 0.2,
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
    }
  }),
};

// Interface Gallery Component
function InterfaceGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [
    { src: "/images/interfaces-dashbaord.png", alt: "Analytics Dashboard" },
    { src: "/images/interface-form.png", alt: "Customer Form" },
    { src: "/images/interface-table.png", alt: "Data Table" },
    { src: "/images/interface-ai.png", alt: "AI Assistant" }
  ];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openImageExpanded = () => {
    setIsExpanded(true);
  };

  const closeImageExpanded = () => {
    setIsExpanded(false);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation when expanded
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, currentIndex, images.length]);

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        {/* Image Container - rounded, no visible border */}
        <div
          onClick={openImageExpanded}
          className="relative rounded-2xl overflow-hidden flex-1 flex items-center justify-center max-h-[340px] group/screenshot cursor-pointer"
          style={{ backgroundColor: '#FCFCFA' }}
        >
          {/* Subtle view hint */}
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover/screenshot:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-600 font-medium font-futura">Click to view full size</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-auto cursor-pointer"
              style={{
                maxHeight: '340px',
                height: 'auto',
                border: '2px solid #9CA3AF',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(139, 119, 89, 0.12)'
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

      {/* Navigation BELOW image - like BlogSection */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
              hasPrev
                ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white hover:scale-105 cursor-pointer'
                : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous interface"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-[#8FB7C5] scale-125'
                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
              hasNext
                ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white hover:scale-105 cursor-pointer'
                : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next interface"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Page Counter - like BlogSection */}
        <div className="text-xs text-gray-600 font-futura">
          Page <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of <span className="font-semibold text-gray-900">{images.length}</span>
        </div>
      </div>
    </div>

    {/* Image Expanded Modal - Rendered via Portal */}
    {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={closeImageExpanded}
          >
            {/* Close button - top right */}
            <button
              onClick={closeImageExpanded}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            {hasPrev && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next button */}
            {hasNext && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Next"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Centered Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </motion.div>

            {/* Page indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-futura">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}

// Data Gallery Component - Same design as Interface
function DataGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [
    { src: "/images/data-fields.png", alt: "Data Fields" },
    { src: "/images/data-create.png", alt: "Data Create" },
    { src: "/images/data-records.png", alt: "Data Records" }
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openImageExpanded = () => setIsExpanded(true);
  const closeImageExpanded = () => setIsExpanded(false);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation when expanded
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, currentIndex, images.length]);

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        <div
          onClick={openImageExpanded}
          className="relative rounded-2xl overflow-hidden flex-1 flex items-center justify-center max-h-[340px] group/screenshot cursor-pointer"
          style={{ backgroundColor: '#FCFCFA' }}
        >
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover/screenshot:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-600 font-medium font-futura">Click to view full size</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-auto cursor-pointer"
              style={{
                maxHeight: '340px',
                height: 'auto',
                border: '2px solid #9CA3AF',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(139, 119, 89, 0.12)'
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
              hasPrev ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white hover:scale-105 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'bg-[#8FB7C5] scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
              hasNext ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white hover:scale-105 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-gray-600 font-futura">
          Page <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of <span className="font-semibold text-gray-900">{images.length}</span>
        </div>
      </div>
    </div>

    {/* Image Expanded Modal - Rendered via Portal */}
    {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={closeImageExpanded}
          >
            <button
              onClick={closeImageExpanded}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {hasPrev && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {hasNext && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </motion.div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-futura">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}

// Workflows Gallery Component - Same design as Interface
function WorkflowsGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [
    { src: "/images/workflow-summary.png", alt: "Workflow Summary" },
    { src: "/images/workflow-detailed.png", alt: "Workflow Detailed" }
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openImageExpanded = () => setIsExpanded(true);
  const closeImageExpanded = () => setIsExpanded(false);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation when expanded
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, currentIndex, images.length]);

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        <div
          onClick={openImageExpanded}
          className="relative rounded-2xl overflow-hidden flex-1 flex items-center justify-center max-h-[340px] group/screenshot cursor-pointer"
          style={{ backgroundColor: '#FCFCFA' }}
        >
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover/screenshot:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-600 font-medium font-futura">Click to view full size</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-auto cursor-pointer"
              style={{
                maxHeight: '340px',
                height: 'auto',
                border: '2px solid #9CA3AF',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(139, 119, 89, 0.12)'
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
              hasPrev ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white hover:scale-105 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex ? 'bg-[#8FB7C5] scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
              hasNext ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white hover:scale-105 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-gray-600 font-futura">
          Page <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of <span className="font-semibold text-gray-900">{images.length}</span>
        </div>
      </div>
    </div>

    {/* Image Expanded Modal - Rendered via Portal */}
    {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={closeImageExpanded}
          >
            <button
              onClick={closeImageExpanded}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {hasPrev && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {hasNext && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </motion.div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-futura">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}

// Agents Gallery Component - Same design as Interface
function AgentsGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [
    { src: "/images/agents-role.jpeg", alt: "Agent Role Configuration" },
    { src: "/images/agents-greeting.jpeg", alt: "Agent Greeting Stages" },
    { src: "/images/agents-personality.jpeg", alt: "Agent Personality Settings" },
    { src: "/images/agents-mode.jpeg", alt: "Agent Mode Configuration" }
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openImageExpanded = () => setIsExpanded(true);
  const closeImageExpanded = () => setIsExpanded(false);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Keyboard navigation when expanded
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, currentIndex, images.length]);

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        <div
          onClick={openImageExpanded}
          className="relative rounded-2xl overflow-hidden flex-1 flex items-center justify-center max-h-[340px] group/screenshot cursor-pointer"
          style={{ backgroundColor: '#FCFCFA' }}
        >
          {/* Subtle view hint */}
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover/screenshot:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-600 font-medium font-futura">Click to view full size</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-auto rounded-xl cursor-pointer"
              style={{
                maxHeight: '340px',
                height: 'auto',
                border: '2px solid #9CA3AF',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              onClick={openImageExpanded}
            />
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                hasPrev ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-[#374151] hover:scale-105' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
              }`}
              aria-label="Previous"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'bg-[#8FB7C5] scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={!hasNext}
              className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                hasNext ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-[#374151] hover:scale-105' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
              }`}
              aria-label="Next"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="text-xs text-gray-600 font-futura">
            Page <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of <span className="font-semibold text-gray-900">{images.length}</span>
          </div>
        </div>
      </div>

      {/* Image Expanded Modal - Rendered via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
              onClick={closeImageExpanded}
            >
              {/* Close button - top right */}
              <button
                onClick={closeImageExpanded}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Previous button */}
              {hasPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next button */}
              {hasNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Centered Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </motion.div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-futura">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default function BuilderTabbed() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeBuilderTab, setActiveBuilderTab] = useState("models"); // Models is the first tab
  const [viewportHeight, setViewportHeight] = useState(900);
  // showDetails state removed - split layout shows both simultaneously

  // Responsive scaling function - same as IntroSection
  const getResponsiveValue = (baseValue: number) => {
    const baseScreenHeight = 1200;

    // Aggressive scaling down for very low-height screens (600px and below)
    if (viewportHeight <= 600) {
      const scaleFactor = 0.4;
      return baseValue * scaleFactor;
    }
    // Gradual scaling for low to medium heights (600-1200px)
    else if (viewportHeight <= baseScreenHeight) {
      // Smooth gradual scale from 0.4x at 600px to 1x at 1200px
      const scaleFactor = 0.4 + ((viewportHeight - 600) / (baseScreenHeight - 600)) * 0.6;
      return baseValue * scaleFactor;
    }
    // Scale up proportionally for screens taller than 1200px
    const scaleFactor = viewportHeight / baseScreenHeight;
    return baseValue * scaleFactor;
  };

  // Detect mobile and sync with navbar tab selection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for mobile navbar tab changes and scroll detection
  useEffect(() => {
    const handleNavbarTabChange = (e: CustomEvent) => {
      const tabId = e.detail.tabId;
      const tab = tabs.find(t => t.id === tabId);
      if (tab) {
        setActiveTab(tab);
        // Scroll to the corresponding section
        if (isMobile) {
          const sectionEl = document.getElementById(`mobile-builder-${tabId}`);
          if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    window.addEventListener('builderTabChange' as any, handleNavbarTabChange);
    return () => window.removeEventListener('builderTabChange' as any, handleNavbarTabChange);
  }, [isMobile]);

  // Auto-update navbar tabs based on scroll position (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const sections = ['data', 'workflows', 'agents']; // Data is now the first tab (BRD hidden)
      const scrollPosition = window.scrollY + window.innerHeight / 2; // Use middle of viewport

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(`mobile-builder-${sections[i]}`);
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;

          // Check if viewport middle is within this section
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const tab = tabs.find(t => t.id === sections[i]);
            if (tab && activeTab.id !== tab.id) {
              setActiveTab(tab);
              // Update navbar without scrolling
              window.dispatchEvent(new CustomEvent('updateBuilderTab', { detail: { tabId: tab.id } }));
            }
            break;
          }
        }
      }
    };

    // Run immediately and on scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, activeTab, tabs]);

  return (
    <div className="w-full scroll-mt-24 pb-16" style={{ paddingTop: isMobile ? '16px' : '0' }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: isMobile ? '100%' : 'min(1280px, calc(100vw - 320px))',
          paddingLeft: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '0' : 'max(16px, min(32px, 2vw))'
        }}
      >
        {/* Section Title - Visible on all devices with responsive scaling */}
        <div className={`text-center px-4 ${isMobile ? 'mt-4' : 'mt-4'}`}
          style={{
            marginBottom: isMobile ? '20px' : `${getResponsiveValue(16)}px`,
          }}
        >
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: isMobile ? '32px' : '40px',
            }}
          >
            AI Agent
          </h2>
          <p className="text-gray-700 mx-auto max-w-3xl leading-relaxed text-base">
            What is an agent, anyway?
          </p>
        </div>

        {/* Desktop White Container with Tabs and Content */}
        <div className="hidden md:block bg-white rounded-[2rem] overflow-hidden relative" style={{
          border: '2px solid #9CA3AF',
          boxShadow: '0 12px 40px -8px rgba(139, 119, 89, 0.12), 0 4px 16px -4px rgba(139, 119, 89, 0.08)',
          zIndex: 10
        }}>
          {/* Tabs at Top with Description - All in same container */}
          <div className="bg-sena-cream/50 px-3 pt-3 pb-3 border-b border-gray-200">
            {/* Tabs Grid - Centered with 6 tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-2 max-w-5xl mx-auto">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab);
                  }}
                  className={`relative px-4 py-3 text-left rounded-xl cursor-pointer overflow-hidden transition-all duration-200 ${
                    activeTab.id === tab.id
                      ? "bg-[#8FB7C5]"
                      : "bg-[#F5F1E8] hover:bg-[#EBE7DE] border-2 border-[#9CA3AF]"
                  }`}
                  style={activeTab.id === tab.id ? {
                    boxShadow: '0 2px 8px -2px rgba(139, 119, 89, 0.2)',
                    minHeight: '72px',
                  } : {
                    boxShadow: 'none',
                    minHeight: '72px',
                  }}
                  whileHover={{ scale: activeTab.id === tab.id ? 1 : 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="relative z-10 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-futura font-bold text-sm mb-1 ${
                          activeTab.id === tab.id ? "text-white" : "text-[#6B7280]"
                        }`}
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {tab.label}
                      </div>
                      <div
                        className={`text-xs font-futura ${
                          activeTab.id === tab.id ? "text-white/80" : "text-[#9CA3AF]"
                        }`}
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        {tab.subtitle}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Tab Description - Within same cream container - More detailed */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="px-3 space-y-2"
              >
                <p className="text-[15px] text-gray-800 font-futura leading-relaxed">
                  {activeTab.agentDescription}
                </p>

                {/* Compact single-row badges with details button */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-gray-700 font-futura">
                  {activeTab.id === 'models' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="font-medium text-[10px]">Any LLM provider</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-medium text-[10px]">Failover chains</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium text-[10px]">Temperature control</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium text-[10px]">Token budgets</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'tools' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                        <span className="font-medium text-[10px]">350+ tools</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-medium text-[10px]">Approval gates</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-[10px]">API actions</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="font-medium text-[10px]">Per-tool control</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'skills' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="font-medium text-[10px]">Core skills</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium text-[10px]">On-demand</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-[10px]">Identity</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium text-[10px]">Domain knowledge</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'triggers' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-[10px]">Cron schedules</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium text-[10px]">Doc events</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="font-medium text-[10px]">Inbound messages</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="font-medium text-[10px]">Task assignments</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'ui' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="font-medium text-[10px]">Chat mode</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        <span className="font-medium text-[10px]">Split view</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-[10px]">Custom iframe</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        <span className="font-medium text-[10px]">No UI mode</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'logic' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="font-medium text-[10px]">Python modules</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-[10px]">Deterministic</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-[10px]">Version controlled</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-[#D1D5DB] text-[#6B7280]">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-medium text-[10px]">Business rules</span>
                      </div>
                    </>
                  )}
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content Area - Split layout: description left, animation right */}
          <div
            className="h-[380px] xl:h-[420px] 2xl:h-[460px] overflow-hidden relative"
            style={{
              backgroundColor: '#FAFAF8'
            }}
          >
              <div className="px-6 py-4 h-full overflow-y-auto">
                {activeTab.id === 'models' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    {/* Left: Compact info */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Models</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Choose which LLM powers your agent. Configure failover, parameters, and budgets per agent.
                        </p>
                      </div>

                      {/* Core Capabilities - Compact list */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Configuration</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="text-gray-900 font-medium">LLM Selection</span>
                            <span className="text-xs text-gray-500">Claude, GPT, Gemini, Llama</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-gray-900 font-medium">Failover Chains</span>
                            <span className="text-xs text-gray-500">Auto-switch on failure</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Parameters</span>
                            <span className="text-xs text-gray-500">Temperature, thinking mode</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Token Budgets</span>
                            <span className="text-xs text-gray-500">Per-agent cost control</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          All models via OpenRouter with unified API
                        </div>
                      </div>

                      {/* Key Features - Ultra compact */}
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Features</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Automatic failover when a model is down</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Extended thinking for complex reasoning</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Different models for different agents</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Cost tracking and budget enforcement</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Animation */}
                    <div className="rounded-xl overflow-hidden h-full">
                      <AgentsBuilderDemo />
                    </div>
                  </div>
                )}

                {activeTab.id === 'tools' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Tools</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Actions your agent can perform. Each with approval controls for full oversight.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tool Types</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Document Tools</span>
                            <span className="text-xs text-gray-500">Create, read, update</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">API Tools</span>
                            <span className="text-xs text-gray-500">External service calls</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Search Tools</span>
                            <span className="text-xs text-gray-500">Web, docs, knowledge base</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Communication</span>
                            <span className="text-xs text-gray-500">Email, WhatsApp, Slack</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          350+ tools with per-tool approval settings
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Features</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Enable or disable per agent</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Approval required or auto-execute</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Composio integration for external apps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden h-full">
                      <AgentsBuilderDemo />
                    </div>
                  </div>
                )}

                {activeTab.id === 'skills' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Skills</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Knowledge and instructions injected into your agent's context at runtime.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Skill Types</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Core Skills</span>
                            <span className="text-xs text-gray-500">Always loaded at wakeup</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-gray-900 font-medium">On-Demand Skills</span>
                            <span className="text-xs text-gray-500">Loaded when needed</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Identity</span>
                            <span className="text-xs text-gray-500">Agent persona and role</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-gray-900 font-medium">Domain Knowledge</span>
                            <span className="text-xs text-gray-500">Policies, processes, guides</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          Context-efficient loading keeps token usage low
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Features</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Markdown-based skill definitions</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Tool-specific usage guides</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Workflow instructions for complex tasks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden h-full">
                      <AgentsBuilderDemo />
                    </div>
                  </div>
                )}

                {activeTab.id === 'triggers' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Triggers</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Define when your agent wakes up. Scheduled, event-driven, or on-demand.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Trigger Types</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Scheduled</span>
                            <span className="text-xs text-gray-500">Cron jobs, intervals</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Document Events</span>
                            <span className="text-xs text-gray-500">On create, update, submit</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Inbound Messages</span>
                            <span className="text-xs text-gray-500">WhatsApp, email, chat</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="text-gray-900 font-medium">Task Assignments</span>
                            <span className="text-xs text-gray-500">From other agents</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          Mix and match triggers per agent
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Features</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Conditional trigger logic with filters</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">WhatsApp channel routing per agent</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Enable or disable triggers without deletion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden h-full">
                      <AgentsBuilderDemo />
                    </div>
                  </div>
                )}

                {activeTab.id === 'ui' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">UI</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Control how users interact with your agent. Multiple modes for different use cases.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">UI Modes</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Chat</span>
                            <span className="text-xs text-gray-500">Conversational interface</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Split View</span>
                            <span className="text-xs text-gray-500">Chat + workspace side by side</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Full Iframe</span>
                            <span className="text-xs text-gray-500">Custom dashboard or app</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            <span className="text-gray-900 font-medium">No UI</span>
                            <span className="text-xs text-gray-500">Background worker agents</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          Link any framework for custom interfaces
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Features</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">React, Vue, or any web framework</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Agents can render rich content in chat</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Role-based access per agent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden h-full">
                      <AgentsBuilderDemo />
                    </div>
                  </div>
                )}

                {activeTab.id === 'logic' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Logic</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Deterministic code for business rules that must run the same way every time.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Use Cases</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Calculations</span>
                            <span className="text-xs text-gray-500">Tax, pricing, payroll</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">API Endpoints</span>
                            <span className="text-xs text-gray-500">Custom REST APIs</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Background Jobs</span>
                            <span className="text-xs text-gray-500">Scheduled processing</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Validation Rules</span>
                            <span className="text-xs text-gray-500">Business constraints</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          Full version control via your own Frappe app
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Features</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Python modules with full Frappe API access</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Guaranteed same output every time</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">GitHub integration for code management</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden h-full">
                      <AgentsBuilderDemo />
                    </div>
                  </div>
                )}

              </div>
          </div>
        </div>


        {/* Mobile Builder - Show all tabs stacked vertically with separators */}
        {isMobile && (
          <div className="md:hidden w-full px-4">
            {/* BRD Builder Card - Hidden for now */}
            {/* <MobileBuilderCard
              id="mobile-builder-brd"
              title="BRD"
              subtitle="Define your business requirements"
              description="The Discovery Agent captures your business through conversation—processes, data, integrations, and goals. It generates a comprehensive Business Requirements Document."
              features={[
                "Business process mapping",
                "Data schema recommendations",
                "Module suggestions from registry",
                "AI agent recommendations"
              ]}
              workflowSteps={tabs[0].workflowSteps}
              chatMessages={tabs[0].chatMessages}
              detailedContent={{
                title: "Discovery Agent",
                description: "Captures your business requirements through conversation. Generates a complete BRD that becomes the blueprint for your custom ERP.",
                capabilities: [
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
                    title: "Business Summary",
                    subtitle: "What we learned"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>,
                    title: "Data Schema",
                    subtitle: "Recommended DocTypes"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
                    title: "Module Registry",
                    subtitle: "Pre-built modules"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                    title: "AI Agents",
                    subtitle: "Suggested agents"
                  }
                ],
                features: [
                  "Voice, text, docs, images supported",
                  "Industry best practices built-in",
                  "Web search for context enrichment",
                  "Editable before approval",
                  "One-click approval triggers build"
                ],
                footer: "Describe your business—we'll generate the blueprint"
              }}
              accentColor="#3B82F6"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              demoComponent={<MobileDataBuilderDemo />}
              onVisibilityChange={(isVisible) => {
                if (isVisible) {
                  setActiveBuilderTab("brd");
                  window.dispatchEvent(new CustomEvent('updateBuilderTab', { detail: { tabId: 'brd' } }));
                }
              }}
            />

            <div className="my-8">
              <div className="w-full h-px bg-gray-200"></div>
            </div> */}

            {/* Data Builder Card */}
            <MobileBuilderCard
              id="mobile-builder-data"
              title="Data"
              subtitle="Connect and transform data"
              description="Connect any data source to your ERP—databases, APIs, spreadsheets, or third-party tools. Automatically map schemas, transform data on the fly, and set up real-time sync pipelines."
              features={[
                "Database schema generation",
                "API & third-party integrations",
                "Real-time data pipelines",
                "Automatic data validation"
              ]}
              screenshots={[
                { src: "/images/data-fields.png", alt: "Data Fields" },
                { src: "/images/data-create.png", alt: "Data Create" },
                { src: "/images/data-records.png", alt: "Data Records" }
              ]}
              detailedContent={{
                title: "Data Management",
                description: "Build your data infrastructure through conversation. Connect databases, APIs, and external tools with automatic schema mapping and real-time sync.",
                capabilities: [
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
                    title: "Database Schema",
                    subtitle: "Auto-generate tables & relations"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                    title: "API Integration",
                    subtitle: "REST, GraphQL, webhooks"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
                    title: "Real-time Sync",
                    subtitle: "Live data pipelines"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    title: "Validation",
                    subtitle: "Type safety & constraints"
                  }
                ],
                features: [
                  "Connect PostgreSQL, MySQL, MongoDB",
                  "Integrate with any REST/GraphQL API",
                  "Import from CSV, Excel, Google Sheets",
                  "Automatic data transformation",
                  "Real-time change tracking"
                ],
                footer: "Connect any data source—we'll handle the rest"
              }}
              accentColor="#8FB7C5"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              }
              demoComponent={<MobileDataBuilderDemo />}
              onVisibilityChange={(isVisible) => {
                if (isVisible) {
                  setActiveBuilderTab("data");
                  window.dispatchEvent(new CustomEvent('updateBuilderTab', { detail: { tabId: 'data' } }));
                }
              }}
            />

            {/* Section Divider */}
            <div className="my-6 flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#9CA3AF] to-transparent"></div>
            </div>

            {/* Workflows Builder Card */}
            <MobileBuilderCard
              id="mobile-builder-workflows"
              title="Workflows"
              subtitle="Automate complex processes"
              description="Automate your entire business process from lead to cash. Design multi-step workflows with triggers, conditional logic, and actions across your tools."
              features={[
                "Multi-step automation flows",
                "Conditional logic & branching",
                "Cross-tool integrations",
                "Real-time monitoring & alerts"
              ]}
              screenshots={[
                { src: "/images/workflow-summary.png", alt: "Workflow Summary" },
                { src: "/images/workflow-detailed.png", alt: "Workflow Detailed" }
              ]}
              detailedContent={{
                title: "Workflow Automation",
                description: "Design and deploy complex multi-step workflows. Connect triggers, add conditions, and automate actions across all your tools and data sources.",
                capabilities: [
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                    title: "Triggers",
                    subtitle: "Events, schedules, webhooks"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    title: "Conditions",
                    subtitle: "If/else logic & branching"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
                    title: "Actions",
                    subtitle: "API calls, emails, updates"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                    title: "Monitoring",
                    subtitle: "Real-time logs & alerts"
                  }
                ],
                features: [
                  "Visual workflow builder",
                  "Connect any API or service",
                  "Advanced conditional logic",
                  "Error handling & retries",
                  "Performance analytics"
                ],
                footer: "Automate anything—from simple tasks to complex processes"
              }}
              accentColor="#8FB7C5"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              demoComponent={<MobileWorkflowsBuilderDemo />}
              onVisibilityChange={(isVisible) => {
                if (isVisible) {
                  setActiveBuilderTab("workflows");
                  window.dispatchEvent(new CustomEvent('updateBuilderTab', { detail: { tabId: 'workflows' } }));
                }
              }}
            />

            {/* Section Divider */}
            <div className="my-6 flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#9CA3AF] to-transparent"></div>
            </div>

            {/* Agents Builder Card */}
            <MobileBuilderCard
              id="mobile-builder-agents"
              title="Agents"
              subtitle="Deploy AI-powered agents"
              description="Deploy AI agents that work alongside your team. Train them on your docs, processes, and data to handle customer support, data entry, analysis, or custom tasks."
              features={[
                "Custom AI agents for any task",
                "Train on your documentation",
                "24/7 autonomous operation",
                "Full reasoning transparency"
              ]}
              screenshots={[
                { src: "/images/agents-role.jpeg", alt: "Agent Role Configuration" },
                { src: "/images/agents-greeting.jpeg", alt: "Agent Greeting Stages" },
                { src: "/images/agents-personality.jpeg", alt: "Agent Personality Settings" },
                { src: "/images/agents-mode.jpeg", alt: "Agent Mode Configuration" }
              ]}
              detailedContent={{
                title: "AI Agent Platform",
                description: "Build and deploy autonomous AI agents that understand your business. Train them on your knowledge base, integrate with your tools, and let them work alongside your team.",
                capabilities: [
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                    title: "Custom Agents",
                    subtitle: "Support, sales, operations"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                    title: "Knowledge Base",
                    subtitle: "Train on your docs & data"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                    title: "Tool Integration",
                    subtitle: "Access APIs & databases"
                  },
                  {
                    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                    title: "Transparency",
                    subtitle: "Full reasoning logs"
                  }
                ],
                features: [
                  "Natural language interaction",
                  "Multi-modal support (text, voice, vision)",
                  "Custom function calling",
                  "Continuous learning from feedback",
                  "Enterprise-grade security"
                ],
                footer: "Deploy AI agents that actually understand your business"
              }}
              accentColor="#8FB7C5"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              demoComponent={<MobileAgentsBuilderDemo />}
              onVisibilityChange={(isVisible) => {
                if (isVisible) {
                  setActiveBuilderTab("agents");
                  window.dispatchEvent(new CustomEvent('updateBuilderTab', { detail: { tabId: 'agents' } }));
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
