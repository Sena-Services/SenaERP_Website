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

const MIN_BAR_WIDTH = 12;

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
        const boundedProgress = Math.min(1, Math.max(0, rawProgress));
        next[id] = boundedProgress;

        const distance = Math.abs(sectionCenter - viewportCenter);
        const normalized =
          1 - distance / (viewportHeight / 2 + sectionHeight / 2);
        const score = normalized + boundedProgress * 0.05;
        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      });

      setProgressMap((prev) => {
        let changed = false;
        const incoming: ProgressMap = {};
        sectionIds.forEach((id) => {
          const nextValue = Math.max(0, Math.min(1, next[id] ?? 0));
          const previous = prev[id] ?? 0;
          if (!changed && Math.abs(nextValue - previous) > 0.025) {
            changed = true;
          }
          incoming[id] = nextValue;
        });
        return changed ? incoming : prev;
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
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    activeSectionRef.current = id;
    setActiveSection(id);
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <aside className="sticky top-3 z-30 hidden h-[calc(100vh-1.5rem)] w-56 min-w-[13rem] xl:flex">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-r-3xl border border-waygent-light-blue bg-waygent-cream/96 shadow-[0_12px_35px_rgba(59,130,246,0.12)]">
        <nav
          aria-label="Section index"
          className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-waygent-light-blue/80 scrollbar-track-transparent"
        >
          <ul className="flex flex-col gap-3">
            {sections.map((section, index) => {
              const progress = progressMap[section.id] ?? 0;
              const isActive = section.id === activeSection;
              const width = Math.max(MIN_BAR_WIDTH, progress * 100);
              const step = (index + 1).toString().padStart(2, "0");

              return (
                <li key={section.id}>
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    aria-label={section.label}
                    onClick={() => handleClick(section.id)}
                    className={`group flex w-full flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? "border-waygent-blue bg-white shadow-[0_10px_25px_rgba(59,130,246,0.18)]"
                        : "border-transparent hover:border-waygent-light-blue/70 hover:bg-white/90"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-waygent-text-muted">
                        {step}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-waygent-blue"
                            : "text-waygent-text-secondary group-hover:text-waygent-blue"
                        }`}
                      >
                        {section.label}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-waygent-light-blue/70">
                      <div
                        className={`h-full rounded-full transition-[width] duration-300 ${
                          isActive
                            ? "bg-waygent-blue"
                            : "bg-waygent-text-muted/50 group-hover:bg-waygent-blue/70"
                        }`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
