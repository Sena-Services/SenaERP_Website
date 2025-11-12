"use client";

import { useEffect, useRef, useState } from "react";
import FlipCard from "./FlipCard";
import IntroContent from "./IntroContent";

const SHRINK_SCROLL_DISTANCE = 900;
const SPLIT_SCROLL_DISTANCE = 400; // Distance to split into 3 cards
const ROTATE_SCROLL_DISTANCE = 800; // Distance to flip cards 180 degrees
const EXTRA_HOLD_DISTANCE = 340;

type ExpandedCard = "left" | "center" | "right" | null;

export default function IntroSection() {
  // Add keyframe animation for content
  if (typeof document !== 'undefined' && !document.getElementById('intro-animations')) {
    const style = document.createElement('style');
    style.id = 'intro-animations';
    style.textContent = `
      @keyframes slideInContent {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [splitProgress, setSplitProgress] = useState(0);
  const [rotateProgress, setRotateProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);
  const [animationLocked, setAnimationLocked] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent page scroll on mobile when content is not fully scrolled
  useEffect(() => {
    if (viewportWidth >= 768) return; // Only for mobile

    let touchStartY = 0;

    const preventPageScroll = (e: WheelEvent) => {
      const contentEl = contentScrollRef.current;
      if (!contentEl) return;

      const atBottom = contentEl.scrollHeight - contentEl.scrollTop <= contentEl.clientHeight + 1;
      const atTop = contentEl.scrollTop <= 1;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // If in intro section (all animations at 0)
      if (scrollProgress === 0 && splitProgress === 0 && rotateProgress === 0) {
        // Scrolling down: prevent page scroll if content not at bottom
        if (scrollingDown && !atBottom) {
          e.preventDefault();
          contentEl.scrollTop += e.deltaY;
        }
        // Scrolling up: prevent page scroll if content not at top
        else if (scrollingUp && !atTop) {
          e.preventDefault();
          contentEl.scrollTop += e.deltaY;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const contentEl = contentScrollRef.current;
      if (!contentEl) return;

      const touchCurrentY = e.touches[0].clientY;
      const touchDeltaY = touchStartY - touchCurrentY;
      const atBottom = contentEl.scrollHeight - contentEl.scrollTop <= contentEl.clientHeight + 1;
      const atTop = contentEl.scrollTop <= 1;
      const scrollingDown = touchDeltaY > 0;
      const scrollingUp = touchDeltaY < 0;

      // If in intro section (all animations at 0)
      if (scrollProgress === 0 && splitProgress === 0 && rotateProgress === 0) {
        // Scrolling down: prevent page scroll if content not at bottom, and scroll content instead
        if (scrollingDown && !atBottom) {
          e.preventDefault();
          // Scroll the content container programmatically
          const scrollAmount = touchStartY - touchCurrentY;
          contentEl.scrollTop = Math.max(0, contentEl.scrollTop + scrollAmount * 0.5);
          touchStartY = touchCurrentY; // Update for continuous scrolling
        }
        // Scrolling up: prevent page scroll if content not at top, and scroll content instead
        else if (scrollingUp && !atTop) {
          e.preventDefault();
          // Scroll the content container programmatically
          const scrollAmount = touchStartY - touchCurrentY;
          contentEl.scrollTop = Math.max(0, contentEl.scrollTop + scrollAmount * 0.5);
          touchStartY = touchCurrentY; // Update for continuous scrolling
        }
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', preventPageScroll, { passive: false });
      section.addEventListener('touchstart', handleTouchStart, { passive: true });
      section.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => {
        section.removeEventListener('wheel', preventPageScroll);
        section.removeEventListener('touchstart', handleTouchStart);
        section.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [viewportWidth, scrollProgress, splitProgress, rotateProgress]);

  // Listen for homeLeft event to lock animations
  useEffect(() => {
    const handleHomeLocked = () => {
      setAnimationLocked(true);
    };

    const handleHomeUnlocked = () => {
      setAnimationLocked(false);
    };

    window.addEventListener('homeLeft', handleHomeLocked);
    window.addEventListener('homeUnlocked', handleHomeUnlocked);
    return () => {
      window.removeEventListener('homeLeft', handleHomeLocked);
      window.removeEventListener('homeUnlocked', handleHomeUnlocked);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      // On mobile, disable all scroll animations
      if (viewportWidth < 768) {
        setScrollProgress(0);
        setSplitProgress(0);
        setRotateProgress(0);
        return;
      }

      // If animation is locked, keep everything at final state
      if (animationLocked) {
        setScrollProgress(1);
        setSplitProgress(1);
        setRotateProgress(1);
        return;
      }

      const sectionTop = section.offsetTop;
      const scrollY = window.scrollY;
      const totalDistance = scrollY - sectionTop;

      // Phase 1: Shrink animation (0-900px)
      const shrinkDistance = Math.min(
        Math.max(totalDistance, 0),
        SHRINK_SCROLL_DISTANCE
      );
      setScrollProgress(shrinkDistance / SHRINK_SCROLL_DISTANCE);

      // Phase 3: Rotate animation (1300-2100px)
      const rotateDistance = Math.min(
        Math.max(totalDistance - SHRINK_SCROLL_DISTANCE - SPLIT_SCROLL_DISTANCE, 0),
        ROTATE_SCROLL_DISTANCE
      );
      const rawRotateProgress = rotateDistance / ROTATE_SCROLL_DISTANCE;
      setRotateProgress(rawRotateProgress);

      // Phase 2: Split animation (900-1300px)
      // IMPORTANT: When going reverse, only join cards AFTER rotation completes (rotateProgress = 0)
      const splitDistance = Math.min(
        Math.max(totalDistance - SHRINK_SCROLL_DISTANCE, 0),
        SPLIT_SCROLL_DISTANCE
      );
      const rawSplitProgress = splitDistance / SPLIT_SCROLL_DISTANCE;

      // If we're in the rotate phase (rawRotateProgress > 0), keep cards fully split
      // Only allow join when rotation is done
      const actualSplitProgress = rawRotateProgress > 0 ? 1 : rawSplitProgress;
      setSplitProgress(actualSplitProgress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animationLocked, viewportWidth]);

  // Responsive scaling: only scale up when viewport HEIGHT > 1200px
  const getResponsiveValue = (baseValue: number) => {
    const baseScreenHeight = 1200;
    if (viewportHeight <= baseScreenHeight) {
      return baseValue;
    }
    // Scale proportionally for screens taller than 1200px
    const scaleFactor = viewportHeight / baseScreenHeight;
    return baseValue * scaleFactor;
  };

  // Match BuilderTabbed and other components: min(1600px, calc(100vw - 200px))
  const maxContainerWidth = 1600;
  const viewportPadding = 200; // Matching Builder's calc(100vw - 200px)

  // Account for card gaps - subtract the max gap width from target to match Builder exactly
  const maxCardGapTotal = 12; // responsiveMaxGap (6) * 2 gaps
  const responsiveTargetWidth = Math.min(maxContainerWidth, viewportWidth - viewportPadding) - maxCardGapTotal;
  const targetWidth = responsiveTargetWidth;

  // On mobile, make it full width with no margins
  const startWidth = viewportWidth < 768 ? viewportWidth : Math.max(viewportWidth * 0.95, targetWidth);
  const currentWidthValue =
    startWidth - (startWidth - targetWidth) * scrollProgress;
  const currentWidth =
    viewportWidth === 0 ? "95vw" : `${currentWidthValue}px`;

  // On mobile, make the card full height to fill the entire screen
  const startHeight = viewportWidth < 768 ? viewportHeight : viewportHeight * 0.92;
  const responsiveMinHeight = getResponsiveValue(600);
  const targetHeight = Math.max(viewportHeight * 0.75, responsiveMinHeight);
  const currentHeightValue =
    startHeight - (startHeight - targetHeight) * scrollProgress;
  const currentHeight =
    viewportHeight === 0 ? (viewportWidth < 768 ? "100vh" : "92vh") : `${currentHeightValue}px`;

  const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
  const responsiveBorderRadius = getResponsiveValue(32) + scrollProgress * getResponsiveValue(16);
  // On mobile, no border radius for full-screen effect
  const borderRadius = viewportWidth < 768 ? 0 : responsiveBorderRadius;
  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.2);
  const elevation =
    scrollProgress < 1
      ? "0 20px 60px -12px rgba(0, 0, 0, 0.15)"
      : "0 12px 32px -10px rgba(0, 0, 0, 0.12)";

  // On mobile, use normal height instead of extended scrolling height
  const sectionHeight = viewportWidth < 768
    ? 'auto'
    : startHeight + SHRINK_SCROLL_DISTANCE + SPLIT_SCROLL_DISTANCE + ROTATE_SCROLL_DISTANCE + EXTRA_HOLD_DISTANCE;
  const stickyFrameHeight = viewportHeight;

  // Calculate proper centering to place card perfectly in viewport
  // During initial phase (scrollProgress < 1), center the card
  // After shrinking is done (scrollProgress >= 1), add extra top padding for "How it works" title and navbar
  const navbarHeight = getResponsiveValue(90); // Space for navbar
  const titleHeight = getResponsiveValue(120); // Space for "How it works?" title + subtitle
  const topSpaceNeeded = navbarHeight + titleHeight;

  // On mobile, use NO padding for true full-screen effect
  const centeredPadding = viewportWidth < 768
    ? 0 // ZERO padding on mobile for full-screen
    : Math.max(
        getResponsiveValue(16),
        (viewportHeight - currentHeightValue) / 2
      );

  // Gradually shift down as we complete the shrink phase
  const shiftProgress = Math.max(0, scrollProgress - 0.7) / 0.3; // Start shifting at 70% shrink
  const heroPaddingTop = centeredPadding + (topSpaceNeeded - centeredPadding) * shiftProgress;

  // Split animation calculations with responsive scaling
  const responsiveMaxGap = getResponsiveValue(6); // Further reduced gap to bring cards closer together
  const cardGap = splitProgress * responsiveMaxGap; // Responsive max gap between cards

  // IMPORTANT: When split, constrain to max-w-7xl (1280px) like other sections
  // The cards container should never exceed 1280px when split
  // Use full width when not split (splitProgress === 0), constrained width when split
  const widthForCardCalculation = splitProgress > 0
    ? Math.min(currentWidthValue, maxContainerWidth)
    : currentWidthValue;
  const cardWidth = (widthForCardCalculation - cardGap * 2) / 3; // Divide width into 3 equal parts

  // Calculate image offsets based on ZERO gap so painting doesn't shift
  const baseCardWidth = currentWidthValue / 3; // Card width when gap = 0

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <section
        id="intro"
        className="relative w-full bg-waygent-cream"
        style={{ minHeight: '100vh' }}
      />
    );
  }

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="relative w-full bg-waygent-cream"
      style={{
        height: viewportWidth < 768 ? sectionHeight : `${sectionHeight}px`,
      }}
    >
      <div
        className="flex items-start justify-center w-full"
        style={{
          position: viewportWidth < 768 ? 'relative' : 'sticky',
          top: viewportWidth < 768 ? undefined : '0px',
          height: viewportWidth < 768 ? 'auto' : `${stickyFrameHeight}px`,
          paddingTop: viewportWidth < 768 ? '0' : `${heroPaddingTop}px`,
          paddingLeft: viewportWidth < 768 ? '0' : undefined,
          paddingRight: viewportWidth < 768 ? '0' : undefined,
        }}
      >
        <div
          className={viewportWidth < 768 ? "relative" : "relative mx-auto"}
          style={{
            width: currentWidth,
            maxWidth: splitProgress > 0 ? `${maxContainerWidth}px` : (viewportWidth < 768 ? "100vw" : "95vw"),
            height: viewportWidth < 768 ? 'auto' : currentHeight,
            minHeight: viewportWidth < 768 ? '100vh' : undefined,
            background: viewportWidth < 768 ? '#F5F0E6' : undefined,
          }}
        >
          {/* Mobile painting at the top */}
          {viewportWidth < 768 && splitProgress === 0 && rotateProgress === 0 && scrollProgress === 0 && (
            <div
              className="w-full overflow-hidden"
              style={{
                height: '100vh',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <img
                src="/illustrations/monet-intro.png"
                alt="Monet painting background"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: '88% 50%',
                  opacity: 0.80,
                }}
              />
            </div>
          )}

          {/* Anchor for "how-it-works" section at the rotated position */}
          <div id="how-it-works" className="absolute" style={{ top: `-${getResponsiveValue(140)}px` }} />

          {/* Back button - positioned at the very left, above the card */}
          {expandedCard && (
            <button
              onClick={() => setExpandedCard(null)}
              className="absolute flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-all group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
              style={{
                left: '0',
                top: `${-getResponsiveValue(140)}px`,
                zIndex: 1000,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:-translate-x-1">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-medium">Back</span>
            </button>
          )}

          {/* Title that appears when card shrinks (before split) */}
          <div
            className="absolute left-0 right-0 z-10"
            style={{
              top: `${-getResponsiveValue(140)}px`,
              opacity: scrollProgress,
              pointerEvents: scrollProgress > 0.9 ? "auto" : "none",
            }}
          >
            {/* Home button - positioned at the very left */}
            {rotateProgress === 1 && (
              <button
                onClick={() => {
                  // Trigger reverse animation back to intro
                  window.dispatchEvent(new CustomEvent('resetHome'));
                }}
                className="absolute flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 transition-all group cursor-pointer hover:bg-gray-100/50"
                style={{
                  left: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '2px solid rgba(156, 163, 175, 0.3)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-all group-hover:scale-110">
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Heading - centered */}
            <div className="text-center">
              <h2
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#2C1810",
                  fontSize: `${getResponsiveValue(60)}px`,
                  marginBottom: `${getResponsiveValue(4)}px`,
                }}
              >
                How it <span style={{ fontStyle: "italic" }}>works</span>?
              </h2>
              <p
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: 500,
                  fontSize: `${getResponsiveValue(16)}px`,
                  color: "#4B5563",
                  letterSpacing: "-0.01em",
                }}
              >
                Three simple steps. Click each card to explore.
              </p>
            </div>
          </div>

          {/* Always show 3 cards, but when splitProgress = 0, they're flush together with no gap */}
          <div
            className="relative w-full h-full flex items-center transition-all duration-700 ease-out"
            style={{
              gap: `${cardGap}px`,
              filter: 'none',
              perspective: "2000px",
              justifyContent: expandedCard === 'right' ? 'flex-end' : (expandedCard ? 'flex-start' : 'center'),
              paddingLeft: expandedCard && expandedCard !== 'right' ? '80px' : '0',
              paddingRight: expandedCard === 'right' ? '80px' : '0',
            }}
          >
            <FlipCard
              cardWidth={cardWidth}
              currentWidthValue={currentWidthValue}
              cardGap={cardGap}
              borderRadius={borderRadius}
              elevation={elevation}
              splitProgress={splitProgress}
              rotateProgress={rotateProgress}
              position="left"
              imageOffset={0}
              videoSrc="/videos/card1.mp4"
              videoBg="bg-[#f6efe4]"
              videoPosition="center 40%"
              cardNumber={1}
              cardTitle="Talk to Sena"
              cardDescription="Share your workflows, challenges, and goals. Sena asks the right questions to understand exactly what you need—no technical jargon required."
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "left" ? null : "left")}
            />

            <FlipCard
              cardWidth={cardWidth}
              currentWidthValue={currentWidthValue}
              cardGap={cardGap}
              borderRadius={borderRadius}
              elevation={elevation}
              splitProgress={splitProgress}
              rotateProgress={rotateProgress}
              position="center"
              imageOffset={-baseCardWidth}
              videoSrc="/videos/card2.mp4"
              videoBg="bg-[#f5f2e9]"
              videoPosition="center 45%"
              cardNumber={2}
              cardTitle="Review & Refine"
              cardDescription="Walk through every table, workflow, and interface Sena built for you. Make changes, ask questions, and ensure it's exactly right."
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "center" ? null : "center")}
            />

            <FlipCard
              cardWidth={cardWidth}
              currentWidthValue={currentWidthValue}
              cardGap={cardGap}
              borderRadius={borderRadius}
              elevation={elevation}
              splitProgress={splitProgress}
              rotateProgress={rotateProgress}
              position="right"
              imageOffset={-baseCardWidth * 2}
              videoSrc="/videos/card3.mp4"
              videoBg="bg-[#f6f2fb]"
              videoPosition="center 80%"
              cardNumber={3}
              cardTitle="Go Live"
              cardDescription="One click and your custom ERP is live. Your team can start using it immediately—no setup, no installation, no complexity."
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "right" ? null : "right")}
            />
          </div>

          {/* Expanded content - displayed in background */}
          {expandedCard && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transition: 'opacity 600ms ease-out',
                opacity: expandedCard ? 1 : 0,
              }}
            >
              {/* Content area positioned to the right or left depending on which card is expanded */}
              <div
                className={`absolute h-full flex items-center px-12 pointer-events-auto ${
                  expandedCard === 'right' ? 'left-0' : 'right-0'
                }`}
                style={{
                  width: '45%',
                  transform: expandedCard
                    ? 'translateX(0) scale(1)'
                    : expandedCard === 'right' ? 'translateX(-40px) scale(0.95)' : 'translateX(40px) scale(0.95)',
                  transition: 'all 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: expandedCard ? 1 : 0,
                }}
              >
                <div
                  className="w-full max-w-xl"
                  style={{
                    animation: expandedCard ? 'slideInContent 700ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                  }}
                >

                  {/* Content based on which card is expanded */}
                  {expandedCard === "left" && (
                    <div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        Talk to Sena
                      </h2>
                      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                        Sena is your AI co-founder who helps you build custom ERP systems through natural conversation.
                        Choose between Discovery Mode for collaborative exploration or Express Mode for direct control.
                      </p>

                      <div className="space-y-8">
                        <div>
                          <h3 className="text-2xl font-bold text-blue-700 mb-3">Discovery Mode (Voice)</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            Have a natural conversation with Sena in your preferred language. She'll ask insightful questions
                            like a co-founder or analyst to deeply understand your operations.
                          </p>
                          <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Multilingual voice conversations in 50+ languages</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Proactive questioning to uncover hidden requirements</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Deep understanding of your business processes</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Collaborative requirement building</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-blue-700 mb-3">Express Mode (Text)</h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            Know exactly what you want? Use Express Mode to tell Sena your requirements directly
                            and get instant results without back-and-forth.
                          </p>
                          <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Direct text-based interface for precise control</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Specify exact requirements and features</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Instant system generation</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">Zero unnecessary conversation</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {expandedCard === "center" && (
                    <div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        Review & Refine
                      </h2>
                      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                        Walk through every detail of your system before going live. Make changes, ask questions,
                        and iterate in real-time until everything is exactly right.
                      </p>

                      <div className="space-y-5">
                        <div className="border-l-4 border-blue-500 pl-5 py-3">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Visual Preview</h4>
                          <p className="text-gray-600">See exactly how your system looks and works before deployment</p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-5 py-3">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Interactive Editing</h4>
                          <p className="text-gray-600">Click to edit any table, workflow, or interface element</p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-5 py-3">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Real-Time Updates</h4>
                          <p className="text-gray-600">See changes instantly as you make modifications</p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-5 py-3">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Unlimited Iterations</h4>
                          <p className="text-gray-600">Refine and perfect your system with no limits</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {expandedCard === "right" && (
                    <div>
                      <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        Go Live
                      </h2>
                      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                        One click and your custom ERP is live. Your team can start using it immediately
                        with no setup, installation, or technical complexity.
                      </p>

                      <div className="space-y-5">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Instant Deployment</h4>
                          <p className="text-gray-700">Deploy to production with a single click - no DevOps required</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Immediate Access</h4>
                          <p className="text-gray-700">Your team gets instant access - just share the link</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Cloud Infrastructure</h4>
                          <p className="text-gray-700">Fully managed, scalable cloud hosting included</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">Enterprise Security</h4>
                          <p className="text-gray-700">Bank-level security, compliance, and data protection</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content overlay - only visible when fully back in intro state */}
          <div
            className="absolute inset-0"
            style={{
              // Only show content when ALL animations are complete:
              // - cards are joined (splitProgress === 0)
              // - rotation done (rotateProgress === 0)
              // - cards fully expanded back (scrollProgress === 0)
              opacity: splitProgress === 0 && rotateProgress === 0 && scrollProgress === 0 ? contentOpacity : 0,
              transition: "opacity 600ms ease-out 200ms",
              pointerEvents: splitProgress === 0 && rotateProgress === 0 && scrollProgress === 0 ? "auto" : "none",
              zIndex: splitProgress === 0 && rotateProgress === 0 && scrollProgress === 0 ? 10 : -1,
            }}
          >
            <IntroContent contentOpacity={1} scrollRef={contentScrollRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
