"use client";

import { useRef } from "react";

// ===== ADJUST THIS VALUE TO CHANGE VIDEO/CONTENT RATIO FOR ALL CARDS =====
// Video takes this percentage, content takes the remainder
// Example: 60 = 60% video, 40% content
const VIDEO_HEIGHT_PERCENTAGE = 60;
// =========================================================================

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
}: FlipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="relative"
      style={{
        width: `${cardWidth}px`,
        height: "100%",
        transform: `rotateY(${rotateProgress * 180}deg)`,
        transformStyle: "preserve-3d",
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
        className="absolute inset-0 overflow-hidden flex flex-col shadow-lg bg-white"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          ...borderRadiusStyle,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Video section */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${VIDEO_HEIGHT_PERCENTAGE}%`,
            borderTopLeftRadius: position === "left" ? `${borderRadius}px` : 0,
            borderTopRightRadius: position === "right" ? `${borderRadius}px` : 0,
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
          className="flex flex-col px-6 pt-3 pb-4 relative"
          style={{
            height: `${100 - VIDEO_HEIGHT_PERCENTAGE}%`,
            background: '#EFF6FF',
          }}
        >

          {/* Step number and title */}
          <div className="flex items-center gap-2.5 mb-2 relative z-10">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: '30px',
                height: '30px',
                flexShrink: 0,
                background: '#3B82F6',
                boxShadow: 'none',
              }}
            >
              <span className="text-white font-semibold" style={{ fontSize: '14px' }}>
                {cardNumber}
              </span>
            </div>
            <h3
              className="font-bold leading-tight"
              style={{
                fontSize: '17px',
                letterSpacing: '-0.01em',
                color: '#1E40AF',
              }}
            >
              {cardTitle}
            </h3>
          </div>

          {/* Main description with styled keywords */}
          <p
            className="leading-relaxed mb-3 relative z-10"
            style={{
              fontSize: '12px',
              lineHeight: '1.6',
              fontWeight: 400,
              color: '#4B5563',
            }}
          >
            {position === "left" && (
              <>
                Share your workflows, challenges, and goals in plain language. Sena asks the right questions to understand exactly what you need—<span style={{ color: '#2563EB' }}>no technical jargon</span> required.
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
          <div className="space-y-2 relative z-10 mb-3">
            {position === "left" && (
              <>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Natural conversation interface</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Context-aware recommendations</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Zero technical knowledge needed</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Guided setup process</span>
                </div>
              </>
            )}

            {position === "center" && (
              <>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Live preview of all changes</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Interactive workflow builder</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Unlimited iterations</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Full customization control</span>
                </div>
              </>
            )}

            {position === "right" && (
              <>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>One-click deployment</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Instant team access</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Cloud-hosted infrastructure</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div
                    className="rounded-full mt-1"
                    style={{
                      width: '5px',
                      height: '5px',
                      flexShrink: 0,
                      background: '#60A5FA',
                    }}
                  />
                  <span className="text-gray-600" style={{ fontSize: '11px', lineHeight: '1.5' }}>Enterprise-grade security</span>
                </div>
              </>
            )}
          </div>

          {/* Footer section */}
          <div className="mt-auto pt-2 border-t border-blue-200/40 relative z-10">
            <p className="text-gray-500 text-[10px]">
              {position === "left" && "Start building in minutes"}
              {position === "center" && "Perfect your system"}
              {position === "right" && "Launch instantly"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
