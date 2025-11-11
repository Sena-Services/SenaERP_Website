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

  // Don't render on desktop
  if (!isMobile) return null;

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

  return (
    <div className="w-full bg-waygent-cream" id="how-it-works">
      {/* Title Section */}
      <div className="w-full py-12 px-6 text-center">
        <h2
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#2C1810",
            fontSize: "48px",
            marginBottom: "8px",
          }}
        >
          How it <span style={{ fontStyle: "italic" }}>works</span>?
        </h2>
        <p
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            color: "#4B5563",
            letterSpacing: "-0.01em",
          }}
        >
          Three simple steps to build your custom ERP
        </p>
      </div>

      {/* Cards */}
      {cards.map((card, index) => (
        <div
          key={card.number}
          className="w-full min-h-screen flex flex-col"
          style={{
            background: card.bg,
          }}
        >
          {/* Video Section - Top 50% */}
          <div className="w-full h-[50vh] relative overflow-hidden flex items-center justify-center">
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

            {/* Card number badge */}
            <div
              className="absolute top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#2C1810",
                }}
              >
                {card.number}
              </span>
            </div>
          </div>

          {/* Content Section - Bottom 50% */}
          <div className="w-full h-[50vh] overflow-y-auto px-6 py-8">
            <h3
              className="text-3xl font-bold mb-4"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#2C1810",
              }}
            >
              {card.details.heading}
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                color: "#4B5563",
              }}
            >
              {card.details.intro}
            </p>

            {/* Mode-specific content for Card 1 */}
            {card.details.modes && (
              <div className="space-y-6">
                {card.details.modes.map((mode, modeIndex) => (
                  <div key={modeIndex}>
                    <h4
                      className="text-xl font-bold mb-2"
                      style={{
                        fontFamily: "Georgia, serif",
                        color: "#1E40AF",
                      }}
                    >
                      {mode.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        color: "#4B5563",
                      }}
                    >
                      {mode.description}
                    </p>
                    <ul className="space-y-2">
                      {mode.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <span
                            className="text-sm"
                            style={{
                              fontFamily: "system-ui, -apple-system, sans-serif",
                              color: "#374151",
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

            {/* Feature list for Cards 2 & 3 */}
            {card.details.features && !card.details.modes && (
              <div className="space-y-4">
                {card.details.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="p-4 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h4
                      className="font-bold mb-1 text-base"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        color: "#1F2937",
                      }}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        color: "#4B5563",
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
      ))}
    </div>
  );
}
