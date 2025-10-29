"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Section = {
  id: string;
  label: string;
};

type SidebarNavProps = {
  sections: Section[];
};

type ProgressMap = Record<string, number>;

export default function SidebarNav({ sections }: SidebarNavProps) {
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections]
  );

  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");
  const [progressMap, setProgressMap] = useState<ProgressMap>(() => {
    const initial: ProgressMap = {};
    sectionIds.forEach((id) => {
      initial[id] = 0;
    });
    return initial;
  });

  const rafId = useRef<number | null>(null);
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    setProgressMap((prev) => {
      const updated: ProgressMap = {};
      sectionIds.forEach((id) => {
        updated[id] = prev[id] ?? 0;
      });
      return updated;
    });

    if (sectionIds.length > 0) {
      setActiveSection((prev) =>
        prev && sectionIds.includes(prev) ? prev : sectionIds[0]
      );
    }
  }, [sectionIds]);

  useEffect(() => {
    const updateProgress = () => {
      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = window.scrollY + viewportHeight / 2;
      const next: ProgressMap = {};
      let bestId = sectionIds[0] ?? "";
      let bestScore = Number.NEGATIVE_INFINITY;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) {
          next[id] = 0;
          return;
        }

        const rect = element.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionHeight = Math.max(rect.height, 1);
        const sectionCenter = sectionTop + sectionHeight / 2;

        const rawProgress = (viewportCenter - sectionTop) / sectionHeight;
        const progress = Math.min(1, Math.max(0, rawProgress));
        next[id] = progress;

        const distance = Math.abs(sectionCenter - viewportCenter);
        const normalized =
          1 - distance / (viewportHeight / 2 + sectionHeight / 2);
        const score = normalized + progress * 0.05;
        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      });

      setProgressMap((prev) => {
        let changed = false;
        const upcoming: ProgressMap = {};
        sectionIds.forEach((id) => {
          const nextValue = Math.max(0, Math.min(1, next[id] ?? 0));
          const prevValue = prev[id] ?? 0;
          if (!changed && Math.abs(nextValue - prevValue) > 0.02) {
            changed = true;
          }
          upcoming[id] = nextValue;
        });
        return changed ? upcoming : prev;
      });

      if (bestId && bestId !== activeSectionRef.current) {
        activeSectionRef.current = bestId;
        setActiveSection(bestId);
      }
    };

    const scheduleUpdate = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(updateProgress);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [sectionIds]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    activeSectionRef.current = id;
    setActiveSection(id);
    element.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <aside className="sticky top-3 z-30 hidden h-[calc(100vh-1.5rem)] w-52 min-w-[12rem] flex-col items-center justify-center rounded-r-3xl border border-waygent-light-blue/70 border-l-0 bg-gradient-to-b from-waygent-light-blue via-waygent-cream to-waygent-light-blue px-4 py-8 shadow-[0_18px_40px_-15px_rgba(59,130,246,0.25),0_8px_30px_-20px_rgba(245,158,11,0.35)] backdrop-blur-sm xl:flex">
      <nav
        aria-label="Section index"
        className="flex h-full w-full flex-col items-stretch justify-center gap-4"
      >
        {sections.map((section, index) => {
          const progress = progressMap[section.id] ?? 0;
          const isActive = section.id === activeSection;
          const progressHeight = Math.min(100, Math.max(progress * 100, 6));
          const labelToken = section.label.slice(0, 2).toUpperCase();
          const step = (index + 1).toString().padStart(2, "0");

          return (
            <button
              key={section.id}
              type="button"
              aria-label={section.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => handleClick(section.id)}
              className={`group relative flex w-full items-center gap-4 overflow-visible rounded-2xl px-3 py-4 transition-all duration-500 ease-out ${
                isActive
                  ? "bg-white/95 shadow-lg shadow-waygent-light-blue/50"
                  : "hover:bg-white/75"
              }`}
            >
              <div className="relative flex h-16 w-8 items-center justify-center">
                <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/40" />
                <div
                  className="absolute bottom-0 left-1/2 w-[4px] -translate-x-1/2 rounded-full bg-gradient-to-b from-waygent-blue via-waygent-orange to-waygent-blue transition-[height] duration-500 ease-out"
                  style={{ height: `${progressHeight}%` }}
                />
                <span
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-transparent bg-waygent-cream/90 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all duration-500 ease-out ${
                    isActive
                      ? "border-waygent-orange bg-white text-waygent-blue shadow-lg shadow-waygent-light-blue/40"
                      : "text-waygent-text-secondary group-hover:border-waygent-blue group-hover:bg-white group-hover:text-waygent-blue"
                  }`}
                >
                  {labelToken}
                </span>
              </div>

              <div className="flex flex-1 flex-col items-start">
                <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-waygent-text-secondary">
                  {step}
                </span>
                <span
                  className={`text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-waygent-blue"
                      : "text-waygent-text-secondary group-hover:text-waygent-blue"
                  }`}
                >
                  {section.label}
                </span>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r from-waygent-blue via-waygent-orange to-waygent-blue transition-[width] duration-500 ease-out ${
                      isActive ? "shadow-[0_0_12px_rgba(245,158,11,0.35)]" : ""
                    }`}
                    style={{ width: `${Math.max(12, progress * 100)}%` }}
                  />
                </div>
              </div>

              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl border border-waygent-blue/30 transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
