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
    <aside className="hidden lg:flex fixed left-0 top-1/2 z-50 -translate-y-1/2 transform group">
      <div className="w-auto">
        <nav aria-label="Section index" className="relative">
          <div
            ref={scrollContainerRef}
            className="relative flex max-h-[72vh] flex-col overflow-y-auto pl-1.5 pr-1.5 py-2 scrollbar-thin scrollbar-thumb-waygent-blue/30 scrollbar-track-transparent transition-all duration-300 ease-out w-auto group-hover:pr-2"
            style={{
              background: 'transparent',
            }}
          >
            {/* Smooth sliding indicator */}
            <div
              className="absolute left-1 right-1 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                top: indicator.top,
                height: indicator.height,
                opacity: indicator.height > 0 ? 1 : 0,
                background: '#8FB7C5',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(143, 183, 197, 0.4)',
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
                      className="group/item relative flex items-center gap-2 px-2 py-2 text-left transition-all duration-300 ease-out focus-visible:outline-none cursor-pointer w-full rounded-lg"
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.backdropFilter = 'blur(10px)';
                          e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.backdropFilter = 'none';
                          e.currentTarget.style.border = '1px solid transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                    >
                      {/* Step number */}
                      <span
                        className="text-[9px] font-bold tracking-wider transition-all duration-300 w-5 h-5 flex-shrink-0 flex items-center justify-center font-space-grotesk rounded-full group-hover/item:scale-110"
                        style={{
                          color: isActive ? '#1F2937' : 'rgba(107, 114, 128, 0.8)',
                        }}
                      >
                        {step}
                      </span>

                      {/* Label text */}
                      <span
                        className="text-[10px] font-semibold transition-all duration-300 flex items-center whitespace-nowrap overflow-hidden opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px] font-space-grotesk group-hover/item:text-waygent-blue"
                        style={{
                          color: isActive ? '#1F2937' : 'rgb(55, 65, 81)',
                          fontWeight: isActive ? '700' : '600',
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
