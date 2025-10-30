"use client";

import { useState, useEffect, useRef } from "react";
import { Keyword } from "./Keyword";

const tokens = [
  {
    word: `lightweight`,
    definition:
      "Cloud-native. Zero installation. Instant access from anywhere.",
    color: "text-waygent-blue",
  },
  {
    word: "end-to-end",
    definition:
      "From inquiry to invoice. Every workflow, seamlessly integrated.",
    color: "text-waygent-blue",
  },
  {
    word: "AI-powered",
    definition:
      "Smart automation that learns your business and suggests what's next.",
    color: "text-waygent-blue",
  },
  {
    word: "ERP",
    definition:
      "Enterprise-grade system built for teams that need real business tools.",
    color: "text-waygent-blue",
  },
  {
    word: "all sizes",
    definition:
      "Scales from startup to enterprise without platform migrations.",
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
  const [lastHoveredIdx, setLastHoveredIdx] = useState(-1);
  const [definitionMaxHeight, setDefinitionMaxHeight] = useState(0);
  const hiddenRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % tokens.length);
      setLastHoveredIdx(-1);
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);

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
    setLastHoveredIdx(index);
    setPaused(true);
  };

  const handleKeywordLeave = () => {
    setPaused(false);
    // Keep the last hovered keyword active until timer takes over
    if (lastHoveredIdx >= 0) {
      // setActiveIdx(lastHoveredIdx); // Optional: keep last hovered active immediately
    }
  };

  return (
    <section
      id="intro"
      className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Compact, rounded container */}
      <div
        className="relative max-w-7xl mx-auto rounded-[40px] overflow-hidden border-2 border-waygent-light-blue"
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backgroundImage: 'url(/illustrations/monet-intro.png), url(/illustrations/monet-left-edge.png)',
          backgroundSize: 'auto 100%, auto 100%',
          backgroundPosition: 'right center, left center',
          backgroundRepeat: 'no-repeat, repeat-x',
          backgroundColor: '#FAF9F5',
          minHeight: '550px',
          height: '65vh',
          maxHeight: '700px'
        }}
      >
        {/* Gradient overlay to smooth repeating edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(250, 249, 245, 0.05) 30%, rgba(250, 249, 245, 0.05) 70%, transparent 100%)',
            backgroundSize: '200px 100%',
            backgroundRepeat: 'repeat-x',
            mixBlendMode: 'overlay'
          }}
        />

        {/* Content positioned on the left (on top of cream area of image) */}
        <div className="relative h-full flex items-center py-12 sm:py-16 px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl lg:max-w-2xl">
          {/* Decorative top brushstroke */}
          <div className="flex justify-start mb-4">
            <svg className="w-20 h-2" viewBox="0 0 100 10" style={{ opacity: 0.3 }}>
              <path d="M0,5 Q25,2 50,5 T100,5" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Main heading */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-3 font-space-grotesk">
              An ERP that feels like{" "}
              <span className="relative inline-block">
                <span className="text-waygent-blue">art</span>
                <svg
                  className="absolute left-0 -bottom-1 w-full"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  style={{ height: '6px' }}
                >
                  <path
                    d="M2,8 Q50,4 100,8 T198,8"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-light font-space-grotesk">
              Lightweight. Intelligent. Beautiful.
            </p>
          </div>

          {/* Description with keywords */}
          <div className="mb-6">
            <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-light font-space-grotesk">
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
              {", "}
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
              {", "}
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
              {" "}
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
              {" "}
              <span>for companies of </span>
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

          {/* Definition block - compact */}
          <div
            style={{ minHeight: definitionMaxHeight ? `${definitionMaxHeight}px` : '80px' }}
          >
            <div className="relative">
              {activeToken && (
                <div className="animate-in fade-in duration-400">
                  <div className="rounded-xl bg-white/40 backdrop-blur-sm border border-waygent-light-blue/60 px-4 py-3 shadow-sm">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium font-space-grotesk">
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
                  <div className="rounded-xl bg-white/40 backdrop-blur-sm border border-waygent-light-blue/60 px-4 py-3">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                      {t.definition}
                    </p>
                  </div>
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
