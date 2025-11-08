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
          className="absolute inset-0 w-full h-full object-cover object-center md:object-right"
          style={{
            opacity: 0.95,
          }}
        />

        {/* Navbar - responsive positioning */}
        <div className="absolute top-0 z-50 w-full md:w-3/4 lg:w-2/3 xl:w-[45%] left-0 md:left-[5%]">
          <NavBar />
        </div>

        {/* Content - responsive width and positioning */}
        <div
          className="relative z-10 h-full flex flex-col w-full md:w-[85%] lg:w-[70%] xl:w-[60%] px-4 sm:px-8 md:px-10 lg:px-16 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-40 sm:pb-44 md:pb-48 lg:pb-52 ml-0 md:ml-[5%]"
        >
          {/* Main heading */}
          <div className="mb-4 md:mb-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-1.5 md:mb-2 leading-tight" style={{
              fontFamily: 'Georgia, serif',
              color: '#2C1810',
            }}>
              Compose your business like a painting
            </h1>
            <p className="text-base sm:text-lg md:text-xl mt-1.5 md:mt-2" style={{
              fontFamily: 'Georgia, serif',
              color: '#5A4A3A',
              fontStyle: 'italic',
            }}>
              Every stroke deliberate. Every layer connected.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2.5 md:space-y-3">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{
              fontFamily: 'Georgia, serif',
              color: '#3A3A3A',
            }}>
              We believe software should be as expressive as art. Not locked in rigid templates, not trapped in boxes someone else designed.
            </p>

            <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{
              fontFamily: 'Georgia, serif',
              color: '#3A3A3A',
            }}>
              Sena is a canvas where your business takes shape—built from composable pieces that adapt to your vision, orchestrated by AI that understands your intent.
            </p>

            <div className="space-y-1.5 md:space-y-2 pt-1.5">
              <div className="flex items-start gap-2 md:gap-2.5">
                <div className="w-1 h-1 rounded-full bg-gray-800 mt-1.5"></div>
                <p className="text-xs sm:text-sm md:text-base flex-1" style={{
                  fontFamily: 'Georgia, serif',
                  color: '#3A3A3A',
                }}>
                  Start with primitives—databases, workflows, UI components—and combine them like brushstrokes
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-2.5">
                <div className="w-1 h-1 rounded-full bg-gray-800 mt-1.5"></div>
                <p className="text-xs sm:text-sm md:text-base flex-1" style={{
                  fontFamily: 'Georgia, serif',
                  color: '#3A3A3A',
                }}>
                  Describe what you need in natural language, and watch AI architect the solution
                </p>
              </div>
              <div className="flex items-start gap-2 md:gap-2.5">
                <div className="w-1 h-1 rounded-full bg-gray-800 mt-1.5"></div>
                <p className="text-xs sm:text-sm md:text-base flex-1" style={{
                  fontFamily: 'Georgia, serif',
                  color: '#3A3A3A',
                }}>
                  Let intelligent agents handle the mundane while you focus on what matters
                </p>
              </div>
            </div>

            {/* Elegant divider with artistic flourish */}
            <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-gray-400/30">
              <div className="relative">
                <div className="absolute -top-5 md:-top-6 left-0 w-10 md:w-12 h-px bg-gradient-to-r from-gray-600/60 to-transparent"></div>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  color: '#4A3A2A',
                  lineHeight: '1.7',
                }}>
                  From CRM to invoicing, analytics to automation—your entire operating system, composed exactly as you envision it.
                </p>
              </div>
            </div>
          </div>

          {/* Footer - responsive positioning */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-4 sm:left-8 md:left-10 lg:left-16 right-4 sm:right-auto w-auto sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%]">
            <div className="space-y-2 md:space-y-2.5 p-3 sm:p-4 md:p-5 rounded-lg md:rounded-xl" style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold" style={{
                fontFamily: 'Georgia, serif',
                color: '#6B5744',
                letterSpacing: '0.18em',
              }}>Built for creators, not corporations</p>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed" style={{
                fontFamily: 'Georgia, serif',
                color: '#2C1810',
                lineHeight: '1.6',
              }}>
                No rigid workflows. No endless configuration. No armies of consultants. Just you, your vision, and an intelligent system that grows with your imagination.
              </p>
              <div className="h-px bg-gray-400/40 w-full mt-2 md:mt-3"></div>
              <div className="flex items-center justify-between pt-1.5 md:pt-2">
                <p className="text-[10px] sm:text-xs md:text-sm" style={{
                  fontFamily: 'Georgia, serif',
                  color: '#6B5744',
                  fontStyle: 'italic',
                }}>Begin composing your masterpiece</p>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
