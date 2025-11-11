"use client";

import { useLayoutEffect, useMemo, useRef, useState, forwardRef } from "react";
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

type EnvironmentMetric = {
  id: string;
  label: string;
  value: string;
  icon: string;
};

type BlueprintType = "UI" | "Logic" | "Database" | "Integration" | "Agents";

type EnvironmentDeck = {
  id: string;
  label: string;
  persona: string;
  summary: string;
  bullets: string[];
  metrics: EnvironmentMetric[];
  blueprintCounts: Record<BlueprintType, number>;
};

const environments: EnvironmentDeck[] = [
  {
    id: "travel-agency",
    label: "Travel Agencies",
    persona: "Quote, book, and reconcile with AI copilots alongside your agents.",
    summary:
      "Automate multi-city itineraries, supplier confirmations, and post-trip invoicing from one workspace. Sena keeps every traveler file, booking, and commission in sync automatically.",
    bullets: [
      "Draft proposals in minutes from chat input or voice notes.",
      "Sync airline, hotel, and activity suppliers with live pricing and availability.",
      "Generate traveler docs, reminders, and reconciled ledgers without manual effort.",
    ],
    metrics: [
      { id: "ui", label: "UI components", value: "18", icon: "🧩" },
      { id: "flows", label: "Automations", value: "24", icon: "⚡" },
      { id: "agents", label: "Agents", value: "6", icon: "🤖" },
      { id: "data", label: "Data models", value: "12", icon: "📊" },
    ],
    blueprintCounts: { UI: 18, Logic: 24, Database: 12, Integration: 10, Agents: 6 },
  },
  {
    id: "dmc",
    label: "DMC & Tour Operators",
    persona:
      "Design complex itineraries and supplier logistics at production scale.",
    summary:
      "Bundle experiences, transport, and guides in a single command center. Sena orchestrates contracts, staffing, and margin tracking so every departure runs smoothly.",
    bullets: [
      "Centralize supplier SLAs, rate cards, and blackout dates.",
      "Assign on-ground staff and track execution with mobile updates.",
      "Monitor margins, payments, and pax manifests in real time.",
    ],
    metrics: [
      { id: "ui", label: "UI components", value: "26", icon: "🧩" },
      { id: "flows", label: "Automations", value: "32", icon: "⚡" },
      { id: "agents", label: "Agents", value: "9", icon: "🤖" },
      { id: "data", label: "Data models", value: "18", icon: "📊" },
    ],
    blueprintCounts: { UI: 26, Logic: 32, Database: 18, Integration: 14, Agents: 9 },
  },
  {
    id: "hotels",
    label: "Hotels (PMS)",
    persona:
      "Run front desk, housekeeping, and revenue ops without switching tabs.",
    summary:
      "Sena stitches reservations, housekeeping, maintenance, and revenue management into one PMS that reacts instantly to guest behavior.",
    bullets: [
      "Sync OTAs, direct bookings, and corporate accounts automatically.",
      "Orchestrate housekeeping and maintenance with AI-prioritized tasks.",
      "Adjust rates, packages, and upsell campaigns based on live occupancy.",
    ],
    metrics: [
      { id: "ui", label: "UI components", value: "20", icon: "🧩" },
      { id: "flows", label: "Automations", value: "28", icon: "⚡" },
      { id: "agents", label: "Agents", value: "8", icon: "🤖" },
      { id: "data", label: "Data models", value: "14", icon: "📊" },
    ],
    blueprintCounts: { UI: 20, Logic: 28, Database: 14, Integration: 12, Agents: 8 },
  },
  {
    id: "restaurants",
    label: "Restaurants (RMS)",
    persona:
      "Keep kitchens, dining rooms, and delivery channels running in sync.",
    summary:
      "From menu changes to vendor restocking and table turns, Sena keeps every shift organized while guests receive proactive updates.",
    bullets: [
      "Coordinate reservations, waitlists, and delivery slots automatically.",
      "Push menu updates across POS, kiosks, and marketplaces in seconds.",
      "Forecast demand and automate purchase orders with supplier confirmations.",
    ],
    metrics: [
      { id: "ui", label: "UI components", value: "16", icon: "🧩" },
      { id: "flows", label: "Automations", value: "21", icon: "⚡" },
      { id: "agents", label: "Agents", value: "5", icon: "🤖" },
      { id: "data", label: "Data models", value: "11", icon: "📊" },
    ],
    blueprintCounts: { UI: 16, Logic: 21, Database: 11, Integration: 9, Agents: 5 },
  },
];

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
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectorEnvironments = useMemo<SelectorEnvironment[]>(() => {
    return environments.map((environment) => {
      const active_blueprints =
        Object.entries(environment.blueprintCounts).flatMap(
          ([type, count]) => {
            const items = [];
            for (let i = 0; i < count; i += 1) {
              items.push({ type: type as BlueprintType });
            }
            return items;
          },
        );

      return {
        name: environment.id,
        display_name: environment.label,
        description: environment.persona,
        active_blueprints,
      };
    });
  }, []);

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
    [activeId],
  );

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const measure = () => {
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
    <section ref={ref} id="environments" className="scroll-mt-24 mt-32 sm:mt-48 pb-16">
      <div
        className="relative mx-auto w-full"
        style={{
          maxWidth: 'min(1600px, calc(100vw - 200px))',
          paddingLeft: 'max(16px, min(32px, 2vw))',
          paddingRight: 'max(16px, min(32px, 2vw))'
        }}
      >
        <div className="mb-12 text-center">
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: '60px',
            }}
          >
            Environments
          </h2>
          <p
            className="text-xl md:text-2xl text-gray-700 mt-4 mx-auto max-w-3xl font-futura"
            style={{
              letterSpacing: "-0.01em",
            }}
          >
            Click any environment to see what's included, or launch the selector to customize one for your business.
          </p>
        </div>
      </div>

      <div
        className="mx-auto"
        style={{
          maxWidth: 'min(1600px, calc(100vw - 200px))',
          paddingLeft: 'max(16px, min(32px, 2vw))',
          paddingRight: 'max(16px, min(32px, 2vw))'
        }}
      >
        <div className="hidden lg:grid lg:grid-cols-[minmax(600px,800px)_minmax(400px,1fr)] gap-8 xl:gap-12">
          {/* Left side - EnvironmentSelector */}
          <div className="relative h-[640px] rounded-[36px] bg-white group transition-all duration-300" style={{
            overflow: 'clip',
            border: '2px solid #9CA3AF',
            boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)',
            minWidth: '600px'
          }}>
            {/* Interactive indicator badge */}
            <div className="absolute top-6 right-6 z-10 px-4 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-full shadow-lg flex items-center justify-center gap-2 pointer-events-none">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
              <span className="leading-none">Click to explore</span>
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
          <div className="relative pt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEnvironment?.id || 'initial'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col space-y-6"
              >
              {!activeEnvironment ? (
                // Initial content - Launch-ready description
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-5xl font-bold leading-[1.15] text-waygent-text-primary tracking-tight">
                      Launch-ready verticals built into Sena.
                    </h3>
                    <p className="text-xl text-waygent-text-secondary leading-relaxed">
                      Every environment is a complete workspace—UI, workflows, data,
                      automations, and agents—trained on industry playbooks.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-waygent-blue">
                      What's included
                    </h4>
                    <div className="space-y-3 pl-4 border-l-2 border-waygent-light-blue/30">
                      <div>
                        <p className="font-medium text-waygent-text-primary">
                          Pre-built UI components
                        </p>
                        <p className="text-sm text-waygent-text-secondary mt-0.5">
                          Forms, tables, dashboards, and mobile views designed for your vertical.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-waygent-text-primary">
                          Smart automations
                        </p>
                        <p className="text-sm text-waygent-text-secondary mt-0.5">
                          Workflows that handle bookings, invoicing, reminders, and operations.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-waygent-text-primary">
                          AI agents
                        </p>
                        <p className="text-sm text-waygent-text-secondary mt-0.5">
                          Copilots trained on industry best practices to accelerate your team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Environment details (only shown on click)
                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs uppercase tracking-[0.35em] text-waygent-blue font-semibold">
                      {activeEnvironment.label}
                    </span>
                    <h3 className="text-3xl font-semibold text-waygent-text-primary leading-tight">
                      Built for {activeEnvironment.label.toLowerCase()}.
                    </h3>
                    <p className="text-lg text-waygent-text-secondary leading-relaxed">
                      {activeEnvironment.summary}
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm text-waygent-text-secondary">
                    {activeEnvironment.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-1.5 inline-flex h-2 w-2 flex-none rounded-full bg-waygent-blue" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Link
                      href="/environment-selector"
                      className="rounded-full bg-waygent-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-waygent-blue/25 transition hover:bg-waygent-blue-hover hover:shadow-waygent-blue/35"
                    >
                      Launch this environment
                    </Link>
                    <span className="text-sm text-waygent-text-muted">
                      Fork it, remix it, or ask Sena to generate a new vertical.
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </div>

      <div className="mx-auto mt-12 max-w-4xl space-y-10 lg:hidden">
        {environments.map((environment) => {
          const isActive = environment.id === activeId;
          return (
            <div
              key={environment.id}
              className={clsx(
                "rounded-3xl border p-6 transition",
                isActive
                  ? "border-waygent-blue bg-white shadow-lg"
                  : "border-white/40 bg-white/70",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveId(environment.id);
                }}
                className="flex w-full flex-col gap-3 text-left"
              >
                <span className="text-xs uppercase tracking-[0.35em] text-waygent-blue">
                  {environment.label}
                </span>
                <h3 className="text-2xl font-semibold text-waygent-text-primary">
                  {environment.persona}
                </h3>
                <p className="text-sm text-waygent-text-secondary">
                  {environment.summary}
                </p>
              </button>
              {isActive && (
                <div className="mt-5 space-y-3 text-sm text-waygent-text-secondary">
                  {environment.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-waygent-blue" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                  <Link
                    href="/environment-selector"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-waygent-blue"
                  >
                    Launch this environment →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default LandingEnvironments;
