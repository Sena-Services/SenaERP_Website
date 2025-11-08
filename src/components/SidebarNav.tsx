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
  const [indicator, setIndicator] = useState<IndicatorState>(INITIAL_INDICATOR);

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

    // Check if we're at the bottom of the page
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

    // If at bottom, select the last section
    if (isAtBottom) {
      const lastId = sectionIds[sectionIds.length - 1]!;
      if (lastId !== activeSectionRef.current) {
        activeSectionRef.current = lastId;
        setActiveSection(lastId);
      }
      return;
    }

    // Otherwise, use center-based detection
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

    const top = buttonRect.top - containerRect.top + container.scrollTop;
    const height = buttonRect.height;

    setIndicator((prev) => {
      if (Math.abs(prev.top - top) < 0.5 && Math.abs(prev.height - height) < 0.5) {
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
    // Special handling for "how-it-works" - trigger the intro sequence
    if (id === "how-it-works") {
      // Dispatch a custom event that the main page can listen to
      window.dispatchEvent(new CustomEvent("triggerIntroSequence"));
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    // Calculate the position accounting for the top navbar
    const navbarHeight = 80; // Adjust this value based on your navbar height
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    // Instant navigation - no smooth scrolling
    window.scrollTo({
      top: targetPosition,
      behavior: "auto",
    });

    // Force update of sidebar highlighting after scroll
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 50);
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-1/2 z-50 w-[8.5rem] sm:w-[9rem] -translate-y-1/2 transform">
      <div className="w-full">
        <nav aria-label="Section index" className="relative">
          <div
            ref={scrollContainerRef}
            className="relative flex max-h-[72vh] flex-col overflow-y-auto rounded-r-3xl bg-white/40 border border-white/60 border-l-0 px-3 py-3 backdrop-blur-lg shadow-[0_10px_40px_-20px_rgba(28,24,18,0.65)] scrollbar-thin scrollbar-thumb-waygent-blue/30 scrollbar-track-transparent"
          >
            {/* Smooth sliding indicator */}
            <div
              className="absolute left-3 right-3 rounded-xl bg-waygent-blue/15 border border-waygent-blue/40 shadow-[0_8px_30px_-20px_rgba(18,73,115,0.8)] pointer-events-none transition-all duration-500 ease-out"
              style={{
                top: indicator.top,
                height: indicator.height,
                opacity: indicator.height > 0 ? 1 : 0,
                transform: indicator.height > 0 ? 'scale(1)' : 'scale(0.95)',
              }}
            />

            <ul className="relative flex flex-col gap-0.5 text-waygent-text-secondary font-space-grotesk">
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
                      className={`group relative flex w-full items-center gap-2 rounded-lg px-2.5 py-[9px] text-left transition-all duration-300 ease-out focus-visible:outline-none cursor-pointer ${
                        !isActive && 'hover:bg-white/60 hover:shadow-sm'
                      }`}
                    >
                      <span
                        className="text-[9px] font-semibold tracking-wider transition-colors duration-300 w-5 flex-shrink-0 flex items-center justify-center"
                        style={{
                          color: isActive ? '#1F2937' : 'rgb(107, 114, 128)',
                          transitionDelay: isActive ? '500ms' : '0ms',
                          lineHeight: '1',
                        }}
                      >
                        {step}
                      </span>
                      <span
                        className={`flex-1 text-[10.5px] sm:text-[11px] font-semibold transition-all duration-300 flex items-center whitespace-nowrap ${
                          !isActive && 'group-hover:text-waygent-orange'
                        }`}
                        style={{
                          color: isActive ? '#1F2937' : 'rgb(31, 41, 55)',
                          transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                          transitionDelay: isActive ? '500ms' : '0ms',
                          lineHeight: '1.3',
                        }}
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
