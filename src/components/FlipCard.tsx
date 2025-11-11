"use client";

import { useRef, useState, useEffect } from "react";

// ===== ADJUST THIS VALUE TO CHANGE VIDEO/CONTENT RATIO FOR ALL CARDS =====
// Video takes this percentage, content takes the remainder
// Example: 60 = 60% video, 40% content
// Responsive: smaller screens need more space for content
const getVideoHeightPercentage = () => {
  if (typeof window === 'undefined') return 50;
  const height = window.innerHeight;
  // Smaller screens (laptops): give more space for content
  if (height < 800) return 45;
  // Medium screens: balanced
  if (height < 1000) return 50;
  // Large screens: more space for video
  return 55;
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

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.style.filter = 'grayscale(60%) brightness(1) contrast(0.9)';
      videoRef.current.playbackRate = 0.65; // Slow down the video
      videoRef.current.play().catch(err => console.log('Play error:', err));
    }
    if (overlayRef.current) {
      overlayRef.current.style.opacity = '0.2';
    }
  };

  const handleMouseLeave = () => {
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
      : { borderRadius: 0 };

  const isExpanded = expandedCard === position;
  const isOtherExpanded = expandedCard !== null && expandedCard !== position;
  const canClick = rotateProgress === 1; // Only clickable when fully flipped

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
            ? 'scale(1.05) translateY(0)'
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
          <img
            src="/illustrations/monet-intro-expanded2.png"
            alt="Monet painting"
            className="absolute inset-0 w-full h-full object-cover object-center md:object-right"
            style={{
              opacity: 0.95,
            }}
          />
        </div>
      </div>

      {/* Back face - How It Works card */}
      <div
        className="absolute inset-0 overflow-hidden flex flex-col bg-white group cursor-pointer transition-all duration-300"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          ...borderRadiusStyle,
          cursor: canClick ? 'pointer' : 'default',
          border: '2px solid #9CA3AF',
          boxSizing: 'border-box',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => canClick && onCardClick()}
      >
        {/* Hover overlay for better feedback */}
        {canClick && !isExpanded && (
          <div
            className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
            style={{
              mixBlendMode: 'multiply',
            }}
          />
        )}
        {/* Video section */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${videoHeightPercentage}%`,
            borderTopLeftRadius: position === "left" ? `${borderRadius - 2}px` : 0,
            borderTopRightRadius: position === "right" ? `${borderRadius - 2}px` : 0,
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
          {/* Subtle multi-layer blend effect */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '5%',
              background: 'linear-gradient(to bottom, rgba(239, 246, 255, 0) 0%, rgba(239, 246, 255, 0.4) 50%, #EFF6FF 100%)',
              filter: 'blur(1px)',
            }}
          />
          {/* Secondary sharper gradient on top */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '3%',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(239, 246, 255, 0.7) 50%, #EFF6FF 100%)',
            }}
          />
        </div>

        {/* Content section - all blue now */}
        <div
          className="flex flex-col px-4 sm:px-6 pt-2 sm:pt-3 pb-3 sm:pb-4 relative overflow-y-auto"
          style={{
            height: `${100 - videoHeightPercentage}%`,
            background: '#EFF6FF',
          }}
        >

          {/* Step number and title */}
          <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2 relative z-10 flex-shrink-0">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: '28px',
                height: '28px',
                flexShrink: 0,
                background: '#3B82F6',
                boxShadow: 'none',
              }}
            >
              <span className="text-white font-semibold text-sm sm:text-base">
                {cardNumber}
              </span>
            </div>
            <h3
              className="font-bold leading-tight text-base sm:text-lg"
              style={{
                letterSpacing: '-0.01em',
                color: '#1E40AF',
              }}
            >
              {cardTitle}
            </h3>
          </div>

          {/* Main description with styled keywords */}
          <p
            className="leading-relaxed mb-2 sm:mb-3 relative z-10 text-xs sm:text-sm flex-shrink-0"
            style={{
              lineHeight: '1.5',
              fontWeight: 400,
              color: '#4B5563',
            }}
          >
            {position === "left" && (
              <>
                Choose your path: have a conversation with Sena or tell her exactly what you need. Either way, it's <span style={{ color: '#2563EB' }}>always business-friendly</span> with zero technical jargon.
              </>
            )}
            {position === "center" && (
              <>
                Walk through every table, workflow, and interface Sena built for you. Make changes, ask questions, and <span style={{ color: '#2563EB' }}>iterate in real-time</span> until it's exactly right.
              </>
            )}
            {position === "right" && (
              <>
                One click and your custom ERP is live. Your team can start using it immediately—<span style={{ color: '#2563EB' }}>no setup, no installation</span>, no complexity.
              </>
            )}
          </p>

          {/* Feature highlights - matte style */}
          <div className="space-y-1.5 sm:space-y-2 relative z-10 mb-2 sm:mb-3 flex-1 overflow-y-auto">
            {position === "left" && (
              <>
                {/* Discovery Mode */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="text-blue-700 font-semibold text-[10px] sm:text-xs" style={{ letterSpacing: '0.02em' }}>DISCOVERY MODE</span>
                    <span className="text-gray-500 text-[9px] sm:text-[11px]">• Voice</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div
                        className="rounded-full mt-0.5 sm:mt-1"
                        style={{
                          width: '4px',
                          height: '4px',
                          flexShrink: 0,
                          background: '#60A5FA',
                        }}
                      />
                      <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Multilingual voice conversations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div
                        className="rounded-full mt-0.5 sm:mt-1"
                        style={{
                          width: '4px',
                          height: '4px',
                          flexShrink: 0,
                          background: '#60A5FA',
                        }}
                      />
                      <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Asks questions like a co-founder</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div
                        className="rounded-full mt-0.5 sm:mt-1"
                        style={{
                          width: '4px',
                          height: '4px',
                          flexShrink: 0,
                          background: '#60A5FA',
                        }}
                      />
                      <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Deeply understands your operations</span>
                    </div>
                  </div>
                </div>

                {/* Express Mode */}
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="text-blue-700 font-semibold text-[10px] sm:text-xs" style={{ letterSpacing: '0.02em' }}>EXPRESS MODE</span>
                    <span className="text-gray-500 text-[9px] sm:text-[11px]">• Text</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <div
                        className="rounded-full mt-0.5 sm:mt-1"
                        style={{
                          width: '4px',
                          height: '4px',
                          flexShrink: 0,
                          background: '#60A5FA',
                        }}
                      />
                      <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Direct text-based control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div
                        className="rounded-full mt-0.5 sm:mt-1"
                        style={{
                          width: '4px',
                          height: '4px',
                          flexShrink: 0,
                          background: '#60A5FA',
                        }}
                      />
                      <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Tell Sena exactly what you want</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div
                        className="rounded-full mt-0.5 sm:mt-1"
                        style={{
                          width: '4px',
                          height: '4px',
                          flexShrink: 0,
                          background: '#60A5FA',
                        }}
                      />
                      <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Get instant results, zero back-and-forth</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {position === "center" && (
              <>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Live preview of all changes</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Interactive workflow builder</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Unlimited iterations</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Full customization control</span>
                </div>
              </>
            )}

            {position === "right" && (
              <>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">One-click deployment</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Instant team access</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Cloud-hosted infrastructure</span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className="rounded-full mt-0.5 sm:mt-1"
                    style={{
                      width: '4px',
                      height: '4px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600 text-[10px] sm:text-xs leading-tight">Enterprise-grade security</span>
                </div>
              </>
            )}
          </div>

          {/* Footer section */}
          <div className="mt-auto pt-1.5 sm:pt-2 border-t border-blue-200/40 relative z-10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-[9px] sm:text-[10px]">
                {position === "left" && "Start building in minutes"}
                {position === "center" && "Perfect your system"}
                {position === "right" && "Launch instantly"}
              </p>
              {canClick && !isExpanded && (
                <div className="flex items-center gap-1 sm:gap-1.5 transition-all duration-300 group-hover:gap-2">
                  <span className="text-blue-600 font-medium text-[9px] sm:text-[10px] group-hover:text-blue-700">
                    Learn more
                  </span>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600 group-hover:text-blue-700"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
