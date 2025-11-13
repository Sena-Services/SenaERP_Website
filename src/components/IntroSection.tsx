"use client";

import { useEffect, useRef, useState } from "react";
import FlipCard from "./FlipCard";
import IntroContent from "./IntroContent";

const SHRINK_SCROLL_DISTANCE = 900;
const SPLIT_SCROLL_DISTANCE = 400; // Distance to split into 3 cards
const ROTATE_SCROLL_DISTANCE = 800; // Distance to flip cards 180 degrees
const EXTRA_HOLD_DISTANCE = 50; // Minimal hold to ensure animations complete, then scroll continues

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [splitProgress, setSplitProgress] = useState(0);
  const [rotateProgress, setRotateProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);
  const [animationLocked, setAnimationLocked] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile: Native scrolling with smooth momentum
  // Content scrolls first, then page scrolls when content is at bottom

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

  // Responsive scaling: scale down aggressively for low heights, scale up for tall screens
  const getResponsiveValue = (baseValue: number) => {
    const baseScreenHeight = 1200;

    // Aggressive scaling down for very low-height screens (600px and below)
    if (viewportHeight <= 600) {
      const scaleFactor = 0.4;
      return baseValue * scaleFactor;
    }
    // Gradual scaling for low to medium heights (600-1200px)
    else if (viewportHeight <= baseScreenHeight) {
      // Smooth gradual scale from 0.4x at 600px to 1x at 1200px
      const scaleFactor = 0.4 + ((viewportHeight - 600) / (baseScreenHeight - 600)) * 0.6;
      return baseValue * scaleFactor;
    }
    // Scale up proportionally for screens taller than 1200px
    const scaleFactor = viewportHeight / baseScreenHeight;
    return baseValue * scaleFactor;
  };

  // Match BuilderTabbed and other components: min(1280px, calc(100vw - 320px))
  const maxContainerWidth = 1280;
  const viewportPadding = 320; // Matching Builder's calc(100vw - 320px)

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
  // Gradually decrease height multiplier as screen gets taller
  // At 720px: 0.78, at 900px: 0.75, smoothly transitions between
  const heightMultiplier = viewportHeight <= 720
    ? 0.78
    : viewportHeight >= 900
      ? 0.75
      : 0.78 - ((viewportHeight - 720) / (900 - 720)) * 0.03;
  const targetHeight = Math.max(viewportHeight * heightMultiplier, responsiveMinHeight);
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

  // Add extra top space to push cards down as height increases
  // Gradually adjust space based on viewport height
  let extraTopSpace = 0;
  if (viewportHeight <= 720) {
    extraTopSpace = getResponsiveValue(60);
  } else if (viewportHeight <= 1000) {
    // Gradually reduce from 60 to 30 between 720px and 1000px
    extraTopSpace = getResponsiveValue(60 - ((viewportHeight - 720) / (1000 - 720)) * 30);
  } else {
    // Keep some space for screens above 1000px
    extraTopSpace = getResponsiveValue(30);
  }
  const topSpaceNeeded = navbarHeight + titleHeight + extraTopSpace;

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

          {/* Title that appears when card shrinks (before split) - keep showing even when card is expanded */}
          <div
            className="absolute left-0 right-0 z-10"
            style={{
              top: `${-getResponsiveValue(140)}px`,
              opacity: expandedCard ? 1 : scrollProgress, // Keep visible when expanded
              pointerEvents: (scrollProgress > 0.9 || expandedCard) ? "auto" : "none", // Make interactive when expanded
            }}
          >
            {/* Home/Back button - positioned at the very left */}
            {rotateProgress === 1 && (
              <button
                onClick={() => {
                  if (expandedCard) {
                    // When expanded, go back to cards view
                    setExpandedCard(null);
                  } else {
                    // When not expanded, go back to intro
                    window.dispatchEvent(new CustomEvent('resetHome'));
                  }
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
                {expandedCard ? (
                  // Back arrow when card is expanded
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:-translate-x-1">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  // Home icon when not expanded
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-all group-hover:scale-110">
                    <path
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
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
                  fontSize: `${getResponsiveValue(72)}px`,
                }}
              >
                How it <span style={{ fontStyle: "italic" }}>works</span>?
              </h2>
            </div>
          </div>

          {/* Always show 3 cards, but when splitProgress = 0, they're flush together with no gap */}
          <div
            id="cards-container"
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

          {/* Expanded content - positioned INSIDE cards container to match card height exactly */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              bottom: 0,
              left: expandedCard && expandedCard !== 'right' ? '80px' : '0', // Match card's paddingLeft
              right: expandedCard === 'right' ? '80px' : '0', // Match card's paddingRight
              transition: 'opacity 600ms ease-out',
              opacity: expandedCard ? 1 : 0,
              pointerEvents: 'none', // Always keep parent as pointer-events-none so card can receive hover
            }}
          >
            {expandedCard && (
              <div
                className={`absolute pointer-events-auto flex items-center`}
                style={{
                  width: '48%',
                  height: `${currentHeightValue}px`, // EXACT same height as the card
                  top: '50%',
                  transform: expandedCard
                    ? 'translateY(-50%) translateX(0) scale(1)' // Don't move up, keep in place
                    : expandedCard === 'right'
                      ? 'translateY(-50%) translateX(40px) scale(0.95)'
                      : 'translateY(-50%) translateX(-40px) scale(0.95)',
                  // Position right next to the card edge - close but not touching/overlapping
                  // For right card: position from right side to place detail box on its LEFT
                  // For left/center: position from left side to place detail box on their RIGHT
                  [expandedCard === 'right' ? 'right' : 'left']: expandedCard === 'right'
                    ? `calc(${cardWidth}px + 8px)` // Right card: position from right edge, card width + 8px gap
                    : `calc(${cardWidth}px + 8px)`, // Left/center: position from left edge, after card + 8px gap
                  transition: 'all 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: expandedCard ? 1 : 0,
                }}
              >
                {/* Content box - cool glassmorphism effect with gradient backdrop */}
                <div
                  className="w-full h-full flex items-center relative overflow-hidden"
                  style={{
                    // For right card, round the LEFT side. For left/center cards, round the RIGHT side
                    borderTopLeftRadius: expandedCard === 'right' ? `${borderRadius}px` : '0',
                    borderBottomLeftRadius: expandedCard === 'right' ? `${borderRadius}px` : '0',
                    borderTopRightRadius: expandedCard === 'right' ? '0' : `${borderRadius}px`,
                    borderBottomRightRadius: expandedCard === 'right' ? '0' : `${borderRadius}px`,
                    animation: expandedCard ? 'slideInContent 700ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: expandedCard === 'right'
                      ? `
                        -8px 8px 32px rgba(0, 0, 0, 0.12),
                        -2px 2px 8px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                      `
                      : `
                        0 8px 32px rgba(0, 0, 0, 0.12),
                        0 2px 8px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                      `,
                  }}
                >
                  {/* Scrollable content wrapper with proper padding */}
                  <div
                    className="w-full h-full overflow-y-auto pl-8 pr-6 py-8 custom-scrollbar"
                    style={{
                      scrollbarWidth: 'thin', // Firefox - thin scrollbar
                      scrollbarColor: 'rgba(156, 163, 175, 0.4) transparent', // gray thumb, transparent track
                    }}
                  >
                    {/* Custom scrollbar styles for Chrome/Safari/Edge */}
                    <style jsx>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 8px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                        margin: 8px 0;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(156, 163, 175, 0.3);
                        border-radius: 10px;
                        transition: all 0.2s ease;
                        border: 2px solid transparent;
                        background-clip: padding-box;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(156, 163, 175, 0.5);
                        background-clip: padding-box;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:active {
                        background: rgba(156, 163, 175, 0.7);
                        background-clip: padding-box;
                      }
                    `}</style>

                    {/* Content based on which card is expanded */}
                    {expandedCard === "left" && (
                      <div className="w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            background: '#3B82F6',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          Talk to Sena
                        </h2>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                        Sena is your AI co-founder who helps you build custom ERP systems through natural conversation.
                        Choose between Discovery Mode for collaborative exploration or Express Mode for direct control.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-blue-700 mb-2">Discovery Mode (Voice)</h3>
                          <p className="text-gray-600 mb-2 leading-relaxed text-xs">
                            Have a natural conversation with Sena in your preferred language. She'll ask insightful questions
                            like a co-founder or analyst to deeply understand your operations.
                          </p>
                          <ul className="space-y-1.5">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Multilingual voice conversations in 50+ languages</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Proactive questioning to uncover hidden requirements</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Deep understanding of your business processes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Collaborative requirement building</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-blue-700 mb-2">Express Mode (Text)</h3>
                          <p className="text-gray-600 mb-2 leading-relaxed text-xs">
                            Know exactly what you want? Use Express Mode to tell Sena your requirements directly
                            and get instant results without back-and-forth.
                          </p>
                          <ul className="space-y-1.5">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Direct text-based interface for precise control</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Specify exact requirements and features</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Instant system generation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700 text-xs">Zero unnecessary conversation</span>
                            </li>
                          </ul>
                        </div>
                        </div>
                      </div>
                    )}

                    {expandedCard === "center" && (
                      <div className="w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            background: '#8B5CF6',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                          }}
                        >
                          <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          Review & Refine
                        </h2>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                        Walk through every detail of your system before going live. Make changes, ask questions,
                        and iterate in real-time until everything is exactly right.
                      </p>

                      <div className="space-y-3">
                        <div className="border-l-4 border-purple-500 pl-4 py-2">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Visual Preview</h4>
                          <p className="text-gray-600 text-xs">See exactly how your system looks and works before deployment</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4 py-2">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Interactive Editing</h4>
                          <p className="text-gray-600 text-xs">Click to edit any table, workflow, or interface element</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4 py-2">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Real-Time Updates</h4>
                          <p className="text-gray-600 text-xs">See changes instantly as you make modifications</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4 py-2">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Unlimited Iterations</h4>
                          <p className="text-gray-600 text-xs">Refine and perfect your system with no limits</p>
                        </div>
                        </div>
                      </div>
                    )}

                    {expandedCard === "right" && (
                      <div className="w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            background: '#EC4899',
                            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                          }}
                        >
                          <span className="text-white font-bold text-lg">3</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          Go Live
                        </h2>
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                        One click and your custom ERP is live. Your team can start using it immediately
                        with no setup, installation, or technical complexity.
                      </p>

                      <div className="space-y-3">
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Instant Deployment</h4>
                          <p className="text-gray-700 text-xs">Deploy to production with a single click - no DevOps required</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Immediate Access</h4>
                          <p className="text-gray-700 text-xs">Your team gets instant access - just share the link</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Cloud Infrastructure</h4>
                          <p className="text-gray-700 text-xs">Fully managed, scalable cloud hosting included</p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Enterprise Security</h4>
                          <p className="text-gray-700 text-xs">Bank-level security, compliance, and data protection</p>
                        </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

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
