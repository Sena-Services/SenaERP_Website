"use client";

import { useState, useEffect, useRef } from 'react';

type IntroContentProps = {
  contentOpacity: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

export default function IntroContent({ contentOpacity, scrollRef }: IntroContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(900);
  const localContentRef = useRef<HTMLDivElement>(null);
  const contentRef = scrollRef || localContentRef;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile: No JavaScript event interception!
  // Let browser handle all scroll physics naturally for smooth momentum

  // Scale content based on viewport height - fill space while staying responsive
  const getScaledValue = (baseValue: number) => {
    if (isMobile) return baseValue;
    // For laptop/tablet screens, scale proportionally
    // Base height: 910px (middle ground for better balance)
    // This ensures we fill the space on normal screens but scale down on smaller ones
    const heightRatio = viewportHeight / 910;
    return baseValue * heightRatio;
  };

  // Calculate responsive padding values - middle ground
  const topPadding = isMobile ? 16 : getScaledValue(50);
  const bottomPadding = isMobile ? 16 : getScaledValue(77);

  return (
    <div
      ref={contentRef}
      className="relative flex flex-col w-full md:w-[70%] xl:w-[54%] ml-0 md:ml-[5%]"
      style={{
        opacity: contentOpacity,
        pointerEvents: contentOpacity < 0.3 ? "none" : "auto",
        // On mobile, cover ENTIRE viewport to capture all touches, padding pushes content down
        position: isMobile ? 'absolute' : undefined,
        top: isMobile ? 0 : undefined,
        left: isMobile ? 0 : undefined,
        right: isMobile ? 0 : undefined,
        paddingLeft: isMobile ? '24px' : getScaledValue(40),
        paddingRight: isMobile ? '24px' : getScaledValue(40),
        paddingTop: isMobile ? '50vh' : `${topPadding}px`, // 50vh padding = content shows in bottom half
        paddingBottom: `${bottomPadding}px`,
        minHeight: isMobile ? undefined : '100%',
        height: isMobile ? '100vh' : undefined, // FIXED height = 100vh to contain scroll
        // Native scroll with iOS momentum and elastic overscroll
        overflow: isMobile ? 'scroll' : undefined,
        overflowY: isMobile ? 'scroll' : undefined,
        WebkitOverflowScrolling: isMobile ? 'touch' : undefined,
        overscrollBehavior: isMobile ? 'auto' : undefined, // Allow elastic bounce effect
        // Force iOS to recognize this as a scrollable area
        touchAction: isMobile ? 'pan-y' : undefined,
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: `${getScaledValue(23)}px` }}>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            color: "#2C1810",
            fontSize: isMobile ? '1.5rem' : `${getScaledValue(46)}px`,
            fontWeight: 'bold',
            letterSpacing: '-0.02em',
            marginBottom: `${getScaledValue(11)}px`,
            lineHeight: 1.15,
          }}
        >
          Compose your business like a painting
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            color: "#5A4A3A",
            fontStyle: "italic",
            fontSize: isMobile ? '1rem' : `${getScaledValue(21)}px`,
            marginTop: `${getScaledValue(7)}px`,
          }}
        >
          Every stroke deliberate. Every layer connected.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: `${getScaledValue(15)}px` }}>
        <p
          style={{
            fontFamily: "Georgia, serif",
            color: "#3A3A3A",
            fontSize: isMobile ? '0.875rem' : `${getScaledValue(18)}px`,
            lineHeight: 1.6,
          }}
        >
          We believe software should be as expressive as art. Not locked in
          rigid templates, not trapped in boxes someone else designed.
        </p>

        <p
          style={{
            fontFamily: "Georgia, serif",
            color: "#3A3A3A",
            fontSize: isMobile ? '0.875rem' : `${getScaledValue(18)}px`,
            lineHeight: 1.6,
          }}
        >
          Sena is a canvas where your business takes shape—built from
          composable pieces that adapt to your vision, orchestrated by AI
          that understands your intent.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: `${getScaledValue(9)}px`, paddingTop: `${getScaledValue(7)}px` }}>
          <div className="flex items-start" style={{ gap: `${getScaledValue(9)}px` }}>
            <span style={{ fontFamily: "Georgia, serif", color: "#3A3A3A", fontSize: isMobile ? '0.75rem' : `${getScaledValue(16)}px`, lineHeight: "1.6" }}>•</span>
            <p
              className="flex-1"
              style={{
                fontFamily: "Georgia, serif",
                color: "#3A3A3A",
                fontSize: isMobile ? '0.75rem' : `${getScaledValue(16)}px`,
                lineHeight: 1.6,
              }}
            >
              Start with primitives (databases, workflows, UI components) and combine them like brushstrokes
            </p>
          </div>
          <div className="flex items-start" style={{ gap: `${getScaledValue(9)}px` }}>
            <span style={{ fontFamily: "Georgia, serif", color: "#3A3A3A", fontSize: isMobile ? '0.75rem' : `${getScaledValue(16)}px`, lineHeight: "1.6" }}>•</span>
            <p
              className="flex-1"
              style={{
                fontFamily: "Georgia, serif",
                color: "#3A3A3A",
                fontSize: isMobile ? '0.75rem' : `${getScaledValue(16)}px`,
                lineHeight: 1.6,
              }}
            >
              Describe what you need in natural language, and watch AI architect the solution
            </p>
          </div>
          <div className="flex items-start" style={{ gap: `${getScaledValue(9)}px` }}>
            <span style={{ fontFamily: "Georgia, serif", color: "#3A3A3A", fontSize: isMobile ? '0.75rem' : `${getScaledValue(16)}px`, lineHeight: "1.6" }}>•</span>
            <p
              className="flex-1"
              style={{
                fontFamily: "Georgia, serif",
                color: "#3A3A3A",
                fontSize: isMobile ? '0.75rem' : `${getScaledValue(16)}px`,
                lineHeight: 1.6,
              }}
            >
              Let intelligent agents handle the mundane while you focus on what matters
            </p>
          </div>
        </div>

        <div style={{ marginTop: `${getScaledValue(19)}px`, paddingTop: `${getScaledValue(15)}px` }} className="border-t border-gray-400/30">
          <div className="relative">
            <div style={{
              position: 'absolute',
              top: `${getScaledValue(-23)}px`,
              left: 0,
              width: isMobile ? '40px' : `${getScaledValue(54)}px`,
              height: '1px',
              background: 'linear-gradient(to right, rgba(107, 114, 128, 0.6), transparent)'
            }}></div>
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: "#4A3A2A",
                fontSize: isMobile ? '0.875rem' : `${getScaledValue(18)}px`,
                lineHeight: 1.6,
              }}
            >
              From CRM to invoicing, analytics to automation—your entire
              operating system, composed exactly as you envision it.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        position: isMobile ? 'relative' : 'absolute',
        bottom: isMobile ? undefined : `${getScaledValue(19)}px`,
        left: isMobile ? undefined : getScaledValue(40),
        right: isMobile ? undefined : 'auto',
        marginTop: isMobile ? '24px' : undefined,
        width: 'auto',
        maxWidth: isMobile ? '100%' : 'min(900px, 90%)',
      }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${getScaledValue(11)}px`,
            padding: isMobile ? '12px' : `${getScaledValue(22)}px`,
            borderRadius: isMobile ? '8px' : `${getScaledValue(15)}px`,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              color: "#6B5744",
              fontSize: isMobile ? '10px' : `${getScaledValue(12.5)}px`,
              textTransform: 'uppercase',
              letterSpacing: "0.18em",
              fontWeight: 600,
            }}
          >
            Built for creators, not corporations
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              color: "#2C1810",
              fontSize: isMobile ? '0.75rem' : `${getScaledValue(16)}px`,
              lineHeight: 1.58,
            }}
          >
            No rigid workflows. No endless configuration. No armies of
            consultants. Just you, your vision, and an intelligent system
            that grows with your imagination.
          </p>
          <div className="h-px bg-gray-400/40 w-full" style={{ marginTop: `${getScaledValue(7)}px` }}></div>
          <div className="flex items-center justify-between" style={{ paddingTop: `${getScaledValue(7)}px` }}>
            <p
              style={{
                fontFamily: "Georgia, serif",
                color: "#6B5744",
                fontStyle: "italic",
                fontSize: isMobile ? '10px' : `${getScaledValue(13.5)}px`,
              }}
            >
              Begin composing your masterpiece
            </p>
            <svg
              className="text-gray-600 animate-bounce"
              style={{ width: `${getScaledValue(17)}px`, height: `${getScaledValue(17)}px` }}
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
