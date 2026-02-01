"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import UIBuilderDemo from "./UIBuilderDemo"; // REMOVED: Interfaces tab
import DataBuilderDemo from "./DataBuilderDemo";
import WorkflowsBuilderDemo from "./WorkflowsBuilderDemo";
import AgentsBuilderDemo from "./AgentsBuilderDemo";
import MobileBuilderCard from "./MobileBuilderCard";
// import MobileUIBuilderDemo from "./MobileUIBuilderDemo"; // REMOVED: Interfaces tab
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

// Color themes for each tab - ALL BLUE
const tabThemes = {
  brd: {
    primary: '#3B82F6', // blue-600
    light: '#EFF6FF', // blue-50
    border: '#BFDBFE', // blue-200
    ring: 'rgba(59, 130, 246, 0.5)',
  },
  data: {
    primary: '#3B82F6', // blue-600
    light: '#EFF6FF', // blue-50
    border: '#BFDBFE', // blue-200
    ring: 'rgba(59, 130, 246, 0.5)',
  },
  workflows: {
    primary: '#3B82F6', // blue-600
    light: '#EFF6FF', // blue-50
    border: '#BFDBFE', // blue-200
    ring: 'rgba(59, 130, 246, 0.5)',
  },
  agents: {
    primary: '#3B82F6', // blue-600
    light: '#EFF6FF', // blue-50
    border: '#BFDBFE', // blue-200
    ring: 'rgba(59, 130, 246, 0.5)',
  },
};

