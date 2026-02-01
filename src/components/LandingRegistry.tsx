"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import EnvironmentSelector, {
  type Environment as SelectorEnvironment,
  type RegistryItem,
} from "@/components/EnvironmentSelector";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { getApiUrl, API_CONFIG, frappeAPI } from "@/lib/config";

// Mobile Registry Data - mirroring EnvironmentSelector
const mobileHorizontalModules = [
  { name: "accounts", display_name: "Accounts", description: "Financial management - ledgers, invoicing, payments", icon: "accounts", summary: "Complete financial management with double-entry accounting and multi-currency support.", bullets: ["Chart of accounts", "Journal entries", "Bank reconciliation", "Tax templates"], docTypes: ["Account", "Journal Entry", "Payment Entry", "Invoice"] },
  { name: "sales", display_name: "Sales", description: "Revenue operations - quotations, orders, pricing", icon: "sales", summary: "End-to-end sales pipeline from lead to cash.", bullets: ["Quotation builder", "Sales order workflow", "Dynamic pricing", "Commission tracking"], docTypes: ["Quotation", "Sales Order", "Sales Invoice"] },
  { name: "purchasing", display_name: "Purchasing", description: "Procurement - purchase orders, suppliers", icon: "purchasing", summary: "Streamlined procurement from requisition to payment.", bullets: ["Purchase requisition", "RFQ comparison", "Goods receipt", "Three-way matching"], docTypes: ["Purchase Order", "Purchase Invoice", "Supplier"] },
  { name: "contacts", display_name: "Contacts", description: "People & organizations - customers, leads", icon: "contacts", summary: "Unified contact management for all relationships.", bullets: ["Customer profiles", "Lead scoring", "Communication history", "Custom tags"], docTypes: ["Customer", "Supplier", "Lead", "Contact"] },
  { name: "inventory", display_name: "Inventory", description: "Stock management - items, warehouses", icon: "inventory", summary: "Real-time inventory tracking across warehouses.", bullets: ["Multi-warehouse", "Batch tracking", "Stock valuation", "Reorder alerts"], docTypes: ["Item", "Stock Entry", "Warehouse"] },
  { name: "hr", display_name: "HR", description: "People management - employees, payroll", icon: "hr", summary: "Human resource management from hire to retire.", bullets: ["Employee profiles", "Attendance tracking", "Leave management", "Payroll"], docTypes: ["Employee", "Attendance", "Payroll Entry"] },
];

const mobileIndustryModules = [
  { name: "travel", display_name: "Travel", description: "Travel agencies, tour operators", icon: "travel", summary: "Complete travel business solution for agencies and DMCs.", bullets: ["Trip management", "Booking system", "Itinerary builder", "Voucher generation"], docTypes: ["Trip", "Booking", "Itinerary"], includes: ["accounts", "sales", "contacts"] },
  { name: "manufacturing", display_name: "Manufacturing", description: "Factories, job shops - production", icon: "manufacturing", summary: "Production management for discrete and process manufacturing.", bullets: ["BOM management", "Work orders", "Quality inspection", "Subcontracting"], docTypes: ["BOM", "Work Order", "Quality Inspection"], includes: ["inventory", "purchasing"] },
];

const mobileAgentConfigs = [
  { name: "llm_models", display_name: "LLM Models", description: "Claude, GPT-4, Gemini", icon: "llm", summary: "Pre-configured language models for agent intelligence.", bullets: ["Claude 3.5 Sonnet", "GPT-4o multimodal", "Gemini 1.5 long context"], providers: ["Anthropic", "OpenAI", "Google"] },
  { name: "core_tools", display_name: "Core Tools", description: "CRUD, queries, email, files", icon: "core_tools", summary: "Fundamental tools every agent needs.", bullets: ["Database operations", "File handling", "Email sending", "PDF generation"], tools: ["doctype_crud", "email_sender", "file_manager"] },
  { name: "research_tools", display_name: "Research", description: "Web search, document reader, OCR", icon: "research", summary: "Information gathering and analysis tools.", bullets: ["Web search", "Document parsing", "Image analysis", "OCR extraction"], tools: ["web_search", "document_reader", "ocr_reader"] },
  { name: "communication", display_name: "Communication", description: "Email, SMS, WhatsApp, push", icon: "communication", summary: "Multi-channel communication tools.", bullets: ["Email via SMTP", "SMS providers", "WhatsApp Business", "Push notifications"], tools: ["email_sender", "sms_sender", "whatsapp_sender"] },
];

// Icons for mobile registry
const getMobileIcon = (iconName: string) => {
  const icons: Record<string, JSX.Element> = {
    accounts: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    sales: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    purchasing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    contacts: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    inventory: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    hr: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    travel: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    manufacturing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    llm: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    core_tools: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    research: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    communication: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  };
  return icons[iconName] || <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
};

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
  status?: string;
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

