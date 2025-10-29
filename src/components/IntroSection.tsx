"use client";

import { useState, useEffect, useRef } from "react";
import { Keyword } from "./Keyword";

const tokens = [
  {
    word: `lightweight`,
    definition:
      "Cloud-native architecture means zero installations, zero maintenance, and zero IT headaches. Our platform runs entirely in your browser with enterprise-grade security and performance. No servers to manage, no software to update, no complex integrations. Just instant access from anywhere in the world with nothing more than an internet connection.",
    color: "text-waygent-blue",
  },
  {
    word: "end-to-end",
    definition:
      "From initial customer inquiry to final account reconciliation, Sena handles every single business workflow. Customer management, order processing, inventory tracking, payment processing, supplier coordination, document handling, customer communication, reporting, and financial reconciliation—all seamlessly integrated in one unified platform.",
    color: "text-waygent-blue",
  },
  {
    word: "AI-centred",
    definition:
      "Our advanced AI engine transforms how you work by intelligently analyzing customer data, suggesting profitable upsells based on customer preferences, providing instant customer support responses, optimizing pricing strategies, and automating routine tasks. Think of it as having an expert business analyst and operations manager working 24/7 alongside your team.",
    color: "text-waygent-blue",
  },
  {
    word: "ERP",
    definition:
      "Enterprise Resource Planning system that integrates all core business processes including finance, human resources, supply chain, manufacturing, and customer relationship management. Built specifically for companies that need comprehensive business management, not just basic tools. We understand complex organizational structures, multi-department workflows, and enterprise-level requirements.",
    color: "text-waygent-blue",
  },
  {
    word: "all sizes",
    definition:
      "Whether you're a startup just getting off the ground, a mid-size company managing hundreds of transactions monthly, or an enterprise handling thousands of operations, Sena automatically scales with your business. Our flexible pricing, modular features, and infrastructure grow seamlessly as you expand without any platform migrations or disruptions.",
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
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight mb-4">
            What is{" "}
            <span className="text-waygent-blue relative inline-block">
              Sena
              <svg
                className="absolute left-0 -bottom-2 w-full"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
                style={{ height: '8px' }}
              >
                <path
                  d="M0,5 Q50,0 100,5 T200,5"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-gray-900">?</span>
          </h1>
        </div>

        {/* Description with keywords */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-relaxed max-w-6xl mx-auto font-light">
            <span>Sena is a </span>
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
            {", "}
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
            {", "}
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

        {/* Definition block with fixed height to prevent layout shift */}
        <div
          className="mx-auto max-w-5xl"
          style={{ minHeight: definitionMaxHeight ? `${definitionMaxHeight}px` : '300px' }}
        >
          <div className="relative">
            {activeToken && (
              <div className="text-center animate-in fade-in duration-500">
                <div className="mb-8">
                  <span className={`${activeToken.color} font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight relative inline-block`}>
                    {activeToken.word}
                    <div className="absolute left-0 right-0 -bottom-2 h-1 bg-gradient-to-r from-transparent via-waygent-blue to-transparent opacity-50"></div>
                  </span>
                </div>
                <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed font-light max-w-4xl mx-auto">
                  {activeToken.definition}
                </p>
              </div>
            )}
          </div>

          {/* Hidden measurer to compute the tallest definition */}
          <div className="absolute opacity-0 pointer-events-none -z-10" aria-hidden="true">
            {tokens.map((t, i) => (
              <div
                key={t.word}
                ref={(el) => {
                  hiddenRefs.current[i] = el;
                }}
                className="text-center max-w-5xl"
              >
                <div className="mb-8">
                  <span className={`${t.color} font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight`}>
                    {t.word}
                  </span>
                </div>
                <p className="text-gray-700 text-lg sm:text-xl md:text-2xl leading-relaxed font-light max-w-4xl mx-auto">
                  {t.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
