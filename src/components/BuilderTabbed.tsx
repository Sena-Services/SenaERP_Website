"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UIBuilderDemo from "./UIBuilderDemo";
import DataBuilderDemo from "./DataBuilderDemo";
import WorkflowsBuilderDemo from "./WorkflowsBuilderDemo";
import AgentsBuilderDemo from "./AgentsBuilderDemo";
import MobileBuilderCard from "./MobileBuilderCard";
import MobileUIBuilderDemo from "./MobileUIBuilderDemo";
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

// Color themes for each tab
const tabThemes = {
  ui: {
    primary: '#3B82F6', // blue-600
    light: '#EFF6FF', // blue-50
    border: '#BFDBFE', // blue-200
    ring: 'rgba(59, 130, 246, 0.5)',
  },
  data: {
    primary: '#10B981', // green-600
    light: '#ECFDF5', // green-50
    border: '#A7F3D0', // green-200
    ring: 'rgba(16, 185, 129, 0.5)',
  },
  workflows: {
    primary: '#8B5CF6', // violet-600
    light: '#F5F3FF', // violet-50
    border: '#DDD6FE', // violet-200
    ring: 'rgba(139, 92, 246, 0.5)',
  },
  agents: {
    primary: '#EC4899', // pink-600
    light: '#FDF2F8', // pink-50
    border: '#FBCFE8', // pink-200
    ring: 'rgba(236, 72, 153, 0.5)',
  },
};

