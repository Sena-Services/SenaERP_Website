"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface MarketingPoint {
  id: string;
  title: string;
  description: string;
}

const marketingPoints: MarketingPoint[] = [
  {
    id: "website-builder",
    title: "Website Builder",
    description:
      "Build complex websites from standard templates. Your end customers can edit itineraries directly from the site. Fully SEO optimized.",
  },
  {
    id: "social-media-management",
    title: "Social Media Management",
    description:
      "Automatically schedule and publish posts across LinkedIn, Instagram, X, Facebook, and more.",
  },
  {
    id: "ad-campaign-manager",
    title: "Ad Campaign Manager",
    description:
      "Seamlessly create, run, manage, and track ad campaigns on Facebook, Google, Instagram, etc., all from one platform.",
  },
  {
    id: "referral-codes",
    title: "Referral Codes",
    description:
      "Boost revenue through customer referrals by offering incentivizing discounts and cashbacks.",
  },
  {
    id: "influencer-logins",
    title: "Influencer Logins",
    description:
      "Collaborate with top influencers to expand your reach and amplify your brand message.",
  },
  {
    id: "loyalty-programs",
    title: "Loyalty Programs",
    description:
      "Implement rules-based discount systems to reward and retain your regular customers.",
  },
  {
    id: "outbound-reachouts",
    title: "Outbound Reachouts",
    description:
      "Define and schedule automated outreach sequences to engage prospective customers via messages and calls.",
  },
  {
    id: "ai-content-generation",
    title: "AI Content Generation",
    description:
      "Generate compelling content to enhance your agency's branding and online presence.",
  },
];

