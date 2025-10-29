"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Section = {
  id: string;
  label: string;
};

type SidebarNavProps = {
  sections: Section[];
};

type IndicatorState = {
  top: number;
  height: number;
};

const INITIAL_INDICATOR: IndicatorState = { top: 0, height: 0 };

export default function SidebarNav({ sections }: SidebarNavProps) {
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections]
  );

  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");
  const [indicator, setIndicator] =
    useState<IndicatorState>(INITIAL_INDICATOR);

  const rafId = useRef<number | null>(null);
  const activeSectionRef = useRef(activeSection);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    if (sectionIds.length === 0) return;
    setActiveSection((prev) =>
      prev && sectionIds.includes(prev) ? prev : sectionIds[0]
    );
  }, [sectionIds]);

  const updateActiveSection = useCallback(() => {
    if (sectionIds.length === 0) return;

    const viewportHeight = window.innerHeight || 1;
    const viewportCenter = window.scrollY + viewportHeight / 2;
    let bestId = sectionIds[0]!;
    let bestScore = Number.NEGATIVE_INFINITY;

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = Math.max(rect.height, 1);
      const sectionCenter = sectionTop + sectionHeight / 2;

      const distance = Math.abs(sectionCenter - viewportCenter);
      const normalized =
        1 - distance / (viewportHeight / 2 + sectionHeight / 2);

      if (normalized > bestScore) {
        bestScore = normalized;
        bestId = id;
      }
    });

    if (bestId !== activeSectionRef.current) {
      activeSectionRef.current = bestId;
      setActiveSection(bestId);
    }
  }, [sectionIds]);

  const updateIndicator = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const button = itemRefs.current[activeSectionRef.current] ?? null;
    if (!button) {
      setIndicator(INITIAL_INDICATOR);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const top =
      buttonRect.top - containerRect.top + container.scrollTop;
    const height = buttonRect.height;

    setIndicator((prev) => {
      if (
        Math.abs(prev.top - top) < 0.5 &&
        Math.abs(prev.height - height) < 0.5
      ) {
        return prev;
      }
      return { top, height };
    });
  }, []);

  useEffect(() => {
    const schedule = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updateActiveSection();
        updateIndicator();
      });
    };

    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", schedule, { passive: true });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      container?.removeEventListener("scroll", schedule);
    };
  }, [updateActiveSection, updateIndicator]);

  useEffect(() => {
    const timer = window.setTimeout(updateIndicator, 0);
    return () => window.clearTimeout(timer);
  }, [activeSection, updateIndicator]);

  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    activeSectionRef.current = id;
    setActiveSection(id);
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    updateIndicator();
  };

  return (
    <aside className="fixed left-4 top-1/2 z-50 flex w-[9rem] sm:w-[10rem] lg:w-[11rem] -translate-y-1/2 transform">
      <div className="w-full">
        <nav aria-label="Section index" className="relative">
          <div
            ref={scrollContainerRef}
            className="relative flex max-h-[72vh] flex-col overflow-y-auto rounded-3xl border-2 border-waygent-blue bg-white px-3 sm:px-4 py-4 sm:py-5 shadow-2xl scrollbar-thin scrollbar-thumb-waygent-blue/30 scrollbar-track-transparent"
          >
            <span
              className="pointer-events-none absolute left-2 w-[2px] rounded-full bg-waygent-blue transition-all duration-300 ease-out"
              style={{
                top: indicator.top + 8,
                height: Math.max(indicator.height - 16, 10),
                opacity: indicator.height > 0 ? 1 : 0,
              }}
            />
            <span
              className="pointer-events-none absolute left-[11px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-waygent-orange bg-white shadow-[0_0_6px_rgba(245,158,11,0.35)] transition-all duration-300 ease-out"
              style={{
                top: indicator.top + indicator.height / 2,
                opacity: indicator.height > 0 ? 1 : 0,
              }}
            />

            <ul className="flex flex-col gap-1.5 text-waygent-text-secondary">
              {sections.map((section, index) => {
                const isActive = section.id === activeSection;
                const step = (index + 1).toString().padStart(2, "0");

                return (
                  <li key={section.id}>
                    <button
                      ref={(el) => {
                        itemRefs.current[section.id] = el;
                      }}
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      aria-label={section.label}
                      onClick={() => handleClick(section.id)}
                      className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-2 text-left transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-waygent-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <span
                        className={`pointer-events-none absolute inset-y-0 left-2 right-2 rounded-xl transition-all duration-300 z-0 ${
                          isActive
                            ? "bg-white shadow-[0_6px_14px_rgba(59,130,246,0.14)]"
                            : "bg-transparent group-hover:bg-waygent-light-blue/70"
                        }`}
                      />
                      <span className="relative z-10 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.35em] text-waygent-text-muted">
                        {step}
                      </span>
                      <span
                        className={`relative z-10 flex-1 text-[11px] sm:text-[13px] font-semibold ${
                          isActive
                            ? "text-waygent-blue"
                            : "text-waygent-text-secondary group-hover:text-waygent-blue"
                        }`}
                      >
                        {section.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
