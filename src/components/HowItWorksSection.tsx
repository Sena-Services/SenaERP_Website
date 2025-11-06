"use client";

import React from "react";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

const steps: Step[] = [
  {
    id: "discovery",
    title: "Talk to Sena",
    subtitle: "Describe your business in plain English",
    description: "Share your workflows, challenges, and goals. Sena asks the right questions to understand exactly what you need—no technical jargon required.",
  },
  {
    id: "preview",
    title: "Review & Refine",
    subtitle: "See your custom ERP before it goes live",
    description: "Walk through every table, workflow, and interface Sena built for you. Make changes, ask questions, and ensure it's exactly right.",
  },
  {
    id: "publish",
    title: "Go Live",
    subtitle: "Deploy your tailored system instantly",
    description: "One click and your custom ERP is live. Your team can start using it immediately—no setup, no installation, no complexity.",
  },
];

// Card aspect ratio - change this to adjust height of all cards
const CARD_ASPECT_RATIO = "1/1";

function StepVisual({ id }: { id: Step["id"] }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Force video to load first frame on mobile
    const video = videoRef.current;
    if (video) {
      video.load();
      const loadFirstFrame = () => {
        if (id === "discovery") {
          video.currentTime = 0.1;
        } else if (id === "preview") {
          video.currentTime = 0.1;
        } else {
          video.currentTime = 3;
        }
      };

      if (video.readyState >= 2) {
        loadFirstFrame();
      } else {
        video.addEventListener('loadeddata', loadFirstFrame, { once: true });
      }
    }
  }, [id]);

  if (id === "discovery") {
    const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      video.currentTime = 0.1; // Load first frame
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
      setIsHovered(true);
      const video = e.currentTarget;
      video.playbackRate = 0.5;
      video.play();
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
      setIsHovered(false);
      const video = e.currentTarget;
      video.pause();
      video.currentTime = 0;
    };

    return (
      <div className="relative w-full overflow-hidden bg-[#f6efe4]" style={{ aspectRatio: CARD_ASPECT_RATIO }}>
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 opacity-100 ${
            isHovered ? "md:opacity-100" : "md:opacity-70"
          }`}
          style={{ objectPosition: 'center 40%' }}
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <source src="/videos/card1.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  if (id === "preview") {
    const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      video.currentTime = 0.1; // Load first frame
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
      setIsHovered(true);
      const video = e.currentTarget;
      video.playbackRate = 0.75;
      video.play();
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
      setIsHovered(false);
      const video = e.currentTarget;
      video.pause();
      video.currentTime = 0;
    };

    return (
      <div className="relative w-full overflow-hidden bg-[#f5f2e9]" style={{ aspectRatio: CARD_ASPECT_RATIO }}>
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 opacity-100 ${
            isHovered ? "md:opacity-100" : "md:opacity-70"
          }`}
          style={{ objectPosition: 'center 45%' }}
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <source src="/videos/card2.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.currentTime = 3;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLVideoElement>) => {
    setIsHovered(true);
    const video = e.currentTarget;
    video.currentTime = 3;
    video.playbackRate = 0.5;
    video.play();
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLVideoElement>) => {
    setIsHovered(false);
    const video = e.currentTarget;
    video.pause();
    video.currentTime = 3;
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 6) {
      video.currentTime = 3;
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#f6f2fb]" style={{ aspectRatio: CARD_ASPECT_RATIO }}>
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 opacity-100 ${
          isHovered ? "md:opacity-100" : "md:opacity-70"
        }`}
        style={{ objectPosition: 'center 80%' }}
        muted
        playsInline
        preload="metadata"
        onLoadedData={handleLoadedData}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src="/videos/card3.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto w-full max-w-7xl font-space-grotesk">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#f6efe4] opacity-50 blur-3xl" />
          <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-[#e5f0ff] opacity-40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#ffe7f1] opacity-45 blur-[110px]" />
        </div>

        <div className="relative flex flex-col">
          <div className="mb-6">
            <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
              How it works
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.id}
                className="flex flex-col overflow-hidden rounded-[24px] border border-waygent-light-blue/40 bg-white text-waygent-text-primary shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <StepVisual id={step.id} />
                <div className="flex flex-1 flex-col border-t border-waygent-light-blue/30 px-4 py-3.5">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-waygent-blue text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="text-[15px] font-bold text-waygent-text-primary leading-snug">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[12px] leading-relaxed text-waygent-text-secondary/90">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
