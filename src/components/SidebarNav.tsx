"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./SidebarNav.module.css";

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
  const [isExpanded, setIsExpanded] = useState(false);

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

    if (isNavigatingRef.current) {
      return;
    }

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom) {
      const lastId = sectionIds[sectionIds.length - 1]!;
      if (lastId !== activeSectionRef.current) {
        activeSectionRef.current = lastId;
        setActiveSection(lastId);
      }
      return;
    }

    const navbarOffset = 200;
    const scrollPosition = window.scrollY + navbarOffset;

    let activeId = sectionIds[0]!;

    if (window.scrollY < 100) {
      activeId = sectionIds[0]!;
    } else {
      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i]!;
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;

        if (elementTop <= scrollPosition) {
          activeId = id;
        } else {
          break;
        }
      }
    }

    if (activeId !== activeSectionRef.current) {
      activeSectionRef.current = activeId;
      setActiveSection(activeId);
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
    isNavigatingRef.current = true;

    activeSectionRef.current = id;
    setActiveSection(id);

    let targetPosition = 0;

    const isHomeSection = sections.findIndex(s => s.id === id) === 0;
    if (isHomeSection) {
      targetPosition = 0;
      window.dispatchEvent(new CustomEvent('resetHome'));
    } else if (id === "how-it-works") {
      const introSection = document.getElementById("intro");
      if (introSection) {
        targetPosition = introSection.offsetTop + 2100;
      }
    } else {
      const target = document.getElementById(id);
      if (!target) {
        console.warn(`Section not found: ${id}`);
        isNavigatingRef.current = false;
        return;
      }
      const navbarHeight = id === "builder" ? 80 : 90;
      targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    }

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setScale(1);
      } else if (width >= 768) {
        setScale(0.6 + ((width - 768) / (1024 - 768)) * 0.4);
      } else {
        setScale(0);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (scale === 0) return null;

  return (
    <aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      style={{ transform: 'translateY(-50%)' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.scaleWrapper} style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
        <nav aria-label="Section index" className={styles.nav}>
          <div ref={scrollContainerRef} className={styles.scrollContainer}>
            <ul className={styles.list}>
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
                      className={`${styles.button} ${isActive ? styles.buttonActive : ''}`}
                    >
                      {/* Circle with icon/number */}
                      <span className={`${styles.circle} ${isActive ? styles.circleActive : ''}`}>
                        {isFirstSection ? (
                          <svg
                            className={styles.homeIcon}
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
                          <span className={styles.stepNumber}>{step}</span>
                        )}
                      </span>

                      {/* Label text - only visible when expanded */}
                      <span className={styles.label}>
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
