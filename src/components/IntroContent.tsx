"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PinwheelLogo from './PinwheelLogo';
import SignupModal from './SignupModal';
import Toast from './Toast';

type IntroContentProps = {
  contentOpacity: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

export default function IntroContent({ contentOpacity, scrollRef }: IntroContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(900);
  const localContentRef = useRef<HTMLDivElement>(null);
  const contentRef = scrollRef || localContentRef;
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const [isLaunchNotesHovered, setIsLaunchNotesHovered] = useState(false);
  const [isPitchHovered, setIsPitchHovered] = useState(false);
  const [isPdfHovered, setIsPdfHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pdfHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const { scrollTop } = element;
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

  // Video hover play/pause control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVideoHovered && isVideoReady) {
      video.currentTime = 0;
      video.muted = true; // Start muted (required for autoplay)
      video.play().then(() => {
        // Unmute after playback starts - this works in most browsers after user interaction
        video.muted = false;
      }).catch(() => {});
    } else if (!isVideoHovered) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
    }
  }, [isVideoHovered, isVideoReady]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (videoHoverTimeoutRef.current) {
        clearTimeout(videoHoverTimeoutRef.current);
      }
      if (pdfHoverTimeoutRef.current) {
        clearTimeout(pdfHoverTimeoutRef.current);
      }
    };
  }, []);

  // Hover handlers with debounce to prevent flicker
  const handleVideoHoverEnter = () => {
    if (videoHoverTimeoutRef.current) {
      clearTimeout(videoHoverTimeoutRef.current);
      videoHoverTimeoutRef.current = null;
    }
    setIsVideoHovered(true);
  };

  const handleVideoHoverLeave = () => {
    videoHoverTimeoutRef.current = setTimeout(() => {
      setIsVideoHovered(false);
    }, 100);
  };

  // Hover handlers for PDF preview with debounce
  const handlePdfHoverEnter = () => {
    if (pdfHoverTimeoutRef.current) {
      clearTimeout(pdfHoverTimeoutRef.current);
      pdfHoverTimeoutRef.current = null;
    }
    setIsPdfHovered(true);
  };

  const handlePdfHoverLeave = () => {
    pdfHoverTimeoutRef.current = setTimeout(() => {
      setIsPdfHovered(false);
    }, 100);
  };


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
          gap: `${getScaledValue(4)}px`,
          marginBottom: `${getScaledValue(8)}px`
        }}>
          <PinwheelLogo
            size={isMobile ? 44 : getScaledValue(55)}
            animationDuration={10}
            showStick={true}
            filter="sepia(100%) saturate(30%) brightness(80%) hue-rotate(-5deg)"
          />
          <Image
            src="/sena-wordmark.png"
            alt="Sena"
            width={200}
            height={50}
            style={{
              height: isMobile ? '32px' : `${getScaledValue(44)}px`,
              width: 'auto',
              filter: 'sepia(100%) saturate(30%) brightness(80%) hue-rotate(-5deg)',
            }}
          />
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
          Speak your agents into existence
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
          Build it. Run it. Share it.
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
          We are stepping into an age of abundance created by AI. Every person deserves to shape this future with their own arsenal of agents. Sena is where anyone can build them. Built on three pillars:
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
            }}><strong>Build</strong> : Describe your agent in a sentence and let Sena handle the rest. Or take full control and wire every detail yourself. Both paths lead to the same place.</p>
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
            }}><strong>Run</strong> : Reliable agents hosted on your site, running in parallel, on schedule, with full observability. Every action logged, every decision traceable.</p>
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
            }}><strong>Share</strong> : Publish your agents, tools, and skills to the Registry, a marketplace where creators earn from their work. Build a great agent, and everyone who installs it pays you.</p>
          </div>
        </div>

        {/* Links section - aligned */}
        <div style={{
          marginTop: `${getScaledValue(12)}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: `${getScaledValue(10)}px`,
        }}>
          {/* Launch notes link */}
          <Link
            href="/v01-beta"
            onMouseEnter={() => setIsLaunchNotesHovered(true)}
            onMouseLeave={() => setIsLaunchNotesHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: `${getScaledValue(6)}px`,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <span style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#5a4938" : "#7a5f3a",
              fontSize: isMobile ? '0.85rem' : `${getScaledValue(16)}px`,
              fontWeight: 500,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : '0 0 12px rgba(194, 160, 100, 0.4), 0 0 4px rgba(194, 160, 100, 0.2)',
              whiteSpace: 'nowrap',
            }}>Read our v0.1 Beta launch notes</span>
            <svg
              width={isMobile ? 16 : getScaledValue(18)}
              height={isMobile ? 16 : getScaledValue(18)}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isMobile ? "#5a4938" : "#7a5f3a"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isLaunchNotesHovered ? 'translateX(3px)' : 'translateX(0)',
                transition: 'transform 0.2s ease',
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {/* Watch our video link with hover preview */}
          <div
            style={{ position: 'relative', display: 'flex' }}
          >
            <a
              href="https://www.youtube.com/watch?v=VAZctriaoUg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsVideoHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: `${getScaledValue(6)}px`,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <span style={{
                fontFamily: "Georgia, serif",
                color: isMobile ? "#5a4938" : "#7a5f3a",
                fontSize: isMobile ? '0.85rem' : `${getScaledValue(16)}px`,
                fontWeight: 500,
                textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : '0 0 12px rgba(194, 160, 100, 0.4), 0 0 4px rgba(194, 160, 100, 0.2)',
                width: isMobile ? '150px' : `${getScaledValue(165)}px`,
              }}
                onMouseEnter={handleVideoHoverEnter}
                onMouseLeave={handleVideoHoverLeave}
              >Watch our intro video</span>
              <svg
                width={isMobile ? 16 : getScaledValue(18)}
                height={isMobile ? 16 : getScaledValue(18)}
                viewBox="0 0 24 24"
                fill="none"
                stroke={isMobile ? "#5a4938" : "#7a5f3a"}
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

            {/* Video preview popup - positioned to the right */}
            {!isMobile && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${getScaledValue(235)}px`,
                  transform: isVideoHovered ? 'translateY(-50%) scale(1)' : 'translateY(-50%) translateX(-8px) scale(0.97)',
                  width: `${getScaledValue(280)}px`,
                  opacity: isVideoHovered ? 1 : 0,
                  visibility: isVideoHovered ? 'visible' : 'hidden',
                  transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease',
                  zIndex: 100,
                }}
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
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
                    textDecoration: 'none',
                    background: '#000',
                  }}
                >
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                  }}>
                    <video
                      ref={videoRef}
                      src="/videos/sena-preview.mp4"
                      loop
                      playsInline
                      muted
                      preload="auto"
                      onCanPlayThrough={() => setIsVideoReady(true)}
                      onLoadedData={() => setIsVideoReady(true)}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Play icon overlay when video not playing */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.2)',
                      opacity: isVideoHovered && isVideoReady ? 0 : 1,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    {/* Sena text overlay */}
                    <span style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      fontFamily: "'Tangerine', cursive",
                      fontSize: '24px',
                      color: 'white',
                      pointerEvents: 'none',
                      textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    }}>Sena</span>
                  </div>
                  {/* Click to watch caption */}
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(90, 73, 56, 0.9)',
                    fontFamily: "Georgia, serif",
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.9)',
                    textAlign: 'center',
                    letterSpacing: '0.03em',
                  }}>
                    Click to watch full video
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Download one pager link with hover preview */}
          <div
            style={{ position: 'relative', display: 'flex' }}
          >
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              onMouseEnter={handlePdfHoverEnter}
              onMouseLeave={handlePdfHoverLeave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: `${getScaledValue(6)}px`,
                cursor: 'pointer',
                textDecoration: 'none',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              <span style={{
                fontFamily: "Georgia, serif",
                color: isMobile ? "#5a4938" : "#7a5f3a",
                fontSize: isMobile ? '0.85rem' : `${getScaledValue(16)}px`,
                fontWeight: 500,
                textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : '0 0 12px rgba(194, 160, 100, 0.4), 0 0 4px rgba(194, 160, 100, 0.2)',
                whiteSpace: 'nowrap',
              }}>Download our one pager</span>
              <svg
                width={isMobile ? 16 : getScaledValue(18)}
                height={isMobile ? 16 : getScaledValue(18)}
                viewBox="0 0 24 24"
                fill="none"
                stroke={isMobile ? "#5a4938" : "#7a5f3a"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isPdfHovered ? 'translateX(3px)' : 'translateX(0)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            {/* PDF preview popup - positioned to the right */}
            {!isMobile && (
              <div
                onMouseEnter={handlePdfHoverEnter}
                onMouseLeave={handlePdfHoverLeave}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${getScaledValue(235)}px`,
                  transform: isPdfHovered ? 'translateY(-50%) scale(1)' : 'translateY(-50%) translateX(-8px) scale(0.97)',
                  width: `${getScaledValue(280)}px`,
                  opacity: isPdfHovered ? 1 : 0,
                  visibility: isPdfHovered ? 'visible' : 'hidden',
                  transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease',
                  zIndex: 100,
                }}
              >
                <button
                  aria-label="Preview PDF"
                  onClick={() => {
                    setIsPdfHovered(false);
                    setIsDownloadModalOpen(true);
                  }}
                  style={{
                    display: 'block',
                    borderRadius: `${getScaledValue(12)}px`,
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    background: '#f5f0eb',
                    border: 'none',
                    padding: 0,
                  }}
                  className="focus-visible:ring-2 focus-visible:ring-[#8FB7C5]"
                >
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <Image
                      src="/documents/sena-one-pager-thumb.png"
                      alt="Sena One Pager Preview"
                      width={280}
                      height={396}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  {/* Click to download caption */}
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(90, 73, 56, 0.9)',
                    fontFamily: "Georgia, serif",
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.9)',
                    textAlign: 'center',
                    letterSpacing: '0.03em',
                  }}>
                    Click to download
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Request Pitch Deck link */}
          <button
            onClick={() => setIsSignupModalOpen(true)}
            onMouseEnter={() => setIsPitchHovered(true)}
            onMouseLeave={() => setIsPitchHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: `${getScaledValue(6)}px`,
              cursor: 'pointer',
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            <span style={{
              fontFamily: "Georgia, serif",
              color: isMobile ? "#5a4938" : "#7a5f3a",
              fontSize: isMobile ? '0.85rem' : `${getScaledValue(16)}px`,
              fontWeight: 500,
              textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : '0 0 12px rgba(194, 160, 100, 0.4), 0 0 4px rgba(194, 160, 100, 0.2)',
              whiteSpace: 'nowrap',
            }}>Request Pitch Deck</span>
            <svg
              width={isMobile ? 16 : getScaledValue(18)}
              height={isMobile ? 16 : getScaledValue(18)}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isMobile ? "#5a4938" : "#7a5f3a"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isPitchHovered ? 'translateX(3px)' : 'translateX(0)',
                transition: 'transform 0.2s ease',
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
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
            One conversation. Everything handled.
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              color: "#6b5d4f",
              fontSize: isMobile ? '0.8125rem' : `${getScaledValue(16)}px`,
              lineHeight: 1.6,
            }}
          >
            Talk to Sena and it figures out which agent handles what. You never need to know what&apos;s running behind the scenes. Just say what you need.
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
              Scroll to see how it works
            </p>
            <button
              aria-label="Scroll down"
              onClick={() => {
                if (isMobile) {
                  isManualScrollRef.current = true;
                  window.scrollBy({
                    top: window.innerHeight * 0.5,
                    behavior: 'smooth'
                  });
                } else {
                  window.dispatchEvent(new CustomEvent('triggerScrollAnimation'));
                }
              }}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              className="focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:ring-offset-2 rounded"
            >
              <svg
                className="text-gray-600 animate-bounce"
                style={{ width: `${getScaledValue(17)}px`, height: `${getScaledValue(17)}px` }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Download One Pager Confirmation Modal */}
      {isDownloadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setIsDownloadModalOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsDownloadModalOpen(false); }}
        >
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />
          <div
            style={{
              position: 'relative',
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontFamily: 'Futura, sans-serif',
              fontSize: '22px',
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: '8px',
            }}>Download One Pager</h3>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px',
            }}>Would you like to download the Sena one pager?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >Cancel</button>
              <a
                href="/documents/sena-one-pager.pdf"
                download="Sena-One-Pager.pdf"
                onClick={() => setIsDownloadModalOpen(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#8FB7C5',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >Yes, download</a>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={(message) => {
          setToastMessage(message);
          setShowToast(true);
        }}
        initialView="pitch_deck"
      />

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
