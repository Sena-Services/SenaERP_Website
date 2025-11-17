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

// Get card-specific color based on position (matching MobileHowItWorks)
const getCardColor = (position: "left" | "center" | "right") => {
  switch (position) {
    case 'left':
      return {
        rgb: '59, 130, 246',    // Blue
        hex: '#3B82F6',
      };
    case 'center':
      return {
        rgb: '139, 92, 246',    // Purple
        hex: '#8B5CF6',
      };
    case 'right':
      return {
        rgb: '236, 72, 153',    // Pink
        hex: '#EC4899',
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

  // When card is expanded, pause video and show static desaturated state
  useEffect(() => {
    if (isExpanded && videoRef.current) {
      // Keep the desaturated aesthetic when expanded
      videoRef.current.style.filter = 'grayscale(90%) brightness(0.85) contrast(0.7)';
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '1';
      }
    } else if (!isExpanded && videoRef.current) {
      videoRef.current.style.filter = 'grayscale(90%) brightness(0.85) contrast(0.7)';
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '1';
      }
    }
  }, [isExpanded]);

  const handleMouseEnter = () => {
    // Allow hover interaction even when expanded
    setIsHovered(true);
    if (videoRef.current) {
      const video = videoRef.current;
      video.style.filter = 'grayscale(60%) brightness(1) contrast(0.9)';
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
      overlayRef.current.style.opacity = '0.2';
    }
  };

  const handleMouseLeave = () => {
    // Reset to static state on mouse leave
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.style.filter = 'grayscale(90%) brightness(0.85) contrast(0.7)';
      videoRef.current.playbackRate = 1; // Reset playback rate
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '1';
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
  const getZIndex = () => {
    if (isExpanded) return 10;
    // When cards are split, give each a unique z-index so they don't overlap
    if (position === "left") return 3;
    if (position === "center") return 2;
    if (position === "right") return 1;
    return 1;
  };

  return (
    <div
      className="relative transition-all duration-700 ease-out"
      style={{
        width: `${cardWidth}px`,
        height: "100%",
        transform: `translateX(${translateX}px) rotateY(${rotateProgress * 180}deg) ${
          isExpanded
            ? 'scale(1.05) translateY(0)' // Don't move card up when expanded, keep it in place
            : 'scale(1) translateY(0)'
        }`,
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
          border: '2px solid #9CA3AF',
          boxSizing: 'border-box',
          // When expanded, keep shadow constant. Only change shadow on hover in normal view
          boxShadow: isHovered && canClick && !isExpanded
            ? '0 28px 80px -16px rgba(0, 0, 0, 0.25), 0 16px 40px -12px rgba(0, 0, 0, 0.15)'
            : '0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 10px 30px -8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-out',
          ...borderRadiusStyle,
          // Balanced gradient - just right amount of color
          background: `linear-gradient(180deg,
            rgba(${getCardColor(position).rgb}, 0.08) 0%,
            rgba(${getCardColor(position).rgb}, 0.06) ${videoHeightPercentage * 0.5}%,
            rgba(${getCardColor(position).rgb}, 0.04) ${videoHeightPercentage}%,
            rgba(${getCardColor(position).rgb}, 0.02) ${videoHeightPercentage + 10}%,
            rgba(255, 255, 255, 0.98) 100%)`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => canClick && !isExpanded && onCardClick()} // Don't allow closing when expanded
      >
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
          }}
        >
          <video
            ref={videoRef}
            className="absolute w-full h-full transition-all duration-300"
            style={{
              filter: 'grayscale(90%) brightness(0.85) contrast(0.7)',
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
          {/* Overlay to further desaturate */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-gray-400/20 pointer-events-none transition-opacity duration-300"
            style={{
              mixBlendMode: 'saturation',
            }}
          />

          {/* Balanced colored gradient overlay - noticeable but not overpowering */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg,
                rgba(${getCardColor(position).rgb}, 0.16) 0%,
                rgba(${getCardColor(position).rgb}, 0.13) 35%,
                rgba(${getCardColor(position).rgb}, 0.10) 65%,
                rgba(${getCardColor(position).rgb}, 0.06) 85%,
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
              background: 'transparent',
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
          {/* Gentle gradient overlay at top of content for seamless transition */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '50%',
              background: `linear-gradient(to bottom,
                rgba(${getCardColor(position).rgb}, 0.05) 0%,
                rgba(${getCardColor(position).rgb}, 0.03) 50%,
                transparent 100%)`,
              zIndex: 0,
            }}
          />

          {/* Step number and title */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 relative z-10 flex-shrink-0">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: '22px',
                height: '22px',
                flexShrink: 0,
                background: getCardColor(position).hex,
                boxShadow: 'none',
              }}
            >
              <span className="text-white font-semibold text-xs sm:text-sm">
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
                Choose your path: have a conversation with Sena or tell it exactly what you need. Either way, it's <span style={{ color: getCardColor(position).hex }}>always business-friendly</span> with zero technical jargon.
              </>
            )}
            {position === "center" && (
              <>
                Walk through every table, workflow, and interface Sena built for you. Make changes, ask questions, and ensure it's <span style={{ color: getCardColor(position).hex }}>exactly right</span>.
              </>
            )}
            {position === "right" && (
              <>
                One click and your custom ERP is live. Your team can start using it immediately—<span style={{ color: getCardColor(position).hex }}>no setup, no installation</span>, no complexity.
              </>
            )}
          </p>

          {/* Feature highlights - matte style, no scrolling, fill remaining space */}
          <div className="space-y-1.5 sm:space-y-2 relative z-10 flex-1 overflow-hidden">
            {position === "left" && (
              <>
                {/* Two modes - simplified */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-full"
                      style={{
                        width: '5px',
                        height: '5px',
                        flexShrink: 0,
                        background: getCardColor(position).hex,
                      }}
                    />
                    <span className="font-semibold text-[10px] sm:text-xs" style={{ color: getCardColor(position).hex }}>DISCOVERY MODE</span>
                    <span className="text-gray-500 text-[9px] sm:text-[10px]">Voice conversations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-full"
                      style={{
                        width: '5px',
                        height: '5px',
                        flexShrink: 0,
                        background: getCardColor(position).hex,
                      }}
                    />
                    <span className="font-semibold text-[10px] sm:text-xs" style={{ color: getCardColor(position).hex }}>EXPRESS MODE</span>
                    <span className="text-gray-500 text-[9px] sm:text-[10px]">Direct text input</span>
                  </div>
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
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Live preview of all changes</span>
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
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Interactive workflow builder</span>
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
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Unlimited iterations</span>
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
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">One-click deployment</span>
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
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Instant team access</span>
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
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Cloud-hosted infrastructure</span>
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
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Enterprise-grade security</span>
                </div>
              </>
            )}
          </div>

          {/* Footer - Click to learn more */}
          <div className="mt-auto pt-1 relative z-10 flex-shrink-0" style={{ borderTop: `1px solid rgba(${getCardColor(position).rgb}, 0.15)` }}>
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
      </div>
    </div>
  );
}