const MarketingFeatureContent: React.FC = () => {
  //   | Prefix | Min Width (px) |
  // | :----: | :------------: |
  // |   sm   |      640px     |
  // |   md   |      768px     |
  // |   lg   |     1024px     |
  // |   xl   |     1280px     |
  // |   2xl  |     1536px     |
  const MANUAL_CONTROLS = {
    // Responsive card display counts
    cardsPerView: {
      base: 1, // default/mobile
      lg: 2, // large screens
      xl: 1, // extra large
      "2xl": 4, // 2x extra large
    },
    // Image sizing
    imageSizing: {
      base: "w-[1200px] max-w-[1200px]", // base size (all screens)
      lg: "lg:w-[600px] lg:max-w-[800px]", // large screens
      xl: "xl:w-[1000px] xl:max-w-[1200px]", // extra large screens
      "2xl": "2xl:w-[800px] 2xl:max-w-[1000px]", // 2xl screens

      /* IMAGE SIZING OPTIONS - Use responsive prefixes:
       *
       * RESPONSIVE FORMAT: "breakpoint:class"
       * ✅ Good: "lg:max-w-lg", "xl:max-w-2xl", "2xl:max-w-3xl"
       * ✅ Good: "lg:w-[400px]", "xl:w-[600px]", "2xl:w-[800px]"
       * ❌ Bad: "max-w-lg lg:max-w-xl" (mixing in same string)
       *
       * EXAMPLES:
       * base: "w-[300px]"                    // applies to all screens
       * lg: "lg:w-[500px]"                   // large screens and up
       * xl: "xl:w-[700px] xl:max-w-[900px]"  // multiple classes for xl
       *
       * SIZE OPTIONS:
       * w-[200px], w-[400px], w-[600px], w-[800px]
       * max-w-xs, max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-2xl
       */
    },
    // Layout proportions
    layoutSplit: {
      base: { image: "w-2/5", content: "w-3/5" }, // stacked on mobile
      lg: { image: "w-2/5", content: "w-3/5" }, // 50/50 on large
      xl: { image: "w-2/5", content: "w-3/5" }, // 40/60 on xl
      "2xl": { image: "w-2/5", content: "w-3/5" }, // 25/75 on 2xl for more space for 2x2 grid

      /* LAYOUT SPLIT OPTIONS:
       *
       * FRACTIONS:
       * "w-1/2" = 50%, "w-1/3" = 33.33%, "w-2/3" = 66.67%
       * "w-1/4" = 25%, "w-3/4" = 75%
       * "w-2/5" = 40%, "w-3/5" = 60%
       *
       * CUSTOM PERCENTAGES:
       * "w-[30%]", "w-[70%]", "w-[35%]", "w-[65%]"
       *p
       * FULL WIDTH:
       * "w-full" = 100% (for stacked layouts)
       */
    },
    // Card grid layouts
    cardGrids: {
      1: "grid-cols-1 justify-items-center",
      2: "grid-cols-1 lg:grid-cols-1", // 2 side by side on lg+
      3: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
      4: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 2xl:grid-rows-2", // 2x2 grid on 2xl

      /* GRID LAYOUT OPTIONS:
       *
       * COLUMNS: grid-cols-1, grid-cols-2, grid-cols-3, grid-cols-4
       * ROWS: grid-rows-1, grid-rows-2, grid-rows-3, grid-rows-4
       *
       * RESPONSIVE EXAMPLES:
       * "grid-cols-1 lg:grid-cols-2"              // 1 col mobile, 2 cols lg+
       * "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" // 1 col mobile, 2 cols lg, 3 cols xl
       * "grid-cols-2 xl:grid-cols-2 xl:grid-rows-2" // 2x1 then 2x2 grid
       *
       * FOR SIDE-BY-SIDE GAPS: Use grid-cols-2 or higher
       * FOR VERTICAL GAPS: Use grid-rows-2 or higher
       * FOR 2x2 GRID: Use grid-cols-2 grid-rows-2
       */
    },
    // Card sizing
    cardSizing: {
      single: "max-w-[350px]", // Single card size
      multiple: "xl:w-[350px] xl:h-[250px] 2xl:w-[350px] 2xl:h-[200px]", // Multiple cards size

      /* SIZING OPTIONS - Choose any of these for single or multiple:
       *
       * TAILWIND PRESET SIZES:
       * "max-w-xs"     = 320px  (extra small)
       * "max-w-sm"     = 384px  (small)
       * "max-w-md"     = 448px  (medium)
       * "max-w-lg"     = 512px  (large)
       * "max-w-xl"     = 576px  (extra large)
       * "max-w-2xl"    = 672px  (2x extra large)
       * "max-w-3xl"    = 768px  (3x extra large)
       * "max-w-4xl"    = 896px  (4x extra large)
       * "max-w-5xl"    = 1024px (5x extra large)
       * "max-w-6xl"    = 1152px (6x extra large)
       * "max-w-7xl"    = 1280px (7x extra large)
       *
       * CUSTOM PIXEL SIZES (use square brackets):
       * "max-w-[200px]"   = exactly 200 pixels
       * "max-w-[350px]"   = exactly 350 pixels
       * "max-w-[500px]"   = exactly 500 pixels
       * "max-w-[600px]"   = exactly 600 pixels
       * "max-w-[800px]"   = exactly 800 pixels
       *
       * REM SIZES (responsive to font size):
       * "max-w-[20rem]"   = 20rem (usually ~320px)
       * "max-w-[25rem]"   = 25rem (usually ~400px)
       * "max-w-[30rem]"   = 30rem (usually ~480px)
       * "max-w-[35rem]"   = 35rem (usually ~560px)
       * "max-w-[40rem]"   = 40rem (usually ~640px)
       *
       * PERCENTAGE/VIEWPORT SIZES:
       * "max-w-[50%]"     = 50% of parent container
       * "max-w-[75%]"     = 75% of parent container
       * "max-w-[90%]"     = 90% of parent container
       * "max-w-[50vw]"    = 50% of viewport width
       * "max-w-[33vw]"    = 33% of viewport width
       *
       * NO LIMIT:
       * "max-w-none"      = no maximum width limit
       * "max-w-full"      = 100% of parent (but respects parent's max-width)
       *
       * EXAMPLES:
       * For smaller cards: "max-w-xs" or "max-w-[280px]"
       * For larger cards: "max-w-2xl" or "max-w-[700px]"
       * For responsive: "max-w-[25rem]" (scales with font size)
       */
    },
    // Spacing
    spacing: {
      cardGap: "gap-4 lg:gap-6 xl:gap-2 2xl:gap-10", // Equal space between cards for 2x2 grid
      cardPadding: "p-4 lg:p-6 xl:p-4 2xl:p-4", // Padding inside cards
      cardHeight:
        "min-h-[160px] lg:min-h-[180px] xl:min-h-[200px] 2xl:min-h-[200px]", // Minimum card height

      /* SPACING OPTIONS:
       *
       * GAP (space between cards):
       * "gap-1" = 4px, "gap-2" = 8px, "gap-3" = 12px, "gap-4" = 16px
       * "gap-6" = 24px, "gap-8" = 32px, "gap-10" = 40px, "gap-12" = 48px
       * Custom: "gap-[20px]", "gap-[30px]", "gap-[2rem]"
       * Responsive: "gap-2 lg:gap-4", "gap-4 lg:gap-8"
       *
       * PADDING (inside cards):
       * "p-2" = 8px, "p-3" = 12px, "p-4" = 16px, "p-6" = 24px, "p-8" = 32px
       * Custom: "p-[20px]", "p-[1.5rem]"
       * Responsive: "p-3 lg:p-6", "p-4 lg:p-8"
       *
       * HEIGHT (card minimum height):
       * "min-h-[120px]", "min-h-[160px]", "min-h-[200px]", "min-h-[240px]"
       * REM: "min-h-[10rem]", "min-h-[12rem]", "min-h-[15rem]"
       * Responsive: "min-h-[140px] lg:min-h-[180px]"
       * Auto height: remove min-h entirely for content-based height
       */
    },
  };

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardsToShow, setCardsToShow] = useState<number>(1);

  // Update cards to show based on screen size
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1536) {
        // 2xl
        setCardsToShow(MANUAL_CONTROLS.cardsPerView["2xl"]);
      } else if (window.innerWidth >= 1280) {
        // xl
        setCardsToShow(MANUAL_CONTROLS.cardsPerView.xl);
      } else if (window.innerWidth >= 1024) {
        // lg
        setCardsToShow(MANUAL_CONTROLS.cardsPerView.lg);
      } else {
        setCardsToShow(MANUAL_CONTROLS.cardsPerView.base);
      }
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const totalPages = Math.ceil(marketingPoints.length / cardsToShow);
  const visibleCards = marketingPoints.slice(
    currentIndex,
    currentIndex + cardsToShow
  );

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - cardsToShow;
      return newIndex < 0
        ? Math.max(0, marketingPoints.length - cardsToShow)
        : newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + cardsToShow;
      return newIndex >= marketingPoints.length ? 0 : newIndex;
    });
  };

  const getGridClass = () => {
    return (
      MANUAL_CONTROLS.cardGrids[
        cardsToShow as keyof typeof MANUAL_CONTROLS.cardGrids
      ] || MANUAL_CONTROLS.cardGrids[1]
    );
  };

  const getProgressText = () => {
    const startNum = currentIndex + 1;
    const endNum = Math.min(currentIndex + cardsToShow, marketingPoints.length);
    return cardsToShow === 1 ? `${startNum}` : `${startNum}-${endNum}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row font-rockwell text-sena-text-primary">
      {/* Header - Full width on mobile, positioned on desktop */}
      <motion.div
        className="w-full lg:absolute lg:top-0 lg:left-0 lg:right-0 mb-4 lg:mb-0 px-4 lg:px-8 lg:pt-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-sena-blue text-center lg:text-left">
          Scale Your Business Through Strategic Marketing
        </h2>
      </motion.div>

      {/* Content Area - Responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center pt-0 lg:pt-16">
        {/* Left Side - Image */}
        <div
          className={`${MANUAL_CONTROLS.layoutSplit.base.image} ${MANUAL_CONTROLS.layoutSplit.lg.image} xl:w-2/5 2xl:w-1/4 flex items-center justify-center p-1`}
        >
          <div
            className={`relative aspect-square ${MANUAL_CONTROLS.imageSizing.base} ${MANUAL_CONTROLS.imageSizing.lg} ${MANUAL_CONTROLS.imageSizing.xl} ${MANUAL_CONTROLS.imageSizing["2xl"]}`}
          >
            <img
              src="/marketing.png"
              alt="Marketing Features"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right Side - Cards Grid */}
        <div
          className={`${MANUAL_CONTROLS.layoutSplit.base.content} ${MANUAL_CONTROLS.layoutSplit.lg.content} xl:w-2/5 2xl:w-3/4 flex flex-col justify-center items-center p-1 lg:pl-2 lg:pr-6`}
        >
          <div className="relative">
            {/* Cards Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`grid ${getGridClass()} ${
                  MANUAL_CONTROLS.spacing.cardGap
                } mb-6 justify-items-center`}
              >
                {visibleCards.map((point, index) => (
                  <div
                    key={point.id}
                    className={`bg-sena-cream/60 backdrop-blur-sm ${
                      MANUAL_CONTROLS.spacing.cardPadding
                    } rounded-xl shadow-lg border-2 border-sena-cream ${
                      cardsToShow === 1
                        ? MANUAL_CONTROLS.cardSizing.single
                        : MANUAL_CONTROLS.cardSizing.multiple
                    } ${
                      MANUAL_CONTROLS.spacing.cardHeight
                    } flex flex-col justify-center`}
                  >
                    <div className="flex items-center mb-3 lg:mb-4">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-sena-blue text-white flex items-center justify-center text-xs lg:text-sm font-bold mr-2 lg:mr-3 flex-shrink-0">
                        {currentIndex + index + 1}
                      </div>
                      <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-sena-blue flex-1 leading-tight">
                        {point.title}
                      </h3>
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-sena-orange ml-2 lg:ml-3 flex-shrink-0" />
                    </div>
                    <p className="text-xs lg:text-sm xl:text-base text-sena-text-primary leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="w-full flex items-center justify-center gap-4">
              <button
                onClick={goToPrevious}
                className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-sena-blue/20 hover:bg-sena-blue/30 transition-all duration-300 group"
                disabled={totalPages <= 1}
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-sena-blue group-hover:text-sena-orange transition-colors" />
              </button>

              {/* Enhanced Progress indicator */}
              <div className="flex items-center gap-1 min-w-[80px] justify-center">
                <span className="text-sm lg:text-base text-sena-blue font-medium">
                  {getProgressText()}
                </span>
                <span className="text-sm lg:text-base text-sena-text-secondary">
                  of {marketingPoints.length}
                </span>
                {cardsToShow > 1 && (
                  <span className="text-xs text-sena-text-muted ml-1">
                    ({cardsToShow} cards)
                  </span>
                )}
              </div>

              <button
                onClick={goToNext}
                className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-sena-blue/20 hover:bg-sena-blue/30 transition-all duration-300 group"
                disabled={totalPages <= 1}
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-sena-blue group-hover:text-sena-orange transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingFeatureContent;
