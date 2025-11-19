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
  const [isContentAtBottom, setIsContentAtBottom] = useState(false);
  const scrollAttemptRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const isManualScrollRef = useRef(false); // Flag to prevent double-scroll from arrow click

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile scroll exhaustion detection - detects when content reaches bottom and enables page scroll
  useEffect(() => {
    if (!isMobile || !contentRef.current) return;

    const element = contentRef.current;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isScrollingDown = false;
    let hasTriggeredTransition = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchCurrentY = touchStartY;
      hasTriggeredTransition = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;
      isScrollingDown = deltaY > 0; // Positive delta = scrolling down

      // Check if we're at bottom during the touch move
      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrollBottom = scrollTop + clientHeight;
      const isAtBottom = scrollBottom >= scrollHeight - 5;
      const isScrollable = scrollHeight > clientHeight;

      // If at bottom and trying to scroll down, prevent default and trigger transition
      if ((!isScrollable || isAtBottom) && isScrollingDown && !hasTriggeredTransition) {
        // Prevent rubber-band by stopping the event
        e.preventDefault();
        hasTriggeredTransition = true;

        // Immediately trigger smooth transition
        window.scrollBy({
          top: window.innerHeight * 0.5,
          behavior: 'smooth'
        });
      }
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrollBottom = scrollTop + clientHeight;
      const isAtBottom = scrollBottom >= scrollHeight - 5; // 5px threshold

      setIsContentAtBottom(isAtBottom);
      lastScrollTopRef.current = scrollTop;
    };

    const handleTouchEnd = () => {
      // Skip if arrow button was clicked or transition already triggered
      if (isManualScrollRef.current || hasTriggeredTransition) {
        isManualScrollRef.current = false;
        hasTriggeredTransition = false;
        return;
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false }); // NOT passive - need to preventDefault
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element?.removeEventListener('touchstart', handleTouchStart);
      element?.removeEventListener('touchmove', handleTouchMove);
      element?.removeEventListener('touchend', handleTouchEnd);
      element?.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, contentRef]);

  // Mobile: Hybrid approach - native scroll with smart exhaustion detection
  // Content scrolls first with momentum, then window takes over when exhausted

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
  const topPadding = isMobile ? 16 : getScaledValue(15);
  const bottomPadding = isMobile ? 120 : getScaledValue(77); // Large bottom padding on mobile to clear phone nav bar

  return (
    <div
      ref={contentRef}
      className="relative flex flex-col w-full md:w-[70%] xl:w-[54%] ml-0 md:ml-[5%]"
      style={{
        opacity: contentOpacity,
        pointerEvents: contentOpacity < 0.3 ? "none" : "auto",
        // On mobile, stay within the painting image bounds (respect 6px padding + 8px border radius)
        position: isMobile ? 'absolute' : undefined,
        top: isMobile ? '6px' : undefined, // Match painting's top padding
        left: isMobile ? '6px' : undefined, // Match painting's left padding
        right: isMobile ? '6px' : undefined, // Match painting's right padding
        paddingLeft: isMobile ? '24px' : getScaledValue(40),
        paddingRight: isMobile ? '24px' : getScaledValue(40),
        paddingTop: isMobile ? '50vh' : `${topPadding}px`, // 50vh padding = content shows in bottom half
        paddingBottom: `${bottomPadding}px`,
        minHeight: isMobile ? undefined : '100%',
        height: isMobile ? 'calc(100vh - 6px)' : undefined, // Height minus top padding to stay within bounds
        // Native scroll with iOS momentum - CONTAIN prevents stuck rubber-band
        overflow: isMobile ? 'scroll' : undefined,
        overflowY: isMobile ? 'scroll' : undefined,
        WebkitOverflowScrolling: isMobile ? 'touch' : undefined,
        overscrollBehavior: isMobile ? 'contain' : undefined, // CONTAIN: Prevents scroll chaining but no stuck rubber-band
        // Force iOS to recognize this as a scrollable area
        touchAction: isMobile ? 'pan-y' : undefined,
        zIndex: 10,
        // Match the painting's rounded corners
        borderTopLeftRadius: isMobile ? '8px' : undefined,
        borderTopRightRadius: isMobile ? '8px' : undefined,
      }}
    >
      <div style={{
        marginBottom: `${getScaledValue(15)}px`,
        paddingBottom: `${getScaledValue(15)}px`,
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${getScaledValue(8)}px`,
          marginBottom: `${getScaledValue(8)}px`
        }}>
          <img
            src="/logo.png"
            alt="Sena"
            style={{
              width: isMobile ? '32px' : `${getScaledValue(40)}px`,
              height: isMobile ? '32px' : `${getScaledValue(40)}px`,
              objectFit: 'contain',
              filter: 'brightness(0) saturate(100%) invert(52%) sepia(18%) saturate(645%) hue-rotate(357deg) brightness(92%) contrast(87%)'
            }}
          />
          <span style={{
            fontFamily: "Georgia, serif",
            fontSize: isMobile ? '0.875rem' : `${getScaledValue(16)}px`,
            color: "#8b7355",
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 600
          }}>
            Sena
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Tangerine', 'Edwardian Script ITC', 'Lucida Handwriting', cursive",
            color: isMobile ? "#5a4938" : "#8b7355",
            fontSize: isMobile ? '2.75rem' : `${getScaledValue(58)}px`,
            fontWeight: 700,
            letterSpacing: '0.015em',
            marginBottom: `${getScaledValue(8)}px`,
            lineHeight: 1.3,
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            textShadow: isMobile ? '0 3px 12px rgba(255, 255, 255, 1), 0 2px 8px rgba(255, 255, 255, 0.95), 0 1px 4px rgba(0, 0, 0, 0.3)' : undefined,
          }}
        >
          Compose your business like a painting
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            color: isMobile ? "#4a3d30" : "#8b7355",
            fontStyle: "normal",
            fontSize: isMobile ? '0.875rem' : `${getScaledValue(18)}px`,
            marginTop: `${getScaledValue(4)}px`,
            lineHeight: 1.5,
            letterSpacing: '0.02em',
            fontWeight: 500,
            textShadow: isMobile ? '0 2px 8px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(0, 0, 0, 0.25)' : undefined,
          }}
        >
          Craft your own ERP, from the ground up
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: `${getScaledValue(10)}px`, position: 'relative', marginTop: `${getScaledValue(15)}px`, paddingTop: `${getScaledValue(15)}px` }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isMobile ? '100px' : `${getScaledValue(200)}px`,
          height: '1px',
          background: 'linear-gradient(to right, rgba(139, 115, 85, 0.6), transparent)'
        }}></div>
        <p
          style={{
            fontFamily: "Georgia, serif",
            color: isMobile ? "#3d3226" : "#6b5d4f",
            fontSize: isMobile ? '0.8125rem' : `${getScaledValue(16)}px`,
            lineHeight: 1.6,
            fontWeight: isMobile ? 500 : 400,
            textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85), 0 1px 3px rgba(0, 0, 0, 0.2)' : undefined,
          }}
        >
          We believe your ERP should be a direct extension of how your business actually operates. Not locked into
          rigid templates, never trapped in boxes someone else designed.
        </p>

        <p
          style={{
            fontFamily: "Georgia, serif",
            color: isMobile ? "#3d3226" : "#6b5d4f",
            fontSize: isMobile ? '0.8125rem' : `${getScaledValue(16)}px`,
            lineHeight: 1.6,
            fontWeight: isMobile ? 500 : 400,
            textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85), 0 1px 3px rgba(0, 0, 0, 0.2)' : undefined,
          }}
        >
          Sena is where that system is assembled from modular pieces: data models, workflows, interfaces, and AI agents,
          all wired into the tools your team already uses.

        </p>

        <p
          style={{
            fontFamily: "Georgia, serif",
            color: isMobile ? "#3d3226" : "#6b5d4f",
            fontSize: isMobile ? '0.8125rem' : `${getScaledValue(16)}px`,
            lineHeight: 1.6,
            fontWeight: isMobile ? 500 : 400,
            textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85), 0 1px 3px rgba(0, 0, 0, 0.2)' : undefined,
          }}
        >
          Choose from a marketplace of pre-built environments to jumpstart your build, or generate exactly what you need in real-time—on request.
        </p>

        <div style={{ marginTop: `${getScaledValue(15)}px`, paddingTop: `${getScaledValue(15)}px`, position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: isMobile ? '100px' : `${getScaledValue(200)}px`,
            height: '1px',
            background: 'linear-gradient(to left, rgba(139, 115, 85, 0.6), transparent)'
          }}></div>
        </div>
      </div>
{/* footer */}
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
            gap: `${getScaledValue(9)}px`,
            padding: isMobile ? '12px' : `${getScaledValue(16)}px`,
            borderRadius: isMobile ? '8px' : `${getScaledValue(12)}px`,
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
              color: "#6b5d4f",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(16)}px`,
              lineHeight: 1.6,
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
              className="text-gray-600 animate-bounce cursor-pointer"
              style={{ width: `${getScaledValue(17)}px`, height: `${getScaledValue(17)}px` }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              onClick={() => {
                if (isMobile) {
                  // Set flag to prevent double-scroll from touch handler
                  isManualScrollRef.current = true;
                  // Mobile: Smooth scroll down (same effect as scroll exhaustion)
                  window.scrollBy({
                    top: window.innerHeight * 0.5,
                    behavior: 'smooth'
                  });
                } else {
                  // Desktop: Trigger the animation sequence
                  window.dispatchEvent(new CustomEvent('triggerScrollAnimation'));
                }
              }}
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
