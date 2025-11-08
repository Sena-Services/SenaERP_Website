"use client";

import { useState, useEffect, useRef } from "react";
import { Keyword } from "./Keyword";
import NavBar from "./NavBar";

const tokens = [
  {
    word: `composable`,
    definition:
      "Start with pre-built UI components, databases, workflows, and agents. Mix and match primitives like building blocks—no code required. Each piece connects seamlessly to create your custom business operating system.",
    color: "text-waygent-blue",
  },
  {
    word: "platform",
    definition:
      "More than tools—it's a complete operating system for your business. Everything from customer management to invoicing lives in one unified, intelligent workspace that evolves with your needs.",
    color: "text-waygent-blue",
  },
  {
    word: "AI-built",
    definition:
      "AI doesn't just automate—it architects. From responsive UIs to complex workflows, our builder generates production-ready primitives on demand, tailored precisely to your specifications.",
    color: "text-waygent-blue",
  },
  {
    word: "natural language",
    definition:
      "Just describe what you need in plain English. Our AI understands your requirements and generates the exact interfaces, data structures, and automations your business needs—all through conversation.",
    color: "text-waygent-blue",
  },
  {
    word: "small teams",
    definition:
      "Built for nimble, AI-first teams who need enterprise-grade power without enterprise-grade complexity. Get the capabilities of Salesforce with the speed of a startup—no IT department required.",
    color: "text-waygent-blue",
  },
] as const;

// Map Tailwind color classes to hex values
const tailwindToHexColorMap: { [key: string]: string } = {
  "text-waygent-blue": "#3b82f6",
  "text-waygent-orange": "#f59e0b",
};
const FALLBACK_UNDERLINE_COLOR = "#f59e0b";

