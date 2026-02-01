"use client";

import { useState, useEffect, useRef } from 'react';
import PinwheelLogo from './PinwheelLogo';

type IntroContentProps = {
  contentOpacity: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

export default function IntroContent({ contentOpacity, scrollRef }: IntroContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(900);
  const localContentRef = useRef<HTMLDivElement>(null);
  const contentRef = scrollRef || localContentRef;
  const [isContentAtBottom, setIsContentAtBottom] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const scrollAttemptRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const isManualScrollRef = useRef(false); // Flag to prevent double-scroll from arrow click

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile scroll exhaustion detection - detects when content reaches bottom and enables page scroll
  useEffect(() => {
    if (!isMobile || !contentRef.current) return;

    const element = contentRef.current;
    let touchStartY = 0;
    let touchCurrentY = 0;
    let isScrollingDown = false;
    let hasTriggeredTransition = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchCurrentY = touchStartY;
      hasTriggeredTransition = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;
      isScrollingDown = deltaY > 0; // Positive delta = scrolling down

      // Check if we're at bottom during the touch move
      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrollBottom = scrollTop + clientHeight;
      const isAtBottom = scrollBottom >= scrollHeight - 5;
      const isScrollable = scrollHeight > clientHeight;

      // If at bottom and trying to scroll down, prevent default and trigger transition
      if ((!isScrollable || isAtBottom) && isScrollingDown && !hasTriggeredTransition) {
        // Prevent rubber-band by stopping the event
        e.preventDefault();
        hasTriggeredTransition = true;

        // Immediately trigger smooth transition
        window.scrollBy({
          top: window.innerHeight * 0.5,
          behavior: 'smooth'
        });
      }
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrollBottom = scrollTop + clientHeight;
      const isAtBottom = scrollBottom >= scrollHeight - 5; // 5px threshold

      setIsContentAtBottom(isAtBottom);
      lastScrollTopRef.current = scrollTop;
    };

    const handleTouchEnd = () => {
      // Skip if arrow button was clicked or transition already triggered
      if (isManualScrollRef.current || hasTriggeredTransition) {
        isManualScrollRef.current = false;
        hasTriggeredTransition = false;
        return;
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false }); // NOT passive - need to preventDefault
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element?.removeEventListener('touchstart', handleTouchStart);
      element?.removeEventListener('touchmove', handleTouchMove);
      element?.removeEventListener('touchend', handleTouchEnd);
      element?.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, contentRef]);

  // Mobile: Hybrid approach - native scroll with smart exhaustion detection
  // Content scrolls first with momentum, then window takes over when exhausted

  // Scale content based on viewport height - fill space while staying responsive
  const getScaledValue = (baseValue: number) => {
    if (isMobile) return baseValue;
    // For laptop/tablet screens, scale proportionally
    // Base height: 910px (middle ground for better balance)
    // This ensures we fill the space on normal screens but scale down on smaller ones
    const heightRatio = viewportHeight / 910;
    return baseValue * heightRatio;
  };

  // Calculate responsive padding values - middle ground
  const topPadding = isMobile ? 16 : getScaledValue(15);
  const bottomPadding = isMobile ? 120 : getScaledValue(77); // Large bottom padding on mobile to clear phone nav bar

  return (
    <div
      ref={contentRef}
      className="relative flex flex-col w-full md:w-[70%] xl:w-[54%] ml-0 md:ml-[5%]"
      style={{
        opacity: contentOpacity,
        pointerEvents: contentOpacity < 0.3 ? "none" : "auto",
        // On mobile, stay within the painting image bounds (respect 6px padding + 8px border radius)
        position: isMobile ? 'absolute' : undefined,
        top: isMobile ? '6px' : undefined, // Match painting's top padding
        left: isMobile ? '6px' : undefined, // Match painting's left padding
        right: isMobile ? '6px' : undefined, // Match painting's right padding
        paddingLeft: isMobile ? '24px' : getScaledValue(40),
        paddingRight: isMobile ? '24px' : getScaledValue(40),
        paddingTop: isMobile ? '50vh' : `${topPadding}px`, // 50vh padding = content shows in bottom half
        paddingBottom: `${bottomPadding}px`,
        minHeight: isMobile ? undefined : '100%',
        height: isMobile ? 'calc(100vh - 6px)' : undefined, // Height minus top padding to stay within bounds
        // Native scroll with iOS momentum - CONTAIN prevents stuck rubber-band
        overflow: isMobile ? 'scroll' : undefined,
        overflowY: isMobile ? 'scroll' : undefined,
        WebkitOverflowScrolling: isMobile ? 'touch' : undefined,
        overscrollBehavior: isMobile ? 'contain' : undefined, // CONTAIN: Prevents scroll chaining but no stuck rubber-band
        // Force iOS to recognize this as a scrollable area
        touchAction: isMobile ? 'pan-y' : undefined,
        zIndex: 10,
        // Match the painting's rounded corners
        borderTopLeftRadius: isMobile ? '8px' : undefined,
        borderTopRightRadius: isMobile ? '8px' : undefined,
      }}
    >
      <div style={{
        marginBottom: `${getScaledValue(15)}px`,
        paddingBottom: `${getScaledValue(15)}px`,
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${getScaledValue(12)}px`,
          marginBottom: `${getScaledValue(8)}px`
        }}>
          <PinwheelLogo
            size={isMobile ? 44 : getScaledValue(55)}
            animationDuration={10}
            showStick={true}
            filter="sepia(100%) saturate(30%) brightness(80%) hue-rotate(-5deg)"
          />
          <span style={{
            fontFamily: "Georgia, serif",
            fontSize: isMobile ? '1.1rem' : `${getScaledValue(22)}px`,
            color: "#8b7355",
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 600,
            lineHeight: 1,
          }}>
            Sena
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Tangerine', 'Edwardian Script ITC', 'Lucida Handwriting', cursive",
            color: isMobile ? "#5a4938" : "#8b7355",
            fontSize: isMobile ? '2.75rem' : `${getScaledValue(58)}px`,
            fontWeight: 700,
            letterSpacing: '0.015em',
            marginBottom: `${getScaledValue(2)}px`,
            lineHeight: 1.3,
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            textShadow: isMobile ? '0 3px 12px rgba(255, 255, 255, 1), 0 2px 8px rgba(255, 255, 255, 0.95), 0 1px 4px rgba(0, 0, 0, 0.3)' : undefined,
          }}
        >
          Speak your business into existence
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            color: isMobile ? "#4a3d30" : "#8b7355",
            fontStyle: "normal",
            fontSize: isMobile ? '0.875rem' : `${getScaledValue(18)}px`,
            marginTop: `${getScaledValue(0)}px`,
            lineHeight: 1.5,
            letterSpacing: '0.02em',
            fontWeight: 500,
            textShadow: isMobile ? '0 2px 8px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(0, 0, 0, 0.25)' : undefined,
          }}
        >
          Craft your own ERP, from the ground up
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: `${getScaledValue(12)}px`, position: 'relative', marginTop: `${getScaledValue(15)}px`, paddingTop: `${getScaledValue(20)}px` }}>
        {/* Mission Statement label with fading line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          gap: `${getScaledValue(10)}px`,
        }}>
          <span style={{
            fontFamily: "Georgia, serif",
            color: "#6B5744",
            fontSize: isMobile ? '8px' : `${getScaledValue(10)}px`,
            textTransform: 'uppercase',
            letterSpacing: "0.15em",
            fontWeight: 600,
            whiteSpace: 'nowrap',
            textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : undefined,
          }}>Mission Statement</span>
          <div style={{
            width: isMobile ? '60px' : `${getScaledValue(120)}px`,
            height: '1px',
            background: 'linear-gradient(to right, rgba(139, 115, 85, 0.6), transparent)'
          }}></div>
        </div>

        {/* Intro paragraph */}
        <p
          style={{
            fontFamily: "Georgia, serif",
            color: isMobile ? "#3d3226" : "#6b5d4f",
            fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
            lineHeight: 1.6,
            fontWeight: isMobile ? 500 : 400,
            margin: 0,
            textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85), 0 1px 3px rgba(0, 0, 0, 0.2)' : undefined,
          }}
        >
          Sena is the agentic enterprise platform where businesses can become AI-first. To achieve this, we're rethinking ERPs from first principles — built on three pillars:
        </p>

        {/* Three Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${getScaledValue(12)}px`, marginTop: `${getScaledValue(4)}px` }}>
          {/* Pillar 1: Custom ERP */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: `${getScaledValue(10)}px` }}>
            <span style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#5a4938" : "#8b7355",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
              fontWeight: 600,
              minWidth: isMobile ? '22px' : `${getScaledValue(26)}px`,
              flexShrink: 0,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : undefined,
            }}>01</span>
            <p style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#3d3226" : "#6b5d4f",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
              lineHeight: 1.6,
              margin: 0,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85)' : undefined,
            }}><strong>Custom ERP</strong> : Your ERP should be a direct extension of how your business actually operates. Not locked into rigid templates, never trapped in boxes someone else designed.</p>
          </div>

          {/* Pillar 2: AI Agents */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: `${getScaledValue(10)}px` }}>
            <span style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#5a4938" : "#8b7355",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
              fontWeight: 600,
              minWidth: isMobile ? '22px' : `${getScaledValue(26)}px`,
              flexShrink: 0,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : undefined,
            }}>02</span>
            <p style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#3d3226" : "#6b5d4f",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
              lineHeight: 1.6,
              margin: 0,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85)' : undefined,
            }}><strong>AI Agents</strong> : An ERP isn't just a system of records. It's a workstation where humans and AI agents collaborate — virtual employees running your operations, tirelessly.</p>
          </div>

          {/* Pillar 3: Democratized Access */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: `${getScaledValue(10)}px` }}>
            <span style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#5a4938" : "#8b7355",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
              fontWeight: 600,
              minWidth: isMobile ? '22px' : `${getScaledValue(26)}px`,
              flexShrink: 0,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : undefined,
            }}>03</span>
            <p style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#3d3226" : "#6b5d4f",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
              lineHeight: 1.6,
              margin: 0,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85)' : undefined,
            }}><strong>Democratized Access</strong> : Zero technical skills required. Whether you're a founder or a manager, you hold the brush. If you can describe it, you can build it.</p>
          </div>
        </div>

        {/* Watch our video link with hover preview */}
        <div
          style={{
            marginTop: `${getScaledValue(12)}px`,
            position: 'relative',
          }}
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
        >
          <a
            href="https://www.youtube.com/watch?v=VAZctriaoUg"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsVideoHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <span style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#5a4938" : "#8b7355",
              fontSize: isMobile ? '0.75rem' : `${getScaledValue(13)}px`,
              fontWeight: 500,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : undefined,
            }}>Watch our intro video</span>
            <svg
              width={isMobile ? 14 : getScaledValue(16)}
              height={isMobile ? 14 : getScaledValue(16)}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isMobile ? "#5a4938" : "#8b7355"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isVideoHovered ? 'translateX(3px)' : 'translateX(0)',
                transition: 'transform 0.2s ease',
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          {/* Video preview overlay */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              paddingTop: '8px',
              width: isMobile ? '200px' : `${getScaledValue(280)}px`,
              opacity: isVideoHovered ? 1 : 0,
              transform: isVideoHovered ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isVideoHovered ? 'auto' : 'none',
              zIndex: 100,
            }}
            onMouseEnter={() => setIsVideoHovered(true)}
            onMouseLeave={() => setIsVideoHovered(false)}
          >
            <a
              href="https://www.youtube.com/watch?v=VAZctriaoUg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsVideoHovered(false)}
              style={{
                display: 'block',
                borderRadius: `${getScaledValue(12)}px`,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)',
                textDecoration: 'none',
              }}
            >
              {/* Video preview */}
              <div style={{
                position: 'relative',
                overflow: 'hidden',
              }}>
                <video
                  src="/videos/sena-preview.mp4"
                  loop
                  playsInline
                  muted
                  ref={(el) => {
                    if (el) {
                      if (isVideoHovered) {
                        el.play().then(() => {
                          // Unmute after play starts (works around autoplay restrictions)
                          el.muted = false;
                        }).catch(() => {});
                      } else {
                        el.pause();
                        el.currentTime = 0;
                        el.muted = true;
                      }
                    }
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    pointerEvents: 'none',
                  }}
                />
                {/* Sena text overlay */}
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  fontFamily: "'Tangerine', cursive",
                  fontSize: '28px',
                  color: 'white',
                  pointerEvents: 'none',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}>Sena</span>
              </div>
            </a>
          </div>
        </div>

        <div style={{ marginTop: `${getScaledValue(10)}px`, paddingTop: `${getScaledValue(10)}px`, position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: isMobile ? '100px' : `${getScaledValue(200)}px`,
            height: '1px',
            background: 'linear-gradient(to left, rgba(139, 115, 85, 0.6), transparent)'
          }}></div>
        </div>
      </div>
{/* footer */}
      <div style={{
        position: isMobile ? 'relative' : 'absolute',
        bottom: isMobile ? undefined : `${getScaledValue(19)}px`,
        left: isMobile ? undefined : getScaledValue(40),
        right: isMobile ? undefined : 'auto',
        marginTop: isMobile ? '24px' : undefined,
        width: 'auto',
        maxWidth: isMobile ? '100%' : 'min(900px, 90%)',
      }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${getScaledValue(9)}px`,
            padding: isMobile ? '12px' : `${getScaledValue(16)}px`,
            borderRadius: isMobile ? '16px' : `${getScaledValue(24)}px`,
            background: "rgba(255,255,255,0.4)",
            backdropFilter: "blur(12px)",
            border: "2px solid #9CA3AF",
            boxShadow: '0 4px 12px rgba(156, 163, 175, 0.15)',
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, serif",
              color: "#6B5744",
              fontSize: isMobile ? '10px' : `${getScaledValue(12.5)}px`,
              textTransform: 'uppercase',
              letterSpacing: "0.18em",
              fontWeight: 600,
            }}
          >
            The ERP you'll never touch
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              color: "#6b5d4f",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(16)}px`,
              lineHeight: 1.6,
            }}
          >
            No dashboards to navigate. No databases to manage. Just tell your agents what you need. They'll handle the rest—and get smarter with every interaction.
          </p>
          <div className="h-px bg-gray-400/40 w-full" style={{ marginTop: `${getScaledValue(7)}px` }}></div>
          <div className="flex items-center justify-between" style={{ paddingTop: `${getScaledValue(7)}px` }}>
            <p
              style={{
                fontFamily: "Georgia, serif",
                color: "#6B5744",
                fontStyle: "italic",
                fontSize: isMobile ? '10px' : `${getScaledValue(13.5)}px`,
              }}
            >
              Meet your new operations team
            </p>
            <svg
              className="text-gray-600 animate-bounce cursor-pointer"
              style={{ width: `${getScaledValue(17)}px`, height: `${getScaledValue(17)}px` }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              onClick={() => {
                if (isMobile) {
                  // Set flag to prevent double-scroll from touch handler
                  isManualScrollRef.current = true;
                  // Mobile: Smooth scroll down (same effect as scroll exhaustion)
                  window.scrollBy({
                    top: window.innerHeight * 0.5,
                    behavior: 'smooth'
                  });
                } else {
                  // Desktop: Trigger the animation sequence
                  window.dispatchEvent(new CustomEvent('triggerScrollAnimation'));
                }
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
