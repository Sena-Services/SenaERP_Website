"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getResponsiveValue } from "@/lib/responsive";
import ModelConfigDemo from "./ModelConfigDemo";
import { ToolsConfigPreview, SkillsConfigPreview, TriggersConfigPreview, UIConfigPreview, LogicConfigPreview } from "./TabConfigPreviews";
import MobileAgentBlocks from "@/components/sections/MobileAgentBlocks";
import { tabs } from "./builderTabsData";

// Module-level lookup map — stable, not a React dep
const sectionToTab = Object.fromEntries(tabs.map(t => [t.id, t]));

// Animation variants removed — were dead code (defined but never used in JSX)

export default function BuilderTabbed() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(900);
  // showDetails state removed - split layout shows both simultaneously

  const getResponsiveVal = (baseValue: number) =>
    getResponsiveValue(viewportHeight, baseValue);

  // Detect mobile and sync with navbar tab selection
  useEffect(() => {
    let rafId: number;
    const checkMobile = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
        setViewportHeight(window.innerHeight);
      });
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(rafId);
    };
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

    window.addEventListener('builderTabChange', handleNavbarTabChange as EventListener);
    return () => window.removeEventListener('builderTabChange', handleNavbarTabChange as EventListener);
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
            const tab = sectionToTab[sections[i]];
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

    // Run immediately and on scroll (rAF-throttled)
    let rafId: number | null = null;
    const throttledScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    handleScroll();
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile, activeTab]);

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
            marginBottom: isMobile ? '4px' : `${getResponsiveVal(16)}px`,
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
          <p className="text-gray-700 mx-auto max-w-3xl leading-relaxed text-base font-futura">
            What is an agent, anyway?
          </p>
          <p className="text-gray-500 mx-auto max-w-2xl leading-relaxed font-futura mt-2" style={{ fontSize: '15px' }}>
            An agent is a composition of six building blocks: the model it thinks with, the tools it acts through, the skills it knows, the triggers that wake it, the UI it presents, and the logic that governs it all.
          </p>
        </div>

        {/* Desktop White Container with Tabs and Content */}
        <div className="hidden md:flex md:flex-col bg-white rounded-[2rem] overflow-hidden relative" style={{
          border: '2px solid #9CA3AF',
          boxShadow: '0 12px 40px -8px rgba(139, 119, 89, 0.12), 0 4px 16px -4px rgba(139, 119, 89, 0.08)',
          zIndex: 10,
          minHeight: 'clamp(520px, 65vh, 780px)',
        }}>
          {/* Tabs at Top with Description - All in same container */}
          <div className="bg-sena-cream/50 px-3 pt-3 pb-3 border-b border-gray-200">
            {/* Tabs Grid - Centered with 6 tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-2 max-w-5xl mx-auto">
              {tabs.map((tab) => (
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
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div
                      className={`font-futura font-bold text-sm ${
                        activeTab.id === tab.id ? "text-white" : "text-[#6B7280]"
                      }`}
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {tab.label}
                    </div>
                    <div
                      className={`text-xs font-futura mt-auto ${
                        activeTab.id === tab.id ? "text-white/80" : "text-[#9CA3AF]"
                      }`}
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {tab.subtitle}
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
            className="flex-1 overflow-hidden relative"
            style={{
              backgroundColor: '#FAFAF8'
            }}
          >
              <div className="px-6 py-3 h-full overflow-hidden">
                {activeTab.id === 'models' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    {/* Left: Compact info */}
                    <div className="flex flex-col justify-between h-full">
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

                    {/* Right: Model Config Preview */}
                    <div className="rounded-xl overflow-hidden h-full p-2" style={{ background: '#F8F9FB' }}>
                      <ModelConfigDemo />
                    </div>
                  </div>
                )}

                {activeTab.id === 'tools' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="flex flex-col justify-between h-full">
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
                    <div className="rounded-xl overflow-hidden h-full p-2" style={{ background: '#F8F9FB' }}>
                      <ToolsConfigPreview />
                    </div>
                  </div>
                )}

                {activeTab.id === 'skills' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 font-futura">Skills</h3>
                        <p className="text-sm text-gray-600 leading-snug font-futura">
                          Knowledge and instructions injected into your agent&apos;s context at runtime.
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
                    <div className="rounded-xl overflow-hidden h-full p-2" style={{ background: '#F8F9FB' }}>
                      <SkillsConfigPreview />
                    </div>
                  </div>
                )}

                {activeTab.id === 'triggers' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="flex flex-col justify-between h-full">
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
                    <div className="rounded-xl overflow-hidden h-full p-2" style={{ background: '#F8F9FB' }}>
                      <TriggersConfigPreview />
                    </div>
                  </div>
                )}

                {activeTab.id === 'ui' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="flex flex-col justify-between h-full">
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
                    <div className="rounded-xl overflow-hidden h-full p-2" style={{ background: '#F8F9FB' }}>
                      <UIConfigPreview />
                    </div>
                  </div>
                )}

                {activeTab.id === 'logic' && (
                  <div className="grid grid-cols-[1fr_1.2fr] gap-4 h-full">
                    <div className="flex flex-col justify-between h-full">
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
                    <div className="rounded-xl overflow-hidden h-full p-2" style={{ background: '#F8F9FB' }}>
                      <LogicConfigPreview />
                    </div>
                  </div>
                )}

              </div>
          </div>
        </div>


        {/* Mobile Builder - Swipeable carousel of 6 building blocks */}
        {isMobile && <MobileAgentBlocks />}

      </div>
    </div>
  );
}
