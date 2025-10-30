"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import clsx from "clsx";

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

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const totalSteps = showcaseSteps.length;
  const scrollLength = (totalSteps + 1) * 105;
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const nextIndex = Math.min(
      totalSteps - 1,
      Math.floor(value * totalSteps + 0.0001),
    );
    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]); 
  const productScale = useTransform(scrollYProgress, [0, 0.12], [1.05, 0.9]);
  const productX = useTransform(scrollYProgress, [0, 0.12], [-120, 0]);
  const productY = useTransform(scrollYProgress, [0, 0.12], [110, 0]);
  const productShadow = useTransform(scrollYProgress, [0, 0.12], [18, 32]);
  const productShadowValue = useTransform(productShadow, (value) =>
    `0 ${value}px ${value * 2.4}px rgba(15, 23, 42, 0.25)`,
  );

  const activeStep = showcaseSteps[activeIndex];

  return (
    <div className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
            Builder
          </h2>
        </div>

        <section
          aria-label="Sena platform capabilities story"
          className="relative isolate overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#e7f3ff] via-[#fefcf7] to-[#fbe7ff] text-waygent-text-primary"
        >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_60%)]"
        style={{ y: backgroundY }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-[5%] hidden h-[420px] w-[520px] rounded-[68px] bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(59,130,246,0))] blur-lg md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-[8%] hidden h-[520px] w-[560px] rounded-[72px] bg-[linear-gradient(155deg,rgba(250,204,21,0.22),rgba(250,204,21,0))] blur-xl md:block"
      />

      <div
        ref={containerRef}
        className="relative"
        style={{ minHeight: `${scrollLength}vh` }}
      >
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-12">
              <div className="space-y-14 lg:w-[54%]">
                <header className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-waygent-blue">
                    Platform preview
                  </p>
                  <h2 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                    A single command center that moves with your scroll.
                  </h2>
                  <p className="max-w-2xl text-lg text-waygent-text-secondary">
                    Start with the wallpaper hero inspired by Retool, then keep
                    scrolling to see the same UI glide into position as it
                    narrates each capability. No hard cuts—just a smooth handoff
                    between story beats.
                  </p>
                </header>

                <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/70 p-8 shadow-xl backdrop-blur">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="space-y-4"
                    >
                      <span className="inline-flex items-center rounded-full border border-waygent-blue/20 bg-waygent-blue/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-waygent-blue">
                        {activeStep.eyebrow}
                      </span>
                      <h3 className="text-3xl font-semibold text-waygent-text-primary sm:text-4xl">
                        {activeStep.title}
                      </h3>
                      <p className="text-lg text-waygent-text-secondary">
                        {activeStep.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 grid gap-3">
                    {showcaseSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={clsx(
                          "flex items-start gap-3 rounded-2xl border px-4 py-3 transition",
                          index === activeIndex
                            ? "border-waygent-blue/40 bg-waygent-blue/10 text-waygent-text-primary"
                            : "border-black/10 bg-white/60 text-slate-500",
                        )}
                      >
                        <span className={clsx(
                          "mt-1 inline-flex h-2 w-2 flex-none rounded-full",
                          index === activeIndex
                            ? "bg-waygent-blue"
                            : "bg-slate-300",
                        )} />
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-waygent-text-muted">
                            {step.eyebrow}
                          </p>
                          <p className="text-sm font-medium leading-tight text-waygent-text-primary">
                            {step.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-center lg:w-[46%] lg:justify-end">
                <motion.div
                  className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[36px]"
                  style={{
                    scale: productScale,
                    x: productX,
                    y: productY,
                    boxShadow: productShadowValue,
                  }}
                >
                  {showcaseSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className="absolute inset-0"
                      style={{ zIndex: index === activeIndex ? 2 : 1 }}
                      animate={{
                        opacity: activeIndex === index ? 1 : 0,
                        scale: activeIndex === index ? 1 : 0.98,
                        filter:
                          activeIndex === index ? "blur(0px)" : "blur(8px)",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <Image
                        src={step.image}
                        alt={`Screenshot showcasing ${step.title}`}
                        fill
                        priority={index === 0}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </section>
      </div>
    </div>
  );
}
