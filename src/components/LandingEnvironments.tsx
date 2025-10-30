"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
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

export default function LandingEnvironments() {
  const [activeId, setActiveId] = useState(environments[0].id);
  const [userInteracted, setUserInteracted] = useState(false);
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const boardOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const boardTranslate = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  const detailOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const detailTranslate = useTransform(scrollYProgress, [0.35, 0.55], [80, 0]);
  const backgroundShift = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const cardTransforms = [
    useEnvironmentCardTransform(
      0,
      scrollYProgress,
      initialPositions[environments[0].id],
    ),
    useEnvironmentCardTransform(
      1,
      scrollYProgress,
      initialPositions[environments[1].id],
    ),
    useEnvironmentCardTransform(
      2,
      scrollYProgress,
      initialPositions[environments[2].id],
    ),
    useEnvironmentCardTransform(
      3,
      scrollYProgress,
      initialPositions[environments[3].id],
    ),
  ];

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (userInteracted) return;
    const thresholds = [0.42, 0.58, 0.74];
    let nextIndex = 0;
    if (value >= thresholds[0]) nextIndex = 1;
    if (value >= thresholds[1]) nextIndex = 2;
    if (value >= thresholds[2]) nextIndex = 3;
    const nextId = environments[nextIndex]?.id ?? environments[0].id;
    if (nextId !== activeId) {
      setActiveId(nextId);
    }
  });

  const activeEnvironment = useMemo(
    () => environments.find((env) => env.id === activeId) ?? environments[0],
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
    <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight">
            Environments
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[520px_1fr] mb-14">
          {/* EnvironmentSelector on the left */}
          <div className="relative h-[600px] overflow-hidden rounded-[36px] border border-[#d4ddfa] bg-white/85 shadow-xl backdrop-blur">
            <EnvironmentSelector
              readOnly
              previewMode
              currentEnvironment={activeId}
              initialEnvironments={selectorEnvironments}
            />
          </div>

          {/* Description on the right */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-3xl font-semibold leading-tight text-waygent-text-primary sm:text-4xl">
              Launch-ready verticals built into Sena.
            </h3>
            <p className="text-lg text-waygent-text-secondary">
              Every environment is a complete workspace—UI, workflows, data,
              automations, and agents—trained on industry playbooks. Start with a
              template, then ask Sena to adapt it to your processes.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative hidden min-h-[240vh] lg:block"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[42px] bg-gradient-to-br from-[#f2f7ff] via-[#fdfbf5] to-[#fde6ff]"
          style={{ y: backgroundShift }}
        />

        <div className="sticky top-28">
          <div className="mx-auto grid max-w-7xl grid-cols-[640px_minmax(0,1fr)] gap-16 px-4 sm:px-6 lg:px-0">
            <div className="relative h-[820px]">
              <motion.div
                aria-hidden="true"
                style={{ opacity: boardOpacity, y: boardTranslate }}
                ref={boardRef}
                className="absolute inset-0 overflow-hidden rounded-[36px] border border-[#d4ddfa] bg-white/85 shadow-[0_36px_110px_rgba(15,23,42,0.16)] backdrop-blur"
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  data-environment-selector-preview
                >
                  <EnvironmentSelector
                    readOnly
                    previewMode
                    currentEnvironment={activeId}
                    initialEnvironments={selectorEnvironments}
                  />
                </div>
              </motion.div>
              <div className="absolute inset-0">
                {environments.map((environment, index) => {
                  const isActive = environment.id === activeId;
                  const transform = cardTransforms[index];

                  return (
                    <motion.button
                      key={environment.id}
                      type="button"
                      onClick={() => {
                        setActiveId(environment.id);
                        setUserInteracted(true);
                      }}
                      style={{
                        x: transform.x,
                        y: transform.y,
                        width: transform.width,
                        borderRadius: transform.borderRadius,
                        boxShadow: transform.boxShadow,
                        opacity: transform.opacity,
                      }}
                      className={clsx(
                        "absolute flex flex-col gap-3 border bg-white/95 p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-waygent-blue/40",
                        isActive
                          ? "border-waygent-blue shadow-waygent-blue/20"
                          : "border-slate-200 hover:border-waygent-blue/40",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={clsx(
                              "inline-flex h-8 w-8 items-center justify-center rounded-full border text-base",
                              isActive
                                ? "border-waygent-blue/40 bg-waygent-blue/10 text-waygent-blue"
                                : "border-slate-200 bg-white text-waygent-blue",
                            )}
                          >
                            ✦
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            {environment.label}
                          </span>
                        </div>
                        <span
                          className={clsx(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                            isActive
                              ? "bg-waygent-blue text-white"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {environment.persona}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                        {environment.metrics.map((metric) => (
                          <span
                            key={metric.id}
                            className={clsx(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-1",
                              isActive
                                ? "border-waygent-blue/50 bg-waygent-blue/10 text-waygent-blue"
                                : "border-slate-200 bg-white/80",
                            )}
                            title={metric.label}
                          >
                            <span>{metric.icon}</span>
                            <span className="font-medium">
                              {metric.value}
                            </span>
                          </span>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.aside
              style={{ opacity: detailOpacity, y: detailTranslate }}
              className="relative rounded-[32px] border border-white/60 bg-white/80 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEnvironment.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.35em] text-waygent-blue">
                      {activeEnvironment.label}
                    </span>
                    <h3 className="text-3xl font-semibold text-waygent-text-primary">
                      Built for {activeEnvironment.label.toLowerCase()}.
                    </h3>
                    <p className="text-lg text-waygent-text-secondary">
                      {activeEnvironment.summary}
                    </p>
                  </div>
                  <ul className="space-y-3 text-sm text-waygent-text-secondary">
                    {activeEnvironment.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-waygent-blue" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-4 pt-3">
                    <Link
                      href="/environment-selector"
                      className="rounded-full bg-waygent-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-waygent-blue/25 transition hover:bg-waygent-blue-hover"
                    >
                      Launch this environment
                    </Link>
                    <span className="text-sm text-waygent-text-muted">
                      Fork it, remix it, or ask Sena to generate a new vertical.
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.aside>
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
                  setUserInteracted(true);
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
}
