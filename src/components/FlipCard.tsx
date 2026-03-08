"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

// ===== ADJUST THIS VALUE TO CHANGE VIDEO/CONTENT RATIO FOR ALL CARDS =====
// Video takes this percentage, content takes the remainder
// As height decreases, sacrifice MORE video to show ALL content
// As height increases past 740px, increase video ratio so content doesn't get too big
const getVideoHeightPercentage = () => {
  if (typeof window === 'undefined') return 50;
  const height = window.innerHeight;

  // Very short screens (< 600px): 45% video, 55% content - prioritize showing all content
  if (height < 600) return 45;

  // Short screens (600-680px): gradually increase from 45% to 50%
  if (height < 680) {
    return 45 + ((height - 600) / (680 - 600)) * 5;
  }

  // Medium-short screens (680-740px): gradually increase from 50% to 55%
  if (height < 740) {
    return 50 + ((height - 680) / (740 - 680)) * 5;
  }

  // Medium screens (740-900px): gradually increase from 55% to 60%
  if (height < 900) {
    return 55 + ((height - 740) / (900 - 740)) * 5;
  }

  // Large screens (900-1200px): gradually increase from 60% to 65%
  if (height < 1200) {
    return 60 + ((height - 900) / (1200 - 900)) * 5;
  }

  // Very tall screens (1200px+): 65% video, 35% content - more content space
  return 65;
};

// Get card-specific color based on position - refined earthy palette with more richness
const getCardColor = (position: "left" | "center" | "right") => {
  switch (position) {
    case 'left':
      return {
        rgb: '70, 130, 160',    // Richer teal blue
        hex: '#4682A0',
      };
    case 'center':
      return {
        rgb: '130, 100, 150',   // Actual purple with warmth
        hex: '#826496',
      };
    case 'right':
      return {
        rgb: '180, 100, 110',   // Warm rose with presence
        hex: '#B4646E',
      };
  }
};
// =========================================================================

type ExpandedCard = "left" | "center" | "right" | null;

type FlipCardProps = {
  cardWidth: number;
  currentWidthValue: number;
  cardGap: number;
  borderRadius: number;
  elevation: string;
  splitProgress: number;
  rotateProgress: number;
  position: "left" | "center" | "right";
  imageOffset: number;
  videoSrc: string;
  videoBg: string;
  videoPosition: string;
  cardNumber: number;
  cardTitle: string;
  cardDescription: string;
  expandedCard: ExpandedCard;
  onCardClick: () => void;
};

// When a card is expanded, show 100% video and hide the content section
const getExpandedVideoHeight = (isExpanded: boolean) => {
  return isExpanded ? 100 : undefined; // 100% when expanded, normal otherwise
};

