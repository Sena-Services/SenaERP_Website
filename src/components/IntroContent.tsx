"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import PinwheelLogo from './PinwheelLogo';
import IntroCTAButtons from './IntroCTAButtons';
import { useIntroContentScroll } from './useIntroContentScroll';

type IntroContentProps = {
  contentOpacity: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
};

export default function IntroContent({ contentOpacity, scrollRef }: IntroContentProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(900);
  const localContentRef = useRef<HTMLDivElement>(null);
  const contentRef = scrollRef || localContentRef;

  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
        setViewportHeight(window.innerHeight);
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const { isManualScrollRef } = useIntroContentScroll(isMobile, contentRef);

  const getScaledValue = (baseValue: number) => {
    if (isMobile) return baseValue;
    const heightRatio = viewportHeight / 910;
    return baseValue * heightRatio;
  };

  const topPadding = isMobile ? 16 : getScaledValue(15);
  const bottomPadding = isMobile ? 120 : getScaledValue(77);

  return (
    <div
      ref={contentRef}
      className="relative flex flex-col w-full md:w-[70%] xl:w-[54%] ml-0 md:ml-[5%]"
      style={{
        opacity: contentOpacity,
        pointerEvents: contentOpacity < 0.3 ? "none" : "auto",
        position: isMobile ? 'absolute' : undefined,
        top: isMobile ? '6px' : undefined,
        left: isMobile ? '6px' : undefined,
        right: isMobile ? '6px' : undefined,
        paddingLeft: isMobile ? '24px' : getScaledValue(40),
        paddingRight: isMobile ? '24px' : getScaledValue(40),
        paddingTop: isMobile ? '50vh' : `${topPadding}px`,
        paddingBottom: `${bottomPadding}px`,
        minHeight: isMobile ? undefined : '100%',
        height: isMobile ? 'calc(100vh - 6px)' : undefined,
        overflow: isMobile ? 'scroll' : undefined,
        overflowY: isMobile ? 'scroll' : undefined,
        WebkitOverflowScrolling: isMobile ? 'touch' : undefined,
        overscrollBehavior: isMobile ? 'contain' : undefined,
        touchAction: isMobile ? 'pan-y' : undefined,
        zIndex: 10,
        borderTopLeftRadius: isMobile ? '8px' : undefined,
        borderTopRightRadius: isMobile ? '8px' : undefined,
      }}
    >
      {/* Logo + wordmark */}
      <div style={{ marginBottom: `${getScaledValue(15)}px`, paddingBottom: `${getScaledValue(15)}px`, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${getScaledValue(4)}px`, marginBottom: `${getScaledValue(8)}px` }}>
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

      {/* Mission Statement + Pillars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${getScaledValue(12)}px`, position: 'relative', marginTop: `${getScaledValue(15)}px`, paddingTop: `${getScaledValue(20)}px` }}>
        {/* Mission Statement label with fading line */}
        <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', gap: `${getScaledValue(10)}px` }}>
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
            background: 'linear-gradient(to right, rgba(139, 115, 85, 0.6), transparent)',
          }} />
        </div>

        {/* Intro paragraph */}
        <p style={{
          fontFamily: "Georgia, serif",
          color: isMobile ? "#3d3226" : "#6b5d4f",
          fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
          lineHeight: 1.6,
          fontWeight: isMobile ? 500 : 400,
          margin: 0,
          textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85), 0 1px 3px rgba(0, 0, 0, 0.2)' : undefined,
        }}>
          We are stepping into an age of abundance created by AI. Every person deserves to shape this future with their own arsenal of agents. Sena is where anyone can build them. Built on three pillars:
        </p>

        {/* Three Pillars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${getScaledValue(12)}px`, marginTop: `${getScaledValue(4)}px` }}>
          {[
            { num: '01', label: 'Build', desc: 'Describe your agent in a sentence and let Sena handle the rest. Or take full control and wire every detail yourself. Both paths lead to the same place.' },
            { num: '02', label: 'Run', desc: 'Reliable agents hosted on your site, running in parallel, on schedule, with full observability. Every action logged, every decision traceable.' },
            { num: '03', label: 'Share', desc: 'Publish your agents, tools, and skills to the Registry, a marketplace where creators earn from their work. Build a great agent, and everyone who installs it pays you.' },
          ].map(({ num, label, desc }) => (
            <div key={num} style={{ display: 'flex', alignItems: 'baseline', gap: `${getScaledValue(10)}px` }}>
              <span style={{
                fontFamily: "Georgia, serif",
                color: isMobile ? "#5a4938" : "#8b7355",
                fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
                fontWeight: 600,
                minWidth: isMobile ? '22px' : `${getScaledValue(26)}px`,
                flexShrink: 0,
                textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1)' : undefined,
              }}>{num}</span>
              <p style={{
                fontFamily: "Georgia, serif",
                color: isMobile ? "#3d3226" : "#6b5d4f",
                fontSize: isMobile ? '0.8125rem' : `${getScaledValue(15)}px`,
                lineHeight: 1.6,
                margin: 0,
                textShadow: isMobile ? '0 2px 6px rgba(255, 255, 255, 1), 0 1px 4px rgba(255, 255, 255, 0.85)' : undefined,
              }}><strong>{label}</strong> : {desc}</p>
            </div>
          ))}
          <div style={{
            width: isMobile ? '100px' : `${getScaledValue(200)}px`,
            height: '1px',
            background: 'linear-gradient(to left, rgba(139, 115, 85, 0.6), transparent)',
            marginLeft: 'auto',
            marginTop: `${getScaledValue(6)}px`,
          }} />
        </div>

        {/* CTA buttons — video, launch notes, download, pitch deck */}
        <IntroCTAButtons
          isMobile={isMobile}
          getScaledValue={getScaledValue}
        />
      </div>

      {/* Footer callout */}
      <div style={{
        position: isMobile ? 'relative' : 'absolute',
        bottom: isMobile ? undefined : `${getScaledValue(19)}px`,
        left: isMobile ? undefined : getScaledValue(40),
        right: isMobile ? undefined : 'auto',
        marginTop: isMobile ? '24px' : undefined,
        width: 'auto',
        maxWidth: isMobile ? '100%' : 'min(900px, 90%)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${getScaledValue(9)}px`,
          padding: isMobile ? '12px' : `${getScaledValue(16)}px`,
          borderRadius: isMobile ? '16px' : `${getScaledValue(24)}px`,
          background: "rgba(255,255,255,0.4)",
          backdropFilter: "blur(12px)",
          border: "2px solid #9CA3AF",
          boxShadow: '0 4px 12px rgba(156, 163, 175, 0.15)',
        }}>
          <p style={{
            fontFamily: "Georgia, serif",
            color: "#6B5744",
            fontSize: isMobile ? '10px' : `${getScaledValue(12.5)}px`,
            textTransform: 'uppercase',
            letterSpacing: "0.18em",
            fontWeight: 600,
          }}>
            One conversation. Everything handled.
          </p>
          <p style={{
            fontFamily: "Georgia, serif",
            color: "#6b5d4f",
            fontSize: isMobile ? '0.8125rem' : `${getScaledValue(16)}px`,
            lineHeight: 1.6,
          }}>
            Talk to Sena and it figures out which agent handles what. You never need to know what&apos;s running behind the scenes. Just say what you need.
          </p>
          <div className="h-px bg-gray-400/40 w-full" style={{ marginTop: `${getScaledValue(7)}px` }} />
          <div className="flex items-center justify-between" style={{ paddingTop: `${getScaledValue(7)}px` }}>
            <p style={{
              fontFamily: "Georgia, serif",
              color: "#6B5744",
              fontStyle: "italic",
              fontSize: isMobile ? '10px' : `${getScaledValue(13.5)}px`,
            }}>
              Scroll to see how it works
            </p>
            <button
              aria-label="Scroll down"
              onClick={() => {
                if (isMobile) {
                  isManualScrollRef.current = true;
                  window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
