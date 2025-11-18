"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import EnvironmentSelector, {
  type Environment as SelectorEnvironment,
} from "@/components/EnvironmentSelector";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { getApiUrl, API_CONFIG } from "@/lib/config";

type EnvironmentMetric = {
  id: string;
  label: string;
  value: string | number;
  icon: string;
};

type EnvironmentDeck = {
  id: string;
  label: string;
  persona: string;
  summary: string;
  bullets: string[];
  metrics?: EnvironmentMetric[];
  blueprintCounts?: Record<string, number>;
  // Direct count fields from API
  interface_count?: number;
  data_count?: number;
  workflows_count?: number;
  agents_count?: number;
};

const cardGridPositions = [
  { x: 0, y: 160 },
  { x: 306, y: 160 },
  { x: 0, y: 320 },
  { x: 306, y: 320 },
];

const cardStackPositions = [
  { x: 24, y: 0 },
  { x: 24, y: 168 },
  { x: 24, y: 336 },
  { x: 24, y: 504 },
];

type CardStartPosition = {
  x: number;
  y: number;
  width: number;
};

function useEnvironmentCardTransform(
  index: number,
  progress: MotionValue<number>,
  startPosition?: CardStartPosition,
) {
  const measured = startPosition ?? {
    x: cardGridPositions[index].x,
    y: cardGridPositions[index].y,
    width: 288,
  };
  const to = cardStackPositions[index];

  const x = useTransform(progress, [0, 0.4], [measured.x, to.x]);
  const y = useTransform(progress, [0, 0.4], [measured.y, to.y]);
  const width = useTransform(progress, [0, 0.4], [measured.width, 360]);
  const borderRadius = useTransform(progress, [0, 0.4], [28, 24]);
  const shadow = useTransform(progress, [0, 0.4], [12, 24]);
  const boxShadow = useTransform(shadow, (value) =>
    `0 ${value}px ${value * 2}px rgba(15, 23, 42, 0.18)`,
  );
  const opacity = useTransform(progress, [0, 0.12, 0.28], [0, 0, 1]);

  return { x, y, width, borderRadius, boxShadow, opacity };
}

