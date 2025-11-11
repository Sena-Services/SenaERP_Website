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
  const isNavigatingRef = useRef(false);

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

    // Skip detection if we're actively navigating
    if (isNavigatingRef.current) {
      return;
    }

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

    // Use top-based detection: find which section's anchor is currently past the top of viewport
    const navbarOffset = 200; // Account for navbar + padding
    const scrollPosition = window.scrollY + navbarOffset;

    let activeId = sectionIds[0]!;

    // Special case: if we're very near the top, always select first section
    if (window.scrollY < 100) {
      activeId = sectionIds[0]!;
    } else {
      // Go through sections in order and find the last one whose top is above scroll position
      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i]!;
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;

        // If this section's top is above our scroll position, it's the active one
        if (elementTop <= scrollPosition) {
          activeId = id;
        } else {
          // Once we find a section below our scroll position, stop
          break;
        }
      }
    }

    if (activeId !== activeSectionRef.current) {
      activeSectionRef.current = activeId;
      setActiveSection(activeId);
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

  // Reset all button styles when active section changes
  useEffect(() => {
    Object.entries(itemRefs.current).forEach(([id, button]) => {
      if (button && id !== activeSection) {
        button.style.background = 'transparent';
        button.style.border = '1px solid transparent';
        button.style.transform = 'translateX(0)';
        button.style.boxShadow = 'none';
      }
    });
  }, [activeSection]);

  const handleClick = (id: string) => {
    // Set navigating flag to prevent detection from overriding
    isNavigatingRef.current = true;

    // Force set the active section BEFORE scrolling
    activeSectionRef.current = id;
    setActiveSection(id);
    updateIndicator();

    let targetPosition = 0;

    // Special handling for how-it-works - scroll to the intro section position
    if (id === "how-it-works") {
      // The "how-it-works" cards should be fully split and rotated
      // 900 (shrink) + 400 (split) + 800 (rotate) = 2100px
      const introSection = document.getElementById("intro");
      if (introSection) {
        targetPosition = introSection.offsetTop + 2100; // Full animation complete
      }
    } else {
      const target = document.getElementById(id);
      if (!target) {
        console.warn(`Section not found: ${id}`);
        isNavigatingRef.current = false;
        return;
      }
      // Builder section has py-16 (64px) padding, so we need less offset
      const navbarHeight = id === "builder" ? 20 : 90;
      targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    }

    console.log(`Clicking ${id}, current scrollY: ${window.scrollY}, target: ${targetPosition}`);

    // Instant jump - no animations
    window.scrollTo({
      top: targetPosition,
      behavior: "auto",
    });

    console.log(`After scroll, scrollY: ${window.scrollY}, isNavigating: ${isNavigatingRef.current}`);

    // Re-enable detection after navigation completes
    setTimeout(() => {
      console.log(`Re-enabling detection, current scrollY: ${window.scrollY}`);
      isNavigatingRef.current = false;
    }, 1000);
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-1/2 z-50 -translate-y-1/2 transform group">
      <div className="w-auto">
        <nav aria-label="Section index" className="relative">
          <div
            ref={scrollContainerRef}
            className="relative flex max-h-[72vh] flex-col overflow-y-auto pl-1.5 pr-1.5 py-2 transition-all duration-300 ease-out w-auto group-hover:pr-2"
            style={{
              background: 'transparent',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <ul className="relative flex flex-col gap-1 text-waygent-text-secondary font-space-grotesk">
              {sections.map((section, index) => {
                const isActive = section.id === activeSection;
                const isFirstSection = index === 0;
                const step = index.toString().padStart(2, "0");

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
                      className="group/item relative flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 ease-out focus-visible:outline-none cursor-pointer w-full rounded-xl"
                      style={{
                        background: isActive
                          ? '#8FB7C5'
                          : 'transparent',
                        border: isActive
                          ? '1px solid #7AA5B5'
                          : '1px solid transparent',
                        boxShadow: isActive
                          ? '0 2px 8px rgba(143, 183, 197, 0.3)'
                          : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(143, 183, 197, 0.12)';
                          e.currentTarget.style.border = '1px solid rgba(143, 183, 197, 0.25)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(143, 183, 197, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.border = '1px solid transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {/* Home icon for first section, step number for rest */}
                      <span
                        className="text-[11px] font-bold tracking-wider transition-all duration-200 w-6 h-6 flex-shrink-0 flex items-center justify-center font-space-grotesk rounded-full"
                        style={{
                          color: isActive ? '#FFFFFF' : '#6B7280',
                          background: isActive ? '#6A94A3' : 'rgba(143, 183, 197, 0.15)',
                        }}
                      >
                        {isFirstSection ? (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        ) : (
                          step
                        )}
                      </span>

                      {/* Label text */}
                      <span
                        className="text-[11px] font-semibold transition-all duration-300 flex items-center whitespace-nowrap overflow-hidden opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px] font-space-grotesk"
                        style={{
                          color: isActive ? '#FFFFFF' : '#374151',
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
