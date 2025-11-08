"use client";

import { useRef, useState, useEffect, forwardRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

type ShowcaseStep = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

const showcaseSteps: ShowcaseStep[] = [
  {
    id: "environment",
    eyebrow: "Environments",
    title: "Spin up customer-ready workspaces in minutes.",
    description:
      "Provision secure environments with data sources, permissions, and audit trails dialed in from the start. Every customer gets a pristine sandbox with zero engineering lift.",
    image: "/screenshots/environment.png",
  },
  {
    id: "preview",
    eyebrow: "Previews",
    title: "Preview every change before it reaches production.",
    description:
      "Share interactive previews, capture stakeholder feedback, and roll out updates with confidence. Sena tracks what changed and who signed off.",
    image: "/screenshots/preview.png",
  },
  {
    id: "workflow",
    eyebrow: "Workflows",
    title: "Automate complex workflows without the sprawl.",
    description:
      "Orchestrate multi-step automations, trigger actions across tools, and keep humans in the loop when you need them—no brittle scripts required.",
    image: "/screenshots/workflow.png",
  },
  {
    id: "agent",
    eyebrow: "AI agents",
    title: "Drop specialized agents into every process.",
    description:
      "Assign AI teammates to triage requests, draft updates, and surface what needs attention next. Each agent learns from your data and adapts to your playbooks.",
    image: "/screenshots/agent.png",
  },
  {
    id: "data",
    eyebrow: "Data teams",
    title: "Turn operational exhaust into live intelligence.",
    description:
      "Blend operational data with finance and product signals. Build dashboards, run ad-hoc queries, and keep the whole org aligned on the truth.",
    image: "/screenshots/data.png",
  },
];

const Builder = forwardRef<HTMLDivElement>(function Builder(props, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftScrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Detect active step based on left scroll position
  useEffect(() => {
    const leftScroll = leftScrollRef.current;
    if (!leftScroll) return;

    const handleLeftScroll = () => {
      const scrollTop = leftScroll.scrollTop;
      const clientHeight = leftScroll.clientHeight;

      // Find which section is currently in view
      let newActiveIndex = 0;
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const ref = sectionRefs.current[i];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const leftRect = leftScroll.getBoundingClientRect();
          const relativeTop = rect.top - leftRect.top + scrollTop;

          if (relativeTop <= scrollTop + clientHeight / 3) {
            newActiveIndex = i;
          }
        }
      }

      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex);
      }
    };

    leftScroll.addEventListener('scroll', handleLeftScroll, { passive: true });
    handleLeftScroll(); // Initial check

    return () => {
      leftScroll.removeEventListener('scroll', handleLeftScroll);
    };
  }, [activeIndex]);

  // Main scroll handler - drives internal scroll based on page scroll
  useEffect(() => {
    let ticking = false;
    const NAVBAR_HEIGHT = 80;

    const updateScroll = () => {
      if (!containerRef.current || !leftScrollRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const windowHeight = window.innerHeight;

      // Check if section is in sticky position (top is at navbar height)
      const isSticky = containerTop <= NAVBAR_HEIGHT && containerBottom > windowHeight + NAVBAR_HEIGHT;

      if (isSticky) {
        // Calculate scroll progress through the section
        const scrollStart = containerRef.current.offsetTop - NAVBAR_HEIGHT;
        const currentScroll = window.scrollY;
        const scrollProgress = currentScroll - scrollStart;

        const leftScrollHeight = leftScrollRef.current.scrollHeight - leftScrollRef.current.clientHeight;
        const targetScroll = Math.max(0, Math.min(scrollProgress, leftScrollHeight));

        leftScrollRef.current.scrollTop = targetScroll;
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    // Prevent scroll loop on left section
    const handleWheel = (e: WheelEvent) => {
      if (!leftScrollRef.current) return;

      // If the wheel event is on the left scroll area, prevent it from causing issues
      const target = e.target as HTMLElement;
      if (leftScrollRef.current.contains(target)) {
        e.stopPropagation();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Add wheel listener to left section to prevent loop
    const leftScroll = leftScrollRef.current;
    if (leftScroll) {
      leftScroll.addEventListener('wheel', handleWheel, { passive: true });
    }

    // Initial update after a brief delay to ensure elements are measured
    setTimeout(updateScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (leftScroll) {
        leftScroll.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const activeStep = showcaseSteps[activeIndex];
  const NAVBAR_HEIGHT = 80;

  return (
    <div
      id="builder"
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className="scroll-mt-20 mt-16 sm:mt-16 relative lg:min-h-[370vh]"
    >
      {/* Sticky Container - Desktop only */}
      <div
        className="lg:sticky top-20 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8"
        style={{
          top: `${NAVBAR_HEIGHT}px`,
        }}
      >
        <div className="relative mx-auto w-full max-w-7xl">
          {/* Builder Header - Always Visible */}
          <div className="mb-12 bg-waygent-cream pt-4 text-center">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
              }}
            >
              Builder
            </h2>
          </div>

          {/* Mobile Layout - Simple vertical cards */}
          <div className="flex flex-col lg:hidden bg-waygent-cream space-y-8 pb-12">
            {showcaseSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col space-y-4">
                {/* Mobile Image for each step */}
                <div className="w-full px-4">
                  <div className="relative w-full aspect-[16/10] rounded-2xl bg-white shadow-lg overflow-hidden">
                    <Image
                      src={step.image}
                      alt={`Screenshot showcasing ${step.title}`}
                      fill
                      className="object-fill"
                    />
                  </div>
                </div>

                {/* Mobile Content for each step */}
                <div className="px-6 space-y-3">
                  <p className="text-xs uppercase tracking-wider text-waygent-blue font-semibold">
                    {step.eyebrow}
                  </p>

                  <h3 className="text-xl font-semibold text-waygent-text-primary font-futura leading-tight">
                    {step.title}
                  </h3>

                  <p className="text-sm text-waygent-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < showcaseSteps.length - 1 && (
                  <div className="mx-6 mt-4 h-px bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Desktop Layout - Side by side */}
          <div className="hidden lg:flex flex-row h-[calc(100vh-140px)]">
            {/* Left Side - Scrollable Content */}
            <div className="w-[30%] flex flex-col bg-waygent-cream">
              {/* Sticky Header with Dynamic Subtitle */}
              <div className="bg-waygent-cream pb-4 px-8 border-b border-gray-200/50">
                {/* Dynamic Second Line - Changes on Scroll */}
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={`subtitle-${activeStep.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg sm:text-xl font-semibold text-waygent-text-primary font-futura leading-tight"
                  >
                    {activeStep.title}
                  </motion.h3>
                </AnimatePresence>
              </div>

              {/* Scrollable Content Area */}
              <div
                ref={leftScrollRef}
                className="flex-1 overflow-y-auto px-8 py-6 builder-no-scrollbar"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  pointerEvents: 'none',
                }}
              >
                {showcaseSteps.map((step, index) => (
                  <div
                    key={step.id}
                    ref={(el) => {
                      sectionRefs.current[index] = el;
                    }}
                    className={`mb-6 xl:mb-4 min-h-[50vh] flex flex-col justify-center ${
                      index === showcaseSteps.length - 1 ? 'pb-[25vh]' : ''
                    }`}
                  >
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-wider text-waygent-blue font-semibold">
                        {step.eyebrow}
                      </p>

                      <h3 className="text-xl sm:text-2xl font-semibold text-waygent-text-primary font-futura leading-tight">
                        {step.title}
                      </h3>

                      <p className="text-sm sm:text-base text-waygent-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {index < showcaseSteps.length - 1 && (
                      <div className="mt-6 h-px bg-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Static Image Display */}
            <div className="w-[70%] flex items-center justify-center px-8 py-8 bg-waygent-cream">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-[900px] aspect-[16/10] rounded-[2rem] bg-white shadow-2xl overflow-hidden"
                style={{
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Image
                  src={activeStep.image}
                  alt={`Screenshot showcasing ${activeStep.title}`}
                  fill
                  priority
                  className="object-fill"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Builder;