// Default registry item to show on load
const defaultRegistryItem: RegistryItem = {
  name: "accounts",
  display_name: "Accounts",
  description: "Financial management - ledgers, invoicing, payments, reconciliation",
  icon: "accounts",
  summary: "Complete financial management system with double-entry accounting, multi-currency support, and automated reconciliation. Handles everything from daily transactions to year-end closing.",
  bullets: ["Chart of accounts with unlimited hierarchy", "Journal entries with auto-reversal", "Bank reconciliation with smart matching", "GST/VAT compliant tax templates", "Multi-currency with real-time rates", "Aging reports and cash flow forecasting"],
  docTypes: ["Account", "Journal Entry", "Payment Entry", "Invoice", "Bank Account", "Bank Transaction", "Tax Template"]
};

const LandingRegistry = forwardRef<HTMLElement>(function LandingRegistry(props, ref) {
  const [environments, setEnvironments] = useState<EnvironmentDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [selectedRegistryItem, setSelectedRegistryItem] = useState<RegistryItem | null>(defaultRegistryItem);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Mobile registry state
  const [mobileActiveCategory, setMobileActiveCategory] = useState<'horizontal' | 'industry' | 'agents'>('horizontal');
  const [mobileSelectedItem, setMobileSelectedItem] = useState<string | null>(null);

  // Get mobile items based on category
  const getMobileItems = () => {
    switch (mobileActiveCategory) {
      case 'horizontal': return mobileHorizontalModules;
      case 'industry': return mobileIndustryModules;
      case 'agents': return mobileAgentConfigs;
      default: return mobileHorizontalModules;
    }
  };

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 900);
  }, []);

  // Fetch environments from API
  useEffect(() => {
    const fetchEnvironments = async () => {
      try {
        const response = await frappeAPI.call(getApiUrl(API_CONFIG.ENDPOINTS.GET_PUBLISHED_ENVIRONMENTS), {
          method: 'POST',
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
          // Don't auto-select environment - registry item is selected by default
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
      setIsMobile(window.innerWidth < 900);

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
    <section ref={ref} id="registry" className="scroll-mt-24 pb-16" style={{ paddingTop: isMobile ? '16px' : '0' }}>
      {mounted && (
        <div
          className="relative mx-auto w-full"
          style={{
            maxWidth: isMobile ? '100%' : 'min(1280px, calc(100vw - 320px))',
            paddingLeft: isMobile ? '16px' : 'max(16px, min(32px, 2vw))',
            paddingRight: isMobile ? '16px' : 'max(16px, min(32px, 2vw))',
            zIndex: 10,
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
              Registry
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
        <div className="hidden [@media(min-width:900px)]:grid [@media(min-width:900px)]:grid-cols-2 gap-4 xl:gap-6" style={{ position: 'relative', zIndex: 10 }}>
          {/* Left side - EnvironmentSelector */}
          <div className="relative h-[480px] rounded-[24px] bg-white group transition-all duration-300 overflow-y-auto custom-scrollbar" style={{
            border: '2px solid #9CA3AF',
            boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)',
            zIndex: 10,
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
              selectedRegistryItem={selectedRegistryItem?.name}
              onEnvironmentSelect={(envName) => {
                // Toggle: if already selected, deselect it
                if (activeId === envName) {
                  setActiveId(undefined);
                } else {
                  setActiveId(envName);
                }
                // Clear registry selection when environment is selected
                setSelectedRegistryItem(null);
              }}
              onRegistryItemSelect={(item) => {
                setSelectedRegistryItem(item);
                // Clear environment selection when registry item is selected
                setActiveId(undefined);
              }}
            />
          </div>

          {/* Right side - Content that changes on click */}
          <div className="relative h-[480px] pr-3 flex flex-col bg-[#EDE7DC]" style={{ zIndex: 10 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRegistryItem?.name || activeEnvironment?.id || 'initial'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col h-full"
              >
              {selectedRegistryItem ? (
                // Registry item details - Clean & Classy
                <div className="h-full flex flex-col pl-2">
                  {/* Header */}
                  <div className="flex-shrink-0 mb-5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-waygent-blue">
                      {selectedRegistryItem.docTypes ? 'Horizontal Module' : selectedRegistryItem.tools ? 'Agent Tools' : selectedRegistryItem.providers ? 'AI Provider' : 'Configuration'}
                    </span>
                    <h3 className="text-3xl font-normal text-gray-900 mt-1" style={{ fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.02em" }}>
                      {selectedRegistryItem.display_name}
                    </h3>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2" style={{ minHeight: 0 }}>
                    {/* Summary */}
                    <p className="text-[15px] text-gray-600 leading-[1.7] mb-6">
                      {selectedRegistryItem.summary}
                    </p>

                    {/* DocTypes/Tools inline */}
                    <div className="mb-6">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                        {selectedRegistryItem.docTypes ? 'Included DocTypes' : selectedRegistryItem.tools ? 'Available Tools' : selectedRegistryItem.providers ? 'Supported Providers' : 'Components'}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-2">
                        {(selectedRegistryItem.docTypes || selectedRegistryItem.tools || selectedRegistryItem.widgets || selectedRegistryItem.providers)?.map((tag, idx) => (
                          <span key={tag} className="text-[13px] text-gray-700">
                            {tag}{idx < ((selectedRegistryItem.docTypes || selectedRegistryItem.tools || selectedRegistryItem.widgets || selectedRegistryItem.providers)?.length || 0) - 1 && <span className="text-gray-300 ml-3">/</span>}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-12 h-px bg-gray-300 mb-6" />

                    {/* Features as simple list */}
                    <div className="mb-6">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Capabilities</p>
                      <div className="space-y-2.5">
                        {selectedRegistryItem.bullets.map((bullet, idx) => (
                          <div key={bullet} className="flex items-baseline gap-3">
                            <span className="text-waygent-blue text-sm font-medium" style={{ fontFamily: "Georgia, serif" }}>{String(idx + 1).padStart(2, '0')}</span>
                            <span className="text-[13px] text-gray-700 leading-relaxed">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Includes for industry modules */}
                    {selectedRegistryItem.includes && (
                      <div className="mb-6">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Extends</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegistryItem.includes.map((mod) => (
                            <span key={mod} className="text-[13px] text-gray-700 capitalize px-2.5 py-1 bg-gray-100 rounded">
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex-shrink-0 pt-4 mt-auto border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {(selectedRegistryItem.docTypes || selectedRegistryItem.tools || selectedRegistryItem.widgets || selectedRegistryItem.providers)?.length || 0} components
                      </span>
                      <span className="text-[11px] font-medium text-waygent-blue tracking-wide">Production Ready</span>
                    </div>
                  </div>
                </div>
              ) : !activeEnvironment ? (
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
                        className={`px-2 py-1 rounded flex-shrink-0 flex items-center justify-center ${
                          activeEnvironment.status === 'In Development'
                            ? 'bg-amber-50 border border-amber-200'
                            : 'bg-green-50 border border-green-200'
                        }`}
                      >
                        <span className={`text-[10px] font-semibold uppercase tracking-wide leading-none ${
                          activeEnvironment.status === 'In Development'
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`}>
                          {activeEnvironment.status || 'Ready'}
                        </span>
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
                    {activeEnvironment.status === 'In Development' ? (
                      <div className="group relative overflow-hidden rounded-lg bg-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-500 shadow-md flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Launch {activeEnvironment.label}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile: Redesigned Registry Experience */}
      <div className="[@media(min-width:900px)]:hidden" style={{ position: 'relative', zIndex: 10 }}>
        {/* Tab Selector */}
        <div className="px-4 mb-4">
          <div className="inline-flex p-1 bg-white rounded-full border border-gray-200 shadow-sm w-full">
            {[
              { id: 'horizontal' as const, label: 'Horizontal' },
              { id: 'industry' as const, label: 'Industry' },
              { id: 'agents' as const, label: 'Agents' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMobileActiveCategory(tab.id);
                  setMobileSelectedItem(null);
                }}
                className={`flex-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  mobileActiveCategory === tab.id
                    ? 'bg-waygent-blue text-white shadow-sm'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module List - Single Column for better expansion */}
        <div className="px-4 space-y-3">
          {getMobileItems().map((item, index) => {
            const isSelected = mobileSelectedItem === item.name;
            const tags = (item as any).docTypes || (item as any).tools || (item as any).providers || [];

            return (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, layout: { duration: 0.2 } }}
                className={`rounded-2xl bg-white overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? 'border-2 border-waygent-blue shadow-lg'
                    : 'border border-gray-200 shadow-sm'
                }`}
                onClick={() => setMobileSelectedItem(isSelected ? null : item.name)}
              >
                {/* Card Header - Always visible */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-waygent-blue text-white' : 'bg-gray-100 text-waygent-blue'
                    }`}>
                      {getMobileIcon(item.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-gray-900">
                          {item.display_name}
                        </h4>
                        <motion.div
                          animate={{ rotate: isSelected ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Tags - Show all, wrap naturally */}
                  {!isSelected && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pl-[52px]">
                      {tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                        {/* Summary */}
                        <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-4">
                          {item.summary}
                        </p>

                        {/* All Tags */}
                        <div className="mb-4">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            {(item as any).docTypes ? 'DocTypes' : (item as any).tools ? 'Tools' : 'Providers'}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 text-xs font-medium bg-waygent-blue/10 text-waygent-blue rounded-lg"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Features</p>
                          <ul className="space-y-2">
                            {item.bullets.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-waygent-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Includes section for industry modules */}
                        {(item as any).includes && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Includes Modules</p>
                            <div className="flex flex-wrap gap-2">
                              {(item as any).includes.map((mod: string) => (
                                <span key={mod} className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-lg capitalize border border-green-200">
                                  {mod}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
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
          scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.6);
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

export default LandingRegistry;
