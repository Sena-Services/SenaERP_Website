"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, animate, type PanInfo } from "motion/react";

export default function MobileHowItWorks() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const x = useMotionValue(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setContainerWidth(window.innerWidth);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Play video when it becomes current
  useEffect(() => {
    if (!isMobile) return;

    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      video.playbackRate = 0.7;

      if (idx === currentCard && expandedCard === null) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentCard, isMobile, expandedCard]);

  const cards = [
    {
      number: 1,
      title: "Discovery",
      description: "Talk to Sena naturally—voice, text, any language. It understands your business and generates a complete Business Requirements Document.",
      videoSrc: "/videos/card1.mp4",
      color: '#4682A0',
      colorRgb: '70, 130, 160',
      details: {
        heading: "Discovery",
        intro: "Traditional ERP: consultants, months of development, thousands of dollars, and still unsatisfactory. We automate the entire lifecycle.",
        sections: [
          {
            icon: "mic",
            title: "Voice & Text Conversations",
            description: "Talk naturally in 50+ languages. Whether you have a fuzzy vision or know exactly what you want, Sena meets you where you are.",
            bullets: [
              "Voice conversations with real-time understanding",
              "Text input for detailed requirements",
              "Intelligent questioning that uncovers what you really need"
            ]
          },
          {
            icon: "document",
            title: "Multimodal Input",
            description: "Upload documents, images, videos, links, and websites. Sena processes everything to deeply understand your operations.",
            bullets: [
              "Existing SOPs, process documents, spreadsheets",
              "Screenshots of current systems",
              "Deep web search capabilities"
            ]
          },
          {
            icon: "team",
            title: "Parallel Team Discovery",
            description: "The Discovery Agent talks to people across your organization—founders, managers, staff—in their own language.",
            bullets: [
              "Separate conversations with each stakeholder",
              "Automatic conflict resolution",
              "Complete picture from all perspectives"
            ]
          }
        ]
      }
    },
    {
      number: 2,
      title: "Build",
      description: "The Builder Agent pulls the right modules from our Registry and assembles your custom ERP—database, logic, integrations.",
      videoSrc: "/videos/card2.mp4",
      color: '#826496',
      colorRgb: '130, 100, 150',
      details: {
        heading: "Build",
        intro: "Once your BRD is approved, the Builder Agent takes over. It doesn't write everything from scratch—it pulls the right modules from our Registry.",
        sections: [
          {
            icon: "code",
            title: "Builder Agent",
            description: "Your dedicated AI that reads the BRD and assembles a complete custom system—database, logic, migrations, integrations.",
            bullets: [
              "Pulls modules from the Registry",
              "Combines building blocks for your use case",
              "Customizes everything to your requirements"
            ]
          },
          {
            icon: "grid",
            title: "The Registry",
            description: "An open-source library of pre-built modules, agents, and connectors that the Builder Agent draws from.",
            bullets: [
              "Inventory management, invoicing, CRM modules",
              "Pre-built integrations for popular tools",
              "Community-contributed components"
            ]
          },
          {
            icon: "refresh",
            title: "Flywheel Effect",
            description: "Every build makes the platform smarter. Modules get refined, new patterns emerge, and the Registry grows.",
            bullets: [
              "Continuous improvement from every deployment",
              "Shared learnings across all businesses",
              "Your ERP benefits from collective intelligence"
            ]
          }
        ]
      }
    },
    {
      number: 3,
      title: "Manage Agents",
      description: "Your AI agents run operations tirelessly. Build, test, and deploy agents that get smarter with every interaction.",
      videoSrc: "/videos/card3.mp4",
      color: '#B4646E',
      colorRgb: '180, 100, 110',
      details: {
        heading: "Manage Agents",
        intro: "Now that you have a custom ERP, who operates it? AI Agents—virtual employees running your operations tirelessly.",
        sections: [
          {
            icon: "slider",
            title: "Agent Builder",
            description: "Most agent builders are too technical or too simple. We built for both with an autonomy slider.",
            bullets: [
              "Plain English on one end, full code on the other",
              "Non-technical users can build powerful agents",
              "Developers get complete control when needed"
            ]
          },
          {
            icon: "test",
            title: "Testing Framework",
            description: "Test your agents before deployment. Catch issues with tool calling, token usage, and hallucinations.",
            bullets: [
              "Simulate real scenarios",
              "Track token consumption",
              "Validate agent responses"
            ]
          },
          {
            icon: "brain",
            title: "Runtime Evolution",
            description: "If an agent encounters a new task it can't handle, it proposes a plan, you approve it, and the system grows.",
            bullets: [
              "Agents learn from every interaction",
              "Fine-tuned for your specific business",
              "Your ERP evolves without touching code"
            ]
          }
        ]
      }
    }
  ];

  const cardWidth = containerWidth - 48;
  const cardGap = 16;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -500) {
      if (currentCard < cards.length - 1) {
        setCurrentCard(currentCard + 1);
        setExpandedCard(null);
      }
    } else if (offset > threshold || velocity > 500) {
      if (currentCard > 0) {
        setCurrentCard(currentCard - 1);
        setExpandedCard(null);
      }
    }
  };

  useEffect(() => {
    const targetX = -currentCard * (cardWidth + cardGap);
    animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
  }, [currentCard, cardWidth, cardGap, x]);

  const getIcon = (iconName: string, color: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      mic: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      document: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      team: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      code: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      grid: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      refresh: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      slider: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      test: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      brain: (
        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  if (!isMobile) return null;

  return (
    <div className="w-full relative py-8 overflow-hidden" id="how-it-works" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Section Header */}
      <div className="text-center px-4 pb-6">
        <h2
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#2C1810",
            fontSize: "28px",
            marginBottom: "4px",
          }}
        >
          How it <span style={{ fontStyle: "italic" }}>works</span>?
        </h2>
        <p
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            color: "#6B7280",
          }}
        >
          Swipe to explore
        </p>
      </div>

      {/* Swipeable Cards Container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ touchAction: 'pan-y' }}
      >
        <motion.div
          className="flex"
          style={{
            x,
            paddingLeft: '24px',
            gap: `${cardGap}px`,
            touchAction: 'pan-y',
          }}
          drag="x"
          dragDirectionLock
          dragConstraints={{
            left: -((cards.length - 1) * (cardWidth + cardGap)),
            right: 0,
          }}
          dragElastic={0.1}
          onDirectionLock={(axis) => {
            if (axis === "x") {
              // Lock to horizontal — prevent vertical scroll interference
              document.body.style.overflow = "hidden";
            }
          }}
          onDragEnd={(...args) => {
            document.body.style.overflow = "";
            handleDragEnd(...args);
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.number}
              className="flex-shrink-0 rounded-3xl overflow-hidden"
              style={{
                width: cardWidth,
                background: '#FAF8F5',
                border: '2px solid #9CA3AF',
                boxShadow: '0 8px 24px -8px rgba(80, 60, 40, 0.12)',
              }}
              layout
            >
              {/* Video Section - shrinks when expanded */}
              <motion.div
                className="w-full relative overflow-hidden"
                animate={{ height: expandedCard === index ? '15vh' : '40vh' }}
                transition={{ duration: 0.3 }}
              >
                <video
                  ref={(el) => { videoRefs.current[index] = el; }}
                  src={card.videoSrc}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center 50%',
                    filter: 'grayscale(40%) brightness(0.92) contrast(0.85) sepia(10%)',
                  }}
                />

                {/* Overlays */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'rgba(250, 245, 235, 0.2)',
                    mixBlendMode: 'soft-light',
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, rgba(${card.colorRgb}, 0.12) 0%, rgba(${card.colorRgb}, 0.06) 50%, transparent 100%)`,
                  }}
                />

                {/* Card number badge */}
                <div
                  className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: '#F5F1E8',
                    border: '2px solid #9CA3AF',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: card.color,
                    }}
                  >
                    {card.number}
                  </span>
                </div>

                {/* Back button when expanded */}
                {expandedCard === index && (
                  <button
                    onClick={() => setExpandedCard(null)}
                    aria-label="Close"
                    className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: '#F5F1E8',
                      border: '2px solid #9CA3AF',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </motion.div>

              {/* Content Section */}
              <div
                className="relative px-4 py-4 overflow-y-auto"
                onPointerDownCapture={(e) => {
                  // Let the motion drag handler see horizontal swipes even inside scroll area
                  e.stopPropagation = () => {};
                }}
                style={{
                  background: '#FAF8F5',
                  maxHeight: expandedCard === index ? '55vh' : 'auto',
                  touchAction: 'pan-y',
                }}
              >
                <AnimatePresence mode="wait">
                  {expandedCard !== index ? (
                    // Collapsed view
                    <motion.div
                      key="collapsed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3
                        className="text-lg font-bold leading-tight mb-2"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          color: card.color,
                        }}
                      >
                        {card.details.heading}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-3"
                        style={{ color: "#6B7280" }}
                      >
                        {card.description}
                      </p>

                      <button
                        onClick={() => setExpandedCard(index)}
                        className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
                        style={{
                          background: `rgba(${card.colorRgb}, 0.1)`,
                          color: card.color,
                        }}
                      >
                        <span className="text-sm font-semibold">Learn more</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </motion.div>
                  ) : (
                    // Expanded view with rich details
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <h3
                        className="text-lg font-bold leading-tight"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          color: card.color,
                        }}
                      >
                        {card.details.heading}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                        {card.details.intro}
                      </p>

                      {/* Detailed sections */}
                      <div className="space-y-3 pt-2">
                        {card.details.sections.map((section, sectionIndex) => (
                          <div
                            key={sectionIndex}
                            className="rounded-xl p-3"
                            style={{
                              background: `rgba(${card.colorRgb}, 0.06)`,
                              border: `1px solid rgba(${card.colorRgb}, 0.15)`,
                            }}
                          >
                            <h4 className="font-bold text-sm mb-1.5 flex items-center gap-2" style={{ color: card.color }}>
                              {getIcon(section.icon, card.color)}
                              {section.title}
                            </h4>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: "#6B7280" }}>
                              {section.description}
                            </p>
                            <ul className="space-y-1">
                              {section.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="flex items-start gap-1.5 text-xs" style={{ color: "#4B5563" }}>
                                  <span style={{ color: card.color }} className="mt-0.5">→</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setExpandedCard(null)}
                        className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 mt-2"
                        style={{
                          background: `rgba(${card.colorRgb}, 0.1)`,
                          color: card.color,
                        }}
                      >
                        <span className="text-sm font-semibold">Show less</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(180deg)' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentCard(index);
              setExpandedCard(null);
            }}
            aria-label={`Go to card ${index + 1}: ${card.title}`}
            className="transition-all duration-300 relative flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              background: 'transparent',
              border: 'none',
              padding: 0,
            }}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: currentCard === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentCard === index ? card.color : '#D1D5DB',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