export default function IntroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [definitionMaxHeight, setDefinitionMaxHeight] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const hiddenRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (paused) {
      // Clear progress animation when paused
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    // Reset progress to 0 when starting new keyword
    setProgress(0);

    // Advance keyword after 4 seconds
    const keywordTimer = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % tokens.length);
    }, 4000);

    // Smoothly fill progress bar over 4 seconds (update every 50ms)
    progressIntervalRef.current = setInterval(() => {
      setProgress((p) => {
        const newProgress = p + (50 / 4000) * 100; // increment by percentage
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);

    return () => {
      clearTimeout(keywordTimer);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [paused, activeIdx]);

  useEffect(() => {
    const measure = () => {
      const max = hiddenRefs.current.reduce((acc, el) => {
        const h = el?.offsetHeight ?? 0;
        return h > acc ? h : acc;
      }, 0);
      if (max > 0) setDefinitionMaxHeight(max);
    };
    // initial measure after fonts render
    const t = setTimeout(measure, 0);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const activeToken = activeIdx >= 0 ? tokens[activeIdx] : null;

  const handleKeywordHover = (index: number) => {
    setActiveIdx(index);
    setPaused(true);
  };

  const handleKeywordLeave = () => {
    setPaused(false);
  };

  // Track scroll progress for scaling animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 0.5; // Scale over first 50vh of scroll
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic styles based on scroll
  const scale = 1 - (scrollProgress * 0.6); // Scale from 100% to 40%
  const borderRadius = 32 + (scrollProgress * 8); // Increase border radius
  const containerHeight = scrollProgress < 1
    ? `calc(100vh - ${6 + (scrollProgress * 74)}rem)` // Shrink from full to small
    : '200px';

  return (
    <section
      id="intro"
      className="relative w-full h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        paddingTop: '3rem',
      }}
    >
      {/* Hero container with scroll-based scaling */}
      <div
        className="relative w-full mx-auto overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: '#EBE5D9',
          height: containerHeight,
          maxWidth: scrollProgress < 1 ? '95vw' : '100%',
          borderRadius: scrollProgress < 1 ? `${borderRadius}px` : '0px',
          boxShadow: scrollProgress < 1 ? '0 20px 60px -12px rgba(0, 0, 0, 0.15)' : 'none',
          transform: `scale(${scale})`,
        }}
      >
        {/* Expanded painting image - fills full container */}
        <img
          src="/illustrations/monet-intro-expanded2.png"
          alt="Monet painting"
          className="absolute inset-0 w-full h-full object-cover object-right"
          style={{
            opacity: 0.95,
          }}
        />

        {/* Navbar overlay on top of image */}
        <div className="absolute top-0 left-0 right-0 z-50 w-full">
          <NavBar />
        </div>

        {/* Content - moves left proportionally as width decreases */}
        <div
          className="relative z-10 h-full w-full flex items-center py-8 sm:py-10 px-6 sm:px-8 lg:px-12"
          style={{
            justifyContent: 'flex-start',
            paddingLeft: 'max(1.5rem, calc(50vw - 600px))',
          }}
        >
          <div className="max-w-2xl space-y-6 text-center">
          {/* Main heading */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2 font-futura leading-tight">
              Compose your business like a painting
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-futura font-medium">
              Describe. Build. Orchestrate.
            </p>
          </div>

          {/* Description with keywords */}
          <div>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-futura">
              <span>A </span>
              <Keyword
                word={tokens[0].word}
                index={0}
                active={activeIdx}
                setActive={handleKeywordHover}
                onMouseLeave={handleKeywordLeave}
                color={tokens[0].color}
                resolvedUnderlineColor={
                  tailwindToHexColorMap[tokens[0].color] ||
                  FALLBACK_UNDERLINE_COLOR
                }
              />
              {" "}
              <Keyword
                word={tokens[1].word}
                index={1}
                active={activeIdx}
                setActive={handleKeywordHover}
                onMouseLeave={handleKeywordLeave}
                color={tokens[1].color}
                resolvedUnderlineColor={
                  tailwindToHexColorMap[tokens[1].color] ||
                  FALLBACK_UNDERLINE_COLOR
                }
              />
              {" that's "}
              <Keyword
                word={tokens[2].word}
                index={2}
                active={activeIdx}
                setActive={handleKeywordHover}
                onMouseLeave={handleKeywordLeave}
                color={tokens[2].color}
                resolvedUnderlineColor={
                  tailwindToHexColorMap[tokens[2].color] ||
                  FALLBACK_UNDERLINE_COLOR
                }
              />
              {" through "}
              <Keyword
                word={tokens[3].word}
                index={3}
                active={activeIdx}
                setActive={handleKeywordHover}
                onMouseLeave={handleKeywordLeave}
                color={tokens[3].color}
                resolvedUnderlineColor={
                  tailwindToHexColorMap[tokens[3].color] ||
                  FALLBACK_UNDERLINE_COLOR
                }
              />
              {" for "}
              <Keyword
                word={tokens[4].word}
                index={4}
                active={activeIdx}
                setActive={handleKeywordHover}
                onMouseLeave={handleKeywordLeave}
                color={tokens[4].color}
                resolvedUnderlineColor={
                  tailwindToHexColorMap[tokens[4].color] ||
                  FALLBACK_UNDERLINE_COLOR
                }
              />
              <span>.</span>
            </p>
          </div>

          {/* Definition block with progress indicator */}
          <div className="space-y-3">
            {/* Definition */}
            <div
              style={{ minHeight: definitionMaxHeight ? `${definitionMaxHeight}px` : '100px' }}
            >
              <div className="relative">
                {activeToken && (
                  <div className="animate-in fade-in duration-400">
                    <div className="rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 px-4 py-3 shadow-lg">
                      <p className="text-gray-800 text-sm sm:text-base leading-relaxed font-futura">
                        {activeToken.definition}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden measurer */}
              <div className="absolute opacity-0 pointer-events-none -z-10" aria-hidden="true">
                {tokens.map((t, i) => (
                  <div
                    key={t.word}
                    ref={(el) => {
                      hiddenRefs.current[i] = el;
                    }}
                  >
                    <div className="rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 px-4 py-3">
                      <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                        {t.definition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress indicator - now below definition */}
            <div className="flex gap-1.5">
              {tokens.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-gray-300 overflow-hidden relative"
                >
                  {/* Filling bar that animates */}
                  <div
                    className="absolute inset-0 rounded-full transition-all"
                    style={{
                      backgroundColor: '#3b82f6',
                      width: i === activeIdx ? `${progress}%` : (i < activeIdx ? '100%' : '0%'),
                      transition: i === activeIdx ? 'none' : 'width 300ms ease-out',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
