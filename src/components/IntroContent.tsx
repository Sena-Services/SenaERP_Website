"use client";

import { useState, useEffect, useRef } from 'react';

type IntroContentProps = {
  contentOpacity: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

export default function IntroContent({ contentOpacity, scrollRef }: IntroContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const localContentRef = useRef<HTMLDivElement>(null);
  const contentRef = scrollRef || localContentRef;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!isMobile || !contentRef.current) return;

    const contentEl = contentRef.current;

    const handleWheel = (e: WheelEvent) => {
      const atBottom = contentEl.scrollHeight - contentEl.scrollTop <= contentEl.clientHeight + 1;
      const atTop = contentEl.scrollTop <= 0;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // If scrolling down and not at bottom, or scrolling up and not at top
      // then scroll the content and prevent page scroll
      if ((scrollingDown && !atBottom) || (scrollingUp && !atTop)) {
        e.preventDefault();
        e.stopPropagation();
        contentEl.scrollTop += e.deltaY;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      contentEl.dataset.touchStartY = touch.clientY.toString();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startY = parseFloat(contentEl.dataset.touchStartY || '0');
      const deltaY = startY - touch.clientY;

      const atBottom = contentEl.scrollHeight - contentEl.scrollTop <= contentEl.clientHeight + 1;
      const atTop = contentEl.scrollTop <= 0;
      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;

      if ((scrollingDown && !atBottom) || (scrollingUp && !atTop)) {
        e.preventDefault();
      }
    };

    contentEl.addEventListener('wheel', handleWheel, { passive: false });
    contentEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    contentEl.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      contentEl.removeEventListener('wheel', handleWheel);
      contentEl.removeEventListener('touchstart', handleTouchStart);
      contentEl.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile]);

  return (
    <div
      ref={contentRef}
      className="relative flex flex-col w-full md:w-[85%] xl:w-[60%] px-6 sm:px-8 md:px-10 lg:px-16 md:pt-16 lg:pt-18 pb-6 md:pb-48 lg:pb-52 ml-0 md:ml-[5%]"
      style={{
        opacity: contentOpacity,
        pointerEvents: contentOpacity < 0.3 ? "none" : "auto",
        // On mobile, position content in bottom 50vh
        position: isMobile ? 'absolute' : undefined,
        top: isMobile ? '50vh' : undefined,
        left: isMobile ? 0 : undefined,
        right: isMobile ? 0 : undefined,
        paddingTop: isMobile ? '16px' : undefined,
        paddingBottom: isMobile ? '16px' : undefined,
        minHeight: isMobile ? undefined : '100%',
        height: isMobile ? '50vh' : undefined,
        overflow: isMobile ? 'auto' : undefined,
        zIndex: 10,
      }}
    >
      <div className="mb-4 md:mb-5">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-1.5 md:mb-2 leading-tight"
          style={{
            fontFamily: "Georgia, serif",
            color: "#2C1810",
          }}
        >
          Compose your business like a painting
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl mt-1.5 md:mt-2"
          style={{
            fontFamily: "Georgia, serif",
            color: "#5A4A3A",
            fontStyle: "italic",
          }}
        >
          Every stroke deliberate. Every layer connected.
        </p>
      </div>

      <div className="space-y-2.5 md:space-y-3">
        <p
          className="text-sm sm:text-base md:text-lg leading-relaxed"
          style={{
            fontFamily: "Georgia, serif",
            color: "#3A3A3A",
          }}
        >
          We believe software should be as expressive as art. Not locked in
          rigid templates, not trapped in boxes someone else designed.
        </p>

        <p
          className="text-sm sm:text-base md:text-lg leading-relaxed"
          style={{
            fontFamily: "Georgia, serif",
            color: "#3A3A3A",
          }}
        >
          Sena is a canvas where your business takes shape—built from
          composable pieces that adapt to your vision, orchestrated by AI
          that understands your intent.
        </p>

        <div className="space-y-1.5 md:space-y-2 pt-1.5">
          <div className="flex items-start gap-2 md:gap-2.5">
            <span className="text-xs sm:text-sm md:text-base" style={{ fontFamily: "Georgia, serif", color: "#3A3A3A", lineHeight: "1.5" }}>•</span>
            <p
              className="text-xs sm:text-sm md:text-base flex-1"
              style={{
                fontFamily: "Georgia, serif",
                color: "#3A3A3A",
              }}
            >
              Start with primitives (databases, workflows, UI components) and combine them like brushstrokes
            </p>
          </div>
          <div className="flex items-start gap-2 md:gap-2.5">
            <span className="text-xs sm:text-sm md:text-base" style={{ fontFamily: "Georgia, serif", color: "#3A3A3A", lineHeight: "1.5" }}>•</span>
            <p
              className="text-xs sm:text-sm md:text-base flex-1"
              style={{
                fontFamily: "Georgia, serif",
                color: "#3A3A3A",
              }}
            >
              Describe what you need in natural language, and watch AI architect the solution
            </p>
          </div>
          <div className="flex items-start gap-2 md:gap-2.5">
            <span className="text-xs sm:text-sm md:text-base" style={{ fontFamily: "Georgia, serif", color: "#3A3A3A", lineHeight: "1.5" }}>•</span>
            <p
              className="text-xs sm:text-sm md:text-base flex-1"
              style={{
                fontFamily: "Georgia, serif",
                color: "#3A3A3A",
              }}
            >
              Let intelligent agents handle the mundane while you focus on what matters
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-gray-400/30">
          <div className="relative">
            <div className="absolute -top-5 md:-top-6 left-0 w-10 md:w-12 h-px bg-gradient-to-r from-gray-600/60 to-transparent"></div>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed"
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: "#4A3A2A",
                lineHeight: "1.7",
              }}
            >
              From CRM to invoicing, analytics to automation—your entire
              operating system, composed exactly as you envision it.
            </p>
          </div>
        </div>
      </div>

      <div className="md:absolute bottom-3 sm:bottom-4 md:bottom-5 left-4 right-4 sm:left-8 sm:right-8 md:left-10 md:right-auto lg:left-16 mt-6" style={{
        width: 'auto',
        maxWidth: 'min(800px, 85%)',
        position: isMobile ? 'relative' : undefined,
      }}>
        <div
          className="space-y-2 md:space-y-2.5 p-3 sm:p-4 md:p-5 rounded-lg md:rounded-xl"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <p
            className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold"
            style={{
              fontFamily: "Georgia, serif",
              color: "#6B5744",
              letterSpacing: "0.18em",
            }}
          >
            Built for creators, not corporations
          </p>
          <p
            className="text-xs sm:text-sm md:text-base leading-relaxed"
            style={{
              fontFamily: "Georgia, serif",
              color: "#2C1810",
              lineHeight: "1.6",
            }}
          >
            No rigid workflows. No endless configuration. No armies of
            consultants. Just you, your vision, and an intelligent system
            that grows with your imagination.
          </p>
          <div className="h-px bg-gray-400/40 w-full mt-2 md:mt-3"></div>
          <div className="flex items-center justify-between pt-1.5 md:pt-2">
            <p
              className="text-[10px] sm:text-xs md:text-sm"
              style={{
                fontFamily: "Georgia, serif",
                color: "#6B5744",
                fontStyle: "italic",
              }}
            >
              Begin composing your masterpiece
            </p>
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
