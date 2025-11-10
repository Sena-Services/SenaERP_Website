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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [splitProgress, setSplitProgress] = useState(0);
  const [rotateProgress, setRotateProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.offsetTop;
      const scrollY = window.scrollY;
      const totalDistance = scrollY - sectionTop;

      // Phase 1: Shrink animation (0-900px)
      const shrinkDistance = Math.min(
        Math.max(totalDistance, 0),
        SHRINK_SCROLL_DISTANCE
      );
      setScrollProgress(shrinkDistance / SHRINK_SCROLL_DISTANCE);

      // Phase 2: Split animation (900-1300px)
      const splitDistance = Math.min(
        Math.max(totalDistance - SHRINK_SCROLL_DISTANCE, 0),
        SPLIT_SCROLL_DISTANCE
      );
      setSplitProgress(splitDistance / SPLIT_SCROLL_DISTANCE);

      // Phase 3: Rotate animation (1300-1800px)
      const rotateDistance = Math.min(
        Math.max(totalDistance - SHRINK_SCROLL_DISTANCE - SPLIT_SCROLL_DISTANCE, 0),
        ROTATE_SCROLL_DISTANCE
      );
      setRotateProgress(rotateDistance / ROTATE_SCROLL_DISTANCE);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const responsiveTargetWidth = getResponsiveValue(1280);
  const targetWidth = Math.min(responsiveTargetWidth, viewportWidth - 64);
  const startWidth = Math.max(viewportWidth * 0.95, targetWidth);
  const currentWidthValue =
    startWidth - (startWidth - targetWidth) * scrollProgress;
  const currentWidth =
    viewportWidth === 0 ? "95vw" : `${currentWidthValue}px`;

  const startHeight = viewportHeight * 0.92;
  const responsiveMinHeight = getResponsiveValue(600);
  const targetHeight = Math.max(viewportHeight * 0.75, responsiveMinHeight);
  const currentHeightValue =
    startHeight - (startHeight - targetHeight) * scrollProgress;
  const currentHeight =
    viewportHeight === 0 ? "92vh" : `${currentHeightValue}px`;

  const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
  const responsiveBorderRadius = getResponsiveValue(32) + scrollProgress * getResponsiveValue(16);
  const borderRadius = responsiveBorderRadius;
  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.2);
  const elevation =
    scrollProgress < 1
      ? "0 20px 60px -12px rgba(0, 0, 0, 0.15)"
      : "0 12px 32px -10px rgba(0, 0, 0, 0.12)";
  const sectionHeight =
    startHeight + SHRINK_SCROLL_DISTANCE + SPLIT_SCROLL_DISTANCE + ROTATE_SCROLL_DISTANCE + EXTRA_HOLD_DISTANCE;
  const stickyFrameHeight =
    Math.max(viewportHeight, startHeight) + EXTRA_HOLD_DISTANCE / 2;

  const responsivePaddingBase = getResponsiveValue(8);
  const responsivePaddingIncrease = getResponsiveValue(24);
  // Keep padding constant during initial shrink to prevent upward movement
  const basePaddingTop = responsivePaddingBase;
  const optimalPadding = Math.max(
    getResponsiveValue(16),
    (stickyFrameHeight - currentHeightValue) / 2
  );
  // Only start centering after shrink is complete
  const centerBoostStart = 0.8;
  const centerBoost = clamp01(
    (scrollProgress - centerBoostStart) / (1 - centerBoostStart)
  );
  const heroPaddingTop =
    basePaddingTop + (optimalPadding - basePaddingTop) * centerBoost;

  // Split animation calculations with responsive scaling
  const responsiveMaxGap = getResponsiveValue(24);
  const cardGap = splitProgress * responsiveMaxGap; // Responsive max gap between cards
  const cardWidth = (currentWidthValue - cardGap * 2) / 3; // Divide width into 3 equal parts

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="relative w-full bg-waygent-cream"
      style={{
        height: `${sectionHeight}px`,
      }}
    >
      <div
        className="sticky flex items-start justify-center w-full"
        style={{
          top: '-40px',
          height: `${stickyFrameHeight}px`,
          paddingTop: `${heroPaddingTop}px`,
        }}
      >
        <div
          className="relative mx-auto"
          style={{
            width: currentWidth,
            maxWidth: "95vw",
            height: currentHeight,
          }}
        >
          {/* Anchor for "how-it-works" section at the rotated position */}
          <div id="how-it-works" className="absolute" style={{ top: 0 }} />

          {/* Title that appears when card shrinks (before split) */}
          <div
            className="absolute left-0 right-0 flex items-center justify-center z-10"
            style={{
              top: `${-getResponsiveValue(100)}px`,
              opacity: scrollProgress,
              pointerEvents: expandedCard ? "auto" : "none",
            }}
          >
            {/* Back button - always on the left of "How it works" when card is expanded */}
            {expandedCard && (
              <button
                onClick={() => setExpandedCard(null)}
                className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-all group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mr-4"
                style={{
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

            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
                fontSize: `${getResponsiveValue(60)}px`,
              }}
            >
              How it <span style={{ fontStyle: "italic" }}>works</span>?
            </h2>
          </div>

          {/* Always show 3 cards, but when splitProgress = 0, they're flush together with no gap */}
          <div
            className="relative w-full h-full flex items-center transition-all duration-700 ease-out"
            style={{
              gap: `${cardGap}px`,
              filter: splitProgress === 0 ? `drop-shadow(${elevation})` : 'none',
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
              imageOffset={-(cardWidth + cardGap)}
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
              imageOffset={-(cardWidth * 2 + cardGap * 2)}
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
                transition: 'opacity 500ms ease-out',
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
                    ? 'translateX(0)'
                    : expandedCard === 'right' ? 'translateX(-20px)' : 'translateX(20px)',
                  transition: 'transform 500ms ease-out',
                }}
              >
                <div className="w-full max-w-xl">

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

          {/* Content overlay - only visible during shrink phase */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: splitProgress > 0 ? 0 : 1,
              transition: "opacity 200ms ease-out",
            }}
          >
            <IntroContent contentOpacity={contentOpacity} />
          </div>
        </div>
      </div>
    </section>
  );
}
