"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import FlipCard from "./FlipCard";
import IntroContent from "./IntroContent";
import IntroCardDetail from "./IntroCardDetail";
import { useIntroScrollAnimation, type ExpandedCard } from "@/hooks/useIntroScrollAnimation";

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  const {
    scrollProgress,
    splitProgress,
    rotateProgress,
    viewportWidth,
    isHomeButtonFixed,
    headerRef,
    currentWidth,
    currentWidthValue,
    currentHeight,
    borderRadius,
    contentOpacity,
    sectionHeight,
    stickyFrameHeight,
    heroPaddingTop,
    cardGap,
    cardWidth,
    baseCardWidth,
    currentPadding,
    maxContainerWidth,
    viewportPadding,
    getResponsiveValue,
  } = useIntroScrollAnimation(sectionRef, expandedCard);

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
            maxWidth: splitProgress > 0
              ? `min(${maxContainerWidth}px, calc(100vw - ${viewportPadding}px))`
              : (viewportWidth < 768 ? "100vw" : "95vw"),
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
                <Image
                  src="/illustrations/monet-intro.png"
                  alt="Monet painting background"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '88% 50%', opacity: 0.80 }}
                />
              </div>
            </div>
          )}

          {/* Anchor for "how-it-works" section */}
          <div id="how-it-works" className="absolute" style={{ top: `-${getResponsiveValue(140)}px` }} />

          {/* Title that appears when card shrinks */}
          <div
            ref={headerRef}
            className="absolute left-0 right-0 z-10"
            style={{
              top: `${-getResponsiveValue(140)}px`,
              opacity: expandedCard ? 1 : scrollProgress,
              pointerEvents: (scrollProgress > 0.9 || expandedCard) ? "auto" : "none",
            }}
          >
            {/* Home button — in header when not expanded */}
            {rotateProgress === 1 && !isHomeButtonFixed && !expandedCard && (
              <button
                onClick={() => { window.dispatchEvent(new CustomEvent('resetHome')); }}
                className="absolute flex items-center justify-center gap-2 text-gray-700 hover:text-white transition-all group cursor-pointer"
                style={{
                  left: `${currentPadding}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 50,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#F5F1E8',
                  border: '2px solid #9CA3AF',
                  boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#8FB7C5'; e.currentTarget.style.borderColor = '#7AA5B5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F1E8'; e.currentTarget.style.borderColor = '#9CA3AF'; }}
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

            {/* Heading — centered */}
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

          {/* Outer border wrapper — only visible when fully on main screen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: '2px solid #9CA3AF',
              borderRadius: `${borderRadius}px`,
              boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)',
              opacity: (scrollProgress === 0 && splitProgress === 0 && rotateProgress === 0) ? 1 : 0,
              transition: (scrollProgress === 0 && splitProgress === 0 && rotateProgress === 0)
                ? 'opacity 200ms ease-out 600ms'
                : 'opacity 100ms ease-out 0ms',
              zIndex: 15,
            }}
          />

          {/* Cards container */}
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
            {/* Back button — left/center expanded */}
            {expandedCard && expandedCard !== 'right' && (
              <button
                onClick={() => setExpandedCard(null)}
                className="absolute flex items-center justify-center text-gray-700 hover:text-white transition-all group cursor-pointer"
                style={{
                  left: '16px', top: '16px', zIndex: 100,
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#F5F1E8', border: '2px solid #9CA3AF',
                  boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#8FB7C5'; e.currentTarget.style.borderColor = '#7AA5B5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F1E8'; e.currentTarget.style.borderColor = '#9CA3AF'; }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:-translate-x-1">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Back button — right expanded */}
            {expandedCard === 'right' && (
              <button
                onClick={() => setExpandedCard(null)}
                className="absolute flex items-center justify-center text-gray-700 hover:text-white transition-all group cursor-pointer"
                style={{
                  right: '16px', top: '16px', zIndex: 100,
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#F5F1E8', border: '2px solid #9CA3AF',
                  boxShadow: '0 2px 8px rgba(156, 163, 175, 0.2)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#8FB7C5'; e.currentTarget.style.borderColor = '#7AA5B5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F1E8'; e.currentTarget.style.borderColor = '#9CA3AF'; }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <FlipCard
              cardWidth={cardWidth}
              currentWidthValue={currentWidthValue}
              cardGap={cardGap}
              borderRadius={borderRadius}
              splitProgress={splitProgress}
              rotateProgress={rotateProgress}
              position="left"
              imageOffset={0}
              videoSrc="/videos/card1.mp4"
              cardNumber={1}
              cardTitle="Build"
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "left" ? null : "left")}
            />

            <FlipCard
              cardWidth={cardWidth}
              currentWidthValue={currentWidthValue}
              cardGap={cardGap}
              borderRadius={borderRadius}
              splitProgress={splitProgress}
              rotateProgress={rotateProgress}
              position="center"
              imageOffset={-baseCardWidth}
              videoSrc="/videos/card3.mp4"
              cardNumber={2}
              cardTitle="Run"
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "center" ? null : "center")}
            />

            <FlipCard
              cardWidth={cardWidth}
              currentWidthValue={currentWidthValue}
              cardGap={cardGap}
              borderRadius={borderRadius}
              splitProgress={splitProgress}
              rotateProgress={rotateProgress}
              position="right"
              imageOffset={-baseCardWidth * 2}
              videoSrc="/videos/card2.mp4"
              cardNumber={3}
              cardTitle="Share"
              expandedCard={expandedCard}
              onCardClick={() => setExpandedCard(expandedCard === "right" ? null : "right")}
            />

            {/* Expanded detail panel */}
            {expandedCard && (
              <IntroCardDetail
                expandedCard={expandedCard}
                borderRadius={borderRadius}
              />
            )}
          </div>

          {/* IntroContent overlay — only visible when fully back in intro state */}
          <div
            className="absolute inset-0"
            style={{
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
