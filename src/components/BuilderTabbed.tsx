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

const tabs: Tab[] = [
  {
    id: "ui",
    label: "UI",
    subtitle: "Build beautiful interfaces.",
    agentTitle: "UI Builder",
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
      type: "spring",
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
      type: "spring",
      stiffness: 120,
      damping: 20,
    }
  }),
};

export default function BuilderTabbed() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeBuilderTab, setActiveBuilderTab] = useState("ui");

  // Detect mobile and sync with navbar tab selection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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
    <div className="w-full bg-white scroll-mt-24 pb-16">
      {/* Visual Divider - Mobile only */}
      {isMobile && (
        <div className="w-full">
          {/* Top gradient transition from How It Works */}
          <div className="h-16 bg-gradient-to-b from-gray-50 to-white"></div>
          {/* Thin accent line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      )}

      <div
        className="mx-auto"
        style={{
          maxWidth: isMobile ? '100%' : 'min(1280px, calc(100vw - 320px))',
          paddingLeft: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '0' : 'max(16px, min(32px, 2vw))'
        }}
      >
        {/* Section Title - Visible on all devices */}
        <div className={`mb-8 md:mb-12 text-center px-4 ${isMobile ? 'mt-12' : 'mt-32 sm:mt-48'}`}>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: isMobile ? '32px' : '60px',
            }}
          >
            Builder
          </h2>
          <p
            className="text-sm md:text-xl md:text-2xl text-gray-700 mt-2 md:mt-4 mx-auto max-w-3xl font-futura"
            style={{
              letterSpacing: "-0.01em",
            }}
          >
            Build, scale, and manage your entire AI workforce with one platform.
          </p>
        </div>

        {/* Desktop White Container with Tabs and Content */}
        <div className="hidden md:block bg-white rounded-[2rem] overflow-hidden" style={{
          border: '2px solid #9CA3AF',
          boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Tabs at Top with Description - All in same container */}
          <div className="bg-waygent-cream/50 px-4 pt-4 pb-6 border-b border-gray-200">
            {/* Tabs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-3 text-left rounded-xl cursor-pointer overflow-hidden ${
                    activeTab.id === tab.id
                      ? ""
                      : "bg-white hover:bg-waygent-cream border border-gray-200/50"
                  }`}
                  style={activeTab.id === tab.id ? {
                    boxShadow: '0 6px 15px -3px rgba(59, 130, 246, 0.25), 0 3px 8px -2px rgba(59, 130, 246, 0.12)'
                  } : {
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)'
                  }}
                  whileHover={{ scale: activeTab.id === tab.id ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {activeTab.id === tab.id && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-waygent-blue"
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
                        className={`font-futura font-bold text-xl mb-2 ${
                          activeTab.id === tab.id ? "text-white" : "text-waygent-text-primary"
                        }`}
                        style={{ letterSpacing: "-0.02em" }}
                      >
                        {tab.label}
                      </div>
                      <div
                        className={`text-base font-futura ${
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

            {/* Tab Description - Within same cream container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="px-4"
              >
                <p className="text-base text-gray-700 font-futura leading-relaxed max-w-4xl">
                  {activeTab.agentDescription}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content Area */}
          <div className="h-[560px] xl:h-[580px] 2xl:h-[600px] overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {/* Special layouts for different tabs */}
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
                  )}
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
            <div className="py-8 my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="px-4 bg-white">
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
            <div className="py-8 my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="px-4 bg-white">
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
            <div className="py-8 my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="px-4 bg-white">
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
