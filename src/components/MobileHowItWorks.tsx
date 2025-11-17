"use client";

import { useEffect, useState, useRef } from "react";

export default function MobileHowItWorks() {
  const [isMobile, setIsMobile] = useState(false);
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
      title: "Talk to Sena",
      description: "Share your workflows, challenges, and goals. Sena asks the right questions to understand exactly what you need—no technical jargon required.",
      videoSrc: "/videos/card1.mp4",
      bg: "#f6efe4",
      details: {
        heading: "Talk to Sena",
        intro: "Sena is your AI co-founder who helps you build custom ERP systems through natural conversation. Choose between Discovery Mode for collaborative exploration or Express Mode for direct control.",
        modes: [
          {
            title: "Discovery Mode (Voice)",
            description: "Have a natural conversation with Sena in your preferred language. She'll ask insightful questions like a co-founder or analyst to deeply understand your operations.",
            features: [
              "Multilingual voice conversations in 50+ languages",
              "Proactive questioning to uncover hidden requirements",
              "Deep understanding of your business processes",
              "Collaborative requirement building"
            ]
          },
          {
            title: "Express Mode (Text)",
            description: "Know exactly what you want? Use Express Mode to tell Sena your requirements directly and get instant results without back-and-forth.",
            features: [
              "Direct text-based interface for precise control",
              "Specify exact requirements and features",
              "Instant system generation",
              "Zero unnecessary conversation"
            ]
          }
        ]
      }
    },
    {
      number: 2,
      title: "Review & Refine",
      description: "Walk through every table, workflow, and interface Sena built for you. Make changes, ask questions, and ensure it's exactly right.",
      videoSrc: "/videos/card2.mp4",
      bg: "#f5f2e9",
      details: {
        heading: "Review & Refine",
        intro: "Walk through every detail of your system before going live. Make changes, ask questions, and iterate in real-time until everything is exactly right.",
        features: [
          {
            title: "Visual Preview",
            description: "See exactly how your system looks and works before deployment"
          },
          {
            title: "Interactive Editing",
            description: "Click to edit any table, workflow, or interface element"
          },
          {
            title: "Real-Time Updates",
            description: "See changes instantly as you make modifications"
          },
          {
            title: "Unlimited Iterations",
            description: "Refine and perfect your system with no limits"
          }
        ]
      }
    },
    {
      number: 3,
      title: "Go Live",
      description: "One click and your custom ERP is live. Your team can start using it immediately—no setup, no installation, no complexity.",
      videoSrc: "/videos/card3.mp4",
      bg: "#f6f2fb",
      details: {
        heading: "Go Live",
        intro: "One click and your custom ERP is live. Your team can start using it immediately with no setup, installation, or technical complexity.",
        features: [
          {
            title: "Instant Deployment",
            description: "Deploy to production with a single click - no DevOps required"
          },
          {
            title: "Immediate Access",
            description: "Your team gets instant access - just share the link"
          },
          {
            title: "Cloud Infrastructure",
            description: "Fully managed, scalable cloud hosting included"
          },
          {
            title: "Enterprise Security",
            description: "Bank-level security, compliance, and data protection"
          }
        ]
      }
    }
  ];

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <div className="w-full bg-gradient-to-b from-waygent-cream to-gray-50 relative pt-10" id="how-it-works">
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
      <div className="relative px-4 pb-6">
        {cards.map((card, index) => (
        <div
          key={card.number}
          className="relative mb-8 last:mb-0"
        >
          {/* Card Container with modern styling */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{
              minHeight: 'calc(100vh - 120px)',
            }}
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
              className="relative overflow-y-auto px-5 py-6"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
              }}
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
                <h3
                  className="text-2xl font-bold leading-tight"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    color: "#1F2937",
                  }}
                >
                  {card.details.heading}
                </h3>
              </div>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  color: "#6B7280",
                  lineHeight: "1.6",
                }}
              >
                {card.details.intro}
              </p>

              {/* Mode-specific content for Card 1 - Compact cards */}
              {card.details.modes && (
                <div className="space-y-3">
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
                <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