const LandingEnvironments = forwardRef<HTMLElement>(function LandingEnvironments(props, ref) {
  const [environments, setEnvironments] = useState<EnvironmentDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 1024);
  }, []);

  // Fetch environments from API
  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GET_PUBLISHED_ENVIRONMENTS), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            limit: 10
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch environments');
        }

        const result = await response.json();

        if (result.message?.success && result.message?.data) {
          const envs = result.message.data as EnvironmentDeck[];
          setEnvironments(envs);
          // Set first environment as active
          if (envs.length > 0 && !activeId) {
            setActiveId(envs[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching environments:', error);
        // Don't show anything on error
        setEnvironments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironments();
  }, []);

  // Track scroll position to update active card
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;

    const carousel = carouselRef.current;
    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.scrollWidth / environments.length;
      const activeIndex = Math.round(scrollLeft / cardWidth);
      const newActiveId = environments[activeIndex]?.id;
      if (newActiveId && newActiveId !== activeId) {
        setActiveId(newActiveId);
      }
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [isMobile, activeId]);
  const selectorEnvironments = useMemo<SelectorEnvironment[]>(() => {
    return environments.map((environment) => {
      const active_blueprints = environment.blueprintCounts
        ? Object.entries(environment.blueprintCounts).flatMap(
            ([type, count]) => {
              const items = [];
              for (let i = 0; i < count; i += 1) {
                items.push({ type: type });
              }
              return items;
            },
          )
        : [];

      return {
        name: environment.id,
        display_name: environment.label,
        description: environment.persona,
        active_blueprints,
        // Pass through the direct count fields from API
        interface_count: environment.interface_count,
        data_count: environment.data_count,
        workflows_count: environment.workflows_count,
        agents_count: environment.agents_count,
      };
    });
  }, [environments]);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const [initialPositions, setInitialPositions] = useState<
    Record<
      string,
      {
        x: number;
        y: number;
        width: number;
      }
    >
  >({});


  const activeEnvironment = useMemo(
    () => activeId ? environments.find((env) => env.id === activeId) : null,
    [activeId, environments],
  );

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const measure = () => {
      setIsMobile(window.innerWidth < 1024);

      const host = board.querySelector<HTMLElement>(
        "[data-environment-selector-preview]",
      );
      if (!host) return;
      const cards = host.querySelectorAll<HTMLElement>(
        "[data-environment-card]",
      );
      if (!cards.length) return;
      const hostRect = host.getBoundingClientRect();
      const nextPositions: Record<string, { x: number; y: number; width: number }> = {};
      cards.forEach((card) => {
        const envId = card.getAttribute("data-environment-card");
        if (!envId) return;
        const rect = card.getBoundingClientRect();
        nextPositions[envId] = {
          x: rect.left - hostRect.left,
          y: rect.top - hostRect.top,
          width: rect.width,
        };
      });
      setInitialPositions(nextPositions);
    };

    measure();
    const resizeListener = () => measure();
    window.addEventListener("resize", resizeListener);
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <section ref={ref} id="environments" className="scroll-mt-24 pb-16" style={{ paddingTop: isMobile ? '16px' : '0' }}>
      {mounted && (
        <div
          className="relative mx-auto w-full"
          style={{
            maxWidth: isMobile ? '100%' : 'min(1280px, calc(100vw - 320px))',
            paddingLeft: isMobile ? '16px' : 'max(16px, min(32px, 2vw))',
            paddingRight: isMobile ? '16px' : 'max(16px, min(32px, 2vw))'
          }}
        >
          <div className="mt-4 mb-4 md:mb-6 text-center px-4 md:px-0">
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
                fontSize: isMobile ? '32px' : '40px',
              }}
            >
              Environments
            </h2>
            <p
              className="font-futura text-gray-700 mt-1 md:mt-2 mx-auto max-w-3xl"
              style={{
                letterSpacing: "-0.01em",
                fontSize: isMobile ? '14px' : '16px',
              }}
            >
              Click any environment to see what's included, or launch the selector to customize one for your business.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 min-h-[480px]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-waygent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-space-grotesk text-sm">Loading environments...</p>
          </div>
        </div>
      ) : environments.length === 0 ? (
        <div className="flex items-center justify-center py-12 min-h-[480px]">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <div>
              <p className="text-gray-600 font-medium text-lg">No environments available</p>
              <p className="text-gray-500 text-sm mt-1">Check back later for available environments</p>
            </div>
          </div>
        </div>
      ) : (
        <>


      <div
        className="mx-auto"
        style={{
          maxWidth: 'min(1280px, calc(100vw - 320px))',
          paddingLeft: 'max(16px, min(32px, 2vw))',
          paddingRight: 'max(16px, min(32px, 2vw))'
        }}
      >
        <div className="hidden lg:grid lg:grid-cols-2 gap-4 xl:gap-6">
          {/* Left side - EnvironmentSelector */}
          <div className="relative h-[480px] rounded-[24px] bg-white group transition-all duration-300 overflow-y-auto custom-scrollbar" style={{
            border: '2px solid #9CA3AF',
            boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)'
          }}>
            {/* Interactive indicator badge */}
            <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-600 text-[10px] font-medium rounded-md shadow-sm flex items-center justify-center gap-1 pointer-events-none opacity-70">
              <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="leading-none">Interactive</span>
            </div>

            <EnvironmentSelector
              previewMode
              readOnly
              currentEnvironment={activeId}
              initialEnvironments={selectorEnvironments}
              onEnvironmentSelect={(envName) => {
                // Toggle: if already selected, deselect it
                if (activeId === envName) {
                  setActiveId(undefined);
                } else {
                  setActiveId(envName);
                }
              }}
            />
          </div>

          {/* Right side - Content that changes on click */}
          <div className="relative h-[480px] pr-3 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEnvironment?.id || 'initial'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col h-full"
              >
              {!activeEnvironment ? (
                // Initial content - Launch-ready description
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold leading-[1.15] text-waygent-text-primary tracking-tight">
                      Launch-ready verticals built into Sena.
                    </h3>
                    <p className="text-base text-waygent-text-secondary leading-relaxed">
                      Every environment is a complete workspace—UI, workflows, data,
                      automations, and agents—trained on industry playbooks.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-waygent-blue">
                      What's included
                    </h4>
                    <div className="space-y-2 pl-3 border-l-2 border-waygent-light-blue/30">
                      <div>
                        <p className="font-medium text-sm text-waygent-text-primary">
                          Pre-built UI components
                        </p>
                        <p className="text-xs text-waygent-text-secondary mt-0.5">
                          Forms, tables, dashboards, and mobile views designed for your vertical.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-waygent-text-primary">
                          Smart automations
                        </p>
                        <p className="text-xs text-waygent-text-secondary mt-0.5">
                          Workflows that handle bookings, invoicing, reminders, and operations.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-waygent-text-primary">
                          AI agents
                        </p>
                        <p className="text-xs text-waygent-text-secondary mt-0.5">
                          Copilots trained on industry best practices to accelerate your team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Environment details (only shown on click)
                <div className="space-y-4 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.01em" }}>
                        {activeEnvironment.label}
                      </h3>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="px-2 py-1 bg-green-50 border border-green-200 rounded flex-shrink-0 flex items-center justify-center"
                      >
                        <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wide leading-none">Ready</span>
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-1">
                      {activeEnvironment.persona}
                    </p>
                  </div>

                  {/* Metrics Grid - Compact */}
                  <div className="flex-shrink-0 flex gap-3 flex-wrap">
                    {(() => {
                      // Build metrics array from API data
                      const metricsToShow = activeEnvironment.metrics || [
                        { id: 'interface', label: 'UI components', value: activeEnvironment.interface_count || 0, icon: 'interface' },
                        { id: 'workflows', label: 'Automations', value: activeEnvironment.workflows_count || 0, icon: 'workflows' },
                        { id: 'agents', label: 'Agents', value: activeEnvironment.agents_count || 0, icon: 'agents' },
                        { id: 'data', label: 'Data models', value: activeEnvironment.data_count || 0, icon: 'data' },
                      ];
                      return metricsToShow.map((metric, idx) => {
                      const getIcon = (iconName: string) => {
                        const lowerIcon = iconName.toLowerCase();
                        // Interface (UI)
                        if (lowerIcon.includes('interface') || lowerIcon.includes('ui') || lowerIcon.includes('layout')) {
                          return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;
                        }
                        // Data (Database)
                        if (lowerIcon.includes('data') || lowerIcon.includes('database')) {
                          return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
                        }
                        // Workflows (Logic)
                        if (lowerIcon.includes('workflow') || lowerIcon.includes('logic') || lowerIcon.includes('automation') || lowerIcon.includes('zap') || lowerIcon.includes('flow')) {
                          return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
                        }
                        // Agents
                        if (lowerIcon.includes('agent') || lowerIcon.includes('cpu')) {
                          return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"></path></svg>;
                        }
                        return null;
                      };

                      return (
                        <motion.div
                          key={metric.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + idx * 0.03 }}
                          className="flex items-center gap-1.5 bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 rounded-md px-2 py-1 hover:bg-white/80 hover:border-gray-300 transition-all"
                        >
                          <div className="text-waygent-blue flex-shrink-0">
                            {getIcon(metric.icon)}
                          </div>
                          <div className="text-base font-bold text-gray-900">{metric.value}</div>
                          <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{metric.label}</div>
                        </motion.div>
                      );
                    });})()}
                  </div>

                  {/* Summary - scrollable */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar" style={{ minHeight: 0 }}>
                    <div
                      className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: activeEnvironment.summary }}
                    />

                    {/* Feature Bullets - Minimalist */}
                    <ul className="space-y-1.5 pb-2">
                      {activeEnvironment.bullets.map((bullet, idx) => (
                        <motion.li
                          key={bullet}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.05 }}
                          className="flex items-start gap-2 text-xs text-gray-600"
                        >
                          <span className="mt-0.5 w-1 h-1 rounded-full bg-waygent-blue flex-shrink-0" />
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA - Sticky at bottom, always visible */}
                  <div className="flex-shrink-0 pt-3 border-t border-gray-200">
                    <Link
                      href="/environment-selector"
                      className="group relative overflow-hidden rounded-lg bg-waygent-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Launch {activeEnvironment.label}
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile: Horizontal scrolling carousel */}
      <div className="lg:hidden mt-12">
        <div ref={carouselRef} className="overflow-x-auto hide-scrollbar px-4 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {environments.map((environment, index) => {
              const isActive = environment.id === activeId;
              return (
                <motion.div
                  key={environment.id}
                  className="rounded-3xl border border-waygent-blue bg-white shadow-xl flex-shrink-0"
                  style={{
                    width: 'calc(100vw - 64px)',
                    maxWidth: '400px',
                    scrollSnapAlign: 'center',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex w-full flex-col p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs uppercase tracking-[0.35em] text-waygent-blue font-semibold">
                        {environment.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-semibold text-waygent-text-primary mb-3 leading-tight">
                      {environment.persona}
                    </h3>

                    {/* Metrics row */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {(environment.metrics || [
                        { id: 'interface', label: 'UI components', value: environment.interface_count || 0, icon: 'layout' },
                        { id: 'workflows', label: 'Automations', value: environment.workflows_count || 0, icon: 'zap' },
                        { id: 'agents', label: 'Agents', value: environment.agents_count || 0, icon: 'cpu' },
                        { id: 'data', label: 'Data models', value: environment.data_count || 0, icon: 'database' },
                      ]).map((metric) => {
                        const getIcon = (iconName: string) => {
                          switch(iconName) {
                            case 'layout':
                              return <svg className="w-4 h-4 text-waygent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" /></svg>;
                            case 'zap':
                              return <svg className="w-4 h-4 text-waygent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
                            case 'cpu':
                              return <svg className="w-4 h-4 text-waygent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
                            case 'database':
                              return <svg className="w-4 h-4 text-waygent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
                            default:
                              return null;
                          }
                        };
                        return (
                          <div key={metric.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            {getIcon(metric.icon)}
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-gray-900">{metric.value}</span>
                              <span className="text-[10px] text-gray-600">{metric.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary - always visible */}
                    <p className="text-sm text-waygent-text-secondary leading-relaxed mb-4">
                      {environment.summary}
                    </p>

                    {/* Expanded content - Always visible */}
                    <div className="pt-4 border-t border-gray-200 space-y-3 text-sm text-waygent-text-secondary">
                      {environment.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-3">
                          <span className="mt-1.5 inline-flex h-2 w-2 flex-none rounded-full bg-waygent-blue" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                      <Link
                        href="/environment-selector"
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-waygent-blue text-white text-sm font-semibold rounded-full shadow-lg shadow-waygent-blue/25 transition hover:bg-waygent-blue-hover"
                      >
                        Launch this environment
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {environments.map((env, index) => (
            <button
              key={env.id}
              onClick={() => {
                setActiveId(env.id);
                // Scroll to the card
                if (carouselRef.current) {
                  const cardWidth = carouselRef.current.scrollWidth / environments.length;
                  carouselRef.current.scrollTo({
                    left: cardWidth * index,
                    behavior: 'smooth'
                  });
                }
              }}
              className={clsx(
                "h-2 rounded-full transition-all duration-300",
                env.id === activeId ? "bg-waygent-blue w-8" : "bg-gray-300 w-2"
              )}
              aria-label={`View ${env.label}`}
            />
          ))}
        </div>
      </div>

      </>
      )}

      {/* Add CSS for scrollbars and HTML content */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.2s;
        }
        .custom-scrollbar:hover {
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 2px;
          transition: background 0.2s;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.5);
        }

        /* Summary HTML content styling */
        .prose h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .prose h3:first-child {
          margin-top: 0;
        }
        .prose h4 {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
          margin-top: 0.875rem;
          margin-bottom: 0.375rem;
          line-height: 1.3;
        }
        .prose p {
          font-size: 0.75rem;
          line-height: 1.5;
          color: #6b7280;
          margin-top: 0;
          margin-bottom: 0.75rem;
        }
        .prose p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </section>
  );
});

export default LandingEnvironments;
