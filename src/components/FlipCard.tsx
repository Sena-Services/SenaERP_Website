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
        </div>

        {/* Content section */}
        <div
          className="flex flex-col px-6 py-5"
          style={{
            height: `${100 - VIDEO_HEIGHT_PERCENTAGE}%`,
          }}
        >
          {/* Step number and title */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-md"
              style={{
                width: '32px',
                height: '32px',
                flexShrink: 0,
              }}
            >
              <span className="text-white font-bold" style={{ fontSize: '14px' }}>
                {cardNumber}
              </span>
            </div>
            <h3
              className="font-bold text-gray-900 leading-tight"
              style={{
                fontSize: '18px',
                letterSpacing: '-0.02em',
              }}
            >
              {cardTitle}
            </h3>
          </div>

          {/* Main description */}
          <p
            className="text-gray-700 leading-relaxed mb-4"
            style={{
              fontSize: '13px',
              lineHeight: '1.6',
              fontWeight: 500,
            }}
          >
            {cardDescription}
          </p>

          {/* Feature highlights */}
          <div className="space-y-2.5">
            {position === "left" && (
              <>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Natural language conversation</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Understands your business context</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>No technical knowledge required</span>
                </div>
              </>
            )}
            {position === "center" && (
              <>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Visual preview of your system</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Real-time modifications</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Iterate until perfect</span>
                </div>
              </>
            )}
            {position === "right" && (
              <>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Instant deployment</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Team access from day one</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div
                    className="rounded-full bg-blue-100 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-600"
                    style={{ width: '6px', height: '6px', flexShrink: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontSize: '12px' }}>Cloud-hosted and secure</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
