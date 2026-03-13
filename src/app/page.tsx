"use client";

import React, { Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import IntroSection from "@/components/IntroSection";
import MobileHowItWorks from "@/components/MobileHowItWorks";
import NavBar from "@/components/NavBar";
import SidebarNav from "@/components/SidebarNav";
import { useHomeScrollSnap } from "@/hooks/useHomeScrollSnap";
import { PageTransition } from "@/components/PageTransition";


// Lazy-load below-fold sections
const BuilderTabbed = dynamic(() => import("@/components/BuilderTabbed"), { ssr: false });
const ContractsSection = dynamic(() => import("@/components/ContractsSection"), { ssr: false });
const LandingRegistry = dynamic(() => import("@/components/LandingRegistry"), { ssr: false });
const JoinUsSection = dynamic(() => import("@/components/JoinUsSection"), { ssr: false });
const GetAccessSection = dynamic(() => import("@/components/GetAccessSection"), { ssr: false });

function SectionDivider({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div className="w-full" style={{
      background: `linear-gradient(to bottom, ${fromColor} 0%, ${fromColor} 50%, ${toColor} 50%, ${toColor} 100%)`,
      paddingTop: '8px',
      paddingBottom: '8px'
    }}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300/40"></div>
        </div>
        <div className="relative px-4">
          <div className="w-2 h-2 rounded-full bg-sena-blue/20"></div>
        </div>
      </div>
    </div>
  );
}

// Wrapper component to handle searchParams with Suspense
function HomeContent() {
  const searchParams = useSearchParams();
  const introRef = useRef<HTMLDivElement>(null);
  const registryRef = useRef<HTMLElement>(null);
  const builderRef = useRef<HTMLDivElement>(null);
  const getAccessRef = useRef<HTMLElement>(null);
  const joinUsRef = useRef<HTMLElement>(null);

  const { showNavigation, currentSection } = useHomeScrollSnap({
    introRef,
    registryRef,
    builderRef,
  });

  const sidebarSections = [
    { id: "intro", label: "Home" },
    { id: "how-it-works", label: "How it works" },
    { id: "builder", label: "AI Agents" },
    { id: "contracts", label: "Contracts" },
    { id: "registry", label: "Registry" },
    { id: "get-access", label: "Log In" },
    { id: "join-us", label: "Join Us" },
  ];

  // Scroll to top on page load/refresh, or skip intro if section param is present
  useEffect(() => {
    const section = searchParams.get('section');
    const hasToken = searchParams.has('token') || searchParams.has('platform_token');
    if (section === 'how-it-works' || hasToken) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('triggerIntroSequence'));
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [searchParams]);

  return (
    <PageTransition>
    <main className="relative text-sena-text-primary">
      {/* Base background color layer - at the very back */}
      <div
        className="fixed inset-0"
        style={{ zIndex: -2, backgroundColor: '#F5F1E8' }}
      />
      {/* Fixed NavBar at top - only show when not on home */}
      {showNavigation && (
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] transition-opacity duration-500"
          style={{
            width: "min(640px, 90vw)",
            opacity: showNavigation ? 1 : 0,
          }}
        >
          <NavBar
            showHowItWorks={currentSection === 'how-it-works'}
            showBuilder={currentSection === 'builder'}
            showContracts={currentSection === 'contracts'}
            showRegistry={currentSection === 'registry'}
            showJoinUs={currentSection === 'join-us'}
          />
        </div>
      )}

      {/* Sidebar - only show when not on home */}
      {showNavigation && (
        <div className="transition-opacity duration-500" style={{ opacity: showNavigation ? 1 : 0 }}>
          <SidebarNav sections={sidebarSections} />
        </div>
      )}

      <div ref={introRef} className="relative" style={{ zIndex: 20 }}>
        <IntroSection />
      </div>

      {/* Mobile How It Works - only shows on mobile */}
      <MobileHowItWorks />

      <SectionDivider fromColor="#F5F1E8" toColor="#EDE7DC" />

      <div className="w-full relative">
        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex-1 flex flex-col relative">
            {/* Builder - Color 2 */}
            <div id="builder" ref={builderRef} style={{ backgroundColor: '#EDE7DC' }}>
              <BuilderTabbed />
            </div>

            <SectionDivider fromColor="#EDE7DC" toColor="#F5F1E8" />

            {/* Contracts - Color 1 */}
            <div style={{ backgroundColor: '#F5F1E8' }}>
              <ContractsSection />
            </div>

            <SectionDivider fromColor="#F5F1E8" toColor="#EDE7DC" />

            {/* Registry - Color 2 */}
            <div id="registry" style={{ backgroundColor: '#EDE7DC' }}>
              <LandingRegistry ref={registryRef} />
            </div>
          </div>

          <SectionDivider fromColor="#EDE7DC" toColor="#F5F1E8" />

          {/* Get Access - Color 1 */}
          <div style={{ backgroundColor: '#F5F1E8' }}>
            <GetAccessSection ref={getAccessRef} />
          </div>

          <SectionDivider fromColor="#F5F1E8" toColor="#EDE7DC" />

          {/* Join Us - Color 2 */}
          <div id="join-us" style={{ backgroundColor: '#EDE7DC' }}>
            <JoinUsSection ref={joinUsRef} />
          </div>
        </div>
      </div>

      {/* ====== BACKGROUND TEXTURES - Rendered LAST to ensure they appear on top ====== */}

      {/* Grid pattern - subtle background grid (above section bg, below cards) */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5, opacity: 0.04 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120, 100, 80, 0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120, 100, 80, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating orbs layer - soft color washes */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 10, opacity: 0.35 }}
      >
        {/* Moving gradient orbs */}
        <div
          className="absolute rounded-full"
          style={{
            width: '900px',
            height: '900px',
            background: 'radial-gradient(circle, rgba(143, 183, 197, 0.5) 0%, transparent 60%)',
            top: '-10%',
            left: '-15%',
            filter: 'blur(120px)',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '1000px',
            height: '1000px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 60%)',
            top: '25%',
            right: '-20%',
            filter: 'blur(120px)',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 60%)',
            bottom: '10%',
            left: '0%',
            filter: 'blur(120px)',
            animation: 'float3 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '850px',
            height: '850px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 60%)',
            bottom: '30%',
            right: '-5%',
            filter: 'blur(120px)',
            animation: 'float1 22s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Noise grain overlay - subtle texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 15, opacity: 0.08 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* CSS Keyframes for floating animation */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, -50px) scale(1.05); }
          50% { transform: translate(-50px, 60px) scale(0.95); }
          75% { transform: translate(50px, 50px) scale(1.02); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 50px) scale(1.05); }
          66% { transform: translate(60px, -60px) scale(0.95); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(55px, -55px) scale(1.08); }
        }
      `}</style>
    </main>
    </PageTransition>
  );
}

// Default export wraps HomeContent in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-sena-cream">
        <Image src="/sena-logo-pinwheel.png" alt="" width={48} height={48} style={{ animation: "spin 3s linear infinite" }} />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
