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
  const [isHomeButtonFixed, setIsHomeButtonFixed] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

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

  // Track when home button should be fixed at top
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current && rotateProgress === 1) {
        const headerRect = headerRef.current.getBoundingClientRect();
        // Use hysteresis to prevent flickering:
        // - Fix when header goes above 70px (scrolling down)
        // - Unfix when header comes back below 90px (scrolling up - needs more scroll to unfix)
        if (!isHomeButtonFixed && headerRect.top < 70) {
          setIsHomeButtonFixed(true);
        } else if (isHomeButtonFixed && headerRect.top > 90) {
          setIsHomeButtonFixed(false);
        }
      } else {
        setIsHomeButtonFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rotateProgress, isHomeButtonFixed]);

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
  // Reduce side padding on smaller screens so cards get enough width
  const viewportPadding = viewportWidth < 900 ? 80 : viewportWidth < 1100 ? 160 : 320;

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
    // Gradually increase from 80 to 100 between 760px and 1000px
    extraTopSpace = getResponsiveValue(80 + ((viewportHeight - 760) / (1000 - 760)) * 20);
  } else if (viewportHeight <= 1400) {
    // Ramp from 100 to 145 between 1000px and 1400px — clear navbar but stay close to cards
    extraTopSpace = getResponsiveValue(100 + ((viewportHeight - 1000) / (1400 - 1000)) * 45);
  } else {
    // Large screens (1400px+) — clear navbar + announcement bar comfortably
    extraTopSpace = getResponsiveValue(145);
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
      className="relative w-full bg-sena-cream"
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
                padding: '6px',
                paddingBottom: 0,
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px solid #9CA3AF',
                  borderBottom: 'none',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(156, 163, 175, 0.15)',
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
            </div>
          )}

          {/* Anchor for "how-it-works" section at the rotated position */}
          <div id="how-it-works" className="absolute" style={{ top: `-${getResponsiveValue(140)}px` }} />

          {/* Title that appears when card shrinks (before split) - keep showing even when card is expanded */}
          <div
            ref={headerRef}
            className="absolute left-0 right-0 z-10"
            style={{
              top: `${-getResponsiveValue(140)}px`,
              opacity: expandedCard ? 1 : scrollProgress, // Keep visible when expanded
              pointerEvents: (scrollProgress > 0.9 || expandedCard) ? "auto" : "none", // Make interactive when expanded
            }}
          >
            {/* Home button - positioned in header when not expanded */}
            {rotateProgress === 1 && !isHomeButtonFixed && !expandedCard && (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('resetHome'));
                }}
                className="absolute flex items-center justify-center gap-2 text-gray-700 hover:text-white transition-all group cursor-pointer"
                style={{
                  left: `${currentPadding}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#F5F1E8',
                  border: '2px solid #9CA3AF',
                  boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8FB7C5';
                  e.currentTarget.style.borderColor = '#7AA5B5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F5F1E8';
                  e.currentTarget.style.borderColor = '#9CA3AF';
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
                  fontSize: viewportWidth < 768 ? '32px' : '40px',
                  marginBottom: '-5px',
                }}
              >
                How it <span style={{ fontStyle: "italic" }}>works</span>?
              </h2>
      
            </div>
          </div>

          {/* Outer border wrapper - only visible when fully on main screen (no transition) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: '2px solid #9CA3AF',
              borderRadius: `${borderRadius}px`,
              boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)',
              // Only show when completely stable on main screen - hide during ANY transition
              opacity: (scrollProgress === 0 && splitProgress === 0 && rotateProgress === 0) ? 1 : 0,
              // Fast fade out (no delay), slow fade in (with delay to wait for width animation)
              transition: (scrollProgress === 0 && splitProgress === 0 && rotateProgress === 0)
                ? 'opacity 200ms ease-out 600ms' // Delay showing by 600ms to let width settle
                : 'opacity 100ms ease-out 0ms',  // Hide immediately with no delay
              zIndex: 15,
            }}
          />

          {/* Always show 3 cards, but when splitProgress = 0, they're flush together with no gap */}
          <div
            id="cards-container"
            className="relative w-full h-full flex items-stretch transition-all duration-700 ease-out"
            style={{
              gap: expandedCard ? '0px' : `${cardGap}px`,
              filter: 'none',
              perspective: "2000px",
              justifyContent: expandedCard === 'right' ? 'flex-end' : (expandedCard ? 'flex-start' : 'center'),
              paddingLeft: expandedCard && expandedCard !== 'right' ? '80px' : '0',
              paddingRight: expandedCard === 'right' ? '80px' : '0',
              zIndex: 10,
            }}
          >
            {/* Back button - appears next to cards when expanded */}
            {expandedCard && expandedCard !== 'right' && (
              <button
                onClick={() => setExpandedCard(null)}
                className="absolute flex items-center justify-center text-gray-700 hover:text-white transition-all group cursor-pointer"
                style={{
                  left: '16px',
                  top: '16px',
                  zIndex: 100,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#F5F1E8',
                  border: '2px solid #9CA3AF',
                  boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8FB7C5';
                  e.currentTarget.style.borderColor = '#7AA5B5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F5F1E8';
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:-translate-x-1">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {/* Back button for right-expanded card - on the right side */}
            {expandedCard === 'right' && (
              <button
                onClick={() => setExpandedCard(null)}
                className="absolute flex items-center justify-center text-gray-700 hover:text-white transition-all group cursor-pointer"
                style={{
                  right: '16px',
                  top: '16px',
                  zIndex: 100,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#F5F1E8',
                  border: '2px solid #9CA3AF',
                  boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8FB7C5';
                  e.currentTarget.style.borderColor = '#7AA5B5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F5F1E8';
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
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
              cardTitle="Build"
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
              videoSrc="/videos/card3.mp4"
              videoBg="bg-[#f5f2e9]"
              videoPosition="center 45%"
              cardNumber={2}
              cardTitle="Run"
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
              videoSrc="/videos/card2.mp4"
              videoBg="bg-[#f6f2fb]"
              videoPosition="center 80%"
              cardNumber={3}
              cardTitle="Share"
              cardDescription=""
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "right" ? null : "right")}
            />

            {/* Expanded detail content - rendered as flex sibling for proper alignment */}
            {expandedCard && (
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  overflow: 'hidden', // Clips the scrollbar at rounded corners
                  marginLeft: expandedCard === 'right' ? 0 : '-2px',
                  marginRight: expandedCard === 'right' ? '-2px' : 0,
                  borderTopLeftRadius: expandedCard === 'right' ? `${borderRadius}px` : 0,
                  borderBottomLeftRadius: expandedCard === 'right' ? `${borderRadius}px` : 0,
                  borderTopRightRadius: expandedCard === 'right' ? 0 : `${borderRadius}px`,
                  borderBottomRightRadius: expandedCard === 'right' ? 0 : `${borderRadius}px`,
                  background: 'rgba(252, 249, 243, 0.95)',
                  border: '2px solid #9CA3AF',
                  borderLeft: expandedCard === 'right' ? '2px solid #9CA3AF' : 'none',
                  borderRight: expandedCard === 'right' ? 'none' : '2px solid #9CA3AF',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  order: expandedCard === 'right' ? -1 : 1,
                }}
              >
                <div
                  ref={detailScrollRef}
                  className="detail-scroll-container"
                  style={{
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '24px 28px',
                    paddingRight: '20px',
                  }}
                >
                  {/* Modern scrollbar styles */}
                  <style jsx>{`
                    .detail-scroll-container {
                      scrollbar-width: thin;
                      scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
                    }
                    .detail-scroll-container::-webkit-scrollbar {
                      width: 6px;
                    }
                    .detail-scroll-container::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .detail-scroll-container::-webkit-scrollbar-thumb {
                      background: rgba(156, 163, 175, 0.4);
                      border-radius: 3px;
                    }
                    .detail-scroll-container::-webkit-scrollbar-thumb:hover {
                      background: rgba(156, 163, 175, 0.6);
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
                            background: '#F5F1E8',
                            border: '2px solid #9CA3AF',
                          }}
                        >
                          <span className="font-bold text-lg" style={{ color: '#4682A0' }}>1</span>
                        </div>
                        <h2 className="text-3xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#4682A0' }}>
                          Build
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-5 leading-relaxed text-base">
                        Everything you need to build AI agents, all in one place. No coding, no consultants, no months of waiting. Go completely hands-off or take infinite control. Four ways to get started, whether you're building for your company, a client, or yourself.
                      </p>

                      <div className="space-y-4">
                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(70, 130, 160, 0.08)', borderColor: 'rgba(70, 130, 160, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#4682A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Registry
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Browse and install from a library of ready-made components. Agents, tools, skills, triggers, and more. Pick what fits, install it, and you're running.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Hundreds of pre-built components</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Install with one click</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Composable building blocks you can customize</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(70, 130, 160, 0.08)', borderColor: 'rgba(70, 130, 160, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#4682A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Discovery
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Tell Sena what you need in your own words. The Discovery Agent interviews you, understands your requirements, and generates a full build plan automatically.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Voice and text in 50+ languages</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Captures your intent through intelligent questioning</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Generates a complete build plan for approval</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(70, 130, 160, 0.08)', borderColor: 'rgba(70, 130, 160, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#4682A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Express
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">The closest thing to vibe coding for your business. Talk to Express and watch changes happen in real time, live in production. No build plans, no waiting. Just describe what you want and see it come to life.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Real-time changes in production as you talk</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>From conversation to working agent in minutes</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(70, 130, 160, 0.08)', borderColor: 'rgba(70, 130, 160, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#4682A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Configurations
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Full manual control for power users. Wire every component yourself with a visual graph builder, edit code directly, and connect to GitHub for version control.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Visual graph builder for agent networks</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Direct code access with GitHub integration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#4682A0] mt-0.5">→</span>
                              <span>Control every tool, skill, trigger, and model</span>
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
                            background: '#F5F1E8',
                            border: '2px solid #9CA3AF',
                          }}
                        >
                          <span className="font-bold text-lg" style={{ color: '#826496' }}>2</span>
                        </div>
                        <h2 className="text-3xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#826496' }}>
                          Run
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-5 leading-relaxed text-base">
                        Not demos. Agents that handle economically useful workloads inside your ERP. Real documents, real tasks, real coordination. Multiple agents working together across your business, with full control over what they can and can't do.
                      </p>

                      <div className="space-y-4">
                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(130, 100, 150, 0.08)', borderColor: 'rgba(130, 100, 150, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#826496]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Tasks
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Agents delegate work to each other through a structured task system. One agent can assign work to another, track progress, and report back. Complex workflows happen automatically.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Structured delegation between agents</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Progress tracking and status reporting</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Multi-step workflows without manual intervention</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(130, 100, 150, 0.08)', borderColor: 'rgba(130, 100, 150, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#826496]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Approvals
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Human oversight exactly where you want it. Set approval gates on any action so agents pause and ask before proceeding. Full control over autonomy levels.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Per-tool and per-agent approval settings</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Agents pause and ask when it matters</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Adjust autonomy as trust builds</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(130, 100, 150, 0.08)', borderColor: 'rgba(130, 100, 150, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#826496]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Triggers
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Agents wake up on their own. Scheduled jobs, document events, inbound messages, or manual requests. Your agents respond to what's happening in your business in real time.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Scheduled runs on any cron pattern</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Document events trigger agent responses</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Inbound channels like WhatsApp and email</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(130, 100, 150, 0.08)', borderColor: 'rgba(130, 100, 150, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#826496]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Routing
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">One conversation surface that understands what you need and routes to the right agent automatically. You never need to know which agent does what. Just talk and Sena figures it out.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Automatic agent discovery and selection</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Parallel delegation to multiple agents</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Results consolidated into one conversation</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(130, 100, 150, 0.08)', borderColor: 'rgba(130, 100, 150, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#826496]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Observability
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Every action your agents take is logged and traceable. See what happened, why it happened, and what the agent was thinking. Full audit trail for every decision.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Complete activity log for every agent</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Token usage and model performance tracking</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#826496] mt-0.5">→</span>
                              <span>Full audit trail for compliance</span>
                            </li>
                          </ul>
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
                            background: '#F5F1E8',
                            border: '2px solid #9CA3AF',
                          }}
                        >
                          <span className="font-bold text-lg" style={{ color: '#B4646E' }}>3</span>
                        </div>
                        <h2 className="text-3xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#B4646E' }}>
                          Share
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-5 leading-relaxed text-base">
                        A growing community built around the Registry. Every agent, tool, and skill is stored as a granular building block. Mix them to create something entirely new, or make small customizations on what already exists. Build once, and let others build on top of your work.
                      </p>

                      <div className="space-y-4">
                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(180, 100, 110, 0.08)', borderColor: 'rgba(180, 100, 110, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#B4646E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Community
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">A developer and builder community growing around Sena. Share what you build, learn from others, and collaborate on agent ecosystems that solve real problems.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Open ecosystem of builders and creators</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Shared knowledge and patterns</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Collaborative improvement over time</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(180, 100, 110, 0.08)', borderColor: 'rgba(180, 100, 110, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#B4646E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                            Composable
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Nothing is monolithic. Every component is stored at the smallest useful level. Take a tool from one agent, a skill from another, wire them with your own logic. Granular building blocks that snap together into infinite combinations.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Components stored at the smallest useful level</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Mix and match from different agents</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Infinite combinations from a shared library</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(180, 100, 110, 0.08)', borderColor: 'rgba(180, 100, 110, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#B4646E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Monetization
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">Every component you publish to the Registry is yours. When others install your agent, tool, or skill, you earn from it. Build quality, get rewarded.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Earn from every install of your work</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Ownership tracked at the component level</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Revenue grows with the community</span>
                            </li>
                          </ul>
                        </div>

                        <div className="rounded-2xl p-4 border-2" style={{ background: 'rgba(180, 100, 110, 0.08)', borderColor: 'rgba(180, 100, 110, 0.2)' }}>
                          <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#B4646E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Outcome as a Service
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">A new billing model. Instead of charging for seats or API calls, charge based on contract completion. Deliver outcomes, bill for results.</p>
                          <ul className="space-y-1 text-xs text-gray-600">
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Bill based on delivered outcomes, not usage</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Contract-based pricing model</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-[#B4646E] mt-0.5">→</span>
                              <span>Value-aligned incentives for builders and users</span>
                            </li>
                          </ul>
                        </div>
                        </div>
                      </div>
                    )}
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
              zIndex: splitProgress === 0 && rotateProgress === 0 && scrollProgress === 0 ? 20 : -1,
            }}
          >
            <IntroContent contentOpacity={1} scrollRef={contentScrollRef} />
          </div>
        </div>
      </div>

    </section>
  );
}