const tabs: Tab[] = [
  {
    id: "ui",
    label: "Interfaces",
    subtitle: "Build beautiful interfaces.",
    agentTitle: "Interface Builder",
    agentDescription: "Build complete user interfaces through conversation. From dashboards and data tables to forms and custom layouts—just describe what you need, and watch it build in real-time with live previews, responsive design, and beautiful animations built in.",
    workflowSteps: [
      { id: "understand", label: "Understand request", status: "complete" },
      { id: "generate", label: "Generate layout", status: "complete" },
      { id: "style", label: "Apply styling", status: "complete" },
      { id: "animate", label: "Add animations", status: "loading" },
      { id: "preview", label: "Render preview" },
    ],
    chatMessages: [
      { id: "1", type: "user", text: "Create a dashboard with revenue cards and charts" },
      { id: "2", type: "agent", text: "Building your dashboard with 3 metric cards and a revenue chart..." },
      { id: "3", type: "agent", text: "Dashboard ready! Added smooth animations and responsive layout." },
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

export default function BuilderTabbed() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeBuilderTab, setActiveBuilderTab] = useState("ui");
  const [viewportHeight, setViewportHeight] = useState(900);
  const [showDetails, setShowDetails] = useState(false);

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
      const sections = ['ui', 'data', 'workflows', 'agents'];
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
        <div className="hidden md:block bg-white rounded-[2rem] overflow-hidden" style={{
          border: '2px solid #9CA3AF',
          boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)'
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
                    setShowDetails(false); // Reset details view when switching tabs
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
                  {activeTab.id === 'ui' && (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.ui.light}80`,
                        borderColor: `${tabThemes.ui.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.ui.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-medium">Live preview</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.ui.light}80`,
                        borderColor: `${tabThemes.ui.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.ui.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-medium">Component library</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border" style={{
                        backgroundColor: `${tabThemes.ui.light}80`,
                        borderColor: `${tabThemes.ui.border}80`
                      }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tabThemes.ui.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Accessible</span>
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

                  {/* Toggle button - Show for all tabs */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-[10px] font-medium text-gray-700 whitespace-nowrap"
                  >
                    {showDetails ? 'Animation' : 'Details'}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={showDetails ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content Area - Fixed height, description expands to cover animation */}
          <div
            className="h-[380px] xl:h-[420px] 2xl:h-[460px] overflow-hidden relative"
            style={{
              backgroundColor: activeTab.id === 'ui' ? '#F0EFE9' :
                             activeTab.id === 'data' ? '#ECFDF5' :
                             activeTab.id === 'workflows' ? '#F5F3FF' :
                             activeTab.id === 'agents' ? '#FDF2F8' : '#F0EFE9'
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
                zIndex: 10,
                backgroundColor: activeTab.id === 'ui' ? '#F0EFE9' :
                               activeTab.id === 'data' ? '#ECFDF5' :
                               activeTab.id === 'workflows' ? '#F5F3FF' :
                               activeTab.id === 'agents' ? '#FDF2F8' : '#F0EFE9'
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
                {activeTab.id === 'ui' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-futura">Interface Builder</h3>
                      <p className="text-base text-gray-700 leading-relaxed font-futura">
                        Describe what you need and get production-ready interfaces in real-time. Pull from our component registry or create custom layouts through conversation.
                      </p>
                    </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-1">100+</div>
                      <div className="text-xs text-gray-600 font-futura">Registry Components</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-1">&lt;5s</div>
                      <div className="text-xs text-gray-600 font-futura">Real-time Creation</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                      <div className="text-xs text-gray-600 font-futura">Lines of Code</div>
                    </div>
                  </div>

                  {/* Conversational Examples */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      How It Works
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="text-xs text-blue-600 font-semibold mb-1">You:</div>
                        <div className="text-sm text-gray-700 font-futura italic">"Create a dashboard with revenue cards and a weekly chart"</div>
                      </div>
                      <div className="text-center text-blue-400">
                        <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="text-xs text-green-600 font-semibold mb-1">Sena:</div>
                        <div className="text-xs text-gray-600 font-futura space-y-1">
                          <div>✓ 3 metric cards (Revenue, Orders, Users) with growth indicators</div>
                          <div>✓ Interactive bar chart with 7-day data</div>
                          <div>✓ Responsive layout with smooth animations</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Component Registry */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">Component Registry</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="text-xs font-semibold text-gray-900">Data Tables</div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-futura">Sorting, filtering, pagination, inline editing</div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="text-xs font-semibold text-gray-900">Charts</div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-futura">Bar, line, pie, area with animations</div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="text-xs font-semibold text-gray-900">Forms</div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-futura">Validation, multi-step wizards, file upload</div>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                          </div>
                          <div className="text-xs font-semibold text-gray-900">Modals</div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-futura">Dialogs, drawers, confirmations, sheets</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500 font-futura">+ Navigation, Tabs, Dropdowns, Tooltips, Notifications, and 90+ more</span>
                    </div>
                  </div>

                  {/* Real-time Creation */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">Real-time Interface Creation</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Registry + Custom</div>
                          <div className="text-xs text-gray-600 font-futura">Pull pre-built components from the registry or create new ones on the fly</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Fully Customizable</div>
                          <div className="text-xs text-gray-600 font-futura">Adjust colors, typography, spacing—globally or per component</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Interactive Prototypes</div>
                          <div className="text-xs text-gray-600 font-futura">Test full functionality before deployment with clickable, working interfaces</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                )}

                {activeTab.id === 'data' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-futura">Data Connector</h3>
                      <p className="text-base text-gray-700 leading-relaxed font-futura">
                        Connect any data source—databases, APIs, spreadsheets—and let Sena handle schema mapping, data transformation, and real-time sync pipelines.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-1">50+</div>
                        <div className="text-xs text-gray-600 font-futura">Data Sources</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-1">Auto</div>
                        <div className="text-xs text-gray-600 font-futura">Schema Mapping</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-1">Real-time</div>
                        <div className="text-xs text-gray-600 font-futura">Sync Pipelines</div>
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        From Source to ERP
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 border border-green-100">
                          <div className="text-xs text-green-600 font-semibold mb-1">You:</div>
                          <div className="text-sm text-gray-700 font-futura italic">"Connect my Salesforce CRM data"</div>
                        </div>
                        <div className="text-center text-green-400">
                          <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-green-100">
                          <div className="text-xs text-green-600 font-semibold mb-1">Sena:</div>
                          <div className="text-xs text-gray-600 font-futura space-y-1">
                            <div>✓ Authenticates with Salesforce API</div>
                            <div>✓ Maps Accounts, Contacts, Opportunities to your schema</div>
                            <div>✓ Sets up bidirectional sync with conflict resolution</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Supported Sources */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">Supported Data Sources</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Databases</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">PostgreSQL, MySQL, MongoDB, Redis</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">APIs</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">REST, GraphQL, SOAP, webhooks</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Files</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">CSV, Excel, JSON, XML</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">SaaS</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Salesforce, HubSpot, Stripe, Shopify</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">Intelligent Data Management</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Auto Schema Detection</div>
                            <div className="text-xs text-gray-600 font-futura">Sena analyzes your data source and automatically generates matching database schemas</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Data Transformation</div>
                            <div className="text-xs text-gray-600 font-futura">Clean, validate, and transform data as it moves between systems</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Bidirectional Sync</div>
                            <div className="text-xs text-gray-600 font-futura">Changes in either system propagate automatically with conflict resolution</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab.id === 'workflows' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-futura">Workflow Engine</h3>
                      <p className="text-base text-gray-700 leading-relaxed font-futura">
                        Automate business processes with multi-step workflows. Set triggers, define conditional logic, and chain actions across all your tools.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                        <div className="text-3xl font-bold text-violet-600 mb-1">∞</div>
                        <div className="text-xs text-gray-600 font-futura">Trigger Types</div>
                      </div>
                      <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                        <div className="text-3xl font-bold text-violet-600 mb-1">Smart</div>
                        <div className="text-xs text-gray-600 font-futura">Branching Logic</div>
                      </div>
                      <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                        <div className="text-3xl font-bold text-violet-600 mb-1">24/7</div>
                        <div className="text-xs text-gray-600 font-futura">Auto Execution</div>
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura flex items-center gap-2">
                        <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Build Complex Automations
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 border border-violet-100">
                          <div className="text-xs text-violet-600 font-semibold mb-1">You:</div>
                          <div className="text-sm text-gray-700 font-futura italic">"When a lead fills the contact form, create a deal in the CRM and notify sales on Slack"</div>
                        </div>
                        <div className="text-center text-violet-400">
                          <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-violet-100">
                          <div className="text-xs text-violet-600 font-semibold mb-1">Sena:</div>
                          <div className="text-xs text-gray-600 font-futura space-y-1">
                            <div>✓ Sets up form submission trigger</div>
                            <div>✓ Creates deal in CRM with lead data</div>
                            <div>✓ Sends formatted Slack message to #sales channel</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Workflow Capabilities */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">Workflow Building Blocks</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-violet-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-violet-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Triggers</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Events, schedules, webhooks, manual</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-violet-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-violet-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Conditions</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">If/else logic, filters, validators</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-violet-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-violet-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Actions</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Create, update, delete, notify, transform</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-violet-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-violet-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Delays</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Wait periods, scheduled execution</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">Enterprise-Grade Automation</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Error Handling & Retry</div>
                            <div className="text-xs text-gray-600 font-futura">Automatic retry with exponential backoff when actions fail</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Real-time Monitoring</div>
                            <div className="text-xs text-gray-600 font-futura">Track every workflow execution with detailed logs and performance metrics</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Version Control</div>
                            <div className="text-xs text-gray-600 font-futura">Track changes, rollback to previous versions, test before deploying</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab.id === 'agents' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-l-4 border-pink-500 pl-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-futura">Agent Builder</h3>
                      <p className="text-base text-gray-700 leading-relaxed font-futura">
                        Deploy AI agents that understand your business, make decisions, and take actions autonomously. Train them on your docs and processes.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                        <div className="text-3xl font-bold text-pink-600 mb-1">24/7</div>
                        <div className="text-xs text-gray-600 font-futura">Always Active</div>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                        <div className="text-3xl font-bold text-pink-600 mb-1">100%</div>
                        <div className="text-xs text-gray-600 font-futura">Transparent</div>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                        <div className="text-3xl font-bold text-pink-600 mb-1">Custom</div>
                        <div className="text-xs text-gray-600 font-futura">Training Data</div>
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura flex items-center gap-2">
                        <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        From Training to Deployment
                      </h4>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 border border-pink-100">
                          <div className="text-xs text-pink-600 font-semibold mb-1">You:</div>
                          <div className="text-sm text-gray-700 font-futura italic">"Create a support agent that handles product questions and creates tickets for complex issues"</div>
                        </div>
                        <div className="text-center text-pink-400">
                          <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-pink-100">
                          <div className="text-xs text-pink-600 font-semibold mb-1">Sena:</div>
                          <div className="text-xs text-gray-600 font-futura space-y-1">
                            <div>✓ Trains agent on your product docs and FAQs</div>
                            <div>✓ Gives it access to ticket creation tools</div>
                            <div>✓ Deploys with full conversation transparency</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agent Capabilities */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">What Agents Can Do</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-pink-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Conversations</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Natural language understanding and responses</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-pink-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Data Analysis</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Query databases, generate reports, spot patterns</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-pink-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Actions</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Create records, send emails, trigger workflows</div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-pink-300 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div className="text-xs font-semibold text-gray-900">Decisions</div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-futura">Route tickets, prioritize tasks, escalate issues</div>
                        </div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 font-futura">Safe & Transparent AI</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Full Reasoning Logs</div>
                            <div className="text-xs text-gray-600 font-futura">See exactly why agents made each decision with complete audit trails</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Human Oversight</div>
                            <div className="text-xs text-gray-600 font-futura">Set approval rules for sensitive actions, escalate when uncertain</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Custom Training</div>
                            <div className="text-xs text-gray-600 font-futura">Train on your documentation, policies, and historical data</div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                {activeTab.id === "ui" ? (
                  <UIBuilderDemo />
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
            {/* UI Builder Card */}
            <MobileBuilderCard
              id="mobile-builder-ui"
              title="UI Builder"
              subtitle="Build beautiful interfaces"
              description="Click, describe, or draw—we'll build it in real-time with live previews, responsive design, and beautiful animations built in."
              features={[
                "Dashboards & analytics screens",
                "Data tables & lists",
                "Forms & input screens",
                "Custom layouts & components"
              ]}
              accentColor="#3B82F6"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              }
              demoComponent={<MobileUIBuilderDemo />}
              onVisibilityChange={(isVisible) => {
                if (isVisible) {
                  setActiveBuilderTab("ui");
                  window.dispatchEvent(new CustomEvent('updateBuilderTab', { detail: { tabId: 'ui' } }));
                }
              }}
            />

            {/* Section Divider */}
            <div className="py-4 my-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="px-4 bg-waygent-cream">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-300">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="py-4 my-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="px-4 bg-waygent-cream">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-300">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="py-4 my-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="px-4 bg-waygent-cream">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-300">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
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
