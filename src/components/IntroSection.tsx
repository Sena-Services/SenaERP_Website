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
      className="relative w-full h-screen flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-4"
    >
      {/* Hero container with scroll-based scaling */}
      <div
        className="relative w-full mx-auto overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: '#EBE5D9',
          height: containerHeight,
          maxWidth: '95vw',
          borderRadius: `${borderRadius}px`,
          boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15)',
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

        {/* Navbar - positioned on the left, bigger and slightly right */}
        <div className="absolute top-0 z-50" style={{ left: '5%', width: '60%' }}>
          <NavBar />
        </div>

        {/* Content - fills entire left side from top to bottom */}
        <div
          className="relative z-10 h-full flex flex-col justify-between py-20 px-8 sm:px-10 lg:px-16"
          style={{
            width: '60%',
            marginLeft: '5%',
          }}
        >
          {/* Top spacer */}
          <div className="mt-20"></div>

          <div className="space-y-8 flex-1 flex flex-col justify-center">
          {/* Main heading */}
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight mb-5 font-futura leading-tight">
              Compose your business like a painting
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-700 font-futura font-medium mt-6">
              Every stroke deliberate. Every layer connected.
            </p>
          </div>

          {/* Description */}
          <div className="mt-10 space-y-6">
            <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed font-futura">
              We believe software should be as expressive as art. Not locked in rigid templates, not trapped in boxes someone else designed.
            </p>

            <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed font-futura">
              Sena is a canvas where your business takes shape—built from composable pieces that adapt to your vision, orchestrated by AI that understands your intent.
            </p>

            <div className="space-y-5 mt-10">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gray-800 mt-3"></div>
                <p className="text-lg sm:text-xl text-gray-700 font-futura flex-1">
                  Start with primitives—databases, workflows, UI components—and combine them like brushstrokes
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gray-800 mt-3"></div>
                <p className="text-lg sm:text-xl text-gray-700 font-futura flex-1">
                  Describe what you need in natural language, and watch AI architect the solution
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gray-800 mt-3"></div>
                <p className="text-lg sm:text-xl text-gray-700 font-futura flex-1">
                  Let intelligent agents handle the mundane while you focus on what matters
                </p>
              </div>
            </div>

            <div className="mt-10 border-l-4 border-waygent-orange pl-6 py-4">
              <p className="text-xl sm:text-2xl text-gray-800 font-futura italic leading-relaxed">
                From CRM to invoicing, analytics to automation—your entire operating system, composed exactly as you envision it.
              </p>
            </div>
          </div>

          {/* What makes it different */}
          <div className="mt-auto pt-12 pb-10 space-y-5">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wider text-gray-600 font-futura font-semibold">Built for creators, not corporations</p>
              <p className="text-base sm:text-lg text-gray-700 font-futura leading-relaxed">
                No rigid workflows. No endless configuration. No armies of consultants. Just you, your vision, and an intelligent system that grows with your imagination.
              </p>
            </div>
            <div className="h-px bg-gray-300 w-full"></div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 font-futura">Begin composing your masterpiece</p>
              <svg className="w-5 h-5 text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
