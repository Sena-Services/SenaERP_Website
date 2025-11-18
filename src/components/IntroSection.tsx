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
  const detailScrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [splitProgress, setSplitProgress] = useState(0);
  const [rotateProgress, setRotateProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);
  const [animationLocked, setAnimationLocked] = useState(false);

  // Listen for intro navigation to reset content scroll
  useEffect(() => {
    const handleIntroNavigation = () => {
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0;
      }
    };

    window.addEventListener('resetIntroScroll', handleIntroNavigation);
    return () => window.removeEventListener('resetIntroScroll', handleIntroNavigation);
  }, []);

  // Ensure detail card scroll always works without interference
  useEffect(() => {
    const detailScroll = detailScrollRef.current;
    if (!detailScroll || !expandedCard) return;

    // Stop propagation of wheel and touch events to prevent parent scroll interference
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = detailScroll;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Always allow scrolling within the container
      // Only stop propagation if we're NOT at the boundary trying to scroll further
      if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
    };

    detailScroll.addEventListener('wheel', handleWheel, { passive: false });
    detailScroll.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      detailScroll.removeEventListener('wheel', handleWheel);
      detailScroll.removeEventListener('touchmove', handleTouchMove);
    };
  }, [expandedCard]);

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

      // If a card is expanded, lock animations at final state and don't process scroll
      if (expandedCard) {
        setScrollProgress(1);
        setSplitProgress(1);
        setRotateProgress(1);
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
  }, [animationLocked, viewportWidth, expandedCard]);

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

  // Calculate Builder's responsive padding value
  const builderPadding = Math.max(16, Math.min(32, viewportWidth * 0.02));

  // Target width for How It Works cards - matches Builder exactly
  const targetWidth = Math.min(maxContainerWidth, viewportWidth - viewportPadding);

  // Home screen: Start at 95vw (or full width on mobile)
  // How It Works: Animate down to Builder's constrained width
  const startWidth = viewportWidth < 768 ? viewportWidth : viewportWidth * 0.95;
  const currentWidthValue =
    startWidth - (startWidth - targetWidth) * scrollProgress;
  const currentWidth =
    viewportWidth === 0 ? "95vw" : `${currentWidthValue}px`;

  // Smoothly animate padding from 0 to Builder's padding during scroll
  const currentPadding = scrollProgress * builderPadding;

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
  } else if (viewportHeight <= 760) {
    // Increase space for 720-760px range
    extraTopSpace = getResponsiveValue(60 + ((viewportHeight - 720) / (760 - 720)) * 20);
  } else if (viewportHeight <= 1000) {
    // Gradually reduce from 80 to 30 between 760px and 1000px
    extraTopSpace = getResponsiveValue(80 - ((viewportHeight - 760) / (1000 - 760)) * 50);
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
            // Home screen: no maxWidth constraint (uses 95vw)
            // How It Works: constrain to Builder's exact width formula
            maxWidth: splitProgress > 0
              ? `min(${maxContainerWidth}px, calc(100vw - ${viewportPadding}px))`
              : (viewportWidth < 768 ? "100vw" : "95vw"),
            // Smoothly animate padding from 0 (home) to Builder's padding (how it works)
            paddingLeft: viewportWidth < 768 ? '0' : `${currentPadding}px`,
            paddingRight: viewportWidth < 768 ? '0' : `${currentPadding}px`,
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
                  fontSize: viewportWidth < 768 ? '32px' : '40px',
                  marginBottom: '-5px',
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
              cardDescription=""
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
              cardDescription=""
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
              cardDescription=""
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "right" ? null : "right")}
            />
          </div>

          {/* Expanded content - positioned relative to main container (not cards container) */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              transition: 'opacity 600ms ease-out',
              opacity: expandedCard ? 1 : 0,
              pointerEvents: 'none',
            }}
          >
            {expandedCard && (
              <div
                className={`absolute pointer-events-auto flex items-center`}
                style={{
                  width: '48%',
                  height: viewportHeight < 900
                    ? `${Math.min(currentHeightValue + 35, viewportHeight * 0.80)}px`
                    : `calc(${currentHeightValue}px + 35px)`, // Reduce height on shorter screens
                  top: viewportHeight < 900 ? '52%' : '50%',
                  transform: 'translateY(-50%)',
                  // Position calculation from main container edge:
                  // Main container has currentPadding on both sides
                  // Cards container adds 80px padding when expanded
                  // Card width is cardWidth
                  // Detail should start right after the card with small gap
                  [expandedCard === 'right' ? 'right' : 'left']: expandedCard === 'right'
                    ? `calc(${currentPadding}px + 80px + ${cardWidth}px + 7px)` // Right card: move detail 7px right (small gap, no overlap)
                    : expandedCard === 'center'
                      ? `calc(${currentPadding}px + 80px + ${cardWidth}px + 12px)` // Center card: move detail 12px right (more gap)
                      : `calc(${currentPadding}px + 80px + ${cardWidth}px + 7px)`, // Left card: move detail 7px right (small gap)
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
                    // Warm cream tint instead of pure white - matches the site's aesthetic better
                    background: 'rgba(252, 249, 243, 0.92)',
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
                    ref={detailScrollRef}
                    className="w-full h-full overflow-y-auto custom-scrollbar"
                    style={{
                      paddingLeft: '32px',
                      paddingRight: '24px',
                      paddingTop: viewportHeight < 700 ? '16px' : viewportHeight < 800 ? '20px' : viewportHeight < 900 ? '24px' : '32px',
                      paddingBottom: viewportHeight < 700 ? '16px' : viewportHeight < 800 ? '20px' : viewportHeight < 900 ? '24px' : '32px',
                      scrollbarWidth: 'thin', // Firefox - thin scrollbar
                      scrollbarColor: 'rgba(156, 163, 175, 0.6) rgba(156, 163, 175, 0.1)', // gray thumb, light track
                    }}
                  >
                    {/* Custom scrollbar styles for Chrome/Safari/Edge */}
                    <style jsx>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 10px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(156, 163, 175, 0.1);
                        border-radius: 10px;
                        margin: 8px 0;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(156, 163, 175, 0.5);
                        border-radius: 10px;
                        border: 2px solid transparent;
                        background-clip: padding-box;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(156, 163, 175, 0.7);
                        background-clip: padding-box;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb:active {
                        background: rgba(156, 163, 175, 0.9);
                        background-clip: padding-box;
                      }
                    `}</style>

                    {/* Content based on which card is expanded */}
                    {expandedCard === "left" && (
                      <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: '#3B82F6',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          <span className="text-white font-bold text-xl">1</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          Talk to Sena
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-5 leading-relaxed text-base">
                        Sena speaks your language—literally. Whether a founder with a fuzzy vision or a seasoned domain expert who knows what he wants, just talk naturally. Sena understands your business, asks the right questions, and transforms conversations into working software.
                      </p>

                      <div className="space-y-5">
                        <div className="bg-blue-50/60 rounded-2xl p-5 border-2 border-blue-100">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            <h3 className="text-lg font-bold text-blue-700">Discovery Mode</h3>
                            <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Voice</span>
                          </div>
                          <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                            Have a natural conversation about your business. Sena guides you through discovery with thoughtful questions—no technical expertise needed, just share how your business works.
                          </p>
                          <ul className="space-y-2.5">
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Conversational discovery in 50+ languages</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Intelligent questioning that uncovers what you really need</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Builds your complete system architecture from your answers</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Perfect for teams building their first custom ERP</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-blue-50/60 rounded-2xl p-5 border-2 border-blue-100">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h3 className="text-lg font-bold text-blue-700">Express Mode</h3>
                            <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Text</span>
                          </div>
                          <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                            Already know your requirements? Describe your complete workflow in text and Sena builds it instantly. Fast, direct, and powerful.
                          </p>
                          <ul className="space-y-2.5">
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Write your complete workflow in plain language</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Instant system generation from your description</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Streamlined process for clear use cases</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span className="text-gray-600 text-sm">Perfect for teams who know exactly what they want</span>
                            </li>
                          </ul>
                        </div>
                        </div>
                      </div>
                    )}

                    {expandedCard === "center" && (
                      <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: '#8B5CF6',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                          }}
                        >
                          <span className="text-white font-bold text-xl">2</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          Review & Refine
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-5 leading-relaxed text-base">
                        Walk through your complete business system—every workflow, every integration, every automation. This isn't about tweaking buttons—it's about validating your entire business logic before it goes live.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-purple-50/60 rounded-2xl p-4 border-2 border-purple-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Complete Business Workflows
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Preview your end-to-end processes—from lead capture to invoice generation, from inventory management to customer support.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Test approval chains and conditional routing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Validate business rules and data validations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>See how notifications and alerts flow through your team</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-purple-50/60 rounded-2xl p-4 border-2 border-purple-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            Live Data & Dashboards
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Visualize your business metrics and KPIs exactly as your team will see them in production.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Real-time analytics and reporting views</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Role-based dashboards for different team members</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Custom charts, tables, and data visualizations</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-purple-50/60 rounded-2xl p-4 border-2 border-purple-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Integration Testing
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Verify connections to your existing tools—Stripe, Shopify, Slack, email, calendars, and more.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Test data sync between your ERP and external systems</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Preview automated actions triggered by external events</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Validate API calls and webhook configurations</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-purple-50/60 rounded-2xl p-4 border-2 border-purple-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Permissions & Access Control
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Review who can see and do what—test your security model before your team logs in.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Preview each role's view: manager, employee, admin</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Validate data visibility and edit permissions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>Test approval hierarchies and delegation rules</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-purple-50/60 rounded-2xl p-4 border-2 border-purple-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Conversational Refinement
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Don't like something? Keep talking to Sena. Make changes through natural conversation.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>"Add a step where managers approve expenses over $500"</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>"Send Slack notifications when inventory is low"</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-500 mt-0.5">→</span>
                              <span>"Change the customer portal layout to show orders first"</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-purple-50/60 rounded-2xl p-4 border-2 border-purple-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Unlimited Iterations
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">This is your system. Refine it as many times as you need—no extra cost, no complaints, no limits.</p>
                        </div>
                        </div>
                      </div>
                    )}

                    {expandedCard === "right" && (
                      <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex items-center justify-center rounded-full flex-shrink-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: '#EC4899',
                            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                          }}
                        >
                          <span className="text-white font-bold text-xl">3</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                          Go Live
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-5 leading-relaxed text-base">
                        Hit deploy and your entire operation goes live. No implementation phase, no IT department, no months of setup. Your team logs in and starts working—day one, minute one.
                      </p>

                      <div className="space-y-4">
                        <div className="bg-pink-50/60 rounded-2xl p-4 border-2 border-pink-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            One-Click Production Deploy
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Traditional ERP deployment takes months. You'll do it in seconds—literally click a button and go live.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Zero DevOps or infrastructure configuration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Automatic SSL certificates and domain setup</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Production-grade environment from the start</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-pink-50/60 rounded-2xl p-4 border-2 border-pink-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Instant Team Onboarding
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Your team doesn't need training manuals or IT support. The system is intuitive because it's built for how they work.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Share a link—everyone's in, with the right permissions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Mobile-responsive: works on phones, tablets, desktops</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Role-based access means everyone sees what they need</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-pink-50/60 rounded-2xl p-4 border-2 border-pink-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            Enterprise Infrastructure Included
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">We handle all the infrastructure complexity—you get enterprise-grade hosting without the enterprise headaches.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Auto-scaling: handles 10 users or 10,000 users seamlessly</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Automated daily backups with point-in-time recovery</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>99.9% uptime SLA with global CDN distribution</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>24/7 monitoring and automatic issue resolution</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-pink-50/60 rounded-2xl p-4 border-2 border-pink-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Security & Compliance Built-In
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Enterprise security from day one—not something you bolt on later when you get audited.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>End-to-end encryption: data encrypted at rest and in transit</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>SOC 2, GDPR, HIPAA compliance frameworks ready</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Multi-factor authentication and SSO integration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Complete audit logs for every action in the system</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-pink-50/60 rounded-2xl p-4 border-2 border-pink-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Continuous Evolution
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Going live isn't the end—it's the beginning. Keep evolving your system as your business grows.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Push updates instantly—no downtime or maintenance windows</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Add new workflows, integrations, or features anytime</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-pink-500 mt-0.5">→</span>
                              <span>Version control: roll back changes if something goes wrong</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-pink-50/60 rounded-2xl p-4 border-2 border-pink-100">
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Zero Time to Value
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">Traditional ERPs measure implementation in months or years. You measure it in hours—from first conversation to production.</p>
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