const tabs: Tab[] = [
  {
    id: "brd",
    label: "BRD",
    subtitle: "Define your business requirements.",
    agentTitle: "Discovery Agent",
    agentDescription: "The Discovery Agent captures everything about your business through conversation—processes, data, integrations, and goals. It generates a comprehensive Business Requirements Document that becomes the blueprint for your custom ERP system.",
    workflowSteps: [
      { id: "discover", label: "Discover business needs", status: "complete" },
      { id: "analyze", label: "Analyze requirements", status: "complete" },
      { id: "generate", label: "Generate BRD", status: "loading" },
      { id: "review", label: "Review recommendations" },
      { id: "approve", label: "Approve & build" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "Tell me about your business operations" },
      { id: "2", type: "user", text: "We're a manufacturing company with 50 employees..." },
      { id: "3", type: "agent", text: "Generating your BRD with recommended modules and agents..." },
    ],
  },
  {
    id: "data",
    label: "Data",
    subtitle: "Connect and transform data.",
    agentTitle: "Data Connector",
    agentDescription: "Connect any data source to your ERP—databases, APIs, spreadsheets, or third-party tools. Automatically map schemas, transform data on the fly, and set up real-time sync pipelines. No coding required, just tell us what data you need and where it should go.",
    workflowSteps: [
      { id: "connect", label: "Connect data source", status: "complete" },
      { id: "schema", label: "Map data schema", status: "complete" },
      { id: "transform", label: "Transform data", status: "loading" },
      { id: "validate", label: "Validate pipeline" },
      { id: "sync", label: "Sync data" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "Ready to connect your data!" },
      { id: "2", type: "user", text: "Connect my Salesforce data" },
      { id: "3", type: "agent", text: "Successfully connected. Syncing 10,000 records..." },
    ],
  },
  {
    id: "workflows",
    label: "Workflows",
    subtitle: "Automate complex processes.",
    agentTitle: "Workflow Engine",
    agentDescription: "Automate your entire business process from lead to cash. Design multi-step workflows with triggers, conditional logic, and actions across your tools. From simple notifications to complex approval chains—describe the process in plain language and we'll build the automation.",
    workflowSteps: [
      { id: "trigger", label: "Set up trigger", status: "complete" },
      { id: "condition", label: "Add conditions", status: "complete" },
      { id: "action", label: "Configure actions", status: "loading" },
      { id: "test", label: "Test workflow" },
      { id: "activate", label: "Activate workflow" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "Let's automate your workflow!" },
      { id: "2", type: "user", text: "When a lead submits, send to Slack" },
      { id: "3", type: "agent", text: "Workflow created! Triggering on form submission..." },
    ],
  },
  {
    id: "agents",
    label: "Agents",
    subtitle: "Deploy AI-powered agents.",
    agentTitle: "Agent Builder",
    agentDescription: "Deploy AI agents that work alongside your team. Train them on your docs, processes, and data to handle customer support, data entry, analysis, or custom tasks. They understand context, make decisions, and take actions across your systems—24/7, with full transparency into their reasoning.",
    workflowSteps: [
      { id: "define", label: "Define agent purpose", status: "complete" },
      { id: "train", label: "Train on your data", status: "complete" },
      { id: "test", label: "Test agent responses", status: "loading" },
      { id: "integrate", label: "Integrate with tools" },
      { id: "launch", label: "Launch agent" },
    ],
    chatMessages: [
      { id: "1", type: "agent", text: "Let's build your AI agent!" },
      { id: "2", type: "user", text: "Create a support agent for product questions" },
      { id: "3", type: "agent", text: "Training agent on your documentation and FAQs..." },
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
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
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

  const openImageExpanded = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeImageExpanded = () => {
    setExpandedImage(null);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        {/* Image Container - rounded, no visible border */}
        <div
          onClick={() => openImageExpanded(images[currentIndex].src)}
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
              onClick={() => openImageExpanded(images[currentIndex].src)}
            />
          </AnimatePresence>
        </div>

      {/* Navigation BELOW image - like BlogSection */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasPrev
                ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer'
                : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous interface"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-waygent-blue scale-125'
                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasNext
                ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer'
                : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next interface"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

    {/* Image Expanded Modal */}
    <AnimatePresence>
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={closeImageExpanded}
        >
          {/* Close button - top right */}
          <button
            onClick={closeImageExpanded}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

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
              src={expandedImage}
              alt="Expanded interface"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

// Data Gallery Component - Same design as Interface
function DataGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const images = [
    { src: "/images/data-fields.png", alt: "Data Fields" },
    { src: "/images/data-create.png", alt: "Data Create" },
    { src: "/images/data-records.png", alt: "Data Records" }
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openImageExpanded = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeImageExpanded = () => {
    setExpandedImage(null);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        <div
          onClick={() => openImageExpanded(images[currentIndex].src)}
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
              onClick={() => openImageExpanded(images[currentIndex].src)}
            />
          </AnimatePresence>
        </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasPrev ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-waygent-blue scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasNext ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-gray-600 font-futura">
          Page <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of <span className="font-semibold text-gray-900">{images.length}</span>
        </div>
      </div>
    </div>

    {/* Image Expanded Modal */}
    <AnimatePresence>
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={closeImageExpanded}
        >
          {/* Close button - top right */}
          <button
            onClick={closeImageExpanded}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

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
              src={expandedImage}
              alt="Expanded data view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

// Workflows Gallery Component - Same design as Interface
function WorkflowsGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const images = [
    { src: "/images/workflow-summary.png", alt: "Workflow Summary" },
    { src: "/images/workflow-detailed.png", alt: "Workflow Detailed" }
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openImageExpanded = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeImageExpanded = () => {
    setExpandedImage(null);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        <div
          onClick={() => openImageExpanded(images[currentIndex].src)}
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
              onClick={() => openImageExpanded(images[currentIndex].src)}
            />
          </AnimatePresence>
        </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasPrev ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-waygent-blue scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasNext ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-gray-600 font-futura">
          Page <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of <span className="font-semibold text-gray-900">{images.length}</span>
        </div>
      </div>
    </div>

    {/* Image Expanded Modal */}
    <AnimatePresence>
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={closeImageExpanded}
        >
          {/* Close button - top right */}
          <button
            onClick={closeImageExpanded}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

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
              src={expandedImage}
              alt="Expanded workflow view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

// Agents Gallery Component - Same design as Interface
function AgentsGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const images = [
    { src: "/images/agents-role.jpeg", alt: "Agent Role Configuration" },
    { src: "/images/agents-greeting.jpeg", alt: "Agent Greeting Stages" },
    { src: "/images/agents-personality.jpeg", alt: "Agent Personality Settings" },
    { src: "/images/agents-mode.jpeg", alt: "Agent Mode Configuration" }
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  const openImageExpanded = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeImageExpanded = () => {
    setExpandedImage(null);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <>
      <div className="relative flex flex-col h-full gap-3">
        <div
          onClick={() => openImageExpanded(images[currentIndex].src)}
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
            onClick={() => openImageExpanded(images[currentIndex].src)}
          />
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToPrev}
            disabled={!hasPrev}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasPrev ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-waygent-blue scale-125' : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={!hasNext}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              hasNext ? 'border-waygent-blue text-waygent-blue hover:bg-waygent-blue hover:text-white hover:scale-110 cursor-pointer' : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-gray-600 font-futura">
          Page <span className="font-semibold text-gray-900">{currentIndex + 1}</span> of <span className="font-semibold text-gray-900">{images.length}</span>
        </div>
      </div>
    </div>

    {/* Image Expanded Modal */}
    <AnimatePresence>
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={closeImageExpanded}
        >
          {/* Close button - top right */}
          <button
            onClick={closeImageExpanded}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

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
              src={expandedImage}
              alt="Expanded agent view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

export default function BuilderTabbed() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeBuilderTab, setActiveBuilderTab] = useState("brd"); // BRD is now the first tab
  const [viewportHeight, setViewportHeight] = useState(900);
  const [showDetails, setShowDetails] = useState(true);

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
      const sections = ['brd', 'data', 'workflows', 'agents']; // BRD is now the first tab
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
            Builder
          </h2>
          <p className="text-gray-700 mx-auto max-w-3xl leading-relaxed text-base">
            Build, scale, and manage your entire AI workforce with one platform.
          </p>
        </div>

        {/* Desktop White Container with Tabs and Content */}
        <div className="hidden md:block bg-white rounded-[2rem] overflow-hidden relative" style={{
          border: '2px solid #9CA3AF',
          boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)',
          zIndex: 10
        }}>
          {/* Tabs at Top with Description - All in same container */}
          <div className="bg-waygent-cream/50 px-3 pt-3 pb-3 border-b border-gray-200">
            {/* Tabs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab);
                  }}
                  className={`relative px-3 py-2 text-left rounded-lg cursor-pointer overflow-hidden ${
                    activeTab.id === tab.id
                      ? ""
                      : "bg-white hover:bg-waygent-cream border border-gray-200/50"
                  }`}
                  style={activeTab.id === tab.id ? {
                    boxShadow: `0 6px 15px -3px ${tabThemes[tab.id as keyof typeof tabThemes].ring}, 0 3px 8px -2px ${tabThemes[tab.id as keyof typeof tabThemes].ring}`
                  } : {
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)'
                  }}
                  whileHover={{ scale: activeTab.id === tab.id ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {activeTab.id === tab.id && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: tabThemes[tab.id as keyof typeof tabThemes].primary }}
                      layoutId="activeTabBackground"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8
                      }}
                    />
                  )}
                  <div className="relative z-10 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-futura font-bold text-sm mb-1 ${
                          activeTab.id === tab.id ? "text-white" : "text-waygent-text-primary"
                        }`}
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {tab.label}
                      </div>
                      <div
                        className={`text-xs font-futura ${
                          activeTab.id === tab.id ? "text-white/90" : "text-waygent-text-secondary"
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
                  {activeTab.id === 'brd' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.brd.light}80`,
                        borderColor: `${tabThemes.brd.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.brd.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Auto-generated</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.brd.light}80`,
                        borderColor: `${tabThemes.brd.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.brd.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-medium">Conversational</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.brd.light}80`,
                        borderColor: `${tabThemes.brd.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.brd.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">One-click approve</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'data' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.data.light}80`,
                        borderColor: `${tabThemes.data.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.data.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        <span className="font-medium">Any database</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.data.light}80`,
                        borderColor: `${tabThemes.data.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.data.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium">Auto schemas</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.data.light}80`,
                        borderColor: `${tabThemes.data.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.data.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-medium">Secure & validated</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.data.light}80`,
                        borderColor: `${tabThemes.data.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.data.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-medium">Real-time sync</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'workflows' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.workflows.light}80`,
                        borderColor: `${tabThemes.workflows.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.workflows.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="font-medium">Event triggers</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.workflows.light}80`,
                        borderColor: `${tabThemes.workflows.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.workflows.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="font-medium">Branching logic</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.workflows.light}80`,
                        borderColor: `${tabThemes.workflows.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.workflows.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-medium">Auto retry</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.workflows.light}80`,
                        borderColor: `${tabThemes.workflows.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.workflows.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium">Monitor & logs</span>
                      </div>
                    </>
                  )}
                  {activeTab.id === 'agents' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.agents.light}80`,
                        borderColor: `${tabThemes.agents.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.agents.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="font-medium">Custom training</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.agents.light}80`,
                        borderColor: `${tabThemes.agents.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.agents.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium">Tool access</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.agents.light}80`,
                        borderColor: `${tabThemes.agents.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.agents.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">Human oversight</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.agents.light}80`,
                        borderColor: `${tabThemes.agents.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.agents.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Full audit trail</span>
                      </div>
                    </>
                  )}
                  </div>

                  {/* Toggle pill - Show for all tabs */}
                  <div className="relative inline-flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
                    {/* Sliding indicator */}
                    <motion.div
                      className="absolute rounded-full shadow-sm"
                      animate={{
                        x: showDetails ? '0%' : 'calc(100% - 2px)',
                      }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8
                      }}
                      style={{
                        height: 'calc(100% - 8px)',
                        width: 'calc(50% - 2px)',
                        top: '4px',
                        left: '4px',
                        backgroundColor: '#3B82F6'
                      }}
                    />

                    {/* Details button */}
                    <button
                      onClick={() => setShowDetails(true)}
                      className={`relative z-10 px-3 py-1 rounded-full text-[10px] font-medium transition-colors duration-200 ${
                        showDetails ? 'text-white' : 'text-gray-600'
                      }`}
                      style={{ width: '50%' }}
                    >
                      Details
                    </button>

                    {/* Animation button */}
                    <button
                      onClick={() => setShowDetails(false)}
                      className={`relative z-10 px-3 py-1 rounded-full text-[10px] font-medium transition-colors duration-200 ${
                        !showDetails ? 'text-white' : 'text-gray-600'
                      }`}
                      style={{ width: '50%' }}
                    >
                      Animation
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content Area - Fixed height, description expands to cover animation */}
          <div
            className="h-[380px] xl:h-[420px] 2xl:h-[460px] overflow-hidden relative"
            style={{
              backgroundColor: '#F7F9FC'
            }}
          >
            {/* Description area that slides down like a curtain/screen */}
            <motion.div
              className="absolute top-0 left-0 right-0 overflow-hidden"
              initial={false}
              animate={{
                height: showDetails ? "100%" : "0%"
              }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0.0, 0.2, 1]
              }}
              style={{
                zIndex: 100,
                backgroundColor: '#FCFCFA',
                isolation: 'isolate'
              }}
            >
              <motion.div
                className="px-6 py-4 h-full overflow-y-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: showDetails ? 1 : 0,
                  y: showDetails ? 0 : -20
                }}
                transition={{ duration: 0.4, delay: showDetails ? 0.4 : 0 }}
              >
                {activeTab.id === 'brd' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    {/* Left: Compact info */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Discovery Agent</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Captures your business requirements through conversation. Generates a complete BRD.
                        </p>
                      </div>

                      {/* BRD Contains - Compact list */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">BRD Contains</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-gray-900 font-medium">Business Summary</span>
                            <span className="text-xs text-gray-500">What we learned</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                            <span className="text-gray-900 font-medium">Data Schema</span>
                            <span className="text-xs text-gray-500">Recommended DocTypes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-gray-900 font-medium">Module Registry</span>
                            <span className="text-xs text-gray-500">Pre-built modules</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">AI Agents</span>
                            <span className="text-xs text-gray-500">Suggested agents</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span className="text-gray-900 font-medium">Integrations</span>
                            <span className="text-xs text-gray-500">External systems</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          One-click approval triggers system build
                        </div>
                      </div>

                      {/* Key Features - Ultra compact */}
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Capabilities</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Voice, text, docs, images supported</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Industry best practices built-in</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Web search for context enrichment</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Editable before approval</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: BRD Preview placeholder */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-blue-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-gray-500 font-futura">BRD Preview</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab.id === 'data' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    {/* Left: Compact info */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Data Connector</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Connect any data source. Auto schema mapping, transformations, and real-time sync.
                        </p>
                      </div>

                      {/* Core Capabilities - Compact list */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Core Capabilities</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                            <span className="text-gray-900 font-medium">Database Connections</span>
                            <span className="text-xs text-gray-500">PostgreSQL, MySQL, MongoDB</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">API Integration</span>
                            <span className="text-xs text-gray-500">REST, GraphQL, webhooks</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-gray-900 font-medium">SaaS Connectors</span>
                            <span className="text-xs text-gray-500">Salesforce, HubSpot, Stripe</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">File Import</span>
                            <span className="text-xs text-gray-500">CSV, Excel, JSON, XML</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          50+ data sources with auto schema detection
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
                            <span className="text-xs text-gray-700">Auto schema mapping and detection</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Real-time bidirectional sync</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Data transformation and validation</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Conflict resolution and error handling</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Data Gallery */}
                    <DataGallery />
                  </div>
                )}

                {activeTab.id === 'workflows' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    {/* Left: Compact info */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Workflow Engine</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Automate business processes. Set triggers, conditional logic, and chain actions.
                        </p>
                      </div>

                      {/* Core Capabilities - Compact list */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Core Capabilities</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="text-gray-900 font-medium">Event Triggers</span>
                            <span className="text-xs text-gray-500">Form submit, data changes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span className="text-gray-900 font-medium">Conditional Logic</span>
                            <span className="text-xs text-gray-500">If/else, branching paths</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span className="text-gray-900 font-medium">Multi-step Actions</span>
                            <span className="text-xs text-gray-500">Chain complex operations</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Scheduled Jobs</span>
                            <span className="text-xs text-gray-500">Cron, recurring tasks</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          Visual builder with drag-and-drop nodes
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
                            <span className="text-xs text-gray-700">Real-time monitoring and logs</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Auto retry with exponential backoff</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Version control and rollback</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Test mode before deployment</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Workflows Gallery */}
                    <WorkflowsGallery />
                  </div>
                )}

                {activeTab.id === 'agents' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    {/* Left: Compact info */}
                    <div className="space-y-3">
                      {/* Header */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Agent Builder</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Deploy AI agents that understand your business, make decisions, and take actions autonomously.
                        </p>
                      </div>

                      {/* Core Capabilities - Compact list */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Core Capabilities</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Natural Language</span>
                            <span className="text-xs text-gray-500">Conversations</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Data Analysis</span>
                            <span className="text-xs text-gray-500">Reporting</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-gray-900 font-medium">Automated Actions</span>
                            <span className="text-xs text-gray-500">Workflows</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span className="text-gray-900 font-medium">Decision Routing</span>
                            <span className="text-xs text-gray-500">Escalation</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                          Configure personality, stages, tools, and model parameters
                        </div>
                      </div>

                      {/* Key Features - Ultra compact */}
                      <div className="space-y-1.5 pt-2 border-t border-gray-200">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Enterprise Features</div>
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Full reasoning & audit logs</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Human oversight & approvals</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">Custom training on your data</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-700">24/7 autonomous operation</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Agents Gallery */}
                    <AgentsGallery />
                  </div>
                )}
                  </motion.div>
            </motion.div>

            {/* Animation area - always rendered underneath the screen */}
            <AnimatePresence mode="sync">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {/* BRD tab uses DataBuilderDemo as placeholder for now */}
                {activeTab.id === "brd" ? (
                  <DataBuilderDemo />
                ) : activeTab.id === "data" ? (
                  <DataBuilderDemo />
                ) : activeTab.id === "workflows" ? (
                  <WorkflowsBuilderDemo />
                ) : activeTab.id === "agents" ? (
                  <AgentsBuilderDemo />
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                {/* Left Section - Workflow */}
                <div className="relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-8 lg:p-10 overflow-hidden lg:border-r border-gray-200/50">
                    <>
                      {/* Dotted Background Pattern */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)`,
                          backgroundSize: "24px 24px",
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Workflow Steps with Complex Animation */}
                        <motion.div
                          className="space-y-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                      {activeTab.workflowSteps.map((step, index) => (
                        <motion.div
                          key={`${activeTab.id}-${step.id}`}
                          variants={workflowItemVariants}
                          className="relative"
                        >
                          <motion.div
                            className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                              step.status === "complete"
                                ? "bg-white/80 shadow-sm border border-gray-100"
                                : step.status === "loading"
                                ? "bg-white shadow-lg ring-2 ring-waygent-blue/50"
                                : "bg-white/40 border border-gray-100/50"
                            }`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              step.status === "complete"
                                ? "bg-green-100 text-green-600"
                                : step.status === "loading"
                                ? "bg-waygent-blue/10 text-waygent-blue"
                                : "bg-gray-100 text-gray-400"
                            }`}>
                              {step.status === "complete" && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {step.status === "loading" && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                </motion.div>
                              )}
                              {!step.status && (
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-medium font-futura ${
                                step.status ? "text-gray-900" : "text-gray-500"
                              }`}
                              style={{ letterSpacing: "-0.01em" }}
                            >
                              {step.label}
                            </span>
                            {step.status === "loading" && (
                              <motion.div
                                className="ml-auto flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <motion.div
                                  className="flex gap-1"
                                  animate={{ opacity: [0.4, 1, 0.4] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-waygent-blue" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-waygent-blue" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-waygent-blue" />
                                </motion.div>
                              </motion.div>
                            )}
                          </motion.div>

                          {/* Connecting Line with Animation */}
                          {index < activeTab.workflowSteps.length - 1 && (
                            <motion.div
                              className="w-0.5 h-3 bg-gradient-to-b from-gray-300 to-transparent ml-10 my-1"
                              initial={{ scaleY: 0, originY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: 0.15 * index + 0.2, duration: 0.3 }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                    </>
                  </div>

                {/* Right Section - Chat Interface */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 lg:p-10 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <motion.div
                      className="flex items-center justify-between pb-5 border-b border-gray-200/80"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-waygent-blue flex items-center justify-center text-white shadow-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm uppercase tracking-wide font-futura">
                          {activeTab.agentTitle}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </motion.div>

                    {/* Messages */}
                    <div className="flex-1 py-6 space-y-4">
                      <motion.div
                        className="text-center text-xs text-gray-400 uppercase tracking-wider mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-gray-300" />
                          <div className="w-1 h-1 rounded-full bg-gray-300" />
                          <div className="w-1 h-1 rounded-full bg-gray-300" />
                        </div>
                      </motion.div>

                      {activeTab.chatMessages.map((message, index) => (
                        <motion.div
                          key={`${activeTab.id}-${message.id}`}
                          custom={index}
                          variants={chatMessageVariants}
                          initial="hidden"
                          animate="visible"
                          className={`flex ${
                            message.type === "agent" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl max-w-[85%] font-futura ${
                              message.type === "agent"
                                ? "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
                                : "bg-waygent-blue text-white rounded-tr-sm shadow-sm"
                            }`}
                            style={{ letterSpacing: "-0.01em" }}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Input Area */}
                    <motion.div
                      className="mt-auto relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <input
                        type="text"
                        placeholder="Ask"
                        className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-waygent-blue focus:border-transparent transition-all font-futura shadow-sm"
                        style={{ letterSpacing: "-0.01em" }}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-waygent-blue transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  </div>
                </div>
                </div>
              )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Builder - Show all tabs stacked vertically with separators */}
        {isMobile && (
          <div className="md:hidden w-full px-4">
            {/* BRD Builder Card */}
            <MobileBuilderCard
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

            {/* Section Divider */}
            <div className="my-8">
              <div className="w-full h-px bg-gray-200"></div>
            </div>

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
              accentColor="#10B981"
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
            <div className="my-8">
              <div className="w-full h-px bg-gray-200"></div>
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
              accentColor="#8B5CF6"
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
            <div className="my-8">
              <div className="w-full h-px bg-gray-200"></div>
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
              accentColor="#EC4899"
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
