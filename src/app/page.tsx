"use client";

import React from "react";
import IntroSection from "@/components/IntroSection";
import Builder from "@/components/Builder";
import HowItWorksSection from "@/components/HowItWorksSection";
import LandingEnvironments from "@/components/LandingEnvironments";
import IntegrationsSection from "@/components/IntegrationsSection";
import PricingSection from "@/components/PricingSection";
import BlogSection from "@/components/BlogSection";
import JoinUsSection from "@/components/JoinUsSection";


export default function Home() {
  return (
    <main className="relative bg-waygent-cream text-waygent-text-primary">
      <IntroSection />

      <div className="bg-waygent-cream w-full relative z-1">
        <div className="flex min-h-screen flex-1 flex-col bg-waygent-cream">
          <div className="flex-1 flex flex-col">
            <HowItWorksSection />
            <LandingEnvironments />
            <IntegrationsSection />
            <Builder />
          </div>

          <PricingSection />
          <BlogSection />
          <JoinUsSection />
        </div>
      </div>
    </main>
  );
}
