"use client";

import React, { useEffect } from "react";
import NavBar from "@/components/NavBar";
import IntroSection from "@/components/IntroSection";
import SidebarNav from "@/components/SidebarNav";
import Builder from "@/components/Builder";
import HowItWorksSection from "@/components/HowItWorksSection";
import LandingEnvironments from "@/components/LandingEnvironments";
import IntegrationsSection from "@/components/IntegrationsSection";
import PricingSection from "@/components/PricingSection";
import BlogSection from "@/components/BlogSection";
import JoinUsSection from "@/components/JoinUsSection";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "how-it-works", label: "How it Works" },
  { id: "environments", label: "Environments" },
  { id: "integrations", label: "Integrations" },
  { id: "builder", label: "Builder" },
  { id: "pricing", label: "Pricing" },
  { id: "blog", label: "Blog" },
  { id: "join-us", label: "Join Us" },
];

const checklistItems = [
  { label: "Linear roadmap sync for 7/15", state: "done" as const },
  { label: "Slack messages sync", state: "processing" as const },
  { label: "Competitors research", state: "upcoming" as const },
  { label: "CRM Enrichment", state: "upcoming" as const },
  { label: "Notion roadmap update", state: "upcoming" as const },
] as const;

const useCases = [
  {
    title: "Revenue Ops",
    description:
      "Sync call notes, CRM updates, and renewal signals without manual input.",
  },
  {
    title: "Customer Success",
    description:
      "Trigger proactive playbooks when sentiment dips or usage changes.",
  },
  {
    title: "Founders",
    description:
      "See pipeline, hiring, and cash projections in one reliable dashboard.",
  },
] as const;

const productHighlights = [
  {
    title: "Shared workspace",
    description:
      "AI-generated briefs create the perfect hand-off between teams, keeping everyone aligned.",
  },
  {
    title: "Automated insights",
    description:
      "Daily digests summarize the signals that matter so you never miss an opportunity.",
  },
  {
    title: "Enterprise ready",
    description:
      "Granular permissions, audit trails, and SOC 2 compliance keep the whole org secure.",
  },
] as const;

const agents = [
  {
    title: "Knowledgebase agent",
    description:
      "Builds a living wiki by listening to meetings, documents, and customer conversations.",
  },
  {
    title: "Pipeline agent",
    description:
      "Surfaces risk, assigns follow-ups, and mirrors changes instantly inside your CRM.",
  },
  {
    title: "Finance agent",
    description:
      "Reconciles invoices, tracks vendor spend, and alerts when budgets drift.",
  },
] as const;

const resultStats = [
  {
    stat: "78%",
    description: "Reduction in duplicate data entry across revenue teams.",
  },
  {
    stat: "4.5x",
    description: "Increase in automated hand-offs between sales and success.",
  },
  {
    stat: "12 hrs",
    description: "Saved per manager every week through daily AI summaries.",
  },
] as const;


export default function Home() {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Track scroll progress for IntroSection shrink
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shrinkScrollDistance = 1500;
      const progress = Math.min(scrollY / shrinkScrollDistance, 1);
      setScrollProgress(progress);

      // Once shrink is complete, allow normal scrolling
      if (progress >= 1) {
        // Reset scroll position to just after the intro section
        if (scrollY <= shrinkScrollDistance + 10) {
          window.scrollTo(0, shrinkScrollDistance);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always scroll to top on page load/reload
  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Remove any hash from URL
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Scroll to top immediately and forcefully
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also scroll to top after a small delay to ensure it sticks
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Enable smooth scrolling after initial scroll is done
      document.documentElement.classList.add('smooth-scroll');
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main className="relative bg-waygent-cream text-waygent-text-primary">
      {/* Spacer for shrink animation scroll distance */}
      <div style={{ height: '1500px', position: 'relative' }}>
        {/* IntroSection - fixed during shrink */}
        <IntroSection />
      </div>

      {/* Rest of the page - normal flow after shrink area */}
      <div className="bg-waygent-cream w-full relative z-1">
        <div className="flex min-h-screen flex-1 flex-col bg-waygent-cream">
          <div className="flex-1 flex flex-col">
            <HowItWorksSection />
            <LandingEnvironments />
            <IntegrationsSection />
            <Builder />
          </div>

          {/* <div className="mt-24 space-y-24 px-4 pb-20 sm:px-6 lg:px-10 xl:px-14">
            <section id="cofounder" className="scroll-mt-32">...</section>
            <section id="use-cases" className="scroll-mt-32">...</section>
            <section id="product" className="scroll-mt-32">...</section>
            <section id="agents" className="scroll-mt-32">...</section>
            <section id="results" className="scroll-mt-32">...</section>
          </div> */}

          <PricingSection />
          <BlogSection />
          <JoinUsSection />

        </div>
      </div>
    </main>
  );
}
