"use client";

import { useRef, useEffect } from "react";
import type { ExpandedCard } from "@/hooks/useIntroScrollAnimation";

type IntroCardDetailProps = {
  expandedCard: ExpandedCard;
  borderRadius: number;
};

export default function IntroCardDetail({ expandedCard, borderRadius }: IntroCardDetailProps) {
  const detailScrollRef = useRef<HTMLDivElement | null>(null);

  // Stop wheel/touch propagation so parent scroll doesn't interfere
  useEffect(() => {
    const detailScroll = detailScrollRef.current;
    if (!detailScroll || !expandedCard) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = detailScroll;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
    };

    detailScroll.addEventListener('wheel', handleWheel, { passive: false });
    detailScroll.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      detailScroll.removeEventListener('wheel', handleWheel);
      detailScroll.removeEventListener('touchmove', handleTouchMove);
    };
  }, [expandedCard]);

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflow: 'hidden',
        marginLeft: expandedCard === 'right' ? 0 : '-2px',
        marginRight: expandedCard === 'right' ? '-2px' : 0,
        borderTopLeftRadius: expandedCard === 'right' ? `${borderRadius}px` : 0,
        borderBottomLeftRadius: expandedCard === 'right' ? `${borderRadius}px` : 0,
        borderTopRightRadius: expandedCard === 'right' ? 0 : `${borderRadius}px`,
        borderBottomRightRadius: expandedCard === 'right' ? 0 : `${borderRadius}px`,
        background: 'rgba(252, 249, 243, 0.95)',
        border: '2px solid #9CA3AF',
        borderLeft: expandedCard === 'right' ? '2px solid #9CA3AF' : 'none',
        borderRight: expandedCard === 'right' ? 'none' : '2px solid #9CA3AF',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        order: expandedCard === 'right' ? -1 : 1,
      }}
    >
      <div
        ref={detailScrollRef}
        className="detail-scroll-container"
        style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 28px',
          paddingRight: '20px',
        }}
      >
        <style jsx>{`
          .detail-scroll-container {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          }
          .detail-scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          .detail-scroll-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .detail-scroll-container::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.4);
            border-radius: 3px;
          }
          .detail-scroll-container::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.6);
          }
        `}</style>

        {expandedCard === "left" && (
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: '40px', height: '40px', background: '#F5F1E8', border: '2px solid #9CA3AF' }}
              >
                <span className="font-bold text-lg" style={{ color: '#4682A0' }}>1</span>
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#4682A0' }}>
                Build
              </h2>
            </div>
            <p className="text-gray-700 mb-5 leading-relaxed text-base">
              Everything you need to build AI agents, all in one place. No coding, no consultants, no months of waiting. Go completely hands-off or take infinite control. Four ways to get started, whether you&apos;re building for your company, a client, or yourself.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
                  title: "Registry",
                  desc: "Browse and install from a library of ready-made components. Agents, tools, skills, triggers, and more. Pick what fits, install it, and you're running.",
                  bullets: ["Hundreds of pre-built components", "Install with one click", "Composable building blocks you can customize"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />,
                  title: "Discovery",
                  desc: "Tell Sena what you need in your own words. The Discovery Agent interviews you, understands your requirements, and generates a full build plan automatically.",
                  bullets: ["Voice and text in 50+ languages", "Captures your intent through intelligent questioning", "Generates a complete build plan for approval"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                  title: "Express",
                  desc: "The closest thing to vibe coding for your business. Talk to Express and watch changes happen in real time, live in production. No build plans, no waiting. Just describe what you want and see it come to life.",
                  bullets: ["Real-time changes in production as you talk", "From conversation to working agent in minutes"],
                },
                {
                  icon: (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  ),
                  title: "Configurations",
                  desc: "Full manual control for power users. Wire every component yourself with a visual graph builder, edit code directly, and connect to GitHub for version control.",
                  bullets: ["Visual graph builder for agent networks", "Direct code access with GitHub integration", "Control every tool, skill, trigger, and model"],
                },
              ].map(({ icon, title, desc, bullets }) => (
                <div key={title} className="rounded-2xl p-4 border-2" style={{ background: 'rgba(70, 130, 160, 0.08)', borderColor: 'rgba(70, 130, 160, 0.2)' }}>
                  <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#4682A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                    {title}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{desc}</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-[#4682A0] mt-0.5">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedCard === "center" && (
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: '40px', height: '40px', background: '#F5F1E8', border: '2px solid #9CA3AF' }}
              >
                <span className="font-bold text-lg" style={{ color: '#826496' }}>2</span>
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#826496' }}>
                Run
              </h2>
            </div>
            <p className="text-gray-700 mb-5 leading-relaxed text-base">
              Not demos. Agents that handle economically useful workloads inside your ERP. Real documents, real tasks, real coordination. Multiple agents working together across your business, with full control over what they can and can&apos;t do.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
                  title: "Tasks",
                  desc: "Agents delegate work to each other through a structured task system. One agent can assign work to another, track progress, and report back. Complex workflows happen automatically.",
                  bullets: ["Structured delegation between agents", "Progress tracking and status reporting", "Multi-step workflows without manual intervention"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                  title: "Approvals",
                  desc: "Human oversight exactly where you want it. Set approval gates on any action so agents pause and ask before proceeding. Full control over autonomy levels.",
                  bullets: ["Per-tool and per-agent approval settings", "Agents pause and ask when it matters", "Adjust autonomy as trust builds"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                  title: "Triggers",
                  desc: "Agents wake up on their own. Scheduled jobs, document events, inbound messages, or manual requests. Your agents respond to what's happening in your business in real time.",
                  bullets: ["Scheduled runs on any cron pattern", "Document events trigger agent responses", "Inbound channels like WhatsApp and email"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
                  title: "Routing",
                  desc: "One conversation surface that understands what you need and routes to the right agent automatically. You never need to know which agent does what. Just talk and Sena figures it out.",
                  bullets: ["Automatic agent discovery and selection", "Parallel delegation to multiple agents", "Results consolidated into one conversation"],
                },
                {
                  icon: (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  ),
                  title: "Observability",
                  desc: "Every action your agents take is logged and traceable. See what happened, why it happened, and what the agent was thinking. Full audit trail for every decision.",
                  bullets: ["Complete activity log for every agent", "Token usage and model performance tracking", "Full audit trail for compliance"],
                },
              ].map(({ icon, title, desc, bullets }) => (
                <div key={title} className="rounded-2xl p-4 border-2" style={{ background: 'rgba(130, 100, 150, 0.08)', borderColor: 'rgba(130, 100, 150, 0.2)' }}>
                  <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#826496]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                    {title}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{desc}</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-[#826496] mt-0.5">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {expandedCard === "right" && (
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: '40px', height: '40px', background: '#F5F1E8', border: '2px solid #9CA3AF' }}
              >
                <span className="font-bold text-lg" style={{ color: '#B4646E' }}>3</span>
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#B4646E' }}>
                Share
              </h2>
            </div>
            <p className="text-gray-700 mb-5 leading-relaxed text-base">
              A growing community built around the Registry. Every agent, tool, and skill is stored as a granular building block. Mix them to create something entirely new, or make small customizations on what already exists. Build once, and let others build on top of your work.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
                  title: "Community",
                  desc: "A developer and builder community growing around Sena. Share what you build, learn from others, and collaborate on agent ecosystems that solve real problems.",
                  bullets: ["Open ecosystem of builders and creators", "Shared knowledge and patterns", "Collaborative improvement over time"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />,
                  title: "Composable",
                  desc: "Nothing is monolithic. Every component is stored at the smallest useful level. Take a tool from one agent, a skill from another, wire them with your own logic. Granular building blocks that snap together into infinite combinations.",
                  bullets: ["Components stored at the smallest useful level", "Mix and match from different agents", "Infinite combinations from a shared library"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                  title: "Monetization",
                  desc: "Every component you publish to the Registry is yours. When others install your agent, tool, or skill, you earn from it. Build quality, get rewarded.",
                  bullets: ["Earn from every install of your work", "Ownership tracked at the component level", "Revenue grows with the community"],
                },
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                  title: "Outcome as a Service",
                  desc: "A new billing model. Instead of charging for seats or API calls, charge based on contract completion. Deliver outcomes, bill for results.",
                  bullets: ["Bill based on delivered outcomes, not usage", "Contract-based pricing model", "Value-aligned incentives for builders and users"],
                },
              ].map(({ icon, title, desc, bullets }) => (
                <div key={title} className="rounded-2xl p-4 border-2" style={{ background: 'rgba(180, 100, 110, 0.08)', borderColor: 'rgba(180, 100, 110, 0.2)' }}>
                  <h4 className="font-bold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#B4646E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                    {title}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{desc}</p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-[#B4646E] mt-0.5">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