export default function FlipCard({
  cardWidth,
  currentWidthValue,
  cardGap,
  borderRadius,
  elevation,
  splitProgress,
  rotateProgress,
  position,
  imageOffset,
  videoSrc,
  videoBg,
  videoPosition,
  cardNumber,
  cardTitle,
  cardDescription,
  expandedCard,
  onCardClick,
}: FlipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Use state to avoid hydration mismatch - always start with default value
  const [videoHeightPercentage, setVideoHeightPercentage] = useState(50);

  // Update on client side only after hydration
  useEffect(() => {
    setVideoHeightPercentage(getVideoHeightPercentage());

    const handleResize = () => {
      setVideoHeightPercentage(getVideoHeightPercentage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = expandedCard === position;

  // Dynamic border radius based on position AND expansion state
  const borderRadiusStyle =
    position === "left"
      ? {
          borderTopLeftRadius: `${borderRadius}px`,
          borderBottomLeftRadius: `${borderRadius}px`,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }
      : position === "right"
      ? {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: `${borderRadius}px`,
          borderBottomRightRadius: `${borderRadius}px`,
        }
      : isExpanded
        ? {
            // When center card is expanded, give it left rounded borders like the left card
            borderTopLeftRadius: `${borderRadius}px`,
            borderBottomLeftRadius: `${borderRadius}px`,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }
        : { borderRadius: 0 };
  const isOtherExpanded = expandedCard !== null && expandedCard !== position;
  const canClick = rotateProgress === 1; // Only clickable when fully flipped

  // When expanded, override video height to 100%
  const finalVideoHeight = isExpanded ? 100 : videoHeightPercentage;

  // When card is expanded, pause video and show refined color state
  useEffect(() => {
    if (isExpanded && videoRef.current) {
      // Keep refined aesthetic when expanded
      videoRef.current.style.filter = 'grayscale(40%) brightness(0.92) contrast(0.85) sepia(10%)';
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0.6';
      }
    } else if (!isExpanded && videoRef.current) {
      videoRef.current.style.filter = 'grayscale(40%) brightness(0.92) contrast(0.85) sepia(10%)';
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0.6';
      }
    }
  }, [isExpanded]);

  const handleMouseEnter = () => {
    // Allow hover interaction even when expanded
    setIsHovered(true);
    if (videoRef.current) {
      const video = videoRef.current;
      video.style.filter = 'grayscale(20%) brightness(1) contrast(0.95) sepia(5%)';
      video.playbackRate = 0.65; // Slow down the video

      // Ensure video is loaded before playing
      if (video.readyState >= 2) {
        video.play().catch(err => console.log('Play error:', err));
      } else {
        video.addEventListener('loadeddata', () => {
          video.play().catch(err => console.log('Play error:', err));
        }, { once: true });
      }
    }
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '0.1';
    }
  };

  const handleMouseLeave = () => {
    // Reset to refined static state on mouse leave
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.style.filter = 'grayscale(40%) brightness(0.92) contrast(0.85) sepia(10%)';
      videoRef.current.playbackRate = 1; // Reset playback rate
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '0.6';
    }
  };

  // Don't render cards that aren't expanded
  if (isOtherExpanded) {
    return null;
  }

  // Calculate physical movement during split
  const translateX =
    position === "left"
      ? -cardGap * splitProgress // Move left
      : position === "right"
        ? cardGap * splitProgress // Move right
        : 0; // Center stays in place

  // Set z-index based on position - each card needs its own layer when split
  // Base of 10 to ensure cards are above the background grid (z-index 5)
  const getZIndex = () => {
    if (isExpanded) return 20;
    // When cards are split, give each a unique z-index so they don't overlap
    if (position === "left") return 13;
    if (position === "center") return 12;
    if (position === "right") return 11;
    return 11;
  };

  return (
    <div
      className="relative transition-all duration-700 ease-out"
      style={{
        width: `${cardWidth}px`,
        height: "100%",
        transform: `translateX(${translateX}px) rotateY(${rotateProgress * 180}deg)`,
        transformStyle: "preserve-3d",
        // Add shadow during split to emphasize separation
        boxShadow: 'none',
        zIndex: getZIndex(),
      }}
    >
      {/* Front face - Monet image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          ...borderRadiusStyle,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${imageOffset}px`,
            width: `${currentWidthValue}px`,
            height: "100%",
          }}
        >
          <Image
            src="/illustrations/monet-intro-expanded2.webp"
            alt="Monet painting"
            fill
            priority
            quality={100}
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center md:object-right"
            style={{
              opacity: 1,
              imageRendering: 'crisp-edges',
            }}
          />
        </div>
      </div>

      {/* Back face - How It Works card */}
      <div
        className="absolute inset-0 overflow-hidden flex flex-col group cursor-pointer"
        style={{
          backfaceVisibility: "hidden",
          // When expanded, no lift effect on hover. Only in normal "how it works" view
          transform: `rotateY(180deg) ${isHovered && canClick && !isExpanded ? 'translateY(-8px)' : 'translateY(0)'}`,
          cursor: canClick ? 'pointer' : 'default',
          boxSizing: 'border-box',
          // When expanded, keep shadow constant. Only change shadow on hover in normal view - more muted, earthy shadows
          boxShadow: isHovered && canClick && !isExpanded
            ? '0 20px 40px -12px rgba(80, 60, 40, 0.15), 0 8px 20px -8px rgba(80, 60, 40, 0.1)'
            : '0 8px 24px -8px rgba(80, 60, 40, 0.1), 0 4px 12px -4px rgba(80, 60, 40, 0.06)',
          transition: 'all 0.3s ease-out',
          ...borderRadiusStyle,
          // Earthy cream background
          backgroundColor: '#FAF8F5',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => canClick && !isExpanded && onCardClick()} // Don't allow closing when expanded
      >
        {/* Subtle warm tint overlay - very minimal */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            ...borderRadiusStyle,
            background: `linear-gradient(180deg,
              rgba(245, 240, 230, 0.3) 0%,
              rgba(245, 240, 230, 0.15) 50%,
              transparent 100%)`,
            zIndex: 0,
          }}
        />
        {/* Video section - full height when expanded */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${finalVideoHeight}%`,
            borderTopLeftRadius: position === "left" ? `${borderRadius - 2}px` : 0,
            borderTopRightRadius: position === "right" ? `${borderRadius - 2}px` : 0,
            // When expanded, no mask fade. When normal, smooth fade
            maskImage: isExpanded
              ? 'none'
              : 'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.4) 95%, transparent 100%)',
            WebkitMaskImage: isExpanded
              ? 'none'
              : 'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.4) 95%, transparent 100%)',
            borderBottomLeftRadius: isExpanded && position === "left" ? `${borderRadius - 2}px` : 0,
            borderBottomRightRadius: isExpanded && position === "right" ? `${borderRadius - 2}px` : 0,
            backgroundColor: '#f5f0e6', // Solid background to cover grid
          }}
        >
          <video
            ref={videoRef}
            className="absolute w-full h-full transition-all duration-300"
            style={{
              filter: 'grayscale(40%) brightness(0.92) contrast(0.85) sepia(10%)',
              display: 'block',
              objectFit: 'cover',
              objectPosition: position === "left"
                ? 'center 24%'
                : position === "right"
                  ? 'center 90%'
                  : 'center 50%',
              top: position === "left"
                ? '-10%'
                : position === "right"
                  ? '0%'
                  : '-5%',
              height: position === "left"
                ? '110%'
                : position === "right"
                  ? '110%'
                  : '110%',
            }}
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Subtle warm overlay for cohesion */}
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: 'rgba(250, 245, 235, 0.25)',
              mixBlendMode: 'soft-light',
              opacity: 0.6,
            }}
          />

          {/* Subtle color gradient - adds character without being glossy */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg,
                rgba(${getCardColor(position).rgb}, 0.12) 0%,
                rgba(${getCardColor(position).rgb}, 0.08) 40%,
                rgba(${getCardColor(position).rgb}, 0.04) 70%,
                transparent 100%)`,
            }}
          />
        </div>

        {/* Content section - hidden when expanded */}
        {!isExpanded && (
          <div
            className="flex flex-col px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 relative overflow-y-auto"
            style={{
              height: `${100 - finalVideoHeight}%`,
              background: '#FAF8F5', // Earthy cream to cover grid
              position: 'relative',
              scrollbarWidth: 'none', // Firefox - hide scrollbar
              msOverflowStyle: 'none', // IE/Edge - hide scrollbar
            }}
          >
          {/* Hide scrollbar for Chrome/Safari */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {/* Very subtle warm transition */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '30%',
              background: `linear-gradient(to bottom,
                rgba(245, 240, 230, 0.4) 0%,
                transparent 100%)`,
              zIndex: 0,
            }}
          />

          {/* Step number and title - matching sidebar border discipline */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 relative z-10 flex-shrink-0">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: '22px',
                height: '22px',
                flexShrink: 0,
                background: '#F5F1E8',
                border: '2px solid #9CA3AF',
              }}
            >
              <span
                className="font-bold text-[10px] sm:text-xs"
                style={{ color: getCardColor(position).hex }}
              >
                {cardNumber}
              </span>
            </div>
            <h3
              className="font-bold leading-tight text-sm sm:text-base"
              style={{
                letterSpacing: '-0.01em',
                color: getCardColor(position).hex,
              }}
            >
              {cardTitle}
            </h3>
          </div>

          {/* Main description with styled keywords */}
          <p
            className="leading-relaxed mb-2 sm:mb-2 relative z-10 text-xs sm:text-sm flex-shrink-0"
            style={{
              lineHeight: '1.5',
              fontWeight: 400,
              color: '#4B5563',
            }}
          >
            {position === "left" && (
              <>
                Describe your agent in voice, text, any language. Sena interviews you, captures your intent, and generates a <span style={{ color: getCardColor(position).hex }}>build plan</span> automatically.
              </>
            )}
            {position === "center" && (
              <>
                The Builder Agent pulls components from the <span style={{ color: getCardColor(position).hex }}>Registry</span> and assembles your agent. Tools, skills, triggers, UI, and logic.
              </>
            )}
            {position === "right" && (
              <>
                Your agents go live instantly. Share them on the <span style={{ color: getCardColor(position).hex }}>Registry</span> for others to install, or keep them private. One conversation with Sena handles it all.
              </>
            )}
          </p>

          {/* Feature highlights - matte style, no scrolling, fill remaining space */}
          <div className="space-y-1.5 sm:space-y-2 relative z-10 flex-1 overflow-hidden">
            {position === "left" && (
              <>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Voice & text in 50+ languages</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Express mode for quick builds</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Visual graph builder for power users</span>
                </div>
              </>
            )}

            {position === "center" && (
              <>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Composable Registry of components</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Builder Agent assembles everything</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Publish your own, earn revenue</span>
                </div>
              </>
            )}

            {position === "right" && (
              <>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Agent Apps for every domain</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">One Sena Agent routes everything</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: getCardColor(position).hex,
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Agents get smarter over time</span>
                </div>
              </>
            )}
          </div>

          {/* Footer - Click to learn more */}
          <div className="mt-auto pt-1 relative z-10 flex-shrink-0" style={{ borderTop: `1px solid rgba(180, 170, 160, 0.2)`, background: '#FAF8F5' }}>
            {canClick && !isExpanded && (
              <div className="flex items-center justify-center gap-1 transition-all duration-300 group-hover:gap-1.5">
                <span className="font-medium text-[9px] sm:text-[10px]" style={{ color: getCardColor(position).hex }}>
                  Click to learn more
                </span>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke={getCardColor(position).hex}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Border overlay - sits on top of everything to ensure border is visible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: rotateProgress === 1 ? '2px solid #9CA3AF' : '2px solid transparent',
            transition: 'border-color 0.15s ease-out',
            ...borderRadiusStyle,
            zIndex: 20,
          }}
        />
      </div>
    </div>
  );
}
