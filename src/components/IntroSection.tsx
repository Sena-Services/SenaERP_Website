"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";

const SHRINK_SCROLL_DISTANCE = 900;

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 900
  );

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
      const distance = Math.min(
        Math.max(scrollY - sectionTop, 0),
        SHRINK_SCROLL_DISTANCE
      );
      setScrollProgress(distance / SHRINK_SCROLL_DISTANCE);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const targetWidth = Math.min(1280, viewportWidth - 64);
  const startWidth = Math.max(viewportWidth * 0.95, targetWidth);
  const currentWidthValue =
    startWidth - (startWidth - targetWidth) * scrollProgress;
  const currentWidth =
    viewportWidth === 0 ? "95vw" : `${currentWidthValue}px`;

  const startHeight = viewportHeight * 0.92;
  const targetHeight = Math.max(viewportHeight * 0.6, 520);
  const currentHeightValue =
    startHeight - (startHeight - targetHeight) * scrollProgress;
  const currentHeight =
    viewportHeight === 0 ? "92vh" : `${currentHeightValue}px`;

  const borderRadius = 32 + scrollProgress * 16;
  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.2);
  const elevation =
    scrollProgress < 1
      ? "0 20px 60px -12px rgba(0, 0, 0, 0.15)"
      : "0 12px 32px -10px rgba(0, 0, 0, 0.12)";
  const sectionHeight = targetHeight + SHRINK_SCROLL_DISTANCE;
  const stickyFrameHeight = currentHeightValue;

  const navWidthRatio =
    viewportWidth >= 1280
      ? 0.45
      : viewportWidth >= 1024
      ? 2 / 3
      : viewportWidth >= 768
      ? 0.75
      : 1;
  const navMarginRatio = viewportWidth >= 768 ? 0.05 : 0;
  const navTranslatePx =
    viewportWidth === 0
      ? 0
      : (currentWidthValue / 2 -
          currentWidthValue * (navMarginRatio + navWidthRatio / 2)) *
        scrollProgress;

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
        className="sticky top-0 flex items-start justify-center w-full"
        style={{
          height: `${stickyFrameHeight}px`,
          paddingTop: `${16 + scrollProgress * 32}px`,
        }}
      >
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: currentWidth,
            maxWidth: "95vw",
            height: currentHeight,
            backgroundColor: "#EBE5D9",
            borderRadius: `${borderRadius}px`,
            boxShadow: elevation,
            transition: "box-shadow 200ms ease",
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

          <div
            className="absolute top-0 z-50 w-full md:w-3/4 lg:w-2/3 xl:w-[45%] px-4 sm:px-8 md:px-10 lg:px-16 ml-0 md:ml-[5%]"
            style={{
              transform: `translateX(${navTranslatePx}px)`,
              transition: "transform 200ms ease",
            }}
          >
            <NavBar />
          </div>

          <div
            className="relative z-10 h-full flex flex-col w-full md:w-[85%] lg:w-[70%] xl:w-[60%] px-4 sm:px-8 md:px-10 lg:px-16 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-40 sm:pb-44 md:pb-48 lg:pb-52 ml-0 md:ml-[5%]"
            style={{
              opacity: contentOpacity,
              pointerEvents: contentOpacity < 0.3 ? "none" : "auto",
            }}
          >
            <div className="mb-4 md:mb-5">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-1.5 md:mb-2 leading-tight"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "#2C1810",
                }}
              >
                Compose your business like a painting
              </h1>
              <p
                className="text-base sm:text-lg md:text-xl mt-1.5 md:mt-2"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "#5A4A3A",
                  fontStyle: "italic",
                }}
              >
                Every stroke deliberate. Every layer connected.
              </p>
            </div>

            <div className="space-y-2.5 md:space-y-3">
              <p
                className="text-sm sm:text-base md:text-lg leading-relaxed"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "#3A3A3A",
                }}
              >
                We believe software should be as expressive as art. Not locked in
                rigid templates, not trapped in boxes someone else designed.
              </p>

              <p
                className="text-sm sm:text-base md:text-lg leading-relaxed"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "#3A3A3A",
                }}
              >
                Sena is a canvas where your business takes shape—built from
                composable pieces that adapt to your vision, orchestrated by AI
                that understands your intent.
              </p>

              <div className="space-y-1.5 md:space-y-2 pt-1.5">
                <div className="flex items-start gap-2 md:gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-gray-800 mt-1.5"></div>
                  <p
                    className="text-xs sm:text-sm md:text-base flex-1"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: "#3A3A3A",
                    }}
                  >
                    Start with primitives—databases, workflows, UI components—and
                    combine them like brushstrokes
                  </p>
                </div>
                <div className="flex items-start gap-2 md:gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-gray-800 mt-1.5"></div>
                  <p
                    className="text-xs sm:text-sm md:text-base flex-1"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: "#3A3A3A",
                    }}
                  >
                    Describe what you need in natural language, and watch AI
                    architect the solution
                  </p>
                </div>
                <div className="flex items-start gap-2 md:gap-2.5">
                  <div className="w-1 h-1 rounded-full bg-gray-800 mt-1.5"></div>
                  <p
                    className="text-xs sm:text-sm md:text-base flex-1"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: "#3A3A3A",
                    }}
                  >
                    Let intelligent agents handle the mundane while you focus on
                    what matters
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-gray-400/30">
                <div className="relative">
                  <div className="absolute -top-5 md:-top-6 left-0 w-10 md:w-12 h-px bg-gradient-to-r from-gray-600/60 to-transparent"></div>
                  <p
                    className="text-sm sm:text-base md:text-lg leading-relaxed"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      color: "#4A3A2A",
                      lineHeight: "1.7",
                    }}
                  >
                    From CRM to invoicing, analytics to automation—your entire
                    operating system, composed exactly as you envision it.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-4 sm:left-8 md:left-10 lg:left-16 right-4 sm:right-auto w-auto sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%]">
              <div
                className="space-y-2 md:space-y-2.5 p-3 sm:p-4 md:p-5 rounded-lg md:rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <p
                  className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold"
                  style={{
                    fontFamily: "Georgia, serif",
                    color: "#6B5744",
                    letterSpacing: "0.18em",
                  }}
                >
                  Built for creators, not corporations
                </p>
                <p
                  className="text-xs sm:text-sm md:text-base leading-relaxed"
                  style={{
                    fontFamily: "Georgia, serif",
                    color: "#2C1810",
                    lineHeight: "1.6",
                  }}
                >
                  No rigid workflows. No endless configuration. No armies of
                  consultants. Just you, your vision, and an intelligent system
                  that grows with your imagination.
                </p>
                <div className="h-px bg-gray-400/40 w-full mt-2 md:mt-3"></div>
                <div className="flex items-center justify-between pt-1.5 md:pt-2">
                  <p
                    className="text-[10px] sm:text-xs md:text-sm"
                    style={{
                      fontFamily: "Georgia, serif",
                      color: "#6B5744",
                      fontStyle: "italic",
                    }}
                  >
                    Begin composing your masterpiece
                  </p>
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 animate-bounce"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
