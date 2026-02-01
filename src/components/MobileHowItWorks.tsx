"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileHowItWorks() {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Set up intersection observer to play videos when in view
  useEffect(() => {
    if (!isMobile) return;

    const observers: IntersectionObserver[] = [];

    // Small delay to ensure videos are loaded
    const setupTimer = setTimeout(() => {
      videoRefs.current.forEach((video, idx) => {
        if (!video) return;

        // Set slow playback rate
        video.playbackRate = 0.7;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                console.log(`Video ${idx + 1} in view, attempting to play`);
                // Force load and play
                video.load();
                const playPromise = video.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then(() => {
                      console.log(`Video ${idx + 1} playing successfully`);
                      video.playbackRate = 0.7;
                    })
                    .catch(err => console.log(`Video ${idx + 1} play error:`, err));
                }
              } else {
                video.pause();
              }
            });
          },
          {
            threshold: 0.2, // Play when 20% visible
            rootMargin: '100px', // Start loading earlier
          }
        );

        observer.observe(video);
        observers.push(observer);
      });
    }, 200);

    return () => {
      clearTimeout(setupTimer);
      observers.forEach(observer => observer.disconnect());
    };
  }, [isMobile]);

  const cards = [
    {
      number: 1,
      title: "Discovery",
      description: "Talk to Sena naturally—voice, text, any language. It understands your business and generates a complete Business Requirements Document.",
      videoSrc: "/videos/card1.mp4",
      bg: "#f6efe4",
      details: {
        heading: "Discovery",
        intro: "Traditional ERP: consultants, months of development, thousands of dollars. We automate the entire lifecycle. The Discovery Agent talks to people across your organization.",
        features: [
          {
            title: "Voice & Text",
            description: "Conversations in 50+ languages, voice or text"
          },
          {
            title: "Multimodal Input",
            description: "Upload docs, images, videos, links"
          },
          {
            title: "Team Discovery",
            description: "Parallel conversations across your hierarchy"
          },
          {
            title: "BRD Generation",
            description: "Complete requirements document, you review and approve"
          }
        ]
      }
    },
    {
      number: 2,
      title: "Build",
      description: "The Builder Agent pulls the right modules from our Registry and assembles your custom ERP—database, logic, integrations.",
      videoSrc: "/videos/card2.mp4",
      bg: "#f5f2e9",
      details: {
        heading: "Build",
        intro: "Once your BRD is approved, the Builder Agent takes over. It doesn't write from scratch—it pulls modules from the Registry and customizes them.",
        features: [
          {
            title: "Builder Agent",
            description: "Reads BRD, assembles database, logic, migrations"
          },
          {
            title: "The Registry",
            description: "Open-source library: modules, agents, connectors"
          },
          {
            title: "Human-in-Loop",
            description: "Developer community fills Registry gaps"
          },
          {
            title: "Flywheel Effect",
            description: "Every build makes the platform smarter"
          }
        ]
      }
    },
    {
      number: 3,
      title: "Manage Agents",
      description: "Your AI agents run operations tirelessly. Build, test, and deploy agents that get smarter with every interaction.",
      videoSrc: "/videos/card3.mp4",
      bg: "#f6f2fb",
      details: {
        heading: "Manage Agents",
        intro: "Now that you have a custom ERP, who operates it? AI Agents—virtual employees running your operations tirelessly.",
        features: [
          {
            title: "Agent Builder",
            description: "Autonomy slider: plain English to full code control"
          },
          {
            title: "Testing Framework",
            description: "Test tool calling, tokens, hallucinations"
          },
          {
            title: "Fine-Tuning",
            description: "Agents get smarter for your specific business"
          },
          {
            title: "Command Center",
            description: "Agents report, ask permission, you approve"
          }
        ]
      }
    }
  ];

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <div className="w-full relative pt-4" id="how-it-works" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Section Header - Only on Mobile */}
      {isMobile && (
        <div className="text-center px-4 pb-8">
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            How it <span style={{ fontStyle: "italic" }}>works</span>?
          </h2>
          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              color: "#6B7280",
              letterSpacing: "-0.01em",
            }}
          >
            Three simple steps
          </p>
        </div>
      )}

      {/* Cards Container with Padding */}
      <div className="relative px-4 pb-6" style={{ zIndex: 10 }}>
        {cards.map((card, index) => (
        <div
          key={card.number}
          className="relative mb-8 last:mb-0"
        >
          {/* Card Container with modern styling */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-lg"
          >
            {/* Video Section - Compact with gradient overlay */}
            <div className="w-full h-[45vh] relative overflow-hidden">
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={card.videoSrc}
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'center 50%',
                  filter: 'grayscale(90%) brightness(0.85) contrast(0.7)',
                }}
              />

              {/* Overlay to further desaturate - matching desktop */}
              <div
                className="absolute inset-0 bg-gray-400/20 pointer-events-none"
                style={{
                  mixBlendMode: 'saturation',
                }}
              />

              {/* Colored gradient overlay for each card */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: index === 0
                    ? 'linear-gradient(180deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)'
                    : index === 1
                    ? 'linear-gradient(180deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)'
                    : 'linear-gradient(180deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 100%)',
                }}
              />

              {/* Floating card number badge with shadow */}
              <div
                className="absolute top-4 left-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transform: 'translateZ(20px)',
                }}
              >
                <span
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#EC4899',
                  }}
                >
                  {card.number}
                </span>
              </div>
            </div>

            {/* Content Section with glassmorphism */}
            <div
              className="relative px-5 py-6 cursor-pointer"
              style={{
                background: '#F5F1E8',
              }}
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
            >
              {/* Compact Title with accent */}
              <div className="mb-4">
                <div
                  className="inline-block px-3 py-1 rounded-full mb-2 text-xs font-bold tracking-wider"
                  style={{
                    background: index === 0
                      ? 'rgba(59, 130, 246, 0.1)'
                      : index === 1
                      ? 'rgba(139, 92, 246, 0.1)'
                      : 'rgba(236, 72, 153, 0.1)',
                    color: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#EC4899',
                  }}
                >
                  STEP {card.number}
                </div>
                <div className="flex items-center justify-between">
                  <h3
                    className="text-2xl font-bold leading-tight"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      color: "#1F2937",
                    }}
                  >
                    {card.details.heading}
                  </h3>
                  {/* Expand/Collapse Icon */}
                  <motion.div
                    animate={{ rotate: expandedCard === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-2"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        color: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#EC4899',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.div>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  color: "#6B7280",
                  lineHeight: "1.6",
                }}
              >
                {card.description}
              </p>

              {/* Expandable Content */}
              <AnimatePresence initial={false}>
                {expandedCard === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {/* Mode-specific content for Card 1 - Compact cards */}
                    {card.details.modes && (
                      <div className="space-y-3 mt-4">
                        {card.details.modes.map((mode, modeIndex) => (
                          <div
                            key={modeIndex}
                            className="rounded-2xl p-4"
                            style={{
                              background: 'rgba(255, 255, 255, 0.6)',
                              border: '1px solid rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <h4
                              className="text-base font-bold mb-1 flex items-center gap-2"
                              style={{
                                fontFamily: "system-ui, sans-serif",
                                color: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#EC4899',
                              }}
                            >
                              <span>{mode.title}</span>
                            </h4>
                            <p
                              className="text-xs leading-relaxed mb-2"
                              style={{
                                fontFamily: "system-ui, -apple-system, sans-serif",
                                color: "#6B7280",
                              }}
                            >
                              {mode.description}
                            </p>
                            <ul className="space-y-1.5">
                              {mode.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start gap-2">
                                  <div
                                    className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                                    style={{
                                      background: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#EC4899',
                                    }}
                                  />
                                  <span
                                    className="text-xs"
                                    style={{
                                      fontFamily: "system-ui, -apple-system, sans-serif",
                                      color: "#4B5563",
                                    }}
                                  >
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Feature list for Cards 2 & 3 - Grid layout */}
                    {card.details.features && !card.details.modes && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {card.details.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="p-3 rounded-xl"
                            style={{
                              background: 'rgba(255, 255, 255, 0.6)',
                              border: '1px solid rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <h4
                              className="font-bold mb-1 text-xs"
                              style={{
                                fontFamily: "system-ui, -apple-system, sans-serif",
                                color: index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#EC4899',
                              }}
                            >
                              {feature.title}
                            </h4>
                            <p
                              className="text-[11px] leading-tight"
                              style={{
                                fontFamily: "system-ui, -apple-system, sans-serif",
                                color: "#6B7280",
                              }}
                            >
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
