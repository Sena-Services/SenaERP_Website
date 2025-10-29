"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Section = {
  id: string;
  label: string;
};

type SidebarNavProps = {
  sections: Section[];
};

export default function SidebarNav({ sections }: SidebarNavProps) {
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections]
  );

  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");

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

  useEffect(() => {
    const schedule = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        updateActiveSection();
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
  }, [updateActiveSection]);

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
  };

  return (
    <aside className="fixed left-4 top-1/2 z-50 flex w-[10rem] sm:w-[11rem] lg:w-[12rem] -translate-y-1/2 transform">
      <div className="w-full">
        <nav aria-label="Section index" className="relative">
          <div
            ref={scrollContainerRef}
            className="relative flex max-h-[72vh] flex-col overflow-y-auto rounded-3xl bg-waygent-light-blue border border-waygent-light-blue px-3 sm:px-4 py-5 backdrop-blur-sm scrollbar-thin scrollbar-thumb-waygent-blue/30 scrollbar-track-transparent"
            style={{
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }}
          >

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
                      className={`group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all duration-300 ease-out focus-visible:outline-none ${
                        isActive
                          ? "bg-waygent-orange text-white shadow-sm"
                          : "bg-transparent hover:bg-white/50 hover:shadow-sm"
                      }`}
                    >
                      <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.3em] ${
                        isActive ? "text-white/90" : "text-waygent-text-muted"
                      }`}>
                        {step}
                      </span>
                      <span
                        className={`flex-1 text-[12px] sm:text-[13px] font-semibold ${
                          isActive
                            ? "text-white"
                            : "text-waygent-text-primary group-hover:text-waygent-orange"
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
